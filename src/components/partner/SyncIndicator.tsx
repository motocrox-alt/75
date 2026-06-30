"use client";

// Sincronía de hoy: ¿cerraron los dos el día en verde?
import { PixelIcon } from "@/components/game/PixelIcon";
import { useDayStore } from "@/stores/useDayStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { diaCerradoSimple } from "@/lib/dia";

export function SyncIndicator() {
  const yoCerre = useDayStore((s) => s.cerrado());
  const player = usePlayerStore((s) => s.player);
  const partner = usePartnerStore((s) => s.partner);
  const partnerDay = usePartnerStore((s) => s.partnerDay);

  const partnerCerro = diaCerradoSimple(partnerDay);
  const ambos = yoCerre && partnerCerro;

  if (ambos) {
    return (
      <div className="flex items-center justify-center gap-2 border-4 border-ink bg-pipe p-3 text-cloud shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <PixelIcon name="star" scale={2} />
        <span className="font-press text-[11px]">¡SINCRONÍA! LOS DOS CERRARON HOY</span>
      </div>
    );
  }

  const quienFalta = !yoCerre
    ? (player?.nombre ?? "tú")
    : (partner?.nombre ?? "tu pareja");

  return (
    <div className="flex items-center justify-center border-4 border-ink bg-coin p-3 text-ink shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <span className="font-press text-[10px]">SINCRONÍA PENDIENTE: FALTA {quienFalta.toUpperCase()}</span>
    </div>
  );
}
