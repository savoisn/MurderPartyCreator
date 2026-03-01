import { db } from "../db/index.js";
import { scenarios } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type {
  Scenario,
  CreateScenarioInput,
  UpdateScenarioInput,
} from "../models/scenario.js";

export class ScenarioRepository {
  async findAll(): Promise<Scenario[]> {
    const results = await db.select().from(scenarios);
    return results as Scenario[];
  }

  async findById(id: string): Promise<Scenario | null> {
    const [result] = await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.id, id));
    return (result as Scenario) ?? null;
  }

  async create(input: CreateScenarioInput): Promise<Scenario> {
    const [created] = await db.insert(scenarios).values(input).returning();
    return created as Scenario;
  }

  async update(
    id: string,
    input: UpdateScenarioInput,
  ): Promise<Scenario | null> {
    const [updated] = await db
      .update(scenarios)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(scenarios.id, id))
      .returning();
    return (updated as Scenario) ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await db
      .delete(scenarios)
      .where(eq(scenarios.id, id))
      .returning();
    return !!deleted;
  }
}

export const scenarioRepository = new ScenarioRepository();
