import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq, and } from "drizzle-orm";
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
} from "../models/user.js";

export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.id, id));
    return (result as User) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const [result] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return (result as User) ?? null;
  }

  async findByProviderAccount(
    provider: string,
    providerId: string,
  ): Promise<User | null> {
    const [result] = await db
      .select()
      .from(users)
      .where(
        and(eq(users.provider, provider), eq(users.providerId, providerId)),
      );
    return (result as User) ?? null;
  }

  async create(input: CreateUserInput): Promise<User> {
    const [created] = await db.insert(users).values(input).returning();
    return created as User;
  }

  async update(id: string, input: UpdateUserInput): Promise<User | null> {
    const [updated] = await db
      .update(users)
      .set({ ...input, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return (updated as User) ?? null;
  }
}

export const userRepository = new UserRepository();
