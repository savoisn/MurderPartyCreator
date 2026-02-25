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
} from "../src/db/schema.js";

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
}

export async function createTestScenario(overrides: Record<string, unknown> = {}) {
  const [scenario] = await db
    .insert(scenarios)
    .values({
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
