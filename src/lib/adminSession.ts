import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

// Admin login for the blog editor. The password is ADMIN_PASSWORD (falls back to CRON_SECRET, so one
// secret is enough to start). A successful login sets an httpOnly cookie holding an HMAC of the secret.
export const COOKIE = "mc_admin";
const secret = () => process.env.ADMIN_PASSWORD ?? process.env.CRON_SECRET ?? "";
export const adminConfigured = () => secret().length >= 16;
const token = () => createHmac("sha256", secret()).update("marichi-admin-v1").digest("hex");
const same = (a: string, b: string) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };

export const checkPassword = (given: string) => adminConfigured() && same(given, secret());
export const sessionToken = token;
export async function isAdminSession() {
  if (!adminConfigured()) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  return !!v && same(v, token());
}
