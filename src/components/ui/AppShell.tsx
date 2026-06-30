"use client";

// Shell de la app autenticada: header NES + navegación (lateral en desktop,
// barra inferior fija en móvil). Carga pacto y player al montar.
import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  User,
  Shirt,
  Heart,
  CalendarDays,
  Trophy,
  Settings,
  LogOut,
  Hourglass,
  type LucideIcon,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePactoStore } from "@/stores/usePactoStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { AvatarCanvas } from "@/components/avatar/AvatarCanvas";
import { RETO_DIAS } from "@/config/rules";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { href: "/hoy", label: "Hoy", icon: Home },
  { href: "/personaje", label: "Personaje", icon: User },
  { href: "/vestidor", label: "Vestidor", icon: Shirt },
  { href: "/pareja", label: "Pareja", icon: Heart },
  { href: "/calendario", label: "Calendario", icon: CalendarDays },
  { href: "/logros", label: "Logros", icon: Trophy },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
];

const OTRO: Record<string, string> = { gio: "Jenni", jenni: "Gio" };

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const jugador = useAuthStore((s) => s.jugadorActual);
  const logout = useAuthStore((s) => s.logout);

  const pacto = usePactoStore((s) => s.pacto);
  const cargarPacto = usePactoStore((s) => s.cargar);
  const estadoReto = usePactoStore((s) => s.estadoReto);

  const player = usePlayerStore((s) => s.player);
  const cargarPlayer = usePlayerStore((s) => s.cargar);

  useEffect(() => {
    cargarPacto();
  }, [cargarPacto]);

  useEffect(() => {
    if (jugador) cargarPlayer(jugador);
  }, [jugador, cargarPlayer]);

  const salir = () => {
    logout();
    router.replace("/login");
  };

  const estado = estadoReto();
  const pendiente = estado === "pendiente";

  return (
    <div className="min-h-screen md:flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden w-44 flex-col border-r-4 border-ink bg-brick md:flex">
        <div className="border-b-4 border-ink bg-brick-lt px-4 py-4">
          <span className="font-press text-xs text-cloud">RETO 75</span>
        </div>
        <nav className="flex flex-1 flex-col gap-1 p-2">
          {NAV.map((item) => (
            <NavLink key={item.href} item={item} active={pathname === item.href} variant="side" />
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        {/* Header (letrero NES) */}
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-4 border-ink bg-mario px-4 py-3 shadow-[0_4px_0_rgba(0,0,0,0.3)]">
          <div className="flex flex-col">
            <span className="font-press text-sm text-cloud drop-shadow-[2px_2px_0_var(--ink)]">
              RETO 75
            </span>
            {pendiente ? (
              <span className="mt-1 flex items-center gap-1 font-silk text-xs text-cream">
                <Hourglass size={12} /> Esperando a {jugador ? OTRO[jugador] : "…"}…
              </span>
            ) : (
              <span className="mt-1 font-silk text-xs text-cream">
                DÍA {pacto?.retoDiaActual ?? "–"}/{RETO_DIAS} · INTENTO #{pacto?.intentoActual ?? "–"}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {player && jugador && (
              <div className="flex items-center gap-2">
                <div className="border-2 border-ink bg-sky p-0.5">
                  <AvatarCanvas char={jugador} avatar={player.avatar} scale={2} />
                </div>
                <span className="hidden font-silk text-xs text-cloud sm:inline">
                  NIVEL {player.nivel}
                </span>
              </div>
            )}
            <button
              onClick={salir}
              aria-label="Cerrar sesión"
              className="border-2 border-ink bg-coin p-1.5 text-ink shadow-[2px_2px_0_rgba(0,0,0,0.3)] active:translate-y-0.5 active:shadow-none"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Contenido — pb extra en móvil para no quedar bajo la nav fija */}
        <main className="flex-1 p-4 pb-28 md:pb-6">{children}</main>
      </div>

      {/* Bottom nav (móvil) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t-4 border-ink bg-brick pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV.map((item) => (
          <NavLink key={item.href} item={item} active={pathname === item.href} variant="bottom" />
        ))}
      </nav>
    </div>
  );
}

function NavLink({
  item,
  active,
  variant,
}: {
  item: NavItem;
  active: boolean;
  variant: "side" | "bottom";
}) {
  const Icon = item.icon;
  if (variant === "bottom") {
    return (
      <Link
        href={item.href}
        className={`flex flex-1 flex-col items-center gap-0.5 py-2 ${
          active ? "bg-coin text-ink" : "text-cream"
        }`}
      >
        <Icon size={18} />
        <span className="font-silk text-[9px] leading-none">{item.label}</span>
      </Link>
    );
  }
  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2 border-2 px-3 py-2 ${
        active
          ? "border-ink bg-coin text-ink shadow-[2px_2px_0_rgba(0,0,0,0.3)]"
          : "border-transparent text-cream hover:border-ink/40"
      }`}
    >
      <Icon size={16} />
      <span className="font-silk text-xs">{item.label}</span>
    </Link>
  );
}
