"use client";

// Vista read-only del compañero: avatar, nivel, racha, avance de hoy.
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { usePartnerStore } from "@/stores/usePartnerStore";
import { contarObligatorias, diaCerradoSimple, TOTAL_OBLIGATORIAS } from "@/lib/dia";

export function PartnerCard() {
  const partner = usePartnerStore((s) => s.partner);
  const partnerDay = usePartnerStore((s) => s.partnerDay);
  const uid = usePartnerStore((s) => s.uidPartner());

  if (!partner || !uid) return null;

  const avance = contarObligatorias(partnerDay);
  const cerrado = diaCerradoSimple(partnerDay);

  return (
    <div className="flex items-center gap-4 border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <div className="shrink-0 border-2 border-ink bg-sky p-1">
        <AvatarCanvas char={uid} avatar={partner.avatar} scale={4} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="font-press text-sm text-ink">{partner.nombre}</span>
        <span className="font-silk text-xs text-ink/70">NIVEL {partner.nivel}</span>
        <span className="font-silk text-[11px] text-ink/70">🔥 Racha: {partner.rachaReto} días</span>
        <span className="font-silk text-[11px] text-ink">
          HOY: {avance}/{TOTAL_OBLIGATORIAS} ✓
        </span>
        <span
          className={`mt-1 w-fit border-2 border-ink px-2 py-0.5 font-silk text-[10px] ${
            cerrado ? "bg-pipe text-cloud" : "bg-coin text-ink"
          }`}
        >
          {cerrado ? "Día cerrado" : "En progreso"}
        </span>
      </div>
    </div>
  );
}
