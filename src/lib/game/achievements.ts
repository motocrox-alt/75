// Engine PURO: qué logros nuevos se desbloquean dado el estado.
// Devuelve solo los recién obtenidos (excluye yaDesbloqueados). Append-only.
export interface ContextoLogros {
  diaReto: number;
  rachaReto: number;
  microRachaAgua: number; // días seguidos de agua
  paginasTotales: number;
  primerFindeChelaHecho: boolean;
  sincroniaCount: number; // días que ambos cerraron
  retoCompletado: boolean; // 75 cerrados
  yaDesbloqueados: string[];
}

// Condición por logro (alineadas a LOGROS de config/achievements.ts).
const CONDICIONES: { id: string; cumple: (c: ContextoLogros) => boolean }[] = [
  { id: "primer_paso", cumple: (c) => c.diaReto >= 1 },
  { id: "primera_semana", cumple: (c) => c.rachaReto >= 7 },
  { id: "mitad", cumple: (c) => c.diaReto >= 38 },
  { id: "hidratado", cumple: (c) => c.microRachaAgua >= 30 },
  { id: "biblioteca", cumple: (c) => c.paginasTotales >= 750 },
  { id: "ritual", cumple: (c) => c.primerFindeChelaHecho },
  { id: "sincronia", cumple: (c) => c.sincroniaCount >= 10 },
  { id: "inquebrantables", cumple: (c) => c.retoCompletado },
];

export function chequearLogros(ctx: ContextoLogros): string[] {
  const ya = new Set(ctx.yaDesbloqueados);
  return CONDICIONES.filter((l) => !ya.has(l.id) && l.cumple(ctx)).map((l) => l.id);
}
