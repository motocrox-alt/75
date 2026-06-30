// Avatar equipado del jugador actual + preview del vestidor (mock).
// Fuente común = player mock; al equipar persiste y sincroniza usePlayerStore.
import { create } from "zustand";
import { adapter } from "@/lib/firebase/adapter";
import { usePlayerStore } from "@/stores/usePlayerStore";
import type { AvatarSlots } from "@/lib/schemas";

type SlotAvatar = "pelo" | "outfit" | "accesorio";

interface AvatarState {
  avatar: AvatarSlots | null;
  _uid: string | null;
  cargar: (uid: string) => Promise<void>;
  equipar: (slot: SlotAvatar, pieceId: string) => void;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  avatar: null,
  _uid: null,

  cargar: async (uid) => {
    const player = await adapter.getPlayer(uid);
    set({ avatar: player?.avatar ?? null, _uid: uid });
  },

  equipar: (slot, pieceId) => {
    const { avatar, _uid } = get();
    if (!avatar || !_uid) return;
    const nuevo: AvatarSlots = { ...avatar, [slot]: pieceId };
    set({ avatar: nuevo });
    void adapter.setAvatar(_uid, nuevo);
    // Sincroniza el cache común para header y /personaje.
    usePlayerStore.getState().equiparAvatar(nuevo);
  },
}));
