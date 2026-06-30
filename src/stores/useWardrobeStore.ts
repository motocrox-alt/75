// Piezas desbloqueadas (ids) del jugador actual. Permanentes: no se pierden en
// reinicio. El Vestidor las usa además de la regla por día (hito).
import { create } from "zustand";
import { mockAdapter } from "@/lib/firebase/mockAdapter";

interface WardrobeState {
  ids: string[];
  cargar: (uid: string) => Promise<void>;
  agregar: (ids: string[]) => void;
}

export const useWardrobeStore = create<WardrobeState>((set) => ({
  ids: [],
  cargar: async (uid) => {
    const ids = await mockAdapter.getWardrobeIds(uid);
    set({ ids });
  },
  agregar: (nuevos) => set((s) => ({ ids: Array.from(new Set([...s.ids, ...nuevos])) })),
}));
