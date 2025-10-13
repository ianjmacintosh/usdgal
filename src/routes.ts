import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route("/:lang?", "./pages/home.tsx"),
  route("/*", "./pages/catchall.tsx"),
] satisfies RouteConfig;
