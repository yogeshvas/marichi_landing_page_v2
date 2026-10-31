"use client";

import { EditorContent } from "@tiptap/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import DeletePostButton from "@/components/admin/DeletePostButton";
import { Toolbar, useRichEditor } from "@/components/admin/RichText";
import LogoutButton from "@/components/admin/LogoutButton";
import { Container } from "@/components/ui";
import type { EditorMeta } from "@/lib/adminEditorMeta";
import type { Authored } from "@/lib/postsStore";

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80).replace(/^-|-$/g, "");
const today = () => new Date().toISOString().slice(0, 10);
const field = "w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[15px] text-ink outline-none transition focus:border-ink/40";
const label = "mb-1.5 block text-[13px] font-semibold text-ink";

type Props = { meta: EditorMeta; initial?: Authored };

export default function PostEditor({ meta, initial }: Props) {
  const [id, setId] = useState(initial?.id);
  const [kind, setKind] = useState<"sales" | "tech">(initial?.kind ?? "tech");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(!!initial);
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [date, setDate] = useState(initial?.date ?? today());
  const [author, setAuthor] = useState(initial?.author ?? "Marichi Labs");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [ctaProduct, setCtaProduct] = useState(initial?.cta?.product ?? "");
  const [ctaText, setCtaText] = useState(initial?.cta?.text ?? "");
  const [html, setHtml] = useState(initial?.html ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");
  const [preview, setPreview] = useState(false);
  const [busy, setBusy] = useState<null | "draft" | "published">(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [restored, setRestored] = useState(false);
  const draftKey = `mc_post_draft_${initial?.id ?? "new"}`;
  const loaded = useRef(false);

  const editor = useRichEditor({ initialHtml: initial?.html, onChange: (h) => { setHtml(h); setDirty(true); } });

  // Restore an unsaved local draft of a brand-new post (e.g. after a crash or an accidental refresh).
  useEffect(() => {
    if (!editor || loaded.current) return;
    loaded.current = true;
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw || initial) return;
      const d = JSON.parse(raw);
      if (!d.title && !d.html) return;
      setTitle(d.title ?? ""); setSlug(d.slug ?? ""); setSlugTouched(!!d.slug); setExcerpt(d.excerpt ?? ""); setKind(d.kind ?? "tech"); setTags(d.tags ?? []);
      editor.commands.setContent(d.html ?? ""); setHtml(d.html ?? ""); setRestored(true);
    } catch {}
  }, [editor, draftKey, initial]);

  // Keep a local copy while typing.
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => { try { localStorage.setItem(draftKey, JSON.stringify({ title, slug, excerpt, kind, tags, html })); } catch {} }, 700);
    return () => clearTimeout(t);
  }, [dirty, draftKey, title, slug, excerpt, kind, tags, html]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => { if (dirty) { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const touch = <T,>(set: (v: T) => void) => (v: T) => { set(v); setDirty(true); };
  const words = editor?.storage.characterCount?.words?.() ?? 0;
  const mins = Math.max(1, Math.ceil(words / 200));
  const scheduled = status === "published" && date > today();
  const waiting = meta.waiting[kind];
  const sendDay = meta.sendDay[kind];

  async function save(next: "draft" | "published") {
    setBusy(next); setMsg(null);
    try {
      const res = await fetch("/api/admin/posts/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, kind, title, slug, excerpt, date, author, tags, ctaProduct, ctaText, html, status: next }) });
      const d = await res.json();
      if (!res.ok) { setMsg({ ok: false, text: d.error ?? "Could not save." }); return; }
      setId(d.id); setStatus(next); setDirty(false);
      try { localStorage.removeItem(draftKey); } catch {}
      if (!initial && !id) window.history.replaceState(null, "", `/admin/blog/${d.id}/`);
      setMsg({ ok: true, text: next === "published" ? (date > today() ? `Scheduled for ${date}.` : "Published. It is live on the blog and in the newsletter queue.") : "Draft saved." });
    } catch { setMsg({ ok: false, text: "Network error. Your text is safe in this window; try again." }); }
    finally { setBusy(null); }
  }

  const addTag = () => { const t = tagInput.trim().replace(/,$/, ""); if (t && !tags.includes(t) && tags.length < 6) { setTags([...tags, t]); setDirty(true); } setTagInput(""); };
  const seoTitle = useMemo(() => `${title || "Post title"} | Marichi Labs`, [title]);

  return (
    <section className="pb-20 pt-24 sm:pt-28">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/admin/blog/" className="text-[14px] font-semibold text-muted hover:text-ink">← All posts</Link>
          <div className="flex items-center gap-4"><span className="text-[13px] text-muted">{dirty ? "Unsaved changes" : id ? "All changes saved" : ""}</span><LogoutButton /></div>
        </div>

        {restored && <p role="status" className="mt-4 rounded-xl bg-[#fff8e6] px-4 py-3 text-[14px] text-[#7a5a14]">We restored the draft you were writing. Save it to keep it.</p>}

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_21rem]">
          {/* Writing area */}
          <div>
            <label className="sr-only" htmlFor="post-title">Title</label>
            <textarea id="post-title" rows={2} value={title} placeholder="Post title" maxLength={140}
              onChange={(e) => { touch(setTitle)(e.target.value); if (!slugTouched) setSlug(slugify(e.target.value)); }}
              className="font-display w-full resize-none bg-transparent text-4xl leading-tight text-ink outline-none placeholder:text-ink/25 sm:text-5xl" />

            <div className="mt-4 flex items-center justify-between">
              <div className="inline-flex rounded-xl bg-cream p-1" role="tablist" aria-label="Write or preview">
                {[["Write", false], ["Preview", true]].map(([l, v]) => <button key={String(l)} role="tab" aria-selected={preview === v} onClick={() => setPreview(v as boolean)} className={`rounded-lg px-4 py-1.5 text-[14px] font-semibold transition ${preview === v ? "bg-white text-ink" : "text-muted hover:text-ink"}`}>{l as string}</button>)}
              </div>
              <p className="text-[13px] text-muted tabular-nums">{words} words · {mins} min read</p>
            </div>

            <div className="mt-3 rounded-2xl border border-line bg-white">
              {editor && !preview && <Toolbar editor={editor} />}
              <div className={preview ? "hidden" : ""}><EditorContent editor={editor} /></div>
              {preview && (
                <article className="px-5 py-6 sm:px-8 sm:py-8">
                  <p className="text-sm font-semibold text-ink">{kind === "sales" ? "Sales Blog" : "Tech Blog"}</p>
                  <h1 className="font-display mt-2 text-4xl leading-tight text-ink">{title || "Untitled"}</h1>
                  {excerpt && <p className="mt-4 text-xl text-muted">{excerpt}</p>}
                  <p className="mt-4 text-sm text-muted">{author} · {date} · {mins} min read</p>
                  <div className="prose-blog mt-8" dangerouslySetInnerHTML={{ __html: html || "<p>Nothing written yet.</p>" }} />
                </article>
              )}
            </div>
          </div>

          {/* Side panel */}
          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-col gap-2">
                <button type="button" onClick={() => save("published")} disabled={!!busy} className="rounded-lg bg-ink px-5 py-3 text-[15px] font-semibold text-white transition hover:bg-red disabled:opacity-60">{busy === "published" ? "Publishing…" : status === "published" ? (scheduled ? "Update schedule" : "Update post") : date > today() ? "Schedule post" : "Publish"}</button>
                <button type="button" onClick={() => save("draft")} disabled={!!busy} className="rounded-lg border border-line px-5 py-3 text-[15px] font-semibold text-ink transition hover:border-ink disabled:opacity-60">{busy === "draft" ? "Saving…" : status === "published" ? "Unpublish (save as draft)" : "Save draft"}</button>
              </div>
              {msg && <p role={msg.ok ? "status" : "alert"} className={`mt-3 text-[14px] ${msg.ok ? "text-[#1d6b45]" : "text-red"}`}>{msg.text}</p>}
              <p className="mt-3 text-[12.5px] leading-snug text-muted">Status: <strong className="text-ink">{status === "draft" ? "Draft" : scheduled ? "Scheduled" : "Published"}</strong>{id && status === "published" && !scheduled && <> · <Link className="underline underline-offset-2" href={`/blog/${slug}/`} target="_blank">View post</Link></>}</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <label className={label} htmlFor="kind">Blog</label>
              <select id="kind" value={kind} onChange={(e) => touch(setKind)(e.target.value as "sales" | "tech")} className={field}><option value="tech">Tech Blog</option><option value="sales">Sales Blog</option></select>
              <p className="mt-2 text-[12.5px] leading-snug text-muted">{sendDay ? <>Emailed on <strong className="text-ink">{sendDay}s</strong>. {waiting > 0 ? `${waiting} ${waiting === 1 ? "post is" : "posts are"} already waiting, so this one goes out after ${waiting === 1 ? "it" : "them"}.` : "Nothing is waiting, so it goes out on the next one."}</> : "No newsletter day is set for this blog."}</p>
              <label className={`${label} mt-4`} htmlFor="date">Publish date</label>
              <input id="date" type="date" value={date} onChange={(e) => touch(setDate)(e.target.value)} className={field} />
              <p className="mt-1.5 text-[12.5px] text-muted">A future date schedules the post.</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <label className={label} htmlFor="excerpt">Summary <span className="font-normal text-muted">({excerpt.length}/220)</span></label>
              <textarea id="excerpt" rows={3} maxLength={220} value={excerpt} onChange={(e) => touch(setExcerpt)(e.target.value)} placeholder="One or two sentences. Shown on cards, in Google and in the email." className={field} />
              <label className={`${label} mt-4`} htmlFor="slug">Web address</label>
              <div className="flex items-center rounded-xl border border-line bg-white pl-3 text-[14px] text-muted focus-within:border-ink/40">/blog/<input id="slug" value={slug} onChange={(e) => { setSlugTouched(true); touch(setSlug)(slugify(e.target.value)); }} className="min-w-0 flex-1 bg-transparent py-2.5 pr-3 text-ink outline-none" />/</div>
              <label className={`${label} mt-4`} htmlFor="tags">Tags <span className="font-normal text-muted">(up to 6)</span></label>
              <div className="flex flex-wrap gap-1.5">{tags.map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[13px] font-medium text-ink">{t}<button type="button" aria-label={`Remove ${t}`} onClick={() => { setTags(tags.filter((x) => x !== t)); setDirty(true); }} className="text-muted hover:text-ink">×</button></span>)}</div>
              <input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }} onBlur={addTag} placeholder="Type a tag, press Enter" className={`${field} mt-2`} />
              <label className={`${label} mt-4`} htmlFor="author">Author name</label>
              <input id="author" value={author} onChange={(e) => touch(setAuthor)(e.target.value)} className={field} />
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <label className={label} htmlFor="cta">Promote a product at the end <span className="font-normal text-muted">(optional)</span></label>
              <select id="cta" value={ctaProduct} onChange={(e) => touch(setCtaProduct)(e.target.value)} className={field}><option value="">None</option>{meta.products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
              {ctaProduct && <input value={ctaText} maxLength={140} onChange={(e) => touch(setCtaText)(e.target.value)} placeholder="e.g. Run WhatsApp follow-ups with MarichiTalks." className={`${field} mt-2`} />}
            </div>

            <div className="rounded-2xl border border-line bg-cream p-5">
              <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-muted">How it looks in Google</p>
              <p className="mt-2 truncate text-[16px] font-medium text-[#1a0dab]">{seoTitle}</p>
              <p className="truncate text-[13px] text-[#1d6b45]">marichilabs.com/blog/{slug || "…"}/</p>
              <p className="mt-0.5 line-clamp-2 text-[13px] text-muted">{excerpt || "Your summary appears here."}</p>
            </div>

            {id && <div className="px-1"><DeletePostButton id={id} title={title || "this post"} redirect="/admin/blog/" /></div>}
          </aside>
        </div>
      </Container>
    </section>
  );
}
