import type { MetadataRoute } from "next";
import { pagePaths, siteUrl } from "./page-data";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-08-17");

  return (Object.keys(pagePaths.sw) as Array<keyof typeof pagePaths.sw>).flatMap((page) => [
    {
      url: `${siteUrl}${pagePaths.sw[page]}`,
      lastModified: updated,
      changeFrequency: page === "home" ? "weekly" : "monthly",
      priority: page === "home" ? 1 : 0.8,
      alternates: { languages: { sw: `${siteUrl}${pagePaths.sw[page]}`, en: `${siteUrl}${pagePaths.en[page]}` } },
    },
    {
      url: `${siteUrl}${pagePaths.en[page]}`,
      lastModified: updated,
      changeFrequency: page === "home" ? "weekly" : "monthly",
      priority: page === "home" ? 0.9 : 0.7,
      alternates: { languages: { sw: `${siteUrl}${pagePaths.sw[page]}`, en: `${siteUrl}${pagePaths.en[page]}` } },
    },
  ]);
}
