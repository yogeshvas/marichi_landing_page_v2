"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FeatureVisual, { type Kind } from "@/components/FeatureVisual";

type Feature = { title: string; text: string; href: string };

// A line icon picked from the feature's name, so every row has a recognisable symbol.
const ICONS: Record<string, string> = {
  doc: "M7 3h7l4 4v14H7zM14 3v5h5M10 13h6M10 17h6",
  box: "M3 8l9-5 9 5v8l-9 5-9-5zM3 8l9 5 9-5M12 13v8",
  card: "M3 6h18v12H3zM3 10h18M7 15h4",
  chat: "M4 5h16v11H9l-5 4z",
  pin: "M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11zM12 12a2 2 0 100-4 2 2 0 000 4",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM8.5 12l2.5 2.5 4.5-5",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 20c0-3 2.7-5 6-5s6 2 6 5M17 11a2.5 2.5 0 100-5M18 15c2 .4 3.5 2 3.5 4",
  chart: "M4 20V10M10 20V4M16 20v-8M22 20H2",
  pen: "M4 20h16M5 16l9-9 3 3-9 9H5z",
  link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1",
  store: "M4 9l1-5h14l1 5M4 9v11h16V9M4 9a2.7 2.7 0 005.3 0 2.7 2.7 0 005.4 0 2.7 2.7 0 005.3 0M10 20v-6h4v6",
  truck: "M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM17 19a1.5 1.5 0 100-3 1.5 1.5 0 000 3z",
  wallet: "M3 7h16a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2zM3 7l12-3v3M16 14h2",
  spark: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z",
};
const RULES: [RegExp, string][] = [
  [/integrat|connect|sync/, "link"], [/online store|store/, "store"], [/cost|report|dashboard|analytic|ask your|numbers/, "chart"],
  [/payroll|wallet/, "wallet"], [/payment|payout|collect|rail|reconcil|pay\b|point of sale|checkout|\bpos\b/, "card"], [/invoic|ledger|billing|bill\b|document|proposal|agreement|template|accounting/, "doc"],
  [/audit|verif|tamper|signer|trail|secur|photo/, "shield"], [/sign\b|signature|e-sign/, "pen"], [/route|trip|border|location|track|visit|field|geo|plan/, "pin"],
  [/fleet|truck|vehicle/, "truck"], [/inventory|stock|supplier/, "box"],
  [/message|whatsapp|sms|email|voice|chat|conversation|inbox|follow|campaign/, "chat"],
  [/customer|visibility|team|lead|crm|pipeline|deal|card|capture|nudge/, "users"],
];
const kindFor = (t: string) => (RULES.find(([r]) => r.test(t.toLowerCase()))?.[1] ?? "spark") as Kind;
const iconFor = (t: string) => ICONS[kindFor(t)];

const CYCLE_MS = 4800;

export default function FeatureExplorer({ id, name, features }: { id: string; name: string; features: Feature[] }) {
  const [i, setI] = useState(0);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const f = features[i];

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.3 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  const running = inView && !hover;
  useEffect(() => {
    if (!running || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % features.length), CYCLE_MS);
    return () => clearTimeout(t);
  }, [i, running, features.length]);

  return (
    <div ref={root} className="grid gap-6 lg:grid-cols-[5fr_7fr] lg:gap-10" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {/* Spotlight */}
      <div className="lg:sticky lg:top-28 lg:self-start">
        <div className="fv-panel relative isolate aspect-[4/4.2] overflow-hidden rounded-[2rem] bg-[#15130f] text-white" onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`); e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`); }}>
          <Image src={`/photos/${id}-hero.jpg`} alt="" fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover opacity-60" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(165deg, color-mix(in srgb, var(--p1d) 92%, transparent) 0%, color-mix(in srgb, var(--p1) 55%, transparent) 45%, rgba(21,19,15,0.88) 100%)" }} />
          <div aria-hidden="true" className="fv-mesh absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full blur-3xl" style={{ background: "radial-gradient(closest-side, color-mix(in srgb, var(--p2) 75%, transparent), transparent)" }} />
          <div aria-hidden="true" className="fv-glow pointer-events-none absolute inset-0" />
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
          <span aria-hidden="true" className="font-display pointer-events-none absolute -right-4 -top-6 select-none text-[11rem] leading-none text-white/[0.09]">{String(i + 1).padStart(2, "0")}</span>

          <div key={i} className="fade-up relative flex h-full flex-col justify-end p-7 sm:p-9">
            <div className="mb-6"><FeatureVisual kind={kindFor(f.title)} /></div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-white/70">{name} · Feature {i + 1} of {features.length}</p>
            <h3 className="font-display mt-2 text-3xl leading-tight sm:text-[2.4rem]">{f.title}</h3>
            <p className="mt-3 text-[17px] leading-relaxed text-white/85">{f.text}</p>
            <Link href={f.href} className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-bold transition hover:gap-3" style={{ color: "var(--p1d)" }}>Learn more <span aria-hidden="true">→</span></Link>
          </div>

          <span className="absolute inset-x-0 bottom-0 block h-1 bg-white/15"><span key={`${i}-${running}`} className="s-step block h-1 bg-white" style={{ ["--dur" as string]: `${CYCLE_MS}ms`, animationPlayState: running ? "running" : "paused" }} /></span>
        </div>
      </div>

      {/* Feature list */}
      <ol aria-label={`${name} features`} className="divide-y divide-line border-y border-line">
        {features.map((x, n) => {
          const on = n === i;
          return (
            <li key={x.title}>
              <button type="button" onClick={() => setI(n)} onFocus={() => setI(n)} aria-current={on ? "true" : undefined} className="group relative flex w-full items-center gap-4 py-5 pl-5 pr-3 text-left outline-none sm:gap-6 sm:py-6 sm:pl-7">
                <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-1 origin-top rounded-full transition duration-300 ${on ? "scale-y-100" : "scale-y-0"}`} style={{ background: "var(--p1)" }} />
                <span aria-hidden="true" className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition duration-300 ${on ? "text-white" : "bg-cream text-ink/60 group-hover:bg-white group-hover:text-ink"}`} style={on ? { background: "var(--p1)" } : undefined}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={iconFor(x.title)} /></svg>
                  {on && <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute -inset-1 h-[3.5rem] w-[3.5rem] -rotate-90"><circle cx="24" cy="24" r="22" fill="none" stroke="var(--p1)" strokeWidth="2" strokeLinecap="round" pathLength="100" className="fv-ring" key={`${i}-${running}`} style={{ ["--dur" as string]: `${CYCLE_MS}ms`, animationPlayState: running ? "running" : "paused" }} /></svg>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={`font-display block text-[1.35rem] leading-tight transition duration-300 sm:text-2xl ${on ? "text-ink" : "text-ink/55 group-hover:text-ink/80"}`}>{x.title}</span>
                  <span className={`grid transition-all duration-500 ease-out ${on ? "mt-1.5 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}><span className="overflow-hidden text-[15.5px] leading-snug text-muted">{x.text}</span></span>
                </span>
                <span aria-hidden="true" className={`text-xl transition duration-300 ${on ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-60"}`} style={{ color: "var(--p1d)" }}>→</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
