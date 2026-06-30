"use client";

// Bloque NES de una misión: icono pixel + texto + checkbox-bloque.
// Genérico: la cerveza compone este mismo bloque con accent + badge.
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { PixelIcon } from "@/components/game/PixelIcon";
import { ICONS } from "@/config/sprites/sprites";

interface Props {
  iconName: keyof typeof ICONS;
  titulo: string;
  subtitulo: React.ReactNode;
  cumplida: boolean;
  onToggle: () => void;
  accent?: boolean; // cerveza (regla estrella) → borde --mario
  badge?: React.ReactNode; // pill 2X, status de pareja, etc.
}

export function MissionCard({
  iconName,
  titulo,
  subtitulo,
  cumplida,
  onToggle,
  accent = false,
  badge,
}: Props) {
  const reduce = useReducedMotion();
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      animate={reduce ? undefined : { scale: 1 }}
      className={`flex w-full items-center gap-3 border-4 p-3 text-left shadow-[4px_4px_0_rgba(0,0,0,0.3)] transition-colors ${
        accent ? "border-mario" : "border-ink"
      } ${cumplida ? "bg-[color-mix(in_srgb,var(--pipe)_22%,white)]" : "bg-cloud"}`}
    >
      {/* Icono */}
      <span className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-ink bg-sky">
        <PixelIcon name={iconName} scale={2} />
      </span>

      {/* Texto */}
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex items-center gap-2">
          <span className="font-silk text-sm text-ink">{titulo}</span>
          {badge}
        </span>
        <span className="truncate font-body text-xs text-ink/60">{subtitulo}</span>
      </span>

      {/* Checkbox-bloque */}
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center border-2 border-ink ${
          cumplida ? "bg-pipe text-cloud" : "bg-cloud"
        }`}
        aria-hidden
      >
        {cumplida && <Check size={20} strokeWidth={4} />}
      </span>
    </motion.button>
  );
}
