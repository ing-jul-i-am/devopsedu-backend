-- DropIndex
DROP INDEX "configuracion_servicio_id_servicio_key";

-- AlterTable
ALTER TABLE "configuracion_servicio" ADD COLUMN     "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "configuracion_servicio_id_servicio_fecha_creacion_idx" ON "configuracion_servicio"("id_servicio", "fecha_creacion");
