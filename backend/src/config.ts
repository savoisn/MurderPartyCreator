import "dotenv/config";

function required(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required env var: ${key}`);
  return value;
}

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  host: process.env.HOST || "0.0.0.0",
  databaseUrl: required("DATABASE_URL"),
  nodeEnv: process.env.NODE_ENV || "development",
  apiPrefix: (process.env.NODE_ENV || "development") === "production" ? "/api" : "",

  // Auth
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production-min-32-chars!!",
  cookieName: "murder_party_auth",
  cookiePassword:
    process.env.COOKIE_PASSWORD ||
    "dev-cookie-password-change-in-production-min-32-chars!!",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",

  // OAuth providers (optional — Bell strategies only registered if set)
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  },
} as const;
