import { db } from "./index.js";
import { users, scenarios, characters, clues } from "./schema.js";

async function seed() {
  console.log("Seeding database...");

  // Create a seed user
  const [seedUser] = await db
    .insert(users)
    .values({
      email: "creator@example.com",
      name: "Seed Creator",
      provider: "github",
      providerId: "seed-0",
      role: "creator",
    })
    .returning();

  const [scenario] = await db
    .insert(scenarios)
    .values({
      userId: seedUser.id,
      title: "Murder at the Grand Hotel",
      description:
        "A wealthy businessman is found dead in the library of the Grand Hotel during a stormy night. All guests are suspects.",
      setting: "1920s Grand Hotel",
      difficulty: "medium",
      minPlayers: 4,
      maxPlayers: 8,
    })
    .returning();

  await db.insert(characters).values([
    {
      scenarioId: scenario.id,
      name: "Lady Victoria Sterling",
      description:
        "A sophisticated socialite known for her extravagant parties and sharp wit.",
      secret:
        "She was secretly bankrupt and the victim was her biggest creditor.",
      isMurderer: false,
    },
    {
      scenarioId: scenario.id,
      name: "Colonel James Blackwood",
      description:
        "A retired military officer with a mysterious past and a fondness for whisky.",
      secret:
        "He discovered the victim was selling military secrets to foreign agents.",
      isMurderer: true,
    },
    {
      scenarioId: scenario.id,
      name: "Dr. Eleanor Marsh",
      description:
        "The hotel physician, calm and collected, always carrying her medical bag.",
      secret:
        "She had been falsifying medical records for the victim in exchange for silence about her past.",
      isMurderer: false,
    },
    {
      scenarioId: scenario.id,
      name: "Mr. Arthur Pemberton",
      description:
        "The hotel manager, impeccably dressed and obsessed with maintaining the hotel's reputation.",
      secret:
        "The victim was blackmailing him about embezzled hotel funds.",
      isMurderer: false,
    },
  ]);

  await db.insert(clues).values([
    {
      scenarioId: scenario.id,
      title: "Torn Letter",
      description:
        "A partially burned letter found in the fireplace mentioning 'military documents' and 'betrayal'.",
      type: "document",
      revealOrder: 1,
    },
    {
      scenarioId: scenario.id,
      title: "Muddy Boots",
      description:
        "A pair of muddy military-style boots found near the back entrance, despite the storm.",
      type: "physical",
      revealOrder: 2,
    },
    {
      scenarioId: scenario.id,
      title: "The Butler's Testimony",
      description:
        "The butler recalls hearing a heated argument about 'national security' coming from the library at 10 PM.",
      type: "testimony",
      revealOrder: 3,
    },
    {
      scenarioId: scenario.id,
      title: "Whisky Glass",
      description:
        "A whisky glass with traces of a rare single malt, only served to one guest that evening.",
      type: "physical",
      revealOrder: 4,
    },
  ]);

  console.log(`Seeded scenario: "${scenario.title}" (${scenario.id})`);
  console.log("Done!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
