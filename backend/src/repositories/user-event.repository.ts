import { db } from "../db/index.js";
import { userEvents } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { UserEvent, CreateUserEventInput } from "../models/user-event.js";

export class UserEventRepository {
  async create(input: CreateUserEventInput): Promise<UserEvent> {
    const [created] = await db.insert(userEvents).values(input).returning();
    return created as UserEvent;
  }

  async findByUserId(userId: string): Promise<UserEvent[]> {
    const results = await db
      .select()
      .from(userEvents)
      .where(eq(userEvents.userId, userId))
      .orderBy(userEvents.createdAt);
    return results as UserEvent[];
  }
}

export const userEventRepository = new UserEventRepository();
