import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const rolEstudiante = await prisma.rol.upsert({
    where: { nombre: "estudiante" },
    update: {},
    create: {
      nombre: "estudiante",
      permisos: [
        "servicio.crear",
        "servicio.desplegar",
        "servicio.controlar",
        "servicio.eliminar.propio",
        "monitoreo.ver",
        "aprendizaje.realizar",
      ],
    },
  });

  const rolDocente = await prisma.rol.upsert({
    where: { nombre: "docente" },
    update: {},
    create: {
      nombre: "docente",
      permisos: [
        "modulo.gestionar",
        "ruta.asignar",
        "reporte.consultar",
        "exportacion.realizar",
        "servicio.ver.todos",
      ],
    },
  });

  const passwordPlano = process.env.ADMIN_PASSWORD_INICIAL ?? "cambiar_en_primer_ingreso";
  const passwordHash = await bcrypt.hash(passwordPlano, 12);

  await prisma.usuario.upsert({
    where: { correo: "admin@devopsedu.local" },
    update: {},
    create: {
      nombre: "Administrador docente",
      correo: "admin@devopsedu.local",
      contrasenaCifrada: passwordHash,
      idRol: rolDocente.idRol,
    },
  });

  console.log("Seed completado. Roles y administrador inicial cargados.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
