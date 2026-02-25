import { ServerRoute } from "@hapi/hapi";
import { scenarioRoutes } from "./scenarios.js";
import { characterRoutes } from "./characters.js";
import { clueRoutes } from "./clues.js";
import { sessionRoutes } from "./sessions.js";

export const routes: ServerRoute[] = [
  ...scenarioRoutes,
  ...characterRoutes,
  ...clueRoutes,
  ...sessionRoutes,
];
