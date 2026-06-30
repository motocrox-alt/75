# planning.md — Reto 75 Juntos

Roadmap de ejecución por fases. Claude Code va tachando. **Mock-first**: nada de Firebase hasta Fase C. Cada item es una tarea concreta; commitea por feature.

Leyenda: `[ ]` pendiente · `[~]` en progreso · `[x]` hecho

---

## FASE 0 — Setup (1 sesión corta)

- [x] `create-next-app` (App Router, TS strict, Tailwind v4, ESLint) — Next 16.2.9 + React 19
- [x] Instalar deps: zustand, zod, framer-motion, canvas-confetti, lottie-react, howler, recharts, lucide-react, firebase, next-pwa
- [x] Tailwind v4: configurar `@custom-variant dark` + design tokens (paleta NES sky/brick/coin/pipe/mario/ink/cream) como CSS vars
- [x] Fuentes: Press Start 2P (títulos), Silkscreen (HUD), Inter (texto) (next/font)
- [x] Estructura de carpetas según CLAUDE.md
- [x] `lib/firebase/mockAdapter.ts` + flag `USE_MOCK` (default true)
- [x] Datos semilla **a mitad del reto** (día ~40): dos jugadores con niveles medios, varios logros, micro-rachas activas, dayLogs de los días pasados
- [x] `config/rules.ts`, `config/leveling.ts`, `config/achievements.ts` (constantes)
- [x] `config/sprites/` — **sprite-data base** en código (`sprites.ts` ya aprobado): cuerpo base, 2 tonos de piel, pelos, outfits, accesorios (matrices + paletas)
- [x] `config/wardrobe.ts` — catálogo de outfits con condición de desbloqueo (base/hito/nivel/logro)
- [x] Schemas Zod base en `lib/schemas/` (Player, DayLog, Pacto, Intento, Achievement, AvatarSlots, WardrobePiece)
- [x] `hoyKey()` helper de fecha local

---

## FASE A — UI con mock (varias sesiones, una por módulo) ✅ COMPLETA

**Sesión A1 — Auth + Layout**
- [x] Pantalla login (dos cuentas mock). Primer login crea/une al `pacto` — `useAuthStore`, `usePactoStore`, `usePlayerStore`
- [x] Estado del reto: `pendiente` hasta que ambos entraron → luego `activo` (`estadoReto()`)
- [x] Layout app: nav inferior (móvil) / lateral (desktop) con las 7 secciones (Hoy · Personaje · Vestidor · Pareja · Calendario · Logros · Ajustes), header con día N/75 + intento + mini-avatar/nivel + logout
- [ ] `useUiStore` (modales = solo IDs) — se difiere a cuando haya modales (A2+)

**Sesión A2 — Hoy (home)**
- [x] Cards de las 6 misiones (foto marcada como opcional) — `MissionCard` + `ChelaMission`
- [x] Toggle/registro por misión, estado verde/pendiente (`useDayStore`, persiste en mock)
- [x] Barra de progreso del reto (día N/75) + nivel/XP del jugador (`RetoBar` + `HeroStrip` con `progresoNivel`)
- [x] Confeti (canvas-confetti) al cerrar día perfecto (transición no-perfecto→perfecto, respeta reduced-motion)
- [x] Lógica de la chela según día de la semana (semana=individual / finde=pareja sobre mock) + panel de Vínculo con status del compañero + `DayBanner` dinámico

**Sesión A3 — Mi personaje**
- [x] Ficha RPG: 6 stats como barras + radar (Recharts) — `StatBars` + `StatRadar` (estilo NES) + `config/stats.ts`
- [x] Nivel, XP hacia siguiente nivel, racha del reto (bloque héroe con `progresoNivel`)
- [x] **Avatar pixel-art** renderizado en canvas (composición de capas) — `AvatarCanvas` escala 11
- [x] Tira de logros desbloqueados/bloqueados (`AchievementStrip`) + seed `getAchievements` en el mock

**Sesión A4 — Vestidor + render de avatar**
- [x] Render canvas de sprites (`image-rendering: pixelated`) + composición de capas (piel→cara→pelo→outfit→accesorio) — vive en `sprites.ts` (`renderAvatar`), envuelto en `AvatarCanvas`
- [x] `components/avatar/` — `AvatarCanvas`, `AvatarPreview`, `SlotGroup` (grid + picker por slot)
- [x] `useAvatarStore` — slots equipados + preview en vivo (persiste vía `setAvatar`, sincroniza `usePlayerStore`)
- [x] Vestidor: piezas por slot, desbloqueadas equipables, bloqueadas en silueta con su condición ("Día N") + candado/cofre + toast (regla simple `diaReto >= unlockDay`)
- [x] Animación al equipar (pop del avatar) + toast NES en bloqueadas (nivel/logro → Fase B)

**Sesión A5 — Pareja**
- [x] Vista read-only del otro: su día de hoy, nivel, racha, **su avatar con outfit** — `PartnerCard` + `usePartnerStore`
- [x] Barra de **Vínculo** compartida (`BondPanel`, del pacto)
- [x] Misión de chela del finde (confirmación de ambos) — reusa `ChelaMission`; recordatorio entre semana
- [x] Los dos avatares juntos (`PairView` con corazón) + sincronía del día (`SyncIndicator`)

**Sesión A6 — Calendario**
- [x] Heatmap de los 75 días (cumplido/perfecto/fallido/hoy/futuro) — `CalendarGrid` + `DayCell` + `useCalendarStore` + seed `getRetoDias`
- [x] Tap a un día → detalle de misiones de ese día (`DayDetail`, modal = solo nº de día) + `CalendarSummary`

**Sesión A7 — Logros**
- [x] Galería desbloqueados / por desbloquear con estados — `AchievementCard` (compartida con la tira), `AchievementsProgress`, `useAchievementsStore`; jefe final dorado

**Sesión A8 — Historial / Intentos + Ajustes**
- [x] Lista de intentos del reto (append-only) — `/historial`, `HistorialView` + `IntentoCard` (tono épico, no-culpa) + seed `getIntentos`
- [x] Ajustes: perfil/nombre editable, notificaciones (toggles NES en `useSettingsStore`), acceso a Historial, acerca de, logout

> **Fase A cerrada:** las 7 secciones tienen contenido real sobre mock + login + historial. Cascarón completo navegable.

---

## FASE B — Engine de juego (puro + tests)

**B1 — Evaluar día · XP · stats · niveles (puro + tests) ✅**
- [x] `config/leveling.ts` — `xpParaNivel`, `nivelDesdeXp`, `progresoNivel`, `nivelesGanados` (consolidado)
- [x] `lib/game/xp.ts` — `calcularXpDia(dayLog)` (total + porStat + desglose para xpLog)
- [x] `lib/game/evaluarDia.ts` — `evaluarDia(dayLog)` → cumplido/perfecto (foto NO cuenta)
- [x] `lib/game/cierre.ts` — `aplicarCierreDia(player, log, ts)` PURO → player nuevo + xpLogEntries + subioNivel
- [x] Vitest configurado (`vitest.config.ts`, scripts `test`/`test:watch`) + 19 tests verdes (evaluarDia, xp, leveling, cierre)

**B2 — Rachas · reinicio solidario · logros · outfits (puro + tests) ✅**
- [x] `config/streaks.ts` + `lib/game/streaks.ts` — micro-rachas con escudos; racha del reto sin escudo
- [x] `lib/game/reinicio.ts` — `decidirReinicio` **solidario** + `aplicarReinicio` (no recibe ni toca players; conserva personaje)
- [x] `lib/game/achievements.ts` — `chequearLogros(ctx)` (no re-desbloquea)
- [x] `lib/game/wardrobe.ts` — `chequearOutfits(ctx)` por hito/nivel/logro + `Condicion` en `config/wardrobe.ts`
- [x] **Tests** Vitest: escudos, reinicio solidario, logros por umbral, outfits por hito/nivel/logro — 43 tests verdes (B1+B2)

**B3 — pendiente (cablear a stores/UI)**
- [ ] Cablear engine a stores (usePlayerStore, usePactoStore, useDayStore, useAvatarStore) sobre mock
- [ ] Cierre de día: aplica XP, actualiza stats/caches, chequea logros **y outfits**, evalúa reinicio

---

## FASE C — Firebase + producción

- [ ] `lib/firebase/config.ts` (env vars) y swap del mockAdapter (`USE_MOCK=false`)
- [ ] Auth real (dos cuentas) + creación/unión del `pacto`
- [ ] Firestore: colecciones según CLAUDE.md, escrituras append-only (incluye `wardrobe`)
- [ ] Recalcular caches desde `xpLog` (función de reconstrucción)
- [ ] Storage: fotos en `progress/{uid}/`, reglas restringidas por uid
- [ ] Reglas de seguridad Firestore + Storage (cada quien solo lo suyo; `pacto` editable por ambos jugadores)
- [ ] next-pwa + Firestore offline persistence
- [ ] Deploy Vercel + env vars, preview→prod
- [ ] Prueba real de los dos: arranque al login de ambos, cierre de día, reinicio solidario, desbloqueo de outfit

---

## Orden recomendado de sesiones de Claude Code

`Fase 0 → A1 → A2 → A3 → A4 → A5 → A6 → A7 → A8 → Fase B → Fase C`

Cada sesión: arranca leyendo CLAUDE.md, trabaja el módulo completo, commit por feature, push para preview deploy.

---

## Notas / decisiones ya cerradas

- Fallo: **solidario** (uno falla → reinician los dos).
- Fotos: **privadas** por jugador, **opcionales**.
- Nombre: **Reto 75 Juntos**.
- Arranque: **al login de ambos**.
- Foto **no** cuenta para "día cumplido" (solo bonus de XP/Constancia).
- Avatares: **pixel-art 8-bit**, sprite-data en código, outfits desbloqueables por hito/nivel/logro, sin moneda en V1.
