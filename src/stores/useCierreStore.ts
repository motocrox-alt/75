// Orquesta el cierre del día: arma la entrada desde el mock, invoca el engine
// puro (cerrarDiaCompleto), PERSISTE el resultado (append-only) y sincroniza
// los stores afectados. Guarda el resultado para la secuencia de recompensas.
import { create } from "zustand";
import { mockAdapter } from "@/lib/firebase/mockAdapter";
import { hoyKey } from "@/lib/utils/date";
import { diaCerradoSimple } from "@/lib/dia";
import { cerrarDiaCompleto, type EntradaCierre, type SalidaCierre } from "@/lib/game/cerrarDiaCompleto";
import type { ContextoLogros } from "@/lib/game/achievements";
import { useAuthStore, type Jugador } from "@/stores/useAuthStore";
import { useDayStore } from "@/stores/useDayStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { usePactoStore } from "@/stores/usePactoStore";
import { useAchievementsStore } from "@/stores/useAchievementsStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";

const otroDe = (j: Jugador): Jugador => (j === "gio" ? "jenni" : "gio");

interface CierreState {
  resultado: SalidaCierre | null;
  cerrando: boolean;
  cerrarDia: () => Promise<void>;
  limpiar: () => void;
}

export const useCierreStore = create<CierreState>((set) => ({
  resultado: null,
  cerrando: false,

  cerrarDia: async () => {
    const jugador = useAuthStore.getState().jugadorActual;
    const log = useDayStore.getState().log;
    if (!jugador || !log || log.cerrado) return; // idempotente

    set({ cerrando: true });
    const dayKey = hoyKey();
    const otro = otroDe(jugador);

    const [player, pacto, microRachas, yaLogros, yaOutfits, otroLog] = await Promise.all([
      mockAdapter.getPlayer(jugador),
      mockAdapter.getPacto(),
      mockAdapter.getMicroRachas(jugador),
      mockAdapter.getAchievements(jugador),
      mockAdapter.getWardrobeIds(jugador),
      mockAdapter.getDayLog(otro, dayKey),
    ]);

    if (!player || !pacto) {
      set({ cerrando: false });
      return;
    }

    const cumplidoCompañero = diaCerradoSimple(otroLog);

    // Datos del contexto de logros que el mock no deriva por completo (aprox.).
    const contextoLogros: ContextoLogros = {
      diaReto: pacto.retoDiaActual,
      rachaReto: player.rachaReto,
      microRachaAgua: microRachas["agua"]?.dias ?? 0,
      paginasTotales: 480,
      primerFindeChelaHecho: true,
      sincroniaCount: 8,
      retoCompletado: false,
      yaDesbloqueados: yaLogros,
    };

    const entrada: EntradaCierre = {
      player,
      log,
      pacto,
      microRachas,
      contextoLogros,
      yaOutfits,
      ts: Date.now(),
    };

    const out = cerrarDiaCompleto(entrada, cumplidoCompañero);

    // ── Persistencia (append-only + caches) ──
    await mockAdapter.appendXpLog(jugador, out.xpLogEntries);
    await mockAdapter.updatePlayerCache(jugador, out.player);
    await mockAdapter.setMicroRachas(jugador, out.microRachas);
    if (out.logrosNuevos.length) await mockAdapter.unlockAchievements(jugador, out.logrosNuevos);
    if (out.outfitsNuevos.length) await mockAdapter.unlockWardrobe(jugador, out.outfitsNuevos);

    const logCerrado = { ...log, cerrado: true, perfecto: out.perfecto, xpGanado: out.xpGanado };
    await mockAdapter.setDayLog(jugador, dayKey, logCerrado);

    if (out.reinicio.hay && out.reinicio.pactoNuevo && out.reinicio.intentoCerrado) {
      await mockAdapter.appendIntento(out.reinicio.intentoCerrado);
      await mockAdapter.updatePacto(out.reinicio.pactoNuevo);
    }

    // ── Sincroniza los stores afectados ──
    usePlayerStore.setState({ player: out.player });
    useDayStore.setState({ log: logCerrado });
    useWardrobeStore.getState().agregar(out.outfitsNuevos);
    await useAchievementsStore.getState().cargar(jugador);
    await usePactoStore.getState().cargar();

    set({ resultado: out, cerrando: false });
  },

  limpiar: () => set({ resultado: null }),
}));
