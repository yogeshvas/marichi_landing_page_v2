"use client";

import { useEffect, useRef } from "react";

// Fades and lifts its children in when they scroll into view. `delay` staggers siblings.
export default function Reveal({ children, delay = 0, className = "", as: Tag = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("in"); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("in"); io.disconnect(); } }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const T = Tag as React.ElementType;
  return <T ref={ref} className={`reveal ${className}`} style={{ ["--d" as string]: `${delay}ms` }}>{children}</T>;
}
