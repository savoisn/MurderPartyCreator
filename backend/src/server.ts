import Hapi from "@hapi/hapi";
import { config } from "./config.js";
import { routes } from "./routes/index.js";

export async function createServer(): Promise<Hapi.Server> {
  const server = Hapi.server({
    port: config.port,
    host: config.host,
    routes: {
      cors: true,
      validate: {
        failAction: async (_request, _h, err) => {
          throw err;
        },
      },
    },
  });

  server.route({
    method: "GET",
    path: "/health",
    handler: () => ({ status: "ok" }),
  });

  server.route(routes);

  server.ext("onPreResponse", (request, h) => {
    const response = request.response;
    if ("isBoom" in response && response.isBoom) {
      const { statusCode, message } = response.output.payload;
      console.error(`[${request.method.toUpperCase()} ${request.path}]`, response);
      return h
        .response({ error: { statusCode, message } })
        .code(statusCode);
    }
    return h.continue;
  });

  return server;
}
