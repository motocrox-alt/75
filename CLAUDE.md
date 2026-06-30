# CLAUDE.md — Reto 75 Juntos

Contexto persistente para Claude Code. Léelo al inicio de cada sesión. Es la fuente de verdad de convenciones y reglas de negocio. Si algo aquí choca con un prompt, **gana este archivo** salvo que el prompt diga lo contrario explícitamente.

---

## Qué es

App web **co-op de pareja** para hacer el reto **75 Hard** gamificado como RPG. Dos jugadores: **Gio** y **Jenni**. Proyecto personal, una sola instancia, dos cuentas. No es white-label ni comercial. Hermano de *Forja* (single-player) — mismo engine, pero de a dos.

---

## Stack

- Next.js App Router + TypeScript **strict**
- Tailwind CSS v4 (`@custom-variant dark`)
- Zustand (**un store por dominio**), Zod (**toda** validación)
- Firebase: Firestore + Auth + Storage
- Framer Motion, canvas-confetti, lottie-react, howler
- Recharts, Lucide icons
- Vercel + GitHub (auto-deploy), next-pwa + Firestore offline persistence

---

## Principios NO negociables

1. **Mock-first.** Flag `USE_MOCK`. Todo se construye y se ve funcionando con mock antes de tocar Firebase. Datos semilla **a mitad del reto** (día ~40) para que se vea vivo.
2. **Append-only logs = fuente de verdad.** `xpLog`, `intentos`, `achievements`, `dayLogs` nunca se mutan en histórico. Los caches denormalizados (`players/{uid}`) se recalculan desde los logs.
3. **No-castigo (de Forja).** Nada humilla. El reinicio del reto se llama *"Nuevo intento, juntos"* y siempre muestra lo que se conserva. Sin culpa, sin números de calorías, sin pesarse forzado.
4. **Modal state = solo IDs.** Los stores de UI/modal guardan IDs, nunca objetos completos.
5. **Engine puro y testeable.** Todo `lib/game/` son funciones puras sin Firebase adentro. Se testean solas.
6. **Un store Zustand por dominio.** No un mega-store.
7. **Zod en toda frontera** (forms, datos de Firestore al entrar, config).
8. **Denormalización sobre joins.** Lee del cache, no reconstruyas en cada render.

---

## Reglas de negocio

### Misiones diarias (por jugador)

| Misión | Stat | XP | ¿Cuenta para "día cumplido"? |
|---|---|---|---|
| **Entrenar** (mín 1, ideal 2) | 💪 Fuerza | 20 (1x) +15 bonus (2x) | **Sí** (≥1) |
| **Chela** (semana: sin / finde: juntitos) | 🍃 Templanza / ❤️ Vínculo | 25 | **Sí** |
| **Comer limpio** | 🍃 Templanza | 20 | **Sí** |
| **Agua** | 💧 Vitalidad | 15 | **Sí** |
| **Leer 10 páginas** | 📖 Mente | 20 | **Sí** |
| **Foto de progreso** | 📸 Constancia | 20 | **NO — opcional, solo bonus** |
| *Día perfecto* (auto) | ❤️ Vínculo | +30 | meta-bonus si las obligatorias están en verde |

**Criterio de "día cumplido"** (decide si la racha del reto sigue viva): entrenar≥1, chela respetada, comer limpio, agua, leer → **las 5 en verde**. La foto **no** entra; es opcional y solo suma XP/stat Constancia si se sube.

### La chela (regla estrella)
- **Lun–jue:** misión individual *"sin chela"* → toggle. Cumplir = Templanza.
- **Vie–dom:** se vuelve **misión de pareja "chela juntitos"**. Solo cuenta si **ambos** la confirman ese finde → XP de Vínculo a los dos.
- Tomar solo / entre semana → rompe la regla → día fallido para esa persona.

### Fallo y reinicio — **SOLIDARIO** (confirmado)
- Si **cualquiera** de los dos falla un día → el contador del reto **reinicia a día 1 para ambos**.
- Se guarda el intento en `pacto/{id}/intentos` (append-only): número, fechas, días logrados, quién falló.
- **NUNCA se pierde al reiniciar:** nivel, XP, stats, logros, fotos, micro-rachas con escudo. Solo el contador del reto vuelve a 1.

### Arranque del reto — **al login de ambos** (confirmado)
- El reto inicia (`retoInicio = now`, `retoDiaActual = 1`) en el momento en que **ambos** jugadores han hecho login por primera vez y unido al `pacto`. Antes de eso, estado `pendiente`.

### Fotos — **privadas** (confirmado)
- Cada jugador ve **solo las suyas**. Sin opción de compartir. Storage con reglas que restringen por uid. Subir es opcional.

---

## Engine de juego (`lib/game/`)

- **Nivel:** `xpParaNivel(n) = round(100 * n^1.5)`. XP individual y permanente.
- **Stats (6):** Fuerza, Templanza, Vitalidad, Mente, Constancia, Vínculo. Suben al cumplir su misión (append a `xpLog` con `statAfectado`).
- **Rachas:**
  - *Micro-rachas de stat* (ej. agua 12 días): **con escudos**, un día perdido se absorbe.
  - *Racha del reto (contador 75)*: **sin escudo** (es 75 Hard), reinicio solidario.
- **Logros:** append-only, una vez. Semilla: Primer paso (d1), La primera semana (7), Mitad del camino (38), Hidratado de acero (30 agua), Rata de biblioteca (750 pág), Ritual sagrado (1er finde chela), Sincronía (10 días ambos en verde), Inquebrantables (75 — jefe final).
- **Funciones puras clave:** `evaluarDia(dayLog)`, `calcularXpDia(dayLog)`, `decidirReinicio(jugadorA, jugadorB)`, `aplicarGananciaXp(...)`, `chequearLogros(...)`, `actualizarRacha(...)`, `chequearOutfits(estado)`.

---

## Sistema de avatar (pixel-art 8-bit)

- **Sprites como data-en-código**, NO assets externos: cada pieza es matriz de índices + paleta, en `config/sprites/`. Render en `<canvas>` con `image-rendering: pixelated`, escala x8–x10.
- **Capas (z-order):** `cuerpo base (piel) → cara → pelo → outfit → accesorio`. `lib/avatar/` compone las capas.
- **Slots equipables:** `piel`, `pelo`, `outfit`, `accesorio`. El equipado vive en `players/{uid}.avatar`.
- **Vestidor:** te pones solo piezas **desbloqueadas**; preview en vivo; bloqueadas en silueta con su condición.
- **Desbloqueo (catálogo en `config/wardrobe.ts`):** por **hito del reto** (días 7/21/38/50/65, y 75 = legendario), por **nivel**, y por **logro**. Set base desde día 1. **Sin moneda en V1.**
- **Permanente:** los outfits desbloqueados NO se pierden al reiniciar el reto.
- Función pura `chequearOutfits(estado)` decide qué se desbloquea; append a `wardrobe`.

---

## Modelo de datos (Firestore)

```
/pacto/{pactoId}
  retoInicio, retoDiaActual, retoEstado(pendiente|activo|completado),
  intentoActual, vinculoXp, vinculoNivel, jugadores:[uidGio, uidJenni]

/pacto/{pactoId}/intentos/{intentoId}        (append-only)
  numero, fechaInicio, fechaFin?, diasLogrados, quienFallo?

/players/{uid}                                (cache denormalizado)
  nombre, nivel, xp,
  stats:{fuerza,templanza,vitalidad,mente,constancia,vinculo},
  rachaReto, escudos:{...}, ultimoDiaCerrado,
  avatar:{ piel, pelo, outfit, accesorio }    ← slots equipados (IDs de pieza)

/players/{uid}/wardrobe/{pieceId}             (append-only — piezas desbloqueadas)
  slot, fuente(base|hito|nivel|logro), desbloqueadoEn

/players/{uid}/dayLogs/{yyyy-mm-dd}
  misiones:{ entrenar:{hecho,doble}, chela:{tipo,ok}, comida:{ok},
            agua:{ok}, lectura:{ok,paginas,nota}, foto:{ok,storagePath?} },
  cerrado, perfecto, xpGanado, ts

/players/{uid}/xpLog/{autoId}                 (APPEND-ONLY)
  fuente, cantidad, statAfectado?, ts

/players/{uid}/achievements/{achId}           (append-only)
  desbloqueadoEn
```

Reglas de Storage: fotos en `progress/{uid}/...`, lectura/escritura **solo del propio uid**.

---

## Design tokens

Identidad **retro-gaming NES** (estilo Super Mario Bros). Paleta 8-bit:

```css
--sky:      #5C94FC;  /* cielo — fondo principal */
--sky-deep: #3A6FE0;  /* azul profundo */
--brick:    #C84C0C;  /* ladrillo — piso, superficies */
--coin:     #FBD000;  /* bloque ? — logros, acentos, selección */
--pipe:     #00A844;  /* tubería — éxito / completado */
--mario:    #E03B2C;  /* rojo — amor, peligro, acento */
--cloud:    #FFFFFF;  /* paneles, texto claro */
--ink:      #201A10;  /* negro NES — outlines, bordes */
--cream:    #FCE8C8;  /* texto sobre fondos oscuros */
```
- **Títulos:** Press Start 2P · **HUD/labels:** Silkscreen · **Texto largo:** Inter.
- **Chrome NES:** bordes negros gruesos (3–5px), sin border-radius, sombras duras sólidas (sin blur), paneles tipo bloque, letrero estilo SMB con tornillos, fondo cielo + nubes pixel + piso de ladrillo.
- **Iconos pixel-art (matrices en código, NO Lucide):**
  - *Items / stats / logros:* corazón=Vínculo, estrella=logro/día perfecto, espada=Fuerza, poción=Vitalidad, diamante=legendario, cofre=recompensa, llave/candado=desbloqueo, moneda=XP.
  - *Misiones diarias:* espada=entrenar, tarro=chela, manzana=comer limpio, poción=agua, libro=leer, cámara=foto.
- ⚠️ **Los sprites ya están hechos y aprobados** en `config/sprites/sprites.ts` (avatares: BASE/HAIR/OUTFIT/ACC + CHARS; iconos: todos los de arriba; funciones `renderAvatar` y `renderIcon`). **Usar ese archivo tal cual — NO redibujar sprites.** Incluye `unlockDay` por outfit y los mapeos `MISSION_ICON` / `STAT_ICON`.
- Sprites e iconos con `image-rendering: pixelated`. Animación: monedas/estrellas al día perfecto, "LEVEL UP" NES al subir nivel, cofre que se abre al desbloquear outfit. Respetar `prefers-reduced-motion`.

---

## Estructura de carpetas

```
src/
  app/                  rutas App Router
  components/           ui/  game/  partner/  charts/  avatar/
  stores/               usePactoStore, usePlayerStore, usePartnerStore,
                        useDayStore, useAvatarStore, useUiStore
  lib/
    firebase/           config, mockAdapter
    schemas/            zod
    game/               leveling, xp, achievements, streaks, evaluarDia, wardrobe  (PURO)
    avatar/             render canvas, composición de capas
  config/               rules.ts, leveling.ts, achievements.ts, wardrobe.ts
                        sprites/  (sprite-data: matrices + paletas)
```

---

## Convenciones de código

- TS strict, sin `any`. Tipos derivados de Zod (`z.infer`).
- Server Components por default; `"use client"` solo donde haya estado/interacción.
- Commits por feature. Preview deploy en cada push.
- Nada de lógica de negocio en componentes: vive en `lib/game/` y stores.
- IDs de fecha siempre `yyyy-mm-dd` en zona horaria local del jugador (definir helper único `hoyKey()`).
