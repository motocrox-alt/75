"use client";

// Historial de intentos del reto (épica, no vergüenza).
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHistorialStore } from "@/stores/useHistorialStore";
import { HistorialView } from "@/components/historial/HistorialView";

export default function HistorialPage() {
  const cargar = useHistorialStore((s) => s.cargar);
  const intentos = useHistorialStore((s) => s.intentos);

  useEffect(() => {
    cargar();
  }, [cargar]);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <Link
        href="/ajustes"
        className="flex w-fit items-center gap-1 border-2 border-ink bg-cloud px-3 py-1.5 font-silk text-xs text-ink shadow-[3px_3px_0_rgba(0,0,0,0.3)]"
      >
        <ArrowLeft size={14} /> Ajustes
      </Link>

      {intentos.length === 0 ? (
        <p className="font-silk text-ink/60">Cargando…</p>
      ) : (
        <HistorialView />
      )}
    </div>
  );
}
