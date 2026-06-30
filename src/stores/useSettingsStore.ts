// Ajustes (solo memoria, sin localStorage ni notificaciones reales).
import { create } from "zustand";

interface SettingsState {
  recordatorios: boolean;
  recordatorioFoto: boolean;
  sonidos: boolean;
  set: (k: "recordatorios" | "recordatorioFoto" | "sonidos", v: boolean) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  recordatorios: true,
  recordatorioFoto: true,
  sonidos: false,
  set: (k, v) => set({ [k]: v } as Pick<SettingsState, typeof k>),
}));
