// config/sprites/sprites.ts
// Sprite-data validado para "Reto 75 Juntos" (estilo NES / Super Mario Bros).
// Cada sprite es una matriz de strings; cada caracter = un índice de color de su paleta; '.' = transparente.
// Render: dibujar celda por celda en <canvas> con image-rendering: pixelated, escala x6–x12.
// Estos son los assets YA APROBADOS en los prototipos — NO redibujar, usar tal cual.

export type Sprite = { data: string[]; colors: Record<string, string>; unlockDay?: number };
export type CharDef = { name: string; skin: string; skinShadow: string; hair: string };

const W = 16;
const AV_H = 24; // alto de los avatares
const IC_H = 16; // alto de los iconos

/** Normaliza una matriz a W de ancho y `h` de alto (rellena con transparente). */
export const pad = (a: string[], h: number = AV_H): string[] => {
  const r = a.slice(0, h);
  while (r.length < h) r.push('.'.repeat(W));
  return r.map((s) => (s + '.'.repeat(W)).slice(0, W));
};

// ──────────────────────────────────────────────────────────
// PERSONAJES
// ──────────────────────────────────────────────────────────
export const CHARS: Record<string, CharDef> = {
  gio:   { name: 'Gio',   skin: '#F2CC9C', skinShadow: '#D8A876', hair: '#4A3525' },
  jenni: { name: 'Jenni', skin: '#F8D8B4', skinShadow: '#E0B488', hair: '#2E2018' },
};

/** Paleta base por personaje. La capa de pelo usa 'H'; los outfits usan 'S' para las manos. */
export const basePalette = (c: CharDef): Record<string, string> => ({
  O: '#201A10', // outline
  S: c.skin,
  D: c.skinShadow,
  E: '#201A10', // ojos
  M: '#E86A7A', // rubor / boca
  U: '#3A2A1E', // zapato
  o: '#201A10', // suela
  H: c.hair,    // pelo
});

// ──────────────────────────────────────────────────────────
// CUERPO BASE (16x24)
// ──────────────────────────────────────────────────────────
export const BASE: string[] = pad([
  '................', '....OOOOOOOO....', '...OSSSSSSSSO...', '..OSSSSSSSSSSO..',
  '..OSSSSSSSSSSO..', '..OSSEESSEESSO..', '..OSSSSSSSSSSO..', '..OSMSSSSSSMSO..',
  '..OSSSSMMSSSSO..', '...OSSSSSSSSO...', '.....SSSSSS.....', '..OOOOOOOOOOOO..',
  '..OSSSSSSSSSSO..', '..OSSSSSSSSSSO..', '..OSSSSSSSSSSO..', '..OSSSSSSSSSSO..',
  '..OSSSSSSSSSSO..', '...OSSSSSSSSO...', '...OSSSSSSSSO...', '....OSSOOSSO....',
  '....OSSOOSSO....', '....OSSOOSSO....', '....UUUUUUUU....', '....oo..oo......',
]);

/** BASE con los ojos cerrados (fila 5 = piel), para el parpadeo del avatar vivo. */
export const BASE_BLINK: string[] = BASE.map((r, i) => (i === 5 ? '..OSSSSSSSSSSO..' : r));

// ──────────────────────────────────────────────────────────
// PELO (overlay sobre el cuerpo)  — slot: hair
// ──────────────────────────────────────────────────────────
export const HAIR: Record<string, string[]> = {
  corto:  pad(['', '....HHHHHHHH....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '..HH........HH..', '..H..........H..']),
  largo:  pad(['', '....HHHHHHHH....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '..HHH......HHH..', '..HH........HH..', '..HH........HH..', '..HH........HH..', '..HH........HH..', '...H........H...']),
  chongo: pad(['.....HHHH.......', '....HHHHHHHH....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '..HH........HH..', '..H..........H..']),
};
export const HAIR_LIST = [
  { id: 'corto', name: 'Corto', unlockDay: 1 },
  { id: 'largo', name: 'Largo', unlockDay: 1 },
  { id: 'chongo', name: 'Chongo', unlockDay: 14 },
];

// ──────────────────────────────────────────────────────────
// ATUENDO (cubre torso/piernas; 'S' = manos = piel del personaje)  — slot: outfit
// ──────────────────────────────────────────────────────────
export const OUTFIT: Record<string, Sprite> = {
  tee: {
    data: pad(['', '', '', '', '', '', '', '', '', '', '', '..AAAAAAAAAAAA..', '..AAAAAAAAAAAA..', '..SAAAAAAAAAAS..', '...AAAAAAAAAA...', '...GGGGGGGGGG...', '...AAAAAAAAAA...', '...PPPPPPPPPP...', '....PPP..PPP....']),
    colors: { A: '#E03B2C', G: '#FBD000', P: '#3A6FE0' }, // rojo Mario + bloque amarillo + shorts azul
  },
  hoodie: {
    data: pad(['', '', '', '', '', '', '', '', '', '', '.....BBBB.......', '..AAAAAAAAAAAA..', '..ABBBBBBBBBBA..', '..SAAAAAAAAAAS..', '...AAAAAAAAAA...', '...AAABBBBAAA...', '...AAAAAAAAAA...', '...PPPPPPPPPP...', '....PPP..PPP....', '....PPP..PPP....']),
    colors: { A: '#00A844', B: '#007A30', P: '#3A2A1E' }, // verde Luigi
  },
  gym: {
    data: pad(['', '', '', '', '', '', '', '', '', '', '', '....TTTTTTTT....', '...STTTTTTTTS...', '...STTTGGTTTS...', '...STTTTTTTTS...', '....TTTTTTTT....', '....TTTTTTTT....', '...PPPPPPPPPP...', '....PPP..PPP....']),
    colors: { T: '#201A10', G: '#FBD000', P: '#3A6FE0' }, // tank negro
  },
  dress: {
    data: pad(['', '', '', '', '', '', '', '', '', '', '', '..AAAAAAAAAAAA..', '..SAAAAAAAAAAS..', '...AAAAAAAAAA...', '...AAAAAAAAAA...', '..AAAAAAAAAAAA..', '.AAAAAAAAAAAAAA.', 'AAAAAAAAAAAAAAAA', '.BBBBBBBBBBBBBB.']),
    colors: { A: '#E03B2C', B: '#A01818' },
  },
  ember: {
    data: pad(['', '', '', '', '', '', '', '', '', '', '.....BBBB.......', '.BBAAAAAAAABB...', '..AAAAAAAAAAAA..', '..AGGGGGGGGGGA..', '..SAAAAAAAAAAS..', '...AAAAAAAAAA...', '...AAAAAAAAAA...', '...AAAAAAAAAA...', '....BBB..BBB....']),
    colors: { A: '#E8721C', B: '#8B3A0C', G: '#FBD000' },
    unlockDay: 38, // armadura — desbloqueo en el día 38
  },
  gold: {
    data: pad(['', '', '', '', '', '', '', '', '', '', '.....AAAA.......', 'RRAAAAAAAAAAAARR', 'RRAAAAAAAAAAAARR', 'R.AAAWWWWWWAAA.R', 'R.SAAAAAAAAAAS.R', 'R.AAAAAAAAAAAA.R', '..AAAAAAAAAAAA..', '...AAAAAAAAAA...', '....BBB..BBB....']),
    colors: { A: '#FBD000', B: '#C89000', W: '#FFFFFF', R: '#E03B2C' }, // armadura legendaria + capa
    unlockDay: 75, // jefe final — día 75
  },
  chaleco: { // look de Gio: camisa blanca + chaleco negro + jeans claros
    data: pad(['','','','','','','','','','','','..WWNNNNNNNNWW..','..WWNNWWWWNNWW..','..WWNNWWWWNNWW..','..SWNNWWWWNNWS..','...NNWWWWWWNN...','...WWWWWWWWWW...','...LLLLLLLLLL...','...LLLLLLLLLL...','....LLL..LLL....','....LLL..LLL....','....LLL..LLL....']),
    colors: { W: '#FFFFFF', N: '#201A10', L: '#B8C4D8' },
  },
  topblanco: { // look de Jenni: top blanco strapless + jeans azules
    data: pad(['','','','','','','','','','','','....WWWWWWWW....','...SWWWWWWWWS...','...SWWWWWWWWS...','....WWWWWWWW....','...JJJJJJJJJJ...','...JJJJJJJJJJ...','...JJJJJJJJJJ...','...JJJJJJJJJJ...','....JJJ..JJJ....','....JJJ..JJJ....','....JJJ..JJJ....']),
    colors: { W: '#FFFFFF', J: '#4A7CC0' },
  },
};
export const OUTFIT_LIST = [
  { id: 'tee', name: 'Tee', unlockDay: 1 },
  { id: 'hoodie', name: 'Hoodie', unlockDay: 1 },
  { id: 'gym', name: 'Gym', unlockDay: 1 },
  { id: 'dress', name: 'Vestido', unlockDay: 1 },
  { id: 'ember', name: 'Armadura', unlockDay: 38 },
  { id: 'gold', name: 'Legendaria', unlockDay: 75 },
  { id: 'chaleco', name: 'Chaleco', unlockDay: 1 },
  { id: 'topblanco', name: 'Top', unlockDay: 1 },
];

// ──────────────────────────────────────────────────────────
// ACCESORIO (overlay sobre cabeza/cara)  — slot: acc
// ──────────────────────────────────────────────────────────
export const ACC: Record<string, Sprite> = {
  none:    { data: pad([]), colors: {} },
  gorra:   { data: pad(['....CCCCCCCC....', '...CCCCCCCCCC...', '..CCCCCCCCCCCC..', '..CCCCCCCCCCCC..', '..BBBBBB........']), colors: { C: '#E03B2C', B: '#A01818' } },
  diadema: { data: pad(['', '', '.........CC.....', '..CCCCCCCCCCCC..']), colors: { C: '#FBD000' } },
  lentes:  { data: pad(['', '', '', '', '...LLLL.LLLL....']), colors: { L: '#201A10' } },
  lentes_sol: { // lentes de sol (look signature de Gio & Jenni)
    data: pad(['', '', '', '', '....LLLLLLLL....', '....LwL..LwL....']),
    colors: { L: '#201A10', w: '#7AA0D0' },
  },
  corona:  { data: pad(['...G.G.G.G.G....', '...GGGGGGGGG....']), colors: { G: '#FBD000' }, unlockDay: 75 },
};
export const ACC_LIST = [
  { id: 'none', name: 'Ninguno', unlockDay: 1 },
  { id: 'gorra', name: 'Gorra', unlockDay: 1 },
  { id: 'diadema', name: 'Diadema', unlockDay: 1 },
  { id: 'lentes', name: 'Lentes', unlockDay: 7 },
  { id: 'lentes_sol', name: 'Lentes de sol', unlockDay: 1 },
  { id: 'corona', name: 'Corona', unlockDay: 75 },
];

// ──────────────────────────────────────────────────────────
// ICONOS RPG (16x16) — estilo retro pixel-art
// ──────────────────────────────────────────────────────────
export const ICONS: Record<string, Sprite> = {
  // --- items / stats / logros ---
  heart:   { data: pad(['', '..kkkk..kkkk....', '.krrrrk.krrrrk..', '.krrrrrrrrrrrrk.', '.krwwrrrrrrrrk..', '.krrrrrrrrrrrk..', '..krrrrrrrrrrk..', '...krrrrrrrrk...', '....krrrrrrk....', '.....krrrrk.....', '......krrk......', '.......kk.......'], IC_H), colors: { k: '#201A10', r: '#E03B2C', w: '#FF8A7A' } },
  star:    { data: pad(['', '.......kk.......', '......kyyk......', '......kyyk......', 'kkkkkkyyykkkkkk.', 'kyyyyyyyyyyyyyk.', '.kyyyyyyyyyyyk..', '..kyyyyyyyyyk...', '...kyyyyyyyk....', '...kyyk.kyyk....', '..kyyk...kyyk...', '..kyk.....kyk..', '.kk.......kk...'], IC_H), colors: { k: '#201A10', y: '#FBD000' } },
  sword:   { data: pad(['.......kk.......', '......kbbk......', '......kbbk......', '......kbbk......', '......kbbk......', '......kbbk......', '......kbbk......', '......kbbk......', '....kggggggk....', '......khhk......', '......khhk......', '......khhk.....', '.......kk.......'], IC_H), colors: { k: '#201A10', b: '#C8D0D8', g: '#FBD000', h: '#8B4513' } },
  potion:  { data: pad(['', '......kkkk......', '.......nn.......', '......knnk......', '.....knnnnk.....', '....knllllnk....', '...knlllllllnk..', '..knlllllllllnk.', '..knLLLLLLLLLnk.', '..knLLLLLLLLLnk.', '...knLLLLLLLnk..', '....knLLLLLnk...', '.....kknnkk.....'], IC_H), colors: { k: '#201A10', n: '#BFE0FF', l: '#5CC8F0', L: '#2080C0' } },
  diamond: { data: pad(['', '..kkkkkkkkkkkk..', '.kccccccccccck.', '.kcwwccccddck..', '..kccccccccck...', '...kcccccck.....', '....kcccck......', '.....kcck.......', '......kk........'], IC_H), colors: { k: '#201A10', c: '#5CC8E0', w: '#B0F0FF', d: '#2A8CB0' } },
  chest:   { data: pad(['', '...kkkkkkkkkk...', '..kbbbbbbbbbbk..', '..kbggggggggbk.', '..kbbbbbbbbbbk..', '..kkkkkkkkkkkk..', '..kbbbbggbbbbk..', '..kbbbgLLgbbbk..', '..kbbbbggbbbbk..', '..kbbbbbbbbbbk..', '..kkkkkkkkkkkk..'], IC_H), colors: { k: '#201A10', b: '#A0631E', g: '#FBD000', L: '#C89000' } },
  key:     { data: pad(['', '....kkkk........', '...kgggdk.......', '...kg..gk.......', '...kgggdk.......', '....kggk........', '.....kgk........', '.....kgk........', '.....kggk.......', '.....kgk........', '.....kggk.......', '.....kkk........'], IC_H), colors: { k: '#201A10', g: '#FBD000', d: '#C89000' } },
  lock:    { data: pad(['', '', '....kkkkk.......', '...kg...gk......', '...kg...gk......', '..kkkkkkkkk.....', '..kyyyyyyyk.....', '..kyykkyyk......', '..kyk.kyyk.....', '..kyyyyyyyk.....', '..kkkkkkkkk....'], IC_H), colors: { k: '#201A10', g: '#C0C0C0', y: '#FBD000' } },
  // --- iconos de misión diaria ---
  mug:     { data: pad(['', '..kkkkkkkk......', '..kwwwwwwk......', '..kaaaaaakkk....', '..kaaaaaak.kk...', '..kaaaaaak.kk...', '..kaaaaaakkk....', '..kaaaaaak......', '..kaaaaaak......', '..kkkkkkkk......'], IC_H), colors: { k: '#201A10', w: '#FFFFFF', a: '#E8A020' } },
  apple:   { data: pad(['', '......kk........', '.....kgk........', '...kkrrkkk......', '..krrrrrrrk.....', '.krrrrrrrrrk....', '.krwrrrrrrrk....', '.krrrrrrrrrk....', '.krrrrrrrrrk....', '..krrrrrrrk.....', '..krrrrrrrk.....', '...krrrrrk......', '....kk.kk.......'], IC_H), colors: { k: '#201A10', r: '#E03B2C', w: '#FF8A7A', g: '#00A844' } },
  book:    { data: pad(['', '', '...kkkkkkkk.....', '..kbbbbbbbbk....', '..kbwwwwwwbk....', '..kbwllllwbk....', '..kbwwwwwwbk....', '..kbwllllwbk....', '..kbwwwwwwbk....', '..kbbbbbbbbk....', '...kkkkkkkk....'], IC_H), colors: { k: '#201A10', b: '#3A6FE0', w: '#FFFFFF', l: '#5C94FC' } },
  camera:  { data: pad(['', '......kkkk......', '...kkkkkkkkkk...', '..kbbbbbbbbbbk..', '..kbbkllllkbbk..', '..kbklccclkbbk..', '..kbklccclkbbk..', '..kbbkllllkbbk..', '..kbbbbbbbbbbk..', '...kkkkkkkkkk...'], IC_H), colors: { k: '#201A10', b: '#404048', l: '#C0C0C0', c: '#5CC8E0' } },
  coin:    { data: pad(['', '', '....kkkkkk......', '...kyyyyyyk.....', '..kyyddddyyk....', '..kyydddddyk....', '..kyydddddyk....', '..kyyddddyyk....', '...kyyyyyyk.....', '....kkkkkk......'], IC_H), colors: { k: '#201A10', y: '#FBD000', d: '#C89000' } },
};

/** Misión diaria → icono. */
export const MISSION_ICON: Record<string, keyof typeof ICONS> = {
  entrenar: 'sword',
  chela: 'mug',
  comer: 'apple',
  agua: 'potion',
  leer: 'book',
  foto: 'camera',
};

/** Stat → icono. */
export const STAT_ICON: Record<string, keyof typeof ICONS> = {
  fuerza: 'sword',
  templanza: 'mug',
  vitalidad: 'potion',
  mente: 'book',
  constancia: 'camera',
  vinculo: 'heart',
};

// ──────────────────────────────────────────────────────────
// RENDER (canvas)
// ──────────────────────────────────────────────────────────
/** Dibuja una capa de sprite en un contexto 2D. */
export function drawLayer(
  ctx: CanvasRenderingContext2D,
  data: string[],
  colors: Record<string, string>,
  scale: number,
): void {
  for (let y = 0; y < data.length; y++) {
    const row = data[y];
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const col = colors[ch];
      if (!col) continue;
      ctx.fillStyle = col;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}

/** Compone y dibuja un avatar completo (base + pelo + outfit + accesorio). */
export function renderAvatar(
  canvas: HTMLCanvasElement,
  charKey: keyof typeof CHARS,
  hairId: string,
  outfitId: string,
  accId: string,
  scale: number,
  blink: boolean = false,
): void {
  const c = CHARS[charKey];
  const base = basePalette(c);
  canvas.width = W * scale;
  canvas.height = AV_H * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawLayer(ctx, blink ? BASE_BLINK : BASE, base, scale);
  if (HAIR[hairId]) drawLayer(ctx, HAIR[hairId], base, scale);
  const o = OUTFIT[outfitId];
  if (o) drawLayer(ctx, o.data, { ...base, ...o.colors }, scale);
  const a = ACC[accId];
  if (a && accId !== 'none') drawLayer(ctx, a.data, { ...base, ...a.colors }, scale);
}

/** Dibuja un icono RPG. */
export function renderIcon(canvas: HTMLCanvasElement, name: keyof typeof ICONS, scale: number): void {
  const ic = ICONS[name];
  canvas.width = W * scale;
  canvas.height = IC_H * scale;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  drawLayer(ctx, ic.data, ic.colors, scale);
}
