// src/api/tipos/usuario-autenticado.ts
// Datos del usuario autenticado que el middleware de autenticacion adjunta a la peticion.

export interface UsuarioAutenticado {
  idUsuario: number;
  idRol: number;
  rol: string;
}
