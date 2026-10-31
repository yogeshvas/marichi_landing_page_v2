import { redirect } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { isAdminSession } from "@/lib/adminSession";
import { editorMeta } from "@/lib/adminEditorMeta";

export const dynamic = "force-dynamic";

export default async function NewPost() {
  if (!(await isAdminSession())) redirect("/admin/login/");
  return <PostEditor meta={await editorMeta()} />;
}
