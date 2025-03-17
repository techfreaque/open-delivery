import "./env-setup";

async function seedDb(): Promise<void> {
  const { UserRoleValue } = await import("@/next-portal/types/enums");
  const { createUser } = await import("@/lib/api/auth/register");
  await createUser(
    {
      id: "e6f5f3f0-3aa7-4b50-9450-a1e88c590b44",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: "password",
      imageUrl: null,
      confirmPassword: "password",
    },

    UserRoleValue.ADMIN,
  );
  const { prisma } = await import("@/next-portal/db");
  await prisma.$disconnect();
}

void seedDb();
