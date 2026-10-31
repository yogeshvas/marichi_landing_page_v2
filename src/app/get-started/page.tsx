import Quiz from "@/components/Quiz";
import { Container } from "@/components/ui";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta(
  "Find the right Marichi product for your business",
  "Answer four quick questions and get a recommended product plan, then continue the conversation with our team on WhatsApp.",
  "/get-started",
);

export default function GetStartedPage() {
  return (
    <section className="px-0 pb-16 pt-24 sm:pt-32">
      <Container className="max-w-3xl">
        <p className="text-sm font-semibold text-ink">Find my best fit</p>
        <p className="mt-2 text-lg text-muted">Takes about a minute. No sign-up.</p>
        <div className="mt-8"><Quiz /></div>
      </Container>
    </section>
  );
}
