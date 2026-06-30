// Arranque al login de ambos: al entrar un jugador, crea su Player desde cero
// (si no existe) y marca su entrada en el pacto. Cuando ambos entraron, el reto
// pasa a 'activo' (día 1). Usa el adapter (real en producción).
import { adapter } from "@/lib/firebase/adapter";
import { WARDROBE } from "@/config/wardrobe";
import type { Player } from "@/lib/schemas";

type Jugador = "gio" | "jenni";

const NOMBRE: Record<Jugador, string> = { gio: "Gio", jenni: "Jenni" };
const AVATAR: Record<Jugador, Player["avatar"]> = {
  gio: { pelo: "corto", outfit: "chaleco", accesorio: "lentes_sol" },
  jenni: { pelo: "largo", outfit: "topblanco", accesorio: "lentes_sol" },
};

const playerDesdeCero = (char: Jugador): Player => ({
  nombre: NOMBRE[char],
  nivel: 1,
  xp: 0,
  stats: { fuerza: 0, templanza: 0, vitalidad: 0, mente: 0, constancia: 0, vinculo: 0 },
  rachaReto: 0,
  avatar: AVATAR[char],
});

const baseWardrobe = (): string[] => WARDROBE.filter((p) => p.unlockDay <= 1).map((p) => p.id);

export async function seedAlEntrar(char: Jugador): Promise<void> {
  // 1) Player desde cero si no existe + set base de vestidor desbloqueado.
  const existente = await adapter.getPlayer(char);
  if (!existente) {
    await adapter.updatePlayerCache(char, playerDesdeCero(char));
    await adapter.unlockWardrobe(char, baseWardrobe());
  }

  // 2) Marca su entrada en el pacto; arranca el reto si ya entraron los dos.
  const pacto = await adapter.getPacto();
  const haEntrado = { gio: false, jenni: false, ...(pacto.haEntrado ?? {}), [char]: true };
  const jugadores = Array.from(new Set([...pacto.jugadores, char]));
  const ambos = haEntrado.gio && haEntrado.jenni;
  const arranca = ambos && pacto.retoEstado === "pendiente";

  await adapter.updatePacto({
    ...pacto,
    jugadores,
    haEntrado,
    ...(arranca
      ? { retoEstado: "activo" as const, retoInicio: Date.now(), retoDiaActual: 1 }
      : {}),
  });
}
