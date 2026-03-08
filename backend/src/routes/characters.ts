import { ServerRoute } from "@hapi/hapi";
import * as handlers from "../handlers/characters.js";
import {
  scenarioParams,
  characterParams,
  createCharacterPayload,
  updateCharacterPayload,
} from "../validators/index.js";

export const characterRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/scenarios/{scenarioId}/characters",
    options: {
      auth: "jwt",
      validate: { params: scenarioParams },
    },
    handler: handlers.listCharacters,
  },
  {
    method: "POST",
    path: "/scenarios/{scenarioId}/characters",
    options: {
      auth: "jwt",
      validate: {
        params: scenarioParams,
        payload: createCharacterPayload,
      },
    },
    handler: handlers.createCharacter,
  },
  {
    method: "GET",
    path: "/scenarios/{scenarioId}/characters/{characterId}",
    options: {
      auth: "jwt",
      validate: { params: characterParams },
    },
    handler: handlers.getCharacter,
  },
  {
    method: "PUT",
    path: "/scenarios/{scenarioId}/characters/{characterId}",
    options: {
      auth: "jwt",
      validate: {
        params: characterParams,
        payload: updateCharacterPayload,
      },
    },
    handler: handlers.updateCharacter,
  },
  {
    method: "DELETE",
    path: "/scenarios/{scenarioId}/characters/{characterId}",
    options: {
      auth: "jwt",
      validate: { params: characterParams },
    },
    handler: handlers.deleteCharacter,
  },
];
