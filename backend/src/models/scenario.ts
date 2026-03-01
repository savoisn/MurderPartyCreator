export type Difficulty = "easy" | "medium" | "hard";

export interface Scenario {
  id: string;
  title: string;
  description: string;
  setting: string | null;
  difficulty: Difficulty;
  minPlayers: number;
  maxPlayers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateScenarioInput {
  title: string;
  description: string;
  setting?: string;
  difficulty?: Difficulty;
  minPlayers?: number;
  maxPlayers?: number;
}

export interface UpdateScenarioInput {
  title?: string;
  description?: string;
  setting?: string | null;
  difficulty?: Difficulty;
  minPlayers?: number;
  maxPlayers?: number;
}
