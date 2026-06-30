// Misiones diarias y criterio de "día cumplido".
// La foto NO cuenta para cumplir el día (solo bonus de XP/Constancia).
// La chela cambia según el día de la semana (semana=individual / finde=pareja).

export type StatId =
  | "fuerza"
  | "templanza"
  | "vitalidad"
  | "mente"
  | "constancia"
  | "vinculo";

export interface Mision {
  id: "entrenar" | "chela" | "comer" | "agua" | "leer" | "foto";
  label: string;
  stat: StatId;
  xp: number;
  requiereParaDia: boolean;
}

export const MISIONES: Mision[] = [
  { id: "entrenar", label: "Entrenar (mín 1, ideal 2)", stat: "fuerza", xp: 20, requiereParaDia: true },
  { id: "chela", label: "Chela (semana: sin / finde: juntitos)", stat: "templanza", xp: 25, requiereParaDia: true },
  { id: "comer", label: "Comer limpio", stat: "templanza", xp: 20, requiereParaDia: true },
  { id: "agua", label: "Tomar agua", stat: "vitalidad", xp: 15, requiereParaDia: true },
  { id: "leer", label: "Leer 10 páginas", stat: "mente", xp: 20, requiereParaDia: true },
  { id: "foto", label: "Foto de progreso (opcional)", stat: "constancia", xp: 20, requiereParaDia: false },
];

export const BONUS_ENTRENO_DOBLE = 15;
export const BONUS_DIA_PERFECTO = 30; // +Vínculo
export const RETO_DIAS = 75;

/** vie/sáb/dom = la chela es misión de pareja "juntitos"; resto = individual "sin chela". */
export const esFinde = (d: Date): boolean => [5, 6, 0].includes(d.getDay());
