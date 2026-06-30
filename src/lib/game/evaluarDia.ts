// Engine PURO: evalúa un día. Sin Firebase, sin Zustand, sin React.
import { MISIONES, type MisionId } from "@/config/rules";
import type { DayLog } from "@/lib/schemas";

export interface EvalDia {
  misionesOk: MisionId[]; // todas las cumplidas (incluida foto si está)
  obligatoriasOk: number; // cuántas de las 5 requeridas
  cumplido: boolean; // las 5 obligatorias en verde
  perfecto: boolean; // cumplido + foto
}

/** ¿Está esta misión en verde? La chela usa el flag ya normalizado del log
 *  (entre semana = chela.ok; finde = chela.ok solo si ambos confirmaron). */
export function misionOk(log: DayLog, id: MisionId): boolean {
  const m = log.misiones;
  switch (id) {
    case "entrenar":
      return m.entrenar.hecho;
    case "chela":
      return m.chela.ok;
    case "comer":
      return m.comida.ok;
    case "agua":
      return m.agua.ok;
    case "leer":
      return m.lectura.ok;
    case "foto":
      return m.foto.ok;
  }
}

export function evaluarDia(log: DayLog): EvalDia {
  const misionesOk = MISIONES.filter((m) => misionOk(log, m.id)).map((m) => m.id);
  const obligatoriasOk = MISIONES.filter(
    (m) => m.requiereParaDia && misionOk(log, m.id),
  ).length;
  const totalObligatorias = MISIONES.filter((m) => m.requiereParaDia).length;
  const cumplido = obligatoriasOk === totalObligatorias;
  const perfecto = cumplido && log.misiones.foto.ok;
  return { misionesOk, obligatoriasOk, cumplido, perfecto };
}
