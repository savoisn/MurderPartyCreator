export type UserEventType =
  | "creation"
  | "login"
  | "logout"
  | "role_change"
  | "profile_update";

export interface UserEvent {
  id: string;
  userId: string;
  type: UserEventType;
  provider: string | null;
  providerId: string | null;
  createdAt: Date;
}

export interface CreateUserEventInput {
  userId: string;
  type: UserEventType;
  provider?: string;
  providerId?: string;
}
