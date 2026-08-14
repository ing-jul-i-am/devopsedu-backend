/*
  Warnings:

  - Added the required column `operacion` to the `registro_despliegue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "registro_despliegue" ADD COLUMN     "operacion" VARCHAR(20) NOT NULL;
