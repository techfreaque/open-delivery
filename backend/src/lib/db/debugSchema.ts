import { PrismaClient } from "@prisma/client";

/**
 * Debug function to print information about the schema
 */
export async function inspectSchema(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    // Get information about UserRole model
    const userRoleInfo = await prisma.$queryRaw`
      SELECT sql FROM sqlite_master WHERE type='table' AND name='UserRole'
    `;
    console.log("UserRole table definition:", userRoleInfo);

    // Inspect fields in your models
    const userFields = Object.keys(prisma.user.fields);
    const userRoleFields = Object.keys(prisma.userRole.fields);

    console.log("User model fields:", userFields);
    console.log("UserRole model fields:", userRoleFields);

    // Try to get enum values for UserRoleValue
    const allRoles = Object.values(prisma._baseDmmf.datamodel.enums).find(
      (e) => e.name === "UserRoleValue",
    );

    if (allRoles) {
      console.log("UserRoleValue enum values:", allRoles.values);
    }
  } catch (error) {
    console.error("Error inspecting schema:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if executed directly
if (require.main === module) {
  void inspectSchema().catch(console.error);
}
