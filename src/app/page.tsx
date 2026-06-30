"use client";

// Raíz: con sesión → /hoy; sin sesión → /login.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RootRedirect() {
  const router = useRouter();
  const jugador = useAuthStore((s) => s.jugadorActual);

  useEffect(() => {
    router.replace(jugador ? "/hoy" : "/login");
  }, [jugador, router]);

  return null;
}
