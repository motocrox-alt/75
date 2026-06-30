import { describe, it, expect } from "vitest";
import { calcularXpDia } from "@/lib/game/xp";
import { BONUS_ENTRENO_DOBLE, BONUS_DIA_PERFECTO } from "@/config/rules";
import { emptyMisiones, obligatoriasOk, makeDayLog } from "@/lib/game/_fixtures";

describe("calcularXpDia", () => {
  it("suma el XP de las 5 obligatorias (20+25+20+15+20 = 100)", () => {
    const r = calcularXpDia(makeDayLog(obligatoriasOk()));
    expect(r.total).toBe(100);
  });

  it("mapea cada misión a su stat correcto", () => {
    const r = calcularXpDia(makeDayLog(obligatoriasOk()));
    // fuerza=entrenar20, templanza=chela25+comer20, vitalidad=agua15, mente=leer20
    expect(r.porStat.fuerza).toBe(20);
    expect(r.porStat.templanza).toBe(45);
    expect(r.porStat.vitalidad).toBe(15);
    expect(r.porStat.mente).toBe(20);
    expect(r.porStat.constancia).toBe(0);
    expect(r.porStat.vinculo).toBe(0);
  });

  it("el bonus de entreno doble (+15 Fuerza) se aplica", () => {
    const m = obligatoriasOk();
    m.entrenar.doble = true;
    const r = calcularXpDia(makeDayLog(m));
    expect(r.total).toBe(100 + BONUS_ENTRENO_DOBLE);
    expect(r.porStat.fuerza).toBe(20 + BONUS_ENTRENO_DOBLE);
    expect(r.desglose.some((d) => d.fuente === "entreno_doble")).toBe(true);
  });

  it("el bonus de día perfecto (+30 Vínculo) se aplica con las 5 + foto", () => {
    const m = obligatoriasOk();
    m.foto.ok = true;
    const r = calcularXpDia(makeDayLog(m));
    // 100 oblig + 20 foto + 30 perfecto = 150
    expect(r.total).toBe(150);
    expect(r.porStat.constancia).toBe(20); // la foto da Constancia
    expect(r.porStat.vinculo).toBe(BONUS_DIA_PERFECTO);
  });

  it("la foto suma a Constancia pero no condiciona el 'cumplido' (sin 5 → sin bonus perfecto)", () => {
    const m = emptyMisiones();
    m.foto.ok = true;
    const r = calcularXpDia(makeDayLog(m));
    expect(r.total).toBe(20); // solo la foto
    expect(r.porStat.constancia).toBe(20);
    expect(r.porStat.vinculo).toBe(0); // no hubo día perfecto
  });

  it("el desglose suma exactamente el total (listo para xpLog)", () => {
    const m = obligatoriasOk();
    m.foto.ok = true;
    m.entrenar.doble = true;
    const r = calcularXpDia(makeDayLog(m));
    const suma = r.desglose.reduce((acc, d) => acc + d.cantidad, 0);
    expect(suma).toBe(r.total);
  });
});
