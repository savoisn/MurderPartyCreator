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
    options: { auth: "jwt" },
    handler: handlers.listSessions,
  },
  {
    method: "POST",
    path: "/sessions",
    options: {
      auth: "jwt",
      validate: { payload: createSessionPayload },
    },
    handler: handlers.createSession,
  },
  {
    method: "GET",
    path: "/sessions/{sessionId}",
    options: {
      auth: "jwt",
      validate: { params: sessionParams },
    },
    handler: handlers.getSession,
  },
  {
    method: "PATCH",
    path: "/sessions/{sessionId}",
    options: {
      auth: "jwt",
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
      auth: "jwt",
      validate: { params: sessionParams },
    },
    handler: handlers.deleteSession,
  },
  {
    method: "POST",
    path: "/sessions/{sessionId}/players",
    options: {
      auth: "jwt",
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
      auth: "jwt",
      validate: { params: sessionPlayerParams },
    },
    handler: handlers.removePlayer,
  },
  {
    method: "POST",
    path: "/sessions/{sessionId}/clues/{clueId}/reveal",
    options: {
      auth: "jwt",
      validate: { params: sessionClueParams },
    },
    handler: handlers.revealClue,
  },
];
