import { createServer } from "./server.js";

async function start() {
  const server = await createServer();
  await server.start();
  console.log(`Server running on ${server.info.uri}`);
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
