// Pacto (reto compartido). Lee del adapter.
import { create } from "zustand";
import { adapter } from "@/lib/firebase/adapter";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Pacto } from "@/lib/schemas";

type EstadoReto = "pendiente" | "activo" | "completado";

interface PactoState {
  pacto: Pacto | null;
  cargar: () => Promise<void>;
  /** pendiente hasta que ambos entraron; respeta 'completado'. */
  estadoReto: () => EstadoReto;
}

export const usePactoStore = create<PactoState>((set, get) => ({
  pacto: null,
  cargar: async () => {
    const pacto = await adapter.getPacto();
    set({ pacto });
  },
  estadoReto: () => {
    const { pacto } = get();
    if (pacto?.retoEstado === "completado") return "completado";
    // En real manda pacto.haEntrado; en mock, el authStore (ambos true).
    const ha = pacto?.haEntrado ?? useAuthStore.getState().haEntrado;
    const ambos = ha.gio && ha.jenni;
    return ambos ? "activo" : "pendiente";
  },
}));
