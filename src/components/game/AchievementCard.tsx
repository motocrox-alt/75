"use client";

// Tarjeta de un logro, compartida por la galería (/logros) y la tira (Personaje).
// compact = celda angosta para la tira; full = tarjeta de galería.
import { PixelIcon } from "@/components/game/PixelIcon";
import type { Logro } from "@/config/achievements";

const BOSS_ID = "inquebrantables";

interface Props {
  logro: Logro;
  desbloqueado: boolean;
  compact?: boolean;
}

export function AchievementCard({ logro, desbloqueado, compact = false }: Props) {
  const esBoss = logro.id === BOSS_ID;

  const borde = esBoss
    ? "border-[var(--coin-dk)]"
    : desbloqueado
      ? "border-pipe"
      : "border-ink";

  const fondo = desbloqueado
    ? esBoss
      ? "bg-[color-mix(in_srgb,var(--coin)_30%,white)]"
      : "bg-cloud"
    : "bg-[color-mix(in_srgb,var(--ink)_12%,white)]";

  const iconScale = compact ? 2 : 3;
  const iconBox = compact ? "h-12 w-12" : "h-16 w-16";

  return (
    <div
      className={`relative flex ${
        compact ? "w-28 shrink-0 flex-col items-center gap-2 text-center" : "flex-col gap-2"
      } border-4 ${borde} ${fondo} p-3 shadow-[4px_4px_0_rgba(0,0,0,0.3)]`}
    >
      {/* Badge ✓ (solo galería desbloqueada) */}
      {desbloqueado && !compact && (
        <span className="absolute -right-2 -top-2 border-2 border-ink bg-pipe px-1 font-silk text-[10px] text-cloud">
          ✓
        </span>
      )}

      <div className={`flex items-center gap-3 ${compact ? "flex-col" : ""}`}>
        <span
          className={`relative flex ${iconBox} shrink-0 items-center justify-center border-2 border-ink ${
            esBoss ? "bg-coin" : "bg-sky"
          }`}
        >
          {desbloqueado ? (
            <PixelIcon name={logro.icono} scale={iconScale} />
          ) : (
            <>
              <span className="opacity-25 brightness-0">
                <PixelIcon name={logro.icono} scale={iconScale} />
              </span>
              <span className="absolute">
                <PixelIcon name="lock" scale={compact ? 1 : 2} />
              </span>
            </>
          )}
        </span>

        {!compact && (
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="flex items-center gap-1.5 font-silk text-sm text-ink">
              {logro.nombre}
              {esBoss && <PixelIcon name="diamond" scale={1} />}
            </span>
            <span className="font-body text-xs text-ink/60">{logro.desc}</span>
          </div>
        )}
      </div>

      {/* Texto en compact: nombre si desbloqueado, pista (desc) si no */}
      {compact &&
        (desbloqueado ? (
          <span className="font-silk text-[10px] leading-tight text-ink">{logro.nombre}</span>
        ) : (
          <span className="font-body text-[9px] leading-tight text-ink/50">{logro.desc}</span>
        ))}
    </div>
  );
}
