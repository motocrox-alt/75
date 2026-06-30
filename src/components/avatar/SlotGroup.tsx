"use client";

// Grupo de un slot (Pelo / Atuendo / Accesorio): miniaturas del avatar completo
// con cada pieza puesta. Desbloqueadas equipan; bloqueadas → silueta + toast.
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { PixelIcon } from "@/components/game/PixelIcon";
import { useAvatarStore } from "@/stores/useAvatarStore";
import { usePactoStore } from "@/stores/usePactoStore";
import { useToastStore } from "@/stores/useToastStore";
import { WARDROBE, desbloqueada, type Slot } from "@/config/wardrobe";
import { CHARS } from "@/config/sprites/sprites";

const TITULO: Record<Slot, string> = { hair: "PELO", outfit: "ATUENDO", acc: "ACCESORIO" };
const SLOT_AVATAR = {
  hair: "pelo",
  outfit: "outfit",
  acc: "accesorio",
} as const;

export function SlotGroup({ slot, char }: { slot: Slot; char: keyof typeof CHARS }) {
  const avatar = useAvatarStore((s) => s.avatar);
  const equipar = useAvatarStore((s) => s.equipar);
  const diaReto = usePactoStore((s) => s.pacto?.retoDiaActual ?? 0);
  const showToast = useToastStore((s) => s.show);

  if (!avatar) return null;

  const avatarKey = SLOT_AVATAR[slot];
  const piezas = WARDROBE.filter((p) => p.slot === slot);

  return (
    <section className="flex flex-col gap-2">
      <div className="border-4 border-ink bg-coin px-3 py-1.5 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <h3 className="font-press text-[11px] text-ink">{TITULO[slot]}</h3>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {piezas.map((pieza) => {
          const compuesto = { ...avatar, [avatarKey]: pieza.id };
          const unlocked = desbloqueada(pieza, diaReto);
          const equipped = avatar[avatarKey] === pieza.id;
          const cofre = pieza.unlockDay >= 75;

          return (
            <button
              key={pieza.id}
              type="button"
              onClick={() =>
                unlocked
                  ? equipar(avatarKey, pieza.id)
                  : showToast(`Se desbloquea el día ${pieza.unlockDay}`)
              }
              className={`relative flex flex-col items-center gap-1 border-4 p-1 shadow-[3px_3px_0_rgba(0,0,0,0.3)] transition-colors ${
                equipped ? "border-ink bg-coin" : "border-ink bg-cloud"
              }`}
            >
              <div className="flex h-[72px] items-end justify-center overflow-hidden">
                <AvatarCanvas
                  char={char}
                  avatar={compuesto}
                  scale={3}
                  className={unlocked ? undefined : "opacity-25 brightness-0"}
                />
              </div>

              {!unlocked && (
                <div className="absolute inset-x-0 top-1 flex flex-col items-center gap-0.5">
                  <PixelIcon name={cofre ? "chest" : "lock"} scale={1} />
                  <span className="border border-ink bg-ink px-1 font-silk text-[8px] text-cream">
                    DÍA {pieza.unlockDay}
                  </span>
                </div>
              )}

              <span className="truncate font-silk text-[10px] text-ink">{pieza.nombre}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
