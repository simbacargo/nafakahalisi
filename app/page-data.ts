import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";

export const siteUrl = "https://nafakahalisi.com";

const files = {
  sw: {
    home: "index.html",
    products: "products/index.html",
    services: "services/index.html",
    about: "about/index.html",
    contact: "contact/index.html",
  },
  en: {
    home: "en/index.html",
    products: "en/products/index.html",
    services: "en/services/index.html",
    about: "en/about/index.html",
    contact: "en/contact/index.html",
  },
} as const;

export type Language = keyof typeof files;
export type PageName = keyof (typeof files)[Language];

export interface SitePage {
  bodyClass: string;
  body: string;
  jsonLd?: string;
}

function source(language: Language, page: PageName) {
  return fs.readFileSync(path.join(process.cwd(), files[language][page]), "utf8");
}

function match(html: string, pattern: RegExp, fallback = "") {
  return html.match(pattern)?.[1]?.trim() ?? fallback;
}

export function getPage(language: Language, page: PageName): SitePage {
  const html = source(language, page);

  return {
    bodyClass: match(html, /<body(?:\s+class="([^"]*)")?[^>]*>/i),
    body: match(html, /<body[^>]*>([\s\S]*?)<\/body>/i),
    jsonLd: match(html, /<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i) || undefined,
  };
}

export function getMetadata(language: Language, page: PageName): Metadata {
  const html = source(language, page);
  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const description = match(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = match(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const sw = match(html, /<link\s+rel="alternate"\s+hreflang="sw"\s+href="([^"]*)"/i);
  const en = match(html, /<link\s+rel="alternate"\s+hreflang="en"\s+href="([^"]*)"/i);
  const ogTitle = match(html, /<meta\s+property="og:title"\s+content="([^"]*)"/i, title);
  const ogDescription = match(html, /<meta\s+property="og:description"\s+content="([^"]*)"/i, description);
  const ogImage = match(html, /<meta\s+property="og:image"\s+content="([^"]*)"/i);

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: { canonical, languages: { sw, en } },
    openGraph: {
      type: "website",
      title: ogTitle,
      description: ogDescription,
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
      siteName: "Nafaka Halisi Tanzania",
      locale: language === "en" ? "en_TZ" : "sw_TZ",
    },
  };
}

export const pagePaths = {
  sw: { home: "/", products: "/products/", services: "/services/", about: "/about/", contact: "/contact/" },
  en: { home: "/en/", products: "/en/products/", services: "/en/services/", about: "/en/about/", contact: "/en/contact/" },
} as const;
