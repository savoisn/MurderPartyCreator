export type SessionStatus = "draft" | "active" | "completed";

export interface Session {
  id: string;
  scenarioId: string;
  status: SessionStatus;
  scheduledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionPlayer {
  id: string;
  sessionId: string;
  characterId: string;
  playerName: string;
  createdAt: Date;
}

export interface SessionClue {
  id: string;
  sessionId: string;
  clueId: string;
  revealedAt: Date | null;
  createdAt: Date;
}

export interface SessionWithDetails extends Session {
  players: SessionPlayer[];
  clues: SessionClue[];
}

export interface CreateSessionInput {
  scenarioId: string;
  scheduledAt?: Date;
}

export interface UpdateSessionInput {
  status?: SessionStatus;
  scheduledAt?: Date | null;
}

export interface AddPlayerInput {
  characterId: string;
  playerName: string;
}
