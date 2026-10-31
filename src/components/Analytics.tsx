"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { GA_ID, readConsent } from "@/lib/consent";

// Google Analytics 4, loaded only after the visitor agrees and only when NEXT_PUBLIC_GA_ID is set.
// If they later withdraw consent, collection is switched off and the Google cookies are removed.
export default function Analytics() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const sync = () => setOn(readConsent()?.analytics === true);
    sync();
    window.addEventListener("mc-consent", sync);
    return () => window.removeEventListener("mc-consent", sync);
  }, []);

  useEffect(() => {
    if (!GA_ID) return;
    (window as unknown as Record<string, unknown>)[`ga-disable-${GA_ID}`] = !on;
    if (!on) {
      for (const c of document.cookie.split("; ")) {
        const name = c.split("=")[0];
        if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") document.cookie = `${name}=; path=/; max-age=0`;
      }
    }
  }, [on]);

  if (!GA_ID || !on) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}</Script>
    </>
  );
}
