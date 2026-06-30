import { describe, it, expect } from "vitest";
import { chequearLogros, type ContextoLogros } from "@/lib/game/achievements";

const base = (over: Partial<ContextoLogros> = {}): ContextoLogros => ({
  diaReto: 0,
  rachaReto: 0,
  microRachaAgua: 0,
  paginasTotales: 0,
  primerFindeChelaHecho: false,
  sincroniaCount: 0,
  retoCompletado: false,
  yaDesbloqueados: [],
  ...over,
});

describe("chequearLogros", () => {
  it("cada condición dispara su logro", () => {
    expect(chequearLogros(base({ diaReto: 1 }))).toContain("primer_paso");
    expect(chequearLogros(base({ rachaReto: 7 }))).toContain("primera_semana");
    expect(chequearLogros(base({ diaReto: 38 }))).toContain("mitad");
    expect(chequearLogros(base({ microRachaAgua: 30 }))).toContain("hidratado");
    expect(chequearLogros(base({ paginasTotales: 750 }))).toContain("biblioteca");
    expect(chequearLogros(base({ primerFindeChelaHecho: true }))).toContain("ritual");
    expect(chequearLogros(base({ sincroniaCount: 10 }))).toContain("sincronia");
    expect(chequearLogros(base({ retoCompletado: true }))).toContain("inquebrantables");
  });

  it("no re-desbloquea los ya obtenidos", () => {
    const r = chequearLogros(base({ diaReto: 1, yaDesbloqueados: ["primer_paso"] }));
    expect(r).not.toContain("primer_paso");
  });

  it("puede desbloquear varios a la vez", () => {
    const r = chequearLogros(base({ diaReto: 38, rachaReto: 7 }));
    expect(r).toEqual(expect.arrayContaining(["primer_paso", "primera_semana", "mitad"]));
  });

  it("no dispara nada por debajo de los umbrales", () => {
    expect(chequearLogros(base({ rachaReto: 6, paginasTotales: 749 }))).toEqual([]);
  });
});
