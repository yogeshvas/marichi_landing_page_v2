import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import { Breadcrumbs, Container } from "@/components/ui";
import { fmtDate } from "@/lib/blog";
import { getIssues, issuePath, kindName } from "@/lib/newsletter";
import { postPath } from "@/lib/paths";
import { pageMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug;
  const i = (await getIssues()).find((x) => x.slug === slug);
  return i ? pageMeta(`The Marichi Weekly #${i.number}: ${i.title}`, i.post.excerpt, issuePath(i)) : {};
}

export default async function IssuePage({ params }: Props) {
  const slug = (await params).slug;
  const i = (await getIssues()).find((x) => x.slug === slug);
  if (!i) notFound();
  return (
    <article className="pb-16 pt-24 sm:pt-32">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: "Newsletter", href: "/newsletter/" }, { name: "Archive", href: "/newsletter/archive/" }, { name: `Issue ${i.number}`, href: issuePath(i) }]} />
        <p className="mt-10 text-[14px] font-medium text-muted">The Marichi Weekly · #{i.number} · {kindName(i.kind)} · {fmtDate(i.sentAt)}</p>
        <h1 className="font-display mt-3 text-4xl text-ink sm:text-5xl">{i.title}</h1>
        <p className="mt-5 text-xl text-muted">{i.post.excerpt}</p>
        {i.post.body[0] && <div className="mt-10"><h2 className="font-display text-2xl text-ink">{i.post.body[0].h}</h2>{i.post.body[0].p.map((t) => <p key={t} className="mt-4 text-lg leading-relaxed text-ink/80">{t}</p>)}</div>}
        <Link href={postPath(i.post)} className="mt-8 inline-block rounded-full bg-ink px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-red">Read the full post →</Link>
        <div className="mt-14 rounded-2xl bg-cream p-8"><h2 className="font-display text-2xl text-ink">Get the next one in your inbox</h2><div className="mt-5"><Newsletter source={`issue-${i.number}`} compact /></div></div>
      </Container>
    </article>
  );
}
