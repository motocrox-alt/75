// Auth: mock (dos tarjetas) o Firebase real (email+password), según USE_MOCK.
// 'listo' = la sesión ya se resolvió (para no parpadear al login en recargas).
import { create } from "zustand";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { USE_MOCK } from "@/lib/firebase/adapter";
import { firebaseAuth, charDeEmail } from "@/lib/firebase/config";
import { seedAlEntrar } from "@/lib/firebase/authFlow";

export type Jugador = "gio" | "jenni";

interface AuthState {
  jugadorActual: Jugador | null;
  haEntrado: Record<Jugador, boolean>; // solo mock; en real manda pacto.haEntrado
  listo: boolean;
  login: (j: Jugador) => void; // mock
  entrar: (email: string, password: string) => Promise<string | null>; // real
  logout: () => void;
  escuchar: () => void; // real: restaura la sesión
}

// Semilla mock: ambos ya entraron → reto activo.
const HA_ENTRADO_SEED: Record<Jugador, boolean> = { gio: true, jenni: true };

let suscrito = false;

export const useAuthStore = create<AuthState>((set) => ({
  jugadorActual: null,
  haEntrado: { ...HA_ENTRADO_SEED },
  listo: USE_MOCK, // en mock no hay nada que resolver

  login: (j) =>
    set((s) => ({ jugadorActual: j, haEntrado: { ...s.haEntrado, [j]: true } })),

  entrar: async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(firebaseAuth(), email.trim(), password);
      const char = charDeEmail(cred.user.email);
      if (!char) {
        await signOut(firebaseAuth());
        return "Esta cuenta no está registrada como Gio ni Jenni.";
      }
      await seedAlEntrar(char);
      set({ jugadorActual: char, listo: true });
      return null;
    } catch {
      return "Correo o contraseña incorrectos.";
    }
  },

  logout: () => {
    if (!USE_MOCK) {
      try {
        void signOut(firebaseAuth());
      } catch {
        /* no-op */
      }
    }
    set({ jugadorActual: null });
  },

  escuchar: () => {
    if (USE_MOCK || suscrito) {
      set({ listo: true });
      return;
    }
    suscrito = true;
    onAuthStateChanged(firebaseAuth(), (user) => {
      set({ jugadorActual: charDeEmail(user?.email), listo: true });
    });
  },
}));
