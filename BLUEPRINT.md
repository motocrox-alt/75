# BLUEPRINT — Reto 75 Juntos

> Reto **75 Hard** gamificado estilo RPG **8-bit**, para dos jugadores: **Gio** y **Jenni**.
> Proyecto personal. No white-label, no comercial, no SAT. Una sola instancia, dos cuentas.
> Hermano espiritual de **Forja** — comparte ADN y principios, pero es app independiente y **co-op** (Forja es single-player).

---

## 0. Decisión de arquitectura: ¿app nueva o modo de Forja?

**App independiente** que reutiliza los patrones de Forja (engine de XP, stores, append-only logs, no-castigo). Razones: Forja es single-player y esto es co-op; el reto es time-boxed (75 días) y Forja infinito; Jenni necesita su propia cuenta y vista del otro. *(Alternativa anotada por si luego querés fusionarlos: meterlo como "modo reto co-op" dentro de Forja.)*

---

## 1. Concepto

Dos aventureros pixel-art firman un **reto de 75 días**. Cada día es una serie de **misiones** (las reglas). Cumplirlas da **XP**, sube **stats**, desbloquea **logros** y **outfits**, y mantiene viva la **racha de pareja**. El día 75 es el "jefe final": completarlo juntos es la victoria, y desbloquea el outfit legendario.

La capa romántica no es decorativa: hay misiones que **solo se completan en pareja** (la cerveza del finde juntitos), una **barra de Vínculo** compartida, y los dos avatares aparecen juntos. La narrativa siempre es "los dos contra el reto", nunca uno contra el otro.

**Tono:** motivación + complicidad, cero vergüenza. El fallo no humilla, invita a volver.

---

## 2. Las reglas → las misiones diarias

Las reglas del reto, formalizadas como **quests diarias**. Cada una mapea a un **stat**.

| # | Misión diaria | Stat | XP base | ¿Cuenta para "día cumplido"? |
|---|---|---|---|---|
| 1 | **Entrenar** (mín 1, ideal 2) | 💪 Fuerza | 20 (1x) +15 bonus (2x) | **Sí** (≥1) |
| 2 | **Cerveza** (semana: sin / finde: juntitos) | 🍃 Templanza / ❤️ Vínculo | 25 | **Sí** |
| 3 | **Comer limpio** | 🍃 Templanza | 20 | **Sí** |
| 4 | **Tomar agua** | 💧 Vitalidad | 15 | **Sí** |
| 5 | **Leer 10 páginas** | 📖 Mente | 20 | **Sí** |
| 6 | **Foto de progreso** | 📸 Constancia | 20 | **NO — opcional, solo bonus** |
| 7 | *Día perfecto* (auto) | ❤️ Vínculo | +30 | meta-bonus si las obligatorias están en verde |

**Criterio de "día cumplido"** (decide si la racha del reto sigue viva): entrenar≥1, cerveza respetada, comer limpio, agua, leer → **las 5 en verde**. La **foto es opcional**: no rompe el día, solo suma XP/Constancia si se sube.

**Stat de pareja (❤️ Vínculo):** sube con días sincronizados y con la cerveza del finde.

---

## 3. Mecánicas RPG (engine estilo Forja)

### XP y niveles
- XP **por jugador**, individual y permanente. Curva: `xpParaNivel(n) = round(100 * n^1.5)` (en `config/leveling.ts`).
- Bonus: día perfecto (+30), entreno doble (+15), racha.

### Los 6 stats
💪 Fuerza · 🍃 Templanza · 💧 Vitalidad · 📖 Mente · 📸 Constancia · ❤️ Vínculo. Barras tipo ficha + radar (Recharts) en el perfil.

### Rachas (con escudos — filosofía Forja)
1. **Micro-rachas de stat** (ej. agua 12 días): **con escudos**, un día perdido se absorbe.
2. **Racha del reto (contador 75)**: **sin escudo** (es 75 Hard). Reinicio solidario (§5) — pero nunca borra el personaje.

### Logros
Append-only, una vez. Semilla: Primer paso (d1), La primera semana (7), Mitad del camino (38), Hidratado de acero (30 agua), Rata de biblioteca (750 pág), Ritual sagrado (1er finde cerveza), Sincronía (10 días ambos en verde), Inquebrantables (75 — jefe final). **Varios logros desbloquean outfits** (§7).

---

## 4. Mecánicas de pareja (co-op)

- **Vista del compañero:** pantalla de Jenni/Gio con su nivel, su día (verde/pendiente), su racha y **su avatar con el outfit equipado**. Read-only — cada quien marca lo suyo (honestidad del 75 Hard).
- **Barra de Vínculo (❤️):** stat compartido, sube con sincronía y la cerveza del finde. Visible en ambos dashboards.
- **La cerveza (regla estrella):**
  - *Lun–jue:* misión individual "sin cerveza" → toggle = Templanza.
  - *Vie–dom:* se vuelve **misión de pareja "cerveza juntitos"** — solo cuenta si **ambos** confirman ese finde → XP de Vínculo a los dos. Tomar solo/entre semana → rompe la regla → día fallido.
- **Sincronía:** los dos cierran el día en verde → bonus de Vínculo + alimenta el logro Sincronía. Los **dos avatares aparecen juntos** (parejita pixel) en el dashboard.

---

## 5. El reto de 75: contador, fallo y reinicio — **SOLIDARIO** ✅

- **Contador compartido** (`retoDiaActual`, `retoInicio`, `retoEstado`). Ambos avanzan en el mismo reto.
- **Si cualquiera falla un día → reinicio solidario:** el contador vuelve a **día 1 para los dos**. Se guarda el intento en `intentos[]` (append-only): número, fechas, días logrados, quién falló. El historial de intentos es parte de la épica, no una vergüenza.
- **NUNCA se pierde al reiniciar:** nivel, XP, stats, logros, **outfits desbloqueados**, fotos, micro-rachas con escudo. El personaje es permanente; solo el contador del reto se reinicia.

---

## 6. Filosofía anti-castigo (no negociable, viene de Forja)

- El reinicio se presenta como **"Nuevo intento, juntos 💪"**, nunca como "fracasaste". Muestra lo que **conservan** (nivel, logros, outfits, antes/después).
- Sin números de calorías, sin pesarse forzado, sin lenguaje de culpa. Salud y constancia, no perfección obsesiva.
- Recordatorios (si los hay) en tono cómplice, no regañón.

---

## 7. Sistema de avatar pixel-art y vestidor ⭐ (nuevo)

El gancho visual del reto: **cada quien tiene su personaje 8-bit, y el avatar evoluciona conforme avanzan los 75 días.**

### Estilo y render
- **Pixel art / 8-bit.** Sprites renderizados en `<canvas>` con `image-rendering: pixelated`, escalados x8–x10.
- **Avatares como sprite-data en código** (matrices de índices de color + paletas), NO assets externos con copyright. Cada pieza vive en `config/sprites/` como data versionable, libre y recolorable. Ligero y autocontenido.

### Capas (z-order de composición)
`marco (opc) → cuerpo base (tono de piel) → cara/expresión → pelo → outfit (atuendo) → accesorio`

### Slots equipables
`piel` · `pelo` · `outfit` · `accesorio`. Cada slot tiene variantes desbloqueables.

### Vestidor (closet)
Pantalla nueva: grid de piezas por slot con **preview en vivo** del sprite compuesto. Las piezas bloqueadas se ven en silueta con su condición ("Se desbloquea en el día 38").

### Desbloqueo (mecánica RPG — esto es lo motivador)
Las piezas se desbloquean por:
- **Hitos del reto:** día 7, 21, 38, 50, 65 → outfit nuevo en cada hito. **Día 75 → outfit legendario** (corona/armadura dorada). El personaje "sube de skin" con el progreso.
- **Nivel:** ciertos outfits al subir de nivel.
- **Logros:** outfit temático por logro (ej. *Rata de biblioteca* → atuendo de erudito; *Hidratado de acero* → atuendo acuático).
- **Set base** desbloqueado desde el día 1, para arrancar con opciones.

### Co-op
En **Pareja** ves el avatar de Jenni con su outfit equipado. En sincronía, los dos avatares aparecen juntos.

### Fuera de V1 (extensión futura)
Moneda ("Chispas") ganada con XP + tienda de outfits. En V1 **no hay economía**: los outfits se ganan, no se compran.

> **Nota de assets:** como los sprites son data-en-código, hay que crearlos (matrices de píxeles). Se genera un **set inicial en código** (cuerpo base + caras + pelos + 4–5 outfits + accesorios) en Fase 0/A. Nada de packs externos con licencia.

---

## 8. Modelo de datos (Firestore — append-only + caches denormalizados)

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
            agua:{ok}, lectura:{ok,paginas,nota}, foto:{ok,storagePath?} }
  cerrado, perfecto, xpGanado, ts

/players/{uid}/xpLog/{autoId}                 (APPEND-ONLY)
  fuente, cantidad, statAfectado?, ts

/players/{uid}/achievements/{achId}           (append-only)
  desbloqueadoEn
```

- **Modal state = solo IDs** (regla Forja).
- **Fotos** → Storage en `progress/{uid}/`, **privadas**: cada quien ve solo las suyas. Reglas restringidas por uid. Subir es opcional.

---

## 9. Arquitectura técnica

**Stack (el de siempre):** Next.js App Router + TS strict · Tailwind v4 (`@custom-variant dark`) · Zustand (un store por dominio) · Zod (toda validación) · Firebase (Firestore/Auth/Storage) · Framer Motion, canvas-confetti, lottie-react, howler · Recharts, Lucide · Vercel + GitHub · next-pwa + Firestore offline persistence.

**Stores Zustand:** `usePactoStore` · `usePlayerStore` · `usePartnerStore` (read-only) · `useDayStore` · `useAvatarStore` (vestidor) · `useUiStore` (modales, solo IDs).

**Estructura de carpetas:**
```
src/
  app/                  rutas App Router
  components/           ui/  game/  partner/  charts/  avatar/
  stores/               zustand por dominio
  lib/
    firebase/           config, mockAdapter
    schemas/            zod
    game/               leveling, xp, achievements, streaks, evaluarDia, wardrobe  (PURO)
    avatar/             render de sprites (canvas), composición de capas
  config/
    rules.ts, leveling.ts, achievements.ts, wardrobe.ts
    sprites/            sprite-data (matrices + paletas)
```

**Engine puro y testeable:** `lib/game/` son funciones puras (XP, evaluar día, decidir reinicio, desbloquear logros y outfits). Sin Firebase adentro.

---

## 10. Pantallas / módulos

1. **Auth** — login (dos cuentas). Primer login crea/une al `pacto`.
2. **Hoy** — las 6 misiones (foto opcional), barra del reto (día N/75), nivel/XP, confeti al día perfecto, **tu avatar** arriba.
3. **Mi personaje** — ficha RPG: stats (barras + radar), nivel, logros, racha, **avatar grande**.
4. **Vestidor** — equipar outfits desbloqueados, preview en vivo, piezas bloqueadas con su condición.
5. **Pareja** — vista del otro: su día, nivel, **su avatar**, barra de Vínculo, cerveza del finde.
6. **Calendario** — heatmap de los 75 días.
7. **Logros** — galería desbloqueados / por desbloquear.
8. **Historial / Intentos** — intentos del reto, antes/después con fotos.
9. **Ajustes** — recordatorios, perfil/nombre.

---

## 11. Sistema de diseño

Identidad de **Reto 75 Juntos**: **retro-gaming NES**, inspirado en Super Mario Bros. Brillante, divertido, nostálgico. Paleta clásica de 8 bits:

```
--sky      #5C94FC   (cielo — fondo principal)
--sky-deep #3A6FE0   (azul profundo)
--brick    #C84C0C   (ladrillo — piso, superficies)
--coin     #FBD000   (bloque ? — logros, acentos, selección)
--pipe     #00A844   (tubería/colina — éxito / completado)
--mario    #E03B2C   (rojo — amor, peligro, acento)
--cloud    #FFFFFF   (nube — paneles, texto claro)
--ink      #201A10   (negro NES — outlines, bordes gruesos)
--cream    #FCE8C8   (crema — texto sobre fondos oscuros)
```
- **Títulos:** **Press Start 2P** (la fuente NES por excelencia) · **HUD/labels:** **Silkscreen** · **Texto largo:** Inter.
- **Chrome estilo NES:** bordes negros gruesos (3–5px), esquinas rectas (sin border-radius), sombras duras tipo bloque (box-shadow sólido sin blur), paneles tipo "bloque ?" y letreros tipo el cartel naranja de SMB con tornillos en las esquinas. Fondo cielo azul con nubes pixel y piso de ladrillo.
- **Iconos pixel-art (set de items RPG, estilo retro):** matrices en código, NO librería de iconos. Set base y su mapeo:
  - ❤️ **corazón** → Vínculo
  - ⭐ **estrella** → logro / día perfecto
  - ⚔️ **espada** → Fuerza
  - ⚗️ **poción** → Vitalidad
  - 💎 **diamante** → legendario / premium
  - 📦 **cofre** → recompensa / desbloqueo de hito
  - 🔑 **llave** / 🔒 **candado** → desbloqueado / bloqueado
- Sprites e iconos con `image-rendering: pixelated`. Animación con propósito: monedas/estrellas al día perfecto, "LEVEL UP" estilo NES al subir nivel, cofre que se abre al desbloquear outfit. `prefers-reduced-motion` respetado.

---

## 12. Plan de desarrollo mock-first (patrón Forja)

- **Phase A** — UI + navegación con **mock data** (`USE_MOCK=true`). Semilla **a mitad del reto** (día ~40): niveles medios, logros y outfits desbloqueados, avatares con outfit puesto.
- **Phase B** — engine completo sobre mock (XP, niveles, evaluación de día, reinicio solidario, logros, **desbloqueo de outfits**, rachas). Tests del engine puro.
- **Phase C** — Firebase (Auth, Firestore, Storage), persistencia offline, deploy.

Orden: Auth → layout/nav → Hoy → Mi personaje → **Vestidor + render de avatar** → Pareja → Calendario → Logros → Historial → Ajustes. Commits por feature, preview deploy en cada push.

---

## 13. Decisiones (cerradas ✅)

1. **Fallo en pareja:** solidario (uno falla → reinician los dos).
2. **Fotos:** privadas por jugador, opcionales.
3. **Nombre:** Reto 75 Juntos.
4. **Arranque:** al login de ambos (`retoInicio = now`, día 1).
5. **Foto** no cuenta para "día cumplido" (solo bonus).
6. **Avatares:** pixel-art 8-bit, sprite-data en código, outfits desbloqueables por hito/nivel/logro, sin moneda en V1.

---

## 14. Siguiente paso

CLAUDE.md y planning.md ya actualizados con todo esto. Arranque sugerido: **prompt de Fase 0** (setup + mock + sprite-data base) → **Sesión A1** (Auth + layout).
