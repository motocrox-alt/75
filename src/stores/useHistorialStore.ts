// Intentos del reto (append-only, mock).
import { create } from "zustand";
import { adapter } from "@/lib/firebase/adapter";
import type { Intento } from "@/lib/schemas";

interface HistorialState {
  intentos: Intento[];
  cargar: () => Promise<void>;
}

export const useHistorialStore = create<HistorialState>((set) => ({
  intentos: [],
  cargar: async () => {
    const intentos = await adapter.getIntentos();
    set({ intentos });
  },
}));
