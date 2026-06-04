-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('TECHNOLOGY', 'BUSINESS', 'MUSIC', 'SPORTS', 'EDUCATION');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "category" "EventCategory" NOT NULL DEFAULT 'TECHNOLOGY';
