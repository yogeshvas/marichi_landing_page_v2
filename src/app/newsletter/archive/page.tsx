import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import { PageHero, Section } from "@/components/ui";
import { fmtDate } from "@/lib/blog";
import { getIssues, issuePath, kindName } from "@/lib/newsletter";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMeta("The Marichi Weekly archive", "Every past issue of The Marichi Weekly, newest first.", "/newsletter/archive/");

export default async function ArchivePage() {
  const issues = await getIssues();
  return (
    <>
      <PageHero crumbs={[{ name: "Newsletter", href: "/newsletter/" }, { name: "Archive", href: "/newsletter/archive/" }]} eyebrow="Archive" title="Every issue of" accent="The Marichi Weekly." lead="Read past issues on the web, newest first." />
      <Section>
        {issues.length === 0 ? (
          <p className="text-xl text-muted">The first issue goes out soon. Subscribe below and you won&apos;t miss it.</p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {issues.map((i) => (
              <li key={i.slug}>
                <Link href={issuePath(i)} className="flex flex-col gap-1 py-6 transition hover:bg-cream/60 sm:flex-row sm:items-baseline sm:gap-8">
                  <span className="w-52 shrink-0 text-[14px] text-muted">#{i.number} · {kindName(i.kind)} · {fmtDate(i.sentAt)}</span>
                  <span><span className="font-display text-2xl text-ink">{i.title}</span><span className="mt-1 block text-[16px] text-muted">{i.post.excerpt}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-12"><Newsletter source="archive" /></div>
      </Section>
    </>
  );
}
