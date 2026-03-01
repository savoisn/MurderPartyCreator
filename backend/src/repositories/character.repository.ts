import { db } from "../db/index.js";
import { characters } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import type {
  Character,
  CreateCharacterInput,
  UpdateCharacterInput,
} from "../models/character.js";

export class CharacterRepository {
  async findByScenarioId(scenarioId: string): Promise<Character[]> {
    const results = await db
      .select()
      .from(characters)
      .where(eq(characters.scenarioId, scenarioId));
    return results as Character[];
  }

  async findById(id: string, scenarioId: string): Promise<Character | null> {
    const [result] = await db
      .select()
      .from(characters)
      .where(
        and(eq(characters.id, id), eq(characters.scenarioId, scenarioId)),
      );
    return (result as Character) ?? null;
  }

  async create(
    scenarioId: string,
    input: CreateCharacterInput,
  ): Promise<Character> {
    const [created] = await db
      .insert(characters)
      .values({ ...input, scenarioId })
      .returning();
    return created as Character;
  }

  async update(
    id: string,
    scenarioId: string,
    input: UpdateCharacterInput,
  ): Promise<Character | null> {
    const [updated] = await db
      .update(characters)
      .set({ ...input, updatedAt: new Date() })
      .where(
        and(eq(characters.id, id), eq(characters.scenarioId, scenarioId)),
      )
      .returning();
    return (updated as Character) ?? null;
  }

  async delete(id: string, scenarioId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(characters)
      .where(
        and(eq(characters.id, id), eq(characters.scenarioId, scenarioId)),
      )
      .returning();
    return !!deleted;
  }
}

export const characterRepository = new CharacterRepository();
