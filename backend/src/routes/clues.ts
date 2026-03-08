import { ServerRoute } from "@hapi/hapi";
import * as handlers from "../handlers/clues.js";
import {
  scenarioParams,
  clueParams,
  createCluePayload,
  updateCluePayload,
} from "../validators/index.js";

export const clueRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/scenarios/{scenarioId}/clues",
    options: {
      auth: "jwt",
      validate: { params: scenarioParams },
    },
    handler: handlers.listClues,
  },
  {
    method: "POST",
    path: "/scenarios/{scenarioId}/clues",
    options: {
      auth: "jwt",
      validate: {
        params: scenarioParams,
        payload: createCluePayload,
      },
    },
    handler: handlers.createClue,
  },
  {
    method: "GET",
    path: "/scenarios/{scenarioId}/clues/{clueId}",
    options: {
      auth: "jwt",
      validate: { params: clueParams },
    },
    handler: handlers.getClue,
  },
  {
    method: "PUT",
    path: "/scenarios/{scenarioId}/clues/{clueId}",
    options: {
      auth: "jwt",
      validate: {
        params: clueParams,
        payload: updateCluePayload,
      },
    },
    handler: handlers.updateClue,
  },
  {
    method: "DELETE",
    path: "/scenarios/{scenarioId}/clues/{clueId}",
    options: {
      auth: "jwt",
      validate: { params: clueParams },
    },
    handler: handlers.deleteClue,
  },
];
