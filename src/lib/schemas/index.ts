// Schemas Zod según el modelo de datos de CLAUDE.md. Zod en toda frontera.
// Los tipos se derivan con z.infer.
import { z } from "zod";

// ── Avatar ────────────────────────────────────────────────
export const AvatarSlotsSchema = z.object({
  piel: z.string().optional(),
  pelo: z.string(),
  outfit: z.string(),
  accesorio: z.string(),
});
export type AvatarSlots = z.infer<typeof AvatarSlotsSchema>;

// ── Wardrobe (pieza desbloqueada, append-only) ────────────
export const FuentePiezaSchema = z.enum(["base", "hito", "nivel", "logro"]);
export const SlotSchema = z.enum(["hair", "outfit", "acc"]);
export const WardrobePieceSchema = z.object({
  slot: SlotSchema,
  fuente: FuentePiezaSchema,
  desbloqueadoEn: z.number(),
});
export type WardrobePiece = z.infer<typeof WardrobePieceSchema>;

// ── DayLog ────────────────────────────────────────────────
export const ChelaTipoSchema = z.enum(["sin", "juntitos"]);

export const MisionesSchema = z.object({
  entrenar: z.object({ hecho: z.boolean(), doble: z.boolean() }),
  chela: z.object({ tipo: ChelaTipoSchema, ok: z.boolean() }),
  comida: z.object({ ok: z.boolean() }),
  agua: z.object({ ok: z.boolean() }),
  lectura: z.object({
    ok: z.boolean(),
    paginas: z.number(),
    nota: z.string().optional(),
  }),
  foto: z.object({ ok: z.boolean(), storagePath: z.string().optional() }),
});
export type Misiones = z.infer<typeof MisionesSchema>;

export const DayLogSchema = z.object({
  misiones: MisionesSchema,
  cerrado: z.boolean(),
  perfecto: z.boolean(),
  xpGanado: z.number(),
  ts: z.number(),
});
export type DayLog = z.infer<typeof DayLogSchema>;

// ── Stats ─────────────────────────────────────────────────
export const StatsSchema = z.object({
  fuerza: z.number(),
  templanza: z.number(),
  vitalidad: z.number(),
  mente: z.number(),
  constancia: z.number(),
  vinculo: z.number(),
});
export type Stats = z.infer<typeof StatsSchema>;

// ── Player (cache denormalizado) ──────────────────────────
export const PlayerSchema = z.object({
  nombre: z.string(),
  nivel: z.number(),
  xp: z.number(),
  stats: StatsSchema,
  rachaReto: z.number(),
  ultimoDiaCerrado: z.string().optional(),
  avatar: AvatarSlotsSchema,
});
export type Player = z.infer<typeof PlayerSchema>;

// ── Pacto ─────────────────────────────────────────────────
export const RetoEstadoSchema = z.enum(["pendiente", "activo", "completado"]);
export const PactoSchema = z.object({
  retoInicio: z.number().nullable(),
  retoDiaActual: z.number(),
  retoEstado: RetoEstadoSchema,
  intentoActual: z.number(),
  vinculoXp: z.number(),
  vinculoNivel: z.number(),
  jugadores: z.array(z.string()),
  /** Quién ya entró (arranque al login de ambos). Opcional para compat. */
  haEntrado: z.object({ gio: z.boolean(), jenni: z.boolean() }).optional(),
});
export type Pacto = z.infer<typeof PactoSchema>;

// ── Intento (append-only) ─────────────────────────────────
export const IntentoSchema = z.object({
  numero: z.number(),
  fechaInicio: z.number(),
  fechaFin: z.number().optional(),
  diasLogrados: z.number(),
  quienFallo: z.string().optional(),
});
export type Intento = z.infer<typeof IntentoSchema>;

// ── XP log (append-only) ──────────────────────────────────
export const XpLogEntrySchema = z.object({
  fuente: z.string(),
  cantidad: z.number(),
  statAfectado: z.string().optional(),
  ts: z.number(),
});
export type XpLogEntry = z.infer<typeof XpLogEntrySchema>;

// ── Achievement (append-only) ─────────────────────────────
export const AchievementSchema = z.object({
  desbloqueadoEn: z.number(),
});
export type Achievement = z.infer<typeof AchievementSchema>;

// ── Calendario: estado de un día del reto (datos del mock) ─
export const MisionIdSchema = z.enum(["entrenar", "chela", "comer", "agua", "leer", "foto"]);
export type MisionId = z.infer<typeof MisionIdSchema>;

export const EstadoDiaSchema = z.enum(["cumplido", "perfecto", "fallido", "hoy", "futuro"]);
export type EstadoDia = z.infer<typeof EstadoDiaSchema>;

export const DiaResumenSchema = z.object({
  misionesOk: z.array(MisionIdSchema),
  perfecto: z.boolean(),
});

export const DiaEstadoSchema = z.object({
  dia: z.number(),
  estado: EstadoDiaSchema,
  dayKey: z.string().optional(),
  resumen: DiaResumenSchema.optional(),
});
export type DiaEstado = z.infer<typeof DiaEstadoSchema>;
