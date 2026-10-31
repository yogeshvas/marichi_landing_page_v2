import Link from "next/link";
import { caseStudies, engagementSteps, industries, productsBySlugs, solutions, stats, team } from "@/lib/content";
import AboutBento from "@/components/AboutBento";
import FunnelJourney from "@/components/FunnelJourney";
import GoalExplorer from "@/components/GoalExplorer";
import Newsletter from "@/components/Newsletter";
import { blogMeta, fmtDate, type Post } from "@/lib/blog";
import { getAllPosts } from "@/lib/postsStore";
import Reveal from "@/components/Reveal";
import { Button, Eyebrow, Heading, Dot, Section } from "@/components/ui";

export function PillarsSection() {
  return (
    <Section tone="cream" aura="blush">
      <Eyebrow>What it does for you</Eyebrow>
      <Heading title="Four jobs Marichi" accent="takes off your plate." className="mt-4" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {solutions.map((s) => (
          <Link key={s.slug} href={`/solutions/use-cases/${s.slug}/`} className="flex flex-col rounded-3xl border border-line bg-white p-7 transition hover:border-ink/40">
            <span className="font-display text-3xl text-red">{s.num}</span>
            <h3 className="mt-6 font-display text-xl leading-tight text-ink">{s.title}</h3>
            <p className="mt-4 flex-1 text-[15px] leading-relaxed text-muted">{s.short}</p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function IndustriesSection() {
  return (
    <Section tone="paper" aura="amber">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <Eyebrow>Industries</Eyebrow>
          <Heading title="Made for the way" accent="you already work." className="mt-4" />
        </div>
        <Button href="/solutions/industries/" variant="ghost">All industries</Button>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {industries.map((ind) => (
          <Link key={ind.slug} href={`/solutions/industries/${ind.slug}/`} className="group rounded-3xl p-7 transition hover:bg-cream/50 border border-line">
            <h3 className="font-display text-2xl text-ink">{ind.title}</h3>
            <p className="mt-3 text-muted">{ind.short}</p>
            <p className="mt-5 flex flex-wrap gap-2">
              {productsBySlugs(ind.products).slice(0, 4).map((p) => (
                <span key={p.slug} className="rounded-full bg-cream px-3 py-1 text-xs font-semibold text-ink border border-line">Marichi{p.name}</span>
              ))}
            </p>
          </Link>
        ))}
      </div>
    </Section>
  );
}

export function ProofSection() {
  return (
    <Section tone="ink">
      <Eyebrow light>Track record</Eyebrow>
      <Heading on="ink" title="Built by people who" accent="have done it before." className="mt-4" />
      <dl className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/15 bg-white/15 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.value} className="bg-[#1d1a16] p-8">
            <dt className="font-display text-5xl text-red">{s.value}</dt>
            <dd className="mt-4 leading-relaxed text-white/65">{s.label}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {caseStudies.slice(0, 2).map((c) => <CaseStudyCard key={c.slug} c={c} />)}
      </div>
      <div className="mt-8"><Link href="/resources/case-studies/" className="text-[15px] font-semibold text-white underline decoration-white/40 underline-offset-[6px] transition hover:decoration-red">Read all case studies →</Link></div>
    </Section>
  );
}

export function CaseStudyCard({ c }: { c: (typeof caseStudies)[number] }) {
  return (
    <Link href={`/resources/case-studies/${c.slug}/`} className="group flex h-full flex-col rounded-2xl border border-line bg-paper p-7 transition hover:border-red/60">
      <span className="font-display text-4xl text-red">{c.metric}</span>
      <span className="mt-1 text-xs font-bold uppercase tracking-wider text-muted">{c.metricLabel}</span>
      <h3 className="mt-5 font-display text-xl leading-snug text-ink">{c.title}</h3>
      <p className="mt-3 flex-1 text-muted">{c.summary}</p>
      <span className="mt-5 text-sm font-bold text-ink">Read case study →</span>
    </Link>
  );
}

export function ProcessSteps() {
  return (
    <ol className="grid gap-8 lg:grid-cols-4">
      {engagementSteps.map((s) => (
        <li key={s.title}>
          <div className="flex items-center gap-3">
            <Dot />
            <span className="h-px flex-1 bg-line" />
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-wider text-ink">{s.time}</p>
          <h3 className="mt-2 font-display text-2xl text-ink">{s.title}</h3>
          <p className="mt-2 text-muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function HowWeWorkSection() {
  return (
    <Section id="how-we-work">
      <Eyebrow>How we work</Eyebrow>
      <Heading title="Built here, so we know" accent="how it works here." className="mt-4 max-w-3xl" />
      <p className="mt-5 max-w-2xl text-lg text-muted">Our team has implemented these systems in this market, at national scale. You get proven playbooks and a team that ships, not imported theory.</p>
      <div className="mt-8"><ProcessSteps /></div>
    </Section>
  );
}

export function TeamGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {team.map((m) => (
        <article key={m.name} className="rounded-3xl bg-cream p-7 text-center border border-line">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-red bg-paper font-display text-2xl text-ink" aria-hidden="true">{m.initials}</div>
          <h3 className="mt-5 font-display text-xl text-ink">{m.name}</h3>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-ink">{m.role}</p>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{m.bio}</p>
        </article>
      ))}
    </div>
  );
}

export function AboutTeaser() {
  return (
    <section data-aura="rose" className="border-y border-[#ddd2bc] bg-[#ece4d4] py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8"><AboutBento /></div>
    </section>
  );
}


export function ExplorerSection() {
  return (
    <Section tone="paper" aura="amber">
      <Eyebrow>Find your software</Eyebrow>
      <Heading title="What do you need" accent="to sort out?" className="mt-4" />
      <p className="mt-4 max-w-xl text-xl text-muted">Pick one. We&apos;ll point you to the right product.</p>
      <div className="mt-10"><GoalExplorer /></div>
    </Section>
  );
}

export function FunnelSection() {
  return (
    <Section tone="ink" aura="warm">
      <FunnelJourney />
    </Section>
  );
}

export async function BlogTeaser() {
  const all = await getAllPosts();
  const items = [...all.filter((p) => p.kind === "sales").slice(0, 2), ...all.filter((p) => p.kind === "tech").slice(0, 1)];
  return (
    <Section tone="paper" aura="warm">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div><Eyebrow>Insights</Eyebrow><Heading title="Learn from the" accent="field." className="mt-4" /></div>
        <div className="flex gap-1"><Button href="/blog/sales" variant="ghost">Sales Blog</Button><Button href="/blog/tech" variant="ghost">Tech Blog</Button></div>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">{items.map((p) => <PostCard key={p.slug} p={p} />)}</div>
    </Section>
  );
}

export function PostCard({ p }: { p: Post }) {
  return (
    <Link href={`/blog/${p.slug}/`} className="group flex h-full flex-col rounded-3xl bg-cream p-7 transition hover:border-ink/40 hover:bg-white">
      <span className="text-xs font-semibold text-ink">{blogMeta[p.kind].name}</span>
      <h3 className="font-display mt-3 text-2xl leading-snug text-ink">{p.title}</h3>
      <p className="mt-3 flex-1 text-muted">{p.excerpt}</p>
      <p className="mt-5 text-sm text-muted">{fmtDate(p.date)} · {p.readMins} min read</p>
    </Link>
  );
}

export async function NewsletterSection() {
  const all = await getAllPosts();
  const latest = (k: "tech" | "sales") => all.filter((p) => p.kind === k).sort((x, y) => y.date.localeCompare(x.date))[0];
  const issues = [
    { day: "Friday", tag: "Tech", color: "#6D4AFF", post: latest("tech") },
    { day: "Saturday", tag: "Sales", color: "#ee3b2b", post: latest("sales") },
  ];
  return (
    <section data-aura="blush" className="border-y border-[#ddd2bc] bg-[#ece4d4] px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 overflow-hidden rounded-3xl border border-line bg-white p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <Eyebrow>The Marichi Weekly</Eyebrow>
          <h2 className="font-display mt-4 max-w-xl text-4xl leading-[1.05] text-ink sm:text-5xl">One useful email on selling and building.</h2>
          <p className="mt-4 max-w-lg text-lg text-muted">Sales playbooks and engineering notes from the Marichi team. Pick the topics you want.</p>
          <div className="mt-7"><Newsletter source="home" /></div>
        </div>
        <div className="relative rounded-2xl bg-cream p-5 sm:p-6" aria-label="Latest issues">
          <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-muted">Next in your inbox</p>
          <ul className="mt-4 space-y-3">
            {issues.map((i, n) => i.post && (
              <li key={i.tag} style={{ transform: `rotate(${n ? 0.8 : -0.8}deg)` }}>
                <Link href={`${blogMeta[i.post.kind].path}/`} className="group block rounded-xl border border-line bg-white p-4 transition duration-300 hover:-translate-y-1 hover:rotate-0 hover:shadow-lg">
                  <span className="flex items-center justify-between text-[12px] font-bold uppercase tracking-[0.14em]">
                    <span style={{ color: i.color }}>{i.tag}</span><span className="text-muted">Every {i.day}</span>
                  </span>
                  <span className="font-display mt-2 block text-xl leading-snug text-ink">{i.post.title}</span>
                  <span className="mt-1 block text-[14px] text-muted">{i.post.readMins} min read · {fmtDate(i.post.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

type Partner = { name: string; role: string; color: string; span: string; logo: { kind: "mask"; src: string } | { kind: "img"; src: string; w: number; h: number } | { kind: "text" } };
// Big tiles for the infrastructure partners, smaller ones below. Each tile is tinted in the brand's own colour.
const partners: Partner[] = [
  { name: "Google Cloud Platform", role: "Cloud infrastructure", color: "#4285F4", span: "lg:col-span-4", logo: { kind: "mask", src: "/brand/partners/googlecloud.svg" } },
  { name: "ICICI Bank", role: "Banking", color: "#F37E20", span: "lg:col-span-4", logo: { kind: "img", src: "/brand/partners/icici.svg", w: 190, h: 38 } },
  { name: "Meta", role: "WhatsApp messaging", color: "#0866FF", span: "lg:col-span-4", logo: { kind: "mask", src: "/brand/partners/meta.svg" } },
  { name: "Anthropic", role: "AI", color: "#D2603F", span: "lg:col-span-3", logo: { kind: "mask", src: "/brand/partners/anthropic.svg" } },
  { name: "OpenAI", role: "AI", color: "#10A37F", span: "lg:col-span-3", logo: { kind: "mask", src: "/brand/partners/openai.svg" } },
  { name: "Sarvam AI", role: "AI", color: "#E8590C", span: "lg:col-span-3", logo: { kind: "img", src: "/brand/partners/sarvam.svg", w: 150, h: 24 } },
  { name: "Digitax", role: "Technology partner", color: "#6D4AFF", span: "lg:col-span-3", logo: { kind: "text" } },
];

function PartnerTile({ p, big }: { p: Partner; big: boolean }) {
  return (
    <div
      style={{ ["--c" as string]: p.color, background: "color-mix(in srgb, var(--c) 11%, #fff)", borderColor: "color-mix(in srgb, var(--c) 24%, #fff)" }}
      className={`pt-tile group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border p-6 text-[var(--c)] transition duration-500 hover:!bg-[var(--c)] hover:text-white sm:p-7 ${big ? "min-h-[13rem]" : "min-h-[10.5rem]"}`}
    >
      <span aria-hidden="true" className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full opacity-[0.16] transition duration-500 group-hover:scale-150 group-hover:opacity-25" style={{ background: "currentColor" }} />
      <p className="relative text-[12px] font-bold uppercase tracking-[0.14em] opacity-80">{p.role}</p>
      <div className="relative flex items-center gap-3">
        {p.logo.kind === "mask" && (
          <>
            <span role="img" aria-label={`${p.name} logo`} className={`block shrink-0 transition duration-500 group-hover:scale-110 ${big ? "h-12 w-12" : "h-9 w-9"}`} style={{ background: "currentColor", WebkitMaskImage: `url(${p.logo.src})`, maskImage: `url(${p.logo.src})`, WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }} />
            <span className={`font-display leading-tight text-ink transition duration-500 group-hover:text-white ${big ? "text-3xl" : "text-2xl"}`}>{p.name}</span>
          </>
        )}
        {p.logo.kind === "img" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.logo.src} alt={`${p.name} logo`} width={p.logo.w} height={p.logo.h} className={`h-auto w-auto max-w-[85%] transition duration-500 group-hover:scale-105 group-hover:brightness-0 group-hover:invert ${big ? "max-h-14" : "max-h-9"}`} />
        )}
        {p.logo.kind === "text" && <span className={`font-display leading-none transition duration-500 group-hover:scale-105 ${big ? "text-5xl" : "text-4xl"}`}>{p.name}</span>}
      </div>
    </div>
  );
}

export function PartnersSection() {
  return (
    <section data-aura="warm" className="border-y border-line bg-white py-16 sm:py-24" aria-label="Partners">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <Eyebrow>Partners</Eyebrow>
              <Heading title="The companies" accent="behind the platform." className="mt-4" />
            </div>
            <p className="max-w-md text-lg text-muted">Cloud, banking, AI and messaging. The partners we build on.</p>
          </div>
        </Reveal>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12" aria-label={partners.map((p) => p.name).join(", ")}>
          {partners.map((p, i) => (
            <Reveal as="li" key={p.name} delay={i * 70} className={p.span}><PartnerTile p={p} big={i < 3} /></Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
