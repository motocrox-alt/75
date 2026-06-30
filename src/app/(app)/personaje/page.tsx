"use client";

// Ficha RPG del jugador: avatar grande, nivel/XP, 6 stats (barras + radar),
// racha y logros. UI sobre datos del mock (sin engine real).
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { usePactoStore } from "@/stores/usePactoStore";
import { useAchievementsStore } from "@/stores/useAchievementsStore";
import { xpParaNivel, progresoNivel } from "@/config/leveling";
import { RETO_DIAS } from "@/config/rules";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { StatBars } from "@/components/charts/StatBars";
import { StatRadar } from "@/components/charts/StatRadar";
import { AchievementStrip } from "@/components/game/AchievementStrip";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-4 border-ink bg-coin px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <h2 className="font-press text-xs text-ink">{children}</h2>
    </div>
  );
}

export default function PersonajePage() {
  const jugador = useAuthStore((s) => s.jugadorActual);
  const player = usePlayerStore((s) => s.player);
  const cargarPlayer = usePlayerStore((s) => s.cargar);
  const pacto = usePactoStore((s) => s.pacto);

  const logros = useAchievementsStore((s) => s.desbloqueados);
  const cargarLogros = useAchievementsStore((s) => s.cargar);

  useEffect(() => {
    if (jugador) cargarPlayer(jugador);
  }, [jugador, cargarPlayer]);

  useEffect(() => {
    if (jugador) cargarLogros(jugador);
  }, [jugador, cargarLogros]);

  if (!jugador || !player) {
    return <p className="font-silk text-ink/60">Cargando…</p>;
  }

  const lo = xpParaNivel(player.nivel);
  const hi = xpParaNivel(player.nivel + 1);
  const cur = Math.max(0, Math.round(player.xp - lo));
  const tot = Math.max(1, Math.round(hi - lo));
  const pct = Math.round(progresoNivel(player.xp) * 100);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      {/* Bloque héroe */}
      <div className="flex flex-col items-center gap-4 border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)] sm:flex-row sm:items-stretch">
        <div className="shrink-0 border-4 border-ink bg-sky p-2">
          <AvatarCanvas char={jugador} avatar={player.avatar} scale={11} />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 text-center sm:text-left">
          <span className="font-press text-base text-ink">{player.nombre}</span>
          <span className="font-silk text-sm text-ink/70">NIVEL {player.nivel}</span>
          <div className="h-5 w-full border-2 border-ink bg-sky">
            <div
              className="h-full bg-coin transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-silk text-[11px] text-ink/60">
            XP {cur} / {tot}
          </span>
          <span className="mt-1 font-silk text-[11px] text-ink">
            🔥 Racha: {player.rachaReto} días · Día {pacto?.retoDiaActual ?? "–"}/{RETO_DIAS} ·
            Intento #{pacto?.intentoActual ?? "–"}
          </span>
        </div>
      </div>

      {/* Stats */}
      <SectionTitle>STATS</SectionTitle>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
          <StatBars stats={player.stats} />
        </div>
        <div className="border-4 border-ink bg-cloud p-2 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
          <StatRadar stats={player.stats} />
        </div>
      </div>

      {/* Logros */}
      <SectionTitle>LOGROS</SectionTitle>
      <AchievementStrip desbloqueados={logros} />
    </div>
  );
}
