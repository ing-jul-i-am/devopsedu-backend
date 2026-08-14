// src/servicios-aplicacion/autenticador.ts
// Servicio de aplicacion para la gestion de identidad: registro, inicio y cierre de sesion.
// Orquesta repositorios (acceso a datos) y wrappers de seguridad (cifrado y tokens).
// Cubre: RF-01, RF-02, RF-03, RNF-10, RNF-12, RNF-14

import type { Usuario } from "@prisma/client";
import type { UsuarioRepo } from "../repositorios/usuario-repo.js";
import type { SesionRepo } from "../repositorios/sesion-repo.js";
import type { RolRepo } from "../repositorios/rol-repo.js";
import type { Cifrador } from "../infraestructura/cifrador.js";
import type { EmisorToken } from "../infraestructura/emisor-token.js";
import { CredencialesInvalidasError } from "../dominio/errores/credenciales-invalidas-error.js";
import { CorreoYaRegistradoError } from "../dominio/errores/correo-ya-registrado-error.js";
import { RolNoDisponibleError } from "../dominio/errores/rol-no-disponible-error.js";

// Vista publica del usuario: excluye la contrasena cifrada por lista explicita, de modo que
// una futura columna sensible del esquema no se filtre por accidente (RNF-12).
export type UsuarioPublico = Omit<Usuario, "contrasenaCifrada">;

// El auto-registro no acepta el rol desde el cliente: el servidor asigna siempre el rol por
// defecto (rolPorDefecto) para evitar escalamiento de privilegios (RNF-14).
export interface DatosRegistro {
  nombre: string;
  correo: string;
  contrasena: string;
}

export interface ResultadoInicioSesion {
  token: string;
  usuario: UsuarioPublico;
}

export interface DependenciasAutenticador {
  usuarioRepo: UsuarioRepo;
  sesionRepo: SesionRepo;
  rolRepo: RolRepo;
  cifrador: Cifrador;
  emisor: EmisorToken;
  rolPorDefecto: string;
  expiracionTokenSegundos: number;
}

export class Autenticador {
  constructor(private readonly dep: DependenciasAutenticador) {}

  async registrar(datos: DatosRegistro): Promise<UsuarioPublico> {
    const existente = await this.dep.usuarioRepo.buscarPorCorreo(datos.correo);
    if (existente) {
      throw new CorreoYaRegistradoError();
    }

    const rol = await this.dep.rolRepo.buscarPorNombre(this.dep.rolPorDefecto);
    if (!rol) {
      throw new RolNoDisponibleError(this.dep.rolPorDefecto);
    }

    const contrasenaCifrada = await this.dep.cifrador.cifrar(datos.contrasena);
    const usuario = await this.dep.usuarioRepo.crear({
      nombre: datos.nombre,
      correo: datos.correo,
      contrasenaCifrada,
      idRol: rol.idRol,
    });

    return this.aUsuarioPublico(usuario);
  }

  async iniciarSesion(
    correo: string,
    contrasena: string
  ): Promise<ResultadoInicioSesion> {
    const usuario = await this.dep.usuarioRepo.buscarPorCorreo(correo);
    if (!usuario) {
      throw new CredencialesInvalidasError();
    }

    const coincide = await this.dep.cifrador.verificar(
      contrasena,
      usuario.contrasenaCifrada
    );
    if (!coincide) {
      throw new CredencialesInvalidasError();
    }

    const token = this.dep.emisor.emitir({ idUsuario: usuario.idUsuario });
    const fechaExpiracion = new Date(
      Date.now() + this.dep.expiracionTokenSegundos * 1000
    );
    await this.dep.sesionRepo.crear({
      token,
      fechaExpiracion,
      idUsuario: usuario.idUsuario,
    });

    return { token, usuario: this.aUsuarioPublico(usuario) };
  }

  async cerrarSesion(token: string): Promise<void> {
    await this.dep.sesionRepo.revocarPorToken(token);
  }

  private aUsuarioPublico(usuario: Usuario): UsuarioPublico {
    return {
      idUsuario: usuario.idUsuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      fechaRegistro: usuario.fechaRegistro,
      idRol: usuario.idRol,
    };
  }
}
