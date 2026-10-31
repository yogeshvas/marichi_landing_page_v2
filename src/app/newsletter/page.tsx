import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import { Container, Eyebrow, Heading, Section } from "@/components/ui";
import { getIssues, issuePath, kindName } from "@/lib/newsletter";
import { fmtDate } from "@/lib/blog";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta("The Marichi Weekly: tech and sales insights in 5 minutes", "Engineering notes on Fridays and sales playbooks on Saturdays, from Marichi Labs. Pick tech, sales or both.", "/newsletter/");

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const issues = await getIssues();
  return (
    <>
      <section className="border-b border-line px-5 pb-10 pt-24 sm:px-8 sm:pt-36">
        <Container className="max-w-4xl px-0 sm:px-0">
          <Eyebrow>The Marichi Weekly</Eyebrow>
          <Heading as="h1" title="Tech and sales insights" accent="in 5 minutes." className="mt-5 !text-5xl sm:!text-6xl" />
          <p className="mt-5 max-w-2xl text-xl text-muted">Engineering notes on Fridays, sales playbooks on Saturdays. One short email each, no filler.</p>
          <ul className="mt-8 grid gap-3 text-[16px] text-ink/80 sm:grid-cols-3">
            {["Field sales and WhatsApp selling playbooks", "How we build payments, messaging and AI", "Short enough to read between meetings"].map((b) => <li key={b} className="rounded-2xl border border-line bg-white p-5">{b}</li>)}
          </ul>
          <div className="mt-10"><Newsletter source="newsletter-page" /></div>
        </Container>
      </section>
      <Section>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl text-ink">Latest issues</h2>
          <Link href="/newsletter/archive/" className="text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">Full archive →</Link>
        </div>
        {issues.length === 0 ? (
          <p className="mt-6 text-lg text-muted">The first issue goes out this Friday.</p>
        ) : (
          <ul className="mt-8 grid gap-4 md:grid-cols-3">
            {issues.slice(0, 6).map((i) => (
              <li key={i.slug}>
                <Link href={issuePath(i)} className="block h-full rounded-2xl border border-line bg-white p-6 transition hover:border-ink/40">
                  <p className="text-[13px] font-medium text-muted">#{i.number} · {kindName(i.kind)} · {fmtDate(i.sentAt)}</p>
                  <h3 className="font-display mt-3 text-xl text-ink">{i.title}</h3>
                  <p className="mt-2 text-[15px] text-muted">{i.post.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
