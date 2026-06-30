// Metadata de los 6 stats para la UI (orden, label, color). Fuente única.
// El icono de cada stat sale de STAT_ICON en sprites.ts.
import type { StatId } from "./rules";

export interface StatMeta {
  id: StatId;
  label: string;
  color: string;
}

export const STATS_META: StatMeta[] = [
  { id: "fuerza", label: "Fuerza", color: "#E03B2C" }, // mario
  { id: "templanza", label: "Templanza", color: "#E8A020" }, // ámbar
  { id: "vitalidad", label: "Vitalidad", color: "#2080C0" }, // azul poción
  { id: "mente", label: "Mente", color: "#3A6FE0" }, // azul libro
  { id: "constancia", label: "Constancia", color: "#7A5AA0" }, // morado
  { id: "vinculo", label: "Vínculo", color: "#00A844" }, // pipe
];

/** Máximo común para normalizar barras/radar. */
export const STAT_MAX = 100;
