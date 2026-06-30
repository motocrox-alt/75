# PROMPT — Fase 0: Setup de "Reto 75 Juntos"

> Pégame completo en Claude Code. Esta sesión **solo monta el esqueleto** del proyecto: stack, tokens, estructura, configs, mock, y una página `/sandbox` que renderiza los avatares e iconos para validar los assets. **No construyas pantallas reales** (Hoy, Vestidor, etc.) — eso es Fase A.

---

## Contexto

App web **co-op de pareja** para hacer el reto **75 Hard** gamificado como RPG estilo **NES / Super Mario Bros**. Dos jugadores: **Gio** y **Jenni**. Proyecto personal, una instancia, dos cuentas. **Mock-first**: nada de Firebase real en esta fase.

**Antes de empezar, lee `CLAUDE.md` en la raíz del repo** — ahí están las reglas no-negociables (append-only, no-castigo, modal solo IDs, un store por dominio, Zod en toda frontera), el modelo de datos, los design tokens NES y el sistema de avatares/iconos. Respeta ese archivo por encima de cualquier suposición.

**Archivo de assets ya hecho:** voy a colocar `sprites.ts` en `src/config/sprites/sprites.ts`. **NO lo modifiques ni redibujes los sprites** — ya están aprobados. Solo impórtalo y úsalo.

---

## Objetivo de la sesión

Al terminar:
1. `npm run dev` corre sin errores.
2. Existe la estructura de carpetas completa.
3. Tailwind v4 con los tokens NES funcionando.
4. El flag `USE_MOCK` y un `mockAdapter` con datos semilla **a mitad del reto** (día ~40).
5. Configs base (`rules`, `leveling`, `achievements`, `wardrobe`) y schemas Zod.
6. Una página **`/sandbox`** que renderiza a Gio y a Jenni (avatares pixel) + una tira con TODOS los iconos, sobre fondo NES. Esto valida que `sprites.ts` funciona en el proyecto.

---

## Stack

- Next.js (App Router) + TypeScript **strict**
- Tailwind CSS **v4** (`@custom-variant dark`)
- Zustand, Zod, Framer Motion, canvas-confetti, lottie-react, howler, Recharts, lucide-react
- Firebase (instalar, NO conectar aún), next-pwa
- Fuentes: **Press Start 2P** (títulos), **Silkscreen** (HUD/labels), **Inter** (texto)

---

## Tareas

### 1. Crear proyecto e instalar deps
```bash
npx create-next-app@latest reto75 --typescript --tailwind --app --eslint --src-dir --import-alias "@/*"
cd reto75
npm i zustand zod framer-motion canvas-confetti lottie-react howler recharts lucide-react firebase
npm i -D @types/canvas-confetti @types/howler vitest
npm i next-pwa
```
Activa TS strict en `tsconfig.json` (`"strict": true`).

### 2. Tailwind v4 + tokens NES
En `src/app/globals.css`, define los design tokens como CSS vars (paleta de `CLAUDE.md`) y habilita dark variant:
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root{
  --sky:#5C94FC; --sky-deep:#3A6FE0; --brick:#C84C0C; --brick-lt:#E8721C;
  --coin:#FBD000; --coin-dk:#C89000; --pipe:#00A844; --pipe-dk:#007A30;
  --mario:#E03B2C; --cloud:#FFFFFF; --ink:#201A10; --cream:#FCE8C8;
}
html,body{ background:var(--sky); color:var(--ink); }
canvas{ image-rendering:pixelated; }
```
Chrome NES (úsalo como guía de estilo en componentes desde Fase A): bordes negros gruesos (3–5px), **sin** border-radius, sombras duras sólidas (box-shadow sin blur, ej. `4px 4px 0 rgba(0,0,0,.3)`).

### 3. Fuentes
Carga las 3 fuentes (next/font/google o `<link>` en el layout): `Press Start 2P`, `Silkscreen`, `Inter`. Exponlas como utilidades/clases para usar después.

### 4. Estructura de carpetas
Crea esta estructura (archivos vacíos o con stub donde no haya contenido aún):
```
src/
  app/
    sandbox/page.tsx
    layout.tsx
    page.tsx
  components/   ui/  game/  partner/  charts/  avatar/
  stores/       (vacío por ahora)
  lib/
    firebase/   mockAdapter.ts
    schemas/    index.ts
    game/       (vacío; se llena en Fase B)
    avatar/     (vacío; renderAvatar vive en sprites.ts por ahora)
    utils/      date.ts
  config/
    rules.ts  leveling.ts  achievements.ts  wardrobe.ts
    sprites/  sprites.ts   ← YA EXISTE, no tocar
```

### 5. `config/leveling.ts`
```ts
export const xpParaNivel = (n: number): number => Math.round(100 * Math.pow(n, 1.5));
export const nivelDesdeXp = (xp: number): number => {
  let n = 1;
  while (xp >= xpParaNivel(n + 1)) n++;
  return n;
};
/** Progreso [0..1] dentro del nivel actual, para barras de XP. */
export const progresoNivel = (xp: number): number => {
  const n = nivelDesdeXp(xp);
  const lo = xpParaNivel(n), hi = xpParaNivel(n + 1);
  return hi === lo ? 1 : (xp - lo) / (hi - lo);
};
```

### 6. `config/rules.ts`
Define las misiones diarias y el criterio de día cumplido. La foto **NO** cuenta para cumplir el día (solo bonus). La chela cambia según el día de la semana.
```ts
export type StatId = 'fuerza'|'templanza'|'vitalidad'|'mente'|'constancia'|'vinculo';
export interface Mision {
  id: 'entrenar'|'chela'|'comer'|'agua'|'leer'|'foto';
  label: string; stat: StatId; xp: number; requiereParaDia: boolean;
}
export const MISIONES: Mision[] = [
  { id:'entrenar', label:'Entrenar (mín 1, ideal 2)', stat:'fuerza',     xp:20, requiereParaDia:true },
  { id:'chela',    label:'Chela (semana: sin / finde: juntitos)', stat:'templanza', xp:25, requiereParaDia:true },
  { id:'comer',    label:'Comer limpio', stat:'templanza', xp:20, requiereParaDia:true },
  { id:'agua',     label:'Tomar agua',   stat:'vitalidad', xp:15, requiereParaDia:true },
  { id:'leer',     label:'Leer 10 páginas', stat:'mente',  xp:20, requiereParaDia:true },
  { id:'foto',     label:'Foto de progreso (opcional)', stat:'constancia', xp:20, requiereParaDia:false },
];
export const BONUS_ENTRENO_DOBLE = 15;
export const BONUS_DIA_PERFECTO  = 30; // +Vínculo
export const RETO_DIAS = 75;
/** vie/sáb/dom = la chela es misión de pareja "juntitos"; resto = individual "sin chela". */
export const esFinde = (d: Date): boolean => [5,6,0].includes(d.getDay());
```

### 7. `config/achievements.ts`
Catálogo de logros (solo datos en Fase 0; la lógica de evaluación es Fase B). Cada uno: `id`, `nombre`, `icono` (clave de `ICONS`), `desc`.
```ts
import type { ICONS } from './sprites/sprites';
export interface Logro { id:string; nombre:string; icono:keyof typeof ICONS; desc:string }
export const LOGROS: Logro[] = [
  { id:'primer_paso',   nombre:'Primer paso',     icono:'star',  desc:'Cierra el día 1' },
  { id:'primera_semana',nombre:'La primera semana',icono:'star', desc:'7 días seguidos' },
  { id:'mitad',         nombre:'Mitad del camino', icono:'chest',desc:'Llega al día 38' },
  { id:'hidratado',     nombre:'Hidratado de acero',icono:'potion',desc:'30 días de agua sin fallar' },
  { id:'biblioteca',    nombre:'Rata de biblioteca',icono:'book',desc:'750 páginas acumuladas' },
  { id:'ritual',        nombre:'Ritual sagrado',   icono:'mug',  desc:'Primer finde con la chela juntitos' },
  { id:'sincronia',     nombre:'Sincronía',        icono:'heart',desc:'10 días los dos en verde el mismo día' },
  { id:'inquebrantables',nombre:'Inquebrantables', icono:'diamond',desc:'75 días completos (jefe final)' },
];
```

### 8. `config/wardrobe.ts`
Consolida el catálogo del vestidor a partir de las listas de `sprites.ts` (`HAIR_LIST`, `OUTFIT_LIST`, `ACC_LIST`), agregando la **fuente de desbloqueo**. Por ahora todas las condiciones son por **hito** (día), tomadas del `unlockDay`. (Nivel/logro se conectan en Fase B.)
```ts
import { HAIR_LIST, OUTFIT_LIST, ACC_LIST } from './sprites/sprites';
export type Slot = 'hair'|'outfit'|'acc';
export interface Pieza { id:string; slot:Slot; nombre:string; unlockDay:number; fuente:'base'|'hito' }
const mk = (slot:Slot) => (x:{id:string;name:string;unlockDay:number}):Pieza =>
  ({ id:x.id, slot, nombre:x.name, unlockDay:x.unlockDay, fuente: x.unlockDay>1 ? 'hito':'base' });
export const WARDROBE: Pieza[] = [
  ...HAIR_LIST.map(mk('hair')),
  ...OUTFIT_LIST.map(mk('outfit')),
  ...ACC_LIST.map(mk('acc')),
];
export const desbloqueada = (p:Pieza, diaReto:number) => diaReto >= p.unlockDay;
```

### 9. `lib/utils/date.ts`
```ts
/** ID de día local en formato yyyy-mm-dd (zona horaria del jugador). Único helper de fecha. */
export const hoyKey = (d: Date = new Date()): string => {
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
};
```

### 10. `lib/schemas/index.ts` (Zod)
Define los schemas según el modelo de datos de `CLAUDE.md` (deriva los tipos con `z.infer`):
- `AvatarSlots` = `{ piel?:string, pelo:string, outfit:string, accesorio:string }`
- `WardrobePiece` = `{ slot, fuente, desbloqueadoEn:number }`
- `DayLog` = misiones `{ entrenar:{hecho,doble}, chela:{tipo,ok}, comida:{ok}, agua:{ok}, lectura:{ok,paginas,nota?}, foto:{ok,storagePath?} }`, `cerrado`, `perfecto`, `xpGanado`, `ts`
- `Player` = `{ nombre, nivel, xp, stats:{fuerza,templanza,vitalidad,mente,constancia,vinculo}, rachaReto, ultimoDiaCerrado?, avatar:AvatarSlots }`
- `Pacto` = `{ retoInicio, retoDiaActual, retoEstado:'pendiente'|'activo'|'completado', intentoActual, vinculoXp, vinculoNivel, jugadores:string[] }`
- `Intento` = `{ numero, fechaInicio, fechaFin?, diasLogrados, quienFallo? }`

### 11. `lib/firebase/mockAdapter.ts` + `USE_MOCK`
- `export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== 'false';` (default true).
- Un adapter en memoria con métodos async que después tendrán gemelo Firebase:
  `getPacto()`, `getPlayer(uid)`, `getDayLog(uid, dayKey)`, `setDayLog(...)`, `listWardrobe(uid)`, `appendXp(...)`.
- **Datos semilla a mitad del reto (día ~40):**
  - `pacto`: `retoEstado:'activo'`, `retoDiaActual:40`, `intentoActual:2`, `jugadores:['gio','jenni']`, `vinculoXp` medio.
  - `gio`: nivel ~7, xp coherente con la curva, stats medios, `avatar:{pelo:'corto',outfit:'tee',accesorio:'none'}`, racha activa.
  - `jenni`: nivel ~6, `avatar:{pelo:'largo',outfit:'dress',accesorio:'diadema'}`.
  - `wardrobe` de cada uno: las piezas con `unlockDay<=40` ya desbloqueadas (incluye la armadura ember del día 38).
  - Unos cuantos `dayLogs` de días recientes (mezcla de perfectos y normales) para que las vistas se vean vivas en Fase A.

### 12. `app/sandbox/page.tsx` — validación visual
Página cliente (`'use client'`) que importa `renderAvatar`, `renderIcon`, `ICONS`, `CHARS` de `@/config/sprites/sprites` y, en un `useEffect` con refs a `<canvas>`:
- Renderiza el avatar de **Gio** (`'gio','corto','tee','none', 10`) y de **Jenni** (`'jenni','largo','dress','diadema', 10`), lado a lado, sobre paneles con fondo `--sky` y borde `--ink`.
- Renderiza **todos** los iconos de `ICONS` en una tira, a escala 3, cada uno con su nombre debajo (Silkscreen).
- Fondo de página azul cielo, título "RETO 75 · SANDBOX" en Press Start 2P.
Esta página es solo para QA visual de los assets; se puede borrar después.

---

## Criterios de aceptación
- [ ] `npm run dev` corre sin errores y sin warnings de TS.
- [ ] `/sandbox` muestra a Gio y a Jenni en pixel-art (con outfit y accesorio correctos) y la tira completa de iconos, todo con la paleta NES y `image-rendering: pixelated`.
- [ ] `tsc --noEmit` pasa limpio (strict).
- [ ] La estructura de carpetas coincide con la de arriba.
- [ ] `USE_MOCK` es true por default y el `mockAdapter` devuelve el estado semilla del día 40.
- [ ] `sprites.ts` quedó **intacto**.

## NO hagas en esta fase
- NO construyas las pantallas reales (Hoy, Vestidor, Personaje, etc.) — son Fase A.
- NO conectes Firebase real ni escribas reglas de seguridad — es Fase C.
- NO implementes el engine de juego (XP real, evaluación de día, reinicio) — es Fase B.
- NO modifiques `sprites.ts` ni redibujes ningún sprite.
- NO uses localStorage; el estado mock vive en memoria.

Cuando termines, dame un resumen de qué quedó montado y confirma que `/sandbox` se ve bien.
