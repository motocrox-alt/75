"use client";

// Celda del heatmap: número de día sobre el color de su estado.
import { PixelIcon } from "@/components/game/PixelIcon";
import type { DiaEstado } from "@/lib/schemas";

const ESTILO: Record<DiaEstado["estado"], string> = {
  perfecto: "bg-coin text-ink",
  cumplido: "bg-pipe text-cloud",
  fallido: "bg-mario text-cloud",
  hoy: "bg-cloud text-ink ring-2 ring-coin",
  futuro: "bg-sky/30 text-ink/40",
};

export function DayCell({
  dia,
  seleccionado,
  onClick,
}: {
  dia: DiaEstado;
  seleccionado: boolean;
  onClick: () => void;
}) {
  const esHoy = dia.estado === "hoy";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Día ${dia.dia} (${dia.estado})`}
      className={`relative flex aspect-square items-center justify-center font-press text-[10px] shadow-[2px_2px_0_rgba(0,0,0,0.3)] ${
        esHoy ? "border-4" : "border-2"
      } border-ink ${ESTILO[dia.estado]} ${
        seleccionado ? "outline outline-2 outline-mario outline-offset-2" : ""
      }`}
    >
      {dia.dia}
      {dia.estado === "perfecto" && (
        <span className="absolute -right-1 -top-1">
          <PixelIcon name="star" scale={1} />
        </span>
      )}
    </button>
  );
}
