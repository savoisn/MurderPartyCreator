import { config } from "dotenv";

// Load test env before anything else
config({ path: ".env.test", override: true });
