import { describe, it, expect, beforeEach, afterAll } from "vitest";
import {
  getServer,
  closeServer,
  cleanDb,
  createTestScenario,
  createTestClue,
  createTestUser,
  getAuthCookie,
  apiBase,
} from "./helpers.js";

let testUser: { id: string; email: string; role: string };
let authCookie: string;

afterAll(async () => {
  await cleanDb();
  await closeServer();
});

describe("Clues", () => {
  let scenarioId: string;

  beforeEach(async () => {
    await cleanDb();
    testUser = await createTestUser();
    authCookie = getAuthCookie(testUser);
    const scenario = await createTestScenario(testUser.id);
    scenarioId = scenario.id;
  });

  describe("GET /scenarios/{scenarioId}/clues", () => {
    it("returns empty array when no clues exist", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `${apiBase}/scenarios/${scenarioId}/clues`,
        headers: { cookie: authCookie },
      });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ data: [] });
    });

    it("returns clues ordered by revealOrder", async () => {
      await createTestClue(scenarioId, { title: "Clue B", revealOrder: 2 });
      await createTestClue(scenarioId, { title: "Clue A", revealOrder: 1 });

      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `${apiBase}/scenarios/${scenarioId}/clues`,
        headers: { cookie: authCookie },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
      expect(body.data[0].title).toBe("Clue A");
      expect(body.data[1].title).toBe("Clue B");
    });

    it("returns 404 for non-existent scenario", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `${apiBase}/scenarios/00000000-0000-0000-0000-000000000000/clues`,
        headers: { cookie: authCookie },
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /scenarios/{scenarioId}/clues", () => {
    it("creates a clue", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `${apiBase}/scenarios/${scenarioId}/clues`,
        headers: { cookie: authCookie },
        payload: {
          title: "Bloody Knife",
          description: "Found under the bed",
          type: "physical",
          revealOrder: 1,
        },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.title).toBe("Bloody Knife");
      expect(body.data.scenarioId).toBe(scenarioId);
    });

    it("returns 400 for missing revealOrder", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `${apiBase}/scenarios/${scenarioId}/clues`,
        headers: { cookie: authCookie },
        payload: {
          title: "Missing Order",
          description: "A clue without order",
        },
      });
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 for invalid clue type", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `${apiBase}/scenarios/${scenarioId}/clues`,
        headers: { cookie: authCookie },
        payload: {
          title: "Bad Type",
          description: "Invalid",
          type: "magic",
          revealOrder: 1,
        },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /scenarios/{scenarioId}/clues/{clueId}", () => {
    it("returns a clue by id", async () => {
      const clue = await createTestClue(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `${apiBase}/scenarios/${scenarioId}/clues/${clue.id}`,
        headers: { cookie: authCookie },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.id).toBe(clue.id);
    });

    it("returns 404 for non-existent clue", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `${apiBase}/scenarios/${scenarioId}/clues/00000000-0000-0000-0000-000000000000`,
        headers: { cookie: authCookie },
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /scenarios/{scenarioId}/clues/{clueId}", () => {
    it("updates a clue", async () => {
      const clue = await createTestClue(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "PUT",
        url: `${apiBase}/scenarios/${scenarioId}/clues/${clue.id}`,
        headers: { cookie: authCookie },
        payload: { title: "Updated Clue", type: "testimony" },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.title).toBe("Updated Clue");
      expect(body.data.type).toBe("testimony");
    });
  });

  describe("DELETE /scenarios/{scenarioId}/clues/{clueId}", () => {
    it("deletes a clue", async () => {
      const clue = await createTestClue(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "DELETE",
        url: `${apiBase}/scenarios/${scenarioId}/clues/${clue.id}`,
        headers: { cookie: authCookie },
      });
      expect(res.statusCode).toBe(204);

      const getRes = await server.inject({
        method: "GET",
        url: `${apiBase}/scenarios/${scenarioId}/clues/${clue.id}`,
        headers: { cookie: authCookie },
      });
      expect(getRes.statusCode).toBe(404);
    });
  });
});
