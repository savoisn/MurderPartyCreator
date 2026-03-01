import Boom from "@hapi/boom";
import { scenarioRepository } from "../repositories/scenario.repository.js";
import { sessionRepository } from "../repositories/session.repository.js";
import { sessionPlayerRepository } from "../repositories/session-player.repository.js";
import { sessionClueRepository } from "../repositories/session-clue.repository.js";
import { characterRepository } from "../repositories/character.repository.js";
import { clueRepository } from "../repositories/clue.repository.js";
import type {
  Session,
  SessionWithDetails,
  SessionPlayer,
  SessionClue,
  SessionStatus,
  CreateSessionInput,
  UpdateSessionInput,
  AddPlayerInput,
} from "../models/session.js";

const VALID_TRANSITIONS: Record<SessionStatus, SessionStatus[]> = {
  draft: ["active"],
  active: ["completed"],
  completed: [],
};

export class SessionsUseCase {
  async listSessions(): Promise<Session[]> {
    return sessionRepository.findAll();
  }

  async getSession(sessionId: string): Promise<SessionWithDetails> {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw Boom.notFound("Session not found");

    const players = await sessionPlayerRepository.findBySessionId(sessionId);
    const clues = await sessionClueRepository.findBySessionId(sessionId);

    return { ...session, players, clues };
  }

  async createSession(input: CreateSessionInput): Promise<Session> {
    const scenario = await scenarioRepository.findById(input.scenarioId);
    if (!scenario) throw Boom.notFound("Scenario not found");

    return sessionRepository.create(input);
  }

  async updateSession(
    sessionId: string,
    input: UpdateSessionInput,
  ): Promise<Session> {
    if (input.status) {
      const current = await sessionRepository.findById(sessionId);
      if (!current) throw Boom.notFound("Session not found");

      const allowed = VALID_TRANSITIONS[current.status] || [];
      if (!allowed.includes(input.status)) {
        throw Boom.badRequest(
          `Cannot transition from "${current.status}" to "${input.status}"`,
        );
      }
    }

    const updated = await sessionRepository.update(sessionId, input);
    if (!updated) throw Boom.notFound("Session not found");
    return updated;
  }

  async deleteSession(sessionId: string): Promise<void> {
    const deleted = await sessionRepository.delete(sessionId);
    if (!deleted) throw Boom.notFound("Session not found");
  }

  async addPlayer(
    sessionId: string,
    input: AddPlayerInput,
  ): Promise<SessionPlayer> {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw Boom.notFound("Session not found");

    const character = await characterRepository.findById(
      input.characterId,
      session.scenarioId,
    );
    if (!character) {
      throw Boom.badRequest("Character does not belong to this scenario");
    }

    return sessionPlayerRepository.create(sessionId, input);
  }

  async removePlayer(sessionId: string, playerId: string): Promise<void> {
    const deleted = await sessionPlayerRepository.delete(playerId, sessionId);
    if (!deleted) throw Boom.notFound("Player not found");
  }

  async revealClue(
    sessionId: string,
    clueId: string,
  ): Promise<{ data: SessionClue; created: boolean }> {
    const session = await sessionRepository.findById(sessionId);
    if (!session) throw Boom.notFound("Session not found");

    const clue = await clueRepository.findById(clueId, session.scenarioId);
    if (!clue) {
      throw Boom.badRequest("Clue does not belong to this scenario");
    }

    const existing = await sessionClueRepository.findBySessionAndClue(
      sessionId,
      clueId,
    );

    if (existing?.revealedAt) {
      throw Boom.conflict("Clue already revealed");
    }

    if (existing) {
      const updated = await sessionClueRepository.markAsRevealed(existing.id);
      return { data: updated!, created: false };
    }

    const created = await sessionClueRepository.create(sessionId, clueId);
    return { data: created, created: true };
  }
}

export const sessionsUseCase = new SessionsUseCase();
