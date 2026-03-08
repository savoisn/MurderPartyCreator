import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { scenariosUseCase } from "../use-cases/scenarios.use-case.js";

function getUserId(request: Request): string {
  return (request.auth.credentials as any).userId;
}

function requireCreator(request: Request): void {
  if ((request.auth.credentials as any).role !== "creator") {
    throw Boom.forbidden("Only creators can perform this action");
  }
}

export async function listScenarios(request: Request, h: ResponseToolkit) {
  const userId = getUserId(request);
  const scenarios = await scenariosUseCase.listScenarios(userId);
  return h.response({ data: scenarios });
}

export async function getScenario(request: Request, h: ResponseToolkit) {
  const userId = getUserId(request);
  const { scenarioId } = request.params;
  const scenario = await scenariosUseCase.getScenario(scenarioId, userId);
  return h.response({ data: scenario });
}

export async function createScenario(request: Request, h: ResponseToolkit) {
  requireCreator(request);
  const userId = getUserId(request);
  const payload = request.payload as Record<string, unknown>;
  const scenario = await scenariosUseCase.createScenario(
    userId,
    payload as any,
  );
  return h.response({ data: scenario }).code(201);
}

export async function updateScenario(request: Request, h: ResponseToolkit) {
  requireCreator(request);
  const userId = getUserId(request);
  const { scenarioId } = request.params;
  const payload = request.payload as Record<string, unknown>;
  const scenario = await scenariosUseCase.updateScenario(
    scenarioId,
    userId,
    payload as any,
  );
  return h.response({ data: scenario });
}

export async function deleteScenario(request: Request, h: ResponseToolkit) {
  requireCreator(request);
  const userId = getUserId(request);
  const { scenarioId } = request.params;
  await scenariosUseCase.deleteScenario(scenarioId, userId);
  return h.response().code(204);
}
