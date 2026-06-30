// Catálogo del vestidor, consolidado desde las listas de sprites.ts.
// Por ahora todas las condiciones son por hito (día), tomadas de unlockDay.
// (Nivel/logro se conectan en Fase B.)
import { HAIR_LIST, OUTFIT_LIST, ACC_LIST } from "./sprites/sprites";

export type Slot = "hair" | "outfit" | "acc";

export interface Pieza {
  id: string;
  slot: Slot;
  nombre: string;
  unlockDay: number;
  fuente: "base" | "hito";
}

const mk =
  (slot: Slot) =>
  (x: { id: string; name: string; unlockDay: number }): Pieza => ({
    id: x.id,
    slot,
    nombre: x.name,
    unlockDay: x.unlockDay,
    fuente: x.unlockDay > 1 ? "hito" : "base",
  });

export const WARDROBE: Pieza[] = [
  ...HAIR_LIST.map(mk("hair")),
  ...OUTFIT_LIST.map(mk("outfit")),
  ...ACC_LIST.map(mk("acc")),
];

export const desbloqueada = (p: Pieza, diaReto: number): boolean =>
  diaReto >= p.unlockDay;
