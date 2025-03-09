/*
  Warnings:

  - Added the required column `latitude` to the `drivers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `drivers` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_drivers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "vehicle" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "radius" REAL NOT NULL,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "drivers_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "drivers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_drivers" ("city", "countryId", "createdAt", "id", "isActive", "licensePlate", "radius", "street", "streetNumber", "updatedAt", "userId", "vehicle", "zip") SELECT "city", "countryId", "createdAt", "id", "isActive", "licensePlate", "radius", "street", "streetNumber", "updatedAt", "userId", "vehicle", "zip" FROM "drivers";
DROP TABLE "drivers";
ALTER TABLE "new_drivers" RENAME TO "drivers";
CREATE UNIQUE INDEX "drivers_userId_key" ON "drivers"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
