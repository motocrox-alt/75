"use client";

// Banner dinámico: faltan N → ¡Día cumplido! → ¡Día perfecto! +30 Vínculo.
import { PixelIcon } from "@/components/game/PixelIcon";
import { useDayStore } from "@/stores/useDayStore";

export function DayBanner() {
  const faltantes = useDayStore((s) => s.faltantes());
  const cerrado = useDayStore((s) => s.cerrado());
  const perfecto = useDayStore((s) => s.perfecto());

  if (perfecto) {
    return (
      <div className="flex items-center justify-center gap-2 border-4 border-ink bg-pipe p-3 text-cloud shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <PixelIcon name="star" scale={2} />
        <span className="font-press text-xs">¡DÍA PERFECTO! +30 VÍNCULO</span>
      </div>
    );
  }

  if (cerrado) {
    return (
      <div className="flex items-center justify-center gap-2 border-4 border-ink bg-coin p-3 text-ink shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <PixelIcon name="star" scale={2} />
        <span className="font-press text-xs">¡DÍA CUMPLIDO!</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center border-4 border-ink bg-coin p-3 text-ink shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <span className="font-press text-[10px]">
        FALTAN {faltantes} PARA CERRAR EL DÍA
      </span>
    </div>
  );
}
