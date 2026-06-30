"use client";

// Lista de intentos (cronológico: #1 arriba). Encabezado motivador.
import { IntentoCard } from "@/components/historial/IntentoCard";
import { useHistorialStore } from "@/stores/useHistorialStore";

export function HistorialView() {
  const intentos = useHistorialStore((s) => s.intentos);

  return (
    <div className="flex flex-col gap-4">
      <div className="border-4 border-ink bg-coin px-4 py-3 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <h2 className="font-press text-xs text-ink">SU CAMINO HASTA HOY</h2>
        <p className="mt-1 font-body text-xs text-ink/70">
          Cada intento es parte de la épica. Lo recorrido no se borra.
        </p>
      </div>

      {intentos.map((intento) => (
        <IntentoCard key={intento.numero} intento={intento} />
      ))}
    </div>
  );
}
