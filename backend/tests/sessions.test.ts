import { describe, it, expect, beforeEach, afterAll } from "vitest";
import {
  getServer,
  closeServer,
  cleanDb,
  createTestScenario,
  createTestCharacter,
  createTestClue,
  createTestSession,
} from "./helpers.js";
import { db } from "../src/db/index.js";
import { sessions } from "../src/db/schema.js";
import { eq } from "drizzle-orm";

afterAll(async () => {
  await cleanDb();
  await closeServer();
});

describe("Sessions", () => {
  let scenarioId: string;

  beforeEach(async () => {
    await cleanDb();
    const scenario = await createTestScenario();
    scenarioId = scenario.id;
  });

  describe("GET /sessions", () => {
    it("returns empty array when no sessions exist", async () => {
      const server = await getServer();
      const res = await server.inject({ method: "GET", url: "/sessions" });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ data: [] });
    });

    it("returns all sessions", async () => {
      await createTestSession(scenarioId);
      await createTestSession(scenarioId);

      const server = await getServer();
      const res = await server.inject({ method: "GET", url: "/sessions" });
      const body = JSON.parse(res.payload);
      expect(body.data).toHaveLength(2);
    });
  });

  describe("POST /sessions", () => {
    it("creates a session", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/sessions",
        payload: { scenarioId },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.scenarioId).toBe(scenarioId);
      expect(body.data.status).toBe("draft");
    });

    it("creates a session with scheduledAt", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/sessions",
        payload: {
          scenarioId,
          scheduledAt: "2026-03-15T19:00:00.000Z",
        },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.scheduledAt).toBeDefined();
    });

    it("returns 404 for non-existent scenario", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/sessions",
        payload: { scenarioId: "00000000-0000-0000-0000-000000000000" },
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("GET /sessions/{sessionId}", () => {
    it("returns a session with players and clues", async () => {
      const session = await createTestSession(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `/sessions/${session.id}`,
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.id).toBe(session.id);
      expect(body.data.players).toEqual([]);
      expect(body.data.clues).toEqual([]);
    });

    it("returns 404 for non-existent session", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: "/sessions/00000000-0000-0000-0000-000000000000",
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PATCH /sessions/{sessionId}", () => {
    it("transitions from draft to active", async () => {
      const session = await createTestSession(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "PATCH",
        url: `/sessions/${session.id}`,
        payload: { status: "active" },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.status).toBe("active");
    });

    it("transitions from active to completed", async () => {
      const session = await createTestSession(scenarioId, { status: "active" });

      const server = await getServer();
      const res = await server.inject({
        method: "PATCH",
        url: `/sessions/${session.id}`,
        payload: { status: "completed" },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.status).toBe("completed");
    });

    it("rejects invalid transition draft -> completed", async () => {
      const session = await createTestSession(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "PATCH",
        url: `/sessions/${session.id}`,
        payload: { status: "completed" },
      });
      expect(res.statusCode).toBe(400);
    });

    it("rejects going back from active to draft", async () => {
      const session = await createTestSession(scenarioId, { status: "active" });

      const server = await getServer();
      const res = await server.inject({
        method: "PATCH",
        url: `/sessions/${session.id}`,
        payload: { status: "draft" },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("DELETE /sessions/{sessionId}", () => {
    it("deletes a session", async () => {
      const session = await createTestSession(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "DELETE",
        url: `/sessions/${session.id}`,
      });
      expect(res.statusCode).toBe(204);
    });
  });

  describe("POST /sessions/{sessionId}/players", () => {
    it("assigns a player to a character", async () => {
      const session = await createTestSession(scenarioId);
      const character = await createTestCharacter(scenarioId, {
        name: "Detective",
      });

      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `/sessions/${session.id}/players`,
        payload: {
          characterId: character.id,
          playerName: "Alice",
        },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.playerName).toBe("Alice");
      expect(body.data.characterId).toBe(character.id);
    });

    it("rejects character from a different scenario", async () => {
      const otherScenario = await createTestScenario({ title: "Other" });
      const otherCharacter = await createTestCharacter(otherScenario.id);
      const session = await createTestSession(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `/sessions/${session.id}/players`,
        payload: {
          characterId: otherCharacter.id,
          playerName: "Hacker",
        },
      });
      expect(res.statusCode).toBe(400);
    });

    it("returns 404 for non-existent session", async () => {
      const character = await createTestCharacter(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/sessions/00000000-0000-0000-0000-000000000000/players",
        payload: { characterId: character.id, playerName: "Nobody" },
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /sessions/{sessionId}/players/{playerId}", () => {
    it("removes a player", async () => {
      const session = await createTestSession(scenarioId);
      const character = await createTestCharacter(scenarioId);

      const server = await getServer();
      const addRes = await server.inject({
        method: "POST",
        url: `/sessions/${session.id}/players`,
        payload: { characterId: character.id, playerName: "Alice" },
      });
      const playerId = JSON.parse(addRes.payload).data.id;

      const res = await server.inject({
        method: "DELETE",
        url: `/sessions/${session.id}/players/${playerId}`,
      });
      expect(res.statusCode).toBe(204);
    });

    it("returns 404 for non-existent player", async () => {
      const session = await createTestSession(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "DELETE",
        url: `/sessions/${session.id}/players/00000000-0000-0000-0000-000000000000`,
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /sessions/{sessionId}/clues/{clueId}/reveal", () => {
    it("reveals a clue", async () => {
      const session = await createTestSession(scenarioId);
      const clue = await createTestClue(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `/sessions/${session.id}/clues/${clue.id}/reveal`,
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.clueId).toBe(clue.id);
      expect(body.data.revealedAt).toBeDefined();
    });

    it("rejects revealing the same clue twice", async () => {
      const session = await createTestSession(scenarioId);
      const clue = await createTestClue(scenarioId);

      const server = await getServer();
      await server.inject({
        method: "POST",
        url: `/sessions/${session.id}/clues/${clue.id}/reveal`,
      });

      const res = await server.inject({
        method: "POST",
        url: `/sessions/${session.id}/clues/${clue.id}/reveal`,
      });
      expect(res.statusCode).toBe(409);
    });

    it("rejects clue from a different scenario", async () => {
      const otherScenario = await createTestScenario({ title: "Other" });
      const otherClue = await createTestClue(otherScenario.id);
      const session = await createTestSession(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `/sessions/${session.id}/clues/${otherClue.id}/reveal`,
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
