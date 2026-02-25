import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { db } from "../db/index.js";
import { clues, scenarios } from "../db/schema.js";
import { eq, and, asc } from "drizzle-orm";
import { NewClue } from "../types/index.js";

async function ensureScenarioExists(scenarioId: string) {
  const [scenario] = await db
    .select({ id: scenarios.id })
    .from(scenarios)
    .where(eq(scenarios.id, scenarioId));
  if (!scenario) throw Boom.notFound("Scenario not found");
}

export async function listClues(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  await ensureScenarioExists(scenarioId);

  const result = await db
    .select()
    .from(clues)
    .where(eq(clues.scenarioId, scenarioId))
    .orderBy(asc(clues.revealOrder));
  return h.response({ data: result });
}

export async function getClue(request: Request, h: ResponseToolkit) {
  const { scenarioId, clueId } = request.params;
  const [clue] = await db
    .select()
    .from(clues)
    .where(and(eq(clues.id, clueId), eq(clues.scenarioId, scenarioId)));

  if (!clue) throw Boom.notFound("Clue not found");
  return h.response({ data: clue });
}

export async function createClue(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  await ensureScenarioExists(scenarioId);

  const payload = request.payload as Omit<NewClue, "scenarioId">;
  const [created] = await db
    .insert(clues)
    .values({ ...payload, scenarioId })
    .returning();
  return h.response({ data: created }).code(201);
}

export async function updateClue(request: Request, h: ResponseToolkit) {
  const { scenarioId, clueId } = request.params;
  const payload = request.payload as Partial<NewClue>;

  const [updated] = await db
    .update(clues)
    .set({ ...payload, updatedAt: new Date() })
    .where(and(eq(clues.id, clueId), eq(clues.scenarioId, scenarioId)))
    .returning();

  if (!updated) throw Boom.notFound("Clue not found");
  return h.response({ data: updated });
}

export async function deleteClue(request: Request, h: ResponseToolkit) {
  const { scenarioId, clueId } = request.params;
  const [deleted] = await db
    .delete(clues)
    .where(and(eq(clues.id, clueId), eq(clues.scenarioId, scenarioId)))
    .returning();

  if (!deleted) throw Boom.notFound("Clue not found");
  return h.response().code(204);
}
