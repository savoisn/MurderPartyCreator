import Boom from "@hapi/boom";
import { scenarioRepository } from "../repositories/scenario.repository.js";
import { clueRepository } from "../repositories/clue.repository.js";
import type {
  Clue,
  CreateClueInput,
  UpdateClueInput,
} from "../models/clue.js";

export class CluesUseCase {
  async listClues(scenarioId: string): Promise<Clue[]> {
    await this.ensureScenarioExists(scenarioId);
    return clueRepository.findByScenarioId(scenarioId);
  }

  async getClue(scenarioId: string, clueId: string): Promise<Clue> {
    const clue = await clueRepository.findById(clueId, scenarioId);
    if (!clue) throw Boom.notFound("Clue not found");
    return clue;
  }

  async createClue(
    scenarioId: string,
    input: CreateClueInput,
  ): Promise<Clue> {
    await this.ensureScenarioExists(scenarioId);
    return clueRepository.create(scenarioId, input);
  }

  async updateClue(
    scenarioId: string,
    clueId: string,
    input: UpdateClueInput,
  ): Promise<Clue> {
    const updated = await clueRepository.update(clueId, scenarioId, input);
    if (!updated) throw Boom.notFound("Clue not found");
    return updated;
  }

  async deleteClue(scenarioId: string, clueId: string): Promise<void> {
    const deleted = await clueRepository.delete(clueId, scenarioId);
    if (!deleted) throw Boom.notFound("Clue not found");
  }

  private async ensureScenarioExists(scenarioId: string): Promise<void> {
    const scenario = await scenarioRepository.findById(scenarioId);
    if (!scenario) throw Boom.notFound("Scenario not found");
  }
}

export const cluesUseCase = new CluesUseCase();
