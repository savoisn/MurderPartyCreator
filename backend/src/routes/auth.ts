import { ServerRoute } from "@hapi/hapi";
import * as handlers from "../handlers/auth.js";
import { config } from "../config.js";

export function getAuthRoutes(): ServerRoute[] {
  const routes: ServerRoute[] = [
    {
      method: "GET",
      path: "/auth/me",
      options: { auth: "jwt" },
      handler: handlers.getCurrentUser,
    },
    {
      method: "POST",
      path: "/auth/logout",
      handler: handlers.logout,
    },
  ];

  // Only add OAuth routes if providers are configured
  if (config.github.clientId) {
    routes.push({
      method: ["GET", "POST"],
      path: "/auth/github",
      options: {
        auth: "github",
        handler: handlers.handleOAuthCallback,
      },
    });
  }

  if (config.google.clientId) {
    routes.push({
      method: ["GET", "POST"],
      path: "/auth/google",
      options: {
        auth: "google",
        handler: handlers.handleOAuthCallback,
      },
    });
  }

  return routes;
}
