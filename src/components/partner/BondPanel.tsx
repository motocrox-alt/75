"use client";

// Barra de Vínculo compartida (del pacto). Reusa la curva de nivel.
import { PixelIcon } from "@/components/game/PixelIcon";
import { usePactoStore } from "@/stores/usePactoStore";
import { progresoNivel } from "@/config/leveling";

export function BondPanel() {
  const pacto = usePactoStore((s) => s.pacto);
  const nivel = pacto?.vinculoNivel ?? 1;
  const xp = pacto?.vinculoXp ?? 0;
  const pct = Math.round(progresoNivel(xp) * 100);

  return (
    <div className="flex items-center gap-4 border-4 border-ink bg-pipe p-4 text-cream shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <div className="shrink-0 border-2 border-ink bg-pipe-dk p-1.5">
        <PixelIcon name="heart" scale={3} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="font-press text-[11px] text-cloud">VÍNCULO · NIVEL {nivel}</span>
        <div className="h-4 w-full border-2 border-ink bg-pipe-dk">
          <div className="h-full bg-coin transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <span className="font-body text-[11px] text-cream/90">
          El Vínculo sube cuando los dos cierran el día y con la cerveza del finde.
        </span>
      </div>
    </div>
  );
}
