"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";
import { team } from "@/lib/content";
import { site } from "@/lib/site";

// Counts a figure like "$2M", "33,000" or "19+" up from zero when it scrolls into view.
function Counter({ value }: { value: string }) {
  const m = value.match(/^([^\d]*)([\d,]+)(.*)$/)!;
  const [prefix, num, suffix] = [m[1], Number(m[2].replace(/,/g, "")), m[3]];
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(num); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now(), dur = 1600;
      const tick = (t: number) => { const k = Math.min(1, (t - t0) / dur); setN(Math.round(num * (1 - Math.pow(1 - k, 3)))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [num]);
  return <span ref={ref} aria-label={value}>{prefix}{n.toLocaleString("en-US")}{suffix}</span>;
}

const stats = [
  { value: "$2M", label: "a month at Mama Stops, from zero in under a year" },
  { value: "33,000", label: "retailers on one platform, built from zero" },
  { value: "19+", label: "companies funded through Texas AI Ventures" },
  { value: "25+", label: "years building telecom and distribution channels" },
];

const zones: Record<string, string> = { Lusaka: "Africa/Lusaka", Gurugram: "Asia/Kolkata", Dallas: "America/Chicago" };

function LocalTime({ city }: { city: string }) {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: zones[city] });
    const set = () => setT(fmt.format(new Date()));
    set();
    const id = setInterval(set, 15000);
    return () => clearInterval(id);
  }, [city]);
  return <span className="tabular-nums">{t ?? "--:--"}</span>;
}

const things = ["Store", "Payments", "Conversations", "Shipments", "Deals", "Signatures"];
const tint = ["bg-[#15130f]", "bg-[#ee3b2b]", "bg-[#2b2722]", "bg-[#7a5a3a]"];

export default function AboutBento() {
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Intro */}
      <Reveal className="lg:col-span-7 lg:row-span-2">
        <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] bg-[#15130f] p-8 text-[#f6f1e8] sm:p-12">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          <div className="relative">
            <p className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#f6f1e8]/65"><span className="h-px w-10 bg-red" />About Marichi Labs</p>
            <h2 className="font-display mt-6 text-4xl leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              We build the software behind <span className="text-red">everyday business.</span>
            </h2>
            <p className="mt-5 max-w-xl text-lg text-[#f6f1e8]/70">One suite where the numbers match, so nothing falls between two systems.</p>
          </div>
          <div className="relative mt-10">
            <ul className="flex flex-wrap gap-2" style={{ ["--cyc" as string]: `${things.length * 0.9}s` }} aria-label="What we connect">
              {things.map((t, k) => <li key={t}><span className="r-hl inline-block rounded-full border px-4 py-2 text-[14px] font-semibold" style={{ ["--hd" as string]: `${k * 0.9}s` }}>{t}</span></li>)}
            </ul>
            <p className="mt-3 text-[13px] text-[#f6f1e8]/55">…all connected.</p>
            <Link href="/about/" className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#f6f1e8] py-2 pl-6 pr-2 text-[15px] font-bold text-[#15130f] transition hover:bg-white">
              About us
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-red text-white transition group-hover:translate-x-0.5"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:col-span-5">
        {stats.map((s, i) => (
          <Reveal key={s.value} delay={80 + i * 80}>
            <div className={`flex h-full min-h-[11rem] flex-col justify-between rounded-[1.5rem] p-5 sm:p-6 ${i === 0 ? "bg-red text-white" : "border border-line bg-white text-ink"}`}>
              <p className="font-display text-4xl sm:text-5xl"><Counter value={s.value} /></p>
              <p className={`mt-6 text-[13.5px] leading-snug ${i === 0 ? "text-white/85" : "text-muted"}`}>{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Leadership */}
      <Reveal delay={120} className="lg:col-span-5">
        <div className="h-full rounded-[1.5rem] border border-line bg-white p-6 sm:p-7">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Leadership</p>
            <Link href="/about/#leadership" className="text-[14px] font-semibold text-ink underline decoration-ink/30 underline-offset-[5px] transition hover:text-red hover:decoration-red">Meet the team →</Link>
          </div>
          <div className="mt-5 flex -space-x-3" aria-hidden="true">
            {team.map((m, i) => <span key={m.name} className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white text-[15px] font-bold text-white transition hover:-translate-y-1 ${tint[i % 4]}`}>{m.initials}</span>)}
          </div>
          <ul className="mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {team.map((m) => <li key={m.name}><p className="text-[15px] font-semibold text-ink">{m.name}</p><p className="text-[13px] text-muted">{m.role}</p></li>)}
          </ul>
        </div>
      </Reveal>

      {/* Offices with live time */}
      <Reveal delay={80} className="lg:col-span-12">
        <div className="grid gap-5 rounded-[1.5rem] border border-line bg-white p-6 sm:p-7 lg:grid-cols-[14rem_1fr] lg:items-center">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">Offices, local time</p>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-[14px] text-muted"><span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Backed by</span>investors from IIT Kharagpur and MIT Sloan</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {site.offices.map((o) => (
              <li key={o.city} className="rounded-2xl bg-cream p-4">
                <p className="flex items-center gap-2 text-[13px] font-semibold text-muted"><span className="relative flex h-2 w-2"><span className="r-ping absolute inline-flex h-full w-full rounded-full bg-[#25a763] opacity-70" /><span className="relative inline-flex h-2 w-2 rounded-full bg-[#25a763]" /></span>{o.region.split(",")[0]}</p>
                <p className="font-display mt-2 text-2xl text-ink">{o.city}</p>
                <p className="font-display mt-1 text-3xl text-red"><LocalTime city={o.city} /></p>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
