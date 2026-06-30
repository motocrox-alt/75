// Engine PURO: XP y ganancias por stat de un día.
import {
  MISIONES,
  BONUS_ENTRENO_DOBLE,
  BONUS_DIA_PERFECTO,
  type StatId,
} from "@/config/rules";
import type { DayLog } from "@/lib/schemas";
import { evaluarDia, misionOk } from "@/lib/game/evaluarDia";

export interface XpDesglose {
  fuente: string;
  cantidad: number;
  stat?: StatId;
}

export interface XpDia {
  total: number;
  porStat: Record<StatId, number>;
  desglose: XpDesglose[];
}

const statsCero = (): Record<StatId, number> => ({
  fuerza: 0,
  templanza: 0,
  vitalidad: 0,
  mente: 0,
  constancia: 0,
  vinculo: 0,
});

export function calcularXpDia(log: DayLog): XpDia {
  const porStat = statsCero();
  const desglose: XpDesglose[] = [];
  let total = 0;

  // XP base por misión cumplida (acumula en su stat).
  for (const m of MISIONES) {
    if (misionOk(log, m.id)) {
      total += m.xp;
      porStat[m.stat] += m.xp;
      desglose.push({ fuente: m.id, cantidad: m.xp, stat: m.stat });
    }
  }

  // Bonus: entreno doble → Fuerza.
  if (log.misiones.entrenar.hecho && log.misiones.entrenar.doble) {
    total += BONUS_ENTRENO_DOBLE;
    porStat.fuerza += BONUS_ENTRENO_DOBLE;
    desglose.push({ fuente: "entreno_doble", cantidad: BONUS_ENTRENO_DOBLE, stat: "fuerza" });
  }

  // Bonus: día perfecto → Vínculo.
  if (evaluarDia(log).perfecto) {
    total += BONUS_DIA_PERFECTO;
    porStat.vinculo += BONUS_DIA_PERFECTO;
    desglose.push({ fuente: "dia_perfecto", cantidad: BONUS_DIA_PERFECTO, stat: "vinculo" });
  }

  return { total, porStat, desglose };
}
