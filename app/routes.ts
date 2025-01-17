// Importing types and functions for routing from react-router
import { type RouteConfig, index, route } from "@react-router/dev/routes";

// Exporting a default array of route configurations for the app
export default [
  // Defines the home route at the root of the application
  index("routes/home.tsx"),

  // Defines the route for the sign-up page
  route("signup", "auth/signup.tsx"),

  // Defines the route for the login page
  route("login", "auth/login.tsx"),

  // Defines the route for the logout action
  route("logout", "auth/logout.ts"),

  // Defines the route for the email confirmation page after signup
  route("auth/confirm", "routes/confirm.ts"),

  // Defines the dashboard route with its sub-routes
  route("dashboard", "dashboard/dashboard.tsx", [
    // Defines the default sub-route for the dashboard
    index("dashboard/index.tsx"),

    // Defines the route for the dashboard settings page
    route("settings", "dashboard/settings.tsx"),

    // Defines the route for the products section in the dashboard
    route("products", "dashboard/products.tsx"),

    // Defines the route for the customer section in the dashboard
    route("customer", "dashboard/customer.tsx"),

    // Defines the route for a specific product in the dashboard by its ID
    route("products/:id", "dashboard/id.tsx"),

    // Defines the route for a specific customer in the dashboard by their ID
    route("customer/:id", "dashboard/details.tsx"),
  ]),
] satisfies RouteConfig;
