import { notFound, redirect } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { isAdminSession } from "@/lib/adminSession";
import { editorMeta } from "@/lib/adminEditorMeta";
import { getAuthored } from "@/lib/postsStore";

export const dynamic = "force-dynamic";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminSession())) redirect("/admin/login/");
  const a = await getAuthored((await params).id);
  if (!a) notFound();
  return <PostEditor meta={await editorMeta()} initial={a} />;
}
