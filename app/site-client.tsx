"use client";

import { useEffect } from "react";
import type { Language } from "./page-data";

const phone = "255783250177";

export default function SiteClient({ language }: { language: Language }) {
  useEffect(() => {
    const menuButton = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
    const mobileMenu = document.querySelector<HTMLElement>("[data-mobile-menu]");

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
    const header = document.querySelector(".site-header");
    const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);

    menuButton?.addEventListener("click", toggleMenu);
    mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", handleKeydown);
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();

    const openWhatsApp = (message: string) => {
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    };

    const quoteButtons = document.querySelectorAll<HTMLButtonElement>("[data-product-quote]");
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

    const inquiryForm = document.querySelector<HTMLFormElement>("[data-inquiry-form]");
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

    document.querySelectorAll("[data-year]").forEach((item) => { item.textContent = String(new Date().getFullYear()); });

    const floatingWhatsApp = document.createElement("a");
    floatingWhatsApp.className = "floating-whatsapp";
    floatingWhatsApp.href = `https://wa.me/${phone}`;
    floatingWhatsApp.target = "_blank";
    floatingWhatsApp.rel = "noopener noreferrer";
    floatingWhatsApp.setAttribute("aria-label", language === "en" ? "Chat with us on WhatsApp" : "Zungumza nasi kwa WhatsApp");
    floatingWhatsApp.innerHTML = `<span class="wa-mark" aria-hidden="true">W</span><span class="wa-label">${language === "en" ? "Chat on WhatsApp" : "Tuandikie WhatsApp"}</span>`;
    document.body.appendChild(floatingWhatsApp);

    let observer: IntersectionObserver | undefined;
    if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer?.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach((item) => observer?.observe(item));
    } else {
      document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
    }

    return () => {
      menuButton?.removeEventListener("click", toggleMenu);
      mobileMenu?.querySelectorAll("a").forEach((link) => link.removeEventListener("click", closeMenu));
      document.removeEventListener("keydown", handleKeydown);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", updateHeader);
      quoteHandlers.forEach((handler, button) => button.removeEventListener("click", handler));
      inquiryForm?.removeEventListener("submit", submitInquiry);
      observer?.disconnect();
      floatingWhatsApp.remove();
      document.body.classList.remove("menu-open");
    };
  }, [language]);

  return null;
}
