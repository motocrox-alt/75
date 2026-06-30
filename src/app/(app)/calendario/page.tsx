"use client";

// Calendario: heatmap de los 75 días + detalle por día. UI sobre mock.
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { CalendarSummary } from "@/components/calendar/CalendarSummary";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { DayDetail } from "@/components/calendar/DayDetail";

export default function CalendarioPage() {
  const jugador = useAuthStore((s) => s.jugadorActual);
  const cargar = useCalendarStore((s) => s.cargar);
  const dias = useCalendarStore((s) => s.dias);
  const seleccionar = useCalendarStore((s) => s.seleccionar);

  useEffect(() => {
    if (jugador) cargar(jugador);
  }, [jugador, cargar]);

  // Limpia la selección al cambiar de jugador / desmontar.
  useEffect(() => () => seleccionar(null), [seleccionar]);

  if (!jugador || dias.length === 0) {
    return <p className="font-silk text-ink/60">Cargando…</p>;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <CalendarSummary />

      <div className="border-4 border-ink bg-cloud p-3 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <CalendarGrid />
      </div>

      <DayDetail />
    </div>
  );
}
