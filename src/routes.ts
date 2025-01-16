import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/", "./pages/home-en.tsx"),
  route("/de/", "./pages/home-de.tsx"),
  route("/es/", "./pages/home-es.tsx"),
  route("/pt/", "./pages/home-pt.tsx"),
  route("/hi/", "./pages/home-hi.tsx"),
  // * matches all URLs
  route("/*", "./pages/catchall.tsx"),
] satisfies RouteConfig;
