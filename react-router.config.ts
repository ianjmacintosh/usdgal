import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  async prerender() {
    return ["/", "/de", "/es", "/pt", "/hi"];
  },
} satisfies Config;
