import { Request, ResponseToolkit } from "@hapi/hapi";
import Boom from "@hapi/boom";
import { authUseCase } from "../use-cases/auth.use-case.js";
import { signJwt } from "../auth/jwt.js";
import { config } from "../config.js";

export async function handleOAuthCallback(
  request: Request,
  h: ResponseToolkit,
) {
  if (!request.auth.isAuthenticated) {
    throw Boom.unauthorized("Authentication failed");
  }

  const credentials = request.auth.credentials as any;
  const profile = credentials.profile;
  const provider = credentials.provider;

  let email: string;
  let name: string | undefined;
  let avatarUrl: string | undefined;
  let providerId: string;

  if (provider === "github") {
    email = profile.email || profile.emails?.[0]?.value;
    name = profile.displayName || profile.username;
    avatarUrl = profile.raw?.avatar_url;
    providerId = String(profile.id);
  } else if (provider === "google") {
    email = profile.email;
    name = profile.displayName;
    avatarUrl = profile.raw?.picture;
    providerId = String(profile.id);
  } else {
    throw Boom.badImplementation("Unknown provider");
  }

  if (!email) {
    throw Boom.badRequest("Email not provided by OAuth provider");
  }

  const user = await authUseCase.findOrCreateUser({
    email,
    name,
    avatarUrl,
    provider,
    providerId,
  });

  const token = signJwt(user);

  h.state(config.cookieName, token, {
    isHttpOnly: true,
    isSecure: config.nodeEnv === "production",
    isSameSite: "Lax",
    path: "/",
    ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return h.redirect(`${config.frontendUrl}/scenarios`);
}

export async function getCurrentUser(request: Request, h: ResponseToolkit) {
  const { user } = request.auth.credentials as any;

  return h.response({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
    },
  });
}

export async function logout(_request: Request, h: ResponseToolkit) {
  h.unstate(config.cookieName, {
    isHttpOnly: true,
    isSecure: config.nodeEnv === "production",
    isSameSite: "Lax",
    path: "/",
  });
  return h.response({ data: { message: "Logged out" } });
}
