import Hapi from "@hapi/hapi";
import Bell from "@hapi/bell";
import Cookie from "@hapi/cookie";
import Inert from "@hapi/inert";
import { fileURLToPath } from "url";
import path from "path";
import { config } from "./config.js";
import { routes } from "./routes/index.js";
import { jwtScheme } from "./auth/jwt-scheme.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distFrontPath = path.resolve(__dirname, "../dist_front");

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
  await server.register([Bell, Cookie, Inert]);

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
      isSecure: config.nodeEnv === "production" && !config.local,
      location: config.frontendUrl + (config.local ? "" : "/api"),
    });
  }

  if (config.google.clientId) {
    server.auth.strategy("google", "bell", {
      provider: "google",
      password: config.cookiePassword,
      clientId: config.google.clientId,
      clientSecret: config.google.clientSecret,
      isSecure: config.nodeEnv === "production" && !config.local ,
      location: config.frontendUrl + (config.local ? "" : "/api"),
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

  console.log("Registering? static file routes for production?");
  console.log(config.nodeEnv);
  if (config.nodeEnv === "production") {
    console.log("Registering static file routes for production");
    server.route([
      {
        method: "GET",
        path: "/assets/{param*}",
        handler: {
          directory: { path: path.join(distFrontPath, "assets") },
        },
      },
      {
        method: "GET",
        path: "/{param*}",
        handler: (_request, h) =>
          h.file(path.join(distFrontPath, "index.html")),
      },
    ]);
  }

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
