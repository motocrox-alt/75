// Compañero (read-only): player + dayLog de hoy + logros del OTRO jugador.
// Dominio separado de usePlayerStore (ese es el jugador actual). Sin mutadores.
import { create } from "zustand";
import { adapter } from "@/lib/firebase/adapter";
import { useAuthStore, type Jugador } from "@/stores/useAuthStore";
import { hoyKey } from "@/lib/utils/date";
import type { Player, DayLog } from "@/lib/schemas";

const otroDe = (j: Jugador): Jugador => (j === "gio" ? "jenni" : "gio");

interface PartnerState {
  partner: Player | null;
  partnerDay: DayLog | null;
  partnerLogros: string[];
  uidPartner: () => Jugador | null;
  cargar: () => Promise<void>;
}

export const usePartnerStore = create<PartnerState>((set, get) => ({
  partner: null,
  partnerDay: null,
  partnerLogros: [],

  uidPartner: () => {
    const j = useAuthStore.getState().jugadorActual;
    return j ? otroDe(j) : null;
  },

  cargar: async () => {
    const uid = get().uidPartner();
    if (!uid) return;
    const [partner, partnerDay, partnerLogros] = await Promise.all([
      adapter.getPlayer(uid),
      adapter.getDayLog(uid, hoyKey()),
      adapter.getAchievements(uid),
    ]);
    set({ partner, partnerDay, partnerLogros });
  },
}));
