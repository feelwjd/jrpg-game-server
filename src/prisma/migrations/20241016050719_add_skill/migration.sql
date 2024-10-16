-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "attack" INTEGER NOT NULL DEFAULT 5,
ADD COLUMN     "defense" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "speed" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "status" TEXT;

-- AlterTable
ALTER TABLE "Item" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "effect" TEXT NOT NULL,
    "power" INTEGER NOT NULL,
    "cooldown" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
