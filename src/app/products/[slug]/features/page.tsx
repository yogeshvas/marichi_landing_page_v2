import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductCTA from "@/components/ProductCTA";
import PulseLogo from "@/components/PulseLogo";
import { Breadcrumbs, CtaBand, Heading, Section } from "@/components/ui";
import { fullName, getProduct, products } from "@/lib/content";
import { featurePath, featuresOf, featuresPath } from "@/lib/features";
import { pricingPath, productPath } from "@/lib/paths";
import { themeVars } from "@/lib/themes";
import { pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? pageMeta(`${fullName(p)} features`, `Every feature in ${fullName(p)}: ${featuresOf(p).map((f) => f.title.toLowerCase()).join(", ")}.`, featuresPath(p)) : {};
}

export default async function FeaturesIndex({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const name = fullName(p);
  const features = featuresOf(p);
  return (
    <div style={themeVars(p.id)} data-product={p.id} data-aura={`t:${p.id}`}>
      <section className="border-b border-line px-5 pb-10 pt-24 sm:px-8 sm:pt-32">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ name: "Products", href: "/products/" }, { name, href: productPath(p) }, { name: "Features", href: featuresPath(p) }]} />
          {p.id === "pulse" && <PulseLogo className="mt-6 h-14" />}
          <Heading as="h1" title={`${name} features`} className="mt-8 max-w-4xl !text-4xl sm:!text-5xl lg:!text-6xl" />
          <p className="mt-5 max-w-2xl text-lg text-muted">{p.intro}</p>
          <div className="mt-7"><ProductCTA product={p} pageType="features" themed /></div>
        </div>
      </section>
      <Section>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <Link key={f.slug} href={featurePath(p, f)} className="group rounded-2xl border border-line bg-white p-7 transition hover:border-ink/40">
              <span className="text-[13px] font-medium text-muted">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-display mt-3 text-2xl text-ink">{f.title}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted">{f.text}</p>
              <span className="mt-5 inline-block text-[15px] font-semibold text-ink">Learn more <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span></span>
            </Link>
          ))}
        </div>
        <p className="mt-8 text-[15px] text-muted"><Link href={pricingPath(p)} className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">See {name} pricing</Link> or <Link href={productPath(p)} className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">back to {name}</Link>.</p>
      </Section>
      <CtaBand themed title={`Try ${name} free for 14 days.`} message={`Hi Marichi Labs, I'd like to start ${name}.`} />
    </div>
  );
}
