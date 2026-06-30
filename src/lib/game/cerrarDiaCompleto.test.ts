import { describe, it, expect } from "vitest";
import { cerrarDiaCompleto, type EntradaCierre } from "@/lib/game/cerrarDiaCompleto";
import { obligatoriasOk, makeDayLog, makePlayer } from "@/lib/game/_fixtures";
import type { Pacto } from "@/lib/schemas";
import type { ContextoLogros } from "@/lib/game/achievements";

const makePacto = (over: Partial<Pacto> = {}): Pacto => ({
  retoInicio: 1000,
  retoDiaActual: 40,
  retoEstado: "activo",
  intentoActual: 2,
  vinculoXp: 640,
  vinculoNivel: 4,
  jugadores: ["gio", "jenni"],
  ...over,
});

const ctxLogrosBase = (over: Partial<ContextoLogros> = {}): ContextoLogros => ({
  diaReto: 40,
  rachaReto: 40,
  microRachaAgua: 29,
  paginasTotales: 480,
  primerFindeChelaHecho: true,
  sincroniaCount: 8,
  retoCompletado: false,
  yaDesbloqueados: ["primer_paso", "primera_semana", "mitad", "ritual"],
  ...over,
});

const entradaBase = (over: Partial<EntradaCierre> = {}): EntradaCierre => ({
  player: makePlayer({ xp: 2200, nivel: 7, rachaReto: 40 }),
  log: makeDayLog(obligatoriasOk()),
  pacto: makePacto(),
  microRachas: { agua: { dias: 29, escudos: 2 } },
  contextoLogros: ctxLogrosBase(),
  yaOutfits: ["tee", "corto", "none"],
  ts: 5000,
  ...over,
});

describe("cerrarDiaCompleto", () => {
  it("día cumplido por ambos: sin reinicio, sube XP, avanza micro-racha de agua y desbloquea 'hidratado'", () => {
    const out = cerrarDiaCompleto(entradaBase(), true);
    expect(out.reinicio.hay).toBe(false);
    expect(out.player.xp).toBe(2300); // 2200 + 100 del día cumplido
    expect(out.subioNivel).toBe(true); // 2200 (nivel 7) → 2300 (nivel 8)
    expect(out.nivelDespues).toBe(8);
    expect(out.microRachas.agua.dias).toBe(30); // 29 → 30
    expect(out.logrosNuevos).toContain("hidratado"); // microRachaAgua >= 30
    expect(out.player.rachaReto).toBe(41); // racha del reto +1
  });

  it("día perfecto (con foto): marca perfecto y suma el bonus de Vínculo", () => {
    const m = obligatoriasOk();
    m.foto.ok = true;
    const out = cerrarDiaCompleto(entradaBase({ log: makeDayLog(m) }), true);
    expect(out.perfecto).toBe(true);
    expect(out.xpGanado).toBe(150); // 100 + foto 20 + perfecto 30
  });

  it("el compañero falló → reinicio solidario, conservando el personaje", () => {
    const out = cerrarDiaCompleto(entradaBase(), false);
    expect(out.reinicio.hay).toBe(true);
    expect(out.reinicio.quienFallo).toEqual(["jenni"]);
    expect(out.reinicio.pactoNuevo?.retoDiaActual).toBe(1);
    expect(out.reinicio.pactoNuevo?.intentoActual).toBe(3);
    expect(out.reinicio.intentoCerrado?.numero).toBe(2);
    // El personaje se conserva: sigue con su XP/stats ganados, racha del reto a 0.
    expect(out.player.xp).toBe(2300);
    expect(out.player.rachaReto).toBe(0);
  });

  it("yo fallo una obligatoria → también reinicia (solidario)", () => {
    const m = obligatoriasOk();
    m.agua.ok = false;
    const out = cerrarDiaCompleto(entradaBase({ log: makeDayLog(m) }), true);
    expect(out.reinicio.hay).toBe(true);
    expect(out.reinicio.quienFallo).toEqual(["gio"]);
  });
});
