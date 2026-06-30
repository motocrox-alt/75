// Catálogo de logros (solo datos en Fase 0; la evaluación es Fase B).
import type { ICONS } from "./sprites/sprites";

export interface Logro {
  id: string;
  nombre: string;
  icono: keyof typeof ICONS;
  desc: string;
}

export const LOGROS: Logro[] = [
  { id: "primer_paso", nombre: "Primer paso", icono: "star", desc: "Cierra el día 1" },
  { id: "primera_semana", nombre: "La primera semana", icono: "star", desc: "7 días seguidos" },
  { id: "mitad", nombre: "Mitad del camino", icono: "chest", desc: "Llega al día 38" },
  { id: "hidratado", nombre: "Hidratado de acero", icono: "potion", desc: "30 días de agua sin fallar" },
  { id: "biblioteca", nombre: "Rata de biblioteca", icono: "book", desc: "750 páginas acumuladas" },
  { id: "ritual", nombre: "Ritual sagrado", icono: "mug", desc: "Primer finde con la cerveza juntitos" },
  { id: "sincronia", nombre: "Sincronía", icono: "heart", desc: "10 días los dos en verde el mismo día" },
  { id: "inquebrantables", nombre: "Inquebrantables", icono: "diamond", desc: "75 días completos (jefe final)" },
];
