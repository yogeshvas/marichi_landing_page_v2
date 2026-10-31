import { NextResponse, type NextRequest } from "next/server";

// Reads the visitor's country from the hosting platform's edge headers and remembers it in a
// cookie so pages can show the right currency. Nothing is stored server-side.
// Locally there are no such headers: test with  /?country=ZM  /?country=IN  /?country=AE
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const query = req.nextUrl.searchParams.get("country");
  const header = req.headers.get("x-vercel-ip-country") ?? req.headers.get("cf-ipcountry") ?? req.headers.get("x-country-code");
  const country = (query ?? header ?? "").toUpperCase();
  if (/^[A-Z]{2}$/.test(country) && country !== "XX" && country !== "T1") {
    res.cookies.set("mc_country", country, { path: "/", maxAge: 60 * 60 * 24 * 30, sameSite: "lax" });
    if (query) res.cookies.delete("mc_currency"); // a ?country= test overrides a saved manual choice
  }
  return res;
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
