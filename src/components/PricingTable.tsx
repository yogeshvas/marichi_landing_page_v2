"use client";

import Link from "next/link";
import { useState } from "react";
import { CurrencySwitch, useCurrency } from "@/components/CurrencyProvider";
import { withUtm } from "@/components/ProductCTA";
import { WaButton } from "@/components/WhatsApp";
import { useWaitlist } from "@/components/Waitlist";
import { fullName, type Product } from "@/lib/content";
import { pricingPath } from "@/lib/paths";
import { COUNTRY_NAME, CURRENCIES, formatMoney, pricingPlans, startingPrice, YEARLY_DISCOUNT, yearlyMonthly } from "@/lib/pricing";

export function useMoney() {
  const { currency, ready } = useCurrency();
  return { currency, ready, fmt: (n: number) => (ready ? formatMoney(n, currency) : "…") };
}

export function PriceFrom({ productId }: { productId: string }) {
  const { currency, ready, fmt } = useMoney();
  const from = startingPrice(productId, currency);
  if (!pricingPlans[productId]) return <span>Custom pricing</span>;
  return <span>{ready && from !== null ? <>From <strong className="text-ink">{fmt(from)}</strong> / month</> : "…"}</span>;
}

export function RegionNote() {
  const { currency, country, ready } = useCurrency();
  if (!ready) return <span className="text-sm text-muted">Detecting your currency…</span>;
  const where = country && COUNTRY_NAME[country] ? `Showing prices for ${COUNTRY_NAME[country]}.` : "Showing prices in";
  return <span className="text-sm text-muted">{country && COUNTRY_NAME[country] ? where : `${where} ${currency}.`} {CURRENCIES[currency].tax}</span>;
}

export default function PricingTable({ product }: { product: Product }) {
  const plans = pricingPlans[product.id];
  const [yearly, setYearly] = useState(false);
  const { fmt } = useMoney();
  const openWaitlist = useWaitlist();
  const comingSoon = product.status === "coming_soon";

  if (!plans) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 sm:p-12">
        <h2 className="font-display text-3xl text-ink">Custom pricing</h2>
        <p className="mt-3 max-w-xl text-lg text-muted">{comingSoon ? `Pricing for ${fullName(product)} is announced at launch. Join the waitlist for early-bird pricing.` : `${fullName(product)} is priced around your stores, users and volume. Tell us what you run and we'll send a quote on WhatsApp.`}</p>
        <div className="mt-6">
          {comingSoon ? <button type="button" onClick={() => openWaitlist(product.id, "pricing")} className="rounded-lg bg-ink px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-red">Join waitlist</button> : <WaButton message={`Hi Marichi Labs, can I get a quote for ${fullName(product)}?`} source={`pricing-${product.id}`}>Get a quote on WhatsApp</WaButton>}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div role="group" aria-label="Billing period" className="inline-flex rounded-xl bg-cream p-1">
          {[{ y: false, l: "Monthly" }, { y: true, l: `Yearly (save ${YEARLY_DISCOUNT * 100}%)` }].map((o) => (
            <button key={o.l} type="button" aria-pressed={yearly === o.y} onClick={() => setYearly(o.y)} className={`rounded-lg px-4 py-2 text-[14px] font-semibold transition ${yearly === o.y ? "bg-white text-ink" : "text-muted hover:text-ink"}`}>{o.l}</button>
          ))}
        </div>
        <CurrencySwitch />
      </div>
      <p className="mt-3"><RegionNote /></p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const monthly = plan.prices ? (yearly ? "yearly" : "monthly") : null;
          return (
            <div key={plan.id} className={`relative flex flex-col rounded-2xl border bg-white p-7 ${plan.highlighted ? "border-[var(--p1,#ee3b2b)]" : "border-line"}`}>
              {plan.highlighted && <span className="absolute -top-3 left-7 rounded-full bg-[var(--p1,#ee3b2b)] px-3 py-1 text-[12px] font-semibold text-white">Most popular</span>}
              <h3 className="font-display text-2xl text-ink">{plan.name}</h3>
              <p className="mt-1 text-[15px] text-muted">{plan.bestFor}</p>
              <PlanPrice plan={plan} monthlyMode={monthly} fmt={fmt} />
              {plan.prices && !comingSoon && product.signupUrl && <p className="mt-1 text-[13px] font-semibold text-[color:var(--p1d,#ee3b2b)]">14 days free</p>}
              <ul className="mt-6 flex-1 space-y-2.5 text-[15px] text-ink/80">
                {plan.features.map((f) => <li key={f} className="flex gap-2.5"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--p1,#ee3b2b)]" />{f}</li>)}
              </ul>
              <div className="mt-8">
                {comingSoon ? (
                  <button type="button" onClick={() => openWaitlist(product.id, "pricing")} className="t-btn w-full rounded-full px-6 py-3.5 text-[15px] font-semibold">Join waitlist</button>
                ) : plan.prices && product.signupUrl ? (
                  <a href={withUtm(product.signupUrl, "pricing", plan.id)} className="t-btn block rounded-full px-6 py-3.5 text-center text-[15px] font-semibold">Start free trial</a>
                ) : (
                  <WaButton message={`Hi Marichi Labs, I'm interested in the ${plan.name} plan for ${fullName(product)}.`} source={`pricing-${product.id}-${plan.id}`}>{plan.prices ? "Get started on WhatsApp" : "Talk to us"}</WaButton>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PlanPrice({ plan, monthlyMode, fmt }: { plan: (typeof pricingPlans)[string][number]; monthlyMode: "monthly" | "yearly" | null; fmt: (n: number) => string }) {
  const { currency } = useCurrency();
  if (!plan.prices) return <p className="font-display mt-6 text-4xl text-ink">Custom</p>;
  const base = plan.prices[currency];
  const amount = monthlyMode === "yearly" ? yearlyMonthly(base) : base;
  return (
    <div className="mt-6">
      <p className="font-display text-4xl text-ink">{fmt(amount)}<span className="ml-1 text-base font-medium text-muted">/ month</span></p>
      {monthlyMode === "yearly" && <p className="mt-1 text-[13px] text-muted">Billed yearly: {fmt(amount * 12)}</p>}
    </div>
  );
}

export function PricingTeaser({ product }: { product: Product }) {
  const plans = pricingPlans[product.id];
  const { fmt, currency } = useMoney();
  if (!plans) {
    return (
      <div className="rounded-2xl border border-line bg-cream p-8">
        <p className="text-lg text-ink/80">{product.status === "coming_soon" ? "Pricing is announced at launch." : "Priced around your stores, users and volume."}</p>
        <Link href={pricingPath(product)} className="mt-4 inline-block text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">See how pricing works →</Link>
      </div>
    );
  }
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((pl) => (
          <div key={pl.id} className={`rounded-2xl border bg-white p-6 ${pl.highlighted ? "border-[var(--p1,#ee3b2b)]" : "border-line"}`}>
            <p className="font-display text-xl text-ink">{pl.name}</p>
            <p className="mt-1 text-sm text-muted">{pl.bestFor}</p>
            <p className="font-display mt-4 text-3xl text-ink">{pl.prices ? <>{fmt(pl.prices[currency])}<span className="ml-1 text-sm font-medium text-muted">/ month</span></> : "Custom"}</p>
          </div>
        ))}
      </div>
      <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2"><RegionNote /><Link href={pricingPath(product)} className="text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">See full pricing →</Link></p>
    </div>
  );
}
