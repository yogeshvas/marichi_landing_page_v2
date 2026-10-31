"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

// Inertial smooth scrolling for mouse wheels and trackpads. Touch screens keep their native
// momentum scrolling, and visitors who prefer reduced motion get normal scrolling.
// Hash links such as #features glide to their section, leaving room for the sticky header.
export default function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const path = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ autoRaf: true, lerp: 0.1, smoothWheel: true, syncTouch: false, anchors: { offset: -120 } });
    lenis.current = l;
    return () => { l.destroy(); lenis.current = null; };
  }, []);

  // A new page starts at the top.
  useEffect(() => {
    if (window.location.hash) return;
    lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [path]);

  return null;
}
