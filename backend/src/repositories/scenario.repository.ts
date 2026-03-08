import { db } from "../db/index.js";
import { scenarios } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import type {
  Scenario,
  CreateScenarioInput,
  UpdateScenarioInput,
} from "../models/scenario.js";

export class ScenarioRepository {
  async findAllByUserId(userId: string): Promise<Scenario[]> {
    const results = await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.userId, userId));
    return results as Scenario[];
  }

  async findById(id: string): Promise<Scenario | null> {
    const [result] = await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.id, id));
    return (result as Scenario) ?? null;
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Scenario | null> {
    const [result] = await db
      .select()
      .from(scenarios)
      .where(and(eq(scenarios.id, id), eq(scenarios.userId, userId)));
    return (result as Scenario) ?? null;
  }

  async create(input: CreateScenarioInput & { userId: string }): Promise<Scenario> {
    const [created] = await db.insert(scenarios).values(input).returning();
    return created as Scenario;
  }

  async update(
    id: string,
    userId: string,
    input: UpdateScenarioInput,
  ): Promise<Scenario | null> {
    const [updated] = await db
      .update(scenarios)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(scenarios.id, id), eq(scenarios.userId, userId)))
      .returning();
    return (updated as Scenario) ?? null;
  }

  async delete(id: string, userId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(scenarios)
      .where(and(eq(scenarios.id, id), eq(scenarios.userId, userId)))
      .returning();
    return !!deleted;
  }
}

export const scenarioRepository = new ScenarioRepository();
