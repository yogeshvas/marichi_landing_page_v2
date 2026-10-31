"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CurrencySwitch, useCurrency } from "@/components/CurrencyProvider";
import { RegionNote } from "@/components/PricingTable";
import { withUtm } from "@/components/ProductCTA";
import { WaButton } from "@/components/WhatsApp";
import { fullName, products } from "@/lib/content";
import { pricingPath } from "@/lib/paths";
import { formatMoney, pricingPlans, YEARLY_DISCOUNT, yearlyMonthly } from "@/lib/pricing";
import { themes } from "@/lib/themes";

// Counts up/down to the target so the total feels alive when the stack changes.
function useTween(target: number) {
  const [v, setV] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); from.current = target; return; }
    const a = from.current, t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / 600), e = 1 - Math.pow(1 - k, 3);
      const n = a + (target - a) * e;
      from.current = n; setV(n);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return Math.round(v);
}

export default function PricingStudio() {
  const { currency, ready } = useCurrency();
  const [yearly, setYearly] = useState(false);
  const [pick, setPick] = useState<Record<string, string>>({ pulse: "business", talks: "growth" });
  const fmt = (n: number) => (ready ? formatMoney(n, currency) : "…");

  const chosen = products.filter((p) => pick[p.id]);
  const lines = chosen.map((p) => {
    const plan = pricingPlans[p.id]?.find((x) => x.id === pick[p.id]);
    const base = plan?.prices?.[currency];
    return { p, plan, amount: base === undefined ? null : yearly ? yearlyMonthly(base) : base };
  });
  const priced = lines.filter((l) => l.amount !== null);
  const total = useTween(priced.reduce((s, l) => s + (l.amount ?? 0), 0));
  const quoted = lines.length - priced.length;
  const saved = yearly ? priced.reduce((s, l) => s + ((l.plan?.prices?.[currency] ?? 0) - (l.amount ?? 0)) * 12, 0) : 0;

  const toggle = (id: string) =>
    setPick((c) => {
      const n = { ...c };
      if (n[id]) delete n[id];
      else n[id] = pricingPlans[id]?.[1]?.id ?? "quote";
      return n;
    });

  const msg = `Hi Marichi Labs, I'd like a quote for: ${chosen.map((p) => `${fullName(p)}${pick[p.id] !== "quote" ? ` (${pick[p.id]})` : ""}`).join(", ") || "your products"}. Billing: ${yearly ? "yearly" : "monthly"}, currency ${currency}.`;
  const single = lines.length === 1 && lines[0].p.signupUrl && lines[0].amount !== null ? lines[0] : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-start">
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">1 · Pick what you need</p>
          <CurrencySwitch />
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {products.map((p) => {
            const t = themes[p.id], on = !!pick[p.id], plans = pricingPlans[p.id];
            const c = t?.p1 ?? "#ee3b2b";
            return (
              <li key={p.id} className="relative overflow-hidden rounded-2xl border transition duration-300" style={{ borderColor: on ? c : "var(--color-line, #e7e3dc)", background: on ? `color-mix(in srgb, ${c} 7%, white)` : "#fff", transform: on ? "translateY(-2px)" : undefined }}>
                <button type="button" aria-pressed={on} onClick={() => toggle(p.id)} className="flex w-full items-start gap-3 p-4 text-left">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition" style={{ borderColor: c, background: on ? c : "transparent" }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" className={`transition ${on ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}><path d="M5 12l5 5 9-10" /></svg>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold text-ink">Marichi<span style={{ color: c }}>{p.name}</span></span>
                    <span className="mt-0.5 block text-[13px] leading-snug text-muted">{p.tagline}</span>
                    <span className="mt-2 block text-[12.5px] font-semibold text-ink/70">
                      {plans ? <>From {fmt(Math.min(...plans.flatMap((x) => (x.prices ? [x.prices[currency]] : []))))} / mo</> : p.status === "coming_soon" ? `Coming ${p.launch ?? "soon"}` : "Custom quote"}
                    </span>
                  </span>
                </button>
                {on && plans && (
                  <div role="group" aria-label={`${p.name} plan`} className="flex gap-1 border-t px-3 py-2.5" style={{ borderColor: `color-mix(in srgb, ${c} 25%, white)` }}>
                    {plans.map((pl) => (
                      <button key={pl.id} type="button" aria-pressed={pick[p.id] === pl.id} onClick={() => setPick((x) => ({ ...x, [p.id]: pl.id }))} className="flex-1 rounded-lg px-1 py-1.5 text-[12px] font-semibold transition" style={pick[p.id] === pl.id ? { background: c, color: "#fff" } : { color: "#6b665e" }}>
                        {pl.name}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <p className="mt-4"><RegionNote /></p>
      </div>

      <aside className="lg:sticky lg:top-24">
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-muted">2 · Your monthly stack</p>
        <div className="relative mt-4 text-white drop-shadow-[0_24px_40px_rgba(0,0,0,.18)]">
          <div className="pr-edge-top h-3 bg-ink" aria-hidden="true" />
          <div className="bg-ink px-6 pb-6 pt-4">
            <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] text-white/50">
              <span>Marichi Labs · Estimate</span><span>{currency}</span>
            </div>
            <ul className="mt-4 min-h-[3.5rem] space-y-2.5 border-b border-dashed border-white/20 pb-4 text-[14px]">
              {lines.length === 0 && <li className="text-white/50">Nothing picked yet. Tap a product.</li>}
              {lines.map(({ p, plan, amount }) => (
                <li key={p.id} className="pr-line flex items-baseline justify-between gap-3">
                  <span>{fullName(p)} <span className="text-white/50">{plan && plan.id !== "quote" ? plan.name : ""}</span></span>
                  <span className="shrink-0 font-semibold tabular-nums">{amount === null ? "Quote" : fmt(amount)}</span>
                </li>
              ))}
            </ul>
            <div role="group" aria-label="Billing period" className="mt-4 inline-flex rounded-lg bg-white/10 p-1 text-[13px] font-semibold">
              {[{ y: false, l: "Monthly" }, { y: true, l: `Yearly −${YEARLY_DISCOUNT * 100}%` }].map((o) => (
                <button key={o.l} type="button" aria-pressed={yearly === o.y} onClick={() => setYearly(o.y)} className={`rounded-md px-3 py-1.5 transition ${yearly === o.y ? "bg-white text-ink" : "text-white/70 hover:text-white"}`}>{o.l}</button>
              ))}
            </div>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-[13px] text-white/60">Total / month</span>
              <span className="font-display text-5xl tabular-nums leading-none sm:text-6xl" aria-live="polite">{ready ? formatMoney(total, currency) : "…"}</span>
            </div>
            <p className="mt-2 min-h-[1.25rem] text-right text-[12.5px] text-white/55">
              {quoted > 0 && `+ ${quoted} custom-quoted · `}
              {saved > 0 ? `You save ${fmt(saved)} a year` : "Excludes tax"}
            </p>
            <div className="mt-5 flex flex-col gap-3">
              {single && <a href={withUtm(single.p.signupUrl!, "pricing-studio", single.plan?.id)} className="rounded-lg bg-red px-6 py-3.5 text-center text-[15px] font-semibold text-white transition hover:brightness-110">Start 14-day free trial</a>}
              <WaButton message={msg} source="pricing-studio">{single ? "Ask us first" : "Get this quote on WhatsApp"}</WaButton>
              <p className="text-center text-[12.5px] text-white/50">14 days free on every product. No card needed.</p>
            </div>
          </div>
          <div className="pr-edge-bottom h-3 bg-ink" aria-hidden="true" />
        </div>
        {chosen.length > 0 && (
          <p className="mt-4 text-[13.5px] text-muted">
            Details: {chosen.map((p, i) => <span key={p.id}>{i > 0 && " · "}<Link href={pricingPath(p)} className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">{p.name}</Link></span>)}
          </p>
        )}
      </aside>
    </div>
  );
}
