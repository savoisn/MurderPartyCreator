export interface Scenario {
  id: string;
  title: string;
  description: string;
  setting: string | null;
  difficulty: "easy" | "medium" | "hard";
  minPlayers: number;
  maxPlayers: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScenarioInput {
  title: string;
  description: string;
  setting?: string;
  difficulty?: "easy" | "medium" | "hard";
  minPlayers?: number;
  maxPlayers?: number;
}
