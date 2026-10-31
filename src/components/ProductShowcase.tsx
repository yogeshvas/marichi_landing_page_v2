"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import ProductCTA from "@/components/ProductCTA";
import PulseLogo from "@/components/PulseLogo";
import ScreenFrame from "@/components/ScreenFrame";
import { bandClass, Container } from "@/components/ui";
import { fullName, getProduct } from "@/lib/content";
import { productDetails } from "@/lib/productDetails";
import { STEP_MS, stories } from "@/lib/stories";

// One product, one section: an image with a looping animated walkthrough on one side,
// the information on the other. `flip` swaps the sides so the page alternates.
export default function ProductShowcase({ id, index, flip, tone, compact = false, themed = false }: { id: string; index: number; flip: boolean; tone: "paper" | "cream" | "ink"; compact?: boolean; themed?: boolean }) {
  const p = getProduct(id)!;
  const d = productDetails[id];
  const steps = stories[id];
  const [si, setSi] = useState(0);
  const [inView, setInView] = useState(false);
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || hover || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setSi((s) => (s + 1) % steps.length), STEP_MS);
    return () => clearTimeout(t);
  }, [si, inView, hover, steps.length]);

  const name = fullName(p);
  const step = steps[si];
  const running = inView && !hover;
  const stage = (
    <div className={`relative overflow-hidden rounded-[2rem] border border-line bg-[#15130f] ${compact ? "min-h-[26rem] lg:min-h-[28rem]" : "min-h-[28rem] lg:min-h-[34rem]"}`} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <Image src={`/photos/${id}-hero.jpg`} alt="" fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover opacity-70" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(160deg, rgba(21,19,15,0.55), rgba(21,19,15,0.25) 50%, rgba(21,19,15,0.7))" }} />
      <div className="absolute left-5 top-5 rounded-full bg-white/95 px-4 py-2 text-[13px] font-bold text-ink shadow-lg">{name} <span className="text-muted">·</span> <span className="text-red">{step.title}</span></div>
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.12]" style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
      <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-black/45 px-3.5 py-1.5 text-[12px] font-medium text-white/85 backdrop-blur"><span className="relative flex h-2 w-2"><span className={`absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-70 ${running ? "r-ping" : ""}`} /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#25D366]" /></span>{running ? "Playing" : "Paused"}</div>
      <div className="font-display absolute bottom-4 right-6 text-3xl tabular-nums text-white/90" aria-hidden="true">{String(si + 1).padStart(2, "0")}<span className="text-base text-white/45"> / {String(steps.length).padStart(2, "0")}</span></div>
      <div className={`relative flex items-center justify-center px-4 py-16 sm:px-8 ${compact ? "min-h-[26rem] lg:min-h-[28rem]" : "min-h-[28rem] lg:min-h-[34rem]"}`}>
        <div key={si} className="fade-up flex w-full justify-center" role="group" aria-label={`${name}: ${step.title}`}><ScreenFrame id={id} name={name} steps={steps} si={si} /></div>
      </div>
    </div>
  );

  const stepper = (
    <div className="mt-7" aria-label={`${name} in action`}>
      <div role="tablist" aria-label={`${name} steps`} className="flex flex-wrap gap-2">
        {steps.map((s, n) => {
          const on = n === si;
          return (
            <button key={s.title} role="tab" aria-selected={on} onClick={() => setSi(n)} className={`group flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-4 text-[14px] font-semibold transition duration-300 ${on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/75 hover:-translate-y-0.5 hover:border-ink/40 hover:text-ink"}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold tabular-nums transition ${on ? "bg-red text-white" : "bg-cream text-muted group-hover:bg-ink/10"}`}>{n + 1}</span>
              {s.title}
            </button>
          );
        })}
      </div>
      <div key={si} className="fade-up relative mt-4 overflow-hidden rounded-2xl border border-line bg-white p-5 pl-6 sm:p-6 sm:pl-7">
        <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-red" />
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Now showing · {si + 1} of {steps.length}</p>
          <span className="flex gap-1.5">
            {[{ l: "Previous step", d: "M15 6l-6 6 6 6", to: (si - 1 + steps.length) % steps.length }, { l: "Next step", d: "M9 6l6 6-6 6", to: (si + 1) % steps.length }].map((b) => (
              <button key={b.l} aria-label={b.l} onClick={() => setSi(b.to)} className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition hover:border-ink hover:bg-ink hover:text-white">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={b.d} /></svg>
              </button>
            ))}
          </span>
        </div>
        <h3 className="font-display mt-2 text-2xl text-ink sm:text-[1.7rem]">{step.title}</h3>
        <p className="mt-1.5 text-[16px] leading-snug text-muted">{step.caption}</p>
        <span className="mt-5 block h-1 overflow-hidden rounded-full bg-cream"><span key={`${si}-${running}`} className="s-step block h-1 rounded-full bg-red" style={{ ["--dur" as string]: `${STEP_MS}ms`, animationPlayState: running ? "running" : "paused" }} /></span>
      </div>
    </div>
  );

  const info = compact ? (
    <div>
      <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-muted"><span className="h-px w-10 bg-red" />See it work</p>
      <h2 className="font-display mt-5 text-4xl text-ink sm:text-5xl">{name} <span className="text-ink/45">in action.</span></h2>
      {stepper}
    </div>
  ) : (
    <div>
      <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-muted"><span className="h-px w-10 bg-red" />{String(index + 1).padStart(2, "0")} · {p.category}</p>
      {id === "pulse" ? (
        <h2 className="mt-4"><span className="sr-only">MarichiPulse</span><PulseLogo className="h-16 sm:h-20" /></h2>
      ) : (
        <h2 className="font-display mt-5 text-5xl text-ink sm:text-6xl">Marichi<span className="text-red">{p.name}</span></h2>
      )}
      <p className="font-display mt-4 text-[1.7rem] leading-tight text-ink/85 sm:text-3xl">{d.headline} <span className="text-ink/45">{d.accent}</span></p>
      <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{p.intro}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Best for">
        {p.bestFor.map((b) => <li key={b} className="rounded-full bg-ink/[0.06] px-3 py-1 text-[13px] font-medium text-ink/75">{b}</li>)}
      </ul>

      {stepper}

      <div className="mt-7"><ProductCTA product={p} pageType="home-section" /></div>
      <Link href={`/products/${p.slug}/`} className="mt-4 inline-flex items-center gap-2 text-[15px] font-semibold text-ink transition hover:text-red">Explore {name} <span aria-hidden="true">→</span></Link>
    </div>
  );

  return (
    <section ref={ref} id={`product-${id}`} style={themed ? undefined : { ["--p1" as string]: "#ee3b2b", ["--p1d" as string]: "#c8281a", ["--p2" as string]: "#f4a678" }} className={`py-16 sm:py-24 ${bandClass(tone)}`}>
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className={flip ? "lg:order-2" : ""}>{stage}</div>
          <div className={flip ? "lg:order-1" : ""}>{info}</div>
        </div>
      </Container>
    </section>
  );
}
