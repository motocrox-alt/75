"use client";

// Secuencia de recompensas tras cerrar el día. Respeta reduced-motion
// (muestra resultados estáticos, sin confeti ni animación).
import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import confetti from "canvas-confetti";
import { useCierreStore } from "@/stores/useCierreStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { PixelIcon } from "@/components/game/PixelIcon";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { LOGROS } from "@/config/achievements";
import { WARDROBE } from "@/config/wardrobe";
import type { SalidaCierre } from "@/lib/game/cerrarDiaCompleto";

const NES_COLORS = ["#FBD000", "#E03B2C", "#00A844", "#5C94FC"];
const SLOT_AVATAR = { hair: "pelo", outfit: "outfit", acc: "accesorio" } as const;

type Card =
  | { tipo: "xp"; xp: number; perfecto: boolean }
  | { tipo: "nivel"; nivel: number }
  | { tipo: "logro"; id: string }
  | { tipo: "outfit"; pieceId: string };

function buildCards(out: SalidaCierre): Card[] {
  const cards: Card[] = [{ tipo: "xp", xp: out.xpGanado, perfecto: out.perfecto }];
  if (out.subioNivel) cards.push({ tipo: "nivel", nivel: out.nivelDespues });
  out.logrosNuevos.forEach((id) => cards.push({ tipo: "logro", id }));
  out.outfitsNuevos.forEach((pieceId) => cards.push({ tipo: "outfit", pieceId }));
  return cards;
}

export function RewardSequence() {
  const resultado = useCierreStore((s) => s.resultado);
  const limpiar = useCierreStore((s) => s.limpiar);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  // Reinicia el paso cuando llega un nuevo resultado (patrón sin efecto).
  const [ultimoResultado, setUltimoResultado] = useState(resultado);
  if (resultado !== ultimoResultado) {
    setUltimoResultado(resultado);
    setI(0);
  }

  const visible = !!resultado && !resultado.reinicio.hay;
  const cards = useMemo(() => (resultado ? buildCards(resultado) : []), [resultado]);

  if (!visible || cards.length === 0) return null;

  const card = cards[i];
  const ultima = i === cards.length - 1;
  const avanzar = () => (ultima ? limpiar() : setI((n) => n + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
      <motion.div
        key={i}
        initial={reduce ? false : { scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex w-full max-w-sm flex-col items-center gap-4 border-4 border-ink bg-cloud p-6 text-center shadow-[6px_6px_0_rgba(0,0,0,0.35)]"
      >
        <CardContent card={card} reduce={!!reduce} />

        <div className="mt-2 flex items-center gap-2">
          {cards.length > 1 &&
            cards.map((_, k) => (
              <span
                key={k}
                className={`h-2 w-2 border border-ink ${k === i ? "bg-coin" : "bg-cloud"}`}
              />
            ))}
        </div>

        <button
          type="button"
          onClick={avanzar}
          className="border-4 border-ink bg-pipe px-6 py-2 font-silk text-sm text-cloud shadow-[3px_3px_0_rgba(0,0,0,0.3)] active:translate-y-0.5"
        >
          {ultima ? "¡Listo!" : "Continuar →"}
        </button>
      </motion.div>
    </div>
  );
}

function CardContent({ card, reduce }: { card: Card; reduce: boolean }) {
  const jugador = useAuthStore((s) => s.jugadorActual);
  const player = usePlayerStore((s) => s.player);

  // Confeti al mostrar el XP de un día perfecto.
  useEffect(() => {
    if (card.tipo === "xp" && card.perfecto && !reduce) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: NES_COLORS });
    }
  }, [card, reduce]);

  if (card.tipo === "xp") {
    return (
      <>
        {card.perfecto && (
          <span className="font-press text-xs text-pipe-dk">¡DÍA PERFECTO!</span>
        )}
        <PixelIcon name="coin" scale={3} />
        <span className="font-press text-2xl text-ink">+{card.xp}</span>
        <span className="font-silk text-xs text-ink/70">XP GANADO</span>
      </>
    );
  }

  if (card.tipo === "nivel") {
    return (
      <>
        <PixelIcon name="star" scale={3} />
        <span className="font-press text-xl text-mario drop-shadow-[2px_2px_0_var(--ink)]">
          ¡NIVEL {card.nivel}!
        </span>
        <span className="font-silk text-xs text-ink/70">Subiste de nivel</span>
      </>
    );
  }

  if (card.tipo === "logro") {
    const logro = LOGROS.find((l) => l.id === card.id);
    return (
      <>
        <span className="font-press text-xs text-coin-dk">¡LOGRO DESBLOQUEADO!</span>
        <span className="flex h-16 w-16 items-center justify-center border-2 border-ink bg-sky">
          <PixelIcon name={logro?.icono ?? "star"} scale={3} />
        </span>
        <span className="font-silk text-sm text-ink">{logro?.nombre ?? card.id}</span>
        <span className="font-body text-xs text-ink/60">{logro?.desc}</span>
      </>
    );
  }

  // outfit
  const pieza = WARDROBE.find((p) => p.id === card.pieceId);
  const slotKey = pieza ? SLOT_AVATAR[pieza.slot] : null;
  const avatarPreview =
    player && slotKey ? { ...player.avatar, [slotKey]: card.pieceId } : null;
  return (
    <>
      <span className="font-press text-xs text-coin-dk">¡NUEVO OUTFIT!</span>
      {jugador && avatarPreview && (
        <div className="border-2 border-ink bg-sky p-1">
          <AvatarCanvas char={jugador} avatar={avatarPreview} scale={4} />
        </div>
      )}
      <span className="font-silk text-sm text-ink">{pieza?.nombre ?? card.pieceId}</span>
      <span className="font-body text-xs text-ink/60">Míralo en el Vestidor 👗</span>
    </>
  );
}
