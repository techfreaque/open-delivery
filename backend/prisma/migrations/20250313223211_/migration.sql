/*
  Warnings:

  - Added the required column `icon` to the `restaurant_site_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `key` to the `restaurant_site_content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `restaurant_site_content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "restaurant_site_content" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "icon" TEXT NOT NULL,
ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
