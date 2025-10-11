import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
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
