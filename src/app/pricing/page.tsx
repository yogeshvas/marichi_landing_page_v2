import Link from "next/link";
import PricingStudio from "@/components/PricingStudio";
import { WaButton } from "@/components/WhatsApp";
import { CtaBand, JsonLd, PageHero, Section } from "@/components/ui";
import { fullName, products } from "@/lib/content";
import { pricingPath } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

export const metadata = pageMeta(
  "Pricing for every Marichi Labs product",
  "Simple, transparent pricing for all nine Marichi Labs products, shown in Zambian kwacha, Indian rupees, UAE dirhams or US dollars. 14 days free.",
  "/pricing/",
  ["Marichi Labs pricing", "POS system pricing Zambia", "payment gateway Zambia pricing", "CRM software Zambia pricing", "bulk SMS Zambia rates", "business software pricing Zambia", "affordable business software for SMEs"],
);

const included = [
  ["14 days free", "Try any product with real data before you pay anything."],
  ["Your currency", "Kwacha, rupees, dirhams or dollars, switchable any time."],
  ["Human support", "Talk to a person on WhatsApp, not a ticket queue."],
  ["Cancel any time", "No lock-in. Yearly billing saves 20% if you prefer it."],
];

const faqs = [
  ["Do I need a card for the free trial?", "No. Start the 14-day trial from the product page and add billing only if you decide to continue."],
  ["Why do some products say Quote?", "Products like Moves, Grows and Assure are priced around your fleet, field team or audit volume. Tell us what you run on WhatsApp and we send a number."],
  ["Which currency will I be charged in?", "The one shown here. We detect it from your location, and you can change it with the currency switch."],
  ["Can I mix products and change plans later?", "Yes. Products share one account, and you can move up or down a plan whenever your business changes."],
  ["Are taxes included?", "No. VAT or GST is added where it applies, and the tax note under the prices says which."],
];

export default function PricingPage() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: `${fullName(p)} pricing`, url: absoluteUrl(pricingPath(p)) })) }} />
      <PageHero crumbs={[{ name: "Pricing", href: "/pricing/" }]} eyebrow="Pricing" title="Build your stack." accent="See the price as you go." lead="Pick the products you need and watch your monthly total add up in your own currency. Every product is free for 14 days.">
        <WaButton message="Hi Marichi Labs, can you help me choose a plan?" source="pricing-hub">Help me choose</WaButton>
      </PageHero>
      <Section tone="cream" aura="cream">
        <PricingStudio />
      </Section>
      <Section>
        <h2 className="font-display text-3xl text-ink sm:text-5xl">In every plan</h2>
        <ul className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {included.map(([t, d], i) => (
            <li key={t} className="bg-white p-6">
              <span className="text-[12px] font-bold text-red">{String(i + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-[17px] font-bold text-ink">{t}</p>
              <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 className="font-display text-3xl text-ink sm:text-5xl">Questions we get</h2>
            <p className="mt-4 text-lg text-muted">Something else? Ask on WhatsApp and a person replies.</p>
            <p className="mt-6 text-[15px] font-semibold text-ink">Full pricing by product</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {products.map((p) => <li key={p.id}><Link href={pricingPath(p)} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[13.5px] font-medium text-ink transition hover:border-ink/40">{p.name}</Link></li>)}
            </ul>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold text-ink">
                  {q}<span aria-hidden="true" className="text-2xl text-red transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
