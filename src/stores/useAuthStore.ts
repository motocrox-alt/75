// Auth mock: quién está logueado y quién ya entró alguna vez.
// Estado solo en memoria (sin localStorage) — al recargar vuelve al login.
import { create } from "zustand";

export type Jugador = "gio" | "jenni";

interface AuthState {
  jugadorActual: Jugador | null;
  /** Quién ya entró al menos una vez (decide si el reto arranca). */
  haEntrado: Record<Jugador, boolean>;
  login: (j: Jugador) => void;
  logout: () => void;
}

// Semilla del día 40: ambos jugadores ya se unieron al pacto → reto activo.
const HA_ENTRADO_SEED: Record<Jugador, boolean> = { gio: true, jenni: true };

export const useAuthStore = create<AuthState>((set) => ({
  jugadorActual: null,
  haEntrado: { ...HA_ENTRADO_SEED },
  login: (j) =>
    set((s) => ({
      jugadorActual: j,
      haEntrado: { ...s.haEntrado, [j]: true },
    })),
  logout: () => set({ jugadorActual: null }),
}));
