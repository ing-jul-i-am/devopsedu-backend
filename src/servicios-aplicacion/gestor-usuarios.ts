// src/servicios-aplicacion/gestor-usuarios.ts
// Servicio de aplicacion para operaciones administrativas sobre usuarios, ejecutadas por el
// rol docente: reseteo manual de contrasena y listado de estudiantes.
// Cubre: RF-04, RF-25 — CU-15

import type { UsuarioRepo } from "../repositorios/usuario-repo.js";
import type { Cifrador } from "../infraestructura/cifrador.js";
import type { GestorReportes } from "./gestor-reportes.js";
import { resumirRuta, type ResumenRuta } from "../dominio/reporte-progreso.js";
import { UsuarioNoEncontradoError } from "../dominio/errores/usuario-no-encontrado-error.js";

export interface DependenciasGestorUsuarios {
  usuarioRepo: UsuarioRepo;
  cifrador: Cifrador;
  gestorReportes: Pick<GestorReportes, "generarProgreso">;
}

export interface EstudianteListado {
  idUsuario: number;
  nombre: string;
  correo: string;
  fechaRegistro: Date;
  ruta: ResumenRuta | null;
}

export class GestorUsuarios {
  constructor(private readonly dep: DependenciasGestorUsuarios) {}

  async resetearContrasena(
    idUsuario: number,
    contrasenaNueva: string
  ): Promise<void> {
    const usuario = await this.dep.usuarioRepo.buscarPorId(idUsuario);
    if (!usuario) {
      throw new UsuarioNoEncontradoError();
    }

    const contrasenaCifrada = await this.dep.cifrador.cifrar(contrasenaNueva);
    await this.dep.usuarioRepo.actualizarContrasena(idUsuario, contrasenaCifrada);
  }

  // RF-25: el resumen de ruta sale del mismo calculo del reporte de progreso y no de la columna
  // ruta_aprendizaje.progreso, que puede estar desfasada (DT-20, DT-21).
  async listarEstudiantes(): Promise<EstudianteListado[]> {
    const reportes = await this.dep.gestorReportes.generarProgreso({});
    return reportes.map((reporte) => ({
      idUsuario: reporte.idUsuario,
      nombre: reporte.nombre,
      correo: reporte.correo,
      fechaRegistro: reporte.fechaRegistro,
      ruta: resumirRuta(reporte.ruta),
    }));
  }
}
