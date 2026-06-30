// Helpers puros de avance del día (sin Firebase, sin engine real).
// Cuenta las obligatorias de un DayLog por su campo directo (vista simple).
import { MISIONES } from "@/config/rules";
import type { DayLog } from "@/lib/schemas";

export const TOTAL_OBLIGATORIAS = MISIONES.filter((m) => m.requiereParaDia).length;

export const contarObligatorias = (log: DayLog | null): number => {
  if (!log) return 0;
  const m = log.misiones;
  return [m.entrenar.hecho, m.chela.ok, m.comida.ok, m.agua.ok, m.lectura.ok].filter(Boolean)
    .length;
};

/** ¿Las 5 obligatorias en verde? (vista simple, sin la regla de pareja). */
export const diaCerradoSimple = (log: DayLog | null): boolean =>
  contarObligatorias(log) === TOTAL_OBLIGATORIAS;
