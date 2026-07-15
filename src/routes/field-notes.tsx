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

const NOTES: Note[] = [];

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
