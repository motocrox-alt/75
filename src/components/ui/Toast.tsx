"use client";

// Toast NES simple: aparece abajo y se va solo (~1.7s).
import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useToastStore } from "@/stores/useToastStore";

export function Toast() {
  const mensaje = useToastStore((s) => s.mensaje);
  const nonce = useToastStore((s) => s.nonce);
  const clear = useToastStore((s) => s.clear);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(clear, 1700);
    return () => clearTimeout(t);
  }, [mensaje, nonce, clear]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center px-4 md:bottom-8">
      <AnimatePresence>
        {mensaje && (
          <motion.div
            key={nonce}
            initial={reduce ? false : { y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { y: 20, opacity: 0 }}
            className="border-4 border-ink bg-coin px-4 py-2 font-silk text-xs text-ink shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
          >
            {mensaje}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
