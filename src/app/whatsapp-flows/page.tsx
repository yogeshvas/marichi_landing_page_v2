import Link from "next/link";
import FlowTheater from "@/components/FlowTheater";
import PulseStudio from "@/components/PulseStudio";
import VoiceStudio from "@/components/VoiceStudio";
import { CtaBand, Eyebrow, Heading, JsonLd, PageHero, Section } from "@/components/ui";
import { WaButton } from "@/components/WhatsApp";
import { flowGroups, flowPath, flows } from "@/lib/flows";
import { pageMeta } from "@/lib/seo";
import { productKeywords } from "@/lib/keywords";
import { absoluteUrl } from "@/lib/site";

export const metadata = pageMeta(
  "Marichi products in action: live AI voice calls and WhatsApp flows",
  "See Marichi products working. Play AI voice calls for banking, retail and logistics in several languages, and try live WhatsApp flows for healthcare, lending, insurance, schools and more.",
  "/whatsapp-flows/",
  [...productKeywords.talks.core, ...productKeywords.talks.uses],
);

const faqs = [
  ["What is a WhatsApp flow?", "A guided conversation on WhatsApp that completes a task for your customer, such as booking an appointment, paying a bill or raising a claim, without a call or an app."],
  ["Do I need a developer to launch one?", "No. We set the flow up on MarichiTalks around your business. You approve the wording and go live."],
  ["Can I try a flow before I buy?", "Yes. Every flow on this page is live. Use it in the phone, or open it full screen."],
  ["Is this the official WhatsApp Business Platform?", "Yes. Marichi Labs is an Official Meta Tech Provider, so flows run on the WhatsApp Business Platform."],
] as const;

export default function FlowsHub() {
  return (
    <>
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [
        { "@type": "ItemList", name: "WhatsApp flows by industry", itemListElement: flows.map((f, i) => ({ "@type": "ListItem", position: i + 1, name: `${f.industry}: ${f.title}`, url: absoluteUrl(flowPath(f)) })) },
        { "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
      ] }} />
      <PageHero crumbs={[{ name: "Products in action", href: "/whatsapp-flows/" }]} eyebrow="See it working" title="Marichi products" accent="in action." lead="Play a sample AI voice call or try a live WhatsApp flow. Pick your industry, your language and see what your customers would experience.">
        <WaButton message="Hi Marichi Labs, I'd like a demo of your voice and WhatsApp automation." source="flows-hub">Book a live demo</WaButton>
        <nav aria-label="On this page" className="flex gap-4 text-[15px] font-semibold text-ink">
          <a href="#pulse" className="underline decoration-ink/30 underline-offset-[6px] hover:text-red">MarichiPulse</a>
          <a href="#voice" className="underline decoration-ink/30 underline-offset-[6px] hover:text-red">AI voice calls</a>
          <a href="#whatsapp" className="underline decoration-ink/30 underline-offset-[6px] hover:text-red">WhatsApp flows</a>
        </nav>
      </PageHero>
      <Section id="pulse" aura="cream">
        <Eyebrow>MarichiPulse</Eyebrow>
        <Heading as="h2" title="Run a shop" accent="in one minute." className="mt-4" />
        <p className="mt-4 max-w-2xl text-lg text-muted">Ring up a sale, move stock, run payroll and open an online store. Everything below is live: tap and watch it respond.</p>
        <div className="mt-10"><PulseStudio /></div>
      </Section>
      <Section id="voice" tone="cream" aura="cream">
        <Eyebrow>MarichiTalks · AI voice</Eyebrow>
        <Heading as="h2" title="Hear an AI call" accent="in your language." className="mt-4" />
        <p className="mt-4 max-w-2xl text-lg text-muted">Banking, retail and logistics calls that confirm, collect and update your systems. Press play.</p>
        <div className="mt-10"><VoiceStudio /></div>
      </Section>
      <Section id="whatsapp">
        <Eyebrow>MarichiTalks · WhatsApp</Eyebrow>
        <Heading as="h2" title="WhatsApp flows" accent="for every industry." className="mt-4" />
        <div className="mt-10"><FlowTheater /></div>
      </Section>
      <Section tone="cream">
        <Eyebrow>All flows</Eyebrow>
        <Heading as="h2" title="Find your" accent="industry." className="mt-4" />
        <div className="mt-10 space-y-12">
          {flowGroups.map((g) => (
            <div key={g}>
              <h3 className="text-[13px] font-bold uppercase tracking-[0.16em] text-muted">{g}</h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {flows.filter((f) => f.group === g).map((f) => (
                  <li key={f.id}>
                    <Link href={flowPath(f)} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition hover:-translate-y-0.5" style={{ ["--c" as string]: f.color }}>
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${f.color} 14%, white)`, color: f.color }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={f.icon} /></svg>
                      </span>
                      <span className="mt-4 text-[12px] font-bold uppercase tracking-[0.14em]" style={{ color: f.color }}>{f.industry}</span>
                      <span className="mt-1 text-[19px] font-bold text-ink">{f.title}</span>
                      <span className="mt-2 flex-1 text-[14.5px] leading-relaxed text-muted">{f.text}</span>
                      <span className="mt-4 text-[14px] font-semibold text-ink">See how it works <span aria-hidden="true" className="inline-block transition group-hover:translate-x-1">→</span></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <h2 className="font-display text-3xl text-ink sm:text-5xl">Questions we get</h2>
          <div className="divide-y divide-line border-y border-line">
            {faqs.map(([q, a]) => (
              <details key={q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[18px] font-semibold text-ink">{q}<span aria-hidden="true" className="text-2xl text-red transition group-open:rotate-45">+</span></summary>
                <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>
      <CtaBand title="Want one of these for your business?" message="Hi Marichi Labs, I'd like a WhatsApp flow for my business." />
    </>
  );
}
