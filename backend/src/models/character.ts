export interface Character {
  id: string;
  scenarioId: string;
  name: string;
  description: string;
  secret: string | null;
  isMurderer: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCharacterInput {
  name: string;
  description: string;
  secret?: string | null;
  isMurderer?: boolean;
}

export interface UpdateCharacterInput {
  name?: string;
  description?: string;
  secret?: string | null;
  isMurderer?: boolean;
}
