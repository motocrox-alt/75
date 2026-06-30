"use client";

// Avatar vivo de la pantalla Hoy: respira (bob) + parpadea en idle; salta con
// icono flotante + destello al marcar una misión; baila al cerrar día perfecto.
// Respeta prefers-reduced-motion (sprite estático, sin animación).
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  renderAvatar,
  renderIcon,
  MISSION_ICON,
  ICONS,
  CHARS,
} from "@/config/sprites/sprites";
import { useAvatarFxStore } from "@/stores/useAvatarFxStore";
import type { AvatarSlots } from "@/lib/schemas";

function IconMini({ name }: { name: keyof typeof ICONS }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) renderIcon(ref.current, name, 2);
  }, [name]);
  return <canvas ref={ref} className="block" />;
}

interface Props {
  char: keyof typeof CHARS;
  avatar: AvatarSlots;
  scale?: number;
}

export function AvatarVivo({ char, avatar, scale = 4 }: Props) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<HTMLSpanElement>(null);
  const [blink, setBlink] = useState(false);
  const [float, setFloat] = useState<{ misionId: string; key: number } | null>(null);
  const [flash, setFlash] = useState<number | null>(null);

  // Render del sprite (con parpadeo).
  useEffect(() => {
    if (canvasRef.current) {
      renderAvatar(canvasRef.current, char, avatar.pelo, avatar.outfit, avatar.accesorio, scale, blink);
    }
  }, [char, avatar.pelo, avatar.outfit, avatar.accesorio, scale, blink]);

  // Parpadeo idle.
  useEffect(() => {
    if (reduce) return;
    let alive = true;
    let t1 = 0;
    let t2 = 0;
    const loop = () => {
      const delay = 2200 + Math.floor(Math.random() * 2800);
      t1 = window.setTimeout(() => {
        if (!alive) return;
        setBlink(true);
        t2 = window.setTimeout(() => {
          if (!alive) return;
          setBlink(false);
          loop();
        }, 110);
      }, delay);
    };
    loop();
    return () => {
      alive = false;
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce]);

  // Reacciona a los eventos del store transitorio (suscripción → el setState
  // vive en el callback, no en el cuerpo del effect).
  useEffect(() => {
    if (reduce) return;
    const replay = (clase: "avivo-jump" | "avivo-dance") => {
      const el = animRef.current;
      if (!el) return;
      el.classList.remove("avivo-jump", "avivo-dance");
      el.getBoundingClientRect(); // fuerza reflow para reiniciar la animación
      el.classList.add(clase);
    };
    return useAvatarFxStore.subscribe((state, prev) => {
      if (state.reaccion && state.reaccion.nonce !== prev.reaccion?.nonce) {
        replay("avivo-jump");
        setFloat({ misionId: state.reaccion.misionId, key: state.reaccion.nonce });
        setFlash(state.reaccion.nonce);
      }
      if (state.celebracionNonce !== prev.celebracionNonce && state.celebracionNonce > 0) {
        replay("avivo-dance");
      }
    });
  }, [reduce]);

  return (
    <span className={`relative inline-block ${reduce ? "" : "avivo-bob"}`}>
      <span
        ref={animRef}
        className="inline-block"
        onAnimationEnd={(e) =>
          e.currentTarget.classList.remove("avivo-jump", "avivo-dance")
        }
      >
        <canvas ref={canvasRef} className="block" />
      </span>

      {float && (
        <span
          key={`f${float.key}`}
          className="avivo-floatup pointer-events-none absolute left-1/2 top-0 z-20"
          onAnimationEnd={() => setFloat(null)}
        >
          <IconMini name={MISSION_ICON[float.misionId]} />
        </span>
      )}

      {flash !== null && (
        <span
          key={`s${flash}`}
          className="avivo-flash pointer-events-none absolute left-1/2 top-1/2 z-0"
          onAnimationEnd={() => setFlash(null)}
        >
          <IconMini name="star" />
        </span>
      )}
    </span>
  );
}
