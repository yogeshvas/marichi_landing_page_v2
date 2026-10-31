// A small looping animation for each kind of feature, shown in the feature spotlight. Pure CSS/SVG.
export type Kind = "doc" | "box" | "card" | "chat" | "pin" | "shield" | "users" | "chart" | "pen" | "link" | "store" | "truck" | "wallet" | "spark";

const D = (s: number) => ({ animationDelay: `${s}s` }) as React.CSSProperties;
const glass = "relative h-[8.5rem] w-full overflow-hidden rounded-2xl border border-white/25 bg-white/[0.14] p-4 backdrop-blur-md";

export default function FeatureVisual({ kind }: { kind: Kind }) {
  switch (kind) {
    case "doc":
      return (
        <div className={glass}>
          <div className="flex items-center justify-between"><span className="h-2.5 w-16 rounded-full bg-white/80" /><span className="fv-pop rounded border-2 border-white px-2 py-0.5 text-[10px] font-extrabold tracking-widest text-white" style={D(1.7)}>PAID</span></div>
          {[88, 100, 70, 94].map((w, i) => <span key={i} className="pc-item mt-2.5 block h-2 rounded-full bg-white/55" style={{ width: `${w}%`, ...D(0.2 + i * 0.35) }} />)}
        </div>
      );
    case "chart":
      return (
        <div className={`${glass} flex items-end gap-2.5`}>
          {[38, 62, 48, 80, 100].map((h, i) => <span key={i} className="fv-grow flex-1 rounded-t-md bg-white/85" style={{ height: `${h}%`, ...D(i * 0.14) }} />)}
        </div>
      );
    case "chat":
      return (
        <div className={`${glass} space-y-2`}>
          <p className="pc-item w-fit rounded-2xl rounded-bl-sm bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink" style={D(0.1)}>Is it ready?</p>
          <p className="pc-item ml-auto w-fit rounded-2xl rounded-br-sm bg-white/35 px-3 py-1.5 text-[11px] font-semibold text-white" style={D(0.9)}>Yes, on its way ✓</p>
          <p className="pc-item w-fit rounded-2xl rounded-bl-sm bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-ink" style={D(1.7)}>Thanks!</p>
        </div>
      );
    case "pin":
      return (
        <div className={glass}>
          <svg viewBox="0 0 300 90" className="h-full w-full" aria-hidden="true">
            <path id="fvr" d="M10 70 C 70 10, 130 90, 190 40 S 270 20, 290 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeDasharray="3 7" strokeLinecap="round" />
            <circle cx="10" cy="70" r="5" fill="#fff" /><circle cx="290" cy="24" r="6" fill="#fff" /><circle cx="290" cy="24" r="6" fill="none" stroke="#fff" strokeWidth="2" className="t-ping" />
            <circle r="6" fill="#fff"><animateMotion dur="3.6s" repeatCount="indefinite"><mpath href="#fvr" /></animateMotion></circle>
          </svg>
        </div>
      );
    case "shield":
      return (
        <div className={`${glass} flex items-center justify-center`}>
          <svg viewBox="0 0 64 72" className="h-full" fill="none" aria-hidden="true"><path className="t-beat" d="M32 4l24 9v18c0 17-10 30-24 37C18 61 8 48 8 31V13z" stroke="#fff" strokeWidth="3" strokeLinejoin="round" /><path className="fv-pop" d="M21 36l8 8 15-17" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" style={D(1)} /></svg>
        </div>
      );
    case "users":
      return (
        <div className={`${glass} flex items-center justify-center gap-3`}>
          {["A", "J", "G"].map((l, i) => <span key={l} className="fv-pop flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/80 bg-white/25 text-lg font-bold text-white" style={D(i * 0.35)}>{l}</span>)}
          <span className="fv-pop ml-1 rounded-full bg-white px-3 py-1 text-[11px] font-bold text-ink" style={D(1.3)}>+ lead</span>
        </div>
      );
    case "card":
      return (
        <div className={`${glass} flex items-center gap-3`}>
          <span className="rounded-lg bg-white/90 px-3 py-2 text-[11px] font-bold text-ink">Customer</span>
          <span className="relative h-px flex-1 bg-white/50">{[0, 1].map((d) => <span key={d} className="ph-coin absolute -top-[9px] left-0 flex h-[19px] w-[19px] items-center justify-center rounded-full bg-white text-[10px] font-extrabold text-ink" style={D(d * 1.2)}>$</span>)}</span>
          <span className="ph-settle rounded-lg bg-white/90 px-3 py-2 text-[11px] font-bold text-ink">Matched ✓</span>
        </div>
      );
    case "box":
      return (
        <div className={`${glass} flex items-end justify-center gap-2`}>
          {[0, 1, 2].map((c) => <div key={c} className="flex flex-col-reverse gap-1.5">{Array.from({ length: c === 1 ? 3 : 2 }).map((_, r) => <span key={r} className="fv-drop block h-7 w-12 rounded-md border border-white/70 bg-white/80" style={D(c * 0.3 + r * 0.45)} />)}</div>)}
        </div>
      );
    case "link":
      return (
        <div className={`${glass} flex items-center justify-between`}>
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[11px] font-extrabold text-ink">You</span>
          <span className="relative mx-3 h-px flex-1 bg-white/50">{[0, 1, 2].map((d) => <span key={d} className="ph-dot absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full bg-white" style={D(d * 0.55)} />)}</span>
          <div className="grid grid-cols-2 gap-1.5">{["Tally", "Zoho", "Odoo", "+"].map((t, i) => <span key={t} className="ph-app flex h-8 w-14 items-center justify-center rounded-lg bg-white text-[10px] font-bold text-ink" style={D(0.3 + i * 0.4)}>{t}</span>)}</div>
        </div>
      );
    case "store":
      return (
        <div className={glass}>
          <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-white/80" /><span className="h-2 w-2 rounded-full bg-white/60" /><span className="h-2 w-2 rounded-full bg-white/40" /><span className="ml-2 h-2 flex-1 rounded-full bg-white/35" /><span className="fv-pop rounded-full bg-white px-2 py-0.5 text-[9px] font-extrabold uppercase text-ink" style={D(1.4)}>Live</span></div>
          <div className="mt-3 grid grid-cols-4 gap-2">{Array.from({ length: 8 }).map((_, i) => <span key={i} className="fv-pop h-8 rounded-md bg-white/80" style={D(0.15 + i * 0.12)} />)}</div>
        </div>
      );
    case "truck":
      return (
        <div className={`${glass} flex items-end`}>
          <div className="absolute inset-x-0 bottom-6 h-px bg-white/50" />
          <div className="fv-road absolute inset-x-0 bottom-[1.1rem] h-1.5 w-[calc(100%+24px)]" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.7) 0 12px, transparent 12px 24px)" }} />
          <svg className="fv-drive mb-[1.65rem]" width="54" height="30" viewBox="0 0 54 30" fill="none" aria-hidden="true"><rect x="1" y="3" width="30" height="20" rx="3" fill="#fff" /><path d="M31 9h12l8 8v6H31z" fill="#fff" fillOpacity="0.85" /><circle cx="12" cy="25" r="4" fill="#15130f" stroke="#fff" strokeWidth="2" /><circle cx="42" cy="25" r="4" fill="#15130f" stroke="#fff" strokeWidth="2" /></svg>
        </div>
      );
    case "wallet":
      return (
        <div className={`${glass} flex items-end justify-center`}>
          <span className="relative block h-16 w-28 rounded-xl border-2 border-white/90 bg-white/20"><span className="absolute -top-2 right-3 h-3 w-10 rounded-t-md border-2 border-b-0 border-white/90" /><span className="absolute right-3 top-6 h-4 w-4 rounded-full bg-white" /></span>
          {[0, 1, 2].map((i) => <span key={i} className="fv-drop absolute top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-extrabold text-ink" style={{ left: `${38 + i * 9}%`, ...D(i * 0.6) }}>$</span>)}
        </div>
      );
    case "pen":
      return (
        <div className={`${glass} flex items-center`}>
          <svg viewBox="0 0 240 60" className="h-full w-full" fill="none" aria-hidden="true"><path className="t-beat" d="M6 44 C 28 6, 44 6, 48 32 S 78 58, 94 26 S 120 8, 128 38 S 160 56, 182 24 S 212 16, 232 36" stroke="#fff" strokeWidth="3" strokeLinecap="round" /></svg>
          <span className="fv-pop absolute right-4 top-3 rounded border-2 border-white px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white" style={D(1.9)}>Sealed</span>
        </div>
      );
    default:
      return (
        <div className={`${glass} flex items-center justify-center`}>
          <svg className="fv-spin h-20 w-20" viewBox="0 0 24 24" fill="#fff" aria-hidden="true"><path d="M12 2l1.8 6.2L20 10l-6.200 1.800L12 18l-1.800-6.200L4 10l6.200-1.800z" /></svg>
        </div>
      );
  }
}
