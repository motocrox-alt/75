import { describe, it, expect } from "vitest";
import { decidirReinicio, aplicarReinicio } from "@/lib/game/reinicio";
import type { Pacto } from "@/lib/schemas";

const makePacto = (over: Partial<Pacto> = {}): Pacto => ({
  retoInicio: 1000,
  retoDiaActual: 23,
  retoEstado: "activo",
  intentoActual: 2,
  vinculoXp: 640,
  vinculoNivel: 4,
  jugadores: ["gio", "jenni"],
  ...over,
});

describe("decidirReinicio (solidario)", () => {
  it("reinicia si uno falla, con quienFallo correcto", () => {
    expect(decidirReinicio(true, false)).toEqual({ hayReinicio: true, quienFallo: ["jenni"] });
    expect(decidirReinicio(false, true)).toEqual({ hayReinicio: true, quienFallo: ["gio"] });
  });

  it("reinicia si fallan los dos", () => {
    expect(decidirReinicio(false, false)).toEqual({
      hayReinicio: true,
      quienFallo: ["gio", "jenni"],
    });
  });

  it("NO reinicia si ambos cumplen", () => {
    expect(decidirReinicio(true, true)).toEqual({ hayReinicio: false, quienFallo: [] });
  });
});

describe("aplicarReinicio (conserva el personaje)", () => {
  it("nuevo pacto en día 1, intento+1, retoInicio = ts", () => {
    const pacto = makePacto();
    const { pacto: nuevo } = aplicarReinicio(pacto, 22, ["gio"], 5000);
    expect(nuevo.retoDiaActual).toBe(1);
    expect(nuevo.intentoActual).toBe(3);
    expect(nuevo.retoInicio).toBe(5000);
    expect(nuevo.retoEstado).toBe("activo");
    // conserva vínculo y jugadores
    expect(nuevo.vinculoXp).toBe(pacto.vinculoXp);
    expect(nuevo.jugadores).toEqual(pacto.jugadores);
  });

  it("registra el intento cerrado con datos correctos", () => {
    const pacto = makePacto({ retoInicio: 1000, intentoActual: 2 });
    const { intentoCerrado } = aplicarReinicio(pacto, 22, ["gio"], 5000);
    expect(intentoCerrado).toEqual({
      numero: 2,
      fechaInicio: 1000,
      fechaFin: 5000,
      diasLogrados: 22,
      quienFallo: "gio",
    });
  });

  it("no muta el pacto original", () => {
    const pacto = makePacto();
    const snapshot = structuredClone(pacto);
    aplicarReinicio(pacto, 22, ["gio", "jenni"], 5000);
    expect(pacto).toEqual(snapshot);
  });
});
