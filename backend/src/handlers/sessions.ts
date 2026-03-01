import { Request, ResponseToolkit } from "@hapi/hapi";
import { sessionsUseCase } from "../use-cases/sessions.use-case.js";

export async function listSessions(_request: Request, h: ResponseToolkit) {
  const sessions = await sessionsUseCase.listSessions();
  return h.response({ data: sessions });
}

export async function getSession(request: Request, h: ResponseToolkit) {
  const { sessionId } = request.params;
  const session = await sessionsUseCase.getSession(sessionId);
  return h.response({ data: session });
}

export async function createSession(request: Request, h: ResponseToolkit) {
  const payload = request.payload as {
    scenarioId: string;
    scheduledAt?: string;
  };
  const session = await sessionsUseCase.createSession({
    scenarioId: payload.scenarioId,
    scheduledAt: payload.scheduledAt
      ? new Date(String(payload.scheduledAt))
      : undefined,
  });
  return h.response({ data: session }).code(201);
}

export async function updateSession(request: Request, h: ResponseToolkit) {
  const { sessionId } = request.params;
  const payload = request.payload as {
    status?: string;
    scheduledAt?: string | null;
  };

  const input: Record<string, unknown> = {};
  if (payload.status) input.status = payload.status;
  if (payload.scheduledAt !== undefined) {
    input.scheduledAt = payload.scheduledAt
      ? new Date(payload.scheduledAt)
      : null;
  }

  const session = await sessionsUseCase.updateSession(sessionId, input as any);
  return h.response({ data: session });
}

export async function deleteSession(request: Request, h: ResponseToolkit) {
  const { sessionId } = request.params;
  await sessionsUseCase.deleteSession(sessionId);
  return h.response().code(204);
}

export async function addPlayer(request: Request, h: ResponseToolkit) {
  const { sessionId } = request.params;
  const payload = request.payload as {
    characterId: string;
    playerName: string;
  };
  const player = await sessionsUseCase.addPlayer(sessionId, {
    characterId: payload.characterId,
    playerName: payload.playerName,
  });
  return h.response({ data: player }).code(201);
}

export async function removePlayer(request: Request, h: ResponseToolkit) {
  const { sessionId, playerId } = request.params;
  await sessionsUseCase.removePlayer(sessionId, playerId);
  return h.response().code(204);
}

export async function revealClue(request: Request, h: ResponseToolkit) {
  const { sessionId, clueId } = request.params;
  const result = await sessionsUseCase.revealClue(sessionId, clueId);
  return h
    .response({ data: result.data })
    .code(result.created ? 201 : 200);
}
