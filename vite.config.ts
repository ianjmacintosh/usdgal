/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { configDefaults } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  test: {
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
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
