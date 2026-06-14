import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import {
  seedMockPlaces,
  seedSampleArticles,
} from "@/lib/mock-places";

export { seedMockPlaces, seedSampleArticles };

export async function seedAdminUser(): Promise<void> {
  const email = process.env.ADMIN_EMAIL ?? "admin@eastsider.org";
  const password = process.env.ADMIN_PASSWORD ?? "changeme";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    create: { email, passwordHash },
    update: { passwordHash },
  });
}
