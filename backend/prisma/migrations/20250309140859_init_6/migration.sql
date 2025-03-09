/*
  Warnings:

  - You are about to drop the column `deliveredAt` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `dropAddress` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedDelivery` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedTime` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `pickupAddress` on the `deliveries` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `orders` table. All the data in the column will be lost.
  - Added the required column `countryId` to the `deliveries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `estimatedPreparationTime` to the `deliveries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tax` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    "driverId" TEXT,
    "restaurantId" TEXT,
    "restaurantRatingId" TEXT,
    "driverRatingId" TEXT,
    "menuItemId" TEXT,
    "orderId" TEXT,
    "deliveryId" TEXT,
    "earningId" TEXT,
    CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_restaurantRatingId_fkey" FOREIGN KEY ("restaurantRatingId") REFERENCES "ratings" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_driverRatingId_fkey" FOREIGN KEY ("driverRatingId") REFERENCES "user_ratings" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "menu_items" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_deliveryId_fkey" FOREIGN KEY ("deliveryId") REFERENCES "deliveries" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "messages_earningId_fkey" FOREIGN KEY ("earningId") REFERENCES "earnings" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_deliveries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ASSIGNED',
    "message" TEXT,
    "estimatedDeliveryTime" INTEGER,
    "estimatedPreparationTime" INTEGER NOT NULL,
    "distance" REAL NOT NULL,
    "street" TEXT,
    "streetNumber" TEXT,
    "zip" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "latitude" REAL,
    "longitude" REAL,
    "countryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "driverId" TEXT,
    "orderId" TEXT NOT NULL,
    CONSTRAINT "deliveries_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "deliveries_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "drivers" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "deliveries_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_deliveries" ("createdAt", "distance", "driverId", "id", "message", "orderId", "status", "type", "updatedAt") SELECT "createdAt", "distance", "driverId", "id", "message", "orderId", "status", "type", "updatedAt" FROM "deliveries";
DROP TABLE "deliveries";
ALTER TABLE "new_deliveries" RENAME TO "deliveries";
CREATE UNIQUE INDEX "deliveries_orderId_key" ON "deliveries"("orderId");
CREATE TABLE "new_orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT,
    "status" TEXT NOT NULL,
    "tax" REAL NOT NULL,
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
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
