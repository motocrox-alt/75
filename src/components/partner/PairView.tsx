"use client";

// Los dos avatares juntos (parejita pixel) con el corazón en medio.
import { motion, useReducedMotion } from "framer-motion";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { PixelIcon } from "@/components/game/PixelIcon";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { usePartnerStore } from "@/stores/usePartnerStore";

export function PairView() {
  const jugador = useAuthStore((s) => s.jugadorActual);
  const player = usePlayerStore((s) => s.player);
  const partner = usePartnerStore((s) => s.partner);
  const uidPartner = usePartnerStore((s) => s.uidPartner());
  const reduce = useReducedMotion();

  if (!jugador || !player || !partner || !uidPartner) return null;

  return (
    <div className="flex items-end justify-center gap-3 border-4 border-ink bg-sky p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <div className="flex flex-col items-center gap-1">
        <AvatarCanvas char={jugador} avatar={player.avatar} scale={5} />
        <span className="font-silk text-[11px] text-ink">{player.nombre}</span>
      </div>

      <motion.div
        className="mb-6"
        animate={reduce ? undefined : { scale: [1, 1.18, 1] }}
        transition={reduce ? undefined : { duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
      >
        <PixelIcon name="heart" scale={3} />
      </motion.div>

      <div className="flex flex-col items-center gap-1">
        <AvatarCanvas char={uidPartner} avatar={partner.avatar} scale={5} />
        <span className="font-silk text-[11px] text-ink">{partner.nombre}</span>
      </div>
    </div>
  );
}
