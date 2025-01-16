/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import svgr from "vite-plugin-svgr";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [!process.env.VITEST && reactRouter(), svgr()],
  envPrefix: ["VITE_", "CF_PAGES_"],
  test: {
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      reporter: ["text", "json", "html"],
    },
    environment: "happy-dom",
    globals: true,
    root: __dirname,
    exclude: [
      ...configDefaults.exclude,
      "*.quarantine.ts",
      "*.quarantine.tsx",
      "*.quarantine.js",
      "*.quarantine.jsx",
    ],
    setupFiles: "./vitest.setup.ts",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
