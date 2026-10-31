"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { withUtm } from "@/components/ProductCTA";
import { preferencesAllowed } from "@/lib/consent";
import PulseLogo from "@/components/PulseLogo";
import { getProduct } from "@/lib/content";
import { productPath } from "@/lib/paths";

const SHOW_AFTER_MS = 50_000; // time on site before the pop-up appears
const QUIET_DAYS = 7; // don't show again for this long after it is closed or used
const KEYS = { start: "mc_session_start", seen: "mc_launch_popup" };
const TRIAL = "14 days";

const items = [
  { id: "talks", line: "SMS, WhatsApp, email and voice from one wallet." },
  { id: "pulse", line: "POS, billing, inventory, accounting and payroll." },
] as const;

export default function LaunchPopup() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const skip = path.startsWith("/get-started");

  // Show once per visitor after ~50 seconds on the site. The clock carries across pages.
  useEffect(() => {
    if (skip) return;
    const test = new URLSearchParams(window.location.search).get("popup") === "now"; // for testing
    try {
      const last = Number(localStorage.getItem(KEYS.seen) ?? sessionStorage.getItem(KEYS.seen) ?? 0);
      if (!test && last && Date.now() - last < QUIET_DAYS * 864e5) return;
      const start = Number(sessionStorage.getItem(KEYS.start)) || Date.now();
      sessionStorage.setItem(KEYS.start, String(start));
      const wait = test ? 800 : Math.max(0, SHOW_AFTER_MS - (Date.now() - start));
      const t = setTimeout(() => setOpen(true), wait);
      return () => clearTimeout(t);
    } catch {
      const t = setTimeout(() => setOpen(true), SHOW_AFTER_MS);
      return () => clearTimeout(t);
    }
  }, [skip, path]);

  const close = () => {
    setOpen(false);
    try { (preferencesAllowed() ? localStorage : sessionStorage).setItem(KEYS.seen, String(Date.now())); } catch {}
  };

  // Moving to another page closes it, so it never follows you around.
  const firstPath = useRef(path);
  useEffect(() => { if (path !== firstPath.current) { firstPath.current = path; setOpen(false); } }, [path]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open]);

  if (!open || skip) return null;

  // A corner card, not a full-screen overlay: the rest of the page (menu, Home, links) stays clickable.
  return (
    <aside role="dialog" aria-labelledby="launch-title" className="fade-up fixed bottom-[4.75rem] right-3 z-[60] w-[min(25rem,calc(100vw-1.5rem))] rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-18px_rgba(21,19,15,0.45)] sm:bottom-24 sm:right-5">
      <button type="button" aria-label="Close" onClick={close} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-xl leading-none text-muted transition hover:bg-cream hover:text-ink">×</button>
      <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-[12px] font-semibold text-ink"><span className="h-1.5 w-1.5 rounded-full bg-red" />Just launched</p>
      <h2 id="launch-title" className="font-display mt-3 pr-6 text-2xl leading-tight text-ink">Marichi Talks and Marichi Pulse are live.</h2>
      <p className="mt-1 text-[15px] text-muted">Try either one free for {TRIAL}.</p>

      <div className="mt-4 space-y-2.5">
        {items.map((it) => {
          const p = getProduct(it.id)!;
          return (
            <div key={it.id} className="rounded-xl border border-line bg-white p-3.5">
              <div className="flex items-center justify-between gap-3">
                {it.id === "pulse"
                  ? <h3><span className="sr-only">MarichiPulse</span><PulseLogo className="-ml-3 h-9" /></h3>
                  : <h3 className="font-display text-xl text-ink">Marichi<span className="text-red">{p.name}</span></h3>}
                <Link href={productPath(p)} onClick={close} className="shrink-0 text-[13px] font-semibold text-ink underline decoration-ink/30 underline-offset-[5px] transition hover:text-red hover:decoration-red">Know more</Link>
              </div>
              <p className="mt-0.5 text-[13.5px] leading-snug text-muted">{it.line}</p>
              <a href={p.signupUrl ? withUtm(p.signupUrl, "launch-popup") : productPath(p)} onClick={close} className="mt-3 inline-flex w-full items-center justify-center rounded-lg bg-ink px-4 py-2.5 text-[14px] font-semibold text-white transition hover:bg-red">Try {TRIAL} free</a>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
