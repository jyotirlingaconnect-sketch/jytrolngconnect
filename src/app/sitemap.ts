import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jyotirlingconnect.com";

// Fixed dates so search engines can trust lastModified. Bump a page's date
// when its content meaningfully changes.
const pages: {
  path: string;
  lastModified: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
}[] = [
  { path: "", lastModified: "2026-07-10", changeFrequency: "weekly", priority: 1 },
  { path: "/about", lastModified: "2026-10-18", changeFrequency: "monthly", priority: 0.8 },
  { path: "/history", lastModified: "2026-10-18", changeFrequency: "yearly", priority: 0.8 },
  { path: "/fleet", lastModified: "2026-10-18", changeFrequency: "monthly", priority: 0.8 },
  { path: "/packages", lastModified: "2026-10-18", changeFrequency: "weekly", priority: 0.9 },
  { path: "/gallery", lastModified: "2026-10-18", changeFrequency: "weekly", priority: 0.7 },
  { path: "/contact", lastModified: "2026-10-18", changeFrequency: "monthly", priority: 0.7 },
  { path: "/booking", lastModified: "2026-07-24", changeFrequency: "monthly", priority: 0.9 },
  { path: "/testimonials", lastModified: "2026-10-18", changeFrequency: "weekly", priority: 0.6 },
  { path: "/why-us", lastModified: "2026-10-18", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacy-policy", lastModified: "2026-10-18", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms-conditions", lastModified: "2026-10-18", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map(({ path, lastModified, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(lastModified),
    changeFrequency,
    priority,
  }));
}
