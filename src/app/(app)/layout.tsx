"use client";

// Auth gate del grupo autenticado: sin sesión → /login. Con sesión → AppShell.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";
import AppShell from "@/components/ui/AppShell";

export default function AppGroupLayout({ children }: { children: React.ReactNode }) {
  const jugador = useAuthStore((s) => s.jugadorActual);
  const router = useRouter();

  useEffect(() => {
    if (!jugador) router.replace("/login");
  }, [jugador, router]);

  if (!jugador) return null;

  return <AppShell>{children}</AppShell>;
}
