import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  ssr: true,
  async prerender() {
    return ["/", "/de", "/es", "/pt", "/hi"];
  },
} satisfies Config;
