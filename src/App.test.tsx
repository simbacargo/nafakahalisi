import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { productMessage, whatsappUrl } from "./content";

describe("bilingual client routing", () => {
  it("moves between English routes without a document navigation", async () => {
    render(<MemoryRouter initialEntries={["/en/"]}><App /></MemoryRouter>);
    fireEvent.click(screen.getAllByRole("link", { name: "Products" })[0]);
    expect(await screen.findByRole("heading", { name: /Quality products/i })).toBeInTheDocument();
    expect(window.location.pathname).toBe("/");
  });

  it("opens an accessible mobile navigation sheet", () => {
    render(<MemoryRouter initialEntries={["/"]}><App /></MemoryRouter>);
    const button = screen.getByRole("button", { name: "Fungua menyu" });
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAccessibleName("Funga menyu");
    expect(document.querySelector("[data-mobile-menu]")).toHaveClass("open");
    expect(document.querySelector(".mobile-nav-cta")).toHaveTextContent("Tuandikie WhatsApp");
  });

  it("switches to the equivalent page in the other language", async () => {
    render(<MemoryRouter initialEntries={["/en/services/"]}><App /></MemoryRouter>);
    fireEvent.click(screen.getByRole("link", { name: "SW" }));
    expect(await screen.findByRole("heading", { name: /Tunasaga kwa usafi/i })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe("sw");
  });

  it("submits the contact enquiry through a localized WhatsApp URL", () => {
    const open = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<MemoryRouter initialEntries={["/en/contact/"]}><App /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/Full name/i), { target: { value: "Asha Mushi" } });
    fireEvent.change(screen.getByLabelText(/Town or region/i), { target: { value: "Arusha" } });
    fireEvent.click(screen.getByRole("button", { name: /Continue to WhatsApp/i }));
    expect(open).toHaveBeenCalledWith(expect.stringContaining("Name%3A%20Asha%20Mushi"), "_blank", "noopener,noreferrer");
    open.mockRestore();
  });

  it("renders a localized not-found page", () => {
    render(<MemoryRouter initialEntries={["/en/missing/"]}><App /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: /Ukurasa huu haupo/i })).toBeInTheDocument();
  });
});

describe("WhatsApp links", () => {
  it("encodes a localized product quotation", () => {
    const message = productMessage("en", "Premium Sembe", "50 kg bag");
    expect(whatsappUrl(message)).toContain("Product%3A%20Premium%20Sembe");
    expect(whatsappUrl(message)).toContain("Quantity%3A%2050%20kg%20bag");
  });
});
