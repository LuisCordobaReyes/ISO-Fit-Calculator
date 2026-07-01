import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import {
  HOLE_CODES, SHAFTS_BY_FIT, calculateFit,
  type FitType, type HoleCode, type ShaftCode, type FitResult,
} from "@/lib/iso-fit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ISO Fit by DATUM — Tolerance and Fit Calculator" },
      { name: "description", content: "ISO 286 tolerance and fit calculator for mechanical engineers. Pick diameter, choose fit, get instant tolerance values." },
      { property: "og:title", content: "ISO Fit by DATUM" },
      { property: "og:description", content: "Tolerance and fit calculator for engineers." },
    ],
  }),
  component: IsoFitPage,
});

const HAIRLINE = "border-t border-[rgba(225,225,225,0.3)]";
const LABEL = "font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)]";
const HEADER = "font-sans font-semibold tracking-[0.1em] uppercase";

function fmtMm(v: number) {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}${Math.abs(v).toFixed(3)} mm`;
}
function fmtUm(v: number) {
  const sign = v >= 0 ? "+" : "−";
  return `${sign}${Math.abs(v)} µm`;
}

function IsoFitPage() {
  const [diameter, setDiameter] = useState<string>("50");
  const [fit, setFit] = useState<FitType>("Clearance");
  const [hole, setHole] = useState<HoleCode>("H7");
  const [shaft, setShaft] = useState<ShaftCode>("g6");
  const resultsRef = useRef<HTMLDivElement>(null);

  const validShafts = useMemo(() => SHAFTS_BY_FIT[fit], [fit]);

  // Live computation — recalculates on every input change.
  const computed = useMemo(() => {
    const d = parseFloat(diameter);
    if (!isFinite(d) || d <= 0) {
      return { result: null as FitResult | null, error: "Enter a nominal diameter to begin." };
    }
    const out = calculateFit(d, hole, shaft);
    if ("error" in out) return { result: null as FitResult | null, error: out.error };
    return { result: out, error: null as string | null };
  }, [diameter, hole, shaft]);

  const { result, error } = computed;

  function onFitChange(f: FitType) {
    setFit(f);
    const opts = SHAFTS_BY_FIT[f];
    if (!opts.includes(shaft)) setShaft(opts[0]);
  }

  function onCalculate() {
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top bar */}
      <header className={`border-b border-[rgba(225,225,225,0.3)]`}>
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <span className="font-mono text-xs tracking-[0.2em] uppercase">DATUM</span>
          <a href="#" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.8)] hover:text-[#D2042D]">
            GET THE FULL GD&amp;T GUIDE →
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-12 sm:pt-24 sm:pb-20">
        <h1 className="font-sans font-bold tracking-[0.05em] uppercase text-[68px] leading-[0.95] sm:text-[140px]">
          ISO FIT
        </h1>
        <p className={`${HEADER} mt-6 text-sm sm:text-base text-[rgba(225,225,225,0.85)]`}>
          TOLERANCE AND FIT CALCULATOR FOR ENGINEERS.
        </p>
        <p className="mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-[rgba(225,225,225,0.7)]">
          Pick your diameter, choose your fit, get instant ISO 286 tolerance values.
          No ads, no signup, no garbage.
        </p>
      </section>

      <div className={HAIRLINE} />

      {/* Calculator */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <h2 className={`${HEADER} text-xs mb-10 text-[rgba(225,225,225,0.6)]`}>
          01 / CALCULATOR
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-12 lg:gap-16">
          <div className="space-y-8">
            <Field label="NOMINAL DIAMETER (MM)">
              <input
                type="number"
                inputMode="decimal"
                step="any"
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-transparent border-b border-[rgba(225,225,225,0.3)] py-3 font-mono text-2xl sm:text-3xl outline-none focus:border-[#E1E1E1] placeholder:text-[rgba(225,225,225,0.25)]"
              />
            </Field>

            <Field label="FIT TYPE">
              <Select
                value={fit}
                onChange={(v) => onFitChange(v as FitType)}
                options={["Clearance", "Transition", "Interference"]}
              />
            </Field>

            <Field label="HOLE TOLERANCE">
              <Select
                value={hole}
                onChange={(v) => setHole(v as HoleCode)}
                options={HOLE_CODES as unknown as string[]}
              />
            </Field>

            <Field label="SHAFT TOLERANCE">
              <Select
                value={shaft}
                onChange={(v) => setShaft(v as ShaftCode)}
                options={validShafts as unknown as string[]}
              />
            </Field>

            <button
              onClick={onCalculate}
              className="w-full bg-[#E1E1E1] text-[#1E1E1E] py-5 font-sans font-semibold tracking-[0.2em] uppercase text-sm hover:bg-[#D2042D] hover:text-[#E1E1E1] transition-colors"
            >
              CALCULATE
            </button>

            <p className="font-mono text-[10px] tracking-[0.1em] uppercase text-[rgba(225,225,225,0.45)]">
              REFERENCE VALUES PER ISO 286-1. VERIFY AGAINST CURRENT STANDARD FOR PRODUCTION USE.
            </p>
          </div>

          {/* Live diagram — updates as inputs change */}
          <div className="lg:sticky lg:top-6 self-start w-full">
            <div className="flex items-center justify-between mb-4">
              <div className={LABEL}>LIVE TOLERANCE BAND · {hole}/{shaft}</div>
              {result && (
                <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[#D2042D]">
                  {result.category}
                </div>
              )}
            </div>
            <div className="border border-[rgba(225,225,225,0.3)] p-4 sm:p-6 min-h-[280px] flex items-center justify-center">
              {result ? (
                <FitDiagram r={result} />
              ) : (
                <p className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.45)] text-center">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <div className={HAIRLINE} />
      <section ref={resultsRef} className="mx-auto max-w-5xl px-5 py-12 sm:py-16">
        <h2 className={`${HEADER} text-xs mb-10 text-[rgba(225,225,225,0.6)]`}>
          02 / RESULTS
        </h2>

        {error && !result && (
          <p className="font-mono text-sm text-[rgba(225,225,225,0.6)]">{error}</p>
        )}

        {result && (
          <div className="divide-y divide-[rgba(225,225,225,0.3)]">
            <ResultRow label="DIAMETER RANGE" value={result.rangeLabel} />
            <ResultBlock label={`HOLE TOLERANCE · ${hole}`}>
              <DevPair upMm={result.holeUpper} loMm={result.holeLower} upUm={result.holeUpperUm} loUm={result.holeLowerUm} />
            </ResultBlock>
            <ResultBlock label={`SHAFT TOLERANCE · ${shaft}`}>
              <DevPair upMm={result.shaftUpper} loMm={result.shaftLower} upUm={result.shaftUpperUm} loUm={result.shaftLowerUm} />
            </ResultBlock>
            <ResultRow
              label={result.maxClearance >= 0 ? "MAXIMUM CLEARANCE" : "MAXIMUM INTERFERENCE"}
              value={fmtMm(result.maxClearance)}
            />
            <ResultRow
              label={result.minClearance >= 0 ? "MINIMUM CLEARANCE" : "MINIMUM INTERFERENCE"}
              value={fmtMm(result.minClearance)}
            />
            <div className="py-6">
              <div className={LABEL}>FIT CLASSIFICATION</div>
              <div className="mt-3 font-sans font-bold tracking-[0.1em] uppercase text-xl sm:text-2xl text-[#D2042D]">
                {result.category} — {result.classification}
              </div>
            </div>
            <div className="py-6">
              <div className={LABEL}>USE CASE</div>
              <p className="mt-3 text-sm sm:text-base text-[rgba(225,225,225,0.85)] leading-relaxed">
                {result.useCase}
              </p>
            </div>
          </div>
        )}
      </section>


      {/* CTA */}
      <div className={HAIRLINE} />
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
        <div className="border border-[rgba(225,225,225,0.3)] p-8 sm:p-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h3 className={`${HEADER} text-xl sm:text-2xl`}>
              ENGINEERS USE DATUM TO LEVEL UP.
            </h3>
            <p className="mt-3 text-sm sm:text-base text-[rgba(225,225,225,0.7)] max-w-xl">
              Get the full GD&amp;T Field Guide — every symbol, every modifier, every use case.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 inline-block bg-[#E1E1E1] text-[#1E1E1E] px-8 py-4 font-sans font-semibold tracking-[0.2em] uppercase text-xs hover:bg-[#D2042D] hover:text-[#E1E1E1] transition-colors"
          >
            GET THE GUIDE →
          </a>
        </div>
      </section>

      {/* Newsletter */}
      <div className={HAIRLINE} />
      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-24">
        <h3 className={`${HEADER} text-lg sm:text-xl`}>
          FREE ENGINEERING REFERENCE NEWSLETTER
        </h3>
        <p className="mt-3 text-sm sm:text-base text-[rgba(225,225,225,0.7)] max-w-xl">
          Manufacturing, CAD, and the stuff you only learn by doing.
        </p>
        <form
          onSubmit={(e) => { e.preventDefault(); window.location.href = "#"; }}
          className="mt-8 grid grid-cols-[minmax(0,1fr)_auto] gap-0 border border-[rgba(225,225,225,0.3)]"
        >
          <input
            type="email"
            required
            placeholder="YOU@SHOPFLOOR.COM"
            className="bg-transparent px-4 py-4 font-mono text-sm tracking-[0.1em] uppercase outline-none placeholder:text-[rgba(225,225,225,0.35)] min-w-0"
          />
          <button
            type="submit"
            className="shrink-0 bg-[#E1E1E1] text-[#1E1E1E] px-6 sm:px-8 py-4 font-sans font-semibold tracking-[0.2em] uppercase text-xs hover:bg-[#D2042D] hover:text-[#E1E1E1] transition-colors"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>

      {/* Footer */}
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

function Select({
  value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none bg-transparent border-b border-[rgba(225,225,225,0.3)] py-3 pr-8 font-mono text-xl sm:text-2xl uppercase tracking-[0.1em] outline-none focus:border-[#E1E1E1] cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o} className="bg-[#1E1E1E] text-[#E1E1E1]">
            {o}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 font-mono text-sm text-[rgba(225,225,225,0.6)]">▾</span>
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="py-6 grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-baseline">
      <div className={LABEL}>{label}</div>
      <div className="font-mono text-lg sm:text-xl shrink-0">{value}</div>
    </div>
  );
}

function ResultBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-6">
      <div className={LABEL}>{label}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function DevPair({ upMm, loMm, upUm, loUm }: { upMm: number; loMm: number; upUm: number; loUm: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
      <div>
        <div className="text-[10px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.5)]">UPPER DEV.</div>
        <div className="text-lg sm:text-xl mt-1">{fmtMm(upMm)}</div>
        <div className="text-xs text-[rgba(225,225,225,0.6)] mt-1">{fmtUm(upUm)}</div>
      </div>
      <div>
        <div className="text-[10px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.5)]">LOWER DEV.</div>
        <div className="text-lg sm:text-xl mt-1">{fmtMm(loMm)}</div>
        <div className="text-xs text-[rgba(225,225,225,0.6)] mt-1">{fmtUm(loUm)}</div>
      </div>
    </div>
  );
}

function FitDiagram({ r }: { r: FitResult }) {
  // Visualize tolerance bands in microns relative to nominal (zero line).
  const values = [r.holeUpperUm, r.holeLowerUm, r.shaftUpperUm, r.shaftLowerUm, 0];
  const maxAbs = Math.max(...values.map((v) => Math.abs(v)), 10);
  const W = 600, H = 280, padX = 60, padY = 40;
  const innerW = W - padX * 2;
  const innerH = H - padY * 2;
  const midY = H / 2;
  const scale = (innerH / 2) / maxAbs;
  const y = (umVal: number) => midY - umVal * scale;

  const holeY1 = y(r.holeUpperUm);
  const holeY2 = y(r.holeLowerUm);
  const shaftY1 = y(r.shaftUpperUm);
  const shaftY2 = y(r.shaftLowerUm);

  const barX = padX + innerW * 0.25;
  const barW = innerW * 0.2;
  const shaftX = padX + innerW * 0.55;

  // Overlap zone (between shaft & hole) for interference highlight
  const overlapTop = Math.max(holeY1, shaftY1); // smaller y is higher; max y = lower point
  const overlapBot = Math.min(holeY2, shaftY2);
  const hasOverlap = r.maxClearance < 0; // interference

  const stroke = "#E1E1E1";
  const muted = "rgba(225,225,225,0.45)";

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* zero / nominal axis */}
      <line x1={padX} y1={midY} x2={W - padX} y2={midY} stroke={stroke} strokeWidth={1} />
      <text x={padX} y={midY - 6} fill={muted} fontFamily="IBM Plex Mono" fontSize="10" letterSpacing="1.5">
        NOMINAL Ø {r.rangeLabel}
      </text>

      {/* Hole band */}
      <rect x={barX} y={Math.min(holeY1, holeY2)} width={barW} height={Math.abs(holeY2 - holeY1)} fill="none" stroke={stroke} strokeWidth={1.5} />
      <text x={barX + barW / 2} y={Math.min(holeY1, holeY2) - 10} fill={stroke} fontFamily="IBM Plex Sans" fontSize="11" fontWeight={600} textAnchor="middle" letterSpacing="1.5">HOLE</text>
      <text x={barX - 8} y={holeY1 + 4} fill={muted} fontFamily="IBM Plex Mono" fontSize="10" textAnchor="end">{r.holeUpperUm >= 0 ? "+" : "−"}{Math.abs(r.holeUpperUm)} µm</text>
      <text x={barX - 8} y={holeY2 + 4} fill={muted} fontFamily="IBM Plex Mono" fontSize="10" textAnchor="end">{r.holeLowerUm >= 0 ? "+" : "−"}{Math.abs(r.holeLowerUm)} µm</text>

      {/* Shaft band */}
      <rect x={shaftX} y={Math.min(shaftY1, shaftY2)} width={barW} height={Math.abs(shaftY2 - shaftY1)} fill="none" stroke={stroke} strokeWidth={1.5} />
      <text x={shaftX + barW / 2} y={Math.max(shaftY1, shaftY2) + 18} fill={stroke} fontFamily="IBM Plex Sans" fontSize="11" fontWeight={600} textAnchor="middle" letterSpacing="1.5">SHAFT</text>
      <text x={shaftX + barW + 8} y={shaftY1 + 4} fill={muted} fontFamily="IBM Plex Mono" fontSize="10">{r.shaftUpperUm >= 0 ? "+" : "−"}{Math.abs(r.shaftUpperUm)} µm</text>
      <text x={shaftX + barW + 8} y={shaftY2 + 4} fill={muted} fontFamily="IBM Plex Mono" fontSize="10">{r.shaftLowerUm >= 0 ? "+" : "−"}{Math.abs(r.shaftLowerUm)} µm</text>

      {/* Clearance / interference indicator between bars */}
      {hasOverlap ? (
        <rect
          x={barX + barW}
          y={overlapTop}
          width={shaftX - (barX + barW)}
          height={Math.max(2, overlapBot - overlapTop)}
          fill="#D2042D"
          opacity={0.85}
        />
      ) : (
        <>
          {/* Gap zone between hole lower and shaft upper */}
          <rect
            x={barX + barW}
            y={Math.min(holeY2, shaftY1)}
            width={shaftX - (barX + barW)}
            height={Math.max(2, Math.abs(holeY2 - shaftY1))}
            fill="#D2042D"
            opacity={0.85}
          />
        </>
      )}
      <text
        x={(barX + barW + shaftX) / 2}
        y={H - 14}
        fill="#D2042D"
        fontFamily="IBM Plex Mono"
        fontSize="11"
        textAnchor="middle"
        letterSpacing="1.5"
      >
        {hasOverlap ? "INTERFERENCE" : "CLEARANCE"} · MAX {fmtMm(r.maxClearance)} / MIN {fmtMm(r.minClearance)}
      </text>
    </svg>
  );
}
