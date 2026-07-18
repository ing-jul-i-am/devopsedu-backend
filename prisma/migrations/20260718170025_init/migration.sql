-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "permisos" TEXT[],

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "correo" VARCHAR(160) NOT NULL,
    "contrasena_cifrada" VARCHAR(255) NOT NULL,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_rol" INTEGER NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "sesion" (
    "id_sesion" SERIAL NOT NULL,
    "token" VARCHAR(512) NOT NULL,
    "fecha_inicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_expiracion" TIMESTAMP(3) NOT NULL,
    "estado" VARCHAR(20) NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "sesion_pkey" PRIMARY KEY ("id_sesion")
);

-- CreateTable
CREATE TABLE "servicio" (
    "id_servicio" SERIAL NOT NULL,
    "nombre" VARCHAR(120) NOT NULL,
    "descripcion" TEXT,
    "estado" VARCHAR(20) NOT NULL,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "servicio_pkey" PRIMARY KEY ("id_servicio")
);

-- CreateTable
CREATE TABLE "configuracion_servicio" (
    "id_configuracion" SERIAL NOT NULL,
    "imagen_docker" VARCHAR(255) NOT NULL,
    "cpu_asignado" DECIMAL(4,2) NOT NULL,
    "memoria_asignada" INTEGER NOT NULL,
    "almacenamiento_asignado" INTEGER NOT NULL,
    "puertos" JSONB NOT NULL,
    "variables_entorno" JSONB NOT NULL,
    "volumenes" JSONB NOT NULL,
    "id_servicio" INTEGER NOT NULL,

    CONSTRAINT "configuracion_servicio_pkey" PRIMARY KEY ("id_configuracion")
);

-- CreateTable
CREATE TABLE "registro_despliegue" (
    "id_registro" SERIAL NOT NULL,
    "fecha_hora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resultado" VARCHAR(20) NOT NULL,
    "mensaje_error" TEXT,
    "id_servicio" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "registro_despliegue_pkey" PRIMARY KEY ("id_registro")
);

-- CreateTable
CREATE TABLE "metrica" (
    "id_metrica" BIGSERIAL NOT NULL,
    "consumo_cpu" DECIMAL(5,2) NOT NULL,
    "consumo_memoria" INTEGER NOT NULL,
    "estado_ejecucion" VARCHAR(20) NOT NULL,
    "marca_tiempo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_servicio" INTEGER NOT NULL,

    CONSTRAINT "metrica_pkey" PRIMARY KEY ("id_metrica")
);

-- CreateTable
CREATE TABLE "ruta_aprendizaje" (
    "id_ruta" SERIAL NOT NULL,
    "progreso" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "ruta_aprendizaje_pkey" PRIMARY KEY ("id_ruta")
);

-- CreateTable
CREATE TABLE "modulo" (
    "id_modulo" SERIAL NOT NULL,
    "nombre" VARCHAR(160) NOT NULL,
    "contenido_teorico" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,

    CONSTRAINT "modulo_pkey" PRIMARY KEY ("id_modulo")
);

-- CreateTable
CREATE TABLE "ruta_modulo" (
    "id_ruta" INTEGER NOT NULL,
    "id_modulo" INTEGER NOT NULL,
    "orden_secuencia" INTEGER NOT NULL,

    CONSTRAINT "ruta_modulo_pkey" PRIMARY KEY ("id_ruta","id_modulo")
);

-- CreateTable
CREATE TABLE "actividad" (
    "id_actividad" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "criterios_validacion" JSONB NOT NULL,
    "orden" INTEGER NOT NULL,
    "id_modulo" INTEGER NOT NULL,

    CONSTRAINT "actividad_pkey" PRIMARY KEY ("id_actividad")
);

-- CreateTable
CREATE TABLE "evaluacion" (
    "id_evaluacion" SERIAL NOT NULL,
    "titulo" VARCHAR(200) NOT NULL,
    "preguntas" JSONB NOT NULL,
    "fecha_disponible" TIMESTAMP(3) NOT NULL,
    "id_modulo" INTEGER NOT NULL,

    CONSTRAINT "evaluacion_pkey" PRIMARY KEY ("id_evaluacion")
);

-- CreateTable
CREATE TABLE "resultado" (
    "id_resultado" SERIAL NOT NULL,
    "puntuacion" DECIMAL(5,2) NOT NULL,
    "tiempo_empleado" INTEGER NOT NULL,
    "intentos" INTEGER NOT NULL DEFAULT 1,
    "fecha_finalizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,
    "id_evaluacion" INTEGER,
    "id_actividad" INTEGER,

    CONSTRAINT "resultado_pkey" PRIMARY KEY ("id_resultado")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE INDEX "usuario_correo_idx" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "sesion_token_key" ON "sesion"("token");

-- CreateIndex
CREATE INDEX "sesion_token_idx" ON "sesion"("token");

-- CreateIndex
CREATE INDEX "sesion_id_usuario_estado_idx" ON "sesion"("id_usuario", "estado");

-- CreateIndex
CREATE INDEX "servicio_estado_idx" ON "servicio"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "servicio_id_usuario_nombre_key" ON "servicio"("id_usuario", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "configuracion_servicio_id_servicio_key" ON "configuracion_servicio"("id_servicio");

-- CreateIndex
CREATE INDEX "registro_despliegue_id_servicio_fecha_hora_idx" ON "registro_despliegue"("id_servicio", "fecha_hora");

-- CreateIndex
CREATE INDEX "metrica_id_servicio_marca_tiempo_idx" ON "metrica"("id_servicio", "marca_tiempo");

-- CreateIndex
CREATE UNIQUE INDEX "evaluacion_id_modulo_key" ON "evaluacion"("id_modulo");

-- CreateIndex
CREATE INDEX "resultado_id_usuario_fecha_finalizacion_idx" ON "resultado"("id_usuario", "fecha_finalizacion");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_rol_fkey" FOREIGN KEY ("id_rol") REFERENCES "rol"("id_rol") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sesion" ADD CONSTRAINT "sesion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicio" ADD CONSTRAINT "servicio_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuracion_servicio" ADD CONSTRAINT "configuracion_servicio_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicio"("id_servicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_despliegue" ADD CONSTRAINT "registro_despliegue_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicio"("id_servicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registro_despliegue" ADD CONSTRAINT "registro_despliegue_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metrica" ADD CONSTRAINT "metrica_id_servicio_fkey" FOREIGN KEY ("id_servicio") REFERENCES "servicio"("id_servicio") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruta_aprendizaje" ADD CONSTRAINT "ruta_aprendizaje_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruta_modulo" ADD CONSTRAINT "ruta_modulo_id_ruta_fkey" FOREIGN KEY ("id_ruta") REFERENCES "ruta_aprendizaje"("id_ruta") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ruta_modulo" ADD CONSTRAINT "ruta_modulo_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo"("id_modulo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "actividad" ADD CONSTRAINT "actividad_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo"("id_modulo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluacion" ADD CONSTRAINT "evaluacion_id_modulo_fkey" FOREIGN KEY ("id_modulo") REFERENCES "modulo"("id_modulo") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id_usuario") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_id_evaluacion_fkey" FOREIGN KEY ("id_evaluacion") REFERENCES "evaluacion"("id_evaluacion") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resultado" ADD CONSTRAINT "resultado_id_actividad_fkey" FOREIGN KEY ("id_actividad") REFERENCES "actividad"("id_actividad") ON DELETE SET NULL ON UPDATE CASCADE;
