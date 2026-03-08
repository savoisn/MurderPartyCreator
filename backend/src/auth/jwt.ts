import jwt from "jsonwebtoken";
import { config } from "../config.js";
import type { User } from "../models/user.js";

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export function signJwt(user: User): string {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, config.jwtSecret) as JwtPayload;
}
