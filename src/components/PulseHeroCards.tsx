// Three small animated feature cards shown beside the Pulse hero slide: accounting integrations,
// a one-click online store, and collecting payments on behalf of retailers. CSS-only animation.

const Card = ({ title, tag, children }: { title: string; tag: string; children: React.ReactNode }) => (
  <div className="ph-card p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-[13px] font-bold text-[#f6f1e8]">{title}</p>
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f6f1e8]/50">{tag}</span>
    </div>
    {children}
  </div>
);

const Logo = ({ src, color, label }: { src: string; color: string; label: string }) => (
  <span role="img" aria-label={label} className="-my-3 block h-11 w-11" style={{ background: color, WebkitMaskImage: `url(${src})`, maskImage: `url(${src})`, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }} />
);

const apps = [
  { name: "Tally", logo: <span className="font-display text-[17px] leading-none text-[#1a4f9c]">Tally</span> },
  { name: "Zoho", logo: <Logo src="/brand/apps/zoho.svg" color="#C8202B" label="Zoho" /> },
  { name: "Odoo", logo: <Logo src="/brand/apps/odoo.svg" color="#714B67" label="Odoo" /> },
  { name: "More", logo: <span className="text-[12px] font-bold text-ink/70">+ more</span> },
];

export default function PulseHeroCards() {
  return (
    <div className="w-[22rem] divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/20 bg-black/40 backdrop-blur-xl" aria-label="MarichiPulse capabilities">
      {/* 1. Integrations */}
      <Card title="Accounting integrations" tag="Integrations">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red text-[13px] font-extrabold text-white">Pulse</span>
          <span className="relative h-px flex-1 bg-white/30" aria-hidden="true">
            {[0, 1, 2].map((d) => <span key={d} className="ph-dot absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full bg-[#f6f1e8]" style={{ animationDelay: `${d * 0.55}s` }} />)}
          </span>
          <ul className="grid grid-cols-2 gap-1.5">
            {apps.map((a, k) => (
              <li key={a.name} className="ph-app flex h-9 w-[4.2rem] items-center justify-center gap-1 rounded-lg bg-white" style={{ animationDelay: `${0.4 + k * 0.45}s` }}>{a.logo}</li>
            ))}
          </ul>
        </div>
        <p className="mt-2.5 text-[12px] text-[#f6f1e8]/70">Tally, Zoho, Odoo and other accounting software.</p>
      </Card>

      {/* 2. One-click online store */}
      <Card title="Online store in one click" tag="Sell online">
        <div className="relative flex h-[5.2rem] items-center gap-4">
          <span className="ph-press relative flex h-10 shrink-0 items-center rounded-full bg-[#f6f1e8] px-4 text-[12px] font-bold text-ink">
            Create store
            <svg className="ph-cursor absolute -bottom-3 left-8 text-[#f6f1e8] drop-shadow" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="#15130f" strokeWidth="1.2" aria-hidden="true"><path d="M5 3l14 8-6 2-3 6z" /></svg>
          </span>
          <span className="ph-store relative flex-1 rounded-lg border border-white/25 bg-white/10 p-1.5">
            <span className="mb-1 flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#ee6a5f]" /><span className="h-1.5 w-1.5 rounded-full bg-[#f5bf4f]" /><span className="h-1.5 w-1.5 rounded-full bg-[#61c554]" /><span className="ml-1 h-1.5 flex-1 rounded bg-white/25" /></span>
            <span className="grid grid-cols-4 gap-1">
              {[0, 1, 2, 3].map((t) => <span key={t} className="ph-tile h-5 rounded bg-white/70" style={{ animationDelay: `${0.35 + t * 0.12}s` }} />)}
            </span>
            <span className="ph-live absolute -right-1 -top-2 rounded-full bg-[#25D366] px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-[#073b1c]">Live</span>
          </span>
        </div>
      </Card>

      {/* 3. Payments on behalf of retailers */}
      <Card title="Collect payments for your retailers" tag="Payments">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-ink">
          <span className="rounded-lg bg-white px-2.5 py-2">Customer pays</span>
          <span className="relative h-px flex-1 bg-white/30" aria-hidden="true"><span className="ph-coin absolute -top-[9px] left-0 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-[#f5bf4f] text-[10px] font-extrabold text-ink">$</span></span>
          <span className="rounded-lg bg-red px-2.5 py-2 text-white">Pulse</span>
          <span className="relative h-px flex-1 bg-white/30" aria-hidden="true"><span className="ph-coin ph-coin2 absolute -top-[9px] left-0 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-[#f5bf4f] text-[10px] font-extrabold text-ink">$</span></span>
          <span className="ph-settle rounded-lg bg-white px-2.5 py-2">Retailer ✓</span>
        </div>
        <p className="mt-2.5 text-[12px] text-[#f6f1e8]/70">Accept on behalf of retailers, then settle automatically.</p>
      </Card>
    </div>
  );
}
