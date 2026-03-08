import Hapi from "@hapi/hapi";
import { sql } from "drizzle-orm";
import { createServer } from "../src/server.js";
import { db } from "../src/db/index.js";
import {
  sessionClues,
  sessionPlayers,
  sessions,
  clues,
  characters,
  scenarios,
  userEvents,
  users,
} from "../src/db/schema.js";
import { signJwt } from "../src/auth/jwt.js";
import { config } from "../src/config.js";

export const apiBase = config.apiPrefix;
import type { User } from "../src/models/user.js";

let server: Hapi.Server;

export async function getServer(): Promise<Hapi.Server> {
  if (!server) {
    server = await createServer();
    await server.initialize();
  }
  return server;
}

export async function closeServer(): Promise<void> {
  if (server) {
    await server.stop();
  }
}

export async function cleanDb(): Promise<void> {
  // Delete in order respecting FK constraints
  await db.delete(sessionClues);
  await db.delete(sessionPlayers);
  await db.delete(sessions);
  await db.delete(clues);
  await db.delete(characters);
  await db.delete(scenarios);
  await db.delete(userEvents);
  await db.delete(users);
}

export async function createTestUser(
  overrides: Record<string, unknown> = {},
) {
  const [user] = await db
    .insert(users)
    .values({
      email: "test@example.com",
      name: "Test User",
      provider: "github",
      providerId: "123456",
      role: "creator",
      ...overrides,
    })
    .returning();
  return user;
}

export function getAuthCookie(user: { id: string; email: string; role: string }): string {
  const token = signJwt(user as User);
  return `${config.cookieName}=${token}`;
}

export async function createTestScenario(
  userId: string,
  overrides: Record<string, unknown> = {},
) {
  const [scenario] = await db
    .insert(scenarios)
    .values({
      userId,
      title: "Test Scenario",
      description: "A test murder mystery",
      setting: "Test Manor",
      difficulty: "medium",
      minPlayers: 4,
      maxPlayers: 8,
      ...overrides,
    })
    .returning();
  return scenario;
}

export async function createTestCharacter(
  scenarioId: string,
  overrides: Record<string, unknown> = {},
) {
  const [character] = await db
    .insert(characters)
    .values({
      scenarioId,
      name: "Test Character",
      description: "A test character",
      isMurderer: false,
      ...overrides,
    })
    .returning();
  return character;
}

export async function createTestClue(
  scenarioId: string,
  overrides: Record<string, unknown> = {},
) {
  const [clue] = await db
    .insert(clues)
    .values({
      scenarioId,
      title: "Test Clue",
      description: "A test clue",
      type: "physical",
      revealOrder: 1,
      ...overrides,
    })
    .returning();
  return clue;
}

export async function createTestSession(
  scenarioId: string,
  overrides: Record<string, unknown> = {},
) {
  const [session] = await db
    .insert(sessions)
    .values({
      scenarioId,
      ...overrides,
    })
    .returning();
  return session;
}
