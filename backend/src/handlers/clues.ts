import { Request, ResponseToolkit } from "@hapi/hapi";
import { cluesUseCase } from "../use-cases/clues.use-case.js";

export async function listClues(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const clues = await cluesUseCase.listClues(scenarioId);
  return h.response({ data: clues });
}

export async function getClue(request: Request, h: ResponseToolkit) {
  const { scenarioId, clueId } = request.params;
  const clue = await cluesUseCase.getClue(scenarioId, clueId);
  return h.response({ data: clue });
}

export async function createClue(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const payload = request.payload as Record<string, unknown>;
  const clue = await cluesUseCase.createClue(scenarioId, payload as any);
  return h.response({ data: clue }).code(201);
}

export async function updateClue(request: Request, h: ResponseToolkit) {
  const { scenarioId, clueId } = request.params;
  const payload = request.payload as Record<string, unknown>;
  const clue = await cluesUseCase.updateClue(
    scenarioId,
    clueId,
    payload as any,
  );
  return h.response({ data: clue });
}

export async function deleteClue(request: Request, h: ResponseToolkit) {
  const { scenarioId, clueId } = request.params;
  await cluesUseCase.deleteClue(scenarioId, clueId);
  return h.response().code(204);
}
