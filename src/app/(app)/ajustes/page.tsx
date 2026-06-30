"use client";

// Ajustes: perfil, notificaciones (toggles NES), acceso a Historial, acerca de, logout.
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Camera, Volume2, History, ChevronRight, LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { useSettingsStore } from "@/stores/useSettingsStore";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { SettingRow, NesToggle } from "@/components/settings/SettingRow";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-4 border-ink bg-coin px-4 py-2 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
      <h2 className="font-press text-xs text-ink">{children}</h2>
    </div>
  );
}

export default function AjustesPage() {
  const router = useRouter();
  const jugador = useAuthStore((s) => s.jugadorActual);
  const logout = useAuthStore((s) => s.logout);

  const player = usePlayerStore((s) => s.player);
  const cargarPlayer = usePlayerStore((s) => s.cargar);
  const setNombre = usePlayerStore((s) => s.setNombre);

  const settings = useSettingsStore();

  useEffect(() => {
    if (jugador) cargarPlayer(jugador);
  }, [jugador, cargarPlayer]);

  const salir = () => {
    logout();
    router.replace("/login");
  };

  if (!jugador || !player) {
    return <p className="font-silk text-ink/60">Cargando…</p>;
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      {/* Perfil */}
      <SectionTitle>PERFIL</SectionTitle>
      <div className="flex items-center gap-4 border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <div className="shrink-0 border-2 border-ink bg-sky p-1">
          <AvatarCanvas char={jugador} avatar={player.avatar} scale={3} />
        </div>
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-silk text-[10px] text-ink/60">NOMBRE</span>
          <input
            value={player.nombre}
            onChange={(e) => setNombre(jugador, e.target.value)}
            maxLength={16}
            className="border-2 border-ink bg-cloud px-2 py-1.5 font-silk text-sm text-ink focus:bg-coin/20 focus:outline-none"
          />
        </label>
      </div>

      {/* Notificaciones */}
      <SectionTitle>NOTIFICACIONES</SectionTitle>
      <div className="flex flex-col gap-2">
        <SettingRow icon={Bell} label="Recordatorios diarios">
          <NesToggle
            on={settings.recordatorios}
            onChange={(v) => settings.set("recordatorios", v)}
            label="Recordatorios diarios"
          />
        </SettingRow>
        <SettingRow icon={Camera} label="Recordatorio de foto">
          <NesToggle
            on={settings.recordatorioFoto}
            onChange={(v) => settings.set("recordatorioFoto", v)}
            label="Recordatorio de foto"
          />
        </SettingRow>
        <SettingRow icon={Volume2} label="Sonidos">
          <NesToggle
            on={settings.sonidos}
            onChange={(v) => settings.set("sonidos", v)}
            label="Sonidos"
          />
        </SettingRow>
      </div>

      {/* Reto */}
      <SectionTitle>RETO</SectionTitle>
      <Link href="/historial">
        <SettingRow icon={History} label="Historial de intentos">
          <ChevronRight size={18} className="text-ink" />
        </SettingRow>
      </Link>

      {/* Acerca de */}
      <SectionTitle>ACERCA DE</SectionTitle>
      <div className="border-4 border-ink bg-cloud p-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)]">
        <p className="font-silk text-xs text-ink">Reto 75 Juntos</p>
        <p className="mt-1 font-body text-xs text-ink/60">v0.1 · Fase A (mock)</p>
        <p className="mt-2 font-body text-xs text-ink/60">Hecho con 💚 para Gio &amp; Jenni.</p>
      </div>

      {/* Cerrar sesión */}
      <button
        type="button"
        onClick={salir}
        className="flex items-center justify-center gap-2 border-4 border-ink bg-mario px-4 py-3 font-silk text-sm text-cloud shadow-[4px_4px_0_rgba(0,0,0,0.3)] active:translate-y-0.5 active:shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    </div>
  );
}
