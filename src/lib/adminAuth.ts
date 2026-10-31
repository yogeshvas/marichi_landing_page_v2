import { timingSafeEqual } from "node:crypto";

// Protects the newsletter admin endpoints. Send  Authorization: Bearer <CRON_SECRET>  (Vercel Cron does
// this automatically), or for quick testing in a browser add  ?secret=<CRON_SECRET>  to the URL.
export function isAdmin(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return false; // never open the endpoints when no strong secret is configured
  const given = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? new URL(req.url).searchParams.get("secret") ?? "";
  const a = Buffer.from(given), b = Buffer.from(secret);
  return a.length === b.length && timingSafeEqual(a, b);
}
export const deny = () => new Response(JSON.stringify({ ok: false, error: "Unauthorized. Set CRON_SECRET (16+ characters) and send it as a Bearer token." }), { status: 401, headers: { "Content-Type": "application/json" } });
