/// <reference types="vitest" />
import path from "path";
import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";
import svgr from "vite-plugin-svgr";
import { configDefaults } from "vitest/config";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    !process.env.VITEST && reactRouter(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["**/*.{png,svg,txt}"],
      manifest: false,
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
        additionalManifestEntries: [{ url: "index.html", revision: null }],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/workers/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname === "/workers/exchange-rates",
            handler: "NetworkFirst",
            options: {
              cacheName: "api-exchange-rates",
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24, // 24 hours
              },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: ({ url }) => url.pathname === "/workers/getLocation",
            handler: "NetworkFirst",
            options: {
              cacheName: "api-geolocation",
              expiration: {
                maxEntries: 5,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
    }),
  ],
  envPrefix: ["VITE_", "CF_PAGES_"],
  test: {
    coverage: {
      include: ["src/**/*.{js,jsx,ts,tsx}"],
    },
    environment: "happy-dom",
    globals: true,
    root: __dirname,
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
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
