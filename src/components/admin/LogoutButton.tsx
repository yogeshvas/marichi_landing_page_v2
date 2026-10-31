"use client";

export default function LogoutButton() {
  return <button type="button" onClick={async () => { await fetch("/api/admin/logout/", { method: "POST" }); window.location.href = "/admin/login/"; }} className="text-[14px] font-semibold text-muted underline decoration-ink/20 underline-offset-4 hover:text-ink">Sign out</button>;
}
