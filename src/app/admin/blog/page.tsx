import Link from "next/link";
import { redirect } from "next/navigation";
import DeletePostButton from "@/components/admin/DeletePostButton";
import AdminTabs from "@/components/admin/AdminTabs";
import LogoutButton from "@/components/admin/LogoutButton";
import { Container } from "@/components/ui";
import { isAdminSession } from "@/lib/adminSession";
import { blogMeta, fmtDate, posts as seed } from "@/lib/blog";
import { getSent } from "@/lib/newsletterDb";
import { fmtSendDate, queueFor, sendDates } from "@/lib/newsletterSchedule";
import { getAllPosts, isPublic, listAuthored } from "@/lib/postsStore";

export const dynamic = "force-dynamic";

export default async function AdminBlog() {
  if (!(await isAdminSession())) redirect("/admin/login/");
  const [authored, sent, live] = await Promise.all([listAuthored(), getSent(), getAllPosts()]);
  const sentSlugs = new Map(sent.map((s) => [s.postSlug, s.sentAt]));
  const queue = { sales: queueFor("sales", sent, live), tech: queueFor("tech", sent, live) };
  const when = { sales: sendDates("sales", queue.sales.length), tech: sendDates("tech", queue.tech.length) };

  const newsletter = (slug: string, kind: "sales" | "tech", published: boolean) => {
    if (sentSlugs.has(slug)) return <span className="text-muted">Emailed {fmtDate(sentSlugs.get(slug)!)}</span>;
    if (!published) return <span className="text-muted">Not in newsletter</span>;
    const i = queue[kind].findIndex((p) => p.slug === slug);
    return i >= 0 && when[kind][i] ? <span className="font-medium text-ink">Queued · {fmtSendDate(when[kind][i])}</span> : <span className="text-muted">Queued</span>;
  };

  return (
    <section className="pb-16 pt-24 sm:pt-32">
      <Container>
        <AdminTabs active="blog" />
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-muted">Admin</p><h1 className="font-display mt-2 text-4xl text-ink sm:text-5xl">Blog posts</h1></div>
          <div className="flex items-center gap-5"><LogoutButton /><Link href="/admin/blog/new/" className="rounded-lg bg-ink px-6 py-3.5 text-[15px] font-semibold text-white transition hover:bg-red">Write a post</Link></div>
        </div>
        <p className="mt-4 max-w-2xl text-muted">Published posts appear on the blog and join the newsletter queue automatically: Tech goes out on Fridays and Sales on Saturdays, oldest first.</p>

        <h2 className="font-display mt-12 text-2xl text-ink">Written in the editor</h2>
        {authored.length === 0 ? (
          <p className="mt-4 rounded-2xl border border-dashed border-line bg-white p-8 text-muted">No posts yet. Click <strong className="text-ink">Write a post</strong> to start.</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[44rem] text-left text-[15px]">
              <thead className="border-b border-line text-[12px] uppercase tracking-[0.08em] text-muted"><tr><th className="p-4">Title</th><th className="p-4">Blog</th><th className="p-4">Status</th><th className="p-4">Newsletter</th><th className="p-4" /></tr></thead>
              <tbody className="divide-y divide-line">
                {authored.map((a) => {
                  const pub = isPublic(a);
                  return (
                    <tr key={a.id}>
                      <td className="max-w-[22rem] p-4"><Link href={`/admin/blog/${a.id}/`} className="font-semibold text-ink hover:text-red">{a.title}</Link><p className="mt-0.5 text-[13px] text-muted">{fmtDate(a.date)} · /{a.slug}/</p></td>
                      <td className="p-4 text-muted">{blogMeta[a.kind].name}</td>
                      <td className="p-4"><span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${pub ? "bg-[#e7f6ec] text-[#1d6b45]" : a.status === "published" ? "bg-[#eaf1ff] text-[#1d4fd7]" : "bg-cream text-muted"}`}>{pub ? "Published" : a.status === "published" ? "Scheduled" : "Draft"}</span></td>
                      <td className="p-4 text-[14px]">{newsletter(a.slug, a.kind, pub)}</td>
                      <td className="p-4"><div className="flex items-center justify-end gap-4">{pub && <Link href={`/blog/${a.slug}/`} className="text-[13px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">View</Link>}<Link href={`/admin/blog/${a.id}/`} className="text-[13px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">Edit</Link><DeletePostButton id={a.id} title={a.title} /></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <h2 className="font-display mt-12 text-2xl text-ink">Built-in posts</h2>
        <p className="mt-1 text-[15px] text-muted">These live in the code (<code>src/lib/blog.ts</code>), so they can&apos;t be edited here. They are in the newsletter queue like any other post.</p>
        <ul className="mt-4 divide-y divide-line rounded-2xl border border-line bg-white">
          {seed.map((p) => <li key={p.slug} className="flex flex-wrap items-center justify-between gap-3 p-4 text-[15px]"><span className="font-medium text-ink">{p.title}<span className="ml-2 text-[13px] font-normal text-muted">{blogMeta[p.kind].name} · {fmtDate(p.date)}</span></span><span className="text-[14px]">{newsletter(p.slug, p.kind, true)}</span></li>)}
        </ul>
      </Container>
    </section>
  );
}
