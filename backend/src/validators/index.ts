import Joi from "joi";

const uuidParam = Joi.string().uuid();

// Scenarios
export const scenarioParams = Joi.object({
  scenarioId: uuidParam.required(),
});

export const createScenarioPayload = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().required(),
  setting: Joi.string().max(255).optional(),
  difficulty: Joi.string().valid("easy", "medium", "hard").default("medium"),
  minPlayers: Joi.number().integer().min(2).default(4),
  maxPlayers: Joi.number().integer().min(2).default(12),
});

export const updateScenarioPayload = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string(),
  setting: Joi.string().max(255).allow(null),
  difficulty: Joi.string().valid("easy", "medium", "hard"),
  minPlayers: Joi.number().integer().min(2),
  maxPlayers: Joi.number().integer().min(2),
}).min(1);

// Characters
export const characterParams = Joi.object({
  scenarioId: uuidParam.required(),
  characterId: uuidParam.required(),
});

export const createCharacterPayload = Joi.object({
  name: Joi.string().max(255).required(),
  description: Joi.string().required(),
  secret: Joi.string().optional().allow(null),
  isMurderer: Joi.boolean().default(false),
});

export const updateCharacterPayload = Joi.object({
  name: Joi.string().max(255),
  description: Joi.string(),
  secret: Joi.string().allow(null),
  isMurderer: Joi.boolean(),
}).min(1);

// Clues
export const clueParams = Joi.object({
  scenarioId: uuidParam.required(),
  clueId: uuidParam.required(),
});

export const createCluePayload = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().required(),
  type: Joi.string()
    .valid("physical", "testimony", "document", "environmental")
    .default("physical"),
  revealOrder: Joi.number().integer().min(0).required(),
});

export const updateCluePayload = Joi.object({
  title: Joi.string().max(255),
  description: Joi.string(),
  type: Joi.string().valid("physical", "testimony", "document", "environmental"),
  revealOrder: Joi.number().integer().min(0),
}).min(1);

// Sessions
export const sessionParams = Joi.object({
  sessionId: uuidParam.required(),
});

export const createSessionPayload = Joi.object({
  scenarioId: Joi.string().uuid().required(),
  scheduledAt: Joi.date().iso().optional(),
});

export const updateSessionPayload = Joi.object({
  status: Joi.string().valid("draft", "active", "completed"),
  scheduledAt: Joi.date().iso().allow(null),
}).min(1);

// Session Players
export const sessionPlayerParams = Joi.object({
  sessionId: uuidParam.required(),
  playerId: uuidParam.required(),
});

export const createSessionPlayerPayload = Joi.object({
  characterId: Joi.string().uuid().required(),
  playerName: Joi.string().max(255).required(),
});

// Session Clue Reveal
export const sessionClueParams = Joi.object({
  sessionId: uuidParam.required(),
  clueId: uuidParam.required(),
});
