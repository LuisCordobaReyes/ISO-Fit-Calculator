import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  MATERIALS, MATERIAL_KEYS, FRICTION_PRESETS,
  calculatePressFit, type PressFitResult,
} from "@/lib/press-fit";
import nomadLogo from "@/assets/nomad-logo.png.asset.json";

export const Route = createFileRoute("/press-fit")({
  head: () => ({
    meta: [
      { title: "Press Fit Calculator by DATUM — Interference, Force, Torque" },
      { name: "description", content: "Interference press-fit calculator based on Lamé thick-cylinder equations. Contact pressure, assembly force, torque capacity, hoop stress, and shrink-fit temperatures." },
      { property: "og:title", content: "Press Fit Calculator by DATUM" },
      { property: "og:description", content: "Contact pressure, force, torque, and stress for shaft-hub interference fits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PressFitPage,
});

const HAIRLINE = "border-t border-[rgba(225,225,225,0.3)]";
const LABEL = "font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)]";
const HEADER = "font-sans font-semibold tracking-[0.1em] uppercase";

function fmt(v: number, digits = 2) {
  if (!isFinite(v)) return "—";
  if (Math.abs(v) >= 10000) return v.toExponential(2);
  return v.toFixed(digits);
}

function PressFitPage() {
  const [d, setD] = useState("25");
  const [D, setDOuter] = useState("50");
  const [di, setDi] = useState("0");
  const [L, setL] = useState("30");
  const [interference, setInterference] = useState("0.025");
  const [shaftKey, setShaftKey] = useState<string>("Steel (AISI 1018)");
  const [hubKey, setHubKey] = useState<string>("Steel (AISI 1018)");
  const [frictionKey, setFrictionKey] = useState<string>("Steel on Steel (dry)");
  const [muCustom, setMuCustom] = useState("0.12");
  const [ambient, setAmbient] = useState("20");

  const mu = frictionKey === "Custom" ? parseFloat(muCustom) : FRICTION_PRESETS[frictionKey];

  const computed = useMemo(() => {
    const inp = {
      d: parseFloat(d),
      D: parseFloat(D),
      di: parseFloat(di),
      L: parseFloat(L),
      interference: parseFloat(interference),
      mu,
      shaft: MATERIALS[shaftKey],
      hub: MATERIALS[hubKey],
      ambientC: parseFloat(ambient),
    };
    for (const v of [inp.d, inp.D, inp.di, inp.L, inp.interference, inp.mu, inp.ambientC]) {
      if (!isFinite(v)) return { result: null as PressFitResult | null, error: "Enter valid numbers to begin." };
    }
    const out = calculatePressFit(inp);
    if ("error" in out) return { result: null as PressFitResult | null, error: out.error };
    return { result: out, error: null as string | null };
  }, [d, D, di, L, interference, mu, shaftKey, hubKey, ambient]);

  const { result, error } = computed;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top bar */}
      <header className="border-b border-[rgba(225,225,225,0.3)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={nomadLogo.url} alt="Nomad Industries" className="h-8 w-8 object-contain" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase">DATUM</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.8)] hover:text-[#D2042D]">ISO FIT</Link>
            <Link to="/press-fit" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#D2042D]">PRESS FIT</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-12 sm:pt-24 sm:pb-20">
        <h1 className="font-sans font-bold tracking-[0.05em] uppercase text-[52px] leading-[0.95] sm:text-[110px]">
          PRESS FIT
        </h1>
        <p className={`${HEADER} mt-6 text-sm sm:text-base text-[rgba(225,225,225,0.85)]`}>
          INTERFERENCE FIT CALCULATOR — CONTACT PRESSURE, FORCE, TORQUE, STRESS.
        </p>
        <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-[rgba(225,225,225,0.7)]">
          Enter shaft and hub geometry, pick materials, set your interference.
          Get contact pressure, assembly force, torque capacity, hoop stress, and shrink-fit
          heating/cooling temperatures — solved with Lamé thick-cylinder equations.
        </p>
      </section>

      <div className={HAIRLINE} />

      {/* Calculator */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <h2 className={`${HEADER} text-xs mb-10 text-[rgba(225,225,225,0.6)]`}>01 / INPUTS</h2>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-16">
          <div className="space-y-8">
            <div className={LABEL}>GEOMETRY</div>
            <NumField label="INTERFACE DIAMETER d (mm)" value={d} onChange={setD} />
            <NumField label="HUB OUTER DIAMETER D (mm)" value={D} onChange={setDOuter} />
            <NumField label="SHAFT INNER DIAMETER di (mm) — 0 IF SOLID" value={di} onChange={setDi} />
            <NumField label="ENGAGEMENT LENGTH L (mm)" value={L} onChange={setL} />
            <NumField label="DIAMETRAL INTERFERENCE δ (mm)" value={interference} onChange={setInterference} />
          </div>

          <div className="space-y-8">
            <div className={LABEL}>MATERIALS &amp; INTERFACE</div>
            <Field label="SHAFT MATERIAL">
              <SelectRow value={shaftKey} onChange={setShaftKey} options={MATERIAL_KEYS} />
            </Field>
            <Field label="HUB MATERIAL">
              <SelectRow value={hubKey} onChange={setHubKey} options={MATERIAL_KEYS} />
            </Field>
            <Field label="COEFFICIENT OF FRICTION μ">
              <SelectRow value={frictionKey} onChange={setFrictionKey} options={Object.keys(FRICTION_PRESETS)} />
              {frictionKey === "Custom" && (
                <input
                  type="number" step="0.01" value={muCustom} onChange={(e) => setMuCustom(e.target.value)}
                  className="mt-3 w-full bg-transparent border-b border-[rgba(225,225,225,0.3)] py-2 font-mono text-lg outline-none focus:border-[#E1E1E1]"
                />
              )}
              <div className="mt-2 font-mono text-[10px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.5)]">
                μ = {isFinite(mu) ? mu.toFixed(3) : "—"}
              </div>
            </Field>
            <NumField label="AMBIENT TEMPERATURE (°C)" value={ambient} onChange={setAmbient} />
          </div>
        </div>

        <p className="mt-10 font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(225,225,225,0.45)]">
          LAMÉ THICK-CYLINDER SOLUTION. VERIFY AGAINST YIELD CRITERIA AND EXPERIMENTAL DATA BEFORE PRODUCTION USE.
        </p>
      </section>

      {/* Results */}
      <div className={HAIRLINE} />
      <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <h2 className={`${HEADER} text-xs mb-10 text-[rgba(225,225,225,0.6)]`}>02 / RESULTS</h2>

        {error && (
          <p className="font-mono text-sm text-[rgba(225,225,225,0.6)]">{error}</p>
        )}

        {result && (
          <>
            {/* Primary results */}
            <div className="grid grid-cols-1 sm:grid-cols-3 border border-[rgba(225,225,225,0.3)]">
              <BigStat label="CONTACT PRESSURE" value={fmt(result.pressure, 1)} unit="MPa" accent />
              <BigStat label="ASSEMBLY / PULL-OUT FORCE" value={fmt(result.assemblyForce / 1000, 2)} unit="kN" accent />
              <BigStat label="TORQUE CAPACITY" value={fmt(result.torqueCapacity, 2)} unit="N·m" accent last />
            </div>

            {/* Detail rows */}
            <div className="mt-10 divide-y divide-[rgba(225,225,225,0.3)]">
              <ResultRow label="RADIAL INTERFERENCE" value={`${fmt(result.radialInterference, 4)} mm`} />
              <ResultRow label="HUB BORE HOOP STRESS (TENSILE)" value={`${fmt(result.hubHoopStress, 1)} MPa`} />
              <ResultRow label="HUB VON MISES STRESS" value={`${fmt(result.hubVonMises, 1)} MPa`} />
              <ResultRow label="HUB SAFETY FACTOR (YIELD)" value={fmt(result.hubSafetyFactor, 2)} />
              <ResultRow label="SHAFT SURFACE HOOP STRESS" value={`${fmt(result.shaftHoopStress, 1)} MPa`} />
              <ResultRow label="SHAFT VON MISES STRESS" value={`${fmt(result.shaftVonMises, 1)} MPa`} />
              <ResultRow label="SHAFT SAFETY FACTOR (YIELD)" value={fmt(result.shaftSafetyFactor, 2)} />
              <ResultRow label="HUB BORE EXPANSION (DIAMETRAL)" value={`${fmt(result.hubDeltaOD, 4)} mm`} />
              <ResultRow label="SHAFT DIAMETRAL CONTRACTION" value={`${fmt(result.shaftDeltaID, 4)} mm`} />
              <ResultRow label="HUB HEATING ΔT FOR SLIP FIT" value={`+${fmt(result.heatingTempRise, 0)} °C`} />
              <ResultRow label="SHAFT COOLING ΔT FOR SLIP FIT" value={`−${fmt(result.coolingTempDrop, 0)} °C`} />
            </div>

            {result.warnings.length > 0 && (
              <div className="mt-10 border border-[#D2042D] p-6">
                <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#D2042D] mb-3">
                  WARNINGS
                </div>
                <ul className="space-y-2">
                  {result.warnings.map((w, i) => (
                    <li key={i} className="text-sm text-[rgba(225,225,225,0.85)] leading-relaxed">— {w}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Formula reference */}
            <div className="mt-16">
              <div className={LABEL}>FORMULAS USED</div>
              <div className="mt-4 font-mono text-xs sm:text-sm leading-relaxed text-[rgba(225,225,225,0.75)] space-y-2">
                <div>p = δ / ( d · [ ((D²+d²)/(D²−d²) + ν_h)/E_h + ((d²+di²)/(d²−di²) − ν_s)/E_s ] )</div>
                <div>F_assembly = μ · p · π · d · L</div>
                <div>T_capacity = μ · p · π · d² · L / 2</div>
                <div>σ_hoop,hub = p · (D²+d²)/(D²−d²)</div>
                <div>ΔT = (δ + slip clearance) / (α · d)</div>
              </div>
            </div>
          </>
        )}
      </section>

      {/* Footer */}
      <div className={HAIRLINE} />
      <footer className="border-t border-[rgba(225,225,225,0.3)]">
        <div className="mx-auto max-w-5xl px-5 py-6 grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)] truncate">
            DATUM — ENGINEERING FROM THE FACTORY FLOOR
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)] shrink-0">
            © 2026 CORDOBA INDUSTRIES
          </span>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className={LABEL}>{label}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function NumField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <input
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[rgba(225,225,225,0.3)] py-3 font-mono text-2xl outline-none focus:border-[#E1E1E1]"
      />
    </Field>
  );
}

function SelectRow({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent border-b border-[rgba(225,225,225,0.3)] py-3 pr-8 font-mono text-base sm:text-lg uppercase tracking-[0.1em] outline-none focus:border-[#E1E1E1] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#1E1E1E] text-[#E1E1E1]">{o}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-mono text-sm text-[rgba(225,225,225,0.6)]">▾</span>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-5 grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-baseline">
      <div className={LABEL}>{label}</div>
      <div className="font-mono text-base sm:text-lg shrink-0">{value}</div>
    </div>
  );
}

function BigStat({ label, value, unit, accent, last }: { label: string; value: string; unit: string; accent?: boolean; last?: boolean }) {
  return (
    <div className={`p-6 sm:p-8 ${last ? "" : "border-b sm:border-b-0 sm:border-r border-[rgba(225,225,225,0.3)]"}`}>
      <div className={LABEL}>{label}</div>
      <div className={`mt-3 font-mono font-semibold text-3xl sm:text-4xl ${accent ? "text-[#D2042D]" : ""}`}>
        {value}
      </div>
      <div className="mt-1 font-mono text-xs tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)]">{unit}</div>
    </div>
  );
}
