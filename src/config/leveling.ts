// Curva de nivel del engine RPG. XP individual y permanente.
// xpParaNivel(n) = round(100 * n^1.5)

export const xpParaNivel = (n: number): number => Math.round(100 * Math.pow(n, 1.5));

export const nivelDesdeXp = (xp: number): number => {
  let n = 1;
  while (xp >= xpParaNivel(n + 1)) n++;
  return n;
};

/** Progreso [0..1] dentro del nivel actual, para barras de XP. */
export const progresoNivel = (xp: number): number => {
  const n = nivelDesdeXp(xp);
  const lo = xpParaNivel(n);
  const hi = xpParaNivel(n + 1);
  return hi === lo ? 1 : (xp - lo) / (hi - lo);
};
