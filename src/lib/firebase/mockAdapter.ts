// Adapter en memoria (mock-first). Mismos métodos que tendrá el gemelo Firebase.
// Datos semilla a MITAD del reto (día ~40) para que las vistas se vean vivas.
// USE_MOCK por default true; el estado vive en memoria (sin localStorage).
// Append-only: xpLog/achievements/wardrobe/intentos se appendean; los caches
// (players/pacto) se actualizan.
import {
  PactoSchema,
  PlayerSchema,
  type Pacto,
  type Player,
  type DayLog,
  type XpLogEntry,
  type DiaEstado,
  type MisionId,
  type Intento,
} from "@/lib/schemas";
import { WARDROBE } from "@/config/wardrobe";
import { RETO_DIAS } from "@/config/rules";
import { hoyKey } from "@/lib/utils/date";
import { evaluarDia } from "@/lib/game/evaluarDia";
import type { MicroRacha } from "@/lib/game/streaks";

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const DIA_RETO = 40;

// ── Pacto (a mitad del reto, segundo intento). Mutable: updatePacto lo cambia.
let pactoActual: Pacto = PactoSchema.parse({
  retoInicio: Date.parse("2026-05-21T00:00:00") || 0,
  retoDiaActual: DIA_RETO,
  retoEstado: "activo",
  intentoActual: 2,
  vinculoXp: 640,
  vinculoNivel: 4,
  jugadores: ["gio", "jenni"],
});

// ── Players ───────────────────────────────────────────────
const seedGio: Player = PlayerSchema.parse({
  nombre: "Gio",
  nivel: 7,
  xp: 2200, // nivel 7 (1852..2263), cerca del umbral → level-up demoable al cerrar
  stats: { fuerza: 58, templanza: 44, vitalidad: 40, mente: 36, constancia: 22, vinculo: 64 },
  rachaReto: DIA_RETO,
  ultimoDiaCerrado: hoyKey(new Date(Date.now() - 86_400_000)),
  avatar: { piel: undefined, pelo: "corto", outfit: "chaleco", accesorio: "lentes_sol" },
});

const seedJenni: Player = PlayerSchema.parse({
  nombre: "Jenni",
  nivel: 6,
  xp: 1800, // nivel 6 (1470..1852), cerca del umbral
  stats: { fuerza: 40, templanza: 50, vitalidad: 46, mente: 48, constancia: 30, vinculo: 64 },
  rachaReto: DIA_RETO,
  ultimoDiaCerrado: hoyKey(new Date(Date.now() - 86_400_000)),
  avatar: { piel: undefined, pelo: "largo", outfit: "topblanco", accesorio: "lentes_sol" },
});

const players: Record<string, Player> = { gio: seedGio, jenni: seedJenni };

// ── Wardrobe: ids desbloqueados (permanentes; no se pierden en reinicio). ──
const baselineWardrobe = (): string[] =>
  WARDROBE.filter((p) => p.unlockDay <= DIA_RETO).map((p) => p.id);

const wardrobeIds: Record<string, string[]> = {
  gio: baselineWardrobe(),
  jenni: baselineWardrobe(),
};

// ── Micro-rachas de hábito (con escudos). Agua en 29 → cerrar hoy llega a 30
//    y desbloquea "Hidratado de acero". ──
const seedMicroRachas = (): Record<string, MicroRacha> => ({
  agua: { dias: 29, escudos: 2 },
  entrenar: { dias: 12, escudos: 0 },
  leer: { dias: 8, escudos: 0 },
});

const microRachas: Record<string, Record<string, MicroRacha>> = {
  gio: seedMicroRachas(),
  jenni: seedMicroRachas(),
};

// ── DayLogs ───────────────────────────────────────────────
const mkDay = (
  offsetDias: number,
  opts: { perfecto?: boolean; doble?: boolean; chela?: "sin" | "juntitos"; xp: number },
): [string, DayLog] => {
  const fecha = new Date(Date.now() - offsetDias * 86_400_000);
  const key = hoyKey(fecha);
  const perfecto = opts.perfecto ?? true;
  const log: DayLog = {
    misiones: {
      entrenar: { hecho: true, doble: opts.doble ?? false },
      chela: { tipo: opts.chela ?? "sin", ok: true },
      comida: { ok: true },
      agua: { ok: true },
      lectura: { ok: true, paginas: 12 },
      foto: { ok: perfecto, storagePath: undefined },
    },
    cerrado: true,
    perfecto,
    xpGanado: opts.xp,
    ts: fecha.getTime(),
  };
  return [key, log];
};

// "Hoy" en curso: 5 obligatorias en verde (el compañero cumple por defecto →
// cerrar sin reinicio). Falta la foto: súbela para "día perfecto". Para probar
// el reinicio solidario, desmarca una obligatoria antes de cerrar.
const mkHoy = (): [string, DayLog] => {
  const fecha = new Date();
  const log: DayLog = {
    misiones: {
      entrenar: { hecho: true, doble: false },
      chela: { tipo: "sin", ok: true },
      comida: { ok: true },
      agua: { ok: true },
      lectura: { ok: true, paginas: 10 },
      foto: { ok: false, storagePath: undefined },
    },
    cerrado: false,
    perfecto: false,
    xpGanado: 0,
    ts: fecha.getTime(),
  };
  return [hoyKey(fecha), log];
};

const buildDayLogs = (): Record<string, DayLog> =>
  Object.fromEntries([
    mkDay(4, { perfecto: true, doble: true, xp: 130 }),
    mkDay(3, { perfecto: false, xp: 80 }),
    mkDay(2, { perfecto: true, chela: "juntitos", xp: 110 }),
    mkDay(1, { perfecto: true, doble: true, chela: "juntitos", xp: 145 }),
    mkHoy(),
  ]);

const dayLogs: Record<string, Record<string, DayLog>> = {
  gio: buildDayLogs(),
  jenni: buildDayLogs(),
};

const xpLog: Record<string, XpLogEntry[]> = { gio: [], jenni: [] };

// Intentos (append-only). Intento #1 reiniciado; #2 en curso.
const seedIntentos: Intento[] = [
  {
    numero: 1,
    fechaInicio: Date.parse("2026-04-20T00:00:00"),
    fechaFin: Date.parse("2026-05-12T00:00:00"),
    diasLogrados: 22,
    quienFallo: "gio",
  },
  {
    numero: 2,
    fechaInicio: Date.parse("2026-05-21T00:00:00"),
    diasLogrados: 39,
  },
];

// Logros ya desbloqueados (semilla coherente con el día 40).
const achievements: Record<string, string[]> = {
  gio: ["primer_paso", "primera_semana", "mitad", "ritual"],
  jenni: ["primer_paso", "primera_semana", "mitad", "ritual", "sincronia"],
};

// ── API async (gemela de la futura de Firebase) ───────────
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const unir = (a: string[], b: string[]): string[] => Array.from(new Set([...a, ...b]));

export const mockAdapter = {
  async getPacto(): Promise<Pacto> {
    return clone(pactoActual);
  },

  async updatePacto(pacto: Pacto): Promise<void> {
    pactoActual = PactoSchema.parse(pacto);
  },

  async getPlayer(uid: string): Promise<Player | null> {
    return players[uid] ? clone(players[uid]) : null;
  },

  async updatePlayerCache(uid: string, player: Player): Promise<void> {
    players[uid] = PlayerSchema.parse(player);
  },

  async getDayLog(uid: string, dayKey: string): Promise<DayLog | null> {
    return dayLogs[uid]?.[dayKey] ? clone(dayLogs[uid][dayKey]) : null;
  },

  async setDayLog(uid: string, dayKey: string, log: DayLog): Promise<void> {
    dayLogs[uid] ??= {};
    dayLogs[uid][dayKey] = clone(log);
  },

  // ── Append-only ──
  async appendXpLog(uid: string, entries: XpLogEntry[]): Promise<void> {
    xpLog[uid] ??= [];
    xpLog[uid].push(...entries.map(clone));
  },

  async appendIntento(intento: Intento): Promise<void> {
    seedIntentos.push(clone(intento));
  },

  async getAchievements(uid: string): Promise<string[]> {
    return clone(achievements[uid] ?? []);
  },

  async unlockAchievements(uid: string, ids: string[]): Promise<void> {
    achievements[uid] = unir(achievements[uid] ?? [], ids);
  },

  async getWardrobeIds(uid: string): Promise<string[]> {
    return clone(wardrobeIds[uid] ?? []);
  },

  async unlockWardrobe(uid: string, ids: string[]): Promise<void> {
    wardrobeIds[uid] = unir(wardrobeIds[uid] ?? [], ids);
  },

  // ── Micro-rachas ──
  async getMicroRachas(uid: string): Promise<Record<string, MicroRacha>> {
    return clone(microRachas[uid] ?? {});
  },

  async setMicroRachas(uid: string, rachas: Record<string, MicroRacha>): Promise<void> {
    microRachas[uid] = clone(rachas);
  },

  async setAvatar(uid: string, avatar: Player["avatar"]): Promise<void> {
    if (players[uid]) players[uid].avatar = clone(avatar);
  },

  async setNombre(uid: string, nombre: string): Promise<void> {
    if (players[uid]) players[uid].nombre = nombre;
  },

  async getIntentos(): Promise<Intento[]> {
    return clone(seedIntentos);
  },

  // Heatmap del intento actual: reconstruye desde los dayLogs reales los días
  // ya cerrados; el resto cae a la semilla por patrón. Usa el pacto vivo.
  async getRetoDias(uid: string): Promise<DiaEstado[]> {
    const OBLIG5: MisionId[] = ["entrenar", "chela", "comer", "agua", "leer"];
    const OBLIG6: MisionId[] = [...OBLIG5, "foto"];
    const diaActual = pactoActual.retoDiaActual;
    const offset = uid === "jenni" ? 2 : 0;
    const dias: DiaEstado[] = [];

    const logReal = (d: number): DayLog | null => {
      const key = hoyKey(new Date(Date.now() - (diaActual - d) * 86_400_000));
      return dayLogs[uid]?.[key] ?? null;
    };

    for (let d = 1; d <= RETO_DIAS; d++) {
      const real = logReal(d);

      if (real?.cerrado) {
        // Día con log real cerrado → estado desde el log.
        dias.push({
          dia: d,
          estado: real.perfecto ? "perfecto" : "cumplido",
          dayKey: hoyKey(new Date(real.ts)),
          resumen: { misionesOk: evaluarDia(real).misionesOk, perfecto: real.perfecto },
        });
      } else if (d < diaActual) {
        // Pasado sin log real → semilla por patrón.
        const perfecto = (d + offset) % 4 === 0;
        dias.push({
          dia: d,
          estado: perfecto ? "perfecto" : "cumplido",
          resumen: { misionesOk: perfecto ? OBLIG6 : OBLIG5, perfecto },
        });
      } else if (d === diaActual) {
        dias.push({ dia: d, estado: "hoy", dayKey: hoyKey() });
      } else {
        dias.push({ dia: d, estado: "futuro" });
      }
    }
    return clone(dias);
  },
};

export type MockAdapter = typeof mockAdapter;
