import Link from "next/link";
import { Container } from "@/components/ui";
import { getAllPosts } from "@/lib/postsStore";
import { postPath } from "@/lib/paths";

export const metadata = { title: "Subscription confirmed", robots: { index: false, follow: true } };

export default async function ConfirmedPage() {
  const posts = await getAllPosts();
  return (
    <section className="pb-16 pt-24 sm:pt-32">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">You&apos;re subscribed.</h1>
        <p className="mt-4 text-xl text-muted">Thanks for confirming. Tech issues land on Fridays and Sales issues on Saturdays. While you wait, read these:</p>
        <ul className="mt-8 space-y-3">
          {posts.slice(0, 3).map((p) => <li key={p.slug}><Link href={postPath(p)} className="font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">{p.title}</Link></li>)}
        </ul>
      </Container>
    </section>
  );
}
