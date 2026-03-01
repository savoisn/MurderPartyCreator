import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type {
  Session,
  SessionStatus,
  CreateSessionInput,
  UpdateSessionInput,
} from "../models/session.js";

export class SessionRepository {
  async findAll(): Promise<Session[]> {
    const results = await db.select().from(sessions);
    return results as Session[];
  }

  async findById(id: string): Promise<Session | null> {
    const [result] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.id, id));
    return (result as Session) ?? null;
  }

  async create(input: CreateSessionInput): Promise<Session> {
    const [created] = await db
      .insert(sessions)
      .values({
        scenarioId: input.scenarioId,
        scheduledAt: input.scheduledAt,
      })
      .returning();
    return created as Session;
  }

  async update(
    id: string,
    input: UpdateSessionInput,
  ): Promise<Session | null> {
    const values: Record<string, unknown> = { updatedAt: new Date() };
    if (input.status !== undefined) values.status = input.status;
    if (input.scheduledAt !== undefined) values.scheduledAt = input.scheduledAt;

    const [updated] = await db
      .update(sessions)
      .set(values)
      .where(eq(sessions.id, id))
      .returning();
    return (updated as Session) ?? null;
  }

  async delete(id: string): Promise<boolean> {
    const [deleted] = await db
      .delete(sessions)
      .where(eq(sessions.id, id))
      .returning();
    return !!deleted;
  }
}

export const sessionRepository = new SessionRepository();
