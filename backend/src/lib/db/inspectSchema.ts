import { PrismaClient } from "@prisma/client";

/**
 * Debug function to print information about the schema
 */
export async function inspectSchema(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    console.log("Inspecting Prisma Schema...");

    // Get tables in SQLite database
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name NOT LIKE '_prisma_%';
    `;
    console.log("Database Tables:", tables);

    // Get UserRole table structure
    const userRoleTableInfo = await prisma.$queryRaw`
      PRAGMA table_info("UserRole");
    `;
    console.log("UserRole Table Structure:", userRoleTableInfo);

    // Get a list of values in the UserRoleValue enum
    const enums = await prisma.$queryRaw`
      SELECT * FROM "_prisma_migrations";
    `;
    console.log("Prisma Migrations:", enums);

    // Try manually hard-coding a user role to see if it works
    const userId = `test-${Date.now()}`;
    try {
      const user = await prisma.user.create({
        data: {
          id: userId,
          name: "Test User",
          email: `test-${Date.now()}@example.com`,
          password: "password123",
        },
      });
      console.log("Created test user:", user);

      // Try adding a role with various values to see what works
      const possibleRoles = ["ADMIN", "CUSTOMER", "RESTAURANT_OWNER", "DRIVER"];

      for (const role of possibleRoles) {
        try {
          console.log(`Trying to insert role: ${role}`);
          await prisma.$executeRaw`
            INSERT INTO "UserRole" ("userId", "role") 
            VALUES (${userId}, ${role})
          `;
          console.log(`Successfully inserted role: ${role}`);
          break;
        } catch (error) {
          console.error(`Failed to insert role ${role}:`, error);
        }
      }
    } catch (error) {
      console.error("Test user creation failed:", error);
    }
  } catch (error) {
    console.error("Error inspecting schema:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run when executed directly
if (require.main === module) {
  inspectSchema()
    .catch(console.error)
    .finally(() => {
      console.log("Schema inspection complete");
      process.exit(0);
    });
}

export default inspectSchema;
