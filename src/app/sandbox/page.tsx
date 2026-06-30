"use client";

// QA visual de los assets de sprites.ts (avatares + iconos). Se puede borrar luego.
import { useEffect, useRef } from "react";
import { renderAvatar, renderIcon, ICONS, CHARS } from "@/config/sprites/sprites";

const AV_SCALE = 10;
const ICON_SCALE = 3;

type AvatarCfg = {
  char: keyof typeof CHARS;
  hair: string;
  outfit: string;
  acc: string;
};

const GIO: AvatarCfg = { char: "gio", hair: "corto", outfit: "tee", acc: "none" };
const JENNI: AvatarCfg = { char: "jenni", hair: "largo", outfit: "dress", acc: "diadema" };

function AvatarPanel({ cfg }: { cfg: AvatarCfg }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) {
      renderAvatar(ref.current, cfg.char, cfg.hair, cfg.outfit, cfg.acc, AV_SCALE);
    }
  }, [cfg]);
  return (
    <div className="flex flex-col items-center gap-3 border-4 border-ink bg-[var(--sky)] p-5 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <canvas ref={ref} />
      <span className="font-press text-xs text-ink">{CHARS[cfg.char].name}</span>
    </div>
  );
}

function IconCell({ name }: { name: keyof typeof ICONS }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) renderIcon(ref.current, name, ICON_SCALE);
  }, [name]);
  return (
    <div className="flex flex-col items-center gap-1 border-2 border-ink bg-cloud p-2">
      <canvas ref={ref} />
      <span className="font-silk text-[10px] text-ink">{name}</span>
    </div>
  );
}

export default function SandboxPage() {
  const iconNames = Object.keys(ICONS) as (keyof typeof ICONS)[];
  return (
    <main className="flex flex-1 flex-col items-center gap-10 p-8">
      <h1 className="font-press text-xl text-cloud drop-shadow-[3px_3px_0_var(--ink)]">
        RETO 75 · SANDBOX
      </h1>

      <section className="flex flex-col items-center gap-4">
        <h2 className="font-silk text-ink">Avatares</h2>
        <div className="flex flex-wrap items-end justify-center gap-6">
          <AvatarPanel cfg={GIO} />
          <AvatarPanel cfg={JENNI} />
        </div>
      </section>

      <section className="flex w-full max-w-3xl flex-col items-center gap-4">
        <h2 className="font-silk text-ink">Iconos ({iconNames.length})</h2>
        <div className="flex flex-wrap justify-center gap-3">
          {iconNames.map((name) => (
            <IconCell key={name} name={name} />
          ))}
        </div>
      </section>
    </main>
  );
}
