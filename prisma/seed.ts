import {
  seedAdminUser,
  seedMockPlaces,
  seedSampleArticles,
} from "../src/lib/seed";

async function main() {
  console.log("Seeding admin user...");
  await seedAdminUser();

  console.log("Seeding Worcester places...");
  const placeCount = await seedMockPlaces();
  console.log(`Seeded ${placeCount} places.`);

  console.log("Seeding sample articles...");
  const articleCount = await seedSampleArticles();
  console.log(`Seeded ${articleCount} articles.`);

  console.log("Done.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/db");
    await prisma.$disconnect();
  });
