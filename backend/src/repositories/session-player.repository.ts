import { db } from "../db/index.js";
import { sessionPlayers } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import type { SessionPlayer, AddPlayerInput } from "../models/session.js";

export class SessionPlayerRepository {
  async findBySessionId(sessionId: string): Promise<SessionPlayer[]> {
    const results = await db
      .select()
      .from(sessionPlayers)
      .where(eq(sessionPlayers.sessionId, sessionId));
    return results as SessionPlayer[];
  }

  async create(
    sessionId: string,
    input: AddPlayerInput,
  ): Promise<SessionPlayer> {
    const [created] = await db
      .insert(sessionPlayers)
      .values({
        sessionId,
        characterId: input.characterId,
        playerName: input.playerName,
      })
      .returning();
    return created as SessionPlayer;
  }

  async delete(id: string, sessionId: string): Promise<boolean> {
    const [deleted] = await db
      .delete(sessionPlayers)
      .where(
        and(
          eq(sessionPlayers.id, id),
          eq(sessionPlayers.sessionId, sessionId),
        ),
      )
      .returning();
    return !!deleted;
  }
}

export const sessionPlayerRepository = new SessionPlayerRepository();
