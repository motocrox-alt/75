import { describe, it, expect } from "vitest";
import { actualizarMicroRacha, actualizarRachaReto } from "@/lib/game/streaks";
import { ESCUDO_CADA, ESCUDOS_MAX } from "@/config/streaks";

describe("actualizarMicroRacha (con escudos)", () => {
  it("sube los días al cumplir", () => {
    expect(actualizarMicroRacha({ dias: 3, escudos: 0 }, true)).toEqual({ dias: 4, escudos: 0 });
  });

  it("otorga 1 escudo al cruzar ESCUDO_CADA", () => {
    const r = actualizarMicroRacha({ dias: ESCUDO_CADA - 1, escudos: 0 }, true);
    expect(r.dias).toBe(ESCUDO_CADA);
    expect(r.escudos).toBe(1);
  });

  it("respeta el tope ESCUDOS_MAX", () => {
    // a 2*ESCUDO_CADA ya tendría 2 escudos; un tercer múltiplo no suma más
    const r = actualizarMicroRacha({ dias: 3 * ESCUDO_CADA - 1, escudos: ESCUDOS_MAX }, true);
    expect(r.escudos).toBe(ESCUDOS_MAX);
  });

  it("un día perdido CON escudo conserva los días y consume 1 escudo", () => {
    expect(actualizarMicroRacha({ dias: 20, escudos: 1 }, false)).toEqual({ dias: 20, escudos: 0 });
  });

  it("un día perdido SIN escudo reinicia la micro-racha", () => {
    expect(actualizarMicroRacha({ dias: 20, escudos: 0 }, false)).toEqual({ dias: 0, escudos: 0 });
  });
});

describe("actualizarRachaReto (sin escudo)", () => {
  it("sube al cumplir el día", () => {
    expect(actualizarRachaReto(39, true)).toBe(40);
  });
  it("vuelve a 0 si no se cumple", () => {
    expect(actualizarRachaReto(39, false)).toBe(0);
  });
});
