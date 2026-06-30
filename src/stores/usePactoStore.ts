// Pacto (reto compartido). Lee del mockAdapter.
import { create } from "zustand";
import { mockAdapter } from "@/lib/firebase/mockAdapter";
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
    const pacto = await mockAdapter.getPacto();
    set({ pacto });
  },
  estadoReto: () => {
    const { pacto } = get();
    if (pacto?.retoEstado === "completado") return "completado";
    const { haEntrado } = useAuthStore.getState();
    const ambos = haEntrado.gio && haEntrado.jenni;
    return ambos ? "activo" : "pendiente";
  },
}));
