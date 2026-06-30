"use client";

// Icono pixel-art de sprites.ts en <canvas>.
import { useEffect, useRef } from "react";
import { renderIcon, ICONS } from "@/config/sprites/sprites";

interface Props {
  name: keyof typeof ICONS;
  scale?: number;
  className?: string;
}

export function PixelIcon({ name, scale = 3, className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) renderIcon(ref.current, name, scale);
  }, [name, scale]);
  return <canvas ref={ref} className={className} />;
}
