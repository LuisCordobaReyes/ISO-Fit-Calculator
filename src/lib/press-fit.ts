// Interference / press-fit calculator based on Lamé thick-walled cylinder equations.
// All lengths in mm, pressures/stresses in MPa (N/mm²), forces in N, torque in N·m.
// Reference: Shigley's Mechanical Engineering Design; Fictiv Press-Fit Calculator.

export interface Material {
  name: string;
  E: number;        // Young's modulus, MPa (N/mm²)
  nu: number;       // Poisson's ratio
  yield: number;    // Yield strength (approx.), MPa
  alpha: number;    // Coefficient of thermal expansion, 1/°C
}

export const MATERIALS: Record<string, Material> = {
  "Steel (AISI 1018)":    { name: "Steel (AISI 1018)",    E: 205000, nu: 0.29, yield: 370,  alpha: 11.7e-6 },
  "Steel (AISI 4140)":    { name: "Steel (AISI 4140)",    E: 205000, nu: 0.29, yield: 655,  alpha: 12.3e-6 },
  "Stainless 304":        { name: "Stainless 304",        E: 193000, nu: 0.29, yield: 215,  alpha: 17.3e-6 },
  "Stainless 316":        { name: "Stainless 316",        E: 193000, nu: 0.30, yield: 205,  alpha: 16.0e-6 },
  "Aluminum 6061-T6":     { name: "Aluminum 6061-T6",     E: 68900,  nu: 0.33, yield: 276,  alpha: 23.6e-6 },
  "Aluminum 7075-T6":     { name: "Aluminum 7075-T6",     E: 71700,  nu: 0.33, yield: 503,  alpha: 23.2e-6 },
  "Brass (C360)":         { name: "Brass (C360)",         E: 97000,  nu: 0.34, yield: 310,  alpha: 20.5e-6 },
  "Bronze (C932)":        { name: "Bronze (C932)",        E: 100000, nu: 0.34, yield: 125,  alpha: 18.0e-6 },
  "Cast Iron (Grey)":     { name: "Cast Iron (Grey)",     E: 110000, nu: 0.26, yield: 200,  alpha: 10.4e-6 },
  "Titanium (Ti-6Al-4V)": { name: "Titanium (Ti-6Al-4V)", E: 113800, nu: 0.34, yield: 880,  alpha: 8.6e-6 },
  "Copper (C110)":        { name: "Copper (C110)",        E: 117000, nu: 0.34, yield: 70,   alpha: 17.0e-6 },
};

export const MATERIAL_KEYS = Object.keys(MATERIALS);

// Typical static coefficients of friction for clean, dry press-fit interfaces.
export const FRICTION_PRESETS: Record<string, number> = {
  "Steel on Steel (dry)":     0.12,
  "Steel on Steel (oiled)":   0.08,
  "Steel on Cast Iron":       0.15,
  "Steel on Aluminum":        0.10,
  "Aluminum on Aluminum":     0.15,
  "Steel on Bronze":          0.10,
  "Custom":                   0.12,
};

export interface PressFitInputs {
  d: number;      // nominal (interface) diameter, mm
  D: number;      // hub outer diameter, mm
  di: number;     // shaft inner diameter, mm (0 for solid shaft)
  L: number;      // engagement length, mm
  interference: number; // diametral interference δ, mm (positive = interference)
  mu: number;     // coefficient of friction
  shaft: Material;
  hub: Material;
  ambientC: number; // ambient temperature, °C
}

export interface PressFitResult {
  pressure: number;         // contact pressure, MPa
  radialInterference: number; // δ/2, mm
  assemblyForce: number;    // N (axial force to press together)
  pulloutForce: number;     // N (== assembly force, static)
  torqueCapacity: number;   // N·m
  hubHoopStress: number;    // MPa at hub bore (tangential)
  hubRadialStress: number;  // MPa at hub bore (== -p)
  hubVonMises: number;      // MPa at hub bore
  shaftHoopStress: number;  // MPa at shaft OD (compressive if solid)
  shaftVonMises: number;    // MPa
  hubSafetyFactor: number;  // yield / vonMises
  shaftSafetyFactor: number;
  hubDeltaOD: number;       // radial expansion of hub OD, mm (diametral)
  shaftDeltaID: number;     // radial contraction of shaft, mm (diametral)
  heatingTempRise: number;  // °C to heat hub for slip-fit assembly (with 0.05 mm clearance)
  coolingTempDrop: number;  // °C to cool shaft for slip-fit assembly
  warnings: string[];
}

const SLIP_CLEARANCE_MM = 0.05; // extra clearance target for thermal assembly

export function calculatePressFit(inp: PressFitInputs): PressFitResult | { error: string } {
  const { d, D, di, L, interference, mu, shaft, hub, ambientC } = inp;

  if (!(d > 0) || !(D > d)) return { error: "Hub OD must be greater than interface diameter." };
  if (di < 0 || di >= d)    return { error: "Shaft ID must be between 0 and interface diameter." };
  if (!(L > 0))             return { error: "Engagement length must be positive." };
  if (!(interference > 0))  return { error: "Interference must be positive." };
  if (!(mu > 0))            return { error: "Coefficient of friction must be positive." };

  const Eo = hub.E,  vo = hub.nu;
  const Ei = shaft.E, vi = shaft.nu;

  // Lamé equation solved for contact pressure p, given diametral interference δ:
  //   δ = p·d · { (1/Eo)[(D²+d²)/(D²−d²) + vo]  +  (1/Ei)[(d²+di²)/(d²−di²) − vi] }
  const d2 = d * d, D2 = D * D, di2 = di * di;
  const hubTerm = ((D2 + d2) / (D2 - d2) + vo) / Eo;
  const shaftTerm = di > 0
    ? ((d2 + di2) / (d2 - di2) - vi) / Ei
    : (1 - vi) / Ei;   // solid shaft limit
  const denom = d * (hubTerm + shaftTerm);
  const p = interference / denom; // MPa

  // Forces & torque
  const contactArea = Math.PI * d * L; // mm²
  const assemblyForce = mu * p * contactArea; // N
  const torqueCapacity = (mu * p * contactArea * d) / 2 / 1000; // N·mm → N·m

  // Stresses at the interface (r = d/2)
  const hubHoop = p * (D2 + d2) / (D2 - d2);          // tensile
  const hubRadial = -p;
  const hubVM = Math.sqrt(hubHoop * hubHoop - hubHoop * hubRadial + hubRadial * hubRadial);

  const shaftHoop = di > 0 ? -p * (d2 + di2) / (d2 - di2) : -p; // compressive
  const shaftRadial = -p;
  const shaftVM = Math.sqrt(shaftHoop * shaftHoop - shaftHoop * shaftRadial + shaftRadial * shaftRadial);

  // Deformations (diametral)
  //   Δd_hub  = (p·d/Eo)·[(D²+d²)/(D²−d²) + vo]     (expansion of bore, diametral)
  //   Δd_shaft = (p·d/Ei)·[(d²+di²)/(d²−di²) − vi]  (contraction of shaft OD, diametral)
  const hubDeltaOD = (p * d / Eo) * ((D2 + d2) / (D2 - d2) + vo);
  const shaftDeltaID = di > 0
    ? (p * d / Ei) * ((d2 + di2) / (d2 - di2) - vi)
    : (p * d / Ei) * (1 - vi);

  // Thermal assembly: heat hub or cool shaft to add SLIP_CLEARANCE for easy slip fit.
  const needed = interference + SLIP_CLEARANCE_MM; // diametral expansion required
  const heatingTempRise = needed / (hub.alpha * d);
  const coolingTempDrop = needed / (shaft.alpha * d);

  const warnings: string[] = [];
  if (hubVM > hub.yield) warnings.push(`Hub stress (${hubVM.toFixed(0)} MPa) exceeds yield (${hub.yield} MPa). Yielding will occur.`);
  else if (hubVM > 0.7 * hub.yield) warnings.push(`Hub stress is above 70% of yield. Reduce interference or increase hub OD.`);
  if (shaftVM > shaft.yield) warnings.push(`Shaft stress (${shaftVM.toFixed(0)} MPa) exceeds yield (${shaft.yield} MPa).`);
  if (D / d < 1.5) warnings.push(`Thin hub wall (D/d = ${(D/d).toFixed(2)}). Hoop stress rises rapidly — verify carefully.`);
  if (ambientC < -50 || ambientC > 200) warnings.push(`Ambient temperature outside typical range — verify material properties.`);

  return {
    pressure: p,
    radialInterference: interference / 2,
    assemblyForce,
    pulloutForce: assemblyForce,
    torqueCapacity,
    hubHoopStress: hubHoop,
    hubRadialStress: hubRadial,
    hubVonMises: hubVM,
    shaftHoopStress: shaftHoop,
    shaftVonMises: shaftVM,
    hubSafetyFactor: hub.yield / hubVM,
    shaftSafetyFactor: shaft.yield / shaftVM,
    hubDeltaOD,
    shaftDeltaID,
    heatingTempRise,
    coolingTempDrop,
    warnings,
  };
}
