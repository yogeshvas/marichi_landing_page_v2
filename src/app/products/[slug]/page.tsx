import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductHeroVisual, ProductScenes } from "@/components/ProductVisual";
import ProductShowcase from "@/components/ProductShowcase";
import Reveal from "@/components/Reveal";
import FeatureExplorer from "@/components/FeatureExplorer";
import FlowTheater from "@/components/FlowTheater";
import PulseStudio from "@/components/PulseStudio";
import ProductCTA, { StatusBadge } from "@/components/ProductCTA";
import PulseLogo from "@/components/PulseLogo";
import { PricingTeaser } from "@/components/PricingTable";
import { Breadcrumbs, CtaBand, Eyebrow, Heading, JsonLd, ProductCard, Section } from "@/components/ui";
import { caseStudies, fullName, getIndustry, getProduct, getSolution, products } from "@/lib/content";
import { featurePath, featuresOf, featuresPath } from "@/lib/features";
import { pricingPath } from "@/lib/paths";
import { productDetails } from "@/lib/productDetails";
import { pageMeta } from "@/lib/seo";
import { stories } from "@/lib/stories";
import { themeVars } from "@/lib/themes";
import { keywordsFor, productKeywords } from "@/lib/keywords";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  if (!p) return {};
  return pageMeta(`${fullName(p)}: ${p.tagline.replace(/\.$/, "")}`, p.intro, `/products/${p.slug}/`, keywordsFor(p.id));
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  const d = p && productDetails[p.id];
  if (!p || !d) notFound();
  const name = fullName(p);
  const related = products.filter((x) => x.slug !== p.slug).sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category)).slice(0, 3);
  const cases = caseStudies.filter((c) => c.products.includes(p.id));
  const msg = `Hi Marichi Labs, I'd like a demo of ${name}.`;

  return (
    <div style={themeVars(p.id)} data-product={p.id} data-aura={`t:${p.id}`}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "SoftwareApplication",
              name,
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web, Android, iOS",
              description: p.intro,
              keywords: keywordsFor(p.id).join(", "),
              url: absoluteUrl(`/products/${p.slug}/`),
              publisher: { "@type": "Organization", name: site.name, url: site.url },
            },
            { "@type": "FAQPage", mainEntity: d.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
          ],
        }}
      />

      <section className="relative overflow-hidden px-5 pb-12 pt-24 sm:px-8 sm:pb-16 sm:pt-32">
        <div className="relative mx-auto max-w-7xl">
          <Breadcrumbs items={[{ name: "Products", href: "/products/" }, { name, href: `/products/${p.slug}/` }]} />
          <div className="mt-10 grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              {p.id === "pulse" && <PulseLogo className="mb-4 h-16 sm:h-20" priority />}
              <div className="flex flex-wrap items-center gap-3"><p className="t-soft t-text inline-flex rounded-full px-4 py-1.5 text-sm font-bold">{p.category} · {name}</p><StatusBadge status={p.status} /></div>
              <h1 className="font-display mt-6 text-5xl leading-[1.03] text-ink sm:text-7xl">
                <span className="sr-only">{name}: </span>
                {d.headline} <span className="t-text">{d.accent}</span>
              </h1>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted">{p.intro}</p>
              <div className="mt-9"><ProductCTA product={p} pageType="product" themed /><Link href="/get-started/" className="mt-4 inline-block text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">Not sure? Find my best fit</Link></div>
            </div>
            <ProductHeroVisual id={p.id} />
          </div>
        </div>
      </section>

      <nav aria-label={`${name} sections`} className="sticky top-14 z-30 border-b border-line/60 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 sm:px-8">
          {[["Overview", "#overview"], ["Features", "#features"], ["How it works", "#how-it-works"], ["Use cases", "#use-cases"], ["Pricing", "#pricing"], ["FAQ", "#faq"]].map(([l, h]) => (
            <a key={h} href={h} className="whitespace-nowrap border-b-2 border-transparent px-3 py-3.5 text-[14px] font-medium text-muted transition hover:border-[var(--p1)] hover:text-ink">{l}</a>
          ))}
          <Link href={pricingPath(p)} className="t-text ml-auto whitespace-nowrap px-3 py-3.5 text-[14px] font-bold">Full pricing →</Link>
        </div>
      </nav>

      <Section id="overview" tone="cream">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
          <div><Eyebrow>The problem</Eyebrow><Heading title={`Why businesses need ${name}`} className="mt-4 !text-3xl sm:!text-4xl lg:!text-[2.6rem]" /></div>
          <p className="text-xl leading-relaxed text-ink/80 sm:text-2xl">{d.problem}</p>
        </div>
      </Section>

      <Section>
        <Reveal>
          <Eyebrow>In action</Eyebrow>
          <Heading title={`${name}, in the real world`} className="mt-4" />
        </Reveal>
        <Reveal delay={120} className="mt-8"><ProductScenes id={p.id} name={name} /></Reveal>
      </Section>

      {stories[p.id] && <ProductShowcase id={p.id} index={0} flip={false} tone="paper" compact themed />}

      {p.id === "pulse" && (
        <Section id="try-pulse" tone="cream">
          <Eyebrow>Try it</Eyebrow>
          <Heading as="h2" title="Run a shop" accent="in one minute." className="mt-4" />
          <p className="mt-4 max-w-2xl text-lg text-muted">Ring up a sale, move stock, run payroll and open an online store. Tap and watch it respond.</p>
          <div className="mt-10"><PulseStudio /></div>
        </Section>
      )}

      {p.id === "talks" && (
        <Section id="flows" tone="cream">
          <Eyebrow>See it in action</Eyebrow>
          <Heading as="h2" title="Real WhatsApp flows," accent="built for your industry." className="mt-4" />
          <p className="mt-4 max-w-2xl text-lg text-muted">Pick an industry and use the live flow inside the phone, exactly as your customers would.</p>
          <div className="mt-10"><FlowTheater /></div>
          <p className="mt-10"><Link href="/whatsapp-flows/" className="text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">See voice calls and all flows in action →</Link></p>
        </Section>
      )}

      <Section id="features">
        <Eyebrow>What&apos;s inside</Eyebrow>
        <Heading title={`Everything in ${name}`} className="mt-4" />
        <p className="mt-3"><Link href={featuresPath(p)} className="text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">See all {name} features →</Link></p>
        <div className="mt-8"><FeatureExplorer id={p.id} name={name} features={featuresOf(p).map((f) => ({ title: f.title, text: f.text, href: featurePath(p, f) }))} /></div>
      </Section>

      <Section id="how-it-works" tone="cream">
        <Eyebrow>How it works</Eyebrow>
        <Heading title="Up and running in" accent="three steps." className="mt-4" />
        <ol className="mt-8 grid gap-5 md:grid-cols-3">
          {d.steps.map((st, i) => (
            <Reveal key={st.title} as="li" delay={i * 120}>
              <div className="t-card relative h-full overflow-hidden rounded-3xl border border-line bg-white p-8">
                <span className="font-display absolute -right-2 -top-6 select-none text-[8rem] leading-none opacity-[0.08]" style={{ color: "var(--p1)" }} aria-hidden="true">{i + 1}</span>
                <span className="t-btn flex h-11 w-11 items-center justify-center rounded-full font-display text-lg">{i + 1}</span>
                <h3 className="font-display mt-5 text-2xl text-ink">{st.title}</h3>
                <p className="mt-2 text-[17px] text-muted">{st.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>

      <Section id="use-cases">
        <Eyebrow>Who it&apos;s for</Eyebrow>
        <Heading title="Made for teams like" accent="yours." className="mt-4" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {d.useCases.map((u, i) => (
            <Reveal key={u.who} delay={i * 90}>
              <div className="t-card t-soft h-full rounded-3xl border border-transparent p-8"><h3 className="font-display text-2xl text-ink">{u.who}</h3><p className="mt-3 text-[17px] text-ink/70">{u.text}</p></div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="pricing">
        <Eyebrow>Pricing</Eyebrow>
        <Heading title={`${name} plans`} className="mt-4" />
        <div className="mt-10"><PricingTeaser product={p} /></div>
      </Section>

      <Section tone="cream">
        <Eyebrow>Connected suite</Eyebrow>
        <Heading title="Works with the" accent="rest of Marichi." className="mt-4" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        <div className="mt-8 grid gap-8 border-t border-line pt-10 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-muted">Solutions</h3>
            <ul className="mt-3 space-y-2">{p.solutions.map((s) => { const x = getSolution(s); return x && <li key={s}><Link href={`/solutions/use-cases/${s}/`} className="font-medium text-ink hover:text-ink">{x.title} ›</Link></li>; })}</ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted">Industries</h3>
            <ul className="mt-3 space-y-2">{p.industries.map((s) => { const x = getIndustry(s); return x && <li key={s}><Link href={`/solutions/industries/${s}/`} className="font-medium text-ink hover:text-ink">{x.title} ›</Link></li>; })}</ul>
          </div>
          {cases.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-muted">Case studies</h3>
              <ul className="mt-3 space-y-2">{cases.map((c) => <li key={c.slug}><Link href={`/resources/case-studies/${c.slug}/`} className="font-medium text-ink hover:text-ink">{c.client} ›</Link></li>)}</ul>
            </div>
          )}
        </div>
      </Section>

      {productKeywords[p.id] && (
        <Section id="popular-uses" tone="cream">
          <div className="mx-auto max-w-4xl">
            <Eyebrow>Popular uses</Eyebrow>
            <Heading title={`What teams use ${name} for`} className="mt-4 !text-3xl sm:!text-4xl" />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {productKeywords[p.id].uses.map((u) => <li key={u} className="rounded-full border border-line bg-white px-4 py-2 text-[14.5px] font-medium text-ink">{u}</li>)}
            </ul>
          </div>
        </Section>
      )}

      <Section id="faq">
        <div className="mx-auto max-w-3xl">
          <Eyebrow>FAQ</Eyebrow>
          <Heading title={`Questions about ${name}`} className="mt-4 !text-4xl sm:!text-5xl" />
          <div className="mt-10 divide-y divide-line">
            {d.faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-semibold text-ink">
                  {f.q}
                  <span aria-hidden="true" className="t-text text-2xl transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-lg leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand themed title={`See ${name} working in your business.`} message={msg} />
    </div>
  );
}
