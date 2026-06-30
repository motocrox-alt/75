"use client";

// Auth gate del grupo autenticado: espera a que la sesión se resuelva (listo)
// y entonces decide: sin sesión → /login; con sesión → AppShell.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import AppShell from "@/components/ui/AppShell";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const jugador = useAuthStore((s) => s.jugadorActual);
  const listo = useAuthStore((s) => s.listo);
  const escuchar = useAuthStore((s) => s.escuchar);
  const router = useRouter();

  useEffect(() => {
    escuchar();
  }, [escuchar]);

  useEffect(() => {
    if (listo && !jugador) router.replace("/login");
  }, [listo, jugador, router]);

  if (!listo) {
    return <p className="p-8 font-silk text-ink/60">Cargando…</p>;
  }
  if (!jugador) return null;

  return <AppShell>{children}</AppShell>;
}
