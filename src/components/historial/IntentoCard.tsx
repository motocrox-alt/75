"use client";

// Un intento del reto, en tono épico (no de vergüenza).
import { RETO_DIAS } from "@/config/rules";
import type { Intento } from "@/lib/schemas";

const fmt = (ts: number): string => {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const NOMBRE: Record<string, string> = { gio: "Gio", jenni: "Jenni" };

export function IntentoCard({ intento }: { intento: Intento }) {
  const enCurso = intento.fechaFin == null;
  const pct = Math.min(100, Math.round((intento.diasLogrados / RETO_DIAS) * 100));

  return (
    <div className="flex flex-col gap-3 border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-between">
        <span className="font-press text-sm text-ink">INTENTO #{intento.numero}</span>
        {enCurso ? (
          <span className="border-2 border-ink bg-pipe px-2 py-0.5 font-silk text-[10px] text-cloud">
            EN CURSO
          </span>
        ) : (
          <span className="border-2 border-ink bg-coin px-2 py-0.5 font-silk text-[10px] text-ink">
            COMPLETADO
          </span>
        )}
      </div>

      <span className="font-silk text-xs text-ink/70">
        {fmt(intento.fechaInicio)} {intento.fechaFin ? `– ${fmt(intento.fechaFin)}` : "– hoy"}
      </span>

      <div>
        <span className="font-silk text-[11px] text-ink">
          Días recorridos juntos: {intento.diasLogrados}/{RETO_DIAS}
        </span>
        <div className="mt-1 h-4 w-full border-2 border-ink bg-sky">
          <div className="h-full bg-pipe" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {enCurso ? (
        <p className="font-body text-sm text-ink/70">¡Vamos al día! Cada día cuenta. 💪</p>
      ) : (
        <p className="font-body text-sm text-ink/70">
          Reiniciamos juntos en el día {intento.diasLogrados + 1}
          {intento.quienFallo ? ` (le tocó a ${NOMBRE[intento.quienFallo] ?? intento.quienFallo})` : ""}
          . Conservamos nivel, stats, logros y outfits — nada se perdió. Un nuevo intento, juntos.
        </p>
      )}
    </div>
  );
}
