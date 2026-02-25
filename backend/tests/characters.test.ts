import { describe, it, expect, beforeEach, afterAll } from "vitest";
import {
  getServer,
  closeServer,
  cleanDb,
  createTestScenario,
  createTestCharacter,
} from "./helpers.js";

afterAll(async () => {
  await cleanDb();
  await closeServer();
});

describe("Characters", () => {
  let scenarioId: string;

  beforeEach(async () => {
    await cleanDb();
    const scenario = await createTestScenario();
    scenarioId = scenario.id;
  });

  describe("GET /scenarios/{scenarioId}/characters", () => {
    it("returns empty array when no characters exist", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `/scenarios/${scenarioId}/characters`,
      });
      expect(res.statusCode).toBe(200);
      expect(JSON.parse(res.payload)).toEqual({ data: [] });
    });

    it("returns all characters for a scenario", async () => {
      await createTestCharacter(scenarioId, { name: "Alice" });
      await createTestCharacter(scenarioId, { name: "Bob" });

      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `/scenarios/${scenarioId}/characters`,
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data).toHaveLength(2);
    });

    it("returns 404 for non-existent scenario", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: "/scenarios/00000000-0000-0000-0000-000000000000/characters",
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("POST /scenarios/{scenarioId}/characters", () => {
    it("creates a character", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `/scenarios/${scenarioId}/characters`,
        payload: {
          name: "Lady Victoria",
          description: "A wealthy socialite",
          secret: "She is bankrupt",
          isMurderer: false,
        },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.name).toBe("Lady Victoria");
      expect(body.data.scenarioId).toBe(scenarioId);
      expect(body.data.secret).toBe("She is bankrupt");
    });

    it("creates a character with minimal fields", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `/scenarios/${scenarioId}/characters`,
        payload: {
          name: "John",
          description: "A simple man",
        },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(201);
      expect(body.data.isMurderer).toBe(false);
    });

    it("returns 400 for missing name", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: `/scenarios/${scenarioId}/characters`,
        payload: { description: "No name" },
      });
      expect(res.statusCode).toBe(400);
    });

    it("returns 404 for non-existent scenario", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "POST",
        url: "/scenarios/00000000-0000-0000-0000-000000000000/characters",
        payload: { name: "Ghost", description: "Spooky" },
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("GET /scenarios/{scenarioId}/characters/{characterId}", () => {
    it("returns a character by id", async () => {
      const character = await createTestCharacter(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `/scenarios/${scenarioId}/characters/${character.id}`,
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.id).toBe(character.id);
    });

    it("returns 404 for non-existent character", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "GET",
        url: `/scenarios/${scenarioId}/characters/00000000-0000-0000-0000-000000000000`,
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("PUT /scenarios/{scenarioId}/characters/{characterId}", () => {
    it("updates a character", async () => {
      const character = await createTestCharacter(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "PUT",
        url: `/scenarios/${scenarioId}/characters/${character.id}`,
        payload: { name: "Updated Name", isMurderer: true },
      });
      const body = JSON.parse(res.payload);
      expect(res.statusCode).toBe(200);
      expect(body.data.name).toBe("Updated Name");
      expect(body.data.isMurderer).toBe(true);
    });

    it("returns 404 for non-existent character", async () => {
      const server = await getServer();
      const res = await server.inject({
        method: "PUT",
        url: `/scenarios/${scenarioId}/characters/00000000-0000-0000-0000-000000000000`,
        payload: { name: "Nope" },
      });
      expect(res.statusCode).toBe(404);
    });
  });

  describe("DELETE /scenarios/{scenarioId}/characters/{characterId}", () => {
    it("deletes a character", async () => {
      const character = await createTestCharacter(scenarioId);

      const server = await getServer();
      const res = await server.inject({
        method: "DELETE",
        url: `/scenarios/${scenarioId}/characters/${character.id}`,
      });
      expect(res.statusCode).toBe(204);

      const getRes = await server.inject({
        method: "GET",
        url: `/scenarios/${scenarioId}/characters/${character.id}`,
      });
      expect(getRes.statusCode).toBe(404);
    });
  });
});
