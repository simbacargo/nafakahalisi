(function () {
  "use strict";

  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.textContent = open ? "×" : "☰";
      document.body.classList.toggle("menu-open", open);
    });
    mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.textContent = "☰";
      document.body.classList.remove("menu-open");
    }));
  }



  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    mobileMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.textContent = "☰";
    document.body.classList.remove("menu-open");
  };
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeMenu(); });
  window.addEventListener("resize", () => { if (window.innerWidth > 980) closeMenu(); });

  const header = document.querySelector(".site-header");
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 12);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const language = document.documentElement.lang === "en" ? "en" : "sw";
  const phone = "255783250177";
  const openWhatsApp = (message) => {
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  document.querySelectorAll("[data-product-quote]").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest("[data-product-card]");
      const product = card.dataset.product;
      const weight = card.querySelector("select").value;
      const message = language === "en"
        ? `Hello Nafaka Halisi Tanzania, I would like today's quotation for:\n\nProduct: ${product}\nQuantity: ${weight}\n\nPlease share the price, current availability and delivery options. Thank you.`
        : `Habari Nafaka Halisi Tanzania, ningependa kupata bei ya leo ya:\n\nBidhaa: ${product}\nKiasi: ${weight}\n\nTafadhali nitumie bei, upatikanaji wa mzigo na utaratibu wa usafirishaji. Asante.`;
      openWhatsApp(message);
    });
  });

  const inquiryForm = document.querySelector("[data-inquiry-form]");
  if (inquiryForm) {
    inquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!inquiryForm.reportValidity()) return;
      const data = new FormData(inquiryForm);
      const message = language === "en"
        ? `Hello Nafaka Halisi Tanzania, I am contacting you through your website.\n\nName: ${data.get("name")}\nLocation: ${data.get("location")}\nEnquiry: ${data.get("service")}\nDetails: ${data.get("message") || "No extra details"}`
        : `Habari Nafaka Halisi Tanzania, ninawasiliana kupitia tovuti yenu.\n\nJina: ${data.get("name")}\nEneo: ${data.get("location")}\nHuduma: ${data.get("service")}\nMaelezo: ${data.get("message") || "Hakuna maelezo ya ziada"}`;
      openWhatsApp(message);
    });
  }

  document.querySelectorAll("[data-year]").forEach((item) => { item.textContent = new Date().getFullYear(); });

  const floatingWhatsApp = document.createElement("a");
  floatingWhatsApp.className = "floating-whatsapp";
  floatingWhatsApp.href = `https://wa.me/${phone}`;
  floatingWhatsApp.target = "_blank";
  floatingWhatsApp.rel = "noopener noreferrer";
  floatingWhatsApp.setAttribute("aria-label", language === "en" ? "Chat with us on WhatsApp" : "Zungumza nasi kwa WhatsApp");
  floatingWhatsApp.innerHTML = `<span class="wa-mark" aria-hidden="true">W</span><span class="wa-label">${language === "en" ? "Chat on WhatsApp" : "Tuandikie WhatsApp"}</span>`;
  document.body.appendChild(floatingWhatsApp);


  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));
  } else {
    document.querySelectorAll(".reveal").forEach((item) => item.classList.add("visible"));
  }
})();
