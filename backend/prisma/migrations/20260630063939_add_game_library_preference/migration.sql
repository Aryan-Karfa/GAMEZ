-- CreateEnum
CREATE TYPE "LibraryStatus" AS ENUM ('TO_PLAY', 'PLAYING', 'COMPLETED', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('DARK');

-- CreateEnum
CREATE TYPE "DefaultView" AS ENUM ('CARD', 'LIST', 'SHELF');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "rawgId" INTEGER NOT NULL,
    "slug" TEXT,
    "title" TEXT NOT NULL,
    "coverImage" TEXT,
    "description" TEXT,
    "platforms" JSONB NOT NULL,
    "rating" DOUBLE PRECISION,
    "releaseDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LibraryEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "status" "LibraryStatus" NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "playTimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "lastProgressUpdate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LibraryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" "Theme" NOT NULL DEFAULT 'DARK',
    "defaultView" "DefaultView" NOT NULL DEFAULT 'CARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_rawgId_key" ON "Game"("rawgId");

-- CreateIndex
CREATE INDEX "LibraryEntry_userId_status_idx" ON "LibraryEntry"("userId", "status");

-- CreateIndex
CREATE INDEX "LibraryEntry_gameId_idx" ON "LibraryEntry"("gameId");

-- CreateIndex
CREATE INDEX "LibraryEntry_updatedAt_idx" ON "LibraryEntry"("updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "LibraryEntry_userId_gameId_key" ON "LibraryEntry"("userId", "gameId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- AddForeignKey
ALTER TABLE "LibraryEntry" ADD CONSTRAINT "LibraryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LibraryEntry" ADD CONSTRAINT "LibraryEntry_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
