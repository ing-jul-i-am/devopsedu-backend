-- Libera el nombre de los servicios eliminados (RF-05, RF-14, DT-16).
-- El unico sobre (id_usuario, nombre) reservaba el nombre para siempre, incluso despues de la
-- eliminacion logica. Se sustituye por un unico sobre (id_usuario, nombre_activo): esa columna
-- vale el nombre mientras el servicio esta vivo y pasa a NULL al eliminarlo, y PostgreSQL trata
-- los NULL como distintos entre si dentro de un indice unico.

-- DropIndex
DROP INDEX "servicio_id_usuario_nombre_key";

-- AlterTable
ALTER TABLE "servicio" ADD COLUMN     "nombre_activo" VARCHAR(120);

-- Backfill: los servicios existentes que no estan eliminados conservan su nombre reservado.
UPDATE "servicio" SET "nombre_activo" = "nombre" WHERE "estado" <> 'eliminado';

-- CreateIndex
CREATE UNIQUE INDEX "servicio_id_usuario_nombre_activo_key" ON "servicio"("id_usuario", "nombre_activo");
