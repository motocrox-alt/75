// Adapter en memoria (mock-first). Mismos métodos que tendrá el gemelo Firebase.
// Datos semilla a MITAD del reto (día ~40) para que las vistas se vean vivas.
// USE_MOCK por default true; el estado vive en memoria (sin localStorage).
import {
  PactoSchema,
  PlayerSchema,
  WardrobePieceSchema,
  type Pacto,
  type Player,
  type DayLog,
  type WardrobePiece,
  type XpLogEntry,
  type DiaEstado,
  type MisionId,
  type Intento,
} from "@/lib/schemas";
import { WARDROBE } from "@/config/wardrobe";
import { RETO_DIAS } from "@/config/rules";
import { hoyKey } from "@/lib/utils/date";

export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== "false";

const DIA_RETO = 40;

// ── Pacto (a mitad del reto, segundo intento) ─────────────
const seedPacto: Pacto = PactoSchema.parse({
  retoInicio: Date.parse("2026-05-21T00:00:00") || 0, // ~40 días antes de hoy
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
  xp: 2050, // dentro del nivel 7 (1852..2263)
  stats: { fuerza: 58, templanza: 44, vitalidad: 40, mente: 36, constancia: 22, vinculo: 64 },
  rachaReto: DIA_RETO,
  ultimoDiaCerrado: hoyKey(new Date(Date.now() - 86_400_000)),
  avatar: { piel: undefined, pelo: "corto", outfit: "tee", accesorio: "none" },
});

const seedJenni: Player = PlayerSchema.parse({
  nombre: "Jenni",
  nivel: 6,
  xp: 1650, // dentro del nivel 6 (1470..1852)
  stats: { fuerza: 40, templanza: 50, vitalidad: 46, mente: 48, constancia: 30, vinculo: 64 },
  rachaReto: DIA_RETO,
  ultimoDiaCerrado: hoyKey(new Date(Date.now() - 86_400_000)),
  avatar: { piel: undefined, pelo: "largo", outfit: "dress", accesorio: "diadema" },
});

const players: Record<string, Player> = { gio: seedGio, jenni: seedJenni };

// ── Wardrobe: todo lo con unlockDay<=40 ya desbloqueado (incluye ember d38) ──
const buildWardrobe = (): WardrobePiece[] =>
  WARDROBE.filter((p) => p.unlockDay <= DIA_RETO).map((p) =>
    WardrobePieceSchema.parse({
      slot: p.slot,
      fuente: p.fuente,
      desbloqueadoEn: p.unlockDay,
    }),
  );

const wardrobe: Record<string, WardrobePiece[]> = {
  gio: buildWardrobe(),
  jenni: buildWardrobe(),
};

// ── DayLogs recientes (mezcla de perfectos y normales) ────
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

// "Hoy" en curso: día parcial (3/5 obligatorias) para que la pantalla se vea
// viva y el flujo de pareja sea demostrable. La chela queda confirmada por
// este jugador (sirve como confirmación del compañero al verlo desde el otro).
const mkHoy = (): [string, DayLog] => {
  const fecha = new Date();
  const log: DayLog = {
    misiones: {
      entrenar: { hecho: true, doble: false },
      chela: { tipo: "sin", ok: true },
      comida: { ok: false },
      agua: { ok: true },
      lectura: { ok: false, paginas: 0 },
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

// Intentos del reto (append-only). Coherente con el día 40, intento #2 en curso.
// El #1 se reinició (épica, no vergüenza): 22 días recorridos juntos.
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

// Logros ya desbloqueados (semilla coherente con el día 40). Solo el dato:
// la evaluación real es Fase B.
const achievements: Record<string, string[]> = {
  gio: ["primer_paso", "primera_semana", "mitad", "ritual"],
  jenni: ["primer_paso", "primera_semana", "mitad", "ritual", "sincronia"],
};

// ── API async (gemela de la futura de Firebase) ───────────
const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export const mockAdapter = {
  async getPacto(): Promise<Pacto> {
    return clone(seedPacto);
  },

  async getPlayer(uid: string): Promise<Player | null> {
    return players[uid] ? clone(players[uid]) : null;
  },

  async getDayLog(uid: string, dayKey: string): Promise<DayLog | null> {
    return dayLogs[uid]?.[dayKey] ? clone(dayLogs[uid][dayKey]) : null;
  },

  async setDayLog(uid: string, dayKey: string, log: DayLog): Promise<void> {
    dayLogs[uid] ??= {};
    dayLogs[uid][dayKey] = clone(log);
  },

  async listWardrobe(uid: string): Promise<WardrobePiece[]> {
    return clone(wardrobe[uid] ?? []);
  },

  async appendXp(uid: string, entry: XpLogEntry): Promise<void> {
    xpLog[uid] ??= [];
    xpLog[uid].push(clone(entry));
  },

  async getAchievements(uid: string): Promise<string[]> {
    return clone(achievements[uid] ?? []);
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

  // Heatmap del intento actual: 75 días sembrados coherentes con el día 40.
  // Intento #2 sin fallos internos; los reinicios viven en el historial.
  async getRetoDias(uid: string): Promise<DiaEstado[]> {
    const OBLIG5: MisionId[] = ["entrenar", "chela", "comer", "agua", "leer"];
    const OBLIG6: MisionId[] = [...OBLIG5, "foto"];
    const offset = uid === "jenni" ? 2 : 0; // patrón de perfectos distinto por jugador
    const dias: DiaEstado[] = [];

    for (let d = 1; d <= RETO_DIAS; d++) {
      if (d < DIA_RETO) {
        const perfecto = (d + offset) % 4 === 0;
        dias.push({
          dia: d,
          estado: perfecto ? "perfecto" : "cumplido",
          dayKey: hoyKey(new Date(Date.now() - (DIA_RETO - d) * 86_400_000)),
          resumen: { misionesOk: perfecto ? OBLIG6 : OBLIG5, perfecto },
        });
      } else if (d === DIA_RETO) {
        dias.push({
          dia: d,
          estado: "hoy",
          dayKey: hoyKey(),
          resumen: { misionesOk: ["entrenar", "chela", "agua"], perfecto: false },
        });
      } else {
        dias.push({ dia: d, estado: "futuro" });
      }
    }
    return clone(dias);
  },
};

export type MockAdapter = typeof mockAdapter;
