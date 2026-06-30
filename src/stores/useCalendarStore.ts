// Heatmap del reto (mock). El detalle se selecciona solo por número de día
// (modal state = solo el id, regla CLAUDE.md).
import { create } from "zustand";
import { adapter } from "@/lib/firebase/adapter";
import type { DiaEstado } from "@/lib/schemas";

interface CalendarState {
  dias: DiaEstado[];
  diaSel: number | null;
  cargar: (uid: string) => Promise<void>;
  seleccionar: (dia: number | null) => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  dias: [],
  diaSel: null,
  cargar: async (uid) => {
    const dias = await adapter.getRetoDias(uid);
    set({ dias });
  },
  seleccionar: (dia) => set({ diaSel: dia }),
}));
