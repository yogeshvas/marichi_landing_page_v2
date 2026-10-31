import { getSent } from "@/lib/newsletterDb";
import { queueFor, schedule } from "@/lib/newsletterSchedule";
import { getAllPosts } from "@/lib/postsStore";
import { products, fullName } from "@/lib/content";

// What the editor's side panel needs to explain the newsletter timing.
export async function editorMeta() {
  const [sent, all] = await Promise.all([getSent(), getAllPosts()]);
  const days = schedule();
  const dayOf = (k: "sales" | "tech") => Object.entries(days).find(([, v]) => v === k)?.[0] ?? null;
  return {
    sendDay: { sales: dayOf("sales"), tech: dayOf("tech") },
    waiting: { sales: queueFor("sales", sent, all).length, tech: queueFor("tech", sent, all).length },
    products: products.map((p) => ({ id: p.id, name: fullName(p) })),
  };
}
export type EditorMeta = Awaited<ReturnType<typeof editorMeta>>;
