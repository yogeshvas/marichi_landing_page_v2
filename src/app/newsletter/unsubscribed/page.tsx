import Link from "next/link";
import { Container } from "@/components/ui";

export const metadata = { title: "You're unsubscribed", robots: { index: false, follow: true } };

export default function UnsubscribedPage() {
  return (
    <section className="pb-16 pt-24 sm:pt-32">
      <Container className="max-w-2xl">
        <h1 className="font-display text-4xl text-ink sm:text-5xl">You&apos;re unsubscribed.</h1>
        <p className="mt-4 text-xl text-muted">You won&apos;t get any more emails from The Marichi Weekly. If that was a mistake, you can rejoin any time.</p>
        <Link href="/newsletter/" className="mt-8 inline-block text-[15px] font-semibold text-ink underline decoration-ink/30 underline-offset-[6px] hover:text-red">Subscribe again →</Link>
      </Container>
    </section>
  );
}
