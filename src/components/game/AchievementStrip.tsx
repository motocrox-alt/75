"use client";

// Tira de logros (Personaje): reusa AchievementCard en modo compact.
import { AchievementCard } from "@/components/game/AchievementCard";
import { LOGROS } from "@/config/achievements";

export function AchievementStrip({ desbloqueados }: { desbloqueados: string[] }) {
  const set = new Set(desbloqueados);
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {LOGROS.map((logro) => (
        <AchievementCard key={logro.id} logro={logro} desbloqueado={set.has(logro.id)} compact />
      ))}
    </div>
  );
}
