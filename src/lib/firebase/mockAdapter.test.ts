import { describe, it, expect } from "vitest";
import { mockAdapter } from "@/lib/firebase/mockAdapter";
import { hoyKey } from "@/lib/utils/date";
import { cerrarDiaCompleto, type EntradaCierre } from "@/lib/game/cerrarDiaCompleto";
import type { ContextoLogros } from "@/lib/game/achievements";
import { diaCerradoSimple } from "@/lib/dia";

// Recorre el ciclo de cierre como lo hace useCierreStore (sin React) para
// verificar la persistencia append-only y que el calendario refleje el cierre.
describe("integración: cerrar día vía mockAdapter", () => {
  it("persiste XP/logros y el calendario marca hoy como cerrado", async () => {
    const uid = "gio";
    const dayKey = hoyKey();

    const player0 = await mockAdapter.getPlayer(uid);
    const pacto = await mockAdapter.getPacto();
    const micro = await mockAdapter.getMicroRachas(uid);
    const yaLogros = await mockAdapter.getAchievements(uid);
    const yaOutfits = await mockAdapter.getWardrobeIds(uid);
    const log = await mockAdapter.getDayLog(uid, dayKey);
    const otroLog = await mockAdapter.getDayLog("jenni", dayKey);
    expect(player0 && log).toBeTruthy();
    if (!player0 || !log) return;

    const contextoLogros: ContextoLogros = {
      diaReto: pacto.retoDiaActual,
      rachaReto: player0.rachaReto,
      microRachaAgua: micro["agua"]?.dias ?? 0,
      paginasTotales: 480,
      primerFindeChelaHecho: true,
      sincroniaCount: 8,
      retoCompletado: false,
      yaDesbloqueados: yaLogros,
    };

    const entrada: EntradaCierre = {
      player: player0,
      log,
      pacto,
      microRachas: micro,
      contextoLogros,
      yaOutfits,
      ts: 123,
    };

    const out = cerrarDiaCompleto(entrada, diaCerradoSimple(otroLog));

    // Persistencia (como el store)
    await mockAdapter.appendXpLog(uid, out.xpLogEntries);
    await mockAdapter.updatePlayerCache(uid, out.player);
    await mockAdapter.setMicroRachas(uid, out.microRachas);
    if (out.logrosNuevos.length) await mockAdapter.unlockAchievements(uid, out.logrosNuevos);
    await mockAdapter.setDayLog(uid, dayKey, {
      ...log,
      cerrado: true,
      perfecto: out.perfecto,
      xpGanado: out.xpGanado,
    });

    // El compañero estaba completo → sin reinicio
    expect(out.reinicio.hay).toBe(false);

    // XP subió y persiste en el cache
    const player1 = await mockAdapter.getPlayer(uid);
    expect(player1?.xp).toBe(out.player.xp);
    expect(player1!.xp).toBeGreaterThan(player0.xp);
    expect(out.subioNivel).toBe(true);

    // Logro 'hidratado' desbloqueado y persistido (agua 29 → 30)
    expect(out.logrosNuevos).toContain("hidratado");
    const logros1 = await mockAdapter.getAchievements(uid);
    expect(logros1).toContain("hidratado");

    // El calendario refleja el día de hoy ya cerrado
    const dias = await mockAdapter.getRetoDias(uid);
    const hoy = dias[pacto.retoDiaActual - 1];
    expect(["cumplido", "perfecto"]).toContain(hoy.estado);
  });
});
