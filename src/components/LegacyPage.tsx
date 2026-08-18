import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRoute, PHONE, routes, SITE_URL, type Language, type PageKey } from "../content";
import { extractBody, extractBodyClass, extractJsonLd, legacyNotFound, legacyPages } from "../legacy-pages";
import { HeroGrainScene } from "./HeroGrainScene";

function ensureMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement(attributes.rel ? "link" : "meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => element!.setAttribute(key, value));
}

function usePageMetadata(language: Language, page?: PageKey) {
  const { pathname } = useLocation();
  useEffect(() => {
    const route = page ? routes.find((item) => item.language === language && item.page === page) : undefined;
    document.documentElement.lang = language;
    document.title = route?.title ?? (language === "en" ? "Page not found | Nafaka Halisi" : "Ukurasa haujapatikana | Nafaka Halisi");
    const description = route?.description ?? "Nafaka Halisi Tanzania Limited";
    const canonical = route ? `${SITE_URL}${route.path}` : `${SITE_URL}${pathname}`;
    ensureMeta('meta[name="description"]', { name: "description", content: description });
    ensureMeta('meta[property="og:title"]', { property: "og:title", content: document.title });
    ensureMeta('meta[property="og:description"]', { property: "og:description", content: description });
    ensureMeta('meta[property="og:url"]', { property: "og:url", content: canonical });
    ensureMeta('meta[property="og:image"]', { property: "og:image", content: `${SITE_URL}${route?.image ?? "/assets/images/hero-grain-mill.webp"}` });
    ensureMeta('link[rel="canonical"]', { rel: "canonical", href: canonical });
    if (route) {
      ensureMeta('link[rel="alternate"][hreflang="sw"]', { rel: "alternate", hreflang: "sw", href: `${SITE_URL}${route.language === "sw" ? route.path : route.alternatePath}` });
      ensureMeta('link[rel="alternate"][hreflang="en"]', { rel: "alternate", hreflang: "en", href: `${SITE_URL}${route.language === "en" ? route.path : route.alternatePath}` });
    }
  }, [language, page, pathname]);
}

export function LegacyPage({ language, page }: { language: Language; page: PageKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const root = useRef<HTMLDivElement>(null);
  const html = legacyPages[language][page];
  usePageMetadata(language, page);

  useEffect(() => {
    const container = root.current;
    if (!container) return;
    const menuButton = container.querySelector<HTMLButtonElement>("[data-menu-toggle]");
    const mobileMenu = container.querySelector<HTMLElement>("[data-mobile-menu]");
    const closeMenu = () => {
      if (!menuButton || !mobileMenu) return;
      mobileMenu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
      document.body.classList.remove("menu-open");
    };
    const toggleMenu = () => {
      if (!menuButton || !mobileMenu) return;
      const open = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "×" : "☰";
      document.body.classList.toggle("menu-open", open);
    };
    const handleKeydown = (event: KeyboardEvent) => { if (event.key === "Escape") closeMenu(); };
    const handleResize = () => { if (window.innerWidth > 980) closeMenu(); };
    const header = container.querySelector(".site-header");
    const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
    const handleNavigation = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !getRoute(url.pathname)) return;
      event.preventDefault();
      closeMenu();
      navigate(`${url.pathname}${url.search}${url.hash}`);
    };

    menuButton?.addEventListener("click", toggleMenu);
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateHeader, { passive: true });
    container.addEventListener("click", handleNavigation);
    updateHeader();

    const openWhatsApp = (message: string) => window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    const quoteButtons = container.querySelectorAll<HTMLButtonElement>("[data-product-quote]");
    const quoteHandlers = new Map<HTMLButtonElement, () => void>();
    quoteButtons.forEach((button) => {
      const handler = () => {
        const card = button.closest<HTMLElement>("[data-product-card]");
        const product = card?.dataset.product ?? "";
        const weight = card?.querySelector<HTMLSelectElement>("select")?.value ?? "";
        const message = language === "en"
          ? `Hello Nafaka Halisi Tanzania, I would like today's quotation for:\n\nProduct: ${product}\nQuantity: ${weight}\n\nPlease share the price, current availability and delivery options. Thank you.`
          : `Habari Nafaka Halisi Tanzania, ningependa kupata bei ya leo ya:\n\nBidhaa: ${product}\nKiasi: ${weight}\n\nTafadhali nitumie bei, upatikanaji wa mzigo na utaratibu wa usafirishaji. Asante.`;
        openWhatsApp(message);
      };
      quoteHandlers.set(button, handler);
      button.addEventListener("click", handler);
    });

    const inquiryForm = container.querySelector<HTMLFormElement>("[data-inquiry-form]");
    const submitInquiry = (event: SubmitEvent) => {
      event.preventDefault();
      if (!inquiryForm?.reportValidity()) return;
      const data = new FormData(inquiryForm);
      const message = language === "en"
        ? `Hello Nafaka Halisi Tanzania, I am contacting you through your website.\n\nName: ${data.get("name")}\nLocation: ${data.get("location")}\nEnquiry: ${data.get("service")}\nDetails: ${data.get("message") || "No extra details"}`
        : `Habari Nafaka Halisi Tanzania, ninawasiliana kupitia tovuti yenu.\n\nJina: ${data.get("name")}\nEneo: ${data.get("location")}\nHuduma: ${data.get("service")}\nMaelezo: ${data.get("message") || "Hakuna maelezo ya ziada"}`;
      openWhatsApp(message);
    };
    inquiryForm?.addEventListener("submit", submitInquiry);
    container.querySelectorAll("[data-year]").forEach((item) => { item.textContent = String(new Date().getFullYear()); });

    const floatingWhatsApp = document.createElement("a");
    floatingWhatsApp.className = "floating-whatsapp";
    floatingWhatsApp.href = `https://wa.me/${PHONE}`;
    floatingWhatsApp.target = "_blank";
    floatingWhatsApp.rel = "noopener noreferrer";
    floatingWhatsApp.setAttribute("aria-label", language === "en" ? "Chat with us on WhatsApp" : "Zungumza nasi kwa WhatsApp");
    floatingWhatsApp.innerHTML = `<span class="wa-mark" aria-hidden="true">W</span><span class="wa-label">${language === "en" ? "Chat on WhatsApp" : "Tuandikie WhatsApp"}</span>`;
    document.body.appendChild(floatingWhatsApp);

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("visible"); observer?.unobserve(entry.target); }
      }), { threshold: .12 });
      container.querySelectorAll(".reveal").forEach((item) => observer?.observe(item));
    } else container.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));

    requestAnimationFrame(() => {
      if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
      else window.scrollTo({ top: 0, behavior: "auto" });
    });

    return () => {
      menuButton?.removeEventListener("click", toggleMenu);
      document.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateHeader);
      container.removeEventListener("click", handleNavigation);
      quoteHandlers.forEach((handler, button) => button.removeEventListener("click", handler));
      inquiryForm?.removeEventListener("submit", submitInquiry);
      observer?.disconnect();
      floatingWhatsApp.remove();
      document.body.classList.remove("menu-open");
    };
  }, [html, language, location.hash, navigate]);

  const jsonLd = extractJsonLd(html);
  return <>{jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />}<div ref={root} className={extractBodyClass(html)} dangerouslySetInnerHTML={{ __html: extractBody(html) }} /><HeroGrainScene routeKey={language + "-" + page} /></>;
}

export function LegacyNotFound() {
  const language: Language = useLocation().pathname.startsWith("/en") ? "en" : "sw";
  usePageMetadata(language);
  return <div className={extractBodyClass(legacyNotFound)} dangerouslySetInnerHTML={{ __html: extractBody(legacyNotFound) }} />;
}
