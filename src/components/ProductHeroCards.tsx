import { heroCards, type HeroCard } from "@/lib/heroCards";

// Three small looping animations beside a hero slide. All CSS/SVG, loop length 5.6 s.
const Frame = ({ title, tag, children }: { title: string; tag: string; children: React.ReactNode }) => (
  <div className="ph-card p-4">
    <div className="mb-3 flex items-center justify-between gap-3">
      <p className="text-[13px] font-bold text-[#f6f1e8]">{title}</p>
      <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#f6f1e8]/50">{tag}</span>
    </div>
    {children}
  </div>
);
const D = (n: number) => ({ animationDelay: `${n}s` }) as React.CSSProperties;
const note = (t: string) => <p className="mt-2.5 text-[12px] text-[#f6f1e8]/70">{t}</p>;

function Body({ c }: { c: HeroCard }) {
  switch (c.kind) {
    case "connect":
      return (<>
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red text-[13px] font-extrabold text-white">{c.center}</span>
          <span className="relative h-px flex-1 bg-white/30" aria-hidden="true">{[0, 1, 2].map((d) => <span key={d} className="ph-dot absolute -top-[3px] left-0 h-[7px] w-[7px] rounded-full bg-[#f6f1e8]" style={D(d * 0.55)} />)}</span>
          <ul className="grid grid-cols-2 gap-1.5">{c.items.map((t, k) => <li key={t} className="ph-app flex h-9 w-[5rem] items-center justify-center rounded-lg bg-white px-1 text-center text-[11px] font-bold leading-tight text-ink" style={D(0.4 + k * 0.45)}>{t}</li>)}</ul>
        </div>
        {note(c.note)}
      </>);
    case "flow":
      return (<>
        <div className="flex items-center gap-2 text-[11px] font-semibold text-ink">
          <span className="whitespace-nowrap rounded-lg bg-white px-2.5 py-2">{c.left}</span>
          <span className="relative h-px min-w-3 flex-1 bg-white/30" aria-hidden="true"><span className="ph-coin absolute -top-[9px] left-0 h-[19px] w-[19px] rounded-full bg-[#f6f1e8]" /></span>
          <span className="whitespace-nowrap rounded-lg bg-red px-2.5 py-2 text-white">{c.mid}</span>
          <span className="relative h-px min-w-3 flex-1 bg-white/30" aria-hidden="true"><span className="ph-coin ph-coin2 absolute -top-[9px] left-0 h-[19px] w-[19px] rounded-full bg-[#f6f1e8]" /></span>
          <span className="ph-settle whitespace-nowrap rounded-lg bg-white px-2.5 py-2">{c.right}</span>
        </div>
        {note(c.note)}
      </>);
    case "chat":
      return (
        <div className="space-y-1.5">
          {c.msgs.map((m, i) => <p key={m.text} className={`pc-item w-fit max-w-[88%] rounded-2xl px-3 py-1.5 text-[12px] font-medium ${m.from === "us" ? "ml-auto rounded-br-md bg-[#d9fdd3] text-ink" : "rounded-bl-md bg-white text-ink"}`} style={D(0.3 + i * 1.1)}>{m.text}</p>)}
        </div>
      );
    case "checks":
      return (
        <ul className="space-y-1.5">
          {c.items.map((t, i) => (
            <li key={t} className="pc-item flex items-center gap-2.5 rounded-lg bg-white/92 px-3 py-1.5 text-[12px] font-semibold text-ink" style={D(0.3 + i * 0.7)}>
              <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#25a763] text-[10px] font-bold text-white" style={{ width: 18, height: 18 }}>✓</span>{t}
            </li>
          ))}
        </ul>
      );
    case "bars":
      return (
        <ul className="space-y-2.5">
          {c.bars.map(([l, v], i) => (
            <li key={l}>
              <div className="flex justify-between text-[11px] font-semibold text-[#f6f1e8]"><span>{l}</span><span>{v}%</span></div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/20"><div className="pc-bar h-2 rounded-full bg-[#f6f1e8]" style={{ width: `${v}%`, ...D(0.25 + i * 0.3) }} /></div>
            </li>
          ))}
        </ul>
      );
    case "route":
      return (<>
        <svg viewBox="0 0 320 70" className="w-full" role="img" aria-label={`Route: ${c.points.join(" to ")}`}>
          <path id={`hr-${c.points[0]}`} d="M12 52 C 80 8, 150 66, 214 30 S 290 12, 308 16" fill="none" stroke="rgba(246,241,232,0.45)" strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />
          {[[12, 52], [214, 30], [308, 16]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill={i === 1 ? "#ee3b2b" : "#f6f1e8"} />)}
          <g><rect x="-11" y="-7" width="22" height="14" rx="3.5" fill="#ee3b2b" /><rect x="5" y="-4.5" width="7" height="9" rx="1.5" fill="#fff" opacity="0.85" /><animateMotion dur="4.6s" repeatCount="indefinite"><mpath href={`#hr-${c.points[0]}`} /></animateMotion></g>
        </svg>
        <div className="flex justify-between text-[11px] font-semibold text-[#f6f1e8]/85"><span>{c.points[0]}</span><span>{c.points[1]}</span><span>{c.points[2]}</span></div>
        {note(c.note)}
      </>);
    case "pipeline":
      return (
        <div>
          <div className="grid grid-cols-3 gap-1.5">{c.stages.map((s) => <p key={s} className="text-center text-[10px] font-bold uppercase tracking-[0.08em] text-[#f6f1e8]/70">{s}</p>)}</div>
          <div className="relative mt-1.5 grid h-14 grid-cols-3 gap-1.5">
            {c.stages.map((s) => <span key={s} className="rounded-lg bg-white/15" />)}
            <span className="pc-pipe absolute top-1.5 w-[30%] rounded-lg bg-[#f6f1e8] px-2 py-1.5 text-[11px] font-bold leading-tight text-ink">{c.card}<span className="mt-1 block h-1 w-7 rounded bg-red" /></span>
          </div>
        </div>
      );
    case "action":
      return (
        <div className="relative flex h-[4.6rem] items-center gap-4">
          <span className="ph-press relative flex h-10 shrink-0 items-center rounded-full bg-[#f6f1e8] px-4 text-[12px] font-bold text-ink">{c.button}
            <svg className="ph-cursor absolute -bottom-3 left-8 text-[#f6f1e8]" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="#15130f" strokeWidth="1.2" aria-hidden="true"><path d="M5 3l14 8-6 2-3 6z" /></svg>
          </span>
          <span className="ph-store relative flex-1 rounded-lg border border-white/25 bg-white/10 p-2">
            <span className="block text-[12px] font-bold text-[#f6f1e8]">{c.result}</span>
            <span className="mt-1 flex flex-wrap gap-1">{c.chips.map((t) => <span key={t} className="rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-bold text-ink">{t}</span>)}</span>
            <span className="ph-live absolute -right-1 -top-2 rounded-full bg-[#25D366] px-1.5 py-0.5 text-[9px] font-extrabold uppercase text-[#073b1c]">New</span>
          </span>
        </div>
      );
    case "photos":
      return (<>
        <div className="relative grid grid-cols-6 gap-1.5 overflow-hidden rounded-lg">
          {Array.from({ length: 6 }).map((_, i) => <span key={i} className={`relative h-9 rounded ${i === 4 ? "bg-[#fdeeeb] ring-2 ring-red" : "bg-white/75"}`}>{i === 4 && <span className="pc-item absolute -bottom-0.5 left-0 right-0 rounded bg-red text-center text-[8px] font-bold text-white" style={D(1.6)}>Edited</span>}</span>)}
          <span className="pc-scan absolute inset-y-0 w-[3px] bg-[#f6f1e8]" />
        </div>
        {note(c.note)}
      </>);
    case "sign":
      return (<>
        <div className="relative rounded-lg bg-white/92 px-3 py-2">
          <svg viewBox="0 0 240 44" className="h-9 w-full" fill="none"><path className="t-beat" d="M6 30 C 28 4, 44 4, 48 22 S 78 42, 94 18 S 120 6, 128 26 S 160 38, 182 16 S 212 10, 232 24" stroke="#15130f" strokeWidth="2.4" strokeLinecap="round" /></svg>
          <span className="pc-item absolute right-2 top-1.5 rounded border-2 border-red px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-red" style={D(1.7)}>{c.seal}</span>
        </div>
        {note(c.note)}
      </>);
  }
}

export default function ProductHeroCards({ id }: { id: string }) {
  const cards = heroCards[id];
  if (!cards) return null;
  return (
    <div className="w-[22rem] divide-y divide-white/10 overflow-hidden rounded-3xl border border-white/20 bg-black/40 backdrop-blur-xl">
      {cards.map((c, i) => <Frame key={`${id}-${i}`} title={c.title} tag={c.tag}><Body c={c} /></Frame>)}
    </div>
  );
}
