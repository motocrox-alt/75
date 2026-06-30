"use client";

// Contador + barra de progreso de logros.
import { LOGROS } from "@/config/achievements";

export function AchievementsProgress({ desbloqueados }: { desbloqueados: number }) {
  const total = LOGROS.length;
  const pct = total === 0 ? 0 : Math.round((desbloqueados / total) * 100);

  return (
    <div className="border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-press text-xs text-ink">LOGROS</span>
        <span className="font-press text-xs text-ink">
          {desbloqueados}/{total}
        </span>
      </div>
      <div className="h-5 w-full border-2 border-ink bg-sky">
        <div className="h-full bg-coin transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
