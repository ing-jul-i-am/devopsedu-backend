// tests/ayudas/crear-usuario-con-rol.ts
// Crea un usuario en la base de pruebas con un rol especifico y contrasena conocida, para
// autenticarlo via POST /api/auth/login en pruebas de integracion. A diferencia del
// auto-registro (que siempre asigna el rol por defecto, ver DT-03), esta ayuda permite probar
// endpoints restringidos a otros roles (por ejemplo, docente).

import { Cifrador } from "@/infraestructura/cifrador.js";
import { prismaTest } from "./prisma-test.js";
import { crearRolEnBd } from "../fixtures/rol.factory.js";

export interface CredencialesDePrueba {
  nombre: string;
  correo: string;
  contrasena: string;
}

export async function crearUsuarioConRol(
  datos: CredencialesDePrueba,
  nombreRol: string
): Promise<void> {
  const rol = await crearRolEnBd({ nombre: nombreRol });
  const contrasenaCifrada = await new Cifrador().cifrar(datos.contrasena);
  await prismaTest.usuario.create({
    data: {
      nombre: datos.nombre,
      correo: datos.correo,
      contrasenaCifrada,
      idRol: rol.idRol,
    },
  });
}
