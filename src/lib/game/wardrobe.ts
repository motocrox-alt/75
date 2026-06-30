// Engine PURO: qué piezas del vestidor se desbloquean (hito/nivel/logro).
// Devuelve solo las recién desbloqueadas (excluye yaDesbloqueadas).
// Las piezas son permanentes: reinicio.ts no las toca.
import { WARDROBE, condicionDe, type Condicion } from "@/config/wardrobe";

export interface ContextoOutfits {
  diaReto: number;
  nivel: number;
  logros: string[];
  yaDesbloqueadas: string[];
}

export const cumpleCondicion = (cond: Condicion, ctx: ContextoOutfits): boolean => {
  switch (cond.tipo) {
    case "hito":
      return ctx.diaReto >= cond.dia;
    case "nivel":
      return ctx.nivel >= cond.nivel;
    case "logro":
      return ctx.logros.includes(cond.logroId);
  }
};

export function chequearOutfits(ctx: ContextoOutfits): string[] {
  const ya = new Set(ctx.yaDesbloqueadas);
  return WARDROBE.filter(
    (p) => !ya.has(p.id) && cumpleCondicion(condicionDe(p), ctx),
  ).map((p) => p.id);
}
