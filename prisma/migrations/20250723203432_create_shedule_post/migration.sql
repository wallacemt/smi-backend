-- CreateTable
CREATE TABLE "ShedulePost" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShedulePost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShedulePost_postId_key" ON "ShedulePost"("postId");

-- AddForeignKey
ALTER TABLE "ShedulePost" ADD CONSTRAINT "ShedulePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "PostsByPersonas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
