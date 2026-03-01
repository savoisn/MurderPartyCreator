export type ClueType = "physical" | "testimony" | "document" | "environmental";

export interface Clue {
  id: string;
  scenarioId: string;
  title: string;
  description: string;
  type: ClueType;
  revealOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClueInput {
  title: string;
  description: string;
  type?: ClueType;
  revealOrder: number;
}

export interface UpdateClueInput {
  title?: string;
  description?: string;
  type?: ClueType;
  revealOrder?: number;
}
