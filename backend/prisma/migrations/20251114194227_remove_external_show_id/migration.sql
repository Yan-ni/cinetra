/*
  Warnings:

  - You are about to drop the column `showId` on the `Movie` table. All the data in the column will be lost.
  - You are about to drop the column `showId` on the `Show` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Movie" DROP COLUMN "showId";

-- AlterTable
ALTER TABLE "Show" DROP COLUMN "showId";
