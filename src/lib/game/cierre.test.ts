import { describe, it, expect } from "vitest";
import { aplicarCierreDia } from "@/lib/game/cierre";
import { obligatoriasOk, makeDayLog, makePlayer } from "@/lib/game/_fixtures";

describe("aplicarCierreDia", () => {
  it("NO muta el player original (inmutabilidad)", () => {
    const player = makePlayer({ xp: 100, stats: { fuerza: 5, templanza: 5, vitalidad: 5, mente: 5, constancia: 5, vinculo: 5 } });
    const snapshot = structuredClone(player);
    aplicarCierreDia(player, makeDayLog(obligatoriasOk()), 1000);
    expect(player).toEqual(snapshot);
  });

  it("el nuevo player suma xp y stats correctamente", () => {
    const player = makePlayer({ xp: 100 });
    const r = aplicarCierreDia(player, makeDayLog(obligatoriasOk()), 1000);
    expect(r.player.xp).toBe(200); // 100 + 100 del día
    expect(r.player.stats.fuerza).toBe(20);
    expect(r.player.stats.templanza).toBe(45);
    expect(r.player.stats.vitalidad).toBe(15);
    expect(r.player.stats.mente).toBe(20);
    expect(r.xpGanado).toBe(100);
  });

  it("xpLogEntries suma exactamente el XP ganado y trae el ts", () => {
    const r = aplicarCierreDia(makePlayer({ xp: 0 }), makeDayLog(obligatoriasOk()), 4242);
    const suma = r.xpLogEntries.reduce((acc, e) => acc + e.cantidad, 0);
    expect(suma).toBe(r.xpGanado);
    expect(r.xpLogEntries.every((e) => e.ts === 4242)).toBe(true);
  });

  it("subioNivel = true cuando el XP cruza un umbral de nivel", () => {
    // 270 (nivel 1) + 100 = 370 → nivel 2
    const r = aplicarCierreDia(makePlayer({ xp: 270, nivel: 1 }), makeDayLog(obligatoriasOk()), 1);
    expect(r.nivelAntes).toBe(1);
    expect(r.nivelDespues).toBe(2);
    expect(r.subioNivel).toBe(true);
    expect(r.player.nivel).toBe(2);
  });

  it("subioNivel = false cuando no se cruza umbral", () => {
    const r = aplicarCierreDia(makePlayer({ xp: 0, nivel: 1 }), makeDayLog(obligatoriasOk()), 1);
    expect(r.subioNivel).toBe(false); // 100 sigue en nivel 1
    expect(r.player.nivel).toBe(1);
  });
});
