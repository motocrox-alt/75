// Logros desbloqueados del jugador actual (mock). Compartido por la galería
// (/logros) y la tira de Personaje.
import { create } from "zustand";
import { mockAdapter } from "@/lib/firebase/mockAdapter";

interface AchievementsState {
  desbloqueados: string[];
  cargar: (uid: string) => Promise<void>;
}

export const useAchievementsStore = create<AchievementsState>((set) => ({
  desbloqueados: [],
  cargar: async (uid) => {
    const desbloqueados = await mockAdapter.getAchievements(uid);
    set({ desbloqueados });
  },
}));
