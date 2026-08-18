import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(cleanup);
Object.defineProperty(window, "matchMedia", { value: () => ({ matches: true, addEventListener: () => undefined, removeEventListener: () => undefined }), writable: true });
Object.defineProperty(window, "scrollTo", { value: () => undefined, writable: true });
