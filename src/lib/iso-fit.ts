// ISO 286-1 reference tolerance data (microns)
// Diameter ranges (mm), upper bound inclusive
export const RANGES: [number, number][] = [
  [0, 3], [3, 6], [6, 10], [10, 18], [18, 30], [30, 50],
  [50, 80], [80, 120], [120, 180], [180, 250], [250, 315],
  [315, 400], [400, 500],
];

export const RANGE_LABELS = RANGES.map(([a, b]) => `${a}–${b} mm`);

// IT grade values in microns per range
export const IT: Record<string, number[]> = {
  IT6:  [6, 8, 9, 11, 13, 16, 19, 22, 25, 29, 32, 36, 40],
  IT7:  [10, 12, 15, 18, 21, 25, 30, 35, 40, 46, 52, 57, 63],
  IT8:  [14, 18, 22, 27, 33, 39, 46, 54, 63, 72, 81, 89, 97],
  IT9:  [25, 30, 36, 43, 52, 62, 74, 87, 100, 115, 130, 140, 155],
  IT11: [60, 75, 90, 110, 130, 160, 190, 220, 250, 290, 320, 360, 400],
};

// Hole tolerances — all H grades: lower deviation = 0, upper = +IT
export type HoleCode = "H6" | "H7" | "H8" | "H9" | "H11";
export const HOLE_CODES: HoleCode[] = ["H6", "H7", "H8", "H9", "H11"];

// Shaft fundamental deviations (microns).
// `side`: which deviation is the fundamental one (closer to zero line).
// The other is derived using the IT grade.
type ShaftSpec = { grade: keyof typeof IT; side: "upper" | "lower"; fd: number[] };

export type ShaftCode =
  | "e7" | "f7" | "g6" | "h6"
  | "j6" | "k6" | "m6" | "n6"
  | "p6" | "r6" | "s6" | "t6" | "u6";

export const SHAFTS: Record<ShaftCode, ShaftSpec> = {
  e7: { grade: "IT7", side: "upper", fd: [-14,-20,-25,-32,-40,-50,-60,-72,-85,-100,-110,-125,-135] },
  f7: { grade: "IT7", side: "upper", fd: [-6,-10,-13,-16,-20,-25,-30,-36,-43,-50,-56,-62,-68] },
  g6: { grade: "IT6", side: "upper", fd: [-2,-4,-5,-6,-7,-9,-10,-12,-14,-15,-17,-18,-20] },
  h6: { grade: "IT6", side: "upper", fd: [0,0,0,0,0,0,0,0,0,0,0,0,0] },
  j6: { grade: "IT6", side: "lower", fd: [-2,-2,-2,-3,-4,-5,-7,-9,-11,-13,-16,-18,-20] },
  k6: { grade: "IT6", side: "lower", fd: [0,1,1,1,2,2,2,3,3,4,4,4,5] },
  m6: { grade: "IT6", side: "lower", fd: [2,4,6,7,8,9,11,13,15,17,20,21,23] },
  n6: { grade: "IT6", side: "lower", fd: [4,8,10,12,15,17,20,23,27,31,34,37,40] },
  p6: { grade: "IT6", side: "lower", fd: [6,12,15,18,22,26,32,37,43,50,56,62,68] },
  r6: { grade: "IT6", side: "lower", fd: [10,15,19,23,28,34,41,51,63,77,84,98,114] },
  s6: { grade: "IT6", side: "lower", fd: [14,19,23,28,35,43,53,71,92,122,151,189,232] },
  t6: { grade: "IT6", side: "lower", fd: [0,0,0,0,41,48,59,79,104,144,186,228,280] },
  u6: { grade: "IT6", side: "lower", fd: [18,23,28,33,41,60,87,124,170,210,250,300,355] },
};

export type FitType = "Clearance" | "Transition" | "Interference";

export const SHAFTS_BY_FIT: Record<FitType, ShaftCode[]> = {
  Clearance: ["e7", "f7", "g6", "h6"],
  Transition: ["j6", "k6", "m6", "n6"],
  Interference: ["p6", "r6", "s6", "t6", "u6"],
};

export const FIT_DESCRIPTIONS: Record<ShaftCode, { name: string; use: string }> = {
  e7: { name: "LOOSE RUNNING FIT", use: "Wide commercial tolerances or allowances on external members." },
  f7: { name: "CLOSE RUNNING FIT", use: "Running on accurate machines, moderate speeds and pressures." },
  g6: { name: "SLIDING FIT", use: "Parts that move and turn freely with accurate location." },
  h6: { name: "LOCATIONAL CLEARANCE", use: "Stationary parts freely assembled and disassembled." },
  j6: { name: "LOCATIONAL TRANSITION", use: "Accurate location, a compromise between clearance and interference." },
  k6: { name: "LOCATIONAL TRANSITION", use: "Accurate location, slight interference under load." },
  m6: { name: "LOCATIONAL TRANSITION", use: "Accurate location, tighter interference for solid assembly." },
  n6: { name: "LOCATIONAL TRANSITION (TIGHT)", use: "Tight assembly that can be disassembled without damage." },
  p6: { name: "LIGHT PRESS FIT", use: "Steel and bronze parts requiring rigid assembly." },
  r6: { name: "MEDIUM DRIVE FIT", use: "Permanent assembly of medium sections; press fit on iron castings." },
  s6: { name: "HEAVY DRIVE FIT", use: "Permanent assemblies, heavy press fit for steel parts." },
  t6: { name: "FORCE FIT", use: "Heavy shrink fits for steel sections, practical limit reached." },
  u6: { name: "FORCE / SHRINK FIT", use: "Heavy interference, requires high assembly stresses." },
};

export function findRangeIndex(d: number): number {
  if (!isFinite(d) || d <= 0) return -1;
  for (let i = 0; i < RANGES.length; i++) {
    const [lo, hi] = RANGES[i];
    if (d > lo && d <= hi) return i;
    if (i === 0 && d > 0 && d <= hi) return i;
  }
  return -1;
}

export interface FitResult {
  rangeLabel: string;
  holeUpper: number; // mm
  holeLower: number; // mm
  holeUpperUm: number;
  holeLowerUm: number;
  shaftUpper: number;
  shaftLower: number;
  shaftUpperUm: number;
  shaftLowerUm: number;
  maxClearance: number; // mm (positive = clearance, negative = interference)
  minClearance: number;
  classification: string;
  useCase: string;
}

export function calculateFit(
  diameter: number,
  hole: HoleCode,
  shaft: ShaftCode,
): FitResult | { error: string } {
  const idx = findRangeIndex(diameter);
  if (idx < 0) return { error: "Diameter out of supported range (0–500 mm)." };

  const holeGrade = ("IT" + hole.slice(1)) as keyof typeof IT;
  const holeIT = IT[holeGrade][idx];
  const holeUpperUm = holeIT;
  const holeLowerUm = 0;

  const sp = SHAFTS[shaft];
  if (!sp) return { error: "Invalid shaft code." };
  const fd = sp.fd[idx];
  const shaftIT = IT[sp.grade][idx];

  let shaftUpperUm: number, shaftLowerUm: number;
  if (sp.side === "upper") {
    shaftUpperUm = fd;
    shaftLowerUm = fd - shaftIT;
  } else {
    shaftLowerUm = fd;
    shaftUpperUm = fd + shaftIT;
  }

  if (shaft === "t6" && diameter <= 18) {
    return { error: "Shaft t6 is only defined for diameters above 18 mm." };
  }

  const holeUpper = holeUpperUm / 1000;
  const holeLower = holeLowerUm / 1000;
  const shaftUpper = shaftUpperUm / 1000;
  const shaftLower = shaftLowerUm / 1000;

  // Clearance = hole - shaft (positive = clearance, negative = interference)
  const maxClearance = holeUpper - shaftLower;
  const minClearance = holeLower - shaftUpper;

  const info = FIT_DESCRIPTIONS[shaft];

  return {
    rangeLabel: RANGE_LABELS[idx],
    holeUpper, holeLower, holeUpperUm, holeLowerUm,
    shaftUpper, shaftLower, shaftUpperUm, shaftLowerUm,
    maxClearance, minClearance,
    classification: info.name,
    useCase: info.use,
  };
}
