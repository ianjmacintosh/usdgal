import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  routeDiscovery: {
    mode: "initial",
  },
  prerender: () => {
    return [
      "/", // English (default)
      "/es/", // Spanish
      "/de/", // German
      "/hi/", // Hindi
      "/pt/", // Portuguese
    ];
  },
} satisfies Config;
