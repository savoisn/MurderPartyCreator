import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["player", "creator"]);

export const difficultyEnum = pgEnum("difficulty", [
  "easy",
  "medium",
  "hard",
]);

export const sessionStatusEnum = pgEnum("session_status", [
  "draft",
  "active",
  "completed",
]);

export const clueTypeEnum = pgEnum("clue_type", [
  "physical",
  "testimony",
  "document",
  "environmental",
]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    name: varchar("name", { length: 255 }),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerId: varchar("provider_id", { length: 255 }).notNull(),
    role: userRoleEnum("role").default("player").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_provider_provider_id_idx").on(
      table.provider,
      table.providerId,
    ),
  ],
);

export const userEventTypeEnum = pgEnum("user_event_type", [
  "creation",
  "login",
  "logout",
  "role_change",
  "profile_update",
]);

export const userEvents = pgTable("user_events", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: userEventTypeEnum("type").notNull(),
  provider: varchar("provider", { length: 50 }),
  providerId: varchar("provider_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const scenarios = pgTable("scenarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  setting: varchar("setting", { length: 255 }),
  difficulty: difficultyEnum("difficulty").default("medium").notNull(),
  minPlayers: integer("min_players").notNull().default(4),
  maxPlayers: integer("max_players").notNull().default(12),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const characters = pgTable("characters", {
  id: uuid("id").defaultRandom().primaryKey(),
  scenarioId: uuid("scenario_id")
    .notNull()
    .references(() => scenarios.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  secret: text("secret"),
  isMurderer: boolean("is_murderer").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const clues = pgTable("clues", {
  id: uuid("id").defaultRandom().primaryKey(),
  scenarioId: uuid("scenario_id")
    .notNull()
    .references(() => scenarios.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: clueTypeEnum("type").default("physical").notNull(),
  revealOrder: integer("reveal_order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  scenarioId: uuid("scenario_id")
    .notNull()
    .references(() => scenarios.id),
  status: sessionStatusEnum("status").default("draft").notNull(),
  scheduledAt: timestamp("scheduled_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessionPlayers = pgTable("session_players", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  characterId: uuid("character_id")
    .notNull()
    .references(() => characters.id),
  playerName: varchar("player_name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sessionClues = pgTable("session_clues", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionId: uuid("session_id")
    .notNull()
    .references(() => sessions.id, { onDelete: "cascade" }),
  clueId: uuid("clue_id")
    .notNull()
    .references(() => clues.id),
  revealedAt: timestamp("revealed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
