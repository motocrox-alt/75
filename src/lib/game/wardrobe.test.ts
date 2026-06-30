import { describe, it, expect } from "vitest";
import { chequearOutfits, cumpleCondicion, type ContextoOutfits } from "@/lib/game/wardrobe";

const ctx = (over: Partial<ContextoOutfits> = {}): ContextoOutfits => ({
  diaReto: 0,
  nivel: 1,
  logros: [],
  yaDesbloqueadas: [],
  ...over,
});

describe("cumpleCondicion (hito / nivel / logro)", () => {
  it("hito: desbloquea cuando diaReto >= dia", () => {
    expect(cumpleCondicion({ tipo: "hito", dia: 38 }, ctx({ diaReto: 40 }))).toBe(true);
    expect(cumpleCondicion({ tipo: "hito", dia: 38 }, ctx({ diaReto: 37 }))).toBe(false);
  });

  it("nivel: desbloquea cuando nivel >= n", () => {
    expect(cumpleCondicion({ tipo: "nivel", nivel: 5 }, ctx({ nivel: 6 }))).toBe(true);
    expect(cumpleCondicion({ tipo: "nivel", nivel: 5 }, ctx({ nivel: 4 }))).toBe(false);
  });

  it("logro: desbloquea cuando el logro está obtenido", () => {
    expect(cumpleCondicion({ tipo: "logro", logroId: "biblioteca" }, ctx({ logros: ["biblioteca"] }))).toBe(true);
    expect(cumpleCondicion({ tipo: "logro", logroId: "biblioteca" }, ctx({ logros: [] }))).toBe(false);
  });
});

describe("chequearOutfits", () => {
  it("por hito: el día 38 desbloquea la armadura ember; la legendaria (75) no", () => {
    const nuevas = chequearOutfits(ctx({ diaReto: 38 }));
    expect(nuevas).toContain("ember");
    expect(nuevas).not.toContain("gold");
    expect(nuevas).not.toContain("corona");
  });

  it("el día 75 desbloquea la legendaria y la corona", () => {
    const nuevas = chequearOutfits(ctx({ diaReto: 75 }));
    expect(nuevas).toEqual(expect.arrayContaining(["gold", "corona"]));
  });

  it("no re-desbloquea las yaDesbloqueadas (permanentes)", () => {
    const nuevas = chequearOutfits(ctx({ diaReto: 75, yaDesbloqueadas: ["ember", "gold"] }));
    expect(nuevas).not.toContain("ember");
    expect(nuevas).not.toContain("gold");
    expect(nuevas).toContain("corona");
  });

  it("el set base (día 1) se desbloquea desde el arranque", () => {
    const nuevas = chequearOutfits(ctx({ diaReto: 1 }));
    expect(nuevas).toEqual(expect.arrayContaining(["tee", "corto", "none"]));
    expect(nuevas).not.toContain("chongo"); // unlockDay 14
  });
});
