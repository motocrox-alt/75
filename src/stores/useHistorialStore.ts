// Intentos del reto (append-only, mock).
import { create } from "zustand";
import { mockAdapter } from "@/lib/firebase/mockAdapter";
import type { Intento } from "@/lib/schemas";

interface HistorialState {
  intentos: Intento[];
  cargar: () => Promise<void>;
}

export const useHistorialStore = create<HistorialState>((set) => ({
  intentos: [],
  cargar: async () => {
    const intentos = await mockAdapter.getIntentos();
    set({ intentos });
  },
}));
