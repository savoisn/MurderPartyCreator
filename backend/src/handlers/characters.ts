import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { db } from "../db/index.js";
import { characters, scenarios } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import { NewCharacter } from "../types/index.js";

async function ensureScenarioExists(scenarioId: string) {
  const [scenario] = await db
    .select({ id: scenarios.id })
    .from(scenarios)
    .where(eq(scenarios.id, scenarioId));
  if (!scenario) throw Boom.notFound("Scenario not found");
}

export async function listCharacters(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  await ensureScenarioExists(scenarioId);

  const result = await db
    .select()
    .from(characters)
    .where(eq(characters.scenarioId, scenarioId));
  return h.response({ data: result });
}

export async function getCharacter(request: Request, h: ResponseToolkit) {
  const { scenarioId, characterId } = request.params;
  const [character] = await db
    .select()
    .from(characters)
    .where(
      and(
        eq(characters.id, characterId),
        eq(characters.scenarioId, scenarioId),
      ),
    );

  if (!character) throw Boom.notFound("Character not found");
  return h.response({ data: character });
}

export async function createCharacter(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  await ensureScenarioExists(scenarioId);

  const payload = request.payload as Omit<NewCharacter, "scenarioId">;
  const [created] = await db
    .insert(characters)
    .values({ ...payload, scenarioId })
    .returning();
  return h.response({ data: created }).code(201);
}

export async function updateCharacter(request: Request, h: ResponseToolkit) {
  const { scenarioId, characterId } = request.params;
  const payload = request.payload as Partial<NewCharacter>;

  const [updated] = await db
    .update(characters)
    .set({ ...payload, updatedAt: new Date() })
    .where(
      and(
        eq(characters.id, characterId),
        eq(characters.scenarioId, scenarioId),
      ),
    )
    .returning();

  if (!updated) throw Boom.notFound("Character not found");
  return h.response({ data: updated });
}

export async function deleteCharacter(request: Request, h: ResponseToolkit) {
  const { scenarioId, characterId } = request.params;
  const [deleted] = await db
    .delete(characters)
    .where(
      and(
        eq(characters.id, characterId),
        eq(characters.scenarioId, scenarioId),
      ),
    )
    .returning();

  if (!deleted) throw Boom.notFound("Character not found");
  return h.response().code(204);
}
