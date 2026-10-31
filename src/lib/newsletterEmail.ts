import { blogMeta, fmtDate, type Post } from "@/lib/blog";
import { fullName, getProduct } from "@/lib/content";
import { postPath } from "@/lib/paths";
import { absoluteUrl, site } from "@/lib/site";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const unsubscribeUrl = (token: string) => `${site.url}/api/newsletter/unsubscribe/?token=${encodeURIComponent(token)}`;

export const subjectFor = (p: Post) => p.title;

// Where the footer links point. Our own engine uses per-person links; Mailchimp swaps these placeholders for each
// contact's real unsubscribe link, profile link and the audience's postal address when it sends.
export type Links = { unsubscribe: string; manage: string; address: string };
export const mcLinks: Links = { unsubscribe: "*|UNSUB|*", manage: "*|UPDATE_PROFILE|*", address: "*|LIST:ADDRESS|*" };
const ownLinks = (token: string): Links => ({ unsubscribe: unsubscribeUrl(token), manage: absoluteUrl("/newsletter/"), address: `${site.offices[0].address}, ${site.offices[0].city}` });

// Weekly email for one post: the intro and first section in full, the other headings as a teaser,
// then a button to the full post. Inline styles only, because email clients ignore stylesheets.
export function renderIssue(p: Post, token: string) { return renderIssueWith(p, ownLinks(token)); }
export const renderIssueMc = (p: Post) => renderIssueWith(p, mcLinks);

function renderIssueWith(p: Post, links: Links) {
  const meta = blogMeta[p.kind];
  const link = absoluteUrl(postPath(p));
  const first = p.body[0];
  const rest = p.body.slice(1).filter((s) => s.h);
  const prod = p.cta && getProduct(p.cta.product);
  const un = links.unsubscribe;

  const html = `<!doctype html><html><body style="margin:0;background:#f3f1ec;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#15130f">
<div style="display:none;max-height:0;overflow:hidden">${esc(p.excerpt)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ec;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#15130f;padding:22px 32px"><span style="color:#f6f1e8;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">The Marichi Weekly</span><span style="color:#ee3b2b;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase"> · ${esc(meta.name)}</span></td></tr>
<tr><td style="padding:36px 32px 8px">
<p style="margin:0 0 10px;font-size:13px;color:#6a665e">${esc(fmtDate(p.date))} · ${p.readMins} min read</p>
<h1 style="margin:0;font-size:30px;line-height:1.15;letter-spacing:-.02em">${esc(p.title)}</h1>
<p style="margin:16px 0 0;font-size:17px;line-height:1.55;color:#4a463f">${esc(p.excerpt)}</p></td></tr>
${first ? `<tr><td style="padding:24px 32px 0">${first.h ? `<h2 style="margin:0 0 8px;font-size:20px">${esc(first.h)}</h2>` : ""}${first.p.map((t) => `<p style="margin:0 0 12px;font-size:16px;line-height:1.6;color:#2b2722">${esc(t)}</p>`).join("")}</td></tr>` : ""}
${rest.length ? `<tr><td style="padding:12px 32px 0"><p style="margin:0 0 8px;font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#6a665e">Also in this post</p><ul style="margin:0;padding-left:18px;color:#2b2722;font-size:16px;line-height:1.7">${rest.map((s) => `<li>${esc(s.h)}</li>`).join("")}</ul></td></tr>` : ""}
<tr><td style="padding:28px 32px 8px"><a href="${link}" style="display:inline-block;background:#15130f;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:14px 28px;border-radius:999px">Read the full post →</a></td></tr>
${prod && p.cta ? `<tr><td style="padding:20px 32px 0"><div style="background:#f3f1ec;border-radius:12px;padding:18px 20px"><p style="margin:0 0 8px;font-size:15px;font-weight:700">${esc(p.cta.text)}</p><a href="${absoluteUrl(`/products/${prod.slug}/`)}" style="color:#ee3b2b;font-weight:700;font-size:15px;text-decoration:none">About ${esc(fullName(prod))} →</a></div></td></tr>` : ""}
<tr><td style="padding:32px;border-top:1px solid #e5e1d8;margin-top:28px"><p style="margin:0;font-size:12.5px;line-height:1.6;color:#6a665e">You're getting this because you subscribed to The Marichi Weekly (${esc(meta.name)}).<br><a href="${un}" style="color:#6a665e">Unsubscribe</a> · <a href="${links.manage}" style="color:#6a665e">Manage topics</a><br>${esc(site.legalName)} · ${links.address}</p></td></tr>
</table></td></tr></table></body></html>`;

  const text = [`THE MARICHI WEEKLY · ${meta.name.toUpperCase()}`, "", p.title, fmtDate(p.date), "", p.excerpt, "", first ? `${first.h ? first.h + "\n" : ""}${first.p.join("\n\n")}` : "", "", rest.length ? `Also in this post:\n${rest.map((s) => `- ${s.h}`).join("\n")}` : "", "", `Read the full post: ${link}`, "", "---", `Unsubscribe: ${un}`, `${site.legalName}, ${links.address}`].filter((x) => x !== undefined).join("\n");
  return { subject: subjectFor(p), html, text, unsubscribe: un };
}

// ---- Custom (hand-written) newsletters ----
const S = {
  h2: "margin:28px 0 10px;font-size:22px;line-height:1.25;color:#15130f", h3: "margin:22px 0 8px;font-size:18px;line-height:1.3;color:#15130f",
  p: "margin:0 0 16px;font-size:16px;line-height:1.65;color:#2b2722", ul: "margin:0 0 16px;padding-left:22px;font-size:16px;line-height:1.65;color:#2b2722", ol: "margin:0 0 16px;padding-left:22px;font-size:16px;line-height:1.65;color:#2b2722",
  li: "margin:0 0 6px", blockquote: "margin:0 0 16px;padding:4px 0 4px 16px;border-left:3px solid #ee3b2b;font-size:17px;line-height:1.6;color:#15130f",
  a: "color:#ee3b2b;text-decoration:underline", img: "max-width:100%;height:auto;border-radius:12px;display:block;margin:0 0 16px", hr: "border:0;border-top:1px solid #e5e1d8;margin:24px 0",
  code: "background:#f3f1ec;border-radius:4px;padding:1px 5px;font-family:Menlo,Consolas,monospace;font-size:14px", pre: "margin:0 0 16px;padding:14px 16px;background:#15130f;color:#f6f1e8;border-radius:10px;overflow:auto;font-family:Menlo,Consolas,monospace;font-size:14px;line-height:1.55", strong: "color:#15130f",
} as const;

// Email apps ignore stylesheets, so give each (already sanitised) tag its styling inline.
export function emailize(html: string) {
  return html.replace(/<(h2|h3|p|ul|ol|li|blockquote|a|img|hr|code|pre|strong)(\s[^>]*)?(\/?)>/gi, (_m, tag: string, attrs = "", slash = "") => `<${tag}${attrs} style="${S[tag.toLowerCase() as keyof typeof S]}"${slash}>`);
}

export function renderCustom(o: { subject: string; preheader?: string; html: string; links: Links }) {
  const body = emailize(o.html);
  const html = `<!doctype html><html><body style="margin:0;background:#f3f1ec;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:#15130f">
<div style="display:none;max-height:0;overflow:hidden">${esc(o.preheader ?? "")}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f1ec;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#15130f;padding:22px 32px"><span style="color:#f6f1e8;font-size:13px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">The Marichi Weekly</span></td></tr>
<tr><td style="padding:36px 32px 8px"><h1 style="margin:0 0 20px;font-size:30px;line-height:1.15;letter-spacing:-.02em">${esc(o.subject)}</h1>${body}</td></tr>
<tr><td style="padding:24px 32px 32px;border-top:1px solid #e5e1d8"><p style="margin:0;font-size:12.5px;line-height:1.6;color:#6a665e">You're getting this because you subscribed to The Marichi Weekly.<br><a href="${o.links.unsubscribe}" style="color:#6a665e">Unsubscribe</a> · <a href="${o.links.manage}" style="color:#6a665e">Manage topics</a><br>${esc(site.legalName)} · ${o.links.address}</p></td></tr>
</table></td></tr></table></body></html>`;
  return { subject: o.subject, html };
}
