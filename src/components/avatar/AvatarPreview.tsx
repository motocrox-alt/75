"use client";

// Avatar grande con preview en vivo del set equipado. "Pop" al cambiar pieza.
import { motion, useReducedMotion } from "framer-motion";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { useAvatarStore } from "@/stores/useAvatarStore";
import { CHARS } from "@/config/sprites/sprites";

export function AvatarPreview({ char, scale = 11 }: { char: keyof typeof CHARS; scale?: number }) {
  const avatar = useAvatarStore((s) => s.avatar);
  const reduce = useReducedMotion();
  if (!avatar) return null;

  const key = `${avatar.pelo}-${avatar.outfit}-${avatar.accesorio}`;
  return (
    <div className="border-4 border-ink bg-sky p-3 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <motion.div
        key={key}
        initial={reduce ? false : { scale: 0.85 }}
        animate={{ scale: 1 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 18 }}
      >
        <AvatarCanvas char={char} avatar={avatar} scale={scale} />
      </motion.div>
    </div>
  );
}
