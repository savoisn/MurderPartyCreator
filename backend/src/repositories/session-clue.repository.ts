import { db } from "../db/index.js";
import { sessionClues } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import type { SessionClue } from "../models/session.js";

export class SessionClueRepository {
  async findBySessionId(sessionId: string): Promise<SessionClue[]> {
    const results = await db
      .select()
      .from(sessionClues)
      .where(eq(sessionClues.sessionId, sessionId));
    return results as SessionClue[];
  }

  async findBySessionAndClue(
    sessionId: string,
    clueId: string,
  ): Promise<SessionClue | null> {
    const [result] = await db
      .select()
      .from(sessionClues)
      .where(
        and(
          eq(sessionClues.sessionId, sessionId),
          eq(sessionClues.clueId, clueId),
        ),
      );
    return (result as SessionClue) ?? null;
  }

  async create(sessionId: string, clueId: string): Promise<SessionClue> {
    const [created] = await db
      .insert(sessionClues)
      .values({ sessionId, clueId, revealedAt: new Date() })
      .returning();
    return created as SessionClue;
  }

  async markAsRevealed(id: string): Promise<SessionClue | null> {
    const [updated] = await db
      .update(sessionClues)
      .set({ revealedAt: new Date() })
      .where(eq(sessionClues.id, id))
      .returning();
    return (updated as SessionClue) ?? null;
  }
}

export const sessionClueRepository = new SessionClueRepository();
