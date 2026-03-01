import { Request, ResponseToolkit } from "@hapi/hapi";
import { charactersUseCase } from "../use-cases/characters.use-case.js";

export async function listCharacters(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const characters = await charactersUseCase.listCharacters(scenarioId);
  return h.response({ data: characters });
}

export async function getCharacter(request: Request, h: ResponseToolkit) {
  const { scenarioId, characterId } = request.params;
  const character = await charactersUseCase.getCharacter(
    scenarioId,
    characterId,
  );
  return h.response({ data: character });
}

export async function createCharacter(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const payload = request.payload as Record<string, unknown>;
  const character = await charactersUseCase.createCharacter(
    scenarioId,
    payload as any,
  );
  return h.response({ data: character }).code(201);
}

export async function updateCharacter(request: Request, h: ResponseToolkit) {
  const { scenarioId, characterId } = request.params;
  const payload = request.payload as Record<string, unknown>;
  const character = await charactersUseCase.updateCharacter(
    scenarioId,
    characterId,
    payload as any,
  );
  return h.response({ data: character });
}

export async function deleteCharacter(request: Request, h: ResponseToolkit) {
  const { scenarioId, characterId } = request.params;
  await charactersUseCase.deleteCharacter(scenarioId, characterId);
  return h.response().code(204);
}
