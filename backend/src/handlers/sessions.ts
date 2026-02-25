import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { db } from "../db/index.js";
import {
  sessions,
  sessionPlayers,
  sessionClues,
  scenarios,
  characters,
  clues,
} from "../db/schema.js";
import { eq, and } from "drizzle-orm";

const VALID_TRANSITIONS: Record<string, string[]> = {
  draft: ["active"],
  active: ["completed"],
  completed: [],
};

export async function listSessions(_request: Request, h: ResponseToolkit) {
  const result = await db.select().from(sessions);
  return h.response({ data: result });
}

export async function getSession(request: Request, h: ResponseToolkit) {
  const { sessionId } = request.params;
  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId));

  if (!session) throw Boom.notFound("Session not found");

  const players = await db
    .select()
    .from(sessionPlayers)
    .where(eq(sessionPlayers.sessionId, sessionId));

  const revealedClues = await db
    .select()
    .from(sessionClues)
    .where(eq(sessionClues.sessionId, sessionId));

  return h.response({ data: { ...session, players, clues: revealedClues } });
}

export async function createSession(request: Request, h: ResponseToolkit) {
  const { scenarioId, scheduledAt } = request.payload as {
    scenarioId: string;
    scheduledAt?: string;
  };

  const [scenario] = await db
    .select({ id: scenarios.id })
    .from(scenarios)
    .where(eq(scenarios.id, scenarioId));
  if (!scenario) throw Boom.notFound("Scenario not found");

  const [created] = await db
    .insert(sessions)
    .values({
      scenarioId,
      scheduledAt: scheduledAt ? new Date(String(scheduledAt)) : undefined,
    })
    .returning();
  return h.response({ data: created }).code(201);
}

export async function updateSession(request: Request, h: ResponseToolkit) {
  const { sessionId } = request.params;
  const payload = request.payload as {
    status?: string;
    scheduledAt?: string | null;
  };

  if (payload.status) {
    const [current] = await db
      .select({ status: sessions.status })
      .from(sessions)
      .where(eq(sessions.id, sessionId));
    if (!current) throw Boom.notFound("Session not found");

    const allowed = VALID_TRANSITIONS[current.status] || [];
    if (!allowed.includes(payload.status)) {
      throw Boom.badRequest(
        `Cannot transition from "${current.status}" to "${payload.status}"`,
      );
    }
  }

  const values: Record<string, unknown> = { updatedAt: new Date() };
  if (payload.status) values.status = payload.status;
  if (payload.scheduledAt !== undefined) {
    values.scheduledAt = payload.scheduledAt
      ? new Date(payload.scheduledAt)
      : null;
  }

  const [updated] = await db
    .update(sessions)
    .set(values)
    .where(eq(sessions.id, sessionId))
    .returning();

  if (!updated) throw Boom.notFound("Session not found");
  return h.response({ data: updated });
}

export async function deleteSession(request: Request, h: ResponseToolkit) {
  const { sessionId } = request.params;
  const [deleted] = await db
    .delete(sessions)
    .where(eq(sessions.id, sessionId))
    .returning();

  if (!deleted) throw Boom.notFound("Session not found");
  return h.response().code(204);
}

export async function addPlayer(request: Request, h: ResponseToolkit) {
  const { sessionId } = request.params;
  const { characterId, playerName } = request.payload as {
    characterId: string;
    playerName: string;
  };

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId));
  if (!session) throw Boom.notFound("Session not found");

  const [character] = await db
    .select()
    .from(characters)
    .where(
      and(
        eq(characters.id, characterId),
        eq(characters.scenarioId, session.scenarioId),
      ),
    );
  if (!character) {
    throw Boom.badRequest("Character does not belong to this scenario");
  }

  const [created] = await db
    .insert(sessionPlayers)
    .values({ sessionId, characterId, playerName })
    .returning();
  return h.response({ data: created }).code(201);
}

export async function removePlayer(request: Request, h: ResponseToolkit) {
  const { sessionId, playerId } = request.params;
  const [deleted] = await db
    .delete(sessionPlayers)
    .where(
      and(
        eq(sessionPlayers.id, playerId),
        eq(sessionPlayers.sessionId, sessionId),
      ),
    )
    .returning();

  if (!deleted) throw Boom.notFound("Player not found");
  return h.response().code(204);
}

export async function revealClue(request: Request, h: ResponseToolkit) {
  const { sessionId, clueId } = request.params;

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.id, sessionId));
  if (!session) throw Boom.notFound("Session not found");

  const [clue] = await db
    .select()
    .from(clues)
    .where(
      and(eq(clues.id, clueId), eq(clues.scenarioId, session.scenarioId)),
    );
  if (!clue) {
    throw Boom.badRequest("Clue does not belong to this scenario");
  }

  const [existing] = await db
    .select()
    .from(sessionClues)
    .where(
      and(
        eq(sessionClues.sessionId, sessionId),
        eq(sessionClues.clueId, clueId),
      ),
    );

  if (existing?.revealedAt) {
    throw Boom.conflict("Clue already revealed");
  }

  if (existing) {
    const [updated] = await db
      .update(sessionClues)
      .set({ revealedAt: new Date() })
      .where(eq(sessionClues.id, existing.id))
      .returning();
    return h.response({ data: updated });
  }

  const [created] = await db
    .insert(sessionClues)
    .values({ sessionId, clueId, revealedAt: new Date() })
    .returning();
  return h.response({ data: created }).code(201);
}
