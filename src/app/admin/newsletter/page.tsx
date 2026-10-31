import { redirect } from "next/navigation";
import AdminTabs from "@/components/admin/AdminTabs";
import LogoutButton from "@/components/admin/LogoutButton";
import NewsletterConsole from "@/components/admin/NewsletterConsole";
import { Container } from "@/components/ui";
import { isAdminSession } from "@/lib/adminSession";
import { blogMeta, fmtDate } from "@/lib/blog";
import { audienceInfo, campaigns, mcConfigured, reportUrl, type AudienceInfo } from "@/lib/mailchimp";
import { getSent } from "@/lib/newsletterDb";
import { fmtSendDate, queueFor, schedule, sendDates, TZ } from "@/lib/newsletterSchedule";
import { getAllPosts } from "@/lib/postsStore";

export const dynamic = "force-dynamic";

export default async function AdminNewsletter() {
  if (!(await isAdminSession())) redirect("/admin/login/");
  const connected = mcConfigured();
  let audience: AudienceInfo | null = null, error = "";
  let history: { id: string; title: string; status: string; at: string; recipients: number; report: string }[] = [];
  if (connected) {
    try {
      const [a, c] = await Promise.all([audienceInfo(), campaigns()]);
      audience = a;
      history = c.filter((x) => x.status !== "save").slice(0, 15).map((x) => ({ id: x.id, title: x.title.replace(/^Weekly \[(tech|sales)\] /, (_m, k) => `${blogMeta[k as "tech" | "sales"].name}: `), status: x.status, at: x.at, recipients: x.recipients, report: reportUrl(x.webId) }));
    } catch (e) { error = e instanceof Error ? e.message : "Could not reach Mailchimp."; }
  }
  const [posts, sent] = await Promise.all([getAllPosts(), getSent().catch(() => [])]);
  const sentSlugs = new Set(sent.map((s) => s.postSlug));
  const days = schedule();
  const next = (["tech", "sales"] as const).map((k) => { const q = queueFor(k, sent, posts); return { kind: k, name: blogMeta[k].name, day: Object.entries(days).find(([, v]) => v === k)?.[0] ?? "", title: q[0]?.title ?? null, when: q[0] ? fmtSendDate(sendDates(k, 1)[0]) : null, waiting: q.length }; });

  return (
    <section className="pb-20 pt-24 sm:pt-32">
      <Container>
        <div className="flex items-start justify-between"><AdminTabs active="newsletter" /><LogoutButton /></div>
        <h1 className="font-display text-4xl text-ink sm:text-5xl">Newsletter</h1>
        <p className="mt-3 max-w-2xl text-muted">The weekly emails go out by themselves. Use this page to send something extra, or to send a post early.</p>
        <NewsletterConsole
          connected={connected} error={error} audience={audience} history={history}
          next={next} tz={TZ}
          posts={posts.map((p) => ({ slug: p.slug, title: p.title, kind: p.kind, date: fmtDate(p.date), sent: sentSlugs.has(p.slug) }))}
        />
      </Container>
    </section>
  );
}
