// Logros desbloqueados del jugador actual (mock). Compartido por la galería
// (/logros) y la tira de Personaje.
import { create } from "zustand";
import { adapter } from "@/lib/firebase/adapter";

interface AchievementsState {
  desbloqueados: string[];
  cargar: (uid: string) => Promise<void>;
}

export const useAchievementsStore = create<AchievementsState>((set) => ({
  desbloqueados: [],
  cargar: async (uid) => {
    const desbloqueados = await adapter.getAchievements(uid);
    set({ desbloqueados });
  },
}));
