-- CreateTable
CREATE TABLE "PostsByPersonas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "personaId" TEXT NOT NULL,
    "hashtags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostsByPersonas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PostsByPersonas" ADD CONSTRAINT "PostsByPersonas_personaId_fkey" FOREIGN KEY ("personaId") REFERENCES "Personas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
