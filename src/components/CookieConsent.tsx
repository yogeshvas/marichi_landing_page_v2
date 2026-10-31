"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { GA_ID, openCookieSettings, readConsent, writeConsent } from "@/lib/consent";

// A corner notice, not a wall: the page stays usable while it is open. Rejecting is as easy as accepting.
export default function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const c = readConsent();
    if (c) { setPrefs(c.preferences); setAnalytics(c.analytics); }
    else { const t = window.setTimeout(() => setOpen(true), 900); return () => clearTimeout(t); }
  }, []);

  useEffect(() => {
    const reopen = () => { const c = readConsent(); setPrefs(!!c?.preferences); setAnalytics(!!c?.analytics); setDetails(true); setOpen(true); };
    window.addEventListener("mc-open-cookies", reopen);
    return () => window.removeEventListener("mc-open-cookies", reopen);
  }, []);

  const save = (p: boolean, a: boolean) => { writeConsent({ preferences: p, analytics: GA_ID ? a : false }); setPrefs(p); setAnalytics(a); setOpen(false); setDetails(false); };
  if (!open) return null;

  const row = (title: string, text: string, on: boolean, set?: (v: boolean) => void) => (
    <li className="flex items-start justify-between gap-4 py-3">
      <span><b className="block text-[14px] font-semibold text-ink">{title}</b><span className="text-[13px] leading-snug text-muted">{text}</span></span>
      {set ? (
        <button type="button" role="switch" aria-checked={on} aria-label={title} onClick={() => set(!on)} className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-[#0EA371]" : "bg-line"}`}>
          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? "left-[1.375rem]" : "left-0.5"}`} />
        </button>
      ) : <span className="mt-1 shrink-0 text-[12px] font-semibold text-muted">Always on</span>}
    </li>
  );

  return (
    <div role="dialog" aria-labelledby="cookie-title" aria-describedby="cookie-text" className="fade-up fixed bottom-3 left-3 right-3 z-[65] rounded-2xl border border-line bg-paper p-5 shadow-[0_24px_60px_-18px_rgba(21,19,15,0.45)] sm:bottom-5 sm:left-5 sm:right-auto sm:w-[27rem]">
      <h2 id="cookie-title" className="font-display text-xl text-ink">Cookies on this site</h2>
      <p id="cookie-text" className="mt-1.5 text-[14px] leading-relaxed text-muted">
        We use a few cookies to show prices in your currency and remember your choices{GA_ID ? ", and, only if you agree, to count visits" : ""}. Read our <Link href="/privacy/" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">privacy and cookies page</Link>.
      </p>
      {details && (
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {row("Essential", "Shows prices in your country's currency and keeps staff sign-in secure. Needed for the site to work.", true)}
          {row("Preferences", "Remembers a currency you picked and that you closed our offer pop-up.", prefs, setPrefs)}
          {GA_ID && row("Analytics", "Google Analytics shows us which pages are useful. Off unless you agree.", analytics, setAnalytics)}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" onClick={() => save(true, true)} className="rounded-full bg-ink px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-red">Accept all</button>
        <button type="button" onClick={() => save(false, false)} className="rounded-full border border-ink/25 bg-white px-5 py-2.5 text-[14px] font-semibold text-ink transition hover:border-ink">Reject non-essential</button>
        {details
          ? <button type="button" onClick={() => save(prefs, analytics)} className="rounded-full px-3 py-2.5 text-[14px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">Save my choices</button>
          : <button type="button" onClick={() => setDetails(true)} className="rounded-full px-3 py-2.5 text-[14px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">Choose</button>}
      </div>
    </div>
  );
}

export function CookieSettingsLink({ className = "" }: { className?: string }) {
  return <button type="button" onClick={openCookieSettings} className={className}>Cookie settings</button>;
}
