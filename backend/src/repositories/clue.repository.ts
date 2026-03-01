import { db } from "../db/index.js";
import { clues } from "../db/schema.js";
import { eq, and, asc } from "drizzle-orm";
import type {
  Clue,
  CreateClueInput,
  UpdateClueInput,
} from "../models/clue.js";

export class ClueRepository {
  async findByScenarioId(scenarioId: string): Promise<Clue[]> {
    const results = await db
      .select()
      .from(clues)
      .where(eq(clues.scenarioId, scenarioId))
      .orderBy(asc(clues.revealOrder));
    return results as Clue[];
  }

  async findById(id: string, scenarioId: string): Promise<Clue | null> {
    const [result] = await db
      .select()
      .from(clues)
      .where(and(eq(clues.id, id), eq(clues.scenarioId, scenarioId)));
    return (result as Clue) ?? null;
  }

  async create(scenarioId: string, input: CreateClueInput): Promise<Clue> {
    const [created] = await db
      .insert(clues)
      .values({ ...input, scenarioId })
      .returning();
    return created as Clue;
  }

  async update(
    id: string,
    scenarioId: string,
    input: UpdateClueInput,
  ): Promise<Clue | null> {
    const [updated] = await db
      .update(clues)
      .set({ ...input, updatedAt: new Date() })
      .where(and(eq(clues.id, id), eq(clues.scenarioId, scenarioId)))
      .returning();
    return (updated as Clue) ?? null;
  }

  async delete(id: string, scenarioId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(clues)
      .where(and(eq(clues.id, id), eq(clues.scenarioId, scenarioId)))
      .returning();
    return !!deleted;
  }
}

export const clueRepository = new ClueRepository();
