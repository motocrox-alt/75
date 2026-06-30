// Engine PURO: rachas.
// - Micro-rachas de stat (ej. agua): CON escudos (un día perdido se absorbe).
// - Racha del reto (contador 75): SIN escudo (es 75 Hard); el reinicio se
//   decide aparte en reinicio.ts. Aquí solo refleja el contador.
import { ESCUDO_CADA, ESCUDOS_MAX } from "@/config/streaks";

export interface MicroRacha {
  dias: number;
  escudos: number;
}

/** Micro-racha de un hábito. CON escudos. No muta la entrada. */
export function actualizarMicroRacha(r: MicroRacha, cumplidoHoy: boolean): MicroRacha {
  if (cumplidoHoy) {
    const dias = r.dias + 1;
    const ganaEscudo = dias % ESCUDO_CADA === 0;
    const escudos = ganaEscudo ? Math.min(ESCUDOS_MAX, r.escudos + 1) : r.escudos;
    return { dias, escudos };
  }
  // No cumplió: si hay escudo, se absorbe el día (conserva dias, consume 1).
  if (r.escudos > 0) {
    return { dias: r.dias, escudos: r.escudos - 1 };
  }
  // Sin escudo → la micro-racha se reinicia.
  return { dias: 0, escudos: 0 };
}

/** Racha del reto (días). SIN escudo: si no se cumple, vuelve a 0.
 *  La decisión de reiniciar TODO el reto vive en reinicio.ts. */
export function actualizarRachaReto(rachaActual: number, diaCumplido: boolean): number {
  return diaCumplido ? rachaActual + 1 : 0;
}
