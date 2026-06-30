// Player del jugador logueado (cache denormalizado). Lee del mockAdapter.
import { create } from "zustand";
import { mockAdapter } from "@/lib/firebase/mockAdapter";
import type { Player, AvatarSlots } from "@/lib/schemas";

interface PlayerState {
  player: Player | null;
  cargar: (uid: string) => Promise<void>;
  /** Refleja en el cache común un cambio de avatar (header + personaje). */
  equiparAvatar: (avatar: AvatarSlots) => void;
  /** Cambia el nombre (memoria + persiste en mock). */
  setNombre: (uid: string, nombre: string) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  player: null,
  cargar: async (uid) => {
    const player = await mockAdapter.getPlayer(uid);
    set({ player });
  },
  equiparAvatar: (avatar) =>
    set((s) => (s.player ? { player: { ...s.player, avatar } } : s)),
  setNombre: (uid, nombre) => {
    set((s) => (s.player ? { player: { ...s.player, nombre } } : s));
    void mockAdapter.setNombre(uid, nombre);
  },
}));
