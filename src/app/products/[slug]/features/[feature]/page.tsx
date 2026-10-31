import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PriceFrom } from "@/components/PricingTable";
import ProductCTA from "@/components/ProductCTA";
import { Breadcrumbs, CtaBand, Eyebrow, Heading, JsonLd, Section } from "@/components/ui";
import { fullName, getProduct, products } from "@/lib/content";
import { featurePath, featuresOf, featuresPath, getFeature } from "@/lib/features";
import { pricingPath, productPath } from "@/lib/paths";
import { productDetails } from "@/lib/productDetails";
import { themeVars } from "@/lib/themes";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string; feature: string }> };

export const generateStaticParams = () => products.flatMap((p) => featuresOf(p).map((f) => ({ slug: p.slug, feature: f.slug })));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, feature } = await params;
  const p = getProduct(slug);
  const f = p && getFeature(slug, feature);
  return p && f ? pageMeta(`${f.h1} | ${fullName(p)}`, `${f.text} ${fullName(p)} makes it part of one connected suite.`, featurePath(p, f)) : {};
}

export default async function FeaturePage({ params }: Props) {
  const { slug, feature } = await params;
  const p = getProduct(slug);
  const f = p && getFeature(slug, feature);
  const d = p && productDetails[p.id];
  if (!p || !f || !d) notFound();
  const name = fullName(p);
  const others = featuresOf(p).filter((x) => x.slug !== f.slug);
  const faqs = [
    { q: `What is ${f.title.toLowerCase()} in ${name}?`, a: `${f.text} It is part of ${name}, which ${p.tagline.charAt(0).toLowerCase() + p.tagline.slice(1)}` },
    { q: `Who is ${f.title.toLowerCase()} for?`, a: `${p.bestFor.join(", ")}.` },
    { q: `How do I start using ${f.title.toLowerCase()}?`, a: `Start your 14-day free trial of ${name}, or message us on WhatsApp and we will walk you through it.` },
  ];

  return (
    <div style={themeVars(p.id)} data-product={p.id} data-aura={`t:${p.id}`}>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) }} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: f.h1, url: absoluteUrl(featurePath(p, f)), isPartOf: { "@type": "SoftwareApplication", name, url: absoluteUrl(productPath(p)), publisher: { "@type": "Organization", name: site.name } } }} />
      <section className="border-b border-line px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ name: "Products", href: "/products/" }, { name, href: productPath(p) }, { name: "Features", href: featuresPath(p) }, { name: f.title, href: featurePath(p, f) }]} />
          <Eyebrow>{name} · Feature</Eyebrow>
          <Heading as="h1" title={f.h1} className="mt-5 max-w-4xl !text-4xl sm:!text-5xl lg:!text-6xl" />
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-muted">{f.text}</p>
          <div className="mt-8"><ProductCTA product={p} pageType="feature" themed /></div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2 className="font-display mt-4 text-3xl text-ink sm:text-4xl">Why it matters</h2>
            <p className="mt-5 text-xl leading-relaxed text-ink/80">{d.problem}</p>
          </div>
          <div>
            <Eyebrow>How it works</Eyebrow>
            <ol className="mt-4 divide-y divide-line border-y border-line">
              {d.steps.map((s, i) => (
                <li key={s.title} className="flex gap-5 py-5">
                  <span className="font-display w-8 shrink-0 text-3xl text-red">{i + 1}</span>
                  <div><h3 className="font-display text-xl text-ink">{s.title}</h3><p className="mt-1 text-muted">{s.text}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <Eyebrow>Who it&apos;s for</Eyebrow>
        <h2 className="font-display mt-4 text-3xl text-ink sm:text-4xl">Use cases</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {d.useCases.map((u) => <div key={u.who} className="rounded-2xl border border-line bg-white p-6"><h3 className="font-display text-xl text-ink">{u.who}</h3><p className="mt-2 text-muted">{u.text}</p></div>)}
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="font-display mt-4 text-3xl text-ink sm:text-4xl">Included in {name}</h2>
            <p className="mt-5 text-lg text-muted"><PriceFrom productId={p.id} /></p>
            <Link href={pricingPath(p)} className="mt-4 inline-block text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">See full {name} pricing →</Link>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink">More {name} features</h2>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {others.map((o) => <li key={o.slug}><Link href={featurePath(p, o)} className="block rounded-xl border border-line bg-white px-4 py-3 text-[15px] font-semibold text-ink transition hover:border-ink/40">{o.title}</Link></li>)}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-display text-3xl text-ink sm:text-4xl">Questions</h2>
          <div className="mt-8 divide-y divide-line">
            {faqs.map((x) => (
              <details key={x.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold text-ink">{x.q}<span aria-hidden="true" className="text-2xl text-red transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 text-[17px] leading-relaxed text-muted">{x.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
      <CtaBand themed title={`Try ${f.title.toLowerCase()} free for 14 days.`} message={`Hi Marichi Labs, I'd like to try ${f.title.toLowerCase()} in ${name}.`} />
    </div>
  );
}
