"use client";

// Bloque del personaje: avatar + nivel + barra de XP, y panel de Vínculo
// con el status del compañero (nivel + avance de hoy).
import { usePlayerStore } from "@/stores/usePlayerStore";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { PixelIcon } from "@/components/game/PixelIcon";
import { xpParaNivel, progresoNivel } from "@/config/leveling";
import { MISIONES } from "@/config/rules";
import { CHARS } from "@/config/sprites/sprites";
import type { Player } from "@/lib/schemas";

const TOTAL_OBLIGATORIAS = MISIONES.filter((m) => m.requiereParaDia).length;

interface Props {
  char: keyof typeof CHARS;
  partnerChar: keyof typeof CHARS;
  partner: Player | null;
  partnerAvance: number;
}

export function HeroStrip({ char, partnerChar, partner, partnerAvance }: Props) {
  const player = usePlayerStore((s) => s.player);
  if (!player) return null;

  const lo = xpParaNivel(player.nivel);
  const hi = xpParaNivel(player.nivel + 1);
  const cur = Math.max(0, Math.round(player.xp - lo));
  const tot = Math.max(1, Math.round(hi - lo));
  const pct = Math.round(progresoNivel(player.xp) * 100);

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Personaje */}
      <div className="flex items-center gap-3 border-4 border-ink bg-cloud p-3 shadow-[4px_4px_0_rgba(0,0,0,0.3)] sm:flex-1">
        <div className="shrink-0 border-2 border-ink bg-sky p-1">
          <AvatarCanvas char={char} avatar={player.avatar} scale={3} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-press text-xs text-ink">{player.nombre}</span>
          <span className="font-silk text-xs text-ink/70">NIVEL {player.nivel}</span>
          <div className="mt-1 h-4 w-full border-2 border-ink bg-sky">
            <div
              className="h-full bg-coin transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="font-silk text-[10px] text-ink/60">
            XP {cur} / {tot}
          </span>
        </div>
      </div>

      {/* Vínculo */}
      <div className="flex items-center gap-3 border-4 border-ink bg-pipe p-3 text-cloud shadow-[4px_4px_0_rgba(0,0,0,0.3)] sm:w-56">
        <div className="shrink-0 border-2 border-ink bg-pipe-dk p-1">
          <PixelIcon name="heart" scale={2} />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span className="font-silk text-xs">VÍNCULO</span>
          {partner ? (
            <>
              <span className="font-silk text-[11px] text-cream">
                {partner.nombre} · NIVEL {partner.nivel}
              </span>
              <span className="font-silk text-[10px] text-cream/90">
                HOY: {partnerAvance}/{TOTAL_OBLIGATORIAS} ✓
              </span>
            </>
          ) : (
            <span className="font-silk text-[10px] text-cream/80">
              {CHARS[partnerChar].name} aún no entra…
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
