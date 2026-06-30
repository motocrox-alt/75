"use client";

// Pareja: vista read-only del compañero + Vínculo + sincronía + chela del finde.
// Corazón co-op de la app. UI sobre mock (sin engine real).
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useDayStore } from "@/stores/useDayStore";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { hoyKey } from "@/lib/utils/date";
import { PairView } from "@/components/partner/PairView";
import { BondPanel } from "@/components/partner/BondPanel";
import { SyncIndicator } from "@/components/partner/SyncIndicator";
import { PartnerCard } from "@/components/partner/PartnerCard";
import { ChelaMission } from "@/components/game/ChelaMission";
import { PixelIcon } from "@/components/game/PixelIcon";

export default function ParejaPage() {
  const jugador = useAuthStore((s) => s.jugadorActual);

  const log = useDayStore((s) => s.log);
  const cargarDia = useDayStore((s) => s.cargar);
  const setParejaChelaOk = useDayStore((s) => s.setParejaChelaOk);

  const cargarPartner = usePartnerStore((s) => s.cargar);
  const partner = usePartnerStore((s) => s.partner);
  const partnerDay = usePartnerStore((s) => s.partnerDay);

  // Día del jugador actual (para sincronía + confirmación de chela).
  useEffect(() => {
    if (jugador) cargarDia(jugador, hoyKey());
  }, [jugador, cargarDia]);

  // Compañero (read-only).
  useEffect(() => {
    if (jugador) cargarPartner();
  }, [jugador, cargarPartner]);

  // Confirmación de la chela del compañero → al day store (regla de pareja).
  useEffect(() => {
    setParejaChelaOk(partnerDay?.misiones.chela.ok ?? false);
  }, [partnerDay, setParejaChelaOk]);

  if (!jugador || !log) {
    return <p className="font-silk text-ink/60">Cargando…</p>;
  }

  const finde = log.misiones.chela.tipo === "juntitos";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <PairView />
      <BondPanel />
      <SyncIndicator />
      <PartnerCard />

      {/* Chela del finde (acción de pareja) o recordatorio entre semana */}
      <div className="border-4 border-ink bg-coin px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <h2 className="font-press text-xs text-ink">CHELA DEL FINDE</h2>
      </div>

      {finde ? (
        <ChelaMission otroNombre={partner?.nombre ?? "tu pareja"} />
      ) : (
        <div className="flex items-center gap-3 border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-sky">
            <PixelIcon name="mug" scale={2} />
          </span>
          <span className="font-body text-sm text-ink/70">
            La chela es solo de fin de semana, juntitos 🍺
          </span>
        </div>
      )}
    </div>
  );
}
