import { ServerRoute } from "@hapi/hapi";
import * as handlers from "../handlers/sessions.js";
import {
  sessionParams,
  createSessionPayload,
  updateSessionPayload,
  sessionPlayerParams,
  createSessionPlayerPayload,
  sessionClueParams,
} from "../validators/index.js";

export const sessionRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/sessions",
    handler: handlers.listSessions,
  },
  {
    method: "POST",
    path: "/sessions",
    options: {
      validate: { payload: createSessionPayload },
    },
    handler: handlers.createSession,
  },
  {
    method: "GET",
    path: "/sessions/{sessionId}",
    options: {
      validate: { params: sessionParams },
    },
    handler: handlers.getSession,
  },
  {
    method: "PATCH",
    path: "/sessions/{sessionId}",
    options: {
      validate: {
        params: sessionParams,
        payload: updateSessionPayload,
      },
    },
    handler: handlers.updateSession,
  },
  {
    method: "DELETE",
    path: "/sessions/{sessionId}",
    options: {
      validate: { params: sessionParams },
    },
    handler: handlers.deleteSession,
  },
  {
    method: "POST",
    path: "/sessions/{sessionId}/players",
    options: {
      validate: {
        params: sessionParams,
        payload: createSessionPlayerPayload,
      },
    },
    handler: handlers.addPlayer,
  },
  {
    method: "DELETE",
    path: "/sessions/{sessionId}/players/{playerId}",
    options: {
      validate: { params: sessionPlayerParams },
    },
    handler: handlers.removePlayer,
  },
  {
    method: "POST",
    path: "/sessions/{sessionId}/clues/{clueId}/reveal",
    options: {
      validate: { params: sessionClueParams },
    },
    handler: handlers.revealClue,
  },
];
