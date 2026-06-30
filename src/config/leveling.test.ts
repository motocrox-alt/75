import { describe, it, expect } from "vitest";
import { xpParaNivel, nivelDesdeXp, nivelesGanados } from "@/config/leveling";

describe("leveling", () => {
  it("xpParaNivel sigue la curva round(100 * n^1.5)", () => {
    expect(xpParaNivel(1)).toBe(100);
    expect(xpParaNivel(2)).toBe(283);
    expect(xpParaNivel(3)).toBe(520);
  });

  it("nivelDesdeXp es correcto en los umbrales", () => {
    expect(nivelDesdeXp(0)).toBe(1);
    expect(nivelDesdeXp(99)).toBe(1);
    expect(nivelDesdeXp(282)).toBe(1); // justo por debajo del nivel 2
    expect(nivelDesdeXp(283)).toBe(2); // umbral exacto del nivel 2
    expect(nivelDesdeXp(520)).toBe(3);
  });

  it("nivelesGanados cuenta cuántos niveles cruzó el XP", () => {
    expect(nivelesGanados(0, 100)).toBe(0); // sigue nivel 1
    expect(nivelesGanados(0, 283)).toBe(1); // 1 → 2
    expect(nivelesGanados(0, 520)).toBe(2); // 1 → 3
    expect(nivelesGanados(283, 300)).toBe(0); // sin cruzar
  });
});
