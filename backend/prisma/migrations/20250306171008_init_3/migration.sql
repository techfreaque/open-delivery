/*
  Warnings:

  - The primary key for the `countries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `countries` table. All the data in the column will be lost.
  - The primary key for the `languages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `countryId` on the `languages` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `languages` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `restaurants` table. All the data in the column will be lost.
  - Added the required column `name` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "_CountryToLanguages" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_CountryToLanguages_A_fkey" FOREIGN KEY ("A") REFERENCES "countries" ("code") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_CountryToLanguages_B_fkey" FOREIGN KEY ("B") REFERENCES "languages" ("code") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Address" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "label" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "message" TEXT,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "countryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Address_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Address" ("city", "countryId", "id", "isDefault", "label", "phone", "street", "streetNumber", "userId", "zip") SELECT "city", "countryId", "id", "isDefault", "label", "phone", "street", "streetNumber", "userId", "zip" FROM "Address";
DROP TABLE "Address";
ALTER TABLE "new_Address" RENAME TO "Address";
CREATE TABLE "new_countries" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_countries" ("code", "createdAt", "name", "updatedAt") SELECT "code", "createdAt", "name", "updatedAt" FROM "countries";
DROP TABLE "countries";
ALTER TABLE "new_countries" RENAME TO "countries";
CREATE TABLE "new_drivers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "vehicle" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "radius" REAL NOT NULL,
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
CREATE TABLE "new_languages" (
    "code" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_languages" ("code", "createdAt", "name", "updatedAt") SELECT "code", "createdAt", "name", "updatedAt" FROM "languages";
DROP TABLE "languages";
ALTER TABLE "new_languages" RENAME TO "languages";
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
    "addressId" TEXT NOT NULL,
    CONSTRAINT "orders_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "restaurants" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "orders_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_orders" ("createdAt", "customerId", "deliveryFee", "driverTip", "id", "message", "projectTip", "restaurantId", "restaurantTip", "status", "total") SELECT "createdAt", "customerId", "deliveryFee", "driverTip", "id", "message", "projectTip", "restaurantId", "restaurantTip", "status", "total" FROM "orders";
DROP TABLE "orders";
ALTER TABLE "new_orders" RENAME TO "orders";
CREATE TABLE "new_restaurants" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "streetNumber" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "countryId" TEXT NOT NULL,
    "mainCategoryId" TEXT NOT NULL,
    CONSTRAINT "restaurants_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("code") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "restaurants_mainCategoryId_fkey" FOREIGN KEY ("mainCategoryId") REFERENCES "categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_restaurants" ("city", "countryId", "createdAt", "description", "email", "id", "image", "mainCategoryId", "name", "phone", "street", "streetNumber", "updatedAt", "zip") SELECT "city", "countryId", "createdAt", "description", "email", "id", "image", "mainCategoryId", "name", "phone", "street", "streetNumber", "updatedAt", "zip" FROM "restaurants";
DROP TABLE "restaurants";
ALTER TABLE "new_restaurants" RENAME TO "restaurants";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_CountryToLanguages_AB_unique" ON "_CountryToLanguages"("A", "B");

-- CreateIndex
CREATE INDEX "_CountryToLanguages_B_index" ON "_CountryToLanguages"("B");
