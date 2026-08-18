import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: { outDir: "dist", assetsDir: "assets/app" },
  test: { environment: "jsdom", setupFiles: "./src/test/setup.ts" },
});
