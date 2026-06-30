"use client";

// Login mock: elegir cuenta (Gio / Jenni) = iniciar sesión como ese jugador.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { mockAdapter } from "@/lib/firebase/mockAdapter";
import { useAuthStore, type Jugador } from "@/stores/useAuthStore";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import type { Player } from "@/lib/schemas";

const CUENTAS: Jugador[] = ["gio", "jenni"];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [players, setPlayers] = useState<Record<string, Player | null>>({});

  useEffect(() => {
    (async () => {
      const entries = await Promise.all(
        CUENTAS.map(async (j) => [j, await mockAdapter.getPlayer(j)] as const),
      );
      setPlayers(Object.fromEntries(entries));
    })();
  }, []);

  const entrar = (j: Jugador) => {
    login(j);
    router.replace("/hoy");
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-10 p-8">
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="font-press text-2xl leading-relaxed text-cloud drop-shadow-[3px_3px_0_var(--ink)]">
          RETO 75
          <br />
          JUNTOS
        </h1>
        <p className="font-silk text-ink">¿Quién eres?</p>
      </header>

      <div className="flex flex-wrap items-stretch justify-center gap-6">
        {CUENTAS.map((j) => {
          const p = players[j];
          return (
            <button
              key={j}
              onClick={() => entrar(j)}
              className="flex w-44 flex-col items-center gap-4 border-4 border-ink bg-cloud p-5 shadow-[4px_4px_0_rgba(0,0,0,0.3)] transition-transform hover:-translate-y-1 active:translate-y-0 active:shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
            >
              <div className="flex h-[120px] items-end justify-center">
                {p ? (
                  <AvatarCanvas char={j} avatar={p.avatar} scale={5} />
                ) : (
                  <span className="font-silk text-ink/40">…</span>
                )}
              </div>
              <span className="font-press text-sm text-ink">{p?.nombre ?? j}</span>
              {p && (
                <span className="font-silk text-xs text-ink/70">NIVEL {p.nivel}</span>
              )}
            </button>
          );
        })}
      </div>
    </main>
  );
}
