import type { Server, ServerAuthScheme } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { verifyJwt } from "./jwt.js";
import { config } from "../config.js";
import { userRepository } from "../repositories/user.repository.js";

export const jwtScheme: ServerAuthScheme = (_server: Server, _options) => {
  return {
    authenticate: async (request, h) => {
      const token = request.state[config.cookieName];

      if (!token) {
        throw Boom.unauthorized("Missing authentication");
      }

      try {
        const payload = verifyJwt(token);
        const user = await userRepository.findById(payload.userId);

        if (!user) {
          throw Boom.unauthorized("User not found");
        }

        return h.authenticated({
          credentials: {
            userId: user.id,
            email: user.email,
            role: user.role,
            user,
          },
        });
      } catch (err) {
        if (Boom.isBoom(err)) throw err;
        throw Boom.unauthorized("Invalid token");
      }
    },
  };
};
