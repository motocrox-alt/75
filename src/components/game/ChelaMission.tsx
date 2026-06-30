"use client";

// La chela (regla estrella). Entre semana = individual "sin chela".
// Finde = misión de pareja "juntitos": solo verde si ambos confirman.
import { MissionCard } from "@/components/game/MissionCard";
import { useDayStore } from "@/stores/useDayStore";

export function ChelaMission({ otroNombre }: { otroNombre: string }) {
  const log = useDayStore((s) => s.log);
  const parejaChelaOk = useDayStore((s) => s.parejaChelaOk);
  const toggleMision = useDayStore((s) => s.toggleMision);
  const cumplida = useDayStore((s) => s.cumplida);

  if (!log) return null;

  const finde = log.misiones.chela.tipo === "juntitos";
  const mine = log.misiones.chela.ok;
  const verde = cumplida("chela");

  const titulo = finde ? "Chela juntitos 🍺" : "Sin chela";
  let subtitulo: React.ReactNode;
  if (!finde) {
    subtitulo = "Entre semana, seco 💪";
  } else if (!mine) {
    subtitulo = "Confírmala con tu pareja";
  } else if (!parejaChelaOk) {
    subtitulo = `Falta que ${otroNombre} confirme`;
  } else {
    subtitulo = "¡Pareja confirmada! ❤️";
  }

  const badge = finde ? (
    <span
      className={`font-silk text-[9px] border-2 border-ink px-1 ${
        parejaChelaOk ? "bg-pipe text-cloud" : "bg-coin text-ink"
      }`}
    >
      {otroNombre.toUpperCase()} {parejaChelaOk ? "✓" : "…"}
    </span>
  ) : undefined;

  return (
    <MissionCard
      iconName="mug"
      titulo={titulo}
      subtitulo={subtitulo}
      cumplida={verde}
      onToggle={() => toggleMision("chela")}
      accent
      badge={badge}
    />
  );
}
