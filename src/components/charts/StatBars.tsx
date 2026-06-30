"use client";

// Las 6 barras de stat (bloque NES): icono pixel + label + barra + valor.
import { motion, useReducedMotion } from "framer-motion";
import { PixelIcon } from "@/components/game/PixelIcon";
import { STATS_META, STAT_MAX } from "@/config/stats";
import { STAT_ICON } from "@/config/sprites/sprites";
import type { Stats } from "@/lib/schemas";

export function StatBars({ stats }: { stats: Stats }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex flex-col gap-2">
      {STATS_META.map((meta) => {
        const valor = stats[meta.id];
        const pct = Math.min(100, Math.round((valor / STAT_MAX) * 100));
        return (
          <div key={meta.id} className="flex items-center gap-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-sky">
              <PixelIcon name={STAT_ICON[meta.id]} scale={1} />
            </span>
            <span className="w-20 shrink-0 font-silk text-xs text-ink">{meta.label}</span>
            <div className="h-4 flex-1 border-2 border-ink bg-sky">
              <motion.div
                className="h-full"
                style={{ backgroundColor: meta.color }}
                initial={reduce ? false : { width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
              />
            </div>
            <span className="w-8 shrink-0 text-right font-press text-[10px] text-ink">
              {valor}
            </span>
          </div>
        );
      })}
    </div>
  );
}
