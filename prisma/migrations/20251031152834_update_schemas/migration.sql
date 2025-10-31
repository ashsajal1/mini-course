-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('SLIDE', 'QUESTION');

-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "type" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "title" TEXT;

-- AlterTable
ALTER TABLE "Slide" ADD COLUMN     "title" TEXT;
