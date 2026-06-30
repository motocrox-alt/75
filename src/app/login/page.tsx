"use client";

// Login: en mock = dos tarjetas (Gio/Jenni); en real = email + contraseña.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { adapter, USE_MOCK } from "@/lib/firebase/adapter";
import { useAuthStore, type Jugador } from "@/stores/useAuthStore";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import type { Player } from "@/lib/schemas";

const CUENTAS: Jugador[] = ["gio", "jenni"];

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const entrar = useAuthStore((s) => s.entrar);
  const escuchar = useAuthStore((s) => s.escuchar);
  const jugadorActual = useAuthStore((s) => s.jugadorActual);

  const [players, setPlayers] = useState<Record<string, Player | null>>({});
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Real: si ya hay sesión, entra directo.
  useEffect(() => {
    if (!USE_MOCK) escuchar();
  }, [escuchar]);
  useEffect(() => {
    if (jugadorActual) router.replace("/hoy");
  }, [jugadorActual, router]);

  // Mock: avatares de las tarjetas.
  useEffect(() => {
    if (!USE_MOCK) return;
    (async () => {
      const entries = await Promise.all(
        CUENTAS.map(async (j) => [j, await adapter.getPlayer(j)] as const),
      );
      setPlayers(Object.fromEntries(entries));
    })();
  }, []);

  const entrarMock = (j: Jugador) => {
    login(j);
    router.replace("/hoy");
  };

  const entrarReal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    const err = await entrar(email, pass);
    setCargando(false);
    if (err) setError(err);
    else router.replace("/hoy");
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

      {USE_MOCK ? (
        <div className="flex flex-wrap items-stretch justify-center gap-6">
          {CUENTAS.map((j) => {
            const p = players[j];
            return (
              <button
                key={j}
                onClick={() => entrarMock(j)}
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
                {p && <span className="font-silk text-xs text-ink/70">NIVEL {p.nivel}</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <form
          onSubmit={entrarReal}
          className="flex w-full max-w-xs flex-col gap-3 border-4 border-ink bg-cloud p-5 shadow-[4px_4px_0_rgba(0,0,0,0.3)]"
        >
          <label className="flex flex-col gap-1">
            <span className="font-silk text-[10px] text-ink/60">CORREO</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-ink bg-cloud px-2 py-2 font-silk text-sm text-ink focus:bg-coin/20 focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="font-silk text-[10px] text-ink/60">CONTRASEÑA</span>
            <input
              type="password"
              autoComplete="current-password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className="border-2 border-ink bg-cloud px-2 py-2 font-silk text-sm text-ink focus:bg-coin/20 focus:outline-none"
            />
          </label>
          {error && <p className="font-silk text-xs text-mario">{error}</p>}
          <button
            type="submit"
            disabled={cargando}
            className="mt-1 border-4 border-ink bg-pipe px-4 py-2.5 font-silk text-sm text-cloud shadow-[3px_3px_0_rgba(0,0,0,0.3)] active:translate-y-0.5 disabled:opacity-60"
          >
            {cargando ? "Entrando…" : "Entrar"}
          </button>
        </form>
      )}
    </main>
  );
}
