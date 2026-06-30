// Eventos transitorios para el avatar vivo de /hoy: reacción al marcar una
// misión (saltito + icono + destello) y celebración al cerrar día perfecto.
import { create } from "zustand";
import type { MisionId } from "@/config/rules";

interface AvatarFxState {
  reaccion: { misionId: MisionId; nonce: number } | null;
  celebracionNonce: number;
  reacciona: (misionId: MisionId) => void;
  celebra: () => void;
}

export const useAvatarFxStore = create<AvatarFxState>((set) => ({
  reaccion: null,
  celebracionNonce: 0,
  reacciona: (misionId) =>
    set((s) => ({ reaccion: { misionId, nonce: (s.reaccion?.nonce ?? 0) + 1 } })),
  celebra: () => set((s) => ({ celebracionNonce: s.celebracionNonce + 1 })),
}));
