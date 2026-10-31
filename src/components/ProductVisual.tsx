import Image from "next/image";
import { themes, type Motif } from "@/lib/themes";

// Animated motif drawn over the photo, in the product's own accent colour.
function MotifLayer({ motif }: { motif: Motif }) {
  const c = "var(--p2)";
  return (
    <svg viewBox="0 0 400 430" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      {motif === "heartbeat" && (<>
        <path className="t-beat" d="M0 330 L95 330 L120 330 L140 280 L165 372 L190 238 L215 350 L240 330 L400 330" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="190" cy="238" r="9" fill={c} /><circle className="t-ping" cx="190" cy="238" r="14" fill="none" stroke={c} strokeWidth="2" />
      </>)}
      {motif === "chat" && (<>
        {[[60, 360, 0], [300, 330, 1.6], [180, 395, 3.1]].map(([x, y, d]) => (
          <g key={String(x)} className="t-rise" style={{ animationDelay: `${d}s`, transformOrigin: `${x}px ${y}px` }}>
            <rect x={x} y={y} width="86" height="34" rx="17" fill={c} opacity="0.95" /><circle cx={x + 24} cy={y + 17} r="3.5" fill="#fff" /><circle cx={x + 43} cy={y + 17} r="3.5" fill="#fff" /><circle cx={x + 62} cy={y + 17} r="3.5" fill="#fff" />
          </g>
        ))}
        {[40, 70, 100].map((r, i) => <circle key={r} className="t-ping" style={{ animationDelay: `${i * 0.9}s` }} cx="330" cy="90" r={r / 3} fill="none" stroke={c} strokeWidth="2" />)}
      </>)}
      {motif === "route" && (<>
        <path id="route" d="M10 380 C 110 250, 190 410, 290 270 S 380 150, 395 120" fill="none" stroke={c} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
        <g><rect x="-13" y="-8" width="26" height="16" rx="4" fill={c} /><rect x="6" y="-5" width="9" height="10" rx="2" fill="#fff" opacity="0.85" /><animateMotion dur="7s" repeatCount="indefinite"><mpath href="#route" /></animateMotion></g>
        <circle cx="395" cy="120" r="8" fill={c} /><circle className="t-ping" cx="395" cy="120" r="14" fill="none" stroke={c} strokeWidth="2" />
      </>)}
      {motif === "flow" && (<>
        {[70, 150, 230, 310].map((x, i) => (
          <g key={x} className="t-rise" style={{ animationDelay: `${i * 1.1}s`, transformOrigin: `${x}px 380px` }}>
            <circle cx={x} cy="380" r="15" fill={c} opacity="0.95" /><text x={x} y="386" textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff">$</text>
          </g>
        ))}
      </>)}
      {motif === "pins" && (<>
        {[[90, 330], [210, 260], [320, 340], [270, 150]].map(([x, y], i) => (
          <g key={i}>
            <circle className="t-ping" style={{ animationDelay: `${i * 0.7}s` }} cx={x} cy={y} r="14" fill="none" stroke={c} strokeWidth="2" />
            <path d={`M${x} ${y + 12} C ${x - 14} ${y - 4}, ${x - 12} ${y - 22}, ${x} ${y - 22} C ${x + 12} ${y - 22}, ${x + 14} ${y - 4}, ${x} ${y + 12} Z`} fill={c} /><circle cx={x} cy={y - 10} r="4" fill="#fff" />
          </g>
        ))}
        <path d="M90 330 L210 260 L320 340 L270 150" fill="none" stroke={c} strokeWidth="2" strokeDasharray="3 8" opacity="0.8" />
      </>)}
      {motif === "pipeline" && (<>
        {[0, 1, 2].map((i) => (
          <g key={i}><rect x={50 + i * 110} y="340" width="86" height="52" rx="12" fill={c} opacity={0.55 + i * 0.2} /><rect x={62 + i * 110} y="354" width="40" height="7" rx="3.5" fill="#fff" opacity="0.9" /><rect x={62 + i * 110} y="368" width="58" height="7" rx="3.5" fill="#fff" opacity="0.6" />
            <animateTransform attributeName="transform" type="translate" values="0 0; 0 -14; 0 0" dur={`${3 + i * 0.6}s`} repeatCount="indefinite" /></g>
        ))}
      </>)}
      {(motif === "scan" || motif === "audit") && (<>
        <rect x="0" y="0" width="400" height="5" fill={c}><animate attributeName="y" values="30;400;30" dur="4.5s" repeatCount="indefinite" /></rect>
        {[[40, 40], [360, 40], [40, 390], [360, 390]].map(([x, y], i) => <path key={i} d={`M${x} ${y + (y > 200 ? -22 : 22)} L${x} ${y} L${x + (x > 200 ? -22 : 22)} ${y}`} fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />)}
      </>)}
      {motif === "sign" && (<path className="t-beat" d="M40 360 C 80 300, 100 300, 110 345 S 150 395, 175 335 S 215 295, 225 350 S 270 385, 300 330 S 340 320, 365 355" fill="none" stroke={c} strokeWidth="4" strokeLinecap="round" />)}
    </svg>
  );
}

export function ProductHeroVisual({ id }: { id: string }) {
  const t = themes[id];
  if (!t) return null;
  return (
    <div className="relative mx-auto w-full max-w-[34rem]">
      <div className="t-photo relative aspect-[5/5.2] overflow-hidden rounded-[2rem] border border-white/60 bg-cream">
        <Image src={t.photos.hero} alt={t.alt} fill priority sizes="(min-width: 1024px) 520px, 90vw" className="object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--p1d) 62%, transparent), transparent 58%)" }} />
        <MotifLayer motif={t.motif} />
      </div>
      {t.floaters.map((f) => (
        <div key={f.label} className={`t-float absolute ${f.pos} z-10 w-[11.5rem] rounded-2xl border border-white/70 bg-white/95 px-4 py-3 shadow-[0_18px_40px_-18px_rgba(21,19,15,0.45)] backdrop-blur`} style={{ animationDelay: `${f.delay}s` }}>
          <p className="flex items-center gap-2 text-[12px] font-semibold text-muted"><span className="h-2 w-2 rounded-full" style={{ background: "var(--p1)" }} />{f.label}</p>
          <p className="t-text mt-1 text-[18px] font-bold leading-tight">{f.value}</p>
          {f.note && <p className="mt-0.5 text-[12px] text-muted">{f.note}</p>}
        </div>
      ))}
    </div>
  );
}

export function ProductScenes({ id, name }: { id: string; name: string }) {
  const t = themes[id];
  if (!t) return null;
  return (
    <div className={`grid gap-5 ${t.photos.scenes.length > 1 ? "md:grid-cols-2" : ""}`}>
      {t.photos.scenes.map((s, i) => (
        <figure key={s.src} className="t-photo group relative aspect-[4/3] overflow-hidden rounded-[1.75rem] border border-line">
          <Image src={s.src} alt={`${name} in use`} fill sizes="(min-width: 768px) 560px, 92vw" className="object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, color-mix(in srgb, var(--p1d) 78%, transparent), transparent 62%)" }} />
          <span className="t-float absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-[13px] font-bold shadow-lg" style={{ animationDelay: `${i * 0.8}s` }}><span className="h-2 w-2 rounded-full" style={{ background: "var(--p1)" }} /><span className="t-text">{s.chip}</span></span>
          <figcaption className="absolute inset-x-0 bottom-0 p-6 text-[19px] font-semibold leading-snug text-white sm:p-7 sm:text-[21px]">{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  );
}
