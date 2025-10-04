/*
  Warnings:

  - The `status` column on the `tickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `prioridade` column on the `tickets` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ABERTO', 'EM_ATENDIMENTO', 'FECHADO');

-- CreateEnum
CREATE TYPE "Prioridade" AS ENUM ('BAIXA', 'MEDIA', 'ALTA', 'CRITICA');

-- AlterTable
ALTER TABLE "tickets" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ABERTO',
DROP COLUMN "prioridade",
ADD COLUMN     "prioridade" "Prioridade" NOT NULL DEFAULT 'MEDIA';
