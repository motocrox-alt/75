// DayLog de HOY del jugador actual (mock). UI + lógica local simple — NO es el
// engine real de XP (eso es Fase B). Refleja el día con cálculos sencillos.
import { create } from "zustand";
import { mockAdapter } from "@/lib/firebase/mockAdapter";
import {
  MISIONES,
  esFinde,
  BONUS_ENTRENO_DOBLE,
  BONUS_DIA_PERFECTO,
  type Mision,
} from "@/config/rules";
import type { DayLog } from "@/lib/schemas";

export type MisionId = Mision["id"];

const OBLIGATORIAS: MisionId[] = MISIONES.filter((m) => m.requiereParaDia).map((m) => m.id);
const XP_DE = Object.fromEntries(MISIONES.map((m) => [m.id, m.xp])) as Record<MisionId, number>;

/** Log nuevo en blanco para hoy (chela según día de la semana). */
const nuevoLog = (finde: boolean): DayLog => ({
  misiones: {
    entrenar: { hecho: false, doble: false },
    chela: { tipo: finde ? "juntitos" : "sin", ok: false },
    comida: { ok: false },
    agua: { ok: false },
    lectura: { ok: false, paginas: 0 },
    foto: { ok: false },
  },
  cerrado: false,
  perfecto: false,
  xpGanado: 0,
  ts: Date.now(),
});

/** ¿La misión obligatoria/individual está en verde? La chela del finde exige a ambos. */
const esVerde = (log: DayLog, id: MisionId, parejaChelaOk: boolean): boolean => {
  const m = log.misiones;
  switch (id) {
    case "entrenar":
      return m.entrenar.hecho;
    case "chela":
      return m.chela.tipo === "juntitos" ? m.chela.ok && parejaChelaOk : m.chela.ok;
    case "comer":
      return m.comida.ok;
    case "agua":
      return m.agua.ok;
    case "leer":
      return m.lectura.ok;
    case "foto":
      return m.foto.ok;
  }
};

interface DayState {
  log: DayLog | null;
  /** Confirmación de la chela del compañero hoy (para el finde). */
  parejaChelaOk: boolean;
  _uid: string | null;
  _dayKey: string | null;
  cargar: (uid: string, dayKey: string) => Promise<void>;
  setParejaChelaOk: (b: boolean) => void;
  toggleMision: (id: MisionId) => void;
  setEntrenoDoble: (doble: boolean) => void;
  cumplida: (id: MisionId) => boolean;
  cerrado: () => boolean;
  perfecto: () => boolean;
  faltantes: () => number;
}

/** Recalcula cerrado/perfecto/xpGanado de forma local (no es el engine real). */
const recomputar = (log: DayLog, parejaChelaOk: boolean): DayLog => {
  const cerrado = OBLIGATORIAS.every((id) => esVerde(log, id, parejaChelaOk));
  const perfecto = cerrado && log.misiones.foto.ok;
  let xp = 0;
  for (const m of MISIONES) if (esVerde(log, m.id, parejaChelaOk)) xp += XP_DE[m.id];
  if (log.misiones.entrenar.hecho && log.misiones.entrenar.doble) xp += BONUS_ENTRENO_DOBLE;
  if (perfecto) xp += BONUS_DIA_PERFECTO;
  return { ...log, cerrado, perfecto, xpGanado: xp };
};

export const useDayStore = create<DayState>((set, get) => {
  const persistir = (log: DayLog) => {
    const { _uid, _dayKey, parejaChelaOk } = get();
    const actualizado = recomputar(log, parejaChelaOk);
    set({ log: actualizado });
    if (_uid && _dayKey) void mockAdapter.setDayLog(_uid, _dayKey, actualizado);
  };

  return {
    log: null,
    parejaChelaOk: false,
    _uid: null,
    _dayKey: null,

    cargar: async (uid, dayKey) => {
      const finde = esFinde(new Date());
      const existente = await mockAdapter.getDayLog(uid, dayKey);
      const base = existente ?? nuevoLog(finde);
      // Normaliza el tipo de chela al día de hoy.
      base.misiones.chela.tipo = finde ? "juntitos" : "sin";
      set({ log: recomputar(base, get().parejaChelaOk), _uid: uid, _dayKey: dayKey });
    },

    setParejaChelaOk: (b) => {
      set({ parejaChelaOk: b });
      const { log } = get();
      if (log) set({ log: recomputar(log, b) });
    },

    toggleMision: (id) => {
      const { log } = get();
      if (!log) return;
      const m = structuredClone(log.misiones);
      switch (id) {
        case "entrenar":
          m.entrenar.hecho = !m.entrenar.hecho;
          if (!m.entrenar.hecho) m.entrenar.doble = false;
          break;
        case "chela":
          m.chela.ok = !m.chela.ok;
          break;
        case "comer":
          m.comida.ok = !m.comida.ok;
          break;
        case "agua":
          m.agua.ok = !m.agua.ok;
          break;
        case "leer":
          m.lectura.ok = !m.lectura.ok;
          m.lectura.paginas = m.lectura.ok ? 10 : 0;
          break;
        case "foto":
          m.foto.ok = !m.foto.ok;
          break;
      }
      persistir({ ...log, misiones: m });
    },

    setEntrenoDoble: (doble) => {
      const { log } = get();
      if (!log || !log.misiones.entrenar.hecho) return;
      persistir({
        ...log,
        misiones: { ...log.misiones, entrenar: { ...log.misiones.entrenar, doble } },
      });
    },

    cumplida: (id) => {
      const { log, parejaChelaOk } = get();
      return log ? esVerde(log, id, parejaChelaOk) : false;
    },

    cerrado: () => {
      const { log, parejaChelaOk } = get();
      return log ? OBLIGATORIAS.every((id) => esVerde(log, id, parejaChelaOk)) : false;
    },

    perfecto: () => {
      const { log } = get();
      return !!log && get().cerrado() && log.misiones.foto.ok;
    },

    faltantes: () => {
      const { log, parejaChelaOk } = get();
      if (!log) return OBLIGATORIAS.length;
      return OBLIGATORIAS.filter((id) => !esVerde(log, id, parejaChelaOk)).length;
    },
  };
});
