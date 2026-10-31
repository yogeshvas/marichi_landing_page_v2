"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { preferencesAllowed } from "@/lib/consent";
import { CURRENCIES, currencyForCountry, type Currency } from "@/lib/pricing";

type Ctx = { currency: Currency; country?: string; ready: boolean; setCurrency: (c: Currency) => void };
const CurrencyContext = createContext<Ctx>({ currency: "USD", ready: false, setCurrency: () => {} });

const readCookie = (name: string) => {
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return m ? decodeURIComponent(m[1]) : undefined;
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCur] = useState<Currency>("USD");
  const [country, setCountry] = useState<string>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readCookie("mc_currency");
    // Country from the edge cookie, else the region in the browser's language (e.g. en-IN).
    const code = readCookie("mc_country") ?? navigator.language.split("-")[1]?.toUpperCase();
    setCountry(code);
    setCur(saved && saved in CURRENCIES ? (saved as Currency) : currencyForCountry(code));
    setReady(true);
  }, []);

  // A currency the visitor picks is only remembered in a cookie once they allow "preferences".
  const picked = useRef<Currency | null>(null);
  const remember = (c: Currency) => { document.cookie = `mc_currency=${c}; path=/; max-age=31536000; samesite=lax`; };
  const setCurrency = useCallback((c: Currency) => {
    picked.current = c;
    if (preferencesAllowed()) remember(c);
    setCur(c);
  }, []);

  useEffect(() => {
    const onConsent = () => {
      if (preferencesAllowed()) { if (picked.current) remember(picked.current); }
      else document.cookie = "mc_currency=; path=/; max-age=0";
    };
    window.addEventListener("mc-consent", onConsent);
    return () => window.removeEventListener("mc-consent", onConsent);
  }, []);

  const value = useMemo(() => ({ currency, country, ready, setCurrency }), [currency, country, ready, setCurrency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export const useCurrency = () => useContext(CurrencyContext);

export function CurrencySwitch({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  const { currency, setCurrency } = useCurrency();
  return (
    <label className={`inline-flex items-center gap-2 text-[13px] ${dark ? "text-white/50" : "text-muted"} ${className}`}>
      <span>Currency</span>
      <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className={`rounded-lg border px-2.5 py-1 text-[13px] font-medium outline-none ${dark ? "border-white/20 bg-transparent text-white focus:border-white/50" : "border-line bg-white text-ink focus:border-ink/40"}`}>
        {(Object.keys(CURRENCIES) as Currency[]).map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
    </label>
  );
}
