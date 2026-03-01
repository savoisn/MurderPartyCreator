import { Request, ResponseToolkit } from "@hapi/hapi";
import { scenariosUseCase } from "../use-cases/scenarios.use-case.js";

export async function listScenarios(_request: Request, h: ResponseToolkit) {
  const scenarios = await scenariosUseCase.listScenarios();
  return h.response({ data: scenarios });
}

export async function getScenario(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const scenario = await scenariosUseCase.getScenario(scenarioId);
  return h.response({ data: scenario });
}

export async function createScenario(request: Request, h: ResponseToolkit) {
  const payload = request.payload as Record<string, unknown>;
  const scenario = await scenariosUseCase.createScenario(payload as any);
  return h.response({ data: scenario }).code(201);
}

export async function updateScenario(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const payload = request.payload as Record<string, unknown>;
  const scenario = await scenariosUseCase.updateScenario(
    scenarioId,
    payload as any,
  );
  return h.response({ data: scenario });
}

export async function deleteScenario(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  await scenariosUseCase.deleteScenario(scenarioId);
  return h.response().code(204);
}
