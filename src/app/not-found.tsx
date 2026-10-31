import Link from "next/link";
import { Container } from "@/components/ui";
import { fullName, products } from "@/lib/content";
import { getAllPosts } from "@/lib/postsStore";
import { postPath, productPath } from "@/lib/paths";

export const metadata = { title: "Page not found", robots: { index: false, follow: true } };

export default async function NotFound() {
  const posts = await getAllPosts();
  return (
    <section className="pb-16 pt-24 sm:pt-32">
      <Container>
        <p className="text-[14px] font-medium text-muted">404</p>
        <h1 className="font-display mt-3 text-5xl text-ink sm:text-6xl">That page isn&apos;t here.</h1>
        <p className="mt-4 max-w-xl text-xl text-muted">It may have moved. Try one of these instead.</p>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-ink">Products</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2">{products.map((p) => <li key={p.id}><Link href={productPath(p)} className="text-[16px] font-medium text-ink hover:text-red">{fullName(p)}</Link></li>)}</ul>
          </div>
          <div>
            <h2 className="font-display text-2xl text-ink">Popular posts</h2>
            <ul className="mt-4 space-y-2">{posts.slice(0, 4).map((p) => <li key={p.slug}><Link href={postPath(p)} className="text-[16px] font-medium text-ink hover:text-red">{p.title}</Link></li>)}</ul>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-5 text-[15px] font-semibold"><Link href="/" className="text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">Home</Link><Link href="/pricing/" className="text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">Pricing</Link><Link href="/contact/" className="text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">Contact</Link></div>
      </Container>
    </section>
  );
}
