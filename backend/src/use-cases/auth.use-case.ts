import { userRepository } from "../repositories/user.repository.js";
import { userEventRepository } from "../repositories/user-event.repository.js";
import type { User, CreateUserInput } from "../models/user.js";

export class AuthUseCase {
  async findOrCreateUser(input: {
    email: string;
    name?: string;
    avatarUrl?: string;
    provider: string;
    providerId: string;
  }): Promise<User> {
    // Try to find by provider account
    let user = await userRepository.findByEmail(
      input.email,
    );

    if (user) {
      // Update profile info if changed
      if (user.name !== input.name || user.avatarUrl !== input.avatarUrl) {
        user =
          (await userRepository.update(user.id, {
            name: input.name,
            avatarUrl: input.avatarUrl,
          })) ?? user;
      }
      await userEventRepository.create({ userId: user.id, type: "login", provider: input.provider, providerId: input.providerId });
      return user;
    }

    // Create new user with default role 'player'
    const newUser: CreateUserInput = {
      email: input.email,
      name: input.name,
      avatarUrl: input.avatarUrl,
      provider: input.provider,
      providerId: input.providerId,
      role: "player",
    };

    const created = await userRepository.create(newUser);
    await userEventRepository.create({ userId: created.id, type: "creation", provider: input.provider, providerId: input.providerId });
    return created;
  }
}

export const authUseCase = new AuthUseCase();
