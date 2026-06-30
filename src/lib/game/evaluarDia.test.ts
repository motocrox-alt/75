import { describe, it, expect } from "vitest";
import { evaluarDia } from "@/lib/game/evaluarDia";
import { emptyMisiones, obligatoriasOk, makeDayLog } from "@/lib/game/_fixtures";

describe("evaluarDia", () => {
  it("día perfecto (5 obligatorias + foto) → cumplido y perfecto", () => {
    const m = obligatoriasOk();
    m.foto.ok = true;
    const r = evaluarDia(makeDayLog(m));
    expect(r.cumplido).toBe(true);
    expect(r.perfecto).toBe(true);
    expect(r.obligatoriasOk).toBe(5);
    expect(r.misionesOk).toContain("foto");
  });

  it("5 obligatorias sin foto → cumplido pero NO perfecto", () => {
    const r = evaluarDia(makeDayLog(obligatoriasOk()));
    expect(r.cumplido).toBe(true);
    expect(r.perfecto).toBe(false);
    expect(r.misionesOk).not.toContain("foto");
  });

  it("falta una obligatoria → no cumplido", () => {
    const m = obligatoriasOk();
    m.agua.ok = false;
    const r = evaluarDia(makeDayLog(m));
    expect(r.cumplido).toBe(false);
    expect(r.obligatoriasOk).toBe(4);
  });

  it("solo foto, sin las 5 → no cumplido (la foto no salva el día)", () => {
    const m = emptyMisiones();
    m.foto.ok = true;
    const r = evaluarDia(makeDayLog(m));
    expect(r.cumplido).toBe(false);
    expect(r.perfecto).toBe(false);
    expect(r.misionesOk).toEqual(["foto"]);
  });

  it("chela del finde con uno solo confirmado (chela.ok=false) → esa misión no cuenta", () => {
    const m = obligatoriasOk();
    m.chela.tipo = "juntitos";
    m.chela.ok = false; // falta que el compañero confirme
    const r = evaluarDia(makeDayLog(m));
    expect(r.misionesOk).not.toContain("chela");
    expect(r.cumplido).toBe(false);
  });
});
