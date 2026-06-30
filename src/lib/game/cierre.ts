// Engine PURO y central: aplica el cierre de un día a un Player.
// Devuelve un Player NUEVO (sin mutar el original) + entradas de xpLog a
// appendear. NO toca rachas/logros/outfits/reinicio ni persiste nada.
import type { Player, DayLog } from "@/lib/schemas";
import type { StatId } from "@/config/rules";
import { nivelDesdeXp } from "@/config/leveling";
import { evaluarDia, type EvalDia } from "@/lib/game/evaluarDia";
import { calcularXpDia } from "@/lib/game/xp";

export interface XpLogEntry {
  fuente: string;
  cantidad: number;
  stat?: string;
  ts: number;
}

export interface ResultadoCierre {
  player: Player; // NUEVO player (xp, stats, nivel) — sin mutar el original
  xpLogEntries: XpLogEntry[]; // a appendear (append-only)
  eval: EvalDia;
  xpGanado: number;
  subioNivel: boolean;
  nivelAntes: number;
  nivelDespues: number;
}

export function aplicarCierreDia(player: Player, log: DayLog, ts: number): ResultadoCierre {
  const evalDia = evaluarDia(log);
  const xpd = calcularXpDia(log);

  const nivelAntes = nivelDesdeXp(player.xp);
  const xpNuevo = player.xp + xpd.total;
  const nivelDespues = nivelDesdeXp(xpNuevo);

  // Stats nuevos (inmutable: copia + suma).
  const stats = { ...player.stats };
  (Object.keys(xpd.porStat) as StatId[]).forEach((s) => {
    stats[s] += xpd.porStat[s];
  });

  const nuevoPlayer: Player = {
    ...player,
    xp: xpNuevo,
    stats,
    nivel: nivelDespues,
  };

  const xpLogEntries: XpLogEntry[] = xpd.desglose.map((d) => ({
    fuente: d.fuente,
    cantidad: d.cantidad,
    stat: d.stat,
    ts,
  }));

  return {
    player: nuevoPlayer,
    xpLogEntries,
    eval: evalDia,
    xpGanado: xpd.total,
    subioNivel: nivelDespues > nivelAntes,
    nivelAntes,
    nivelDespues,
  };
}
