export type UserRole = "player" | "creator";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: string;
  providerId: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name?: string;
  avatarUrl?: string;
  provider: string;
  providerId: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  avatarUrl?: string;
  role?: UserRole;
}
