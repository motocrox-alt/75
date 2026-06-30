"use client";

// "Nuevo intento, juntos" — checkpoint épico, cero culpa. Aparece tras cerrar
// un día con reinicio solidario. El personaje (nivel/logros/outfits) se conserva.
import { motion, useReducedMotion } from "framer-motion";
import { useCierreStore } from "@/stores/useCierreStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAchievementsStore } from "@/stores/useAchievementsStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { PixelIcon } from "@/components/game/PixelIcon";

export function ReinicioFlow() {
  const resultado = useCierreStore((s) => s.resultado);
  const limpiar = useCierreStore((s) => s.limpiar);
  const player = usePlayerStore((s) => s.player);
  const logros = useAchievementsStore((s) => s.desbloqueados);
  const outfits = useWardrobeStore((s) => s.ids);
  const reduce = useReducedMotion();

  if (!resultado || !resultado.reinicio.hay) return null;

  const dias = resultado.reinicio.intentoCerrado?.diasLogrados ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4">
      <motion.div
        initial={reduce ? false : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex w-full max-w-md flex-col items-center gap-4 border-4 border-ink bg-cloud p-6 text-center shadow-[6px_6px_0_rgba(0,0,0,0.35)]"
      >
        <span className="font-press text-base leading-relaxed text-mario drop-shadow-[2px_2px_0_var(--ink)]">
          NUEVO INTENTO,
          <br />
          JUNTOS 💪
        </span>

        <p className="font-body text-sm text-ink/70">
          Recorrieron <strong className="text-ink">{dias} días</strong> juntos en este intento.
          No es un fracaso: es un checkpoint. Reiniciamos juntos desde el día 1.
        </p>

        {/* Lo que se conserva */}
        <div className="w-full border-4 border-ink bg-[color-mix(in_srgb,var(--pipe)_18%,white)] p-3">
          <span className="font-silk text-xs text-ink">Lo que conservan:</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <Conserva icon="sword" valor={`Nv ${player?.nivel ?? "–"}`} label="Nivel" />
            <Conserva icon="star" valor={`${logros.length}`} label="Logros" />
            <Conserva icon="chest" valor={`${outfits.length}`} label="Outfits" />
          </div>
        </div>

        <button
          type="button"
          onClick={limpiar}
          className="border-4 border-ink bg-pipe px-6 py-2.5 font-silk text-sm text-cloud shadow-[3px_3px_0_rgba(0,0,0,0.3)] active:translate-y-0.5"
        >
          Vamos de nuevo →
        </button>
      </motion.div>
    </div>
  );
}

function Conserva({
  icon,
  valor,
  label,
}: {
  icon: "sword" | "star" | "chest";
  valor: string;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 border-2 border-ink bg-cloud py-2">
      <PixelIcon name={icon} scale={1} />
      <span className="font-press text-[11px] text-ink">{valor}</span>
      <span className="font-silk text-[9px] text-ink/60">{label}</span>
    </div>
  );
}
