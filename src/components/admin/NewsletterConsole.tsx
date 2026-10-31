"use client";

import { EditorContent } from "@tiptap/react";
import { useEffect, useMemo, useState } from "react";
import { Toolbar, useRichEditor } from "@/components/admin/RichText";
import type { AudienceInfo } from "@/lib/mailchimp";

type Post = { slug: string; title: string; kind: "sales" | "tech"; date: string; sent: boolean };
type Hist = { id: string; title: string; status: string; at: string; recipients: number; report: string };
type Next = { kind: "tech" | "sales"; name: string; day: string; title: string | null; when: string | null; waiting: number };
type Aud = "all" | "tech" | "sales";

const field = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-ink/40";
const lab = "mb-1.5 block text-[13px] font-semibold text-ink";
const statusLabel: Record<string, string> = { sent: "Sent", sending: "Sending", schedule: "Scheduled" };

export default function NewsletterConsole({ connected, error, audience, history, next, tz, posts }: { connected: boolean; error: string; audience: AudienceInfo | null; history: Hist[]; next: Next[]; tz: string; posts: Post[] }) {
  const [tab, setTab] = useState<"post" | "custom">("post");
  const [slug, setSlug] = useState(posts.find((p) => !p.sent)?.slug ?? posts[0]?.slug ?? "");
  const [again, setAgain] = useState(false);
  const [aud, setAud] = useState<Aud>("all");
  const [subject, setSubject] = useState("");
  const [preview, setPreview] = useState("");
  const [html, setHtml] = useState("");
  const [testTo, setTestTo] = useState("");
  const [at, setAt] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const editor = useRichEditor({ initialHtml: "", onChange: setHtml, minHeight: "16rem", placeholder: "Write your newsletter. Tip: type ## for a heading, - for a list." });

  useEffect(() => { try { setTestTo(localStorage.getItem("mc_test_email") ?? ""); } catch {} }, []);
  const post = posts.find((p) => p.slug === slug);
  const count = useMemo(() => (audience ? (aud === "all" ? audience.subscribed : audience[aud]) : 0), [audience, aud]);
  const words = editor?.storage.characterCount?.words?.() ?? 0;
  const label = aud === "all" ? "everyone" : `${aud} subscribers`;

  async function run(action: "test" | "send" | "schedule") {
    if (!connected) return;
    if (action === "send" && !window.confirm(`Send "${tab === "post" ? post?.title : subject}" to ${count} ${label} now?\n\nThis cannot be undone.`)) return;
    if (action === "test") try { localStorage.setItem("mc_test_email", testTo); } catch {}
    setBusy(action); setMsg(null);
    try {
      const body = { mode: tab, action, confirm: action === "send", audience: aud, testTo, scheduleAt: action === "schedule" && at ? new Date(at).toISOString() : undefined, ...(tab === "post" ? { slug, again } : { subject, previewText: preview, html }) };
      const res = await fetch("/api/admin/newsletter/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const d = await res.json().catch(() => ({ ok: false, message: "Unexpected reply from the server." }));
      setMsg({ ok: res.ok && d.ok, text: d.message });
      if (res.ok && action !== "test") setTimeout(() => window.location.reload(), 2500);
    } catch { setMsg({ ok: false, text: "Network error. Nothing was sent." }); }
    finally { setBusy(null); }
  }

  const btn = "rounded-lg px-5 py-3 text-[15px] font-semibold transition disabled:opacity-50";
  const off = !connected || !!busy;

  return (
    <div className="mt-8 space-y-8">
      {/* Connection */}
      {!connected ? (
        <div className="rounded-2xl border border-[#f1d9a0] bg-[#fff8e6] p-6">
          <h2 className="font-display text-xl text-ink">Connect Mailchimp to start</h2>
          <p className="mt-2 max-w-2xl text-[15px] text-ink/75">Add these three settings in your hosting environment (Vercel: Settings, Environment Variables), then redeploy. Until then the page is read-only.</p>
          <ul className="mt-3 space-y-1 text-[14px] text-ink/80"><li><code className="rounded bg-white px-1.5 py-0.5">MAILCHIMP_API_KEY</code> a key from Mailchimp, Account, Extras, API keys</li><li><code className="rounded bg-white px-1.5 py-0.5">MAILCHIMP_AUDIENCE_ID</code> from Audience, Settings, Audience name and defaults</li><li><code className="rounded bg-white px-1.5 py-0.5">MAILCHIMP_REPLY_TO</code> an email address that replies should go to</li></ul>
        </div>
      ) : error ? (
        <div role="alert" className="rounded-2xl border border-[#f4b9b2] bg-[#fdeeeb] p-5 text-[15px] text-ink">Mailchimp is configured but returned an error: <strong>{error}</strong>. Check the API key and audience ID.</div>
      ) : audience && (
        <div className="grid gap-4 sm:grid-cols-4">
          {[["Audience", audience.name], ["Subscribers", String(audience.subscribed)], ["Tech topic", String(audience.tech)], ["Sales topic", String(audience.sales)]].map(([k, v]) => <div key={k} className="rounded-2xl border border-line bg-white p-5"><p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">{k}</p><p className="font-display mt-2 truncate text-2xl text-ink">{v}</p></div>)}
        </div>
      )}

      {/* Automatic schedule */}
      <div>
        <h2 className="font-display text-2xl text-ink">Goes out automatically</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {next.map((n) => (
            <div key={n.kind} className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center justify-between text-[13px] font-semibold text-muted"><span>{n.name} · every {n.day}</span><span className="rounded-full bg-cream px-2.5 py-1 text-[12px] text-ink">{n.waiting} waiting</span></p>
              {n.title ? <><p className="font-display mt-3 text-xl leading-snug text-ink">{n.title}</p><p className="mt-1 text-[14px] text-muted">Next send: <strong className="text-ink">{n.when}</strong> ({tz})</p></> : <p className="mt-3 text-[15px] text-muted">Nothing waiting. Publish a post and it goes out next {n.day}.</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Manual send */}
      <div className="rounded-2xl border border-line bg-white">
        <div className="border-b border-line p-5 sm:p-6">
          <h2 className="font-display text-2xl text-ink">Send something now</h2>
          <div className="mt-4 inline-flex rounded-xl bg-cream p-1" role="tablist" aria-label="What to send">
            {([["post", "A blog post"], ["custom", "Write a newsletter"]] as const).map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setMsg(null); }} className={`rounded-lg px-4 py-2 text-[14px] font-semibold transition ${tab === k ? "bg-white text-ink" : "text-muted hover:text-ink"}`}>{l}</button>)}
          </div>
        </div>

        <div className="grid gap-8 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_21rem]">
          <div>
            {tab === "post" ? (
              <>
                <label className={lab} htmlFor="nl-post">Blog post</label>
                <select id="nl-post" value={slug} onChange={(e) => { setSlug(e.target.value); setAgain(false); }} className={field}>{posts.map((p) => <option key={p.slug} value={p.slug}>{p.sent ? "✓ " : ""}{p.title} ({p.kind === "tech" ? "Tech" : "Sales"}, {p.date})</option>)}</select>
                {post?.sent && <label className="mt-3 flex items-center gap-2 text-[14px] text-ink"><input type="checkbox" checked={again} onChange={(e) => setAgain(e.target.checked)} />This post was already emailed. Send it again.</label>}
                <p className="mt-3 text-[13.5px] leading-snug text-muted">The email is the same one that goes out on schedule. Sending a post by hand takes it out of the weekly queue, so it will not be sent twice.</p>
              </>
            ) : (
              <>
                <label className={lab} htmlFor="nl-subject">Subject</label>
                <input id="nl-subject" value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={150} placeholder="What the email is about" className={field} />
                <label className={`${lab} mt-4`} htmlFor="nl-pre">Preview text <span className="font-normal text-muted">(shown after the subject in the inbox)</span></label>
                <input id="nl-pre" value={preview} onChange={(e) => setPreview(e.target.value)} maxLength={150} className={field} />
                <p className={`${lab} mt-4`}>Message <span className="font-normal text-muted">({words} words)</span></p>
                <div className="rounded-2xl border border-line bg-white">{editor && <Toolbar editor={editor} />}<EditorContent editor={editor} /></div>
              </>
            )}
          </div>

          <aside className="space-y-4 lg:self-start">
            <div>
              <label className={lab} htmlFor="nl-aud">Send to</label>
              <select id="nl-aud" value={aud} onChange={(e) => setAud(e.target.value as Aud)} className={field}>
                <option value="all">Everyone{audience ? ` (${audience.subscribed})` : ""}</option>
                <option value="tech">Tech topic{audience ? ` (${audience.tech})` : ""}</option>
                <option value="sales">Sales topic{audience ? ` (${audience.sales})` : ""}</option>
              </select>
            </div>
            <div className="rounded-xl bg-cream p-4">
              <label className={lab} htmlFor="nl-test">Send a test first</label>
              <input id="nl-test" type="email" value={testTo} onChange={(e) => setTestTo(e.target.value)} placeholder="you@company.com" className={field} />
              <button type="button" onClick={() => run("test")} disabled={off || !testTo} className={`${btn} mt-2 w-full border border-line bg-white text-ink hover:border-ink`}>{busy === "test" ? "Sending test…" : "Send test email"}</button>
            </div>
            <div className="rounded-xl bg-cream p-4">
              <label className={lab} htmlFor="nl-at">Schedule <span className="font-normal text-muted">(needs a paid Mailchimp plan)</span></label>
              <input id="nl-at" type="datetime-local" step={900} value={at} onChange={(e) => setAt(e.target.value)} className={field} />
              <button type="button" onClick={() => run("schedule")} disabled={off || !at} className={`${btn} mt-2 w-full border border-line bg-white text-ink hover:border-ink`}>{busy === "schedule" ? "Scheduling…" : "Schedule it"}</button>
            </div>
            <button type="button" onClick={() => run("send")} disabled={off || (tab === "post" ? !post : false)} className={`${btn} w-full bg-ink text-white hover:bg-red`}>{busy === "send" ? "Sending…" : `Send now to ${audience ? count : "…"} ${label}`}</button>
            {msg && <p role={msg.ok ? "status" : "alert"} className={`text-[14px] ${msg.ok ? "text-[#1d6b45]" : "text-red"}`}>{msg.text}</p>}
          </aside>
        </div>
      </div>

      {/* History */}
      <div>
        <h2 className="font-display text-2xl text-ink">Recent sends</h2>
        {history.length === 0 ? <p className="mt-3 text-muted">Nothing has been sent yet.</p> : (
          <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[34rem] text-left text-[15px]">
              <thead className="border-b border-line text-[12px] uppercase tracking-[0.08em] text-muted"><tr><th className="p-4">Email</th><th className="p-4">Status</th><th className="p-4">Date</th><th className="p-4">Recipients</th><th className="p-4" /></tr></thead>
              <tbody className="divide-y divide-line">
                {history.map((h) => <tr key={h.id}><td className="max-w-[24rem] p-4 font-medium text-ink">{h.title}</td><td className="p-4 text-muted">{statusLabel[h.status] ?? h.status}</td><td className="p-4 text-muted">{new Date(h.at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td><td className="p-4 text-muted tabular-nums">{h.recipients || "·"}</td><td className="p-4 text-right"><a href={h.report} target="_blank" rel="noopener noreferrer" className="text-[13px] font-semibold text-ink underline decoration-ink/30 underline-offset-4 hover:text-red">Report ↗</a></td></tr>)}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
