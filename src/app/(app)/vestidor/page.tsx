"use client";

// Vestidor: avatar grande con preview en vivo + slots de Pelo/Atuendo/Accesorio.
// Equipar persiste en el mock y sincroniza header + /personaje.
import { useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useAvatarStore } from "@/stores/useAvatarStore";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import { AvatarPreview } from "@/components/avatar/AvatarPreview";
import { SlotGroup } from "@/components/avatar/SlotGroup";
import { Toast } from "@/components/ui/Toast";

export default function VestidorPage() {
  const jugador = useAuthStore((s) => s.jugadorActual);
  const player = usePlayerStore((s) => s.player);
  const cargarAvatar = useAvatarStore((s) => s.cargar);
  const avatar = useAvatarStore((s) => s.avatar);
  const cargarWardrobe = useWardrobeStore((s) => s.cargar);

  useEffect(() => {
    if (jugador) {
      cargarAvatar(jugador);
      cargarWardrobe(jugador);
    }
  }, [jugador, cargarAvatar, cargarWardrobe]);

  if (!jugador || !avatar) {
    return <p className="font-silk text-ink/60">Cargando…</p>;
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4 md:flex-row md:items-start">
      {/* Avatar (arriba en móvil; izquierda fija en desktop) */}
      <div className="flex flex-col items-center gap-2 md:sticky md:top-20 md:w-64 md:shrink-0">
        <AvatarPreview char={jugador} />
        <span className="font-press text-sm text-ink">{player?.nombre ?? jugador}</span>
        {player && <span className="font-silk text-xs text-ink/70">NIVEL {player.nivel}</span>}
      </div>

      {/* Slots */}
      <div className="flex flex-1 flex-col gap-4">
        <SlotGroup slot="hair" char={jugador} />
        <SlotGroup slot="outfit" char={jugador} />
        <SlotGroup slot="acc" char={jugador} />
      </div>

      <Toast />
    </div>
  );
}
