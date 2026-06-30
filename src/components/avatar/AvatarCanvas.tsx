"use client";

// Render de un avatar compuesto en <canvas> (pixel-art). Reutilizable.
import { useEffect, useRef } from "react";
import { renderAvatar, CHARS } from "@/config/sprites/sprites";
import type { AvatarSlots } from "@/lib/schemas";

interface Props {
  char: keyof typeof CHARS;
  avatar: AvatarSlots;
  scale?: number;
  className?: string;
}

export function AvatarCanvas({ char, avatar, scale = 10, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) {
      renderAvatar(ref.current, char, avatar.pelo, avatar.outfit, avatar.accesorio, scale);
    }
  }, [char, avatar.pelo, avatar.outfit, avatar.accesorio, scale]);
  return <canvas ref={ref} className={className} />;
}
