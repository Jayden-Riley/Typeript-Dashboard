import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("signup", "auth/signup.tsx"),
  route("login", "auth/login.tsx"),
  route("logout", "auth/logout.ts"),
  route("auth/confirm", "routes/confirm.ts"),
  route("dashboard", "dashboard/dashboard.tsx", [
    index("dashboard/index.tsx"),
    route("settings", "dashboard/settings.tsx"),
    route("products", "dashboard/products.tsx"),
    route("customer", "dashboard/customer.tsx"),
  ]),
] satisfies RouteConfig;
