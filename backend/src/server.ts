import Hapi from "@hapi/hapi";
import Bell from "@hapi/bell";
import Cookie from "@hapi/cookie";
import { config } from "./config.js";
import { routes } from "./routes/index.js";
import { jwtScheme } from "./auth/jwt-scheme.js";

export async function createServer(): Promise<Hapi.Server> {
  const server = Hapi.server({
    port: config.port,
    host: config.host,
    routes: {
      cors: {
        origin: [config.frontendUrl],
        credentials: true,
      },
      validate: {
        failAction: async (_request, _h, err) => {
          throw err;
        },
      },
    },
  });

  // Register auth plugins
  await server.register([Bell, Cookie]);

  // JWT auth scheme + strategy (reads token from httpOnly cookie)
  server.auth.scheme("jwt-cookie", jwtScheme);
  server.auth.strategy("jwt", "jwt-cookie");

  // OAuth strategies (only if credentials are configured)
  if (config.github.clientId) {
    server.auth.strategy("github", "bell", {
      provider: "github",
      password: config.cookiePassword,
      clientId: config.github.clientId,
      clientSecret: config.github.clientSecret,
      isSecure: config.nodeEnv === "production",
      location: config.frontendUrl + "/api",
    });
  }

  if (config.google.clientId) {
    server.auth.strategy("google", "bell", {
      provider: "google",
      password: config.cookiePassword,
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
      isSecure: config.nodeEnv === "production",
      location: config.frontendUrl + "/api",
    });
  }

  server.route({
    method: "GET",
    path: "/health",
    handler: () => ({ status: "ok" }),
  });

  await server.register(
    {
      name: "api-routes",
      register: (s) => s.route(routes),
    },
    config.apiPrefix ? { routes: { prefix: config.apiPrefix } } : {},
  );

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if ("isBoom" in response && response.isBoom) {
      const { statusCode, message } = response.output.payload;
      console.error(
        `[${request.method.toUpperCase()} ${request.path}]`,
        response,
      );
      return h
        .response({ error: { statusCode, message } })
        .code(statusCode);
    }
    if ("statusCode" in response) {
      console.log(
        `${response.statusCode} - [${request.method.toUpperCase()} ${request.path}]`,
      );
    } else {
      console.log(
        `[${request.method.toUpperCase()} ${request.path}]`,
      );
    }

    return h.continue;
  });

  return server;
}
