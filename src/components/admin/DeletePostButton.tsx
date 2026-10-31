"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeletePostButton({ id, title, redirect }: { id: string; title: string; redirect?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function del() {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/posts/?id=${id}`, { method: "DELETE" });
    if (res.ok) { if (redirect) router.push(redirect); router.refresh(); } else { setBusy(false); alert("Could not delete the post."); }
  }
  return <button type="button" onClick={del} disabled={busy} className="text-[13px] font-semibold text-red underline decoration-red/30 underline-offset-4 hover:decoration-red disabled:opacity-50">{busy ? "Deleting…" : "Delete"}</button>;
}
