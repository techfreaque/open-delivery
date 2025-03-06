/*
  Warnings:

  - You are about to drop the column `deliveryId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - Added the required column `orderId` to the `deliveries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fistName` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_deliveries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "message" TEXT,
    "estimatedDelivery" DATETIME NOT NULL,
    "deliveredAt" DATETIME,
    "estimatedTime" INTEGER,
    "distance" REAL NOT NULL,
    "pickupAddress" TEXT,
    "dropAddress" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "driverId" TEXT,
    "orderId" TEXT NOT NULL,
    CONSTRAINT "deliveries_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "deliveries_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_deliveries" ("createdAt", "deliveredAt", "distance", "driverId", "dropAddress", "estimatedDelivery", "estimatedTime", "id", "message", "pickupAddress", "status", "type", "updatedAt") SELECT "createdAt", "deliveredAt", "distance", "driverId", "dropAddress", "estimatedDelivery", "estimatedTime", "id", "message", "pickupAddress", "status", "type", "updatedAt" FROM "deliveries";
DROP TABLE "deliveries";
ALTER TABLE "new_deliveries" RENAME TO "deliveries";
CREATE UNIQUE INDEX "deliveries_orderId_key" ON "deliveries"("orderId");
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT,
    "status" TEXT NOT NULL,
    "total" REAL NOT NULL,
    "deliveryFee" REAL NOT NULL,
    "driverTip" REAL,
    "restaurantTip" REAL,
    "projectTip" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "restaurantId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    CONSTRAINT "orders_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("createdAt", "customerId", "deliveryFee", "driverTip", "id", "message", "projectTip", "restaurantId", "restaurantTip", "status", "total") SELECT "createdAt", "customerId", "deliveryFee", "driverTip", "id", "message", "projectTip", "restaurantId", "restaurantTip", "status", "total" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "fistName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "driverId" TEXT
);
INSERT INTO "new_users" ("createdAt", "driverId", "email", "id", "password", "updatedAt") SELECT "createdAt", "driverId", "email", "id", "password", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
