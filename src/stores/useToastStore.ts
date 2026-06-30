// Toast efímero (un mensaje a la vez). UI global ligera.
import { create } from "zustand";

interface ToastState {
  mensaje: string | null;
  /** Cambia en cada show para reiniciar el temporizador aunque el texto repita. */
  nonce: number;
  show: (m: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  mensaje: null,
  nonce: 0,
  show: (m) => set((s) => ({ mensaje: m, nonce: s.nonce + 1 })),
  clear: () => set({ mensaje: null }),
}));
