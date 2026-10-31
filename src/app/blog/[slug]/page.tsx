import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Newsletter from "@/components/Newsletter";
import { WaButton } from "@/components/WhatsApp";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { blogMeta, fmtDate, posts as seedPosts } from "@/lib/blog";
import { getAllPosts, getPostBySlug } from "@/lib/postsStore";
import { authorPath, postPath, tagPath } from "@/lib/paths";
import { fullName, getProduct } from "@/lib/content";
import { pageMeta } from "@/lib/seo";
import { absoluteUrl, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => seedPosts.map((p) => ({ slug: p.slug })); // new posts are rendered on first visit
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getPostBySlug((await params).slug);
  if (!p) return {};
  return { ...pageMeta(p.title, p.excerpt, postPath(p)), openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: p.date } };
}

export default async function PostPage({ params }: Props) {
  const p = await getPostBySlug((await params).slug);
  if (!p) notFound();
  const m = blogMeta[p.kind];
  const prod = p.cta && getProduct(p.cta.product);
  const more = (await getAllPosts()).filter((x) => x.kind === p.kind && x.slug !== p.slug).slice(0, 2);
  return (
    <article className="px-0 pb-16 pt-24 sm:pt-32">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "BlogPosting", headline: p.title, description: p.excerpt, datePublished: p.date, dateModified: p.date, author: { "@type": "Organization", name: p.author }, publisher: { "@type": "Organization", name: site.name, url: site.url }, mainEntityOfPage: absoluteUrl(postPath(p)), keywords: p.tags.join(", ") }} />
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: "Blog", href: "/blog" }, { name: m.name, href: m.path }, { name: p.title, href: postPath(p) }]} />
        <p className="mt-10 text-sm font-semibold text-ink">{m.name}</p>
        <h1 className="font-display mt-3 text-4xl leading-tight text-ink sm:text-6xl">{p.title}</h1>
        <p className="mt-5 text-xl text-muted">{p.excerpt}</p>
        <p className="mt-6 text-sm text-muted"><Link href={authorPath(p.author)} className="font-medium text-ink hover:text-red">{p.author}</Link> · <time dateTime={p.date}>{fmtDate(p.date)}</time> · {p.readMins} min read</p>
        <p className="mt-3 flex flex-wrap gap-2">{p.tags.map((t) => <Link key={t} href={tagPath(t)} className="rounded-full border border-line px-3 py-1 text-[13px] font-medium text-muted hover:border-ink/40 hover:text-ink">{t}</Link>)}</p>
        {p.html ? (
          <div className="prose-blog mt-12" dangerouslySetInnerHTML={{ __html: p.html }} />
        ) : (
          <div className="mt-12 space-y-10">
            {p.body.map((s) => (
              <section key={s.h}>
                <h2 className="font-display text-2xl text-ink sm:text-3xl">{s.h}</h2>
                {s.p.map((t, i) => <p key={i} className="mt-4 text-lg leading-relaxed text-ink/80">{t}</p>)}
              </section>
            ))}
          </div>
        )}
        {prod && p.cta && (
          <aside className="mt-14 rounded-3xl bg-cream p-8 border border-line">
            <p className="font-display text-2xl text-ink">{p.cta.text}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <WaButton message={`Hi Marichi Labs, I read your article and I'd like to know more about ${fullName(prod)}.`} source={`blog-${p.slug}`} />
              <Link href={`/products/${prod.slug}`} className="px-4 py-3.5 text-[17px] font-medium text-ink hover:underline">About {fullName(prod)} ›</Link>
            </div>
          </aside>
        )}
        <div className="mt-14 rounded-3xl bg-ink p-8 text-white"><h2 className="font-display text-2xl">Get the next one in your inbox</h2><div className="mt-5"><Newsletter source={`post-${p.slug}`} dark compact /></div></div>
        {more.length > 0 && <div className="mt-14"><h2 className="font-display text-2xl text-ink">More from the {m.name}</h2><ul className="mt-4 space-y-3">{more.map((x) => <li key={x.slug}><Link href={postPath(x)} className="font-medium text-ink hover:text-ink">{x.title} ›</Link></li>)}</ul></div>}
      </Container>
    </article>
  );
}
