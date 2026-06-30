"use client";

// Barra de progreso del reto: día N/75 + intento.
import { usePactoStore } from "@/stores/usePactoStore";
import { RETO_DIAS } from "@/config/rules";

export function RetoBar() {
  const pacto = usePactoStore((s) => s.pacto);
  const dia = pacto?.retoDiaActual ?? 0;
  const intento = pacto?.intentoActual ?? 1;
  const pct = Math.min(100, Math.round((dia / RETO_DIAS) * 100));

  return (
    <div className="border-4 border-ink bg-cloud p-3 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-press text-xs text-ink">
          DÍA {dia}/{RETO_DIAS}
        </span>
        <span className="font-silk text-xs text-ink/70">INTENTO #{intento}</span>
      </div>
      <div className="h-5 w-full border-2 border-ink bg-sky">
        <div
          className="h-full bg-pipe transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
