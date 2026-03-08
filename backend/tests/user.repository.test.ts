import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { cleanDb } from "./helpers.js";
import { userRepository } from "../src/repositories/user.repository.js";
import { userEventRepository } from "../src/repositories/user-event.repository.js";
import { authUseCase } from "../src/use-cases/auth.use-case.js";

const aliceGithubUser = {
  email: "alice@example.com",
  name: "Alice",
  provider: "github",
  providerId: "111",
};

const newGithubUser = {
  email: "new@example.com",
  name: "New User",
  provider: "github",
  providerId: "999",
};

const existingGithubUser = {
  email: "existing@example.com",
  name: "Existing",
  provider: "github",
  providerId: "888",
};

afterAll(async () => {
  await cleanDb();
});

describe("UserRepository.findByEmail", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  it("returns the user when email exists", async () => {
    const created = await userRepository.create(aliceGithubUser);

    const found = await userRepository.findByEmail(aliceGithubUser.email);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
    expect(found!.email).toBe(aliceGithubUser.email);
  });

  it("returns null when email does not exist", async () => {
    const found = await userRepository.findByEmail("nobody@example.com");
    expect(found).toBeNull();
  });
});

describe("AuthUseCase.findOrCreateUser", () => {
  beforeEach(async () => {
    await cleanDb();
  });

  it("creates a new user and logs a creation event", async () => {
    const user = await authUseCase.findOrCreateUser(newGithubUser);

    expect(user.email).toBe(newGithubUser.email);
    expect(user.role).toBe("player");

    const events = await userEventRepository.findByUserId(user.id);
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("creation");
    expect(events[0].provider).toBe(newGithubUser.provider);
    expect(events[0].providerId).toBe(newGithubUser.providerId);
  });

  it("returns existing user and logs a login event", async () => {
    const existing = await userRepository.create(existingGithubUser);

    const user = await authUseCase.findOrCreateUser(existingGithubUser);

    expect(user.id).toBe(existing.id);

    const events = await userEventRepository.findByUserId(user.id);
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe("login");
    expect(events[0].provider).toBe(existingGithubUser.provider);
    expect(events[0].providerId).toBe(existingGithubUser.providerId);
  });
});
