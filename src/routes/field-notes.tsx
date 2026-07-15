import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import nomadLogo from "@/assets/nomad-logo.png.asset.json";

export const Route = createFileRoute("/field-notes")({
  head: () => ({
    meta: [
      { title: "Field Notes by DATUM — Shop-Floor Engineering Notes" },
      { name: "description", content: "Field notes from the shop floor: tolerances, fits, fixturing, and lessons learned in production machining." },
      { property: "og:title", content: "Field Notes by DATUM" },
      { property: "og:description", content: "Shop-floor engineering notes on tolerances, fits, and manufacturing." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: FieldNotesPage,
});

const HAIRLINE = "border-t border-[rgba(225,225,225,0.3)]";
const LABEL = "font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)]";
const HEADER = "font-sans font-semibold tracking-[0.1em] uppercase";

type Note = {
  id: string;
  date: string; // ISO
  category: "TOLERANCES" | "PRESS FITS" | "MATERIALS" | "FIXTURING" | "PROCESS";
  title: string;
  readTime: string;
  excerpt: string;
  body: string[];
};

const NOTES: Note[] = [
  {
    id: "n008",
    date: "2026-07-10",
    category: "PRESS FITS",
    title: "Why your press fit walked out at 80°C",
    readTime: "4 min",
    excerpt:
      "Thermal growth eats interference. If the hub grows faster than the shaft, the joint loses contact pressure before you notice torque slip.",
    body: [
      "A steel shaft in an aluminum hub is the classic offender. Aluminum's coefficient of thermal expansion is roughly 23 × 10⁻⁶ /°C — nearly double steel's 11.5 × 10⁻⁶ /°C. Heat the assembly and the hub bore grows faster than the shaft OD, so effective interference drops linearly with temperature.",
      "Rule of thumb: for every 10°C over ambient, subtract about 0.00012 mm of interference per mm of nominal diameter for a steel/aluminum pair. On a Ø25 joint at 80°C above ambient, that's ~0.024 mm gone — often the entire design interference.",
      "Fix: match materials where possible, or spec interference at operating temperature and verify with the Lamé equations at both ends of the thermal range.",
    ],
  },
  {
    id: "n007",
    date: "2026-06-28",
    category: "TOLERANCES",
    title: "H7/g6 vs H7/h6 — pick the right sliding fit",
    readTime: "3 min",
    excerpt:
      "Both are 'clearance,' but they behave differently under load, lube, and thermal cycling. H7/g6 is not a drop-in replacement for H7/h6.",
    body: [
      "H7/h6 gives you zero-to-small clearance — a locational fit that assembles by hand but transmits no axial load. Good for dowels, alignment pins, and features that need to stay concentric.",
      "H7/g6 opens the shaft by roughly one IT grade below nominal, giving 9–50 µm of clearance in the 18–50 mm band. This is the fit you want for rotating shafts with lube — bearings, bushings, guide rods. It tolerates thermal growth and gives room for an oil film.",
      "If you're seeing galling on an H7/h6 slip fit, don't tighten the tolerance — loosen the shaft to g6 and add lubrication.",
    ],
  },
  {
    id: "n006",
    date: "2026-06-14",
    category: "PROCESS",
    title: "Chasing tenths on a machine that holds thou",
    readTime: "5 min",
    excerpt:
      "Repeatability, not resolution, is what limits you. A 0.0001\" scale on a 0.0005\" spindle is decoration.",
    body: [
      "Machine capability is the RMS sum of spindle runout, thermal drift, tool deflection, and workholding repeatability. Your linear scales resolve one number in that stack.",
      "Before tightening a print, measure the process: cut 30 identical parts, log CMM data, calculate Cpk. If Cpk < 1.33 on your current tolerance, no amount of feature-level scrutiny will make the next tolerance band achievable on that machine.",
      "The cheapest capability upgrade is usually thermal — soak the machine, coolant-through the spindle, and cut in the same shift you probed. The next cheapest is fixturing.",
    ],
  },
  {
    id: "n005",
    date: "2026-05-30",
    category: "MATERIALS",
    title: "17-4 PH H900 is not a drop-in for 4140",
    readTime: "4 min",
    excerpt:
      "Yield strength is similar. Machinability, thermal expansion, and magnetic response are not. Substitutions bite downstream.",
    body: [
      "17-4 PH condition H900 lands around 1170 MPa yield — comparable to 4140 quenched-and-tempered. Engineers substitute for corrosion resistance and stop there.",
      "Problems: 17-4 work-hardens under a dull tool, its thermal conductivity is ~1/3 of 4140, and it's ferromagnetic in H900 (annealed A condition is not, which trips up sensor applications). Threaded joints galling on assembly is a common tell.",
      "If you're substituting, re-run heat treat spec, adjust feed/speed for the reduced thermal conductivity, and verify magnetic requirements with the metallurgist before the first cut.",
    ],
  },
  {
    id: "n004",
    date: "2026-05-12",
    category: "FIXTURING",
    title: "The 3-2-1 rule still wins",
    readTime: "3 min",
    excerpt:
      "Six points constrain a rigid body. Adding a seventh adds stress, not stiffness. Datum schemes that ignore this fight themselves.",
    body: [
      "Primary datum: 3 points on the largest flat surface. Secondary: 2 points on the next-longest orthogonal face. Tertiary: 1 point on the remaining orthogonal face. That's it — the part is fully constrained without over-defining.",
      "When you add a fourth locator on the primary — a 'just in case' pad — you've created a stress path. If the part isn't perfectly flat (it isn't), the fixture forces it flat and your dimensions drift with fixture clamping load.",
      "If a part is too floppy for 3-2-1, add supports, not locators. Supports can retract or float; locators cannot.",
    ],
  },
  {
    id: "n003",
    date: "2026-04-22",
    category: "TOLERANCES",
    title: "The IT-grade rule of five",
    readTime: "2 min",
    excerpt:
      "Every step down in IT grade roughly halves the tolerance and doubles the cost. Know where you are on the curve before you tighten a callout.",
    body: [
      "IT7 to IT6 is one grade — about 1.6× tighter tolerance, and typically 30–50% more machining cost (finer tools, extra passes, better inspection). IT6 to IT5 is another 1.6× tighter and usually requires grinding.",
      "By IT4 you're in lapping / honing territory and unit cost jumps 3–10×. IT3 and below are effectively lab-grade.",
      "Design rule: start every dimension at IT9 or IT10. Tighten only the features that mate, seal, or locate — and document why. A print full of IT6 callouts is a print no one reads.",
    ],
  },
  {
    id: "n002",
    date: "2026-04-05",
    category: "PRESS FITS",
    title: "Torque capacity is a friction problem",
    readTime: "3 min",
    excerpt:
      "The Lamé equations give you contact pressure. Friction gives you torque. Guess the coefficient and you guess the joint.",
    body: [
      "Torque capacity T = μ · p · A · r, where p is contact pressure from interference, A is contact area, and r is the radius. Contact pressure is deterministic; μ is not.",
      "Steel-on-steel dry is often quoted at 0.15, but published values range from 0.10 to 0.20 depending on surface finish, oxidation, and assembly method. Oil drops it to ~0.08. A shrink-fit joint assembled with clean, roughened surfaces can reach 0.25.",
      "Design to the low end of the μ range for capacity, and to the high end for assembly force. Same joint, two different friction assumptions — that's not sloppy, that's honest.",
    ],
  },
  {
    id: "n001",
    date: "2026-03-18",
    category: "PROCESS",
    title: "First-article inspection is a design review",
    readTime: "3 min",
    excerpt:
      "FAI catches print errors, not just process errors. Treat the first-off as a chance to fix the drawing, not just the setup.",
    body: [
      "Half the FAI failures we see aren't process capability problems — they're prints with GD&T that doesn't close, missing datums, or tolerances stacked so tight that no realistic process could hold them.",
      "Sit with the machinist during first-off. If they're arguing with the drawing, the drawing is wrong. Fix it before you write a nonconformance.",
      "The best design reviews happen at the machine, not in the CAD seat.",
    ],
  },
];

const CATEGORIES = ["ALL", "TOLERANCES", "PRESS FITS", "MATERIALS", "FIXTURING", "PROCESS"] as const;

function FieldNotesPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("ALL");
  const [openId, setOpenId] = useState<string | null>(null);

  const visible = useMemo(
    () => (category === "ALL" ? NOTES : NOTES.filter((n) => n.category === category)),
    [category],
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top bar */}
      <header className="border-b border-[rgba(225,225,225,0.3)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={nomadLogo.url} alt="Nomad Industries" className="h-8 w-8 object-contain" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase">DATUM</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.8)] hover:text-[#D2042D]">ISO FIT</Link>
            <Link to="/press-fit" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.8)] hover:text-[#D2042D]">PRESS FIT</Link>
            <Link to="/shops" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.8)] hover:text-[#D2042D]">SHOP MAP</Link>
            <Link to="/field-notes" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#D2042D]">FIELD NOTES</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-5 pt-16 pb-12 sm:pt-24 sm:pb-16">
        <h1 className="font-sans font-bold tracking-[0.05em] uppercase text-[54px] leading-[0.95] sm:text-[120px]">
          FIELD NOTES
        </h1>
        <p className={`${HEADER} mt-6 text-sm sm:text-base text-[rgba(225,225,225,0.85)] max-w-2xl`}>
          NOTES FROM THE SHOP FLOOR — TOLERANCES, FITS, AND THE THINGS YOU ONLY LEARN BY MAKING PARTS.
        </p>
      </section>

      <div className={HAIRLINE} />

      {/* Filters */}
      <section className="mx-auto max-w-5xl px-5 py-8">
        <div className={`${LABEL} mb-4`}>FILTER BY CATEGORY</div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = c === category;
            return (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`font-mono text-[11px] tracking-[0.15em] uppercase px-4 py-2 border transition-colors ${
                  active
                    ? "bg-[#E1E1E1] text-[#1E1E1E] border-[#E1E1E1]"
                    : "border-[rgba(225,225,225,0.3)] text-[rgba(225,225,225,0.8)] hover:border-[#D2042D] hover:text-[#D2042D]"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </section>

      <div className={HAIRLINE} />

      {/* Notes list */}
      <section className="mx-auto max-w-5xl px-5 py-8 sm:py-12">
        <h2 className={`${HEADER} text-xs mb-8 text-[rgba(225,225,225,0.6)]`}>
          {String(visible.length).padStart(2, "0")} / ENTRIES
        </h2>
        <ul className="divide-y divide-[rgba(225,225,225,0.3)]">
          {visible.map((n) => {
            const open = openId === n.id;
            return (
              <li key={n.id} className="py-8">
                <button
                  onClick={() => setOpenId(open ? null : n.id)}
                  className="w-full text-left group"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-[120px_minmax(0,1fr)_auto] gap-3 sm:gap-6 items-baseline">
                    <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.5)]">
                      {new Date(n.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "2-digit" }).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#D2042D] mb-2">
                        {n.category}
                      </div>
                      <h3 className="font-sans font-bold tracking-[0.02em] text-xl sm:text-2xl group-hover:text-[#D2042D] transition-colors">
                        {n.title}
                      </h3>
                      <p className="mt-3 text-sm sm:text-base text-[rgba(225,225,225,0.75)] leading-relaxed">
                        {n.excerpt}
                      </p>
                    </div>
                    <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.5)] whitespace-nowrap">
                      {n.readTime} · {open ? "CLOSE −" : "READ +"}
                    </div>
                  </div>
                </button>
                {open && (
                  <div className="mt-6 sm:ml-[144px] max-w-2xl space-y-4">
                    {n.body.map((p, i) => (
                      <p key={i} className="text-sm sm:text-base text-[rgba(225,225,225,0.9)] leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
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
