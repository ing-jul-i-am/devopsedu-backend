-- Reemplaza el contenido de texto plano del modulo por contenido estructurado en bloques
-- (texto/imagen/enlace), almacenado como un arreglo Json (RF-20, CU-10, ver DT-09).
-- El contenido existente se migra a un unico bloque de tipo "texto" para no perder datos.

ALTER TABLE "modulo" ADD COLUMN "contenido" JSONB;

UPDATE "modulo"
SET "contenido" = jsonb_build_array(
  jsonb_build_object('tipo', 'texto', 'contenido', "contenido_teorico")
);

ALTER TABLE "modulo" ALTER COLUMN "contenido" SET NOT NULL;

ALTER TABLE "modulo" DROP COLUMN "contenido_teorico";
