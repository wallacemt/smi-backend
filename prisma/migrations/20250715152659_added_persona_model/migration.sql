-- CreateTable
CREATE TABLE "Personas" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "short_description" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "idade" TEXT NOT NULL,
    "profissao" TEXT NOT NULL,
    "interesses" TEXT NOT NULL,
    "objetivos" TEXT NOT NULL,
    "desafios" TEXT NOT NULL,
    "como_ajuda" TEXT NOT NULL,
    "comportamento_digital" TEXT NOT NULL,
    "poder_aquisitivo" TEXT NOT NULL,
    "localizacao" TEXT NOT NULL,
    "nivel_educacional" TEXT NOT NULL,
    "estado_civil" TEXT NOT NULL,
    "numero_de_filhos" TEXT NOT NULL,
    "preferencias_de_marca" TEXT NOT NULL,
    "frequencia_de_viagem" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Personas_pkey" PRIMARY KEY ("id")
);
