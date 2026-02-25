import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { db } from "../db/index.js";
import { scenarios } from "../db/schema.js";
import { eq } from "drizzle-orm";
import { NewScenario } from "../types/index.js";

export async function listScenarios(_request: Request, h: ResponseToolkit) {
  const result = await db.select().from(scenarios);
  return h.response({ data: result });
}

export async function getScenario(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const [scenario] = await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.id, scenarioId));

  if (!scenario) throw Boom.notFound("Scenario not found");
  return h.response({ data: scenario });
}

export async function createScenario(request: Request, h: ResponseToolkit) {
  const payload = request.payload as NewScenario;
  const [created] = await db.insert(scenarios).values(payload).returning();
  return h.response({ data: created }).code(201);
}

export async function updateScenario(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const payload = request.payload as Partial<NewScenario>;

  const [updated] = await db
    .update(scenarios)
    .set({ ...payload, updatedAt: new Date() })
    .where(eq(scenarios.id, scenarioId))
    .returning();

  if (!updated) throw Boom.notFound("Scenario not found");
  return h.response({ data: updated });
}

export async function deleteScenario(request: Request, h: ResponseToolkit) {
  const { scenarioId } = request.params;
  const [deleted] = await db
    .delete(scenarios)
    .where(eq(scenarios.id, scenarioId))
    .returning();

  if (!deleted) throw Boom.notFound("Scenario not found");
  return h.response().code(204);
}
