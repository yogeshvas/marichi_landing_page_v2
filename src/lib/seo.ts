import type { Metadata } from "next";

export function pageMeta(title: string, description: string, rawPath: string, keywords?: string[]): Metadata {
  const path = rawPath === "/" || rawPath.endsWith("/") ? rawPath : `${rawPath}/`;
  return {
    title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph: { title: `${title} | Marichi Labs`, description, url: path, type: "website" },
    twitter: { title: `${title} | Marichi Labs`, description },
  };
}
