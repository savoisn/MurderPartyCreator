import Boom from "@hapi/boom";
import { scenarioRepository } from "../repositories/scenario.repository.js";
import type {
  Scenario,
  CreateScenarioInput,
  UpdateScenarioInput,
} from "../models/scenario.js";

export class ScenariosUseCase {
  async listScenarios(): Promise<Scenario[]> {
    return scenarioRepository.findAll();
  }

  async getScenario(scenarioId: string): Promise<Scenario> {
    const scenario = await scenarioRepository.findById(scenarioId);
    if (!scenario) throw Boom.notFound("Scenario not found");
    return scenario;
  }

  async createScenario(input: CreateScenarioInput): Promise<Scenario> {
    return scenarioRepository.create(input);
  }

  async updateScenario(
    scenarioId: string,
    input: UpdateScenarioInput,
  ): Promise<Scenario> {
    const updated = await scenarioRepository.update(scenarioId, input);
    if (!updated) throw Boom.notFound("Scenario not found");
    return updated;
  }

  async deleteScenario(scenarioId: string): Promise<void> {
    const deleted = await scenarioRepository.delete(scenarioId);
    if (!deleted) throw Boom.notFound("Scenario not found");
  }
}

export const scenariosUseCase = new ScenariosUseCase();
