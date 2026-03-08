import { ServerRoute } from "@hapi/hapi";
import { getAuthRoutes } from "./auth.js";
import { scenarioRoutes } from "./scenarios.js";
import { characterRoutes } from "./characters.js";
import { clueRoutes } from "./clues.js";
import { sessionRoutes } from "./sessions.js";

export const routes: ServerRoute[] = [
  ...getAuthRoutes(),
  ...scenarioRoutes,
  ...characterRoutes,
  ...clueRoutes,
  ...sessionRoutes,
];
