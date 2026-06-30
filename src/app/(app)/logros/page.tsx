"use client";

// Galería de logros: contador + grid de todo el catálogo (desbloqueados primero).
import { useEffect, useMemo } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAchievementsStore } from "@/stores/useAchievementsStore";
import { AchievementsProgress } from "@/components/game/AchievementsProgress";
import { AchievementCard } from "@/components/game/AchievementCard";
import { LOGROS } from "@/config/achievements";

export default function LogrosPage() {
  const jugador = useAuthStore((s) => s.jugadorActual);
  const desbloqueados = useAchievementsStore((s) => s.desbloqueados);
  const cargar = useAchievementsStore((s) => s.cargar);

  useEffect(() => {
    if (jugador) cargar(jugador);
  }, [jugador, cargar]);

  const set = useMemo(() => new Set(desbloqueados), [desbloqueados]);
  // Desbloqueados primero, conservando el orden del catálogo en cada grupo.
  const ordenados = useMemo(
    () => [...LOGROS].sort((a, b) => Number(set.has(b.id)) - Number(set.has(a.id))),
    [set],
  );

  if (!jugador) {
    return <p className="font-silk text-ink/60">Cargando…</p>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <AchievementsProgress desbloqueados={desbloqueados.length} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {ordenados.map((logro) => (
          <AchievementCard key={logro.id} logro={logro} desbloqueado={set.has(logro.id)} />
        ))}
      </div>
    </div>
  );
}
