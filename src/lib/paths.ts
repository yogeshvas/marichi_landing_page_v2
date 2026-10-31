import type { CaseStudy, Industry, Product, Solution } from "@/lib/content";
import type { Post } from "@/lib/blog";

// One place for every internal URL, so the site hierarchy can change without hunting through pages.
export const productPath = (p: Product) => `/products/${p.slug}/`;
export const pricingPath = (p: Product) => `/products/${p.slug}/pricing/`;
export const solutionPath = (s: Solution) => `/solutions/use-cases/${s.slug}/`;
export const industryPath = (i: Industry) => `/solutions/industries/${i.slug}/`;
export const caseStudyPath = (c: CaseStudy) => `/resources/case-studies/${c.slug}/`;
export const postPath = (p: Post) => `/blog/${p.slug}/`;
export const tagPath = (t: string) => `/blog/tag/${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`;
export const authorSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
export const authorPath = (name: string) => `/blog/author/${authorSlug(name)}/`;
