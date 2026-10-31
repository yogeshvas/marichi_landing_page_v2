"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { themes } from "@/lib/themes";

// A fixed, slowly drifting wash of warm colour behind the whole site. It never touches scroll:
// the drifting is pure CSS, and a tint change crossfades between two pre-painted layers
// (opacity only), so scrolling stays smooth.
const PALETTES: Record<string, [string, string, string]> = {
  warm: ["rgba(246,168,120,0.55)", "rgba(240,96,120,0.32)", "rgba(238,59,43,0.20)"],
  amber: ["rgba(250,200,110,0.50)", "rgba(246,150,110,0.35)", "rgba(238,59,43,0.18)"],
  rose: ["rgba(244,150,175,0.45)", "rgba(238,90,110,0.30)", "rgba(255,190,150,0.35)"],
  blush: ["rgba(255,205,185,0.55)", "rgba(245,160,170,0.30)", "rgba(250,225,200,0.45)"],
};

const paletteFor = (name: string) => (name.startsWith("t:") ? themes[name.slice(2)]?.aura ?? PALETTES.warm : PALETTES[name] ?? PALETTES.warm);

const SPOTS = [
  { pos: { left: "-12%", top: "42%" }, size: "62vw", anim: "aura-drift-a", dur: 38, delay: 0, c: 0 },
  { pos: { left: "28%", top: "58%" }, size: "58vw", anim: "aura-drift-b", dur: 46, delay: -8, c: 1 },
  { pos: { right: "-14%", top: "30%" }, size: "54vw", anim: "aura-drift-c", dur: 52, delay: -16, c: 2 },
] as const;

function Stack({ colors, on, refEl }: { colors: [string, string, string]; on: boolean; refEl: (el: HTMLDivElement | null) => void }) {
  return (
    <div ref={refEl} className="absolute inset-0 transition-opacity duration-[1600ms] ease-in-out" style={{ opacity: on ? 1 : 0 }}>
      {SPOTS.map((s) => (
        <div key={s.anim} className="absolute" style={{ ...s.pos, width: s.size, height: s.size }}>
          <div className="aura-blob" style={{ background: `radial-gradient(closest-side, ${colors[s.c]}, transparent)`, animation: `${s.anim} ${s.dur}s ease-in-out ${s.delay}s infinite` }} />
        </div>
      ))}
    </div>
  );
}

export default function Aura() {
  const a = useRef<HTMLDivElement | null>(null);
  const b = useRef<HTMLDivElement | null>(null);
  const colors = useRef<{ a: [string, string, string]; b: [string, string, string] }>({ a: PALETTES.warm, b: PALETTES.warm });
  const path = usePathname();

  useEffect(() => {
    let front: "a" | "b" = "a";
    let current = "warm";
    const apply = (name: string) => {
      if (name === current) return;
      current = name;
      const next = front === "a" ? "b" : "a";
      const el = (next === "a" ? a : b).current, old = (front === "a" ? a : b).current;
      if (!el || !old) return;
      // repaint the hidden layer's gradients, then crossfade (compositor-only)
      const p = paletteFor(name);
      el.querySelectorAll<HTMLElement>(".aura-blob").forEach((blob, i) => { blob.style.background = `radial-gradient(closest-side, ${p[SPOTS[i].c]}, transparent)`; });
      requestAnimationFrame(() => { el.style.opacity = "1"; old.style.opacity = "0"; front = next; });
    };
    const onAura = (e: Event) => apply(String((e as CustomEvent).detail));
    window.addEventListener("aura", onAura);
    const t = setTimeout(() => {
      const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && apply((e.target as HTMLElement).dataset.aura ?? "warm")), { rootMargin: "-48% 0px -48% 0px" });
      document.querySelectorAll("[data-aura]").forEach((n) => io.observe(n));
      cleanup = () => io.disconnect();
    }, 60);
    let cleanup = () => {};
    return () => { clearTimeout(t); cleanup(); window.removeEventListener("aura", onAura); };
  }, [path]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <Stack colors={colors.current.a} on refEl={(el) => { a.current = el; }} />
      <Stack colors={colors.current.b} on={false} refEl={(el) => { b.current = el; }} />
    </div>
  );
}
