// src/infraestructura/cifrador.ts
// Envoltorio sobre bcrypt para cifrar y verificar contrasenas. Aisla la dependencia de
// terceros para poder mockearla en las capas superiores (principio del skill ciclo-tdd).
// Cubre: RNF-10

import bcrypt from "bcrypt";

// RNF-10: coste minimo de 12 rondas para el cifrado de contrasenas.
const RONDAS = 12;

export class Cifrador {
  async cifrar(clavePlana: string): Promise<string> {
    return bcrypt.hash(clavePlana, RONDAS);
  }

  async verificar(clavePlana: string, hash: string): Promise<boolean> {
    return bcrypt.compare(clavePlana, hash);
  }
}
