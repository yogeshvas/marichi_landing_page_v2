import type { Scene } from "@/lib/stories";

const d = (s: number) => ({ ["--sd" as string]: `${s}s` }) as React.CSSProperties;
const cardBase = "w-full max-w-md rounded-2xl border border-white/70 bg-white p-6 shadow-[0_30px_70px_-30px_rgba(21,19,15,0.55)]";
const grad = "linear-gradient(90deg, var(--p1d), var(--p2))";

// One animated scene. Everything is CSS/SVG; the parent remounts it (key) to replay it.
export default function StoryScene({ scene, bare = false }: { scene: Scene; bare?: boolean }) {
  const card = bare ? "w-full" : cardBase;
  switch (scene.kind) {
    case "bill": {
      const end = 0.35 + scene.rows.length * 0.5;
      return (
        <div className={`${card} relative`}>
          <div className="flex items-center justify-between"><p className="text-[17px] font-bold text-ink">{scene.title}</p></div>
          <ul className="mt-3 divide-y divide-line">
            {scene.rows.map(([a, b], i) => <li key={a} className="s-in flex justify-between gap-4 py-3 text-[15px] text-ink/80" style={d(0.3 + i * 0.5)}><span>{a}</span><span className="font-semibold text-ink">{b}</span></li>)}
          </ul>
          <div className="s-in mt-1 flex justify-between border-t-2 border-ink pt-3 text-[17px] font-bold" style={d(end)}><span className="text-ink">{scene.totalLabel}</span><span className="t-text">{scene.total}</span></div>
          <span className={`s-stamp t-text absolute right-0 rounded-md border-[2.5px] bg-white/90 px-2.5 py-0.5 text-[15px] font-extrabold tracking-[0.14em] ${bare ? "top-[-0.1rem]" : "right-5 top-4"}`} style={{ ...d(end + 0.5), borderColor: "var(--p1d)" }}>{scene.stamp}</span>
        </div>
      );
    }
    case "bars":
      return (
        <div className={card}>
          <p className="text-[17px] font-bold text-ink">{scene.title}</p>
          <ul className="mt-5 space-y-5">
            {scene.bars.map((b, i) => (
              <li key={b.label}>
                <div className="flex justify-between text-[14px]"><span className="font-medium text-ink/80">{b.label}</span><span className={`font-bold ${b.warn ? "text-red" : "t-text"}`}>{b.to}%</span></div>
                <div className="mt-2 h-3 overflow-hidden rounded-full bg-cream"><div className="s-bar h-3 rounded-full" style={{ ["--w0" as string]: `${b.from}%`, ["--w1" as string]: `${b.to}%`, ["--sd" as string]: `${0.25 + i * 0.3}s`, background: b.warn ? "#ee3b2b" : grad }} /></div>
              </li>
            ))}
          </ul>
          {scene.alert && <div className="s-in mt-5 flex items-center gap-2 rounded-xl bg-[#fdeeeb] px-4 py-3 text-[14px] font-semibold text-red" style={d(1.6)}><span aria-hidden="true">⚠</span>{scene.alert}</div>}
        </div>
      );
    case "checks":
      return (
        <div className={card}>
          <p className="text-[17px] font-bold text-ink">{scene.title}</p>
          <ul className="mt-4 space-y-3">
            {scene.items.map((it, i) => (
              <li key={it.label} className="s-in flex items-center gap-3 rounded-xl bg-cream px-4 py-3" style={d(0.3 + i * 0.55)}>
                <span className={`s-pop flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${it.state === "warn" ? "bg-red" : ""}`} style={{ ...d(0.5 + i * 0.55), background: it.state === "warn" ? undefined : "var(--p1)" }}>{it.state === "warn" ? "!" : "✓"}</span>
                <span className="flex-1 text-[15px] font-medium text-ink">{it.label}</span>
                {it.tag && <span className={`rounded-full px-2.5 py-1 text-[12px] font-bold ${it.state === "warn" ? "bg-[#fdeeeb] text-red" : "t-soft t-text"}`}>{it.tag}</span>}
              </li>
            ))}
          </ul>
        </div>
      );
    case "chat":
      return (
        <div className={card}>
          <div className="flex items-center justify-between"><p className="text-[17px] font-bold text-ink">{scene.title}</p><span className="t-soft t-text rounded-full px-2.5 py-1 text-[12px] font-bold">Live</span></div>
          <div className="mt-4 space-y-3">
            {scene.msgs.map((m, i) => (
              <p key={m.text} className={`s-in max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] ${m.from === "us" ? "ml-auto rounded-br-md text-white" : "rounded-bl-md bg-cream text-ink"}`} style={{ ...d(0.4 + i * 1.1), background: m.from === "us" ? "linear-gradient(135deg, var(--p1d), var(--p1))" : undefined }}>{m.text}</p>
            ))}
            <div className="flex gap-1.5 pl-1" aria-hidden="true">{[0, 1, 2].map((i) => <span key={i} className="s-type h-2 w-2 rounded-full bg-muted" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
          </div>
          {scene.chips && <div className="mt-4 flex flex-wrap gap-2">{scene.chips.map((c, i) => <span key={c} className="s-pop t-soft t-text rounded-full px-3 py-1 text-[12px] font-bold" style={d(1.2 + i * 0.2)}>{c}</span>)}</div>}
        </div>
      );
    case "flow": {
      const W = 560, H = 300, hx = 280, hy = 150;
      const col = (n: number, x: number) => Array.from({ length: n }, (_, i) => ({ x, y: n === 1 ? hy : 50 + (i * (H - 100)) / (n - 1) }));
      const L = col(scene.from.length, 70), R = col(scene.to.length, W - 70);
      return (
        <div className={`${card} ${bare ? "" : "!p-3"}`}>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label={`${scene.from.join(", ")} flow into ${scene.hub}, then to ${scene.to.join(", ")}`}>
            {[...L.map((p) => [p.x + 62, p.y, hx - 56, hy]), ...R.map((p) => [hx + 56, hy, p.x - 62, p.y])].map(([x1, y1, x2, y2], i) => (
              <g key={i}>
                <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#d6d5cf" strokeWidth="2" strokeDasharray="4 6" />
                <circle r="6" style={{ fill: "var(--p1)" }}><animateMotion dur="1.8s" begin={`${(i % 4) * 0.35}s`} repeatCount="indefinite" path={`M${x1} ${y1} L${x2} ${y2}`} /></circle>
              </g>
            ))}
            {[...L.map((p, i) => ({ ...p, t: scene.from[i] })), ...R.map((p, i) => ({ ...p, t: scene.to[i] }))].map((n) => (
              <g key={n.t + n.x}><rect x={n.x - 62} y={n.y - 21} width="124" height="42" rx="14" fill="#fff" stroke="#e5e1d8" /><text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="600" fill="#15130f">{n.t}</text></g>
            ))}
            <rect x={hx - 56} y={hy - 34} width="112" height="68" rx="18" style={{ fill: "var(--p1)" }} />
            <text x={hx} y={hy + 5} textAnchor="middle" fontSize={scene.hub.length > 11 ? 12.5 : 15} fontWeight="800" fill="#fff">{scene.hub}</text>
          </svg>
        </div>
      );
    }
    case "route": {
      const path = "M50 220 C 140 120, 220 250, 300 150 S 450 80, 510 90";
      return (
        <div className={`${card} ${bare ? "" : "!p-3"}`}>
          <p className="px-3 pt-3 text-[17px] font-bold text-ink">{scene.title}</p>
          <svg viewBox="0 0 560 280" className="w-full" role="img" aria-label={`Route: ${scene.points.join(" to ")}`}>
            <path id={`rt-${scene.title}`} d={path} fill="none" stroke="#d6d5cf" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />
            {[[50, 220], [300, 150], [510, 90]].map(([x, y], i) => (
              <g key={i}><circle cx={x} cy={y} r="9" style={{ fill: i === 1 ? "var(--p1)" : "#fff", stroke: "var(--p1)", strokeWidth: 3 }} /><text x={x} y={y + 30} textAnchor="middle" fontSize="14" fontWeight="600" fill="#15130f">{scene.points[i]}</text></g>
            ))}
            <g><rect x="-17" y="-10" width="34" height="20" rx="5" style={{ fill: "var(--p1d)" }} /><rect x="8" y="-7" width="11" height="12" rx="2" fill="#fff" opacity="0.85" /><animateMotion dur="4.6s" repeatCount="indefinite" rotate="0"><mpath href={`#rt-${scene.title}`} /></animateMotion></g>
          </svg>
          <p className="t-soft t-text mx-3 mb-3 rounded-xl px-4 py-2.5 text-[14px] font-bold">{scene.note}</p>
        </div>
      );
    }
    case "pipeline":
      return (
        <div className={card}>
          <div className="grid grid-cols-4 gap-2">{scene.stages.map((s) => <p key={s} className="text-center text-[12px] font-bold uppercase tracking-[0.06em] text-muted">{s}</p>)}</div>
          <div className="relative mt-3 grid h-40 grid-cols-4 gap-2">
            {scene.stages.map((s) => <div key={s} className="rounded-xl bg-cream" />)}
            <div className="s-pipe absolute top-3 w-[21%] rounded-xl p-2.5 text-white shadow-lg" style={{ ...d(0.3), background: "linear-gradient(135deg, var(--p1d), var(--p1))" }}>
              <p className="text-[13px] font-bold leading-tight">{scene.card}</p><span className="mt-2 block h-1.5 w-8 rounded bg-white/70" />
            </div>
          </div>
          <p className="s-in t-soft t-text mt-4 rounded-xl px-4 py-2.5 text-[14px] font-bold" style={d(2.4)}>{scene.note}</p>
        </div>
      );
    case "sign":
      return (
        <div className={`${card} relative`}>
          <p className="text-[17px] font-bold text-ink">{scene.doc}</p>
          <div className="mt-4 space-y-2.5 rounded-xl bg-cream p-4">
            {["92%", "100%", "78%", "88%"].map((w, i) => <div key={i} className="h-2 rounded-full bg-ink/10" style={{ width: w }} />)}
            <svg viewBox="0 0 240 64" className="mt-3 h-14 w-full" fill="none"><path d="M6 44 C 28 6, 44 6, 48 32 S 78 60, 94 26 S 120 8, 128 38 S 160 56, 182 24 S 212 16, 232 36" stroke="var(--p1d)" strokeWidth="3" strokeLinecap="round" style={{ strokeDasharray: 600, strokeDashoffset: 600, animation: "t-dash 2s ease 0.5s forwards" }} /></svg>
            <div className="h-px bg-ink/20" />
          </div>
          <div className="mt-3 space-y-1">{scene.lines.map((l, i) => <p key={l} className="s-in text-[13px] text-muted" style={d(2.4 + i * 0.3)}>{l}</p>)}</div>
          <span className="s-stamp t-text absolute right-5 top-4 rounded-lg border-[3px] bg-white/80 px-3 py-1 text-lg font-extrabold uppercase tracking-[0.14em]" style={{ ...d(2.9), borderColor: "var(--p1d)" }}>{scene.seal}</span>
        </div>
      );
    case "photos":
      return (
        <div className={card}>
          <p className="text-[17px] font-bold text-ink">{scene.title}</p>
          <div className="relative mt-4 grid grid-cols-3 gap-2.5 overflow-hidden rounded-xl">
            {Array.from({ length: scene.tiles }).map((_, i) => (
              <div key={i} className={`s-in relative aspect-[4/3] rounded-lg ${i === scene.flagged ? "bg-[#fdeeeb] ring-2 ring-red" : "bg-cream"}`} style={d(0.15 + i * 0.12)}>
                <span className="absolute left-2 top-2 h-2 w-7 rounded bg-ink/10" /><span className="absolute bottom-2 left-2 h-1.5 w-10 rounded bg-ink/10" />
                {i === scene.flagged && <span className="s-pop absolute bottom-1.5 right-1.5 rounded bg-red px-1.5 py-0.5 text-[10px] font-bold text-white" style={d(2)}>Edited</span>}
              </div>
            ))}
            <div className="s-scan absolute inset-x-0 h-[3px]" style={{ background: "var(--p1)", boxShadow: "0 0 14px 3px color-mix(in srgb, var(--p1) 70%, transparent)" }} />
          </div>
          <p className="mt-4 text-[13px] font-medium text-muted">{scene.flagged >= 0 ? "1 photo flagged · place and time recorded" : "Place and time recorded on every photo"}</p>
        </div>
      );
  }
}
