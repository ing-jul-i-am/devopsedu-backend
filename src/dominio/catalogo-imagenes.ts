// src/dominio/catalogo-imagenes.ts
// Catalogo curado de imagenes Docker pre-verificadas que se sugieren al estudiante. El usuario
// puede elegir una de estas o ingresar manualmente otra imagen valida (RF-07). Se mantiene como
// lista curada (sin tabla) porque el modelo de datos del diseno no contempla una entidad de
// catalogo (ver DT-04 sobre desvios respecto al ER).
// Cubre: RF-07

export interface ImagenSugerida {
  nombre: string;
  descripcion: string;
}

export const CATALOGO_IMAGENES: readonly ImagenSugerida[] = [
  { nombre: "postgres:16-alpine", descripcion: "Base de datos PostgreSQL 16" },
  { nombre: "mysql:8", descripcion: "Base de datos MySQL 8" },
  { nombre: "mongo:7", descripcion: "Base de datos MongoDB 7" },
  { nombre: "redis:7-alpine", descripcion: "Almacen en memoria Redis 7" },
  { nombre: "nginx:1.27-alpine", descripcion: "Servidor web Nginx" },
  { nombre: "httpd:2.4-alpine", descripcion: "Servidor web Apache HTTP" },
  { nombre: "node:20-alpine", descripcion: "Entorno de ejecucion Node.js 20" },
];
