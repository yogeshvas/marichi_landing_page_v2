import type { NextConfig } from "next";

const productIds = ["pulse", "moves", "pays", "talks", "grows", "ops", "card", "assure", "sign"];
const useCases = ["conversations", "business-intelligence", "ai-copilot", "workflow-automation"];

const nextConfig: NextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      // products: short ids -> marichi-<id>
      ...productIds.map((id) => ({ source: `/products/${id}`, destination: `/products/marichi-${id}/`, permanent: true })),
      // solutions hierarchy
      ...useCases.map((s) => ({ source: `/solutions/${s}`, destination: `/solutions/use-cases/${s}/`, permanent: true })),
      { source: "/solutions/use-cases", destination: "/solutions/", permanent: true },
      { source: "/industries", destination: "/solutions/industries/", permanent: true },
      { source: "/industries/:slug", destination: "/solutions/industries/:slug/", permanent: true },
      // case studies live under /resources
      { source: "/case-studies", destination: "/resources/case-studies/", permanent: true },
      { source: "/case-studies/:slug", destination: "/resources/case-studies/:slug/", permanent: true },
      // blog posts get flat URLs
      { source: "/blog/sales/:slug", destination: "/blog/:slug/", permanent: true },
      { source: "/blog/tech/:slug", destination: "/blog/:slug/", permanent: true },
    ];
  },
};

export default nextConfig;
