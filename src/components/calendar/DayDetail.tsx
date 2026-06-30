"use client";

// Detalle del día seleccionado. El estado guarda solo el número de día;
// el contenido se deriva de dias[diaSel-1].
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { PixelIcon } from "@/components/game/PixelIcon";
import { useCalendarStore } from "@/stores/useCalendarStore";
import { MISIONES } from "@/config/rules";
import { MISSION_ICON } from "@/config/sprites/sprites";

const ESTADO_LABEL: Record<string, string> = {
  perfecto: "¡Día perfecto!",
  cumplido: "Día cumplido",
  fallido: "Día fallido",
  hoy: "Hoy",
  futuro: "Aún no llega 🔒",
};

export function DayDetail() {
  const diaSel = useCalendarStore((s) => s.diaSel);
  const dias = useCalendarStore((s) => s.dias);
  const seleccionar = useCalendarStore((s) => s.seleccionar);
  const reduce = useReducedMotion();

  const dia = diaSel ? dias[diaSel - 1] : null;
  const cerrar = () => seleccionar(null);

  return (
    <AnimatePresence>
      {dia && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={cerrar}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            initial={reduce ? false : { scale: 0.9, y: 10 }}
            animate={{ scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm border-4 border-ink bg-cloud p-5 shadow-[6px_6px_0_rgba(0,0,0,0.35)]"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-press text-sm text-ink">DÍA {dia.dia}</h2>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar"
                className="border-2 border-ink bg-mario p-1 text-cloud"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mb-4 font-silk text-xs text-ink/70">{ESTADO_LABEL[dia.estado]}</p>

            {dia.estado === "futuro" ? (
              <p className="font-body text-sm text-ink/60">
                Este día todavía no llega. ¡Sigue cerrando los de hoy!
              </p>
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {MISIONES.map((m) => {
                    const ok = dia.resumen?.misionesOk.includes(m.id) ?? false;
                    return (
                      <span
                        key={m.id}
                        title={m.label}
                        className={`flex h-10 w-10 items-center justify-center border-2 border-ink ${
                          ok ? "bg-sky" : "bg-sky/20"
                        }`}
                      >
                        <span className={ok ? undefined : "opacity-30 grayscale"}>
                          <PixelIcon name={MISSION_ICON[m.id]} scale={1} />
                        </span>
                      </span>
                    );
                  })}
                </div>

                {dia.resumen?.perfecto && (
                  <div className="mt-3 flex items-center gap-2 border-2 border-ink bg-coin px-2 py-1">
                    <PixelIcon name="star" scale={1} />
                    <span className="font-silk text-[11px] text-ink">Día perfecto · +30 Vínculo</span>
                  </div>
                )}

                {dia.estado === "hoy" && (
                  <Link
                    href="/hoy"
                    className="mt-4 inline-block border-2 border-ink bg-pipe px-4 py-2 font-silk text-xs text-cloud shadow-[3px_3px_0_rgba(0,0,0,0.3)]"
                  >
                    Ir a Hoy →
                  </Link>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
