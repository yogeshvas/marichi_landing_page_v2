"use client";

import { useEffect, useRef, useState } from "react";
import type { Flow } from "@/lib/flows";

// The live flow inside a phone frame, coloured by industry. The demo only loads after a tap, because the
// embedded apps scroll the whole page to themselves when they load. If one still moves the page before the
// visitor has scrolled, we put the page back where it was.
export default function FlowPhone({ f }: { f: Flow }) {
  const [started, setStarted] = useState(false);
  const [loaded, setLoaded] = useState<string | null>(null);
  const keep = useRef<{ y: number; moved: boolean }>({ y: 0, moved: false });

  useEffect(() => {
    if (!started) return;
    keep.current = { y: window.scrollY, moved: false };
    const mark = () => { keep.current.moved = true; };
    const evs = ["wheel", "touchmove", "keydown", "mousedown"] as const;
    evs.forEach((e) => window.addEventListener(e, mark, { passive: true }));
    const guard = window.setInterval(() => {
      if (!keep.current.moved && Math.abs(window.scrollY - keep.current.y) > 40) window.scrollTo({ top: keep.current.y, behavior: "instant" as ScrollBehavior });
    }, 120);
    const stop = window.setTimeout(() => clearInterval(guard), 6000);
    return () => { evs.forEach((e) => window.removeEventListener(e, mark)); clearInterval(guard); clearTimeout(stop); };
  }, [started, f.id]);

  const icon = (s: number) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={f.icon} /></svg>;
  return (
    <div className="relative rounded-[2.6rem] bg-ink p-3" style={{ boxShadow: `0 40px 80px -30px ${f.color}99` }}>
      <div className="absolute left-1/2 top-3 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-ink" aria-hidden="true" />
      <div className="relative h-[34rem] w-[17rem] overflow-hidden rounded-[2rem] bg-white sm:w-[18.5rem]">
        {!started ? (
          <button type="button" onClick={() => setStarted(true)} className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-4 px-6 text-center text-white" style={{ background: `linear-gradient(170deg, ${f.color}, color-mix(in srgb, ${f.color} 55%, #000))` }}>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">{icon(32)}</span>
            <span className="font-display text-2xl leading-tight">{f.title}</span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[14px] font-semibold" style={{ color: f.color }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>Tap to try it live
            </span>
          </button>
        ) : (
          <>
            {loaded !== f.id && (
              <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center gap-3 text-white" style={{ background: f.color }}>
                <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-2xl bg-white/20">{icon(28)}</span>
                <span className="text-[13px] font-semibold">Loading {f.industry} flow…</span>
              </div>
            )}
            <iframe key={f.id} src={f.url} title={`${f.industry}: ${f.title}`} onLoad={() => setLoaded(f.id)} sandbox="allow-scripts allow-same-origin allow-forms allow-popups" className="h-full w-full border-0" />
          </>
        )}
      </div>
    </div>
  );
}
