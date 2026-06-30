"use client";

// Pantalla "Hoy": HUD del reto, personaje + Vínculo, las 6 misiones y el banner.
// UI + estado local sobre mock (sin engine real).
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { useAuthStore, type Jugador } from "@/stores/useAuthStore";
import { useDayStore, type MisionId } from "@/stores/useDayStore";
import { mockAdapter } from "@/lib/firebase/mockAdapter";
import { hoyKey } from "@/lib/utils/date";
import { MISIONES } from "@/config/rules";
import { MISSION_ICON, CHARS } from "@/config/sprites/sprites";
import { contarObligatorias } from "@/lib/dia";
import { RetoBar } from "@/components/game/RetoBar";
import { HeroStrip } from "@/components/game/HeroStrip";
import { MissionCard } from "@/components/game/MissionCard";
import { ChelaMission } from "@/components/game/ChelaMission";
import { DayBanner } from "@/components/game/DayBanner";
import type { Player } from "@/lib/schemas";

const otroDe = (j: Jugador): Jugador => (j === "gio" ? "jenni" : "gio");

const NES_COLORS = ["#FBD000", "#E03B2C", "#00A844", "#5C94FC"];

// Títulos cortos por misión (la chela tiene su propio componente).
const TITULO: Record<Exclude<MisionId, "chela">, string> = {
  entrenar: "Entrenar",
  comer: "Comer limpio",
  agua: "Tomar agua",
  leer: "Leer",
  foto: "Foto",
};

export default function HoyPage() {
  const jugador = useAuthStore((s) => s.jugadorActual);

  const log = useDayStore((s) => s.log);
  const cargar = useDayStore((s) => s.cargar);
  const setParejaChelaOk = useDayStore((s) => s.setParejaChelaOk);
  const toggleMision = useDayStore((s) => s.toggleMision);
  const setEntrenoDoble = useDayStore((s) => s.setEntrenoDoble);
  const cumplida = useDayStore((s) => s.cumplida);
  const perfecto = useDayStore((s) => s.perfecto());

  const [partner, setPartner] = useState<Player | null>(null);
  const [partnerAvance, setPartnerAvance] = useState(0);

  // Carga del día del jugador.
  useEffect(() => {
    if (jugador) cargar(jugador, hoyKey());
  }, [jugador, cargar]);

  // Carga del compañero (Vínculo + confirmación de la chela del finde).
  useEffect(() => {
    if (!jugador) return;
    const otro = otroDe(jugador);
    (async () => {
      const [p, dl] = await Promise.all([
        mockAdapter.getPlayer(otro),
        mockAdapter.getDayLog(otro, hoyKey()),
      ]);
      setPartner(p);
      setPartnerAvance(contarObligatorias(dl));
      setParejaChelaOk(dl?.misiones.chela.ok ?? false);
    })();
  }, [jugador, setParejaChelaOk]);

  // Confeti al pasar de no-perfecto → perfecto (salvo reduced-motion).
  const prevPerfecto = useRef(false);
  useEffect(() => {
    if (perfecto && !prevPerfecto.current) {
      const reduce =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce) {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: NES_COLORS });
      }
    }
    prevPerfecto.current = perfecto;
  }, [perfecto]);

  if (!jugador || !log) {
    return <p className="font-silk text-ink/60">Cargando…</p>;
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <RetoBar />

      <HeroStrip
        char={jugador}
        partnerChar={otroDe(jugador)}
        partner={partner}
        partnerAvance={partnerAvance}
      />

      {/* Título de sección */}
      <div className="border-4 border-ink bg-coin px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <h2 className="font-press text-xs text-ink">MISIONES DE HOY</h2>
      </div>

      {/* Las 6 misiones */}
      <div className="flex flex-col gap-3">
        {MISIONES.map((m) => {
          if (m.id === "chela") {
            return <ChelaMission key={m.id} otroNombre={CHARS[otroDe(jugador)].name} />;
          }

          const verde = cumplida(m.id);

          let subtitulo: React.ReactNode;
          if (m.id === "foto") {
            subtitulo = <span className="font-silk text-pipe-dk">Opcional · +bonus</span>;
          } else if (m.id === "entrenar") {
            subtitulo = verde
              ? log.misiones.entrenar.doble
                ? "Doble entreno 💪💪"
                : "1 entreno ✓"
              : "Mín 1 · ideal 2";
          } else if (m.id === "leer") {
            subtitulo = verde ? "10 páginas ✓" : "10 páginas";
          } else if (m.id === "agua") {
            subtitulo = "Hidrátate";
          } else {
            subtitulo = "Comida limpia";
          }

          // Pill 2X (solo entrenar y cuando ya está en verde).
          const badge =
            m.id === "entrenar" && verde ? (
              <span
                role="button"
                tabIndex={0}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setEntrenoDoble(!log.misiones.entrenar.doble);
                }}
                className={`cursor-pointer border-2 border-ink px-1 font-silk text-[9px] ${
                  log.misiones.entrenar.doble ? "bg-mario text-cloud" : "bg-cloud text-ink"
                }`}
              >
                2X
              </span>
            ) : undefined;

          return (
            <MissionCard
              key={m.id}
              iconName={MISSION_ICON[m.id]}
              titulo={TITULO[m.id]}
              subtitulo={subtitulo}
              cumplida={verde}
              onToggle={() => toggleMision(m.id)}
              badge={badge}
            />
          );
        })}
      </div>

      <DayBanner />
    </div>
  );
}
