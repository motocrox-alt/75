// Engine: orquesta el cierre de un día uniendo B1+B2. Casi-puro: recibe el
// estado completo y devuelve TODO lo que hay que persistir + lo que animar.
// NO toca stores ni mock (eso lo hace el store que lo invoca).
import type { Player, DayLog, Pacto, Intento } from "@/lib/schemas";
import { MISIONES, RETO_DIAS } from "@/config/rules";
import { evaluarDia, misionOk } from "@/lib/game/evaluarDia";
import { aplicarCierreDia, type XpLogEntry } from "@/lib/game/cierre";
import { actualizarMicroRacha, actualizarRachaReto, type MicroRacha } from "@/lib/game/streaks";
import { chequearLogros, type ContextoLogros } from "@/lib/game/achievements";
import { chequearOutfits } from "@/lib/game/wardrobe";
import { decidirReinicio, aplicarReinicio, type JugadorId } from "@/lib/game/reinicio";

export interface EntradaCierre {
  player: Player;
  log: DayLog;
  pacto: Pacto;
  microRachas: Record<string, MicroRacha>;
  contextoLogros: ContextoLogros;
  yaOutfits: string[];
  ts: number;
}

export interface SalidaCierre {
  player: Player; // actualizado (xp/stats/nivel/racha)
  xpLogEntries: XpLogEntry[];
  microRachas: Record<string, MicroRacha>;
  logrosNuevos: string[];
  outfitsNuevos: string[];
  subioNivel: boolean;
  nivelDespues: number;
  perfecto: boolean;
  xpGanado: number;
  reinicio: {
    hay: boolean;
    pactoNuevo?: Pacto;
    intentoCerrado?: Intento;
    quienFallo?: JugadorId[];
  };
}

export function cerrarDiaCompleto(
  e: EntradaCierre,
  cumplidoCompañero: boolean,
): SalidaCierre {
  const evalDia = evaluarDia(e.log);
  const cumplidoYo = evalDia.cumplido;

  // 1) XP / stats / nivel (B1).
  const cierre = aplicarCierreDia(e.player, e.log, e.ts);

  // 2) Reinicio solidario (B2): basta que uno falle.
  const decision = decidirReinicio(cumplidoYo, cumplidoCompañero);

  // 3) Racha del reto (sin escudo). Reinicio → 0; si no, ambos cumplieron → +1.
  const rachaReto = decision.hayReinicio
    ? 0
    : actualizarRachaReto(e.player.rachaReto, true);

  const playerFinal: Player = { ...cierre.player, rachaReto };

  // 4) Micro-rachas por hábito (con escudos). Permanentes (no se pierden en reinicio).
  const microRachas: Record<string, MicroRacha> = {};
  for (const m of MISIONES) {
    const prev = e.microRachas[m.id] ?? { dias: 0, escudos: 0 };
    microRachas[m.id] = actualizarMicroRacha(prev, misionOk(e.log, m.id));
  }

  // 5) Logros nuevos (datos dinámicos calculados aquí; el resto viene del store).
  const retoCompletado =
    e.pacto.retoDiaActual >= RETO_DIAS && cumplidoYo && cumplidoCompañero;
  const ctxLogros: ContextoLogros = {
    ...e.contextoLogros,
    diaReto: e.pacto.retoDiaActual,
    rachaReto,
    microRachaAgua: microRachas["agua"]?.dias ?? 0,
    retoCompletado,
  };
  const logrosNuevos = chequearLogros(ctxLogros);

  // 6) Outfits nuevos (hito/nivel/logro), considerando los logros recién obtenidos.
  const outfitsNuevos = chequearOutfits({
    diaReto: e.pacto.retoDiaActual,
    nivel: playerFinal.nivel,
    logros: [...e.contextoLogros.yaDesbloqueados, ...logrosNuevos],
    yaDesbloqueadas: e.yaOutfits,
  });

  // 7) Si hay reinicio, arma el pacto nuevo + el intento cerrado (sin tocar player).
  let reinicio: SalidaCierre["reinicio"] = { hay: false };
  if (decision.hayReinicio) {
    const diasLogrados = Math.max(0, e.pacto.retoDiaActual - 1);
    const res = aplicarReinicio(e.pacto, diasLogrados, decision.quienFallo, e.ts);
    reinicio = {
      hay: true,
      pactoNuevo: res.pacto,
      intentoCerrado: res.intentoCerrado,
      quienFallo: decision.quienFallo,
    };
  }

  return {
    player: playerFinal,
    xpLogEntries: cierre.xpLogEntries,
    microRachas,
    logrosNuevos,
    outfitsNuevos,
    subioNivel: cierre.subioNivel,
    nivelDespues: cierre.nivelDespues,
    perfecto: evalDia.perfecto,
    xpGanado: cierre.xpGanado,
    reinicio,
  };
}
