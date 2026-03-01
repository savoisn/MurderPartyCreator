import Boom from "@hapi/boom";
import { scenarioRepository } from "../repositories/scenario.repository.js";
import { characterRepository } from "../repositories/character.repository.js";
import type {
  Character,
  CreateCharacterInput,
  UpdateCharacterInput,
} from "../models/character.js";

export class CharactersUseCase {
  async listCharacters(scenarioId: string): Promise<Character[]> {
    await this.ensureScenarioExists(scenarioId);
    return characterRepository.findByScenarioId(scenarioId);
  }

  async getCharacter(
    scenarioId: string,
    characterId: string,
  ): Promise<Character> {
    const character = await characterRepository.findById(
      characterId,
      scenarioId,
    );
    if (!character) throw Boom.notFound("Character not found");
    return character;
  }

  async createCharacter(
    scenarioId: string,
    input: CreateCharacterInput,
  ): Promise<Character> {
    await this.ensureScenarioExists(scenarioId);
    return characterRepository.create(scenarioId, input);
  }

  async updateCharacter(
    scenarioId: string,
    characterId: string,
    input: UpdateCharacterInput,
  ): Promise<Character> {
    const updated = await characterRepository.update(
      characterId,
      scenarioId,
      input,
    );
    if (!updated) throw Boom.notFound("Character not found");
    return updated;
  }

  async deleteCharacter(
    scenarioId: string,
    characterId: string,
  ): Promise<void> {
    const deleted = await characterRepository.delete(characterId, scenarioId);
    if (!deleted) throw Boom.notFound("Character not found");
  }

  private async ensureScenarioExists(scenarioId: string): Promise<void> {
    const scenario = await scenarioRepository.findById(scenarioId);
    if (!scenario) throw Boom.notFound("Scenario not found");
  }
}

export const charactersUseCase = new CharactersUseCase();
