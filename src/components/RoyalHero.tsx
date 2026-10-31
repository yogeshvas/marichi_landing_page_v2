"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { withUtm } from "@/components/ProductCTA";
import TrustTicker from "@/components/TrustTicker";
import ProductHeroCards from "@/components/ProductHeroCards";
import ScreenFrame from "@/components/ScreenFrame";
import PulseHeroCards from "@/components/PulseHeroCards";
import PulseLogo from "@/components/PulseLogo";
import { WaIcon } from "@/components/WhatsApp";
import { fullName, getProduct } from "@/lib/content";
import { stories, storyOrder } from "@/lib/stories";
import { waLink } from "@/lib/site";

const DURATION = 5600; // ms per product (auto-advances every ~5.6 seconds)
const crop: Record<string, string> = { pulse: "50% 38%", talks: "50% 42%", pays: "50% 42%", moves: "50% 55%", grows: "50% 40%", ops: "50% 50%", card: "50% 50%", assure: "50% 50%", sign: "50% 50%" };
const pad = (n: number) => String(n + 1).padStart(2, "0");

export default function RoyalHero() {
  const [i, setI] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const playing = true; // autoplay always on; it pauses while the pointer is over the hero
  const [hover, setHover] = useState(false);
  const [sel, setSel] = useState<number | null>(null); // a clicked step: shows that step's product screen
  const busy = useRef(false);
  const touch = useRef<number | null>(null);

  const go = useCallback((n: number) => {
    const next = (n + storyOrder.length) % storyOrder.length;
    if (busy.current || next === i) return;
    busy.current = true;
    setLeaving(true);
    setTimeout(() => { setI(next); setSel(null); setLeaving(false); busy.current = false; }, 380);
  }, [i]);

  useEffect(() => {
    const n = Number(new URLSearchParams(window.location.search).get("slide"));
    if (Number.isInteger(n) && n > 0 && n < storyOrder.length) setI(n);
    const st = new URLSearchParams(window.location.search).get("step");
    if (st !== null && Number.isInteger(Number(st))) setSel(Number(st));
  }, []);

  useEffect(() => {
    if (!playing || hover || sel !== null || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go(i + 1), DURATION);
    return () => clearTimeout(t);
  }, [i, playing, hover, sel, go]);

  const id = storyOrder[i];
  const p = getProduct(id)!;
  const name = fullName(p);
  const steps = stories[id].slice(0, 6);
  const signup = p.signupUrl ? withUtm(p.signupUrl, "home-hero") : null;
  const wa = waLink(`Hi Marichi Labs, I'd like a demo of ${name}.`);

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label="Marichi Labs products"
      className="relative mt-14 h-[calc(100svh-3.5rem)] min-h-[640px] max-h-[960px] overflow-hidden bg-[#f4efe6] text-[#15130f]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(i + 1); if (e.key === "ArrowLeft") go(i - 1); }}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (touch.current === null) return; const dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1)); touch.current = null; }}
    >
      <h1 className="sr-only">Marichi Labs: business software that connects billing, stock, payments, WhatsApp and field sales</h1>

      {/* Photography: crossfades, slowly zooms out on the active slide */}
      {storyOrder.map((pid, n) => (
        <div key={pid} aria-hidden="true" className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${n === i ? "opacity-100" : "opacity-0"}`}>
          <div className={`absolute inset-0 ${n === i ? "r-kb" : ""}`}>
            <Image src={`/photos/${pid}-hero.jpg`} alt="" fill priority={n === 0} sizes="100vw" className="object-cover" style={{ objectPosition: crop[pid] }} />
          </div>
        </div>
      ))}
      <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(246,241,232,0.97) 0%, rgba(246,241,232,0.9) 40%, rgba(246,241,232,0.5) 68%, rgba(246,241,232,0.12) 100%)" }} />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: "linear-gradient(to top, rgba(246,241,232,0.9), transparent)" }} />


      {/* Slide content */}
      <div className="relative mx-auto flex h-full max-w-[88rem] flex-col justify-center px-5 pb-12 pt-10 sm:px-8 lg:px-24">
        <div key={id} className={`max-w-3xl ${leaving ? "r-leave" : ""}`} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${storyOrder.length}: ${name}`}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <span className="r-line block h-px w-12 bg-red" style={{ ["--rd" as string]: "0.1s" }} />
            <p className="r-up text-[13px] font-semibold uppercase tracking-[0.22em] text-[#15130f]/75" style={{ ["--rd" as string]: "0.2s" }}>{pad(i)} · {p.category}</p>
            <span className="r-up" style={{ ["--rd" as string]: "0.3s" }}>
              {id === "pulse"
                ? <PulseLogo chip className="h-8" priority />
                : <span className="rounded-full border border-[#15130f]/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#15130f]/65">Marichi</span>}
            </span>
          </div>

          <h2 className="font-display mt-4 text-[clamp(4rem,9.5vw,8.5rem)] leading-[0.95] tracking-[-0.045em]" aria-label={p.name}>
            {Array.from(p.name).map((ch, k) => <span key={k} className="r-mask" aria-hidden="true"><span style={{ ["--rd" as string]: `${0.35 + k * 0.07}s` }}>{ch}</span></span>)}
          </h2>

          <p className="r-up mt-5 max-w-lg text-[19px] leading-snug text-[#15130f]/75 sm:text-[21px]" style={{ ["--rd" as string]: "0.85s" }}>{p.tagline}</p>

          <div className="r-up mt-8" style={{ ["--rd" as string]: "1s" }}>
            <p className="mb-2.5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#15130f]/55">
              <svg className="r-tap" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 11V5a2 2 0 014 0v6m0 0V9a2 2 0 014 0v3m0 0a2 2 0 014 0v3a7 7 0 01-7 7h-1a7 7 0 01-5.5-2.7L4 14a2 2 0 013-2.5L9 14" /></svg>
              {sel === null ? "Tap a step to preview its screen" : `Step ${sel + 1} of ${steps.length}`}
            </p>
            <ol aria-label={`${name} covers`} className="inline-flex max-w-full flex-wrap gap-1 rounded-3xl border border-[#15130f]/15 bg-white/60 p-1 backdrop-blur-md" style={{ ["--cyc" as string]: `${steps.length * 0.8}s` }}>
              {steps.map((st, k) => {
                const idle = sel === null;
                const on = sel === k;
                return (
                  <li key={st.title}>
                    <button type="button" onClick={() => setSel(on ? null : k)} aria-pressed={on} aria-label={`${st.title}: ${st.caption}`}
                      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-[#15130f] ${idle ? "r-hl" : on ? "border-[#15130f] bg-[#15130f] text-[#f6f1e8]" : "border-transparent text-[#15130f]/65 hover:bg-white/10 hover:text-[#f6f1e8]"}`}
                      style={idle ? { ["--hd" as string]: `${1.2 + k * 0.8}s`, animationPlayState: playing && !hover ? "running" : "paused" } : undefined}>
                      <span className="text-[11px] tabular-nums opacity-60">{k + 1}</span>{st.title}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="r-up mt-8 flex flex-wrap items-center gap-x-4 gap-y-3" style={{ ["--rd" as string]: "1.3s" }}>
            <a href={signup ?? wa} {...(signup ? {} : { target: "_blank", rel: "noopener noreferrer" })} className="r-cta group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#15130f] py-1.5 pl-6 pr-1.5 text-[15px] font-bold text-[#f6f1e8]">
              <span className="r-shine" aria-hidden="true" />
              <span className="relative">{signup ? "Start free trial" : "Get a demo"}</span>
              {signup && <span className="relative rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em]">14 days free</span>}
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-red text-white transition duration-300 group-hover:translate-x-0.5 group-hover:scale-105"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="r-wa group inline-flex items-center gap-2.5 rounded-full border border-[#15130f]/25 bg-white/70 py-1.5 pl-1.5 pr-5 text-[15px] font-semibold text-[#15130f] backdrop-blur-sm">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-[#073b1c] transition duration-300 group-hover:scale-110"><WaIcon className="h-[18px] w-[18px]" /></span>
              WhatsApp
            </a>
            <Link href={`/products/${p.slug}/`} className="px-1 py-2 text-[15px] font-semibold text-[#15130f] underline decoration-[#15130f]/35 underline-offset-[7px] transition hover:decoration-[#15130f]">Explore {name} →</Link>
          </div>
        </div>
      </div>

      {/* Right panel: feature cards, or the product screen for the clicked step */}
      {!leaving && sel === null && (
        <div key={id} className="absolute right-28 top-1/2 z-[5] hidden -translate-y-[46%] xl:block 2xl:right-36">
          {id === "pulse" ? <PulseHeroCards /> : <ProductHeroCards id={id} />}
        </div>
      )}
      {!leaving && sel !== null && (
        <>
          <button type="button" aria-label="Close screen" onClick={() => setSel(null)} className="absolute inset-0 z-10 cursor-default bg-black/55 xl:hidden" />
          <div key={`${id}-${sel}`} className="fade-up absolute inset-x-4 top-1/2 z-20 mx-auto w-auto max-w-[34rem] -translate-y-1/2 xl:inset-x-auto xl:right-28 xl:mx-0 xl:w-[34rem] xl:origin-right xl:scale-[0.86] 2xl:right-36 2xl:scale-[0.95]">
            <div className="mb-3 flex items-center justify-between gap-3 rounded-2xl border border-white/25 bg-black/55 px-4 py-2.5 backdrop-blur-md">
              <p className="text-[13px] text-[#f6f1e8]"><span className="font-bold">{steps[sel].title}.</span> <span className="text-[#f6f1e8]/75">{steps[sel].caption}</span></p>
              <button type="button" onClick={() => setSel(null)} aria-label="Back to overview" className="shrink-0 rounded-full border border-white/35 px-3 py-1 text-[12px] font-semibold text-[#f6f1e8] transition hover:bg-white/15">Back</button>
            </div>
            <div className="flex justify-center"><ScreenFrame id={id} name={name} steps={stories[id]} si={sel} /></div>
          </div>
        </>
      )}

      {/* Side arrows, vertically centred */}
      {[{ l: "Previous product", d: "M15 5l-7 7 7 7", to: i - 1, pos: "left-5 xl:left-8" }, { l: "Next product", d: "M9 5l7 7-7 7", to: i + 1, pos: "right-5 xl:right-8" }].map((b) => (
        <button key={b.l} aria-label={b.l} onClick={() => go(b.to)} className={`r-arrow absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[#15130f]/25 bg-white/60 text-[#15130f] backdrop-blur-md sm:flex ${b.pos}`}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={b.d} /></svg>
        </button>
      ))}

      <TrustTicker />
    </section>
  );
}
