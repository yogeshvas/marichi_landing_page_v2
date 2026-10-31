import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PricingTable from "@/components/PricingTable";
import ProductCTA from "@/components/ProductCTA";
import PulseLogo from "@/components/PulseLogo";
import { Breadcrumbs, CtaBand, Eyebrow, Heading, JsonLd, Section } from "@/components/ui";
import { fullName, getProduct, products } from "@/lib/content";
import { themeVars } from "@/lib/themes";
import { pageMeta } from "@/lib/seo";
import { keywordsFor } from "@/lib/keywords";
import { pricingPath, productPath } from "@/lib/paths";
import { CURRENCIES, pricingKeyword, pricingPlans, type Currency } from "@/lib/pricing";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  const kw = pricingKeyword[p.id] ?? p.tagline.replace(/\.$/, "").toLowerCase();
  return pageMeta(`${fullName(p)} pricing: ${kw}`, `See ${fullName(p)} plans and prices in Zambian kwacha, Indian rupees, UAE dirhams or US dollars. 14 days free.`, pricingPath(p), [`${p.name} pricing`, ...keywordsFor(p.id).slice(0, 6).map((k) => `${k} pricing`)]);
}

const faqs = (name: string) => [
  { q: "Is the 14-day trial really free?", a: `Yes. Try ${name} free for 14 days. Message us on WhatsApp or use the start button to begin.` },
  { q: "Which currency will I see?", a: "We show prices in your local currency where we support it: Zambian kwacha, Indian rupees, UAE dirhams or US dollars. You can switch currency on this page at any time, and your invoice confirms the billing currency." },
  { q: "Do prices include tax?", a: "No. VAT or GST is added where it applies." },
  { q: "Can I change plans later?", a: "Yes. You can move up or down as your business changes. Message us if you need help choosing." },
  { q: "Do you offer volume discounts?", a: "Yes. For high volumes or many branches, talk to us for a custom quote." },
  { q: "How do I pay?", a: "We'll confirm the payment methods available in your country when you start. Message us on WhatsApp for details." },
];

export default async function ProductPricingPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const name = fullName(p);
  const plans = pricingPlans[p.id] ?? [];
  const list = faqs(name);

  return (
    <div style={themeVars(p.id)} data-product={p.id} data-aura={`t:${p.id}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Product",
              name,
              description: p.intro,
              url: absoluteUrl(pricingPath(p)),
              brand: { "@type": "Brand", name: site.name },
              ...(plans.some((pl) => pl.prices) && {
                offers: plans.flatMap((pl) => pl.prices ? (Object.keys(CURRENCIES) as Currency[]).map((c) => ({ "@type": "Offer", name: `${name} ${pl.name}`, price: String(pl.prices![c]), priceCurrency: c, availability: "https://schema.org/InStock", url: absoluteUrl(pricingPath(p)) })) : []),
              }),
            },
            { "@type": "FAQPage", mainEntity: list.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          ],
        }}
      />
      <section className="border-b border-line px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ name: "Products", href: "/products/" }, { name, href: productPath(p) }, { name: "Pricing", href: pricingPath(p) }]} />
          {p.id === "pulse" && <PulseLogo className="mt-6 h-14" />}
          <Heading as="h1" title={pricingKeyword[p.id] ? `${name} pricing: ${pricingKeyword[p.id]}` : `${name} pricing`} className="mt-8 max-w-4xl !text-4xl sm:!text-5xl lg:!text-6xl" />
          <p className="mt-5 max-w-2xl text-lg text-muted">Pick a plan, or start free and decide later. Prices are shown in your local currency.</p>
          <div className="mt-7"><ProductCTA product={p} pageType="pricing" hidePricing themed /></div>
        </div>
      </section>

      <Section>
        <PricingTable product={p} />
        <p className="mt-6 text-sm text-muted">Need something different? <Link href="/contact-sales/" className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">Talk to sales</Link>.</p>
      </Section>

      <Section tone="cream">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>FAQ</Eyebrow>
          <Heading title={`${name} pricing questions`} className="mt-4 !text-3xl sm:!text-4xl" />
          <div className="mt-8 divide-y divide-line">
            {list.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-ink">{f.q}<span aria-hidden="true" className="text-2xl text-red transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-[17px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
      <CtaBand themed title={`Try ${name} free for 14 days.`} message={`Hi Marichi Labs, I'd like to start ${name}.`} />
    </div>
  );
}
