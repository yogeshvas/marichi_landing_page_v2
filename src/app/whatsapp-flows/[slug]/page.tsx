import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import FlowPhone from "@/components/FlowPhone";
import { Breadcrumbs, Container, CtaBand, JsonLd, Section } from "@/components/ui";
import { WaButton } from "@/components/WhatsApp";
import { flowCopy } from "@/lib/flowsContent";
import { flowPath, flows, flowSlug, getFlow } from "@/lib/flows";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => flows.map((f) => ({ slug: flowSlug(f) }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = getFlow((await params).slug);
  if (!f) return {};
  return pageMeta(`WhatsApp ${f.title.toLowerCase()} flow for ${f.industry.toLowerCase()}`, `${f.text} Try the live ${f.industry.toLowerCase()} WhatsApp flow built on MarichiTalks.`, flowPath(f));
}

export default async function FlowPage({ params }: Props) {
  const f = getFlow((await params).slug);
  const c = f && flowCopy[f.id];
  if (!f || !c) notFound();
  const related = flows.filter((x) => x.id !== f.id && x.group === f.group).slice(0, 3);
  const msg = `Hi Marichi Labs, I'd like the ${f.title} WhatsApp flow (${f.industry}) for my business.`;
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "WebPage", name: `WhatsApp ${f.title} flow for ${f.industry}`, description: f.text, url: absoluteUrl(flowPath(f)) },
        { "@type": "HowTo", name: `How the ${f.title} WhatsApp flow works`, step: f.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, name: s })) },
        { "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: c.faq[0], acceptedAnswer: { "@type": "Answer", text: c.faq[1] } }] },
      ] }} />
      <section className="px-5 pb-16 pt-24 sm:px-8 sm:pt-32" style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${f.color} 10%, white), #fff 70%)` }}>
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={[{ name: "Products in action", href: "/whatsapp-flows/" }, { name: f.industry, href: flowPath(f) }]} />
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.2fr_auto] lg:items-center">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.16em]" style={{ color: f.color }}>{f.industry} · WhatsApp flow</p>
              <h1 className="font-display mt-4 text-5xl leading-[1.05] text-ink sm:text-6xl lg:text-7xl">{f.title}</h1>
              <p className="mt-5 max-w-xl text-xl leading-relaxed text-muted">{f.text}</p>
              <ol className="mt-6 flex flex-wrap items-center gap-2">
                {f.steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="rounded-full px-3 py-1.5 text-[13px] font-semibold" style={{ background: `color-mix(in srgb, ${f.color} 14%, white)`, color: f.color }}><span className="mr-1.5 opacity-60">{i + 1}</span>{s}</span>
                    {i < 2 && <span aria-hidden="true" className="text-muted">→</span>}
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[15px] font-semibold text-white transition hover:brightness-110" style={{ background: f.color }}>Open full screen <span aria-hidden="true">↗</span></a>
                <WaButton message={msg} source={`flow-page-${f.id}`}>I want this flow</WaButton>
              </div>
            </div>
            <div className="mx-auto"><FlowPhone f={f} /></div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">The problem</h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{c.problem}</p>
            <p className="mt-4 text-lg leading-relaxed text-muted">This flow moves the whole journey into WhatsApp, where your customers already are. It runs on MarichiTalks and the official WhatsApp Business Platform.</p>
          </div>
          <div>
            <h2 className="font-display text-3xl text-ink sm:text-4xl">What changes</h2>
            <ul className="mt-4 space-y-3">
              {c.benefits.map((b) => <li key={b} className="flex gap-3 text-lg text-ink/85"><span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full" style={{ background: f.color }} />{b}</li>)}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="cream">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">{c.faq[0]}</h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{c.faq[1]}</p>
      </Section>

      <section className="px-5 py-16 sm:px-8 sm:py-20">
        <Container>
          <h2 className="font-display text-3xl text-ink sm:text-4xl">More {f.group.toLowerCase()} flows</h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <li key={r.id}><Link href={flowPath(r)} className="block rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5"><span className="text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: r.color }}>{r.industry}</span><span className="mt-1 block text-[18px] font-bold text-ink">{r.title}</span></Link></li>
            ))}
          </ul>
          <p className="mt-8"><Link href="/whatsapp-flows/" className="text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">All WhatsApp flows →</Link></p>
        </Container>
      </section>
      <CtaBand title={`Launch the ${f.title.toLowerCase()} flow`} message={msg} />
    </>
  );
}
