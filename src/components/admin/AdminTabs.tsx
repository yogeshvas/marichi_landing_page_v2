import Link from "next/link";

export default function AdminTabs({ active }: { active: "blog" | "newsletter" }) {
  const t = [["blog", "Blog posts", "/admin/blog/"], ["newsletter", "Newsletter", "/admin/newsletter/"]] as const;
  return (
    <nav aria-label="Admin sections" className="mb-8 inline-flex rounded-xl bg-cream p-1">
      {t.map(([k, l, h]) => <Link key={k} href={h} aria-current={active === k ? "page" : undefined} className={`rounded-lg px-4 py-2 text-[14px] font-semibold transition ${active === k ? "bg-white text-ink" : "text-muted hover:text-ink"}`}>{l}</Link>)}
    </nav>
  );
}
