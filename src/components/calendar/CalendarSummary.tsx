"use client";

// Resumen del reto: día/75, intento, días cumplidos, perfectos y racha.
import { useCalendarStore } from "@/stores/useCalendarStore";
import { usePactoStore } from "@/stores/usePactoStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { RETO_DIAS } from "@/config/rules";

export function CalendarSummary() {
  const dias = useCalendarStore((s) => s.dias);
  const pacto = usePactoStore((s) => s.pacto);
  const player = usePlayerStore((s) => s.player);

  const cumplidos = dias.filter((d) => d.estado === "cumplido" || d.estado === "perfecto").length;
  const perfectos = dias.filter((d) => d.estado === "perfecto").length;
  const dia = pacto?.retoDiaActual ?? 0;
  const intento = pacto?.intentoActual ?? 1;
  const racha = player?.rachaReto ?? 0;
  const pct = Math.min(100, Math.round((dia / RETO_DIAS) * 100));

  return (
    <div className="flex flex-col gap-3 border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <div className="flex items-baseline justify-between">
        <span className="font-press text-xs text-ink">
          DÍA {dia}/{RETO_DIAS}
        </span>
        <span className="font-silk text-xs text-ink/70">INTENTO #{intento}</span>
      </div>

      <div className="h-4 w-full border-2 border-ink bg-sky">
        <div className="h-full bg-pipe transition-[width] duration-500" style={{ width: `${pct}%` }} />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <Stat valor={cumplidos} label="Cumplidos" />
        <Stat valor={perfectos} label="Perfectos" />
        <Stat valor={`${racha}d`} label="Racha" />
      </div>
    </div>
  );
}

function Stat({ valor, label }: { valor: number | string; label: string }) {
  return (
    <div className="border-2 border-ink bg-sky/40 py-2">
      <div className="font-press text-sm text-ink">{valor}</div>
      <div className="font-silk text-[10px] text-ink/70">{label}</div>
    </div>
  );
}
