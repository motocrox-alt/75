"use client";

// Cuadrícula de los 75 días.
import { DayCell } from "@/components/calendar/DayCell";
import { useCalendarStore } from "@/stores/useCalendarStore";

export function CalendarGrid() {
  const dias = useCalendarStore((s) => s.dias);
  const diaSel = useCalendarStore((s) => s.diaSel);
  const seleccionar = useCalendarStore((s) => s.seleccionar);

  return (
    <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-10 lg:grid-cols-[repeat(15,minmax(0,1fr))]">
      {dias.map((d) => (
        <DayCell
          key={d.dia}
          dia={d}
          seleccionado={diaSel === d.dia}
          onClick={() => seleccionar(d.dia)}
        />
      ))}
    </div>
  );
}
