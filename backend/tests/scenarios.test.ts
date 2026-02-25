import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { getServer, closeServer, cleanDb, createTestScenario } from "./helpers.js";

afterAll(async () => {
  await cleanDb();
  await closeServer();
});

describe("Scenarios", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  describe("GET /scenarios", () => {
    it("returns empty array when no scenarios exist", async () => {
      const server = await getServer();
      const res = await server.inject({ method: "GET", url: "/scenarios" });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ data: [] });
    });

    it("returns all scenarios", async () => {
      await createTestScenario({ title: "Scenario 1" });
      await createTestScenario({ title: "Scenario 2" });

      const server = await getServer();
      const res = await server.inject({ method: "GET", url: "/scenarios" });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
    });
  });

  describe("POST /scenarios", () => {
    it("creates a scenario with required fields", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/scenarios",
        payload: {
          title: "Murder at the Mansion",
          description: "A thrilling mystery",
        },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.title).toBe("Murder at the Mansion");
      expect(body.data.difficulty).toBe("medium");
      expect(body.data.minPlayers).toBe(4);
      expect(body.data.id).toBeDefined();
    });

    it("creates a scenario with all fields", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/scenarios",
        payload: {
          title: "The Grand Hotel Mystery",
          description: "Who killed the butler?",
          setting: "1920s Hotel",
          difficulty: "hard",
          minPlayers: 6,
          maxPlayers: 10,
        },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.setting).toBe("1920s Hotel");
      expect(body.data.difficulty).toBe("hard");
      expect(body.data.maxPlayers).toBe(10);
    });

    it("returns 400 for missing required fields", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/scenarios",
        payload: { title: "No description" },
      });
      expect(res.statusCode).toBe(400);
    });

    it("returns 400 for invalid difficulty", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/scenarios",
        payload: {
          title: "Test",
          description: "Test",
          difficulty: "impossible",
        },
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("GET /scenarios/{scenarioId}", () => {
    it("returns a scenario by id", async () => {
      const scenario = await createTestScenario();

      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `/scenarios/${scenario.id}`,
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.id).toBe(scenario.id);
      expect(body.data.title).toBe("Test Scenario");
    });

    it("returns 404 for non-existent scenario", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: "/scenarios/00000000-0000-0000-0000-000000000000",
      });
      expect(res.statusCode).toBe(404);
    });

    it("returns 400 for invalid uuid", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: "/scenarios/not-a-uuid",
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("PUT /scenarios/{scenarioId}", () => {
    it("updates a scenario", async () => {
      const scenario = await createTestScenario();

      const server = await getServer();
      const res = await server.inject({
        method: "PUT",
        url: `/scenarios/${scenario.id}`,
        payload: { title: "Updated Title" },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.title).toBe("Updated Title");
      expect(body.data.description).toBe("A test murder mystery");
    });

    it("returns 404 for non-existent scenario", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "PUT",
        url: "/scenarios/00000000-0000-0000-0000-000000000000",
        payload: { title: "Nope" },
      });
      expect(res.statusCode).toBe(404);
    });

    it("returns 400 for empty payload", async () => {
      const scenario = await createTestScenario();

      const server = await getServer();
      const res = await server.inject({
        method: "PUT",
        url: `/scenarios/${scenario.id}`,
        payload: {},
      });
      expect(res.statusCode).toBe(400);
    });
  });

  describe("DELETE /scenarios/{scenarioId}", () => {
    it("deletes a scenario", async () => {
      const scenario = await createTestScenario();

      const server = await getServer();
      const res = await server.inject({
        method: "DELETE",
        url: `/scenarios/${scenario.id}`,
      });
      expect(res.statusCode).toBe(204);

      // Verify it's gone
      const getRes = await server.inject({
        method: "GET",
        url: `/scenarios/${scenario.id}`,
      });
      expect(getRes.statusCode).toBe(404);
    });

    it("returns 404 for non-existent scenario", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "DELETE",
        url: "/scenarios/00000000-0000-0000-0000-000000000000",
      });
      expect(res.statusCode).toBe(404);
    });
  });
});
