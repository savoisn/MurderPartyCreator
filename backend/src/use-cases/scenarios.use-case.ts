import Boom from "@hapi/boom";
import { scenarioRepository } from "../repositories/scenario.repository.js";
import type {
  Scenario,
  CreateScenarioInput,
  UpdateScenarioInput,
} from "../models/scenario.js";

export class ScenariosUseCase {
  async listScenarios(userId: string): Promise<Scenario[]> {
    return scenarioRepository.findAllByUserId(userId);
  }

  async getScenario(scenarioId: string, userId: string): Promise<Scenario> {
    const scenario = await scenarioRepository.findByIdAndUserId(
      scenarioId,
      userId,
    );
    if (!scenario) throw Boom.notFound("Scenario not found");
    return scenario;
  }

  async createScenario(
    userId: string,
    input: CreateScenarioInput,
  ): Promise<Scenario> {
    return scenarioRepository.create({ ...input, userId });
  }

  async updateScenario(
    scenarioId: string,
    userId: string,
    input: UpdateScenarioInput,
  ): Promise<Scenario> {
    const updated = await scenarioRepository.update(scenarioId, userId, input);
    if (!updated) throw Boom.notFound("Scenario not found");
    return updated;
  }

  async deleteScenario(scenarioId: string, userId: string): Promise<void> {
    const deleted = await scenarioRepository.delete(scenarioId, userId);
    if (!deleted) throw Boom.notFound("Scenario not found");
  }
}

export const scenariosUseCase = new ScenariosUseCase();
