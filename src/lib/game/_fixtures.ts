// Fixtures puros para los tests del engine (forma de la semilla del mock).
import type { DayLog, Player } from "@/lib/schemas";

export const emptyMisiones = (): DayLog["misiones"] => ({
  entrenar: { hecho: false, doble: false },
  chela: { tipo: "sin", ok: false },
  comida: { ok: false },
  agua: { ok: false },
  lectura: { ok: false, paginas: 0 },
  foto: { ok: false },
});

/** Las 5 obligatorias en verde; foto e doble configurables. */
export const obligatoriasOk = (): DayLog["misiones"] => {
  const m = emptyMisiones();
  m.entrenar.hecho = true;
  m.chela.ok = true;
  m.comida.ok = true;
  m.agua.ok = true;
  m.lectura.ok = true;
  m.lectura.paginas = 10;
  return m;
};

export const makeDayLog = (misiones: DayLog["misiones"]): DayLog => ({
  misiones,
  cerrado: false,
  perfecto: false,
  xpGanado: 0,
  ts: 0,
});

export const makePlayer = (over: Partial<Player> = {}): Player => ({
  nombre: "Test",
  nivel: 1,
  xp: 0,
  stats: { fuerza: 0, templanza: 0, vitalidad: 0, mente: 0, constancia: 0, vinculo: 0 },
  rachaReto: 0,
  avatar: { pelo: "corto", outfit: "tee", accesorio: "none" },
  ...over,
});
