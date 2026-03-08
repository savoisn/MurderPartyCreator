import { ServerRoute } from "@hapi/hapi";
import * as handlers from "../handlers/scenarios.js";
import {
  scenarioParams,
  createScenarioPayload,
  updateScenarioPayload,
} from "../validators/index.js";

export const scenarioRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/scenarios",
    options: { auth: "jwt" },
    handler: handlers.listScenarios,
  },
  {
    method: "POST",
    path: "/scenarios",
    options: {
      auth: "jwt",
      validate: { payload: createScenarioPayload },
    },
    handler: handlers.createScenario,
  },
  {
    method: "GET",
    path: "/scenarios/{scenarioId}",
    options: {
      auth: "jwt",
      validate: { params: scenarioParams },
    },
    handler: handlers.getScenario,
  },
  {
    method: "PUT",
    path: "/scenarios/{scenarioId}",
    options: {
      auth: "jwt",
      validate: {
        params: scenarioParams,
        payload: updateScenarioPayload,
      },
    },
    handler: handlers.updateScenario,
  },
  {
    method: "DELETE",
    path: "/scenarios/{scenarioId}",
    options: {
      auth: "jwt",
      validate: { params: scenarioParams },
    },
    handler: handlers.deleteScenario,
  },
];
