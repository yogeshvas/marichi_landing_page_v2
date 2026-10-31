import type { MetadataRoute } from "next";
import { caseStudies, industries, products, solutions } from "@/lib/content";
import { getAllPosts } from "@/lib/postsStore";
import { getIssues, issuePath } from "@/lib/newsletter";
import { featurePath, featuresOf, featuresPath } from "@/lib/features";
import { authorPath, caseStudyPath, industryPath, postPath, pricingPath, productPath, tagPath, solutionPath } from "@/lib/paths";
import { flowPath, flows } from "@/lib/flows";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const issues = await getIssues();
  const posts = await getAllPosts();
  const now = new Date();
  const entry = (path: string, priority: number, lastModified: Date = now) => ({ url: absoluteUrl(path), lastModified, changeFrequency: "monthly" as const, priority });
  const tags = [...new Set(posts.flatMap((p) => p.tags))];
  const authors = [...new Set(posts.map((p) => p.author))];
  return [
    entry("/", 1),
    entry("/products/", 0.9),
    ...products.flatMap((p) => [entry(productPath(p), 0.8), entry(pricingPath(p), 0.8), entry(featuresPath(p), 0.7), ...featuresOf(p).map((f) => entry(featurePath(p, f), 0.6))]),
    entry("/pricing/", 0.9),
    entry("/solutions/", 0.8),
    ...solutions.map((s) => entry(solutionPath(s), 0.7)),
    entry("/solutions/industries/", 0.8),
    ...industries.map((i) => entry(industryPath(i), 0.7)),
    entry("/resources/", 0.7),
    entry("/resources/case-studies/", 0.8),
    ...caseStudies.map((c) => entry(caseStudyPath(c), 0.7)),
    entry("/whatsapp-flows/", 0.8),
    ...flows.map((f) => entry(flowPath(f), 0.7)),
    entry("/get-started/", 0.8),
    entry("/blog/", 0.7),
    entry("/blog/sales/", 0.7),
    entry("/blog/tech/", 0.7),
    ...posts.map((p) => entry(postPath(p), 0.6, new Date(p.date))),
    ...tags.map((t) => entry(tagPath(t), 0.4)),
    ...authors.map((a) => entry(authorPath(a), 0.4)),
    entry("/newsletter/", 0.7),
    entry("/newsletter/archive/", 0.6),
    ...issues.map((i) => entry(issuePath(i), 0.5, new Date(i.sentAt))),
    entry("/about/", 0.7),
    entry("/contact/", 0.6),
    entry("/contact-sales/", 0.7),
    entry("/privacy/", 0.3),
  ];
}
