import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  MACHINE_SHOPS,
  CAPABILITY_TAGS,
  CERT_TAGS,
  type MachineShop,
} from "@/lib/machine-shops";
import nomadLogo from "@/assets/nomad-logo.png.asset.json";

export const Route = createFileRoute("/shops")({
  head: () => ({
    meta: [
      { title: "USA Machine Shop Map by DATUM" },
      { name: "description", content: "Interactive map of machine shops across the United States. Filter by capability, material, and certification." },
      { property: "og:title", content: "USA Machine Shop Map by DATUM" },
      { property: "og:description", content: "Find CNC machine shops across the USA by capability and certification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ShopsPage,
});

const HAIRLINE = "border-t border-[rgba(225,225,225,0.3)]";
const LABEL = "font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)]";
const HEADER = "font-sans font-semibold tracking-[0.1em] uppercase";

function ShopsPage() {
  const [q, setQ] = useState("");
  const [capability, setCapability] = useState<string>("All");
  const [cert, setCert] = useState<string>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return MACHINE_SHOPS.filter((s) => {
      if (capability !== "All" && !s.capabilities.includes(capability)) return false;
      if (cert !== "All" && !s.certifications.includes(cert)) return false;
      if (!query) return true;
      return (
        s.name.toLowerCase().includes(query) ||
        s.city.toLowerCase().includes(query) ||
        s.state.toLowerCase().includes(query) ||
        s.materials.some((m) => m.toLowerCase().includes(query)) ||
        s.capabilities.some((c) => c.toLowerCase().includes(query))
      );
    });
  }, [q, capability, cert]);

  const selected = filtered.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Top bar */}
      <header className="border-b border-[rgba(225,225,225,0.3)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src={nomadLogo.url} alt="Nomad Industries" className="h-8 w-8 object-contain" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase">DATUM</span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.8)] hover:text-[#D2042D]">ISO FIT</Link>
            <Link to="/press-fit" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.8)] hover:text-[#D2042D]">PRESS FIT</Link>
            <Link to="/shops" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[#D2042D]">SHOP MAP</Link>
            <Link to="/field-notes" className="font-mono text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.8)] hover:text-[#D2042D]">FIELD NOTES</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-5 pt-12 pb-8 sm:pt-16 sm:pb-12">
        <h1 className="font-sans font-bold tracking-[0.05em] uppercase text-[54px] leading-[0.95] sm:text-[110px]">
          SHOP MAP
        </h1>
        <p className={`${HEADER} mt-6 text-sm sm:text-base text-[rgba(225,225,225,0.85)]`}>
          FIND CNC MACHINE SHOPS ACROSS THE UNITED STATES.
        </p>
      </section>

      <div className={HAIRLINE} />

      {/* Filters */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-10">
        <h2 className={`${HEADER} text-xs mb-8 text-[rgba(225,225,225,0.6)]`}>
          01 / FILTERS · {filtered.length} SHOPS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10">
          <div>
            <div className={LABEL}>SEARCH</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Name, city, state, material…"
              className="mt-3 w-full bg-transparent border-b border-[rgba(225,225,225,0.3)] py-3 font-mono text-base sm:text-lg outline-none focus:border-[#E1E1E1] placeholder:text-[rgba(225,225,225,0.35)]"
            />
          </div>
          <SelectField label="CAPABILITY" value={capability} onChange={setCapability} options={["All", ...CAPABILITY_TAGS]} />
          <SelectField label="CERTIFICATION" value={cert} onChange={setCert} options={["All", ...CERT_TAGS]} />
        </div>
      </section>

      <div className={HAIRLINE} />

      {/* Map + list */}
      <section className="mx-auto max-w-6xl px-5 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-6 lg:gap-8">
          <div className="border border-[rgba(225,225,225,0.3)] relative bg-[#0e0e0e]">
            <ShopMap
              shops={filtered}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          </div>

          <div className="border border-[rgba(225,225,225,0.3)] max-h-[640px] overflow-y-auto">
            {filtered.length === 0 && (
              <div className="p-6 font-mono text-xs tracking-[0.15em] uppercase text-[rgba(225,225,225,0.5)]">
                No shops match those filters.
              </div>
            )}
            <ul className="divide-y divide-[rgba(225,225,225,0.2)]">
              {filtered.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => setSelectedId(s.id)}
                    className={`w-full text-left px-5 py-4 transition-colors ${selectedId === s.id ? "bg-[rgba(210,4,45,0.08)]" : "hover:bg-[rgba(225,225,225,0.04)]"}`}
                  >
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-sans font-semibold tracking-[0.05em] uppercase text-sm truncate">
                        {s.name}
                      </div>
                      <div className="font-mono text-[10px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)] shrink-0">
                        {s.city}, {s.state}
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {s.capabilities.slice(0, 3).map((c) => (
                        <span key={c} className="font-mono text-[9px] tracking-[0.15em] uppercase border border-[rgba(225,225,225,0.25)] px-1.5 py-0.5 text-[rgba(225,225,225,0.75)]">
                          {c}
                        </span>
                      ))}
                      {s.capabilities.length > 3 && (
                        <span className="font-mono text-[9px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.5)]">+{s.capabilities.length - 3}</span>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {selected && (
          <div className="mt-8 border border-[rgba(225,225,225,0.3)] p-6 sm:p-8">
            <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#D2042D]">SELECTED SHOP</div>
            <div className="mt-3 font-sans font-bold tracking-[0.05em] uppercase text-2xl sm:text-3xl">
              {selected.name}
            </div>
            <div className="mt-1 font-mono text-xs tracking-[0.15em] uppercase text-[rgba(225,225,225,0.7)]">
              {selected.city}, {selected.state} · {selected.lat.toFixed(3)}°, {selected.lng.toFixed(3)}°
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <TagBlock label="CAPABILITIES" tags={selected.capabilities} />
              <TagBlock label="MATERIALS" tags={selected.materials} />
              <TagBlock label="CERTIFICATIONS" tags={selected.certifications} accent />
            </div>
            {selected.website && (
              <a
                href={selected.website}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block font-mono text-[11px] tracking-[0.2em] uppercase text-[#D2042D] border-b border-[#D2042D] pb-0.5 hover:opacity-80"
              >
                VISIT WEBSITE →
              </a>
            )}
          </div>
        )}
      </section>

      <div className={HAIRLINE} />
      <footer className="mx-auto max-w-6xl px-5 py-6 grid grid-cols-[minmax(0,1fr)_auto] gap-4 items-center">
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)] truncate">
          DATUM — SHOP DATA IS ILLUSTRATIVE; VERIFY BEFORE SOURCING.
        </span>
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.15em] uppercase text-[rgba(225,225,225,0.6)] shrink-0">
          © 2026 CORDOBA INDUSTRIES
        </span>
      </footer>
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: readonly string[] }) {
  return (
    <div>
      <div className={LABEL}>{label}</div>
      <div className="relative mt-3">
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
    </div>
  );
}

function TagBlock({ label, tags, accent }: { label: string; tags: string[]; accent?: boolean }) {
  return (
    <div>
      <div className={LABEL}>{label}</div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => (
          <span
            key={t}
            className={`font-mono text-[10px] tracking-[0.15em] uppercase px-2 py-1 border ${accent ? "border-[#D2042D] text-[#D2042D]" : "border-[rgba(225,225,225,0.3)] text-[rgba(225,225,225,0.85)]"}`}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Client-only Leaflet map. Dynamically imported so SSR doesn't crash on `window`.
 */
function ShopMap({
  shops, selectedId, onSelect,
}: { shops: MachineShop[]; selectedId: string | null; onSelect: (id: string) => void }) {
  const [Mod, setMod] = useState<null | typeof import("react-leaflet")>(null);
  const [L, setL] = useState<null | typeof import("leaflet")>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([rl, leaflet]) => {
      if (cancelled) return;
      setMod(rl);
      setL(leaflet);
    });
    return () => { cancelled = true; };
  }, []);

  if (!Mod || !L) {
    return (
      <div className="h-[520px] flex items-center justify-center font-mono text-[11px] tracking-[0.2em] uppercase text-[rgba(225,225,225,0.5)]">
        LOADING MAP…
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, useMap } = Mod;

  const makeIcon = (selected: boolean) =>
    L.divIcon({
      className: "datum-shop-marker",
      html: `<div style="width:14px;height:14px;border-radius:50%;background:${selected ? "#D2042D" : "#E1E1E1"};border:2px solid #1E1E1E;box-shadow:0 0 0 1px ${selected ? "#D2042D" : "rgba(225,225,225,0.9)"};"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

  function FlyTo({ shop }: { shop: MachineShop | null }) {
    const map = useMap();
    useEffect(() => {
      if (shop) map.flyTo([shop.lat, shop.lng], Math.max(map.getZoom(), 6), { duration: 0.8 });
    }, [shop, map]);
    return null;
  }

  const selected = shops.find((s) => s.id === selectedId) ?? null;

  return (
    <div className="h-[520px]">
      <MapContainer
        center={[39.5, -98.35]}
        zoom={4}
        minZoom={3}
        scrollWheelZoom
        style={{ height: "100%", width: "100%", background: "#0e0e0e" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {shops.map((s) => (
          <Marker
            key={s.id}
            position={[s.lat, s.lng]}
            icon={makeIcon(s.id === selectedId)}
            eventHandlers={{ click: () => onSelect(s.id) }}
          >
            <Popup>
              <div style={{ fontFamily: "IBM Plex Sans, sans-serif", minWidth: 180 }}>
                <div style={{ fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 13 }}>
                  {s.name}
                </div>
                <div style={{ fontFamily: "IBM Plex Mono, monospace", fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#666", marginTop: 2 }}>
                  {s.city}, {s.state}
                </div>
                <div style={{ fontSize: 11, marginTop: 6, color: "#333" }}>
                  {s.capabilities.slice(0, 4).join(" · ")}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <FlyTo shop={selected} />
      </MapContainer>
    </div>
  );
}
