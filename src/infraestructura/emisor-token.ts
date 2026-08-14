// src/infraestructura/emisor-token.ts
// Envoltorio sobre jsonwebtoken para emitir y verificar tokens JWT. Traduce los errores de
// la libreria a TokenInvalidoError para no filtrar detalles internos (RNF-12).
// Cubre: RF-02, RF-03, RNF-14

import jwt from "jsonwebtoken";
import { TokenInvalidoError } from "../dominio/errores/token-invalido-error.js";

export interface OpcionesEmisor {
  secreto: string;
  expiracionSegundos: number;
}

export interface DatosToken {
  idUsuario: number;
}

export interface PayloadToken extends DatosToken {
  iat?: number;
  exp?: number;
}

export class EmisorToken {
  private readonly secreto: string;
  private readonly expiracionSegundos: number;

  constructor(opciones: OpcionesEmisor) {
    this.secreto = opciones.secreto;
    this.expiracionSegundos = opciones.expiracionSegundos;
  }

  emitir(datos: DatosToken): string {
    return jwt.sign({ idUsuario: datos.idUsuario }, this.secreto, {
      expiresIn: this.expiracionSegundos,
    });
  }

  verificar(token: string): PayloadToken {
    try {
      const payload = jwt.verify(token, this.secreto);
      if (
        typeof payload === "string" ||
        typeof payload.idUsuario !== "number"
      ) {
        throw new TokenInvalidoError();
      }
      return payload as PayloadToken;
    } catch {
      throw new TokenInvalidoError();
    }
  }
}
