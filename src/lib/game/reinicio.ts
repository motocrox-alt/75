// Engine PURO: reinicio SOLIDARIO del reto.
// Si CUALQUIERA de los dos no cumple el día, reinician los dos.
// CLAVE (no-castigo): el personaje (nivel, xp, stats, logros, outfits) se
// CONSERVA intacto — estas funciones NI reciben ni tocan players. Solo el
// contador del reto vuelve a 1 y se registra el intento que terminó.
import type { Pacto, Intento } from "@/lib/schemas";

export type JugadorId = "gio" | "jenni";

export interface DecisionReinicio {
  hayReinicio: boolean;
  quienFallo: JugadorId[];
}

/** Reinicio solidario: basta con que uno no cumpla para reiniciar a ambos. */
export function decidirReinicio(
  cumplidoGio: boolean,
  cumplidoJenni: boolean,
): DecisionReinicio {
  const quienFallo: JugadorId[] = [];
  if (!cumplidoGio) quienFallo.push("gio");
  if (!cumplidoJenni) quienFallo.push("jenni");
  return { hayReinicio: quienFallo.length > 0, quienFallo };
}

export interface ResultadoReinicio {
  pacto: Pacto; // NUEVO pacto: día 1, intentoActual+1, retoInicio = ts
  intentoCerrado: Intento; // entrada append-only del intento que terminó
}

/** Aplica el reinicio: nuevo pacto (contador en 1) + el intento cerrado.
 *  NO recibe players → es imposible que toque el personaje. NO persiste. */
export function aplicarReinicio(
  pacto: Pacto,
  diasLogrados: number,
  quienFallo: JugadorId[],
  ts: number,
): ResultadoReinicio {
  const intentoCerrado: Intento = {
    numero: pacto.intentoActual,
    fechaInicio: pacto.retoInicio ?? ts,
    fechaFin: ts,
    diasLogrados,
    ...(quienFallo.length > 0 ? { quienFallo: quienFallo.join(",") } : {}),
  };

  const nuevoPacto: Pacto = {
    ...pacto,
    retoDiaActual: 1,
    retoInicio: ts,
    intentoActual: pacto.intentoActual + 1,
    retoEstado: "activo",
  };

  return { pacto: nuevoPacto, intentoCerrado };
}
