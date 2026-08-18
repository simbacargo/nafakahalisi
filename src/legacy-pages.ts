import swHome from "./legacy/sw-home.html?raw";
import swProducts from "./legacy/sw-products.html?raw";
import swServices from "./legacy/sw-services.html?raw";
import swAbout from "./legacy/sw-about.html?raw";
import swContact from "./legacy/sw-contact.html?raw";
import enHome from "./legacy/en-home.html?raw";
import enProducts from "./legacy/en-products.html?raw";
import enServices from "./legacy/en-services.html?raw";
import enAbout from "./legacy/en-about.html?raw";
import enContact from "./legacy/en-contact.html?raw";
import notFound from "./legacy/not-found.html?raw";
import type { Language, PageKey } from "./content";

export const legacyPages: Record<Language, Record<PageKey, string>> = {
  sw: { home: swHome, products: swProducts, services: swServices, about: swAbout, contact: swContact },
  en: { home: enHome, products: enProducts, services: enServices, about: enAbout, contact: enContact },
};

export const legacyNotFound = notFound;

export function extractBody(documentHtml: string) {
  return documentHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "";
}

export function extractBodyClass(documentHtml: string) {
  return documentHtml.match(/<body(?:\s+class="([^"]*)")?[^>]*>/i)?.[1] ?? "";
}

export function extractJsonLd(documentHtml: string) {
  return documentHtml.match(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
}
