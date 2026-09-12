// tests/integracion/repositorios/registro-despliegue-repo.test.ts
// Pruebas de integracion del repositorio de registros de despliegue (bitacora de operaciones).
// Cubre: RF-15, RF-17, RF-23

import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { RegistroDespliegueRepo } from "@/repositorios/registro-despliegue-repo.js";
import { prismaTest } from "../../ayudas/prisma-test.js";
import { limpiarBd } from "../../ayudas/limpiar-bd.js";
import { crearServicioEnBd } from "../../fixtures/servicio.factory.js";

describe("RegistroDespliegueRepo", () => {
  const repo = new RegistroDespliegueRepo(prismaTest);

  beforeEach(async () => {
    await limpiarBd();
  });

  afterAll(async () => {
    await prismaTest.$disconnect();
  });

  describe("registrar", () => {
    it("persiste una operacion con su tipo, resultado y usuario", async () => {
      // Arrange
      const servicio = await crearServicioEnBd();

      // Act
      const registro = await repo.registrar({
        idServicio: servicio.idServicio,
        idUsuario: servicio.idUsuario,
        operacion: "desplegar",
        resultado: "exito",
      });

      // Assert
      expect(registro.idRegistro).toBeTypeOf("number");
      expect(registro.operacion).toBe("desplegar");
      expect(registro.resultado).toBe("exito");
      expect(registro.mensajeError).toBeNull();
    });

    it("guarda el mensaje de error cuando la operacion falla", async () => {
      // Arrange
      const servicio = await crearServicioEnBd();

      // Act
      const registro = await repo.registrar({
        idServicio: servicio.idServicio,
        idUsuario: servicio.idUsuario,
        operacion: "desplegar",
        resultado: "fallo",
        mensajeError: "La imagen no esta disponible",
      });

      // Assert
      expect(registro.resultado).toBe("fallo");
      expect(registro.mensajeError).toBe("La imagen no esta disponible");
    });
  });

  describe("listarPorServicio", () => {
    it("devuelve los registros del servicio, del mas reciente al mas antiguo", async () => {
      // Arrange
      const servicio = await crearServicioEnBd();
      await repo.registrar({
        idServicio: servicio.idServicio,
        idUsuario: servicio.idUsuario,
        operacion: "desplegar",
        resultado: "exito",
      });
      await repo.registrar({
        idServicio: servicio.idServicio,
        idUsuario: servicio.idUsuario,
        operacion: "detener",
        resultado: "exito",
      });

      // Act
      const registros = await repo.listarPorServicio(servicio.idServicio);

      // Assert
      expect(registros).toHaveLength(2);
      expect(registros[0]?.operacion).toBe("detener");
      expect(registros[1]?.operacion).toBe("desplegar");
    });

    it("devuelve una lista vacia cuando el servicio no tiene registros", async () => {
      // Arrange
      const servicio = await crearServicioEnBd();

      // Act
      const registros = await repo.listarPorServicio(servicio.idServicio);

      // Assert
      expect(registros).toHaveLength(0);
    });
  });

  describe("contarPorServicioYOperacion", () => {
    it("cuenta exitos y fallos de esa operacion sobre ese servicio", async () => {
      // Arrange
      const servicio = await crearServicioEnBd();
      await repo.registrar({
        idServicio: servicio.idServicio,
        idUsuario: servicio.idUsuario,
        operacion: "desplegar",
        resultado: "fallo",
        mensajeError: "La imagen no esta disponible",
      });
      await repo.registrar({
        idServicio: servicio.idServicio,
        idUsuario: servicio.idUsuario,
        operacion: "desplegar",
        resultado: "exito",
      });
      await repo.registrar({
        idServicio: servicio.idServicio,
        idUsuario: servicio.idUsuario,
        operacion: "detener",
        resultado: "exito",
      });

      // Act
      const cantidad = await repo.contarPorServicioYOperacion(
        servicio.idServicio,
        "desplegar"
      );

      // Assert
      expect(cantidad).toBe(2);
    });

    it("no cuenta registros de otros servicios", async () => {
      // Arrange
      const servicioA = await crearServicioEnBd();
      const servicioB = await crearServicioEnBd();
      await repo.registrar({
        idServicio: servicioB.idServicio,
        idUsuario: servicioB.idUsuario,
        operacion: "desplegar",
        resultado: "exito",
      });

      // Act
      const cantidad = await repo.contarPorServicioYOperacion(
        servicioA.idServicio,
        "desplegar"
      );

      // Assert
      expect(cantidad).toBe(0);
    });
  });
});
