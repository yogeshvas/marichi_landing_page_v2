"use client";

import Link from "next/link";
import { WaButton } from "@/components/WhatsApp";
import { useWaitlist } from "@/components/Waitlist";
import { fullName, type Product } from "@/lib/content";
import { waLink } from "@/lib/site";
import { pricingPath } from "@/lib/paths";

export function StatusBadge({ status }: { status: Product["status"] }) {
  const map = { live: ["Live", "bg-red"], beta: ["Beta", "bg-ink"], coming_soon: ["Coming soon", "bg-muted"] } as const;
  const [label, dot] = map[status];
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[12px] font-semibold text-ink"><span className={`h-1.5 w-1.5 rounded-full ${dot}`} />{label}</span>;
}

// Appends plan and tracking tags to any URL, whether or not it already has a query string.
export const withUtm = (url: string, pageType: string, plan?: string) => {
  const u = new URL(url);
  if (plan) u.searchParams.set("plan", plan);
  u.searchParams.set("utm_source", "website");
  u.searchParams.set("utm_medium", pageType);
  u.searchParams.set("utm_campaign", "free-trial-14d");
  return u.toString();
};

// Status-driven calls to action, as in the website spec:
//   live / beta  -> start 14-day trial + try live (or WhatsApp while a product has no signup URL yet)
//   coming soon  -> join waitlist
export default function ProductCTA({ product, pageType, tone = "light", hidePricing = false, themed = false }: { product: Product; pageType: string; tone?: "light" | "dark"; hidePricing?: boolean; themed?: boolean }) {
  const openWaitlist = useWaitlist();
  const msg = `Hi Marichi Labs, I'd like a demo of ${fullName(product)}.`;
  const primary = "inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-red";
  const secondary = `inline-flex items-center justify-center rounded-lg border px-6 py-3.5 text-[15px] font-semibold transition ${tone === "dark" ? "border-white/30 text-white hover:border-white" : "border-line bg-white text-ink hover:border-ink/40"}`;

  if (product.status === "coming_soon") {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge status="coming_soon" />
        <button type="button" onClick={() => openWaitlist(product.id, pageType)} className={primary}>Join waitlist</button>
        {product.launch && <span className="text-sm text-muted">Launching {product.launch}</span>}
      </div>
    );
  }
  if (themed) {
    const tb = "t-btn inline-flex items-center justify-center rounded-full px-7 py-3.5 text-[15px] font-semibold";
    const to = "t-outline inline-flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-semibold";
    const link = "px-2 py-2 text-[15px] font-semibold t-text underline decoration-current/30 underline-offset-[6px] hover:decoration-current";
    return (
      <div className="flex flex-wrap items-center gap-3">
        {product.signupUrl ? <a href={withUtm(product.signupUrl, pageType)} className={tb}>Start free for 14 days</a> : <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className={tb}>Get a demo</a>}
        <a href={waLink(msg)} target="_blank" rel="noopener noreferrer" className={to}>Chat on WhatsApp</a>
        {product.appUrl && <a href={product.appUrl} target="_blank" rel="noopener noreferrer" className={link}>Open app ↗</a>}
        {product.demoUrl && <a href={product.demoUrl} className={link}>Try live</a>}
        {!hidePricing && <Link href={pricingPath(product)} className={link}>View pricing</Link>}
      </div>
    );
  }
  if (product.signupUrl) {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <WaButton message={msg} source={`${pageType}-${product.id}`}>Get a demo on WhatsApp</WaButton>
        <a href={withUtm(product.signupUrl, pageType)} className={secondary}>Start free for 14 days</a>
        {product.appUrl && <a href={product.appUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-2 text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red hover:decoration-red">Open {fullName(product)} app ↗</a>}
        {product.demoUrl && <a href={product.demoUrl} className="px-2 py-2 text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red hover:decoration-red">Try live</a>}
        {!hidePricing && <Link href={pricingPath(product)} className="px-2 py-2 text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red hover:decoration-red">View pricing</Link>}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap items-center gap-3">
      <WaButton message={msg} source={`${pageType}-${product.id}`}>Get a demo on WhatsApp</WaButton>
      {!hidePricing && <Link href={pricingPath(product)} className="px-2 py-2 text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red hover:decoration-red">View pricing</Link>}
    </div>
  );
}
