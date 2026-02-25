import { InferSelectModel, InferInsertModel } from "drizzle-orm";
import {
  scenarios,
  characters,
  clues,
  sessions,
  sessionPlayers,
  sessionClues,
} from "../db/schema.js";

export type Scenario = InferSelectModel<typeof scenarios>;
export type NewScenario = InferInsertModel<typeof scenarios>;

export type Character = InferSelectModel<typeof characters>;
export type NewCharacter = InferInsertModel<typeof characters>;

export type Clue = InferSelectModel<typeof clues>;
export type NewClue = InferInsertModel<typeof clues>;

export type Session = InferSelectModel<typeof sessions>;
export type NewSession = InferInsertModel<typeof sessions>;

export type SessionPlayer = InferSelectModel<typeof sessionPlayers>;
export type NewSessionPlayer = InferInsertModel<typeof sessionPlayers>;

export type SessionClue = InferSelectModel<typeof sessionClues>;
export type NewSessionClue = InferInsertModel<typeof sessionClues>;
