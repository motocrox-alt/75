"use client";

// Fila de ajuste (bloque NES) + toggle cuadrado estilo NES (no switch de iOS).
import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export function SettingRow({
  icon: Icon,
  label,
  children,
}: {
  icon?: LucideIcon;
  label: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-4 border-ink bg-cloud p-3 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <span className="flex items-center gap-2">
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center border-2 border-ink bg-sky text-ink">
            <Icon size={16} />
          </span>
        )}
        <span className="font-silk text-xs text-ink">{label}</span>
      </span>
      {children}
    </div>
  );
}

export function NesToggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`flex h-7 w-14 items-center border-4 border-ink p-0.5 ${
        on ? "justify-end bg-pipe" : "justify-start bg-[color-mix(in_srgb,var(--ink)_18%,white)]"
      }`}
    >
      <motion.span
        layout={!reduce}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 700, damping: 30 }}
        className={`h-full w-5 border-2 border-ink ${on ? "bg-cloud" : "bg-ink/40"}`}
      />
    </button>
  );
}
