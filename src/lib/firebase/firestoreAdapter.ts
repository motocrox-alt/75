// Adapter REAL de Firestore. Gemelo del mockAdapter (misma interfaz). Append-only
// en xpLog/achievements/wardrobe/intentos; caches en players/{uid} y pacto.
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase/config";
import {
  PactoSchema,
  PlayerSchema,
  DayLogSchema,
  IntentoSchema,
  type Pacto,
  type Player,
  type DayLog,
  type XpLogEntry,
  type DiaEstado,
  type Intento,
} from "@/lib/schemas";
import type { MicroRacha } from "@/lib/game/streaks";
import { RETO_DIAS } from "@/config/rules";
import { evaluarDia } from "@/lib/game/evaluarDia";
import { hoyKey } from "@/lib/utils/date";

export const PACTO_ID = "principal";

const db = () => firestore();
const pactoRef = () => doc(db(), "pacto", PACTO_ID);
const playerRef = (uid: string) => doc(db(), "players", uid);
const microRef = (uid: string) => doc(db(), "players", uid, "meta", "microRachas");

const PACTO_DEFAULT: Pacto = {
  retoInicio: null,
  retoDiaActual: 0,
  retoEstado: "pendiente",
  intentoActual: 1,
  vinculoXp: 0,
  vinculoNivel: 1,
  jugadores: [],
};

export const firestoreAdapter = {
  async getPacto(): Promise<Pacto> {
    const snap = await getDoc(pactoRef());
    if (!snap.exists()) return { ...PACTO_DEFAULT };
    return PactoSchema.parse(snap.data());
  },

  async updatePacto(pacto: Pacto): Promise<void> {
    await setDoc(pactoRef(), pacto, { merge: true });
  },

  async getPlayer(uid: string): Promise<Player | null> {
    const snap = await getDoc(playerRef(uid));
    if (!snap.exists()) return null;
    return PlayerSchema.parse(snap.data());
  },

  async updatePlayerCache(uid: string, player: Player): Promise<void> {
    await setDoc(playerRef(uid), player, { merge: true });
  },

  async getDayLog(uid: string, dayKey: string): Promise<DayLog | null> {
    const snap = await getDoc(doc(db(), "players", uid, "dayLogs", dayKey));
    if (!snap.exists()) return null;
    return DayLogSchema.parse(snap.data());
  },

  async setDayLog(uid: string, dayKey: string, log: DayLog): Promise<void> {
    await setDoc(doc(db(), "players", uid, "dayLogs", dayKey), log);
  },

  async appendXpLog(uid: string, entries: XpLogEntry[]): Promise<void> {
    const col = collection(db(), "players", uid, "xpLog");
    await Promise.all(entries.map((e) => addDoc(col, e)));
  },

  async appendIntento(intento: Intento): Promise<void> {
    await addDoc(collection(db(), "pacto", PACTO_ID, "intentos"), intento);
  },

  async getAchievements(uid: string): Promise<string[]> {
    const snap = await getDocs(collection(db(), "players", uid, "achievements"));
    return snap.docs.map((d) => d.id);
  },

  async unlockAchievements(uid: string, ids: string[]): Promise<void> {
    await Promise.all(
      ids.map((id) =>
        setDoc(
          doc(db(), "players", uid, "achievements", id),
          { desbloqueadoEn: Date.now() },
          { merge: true },
        ),
      ),
    );
  },

  async getWardrobeIds(uid: string): Promise<string[]> {
    const snap = await getDocs(collection(db(), "players", uid, "wardrobe"));
    return snap.docs.map((d) => d.id);
  },

  async unlockWardrobe(uid: string, ids: string[]): Promise<void> {
    await Promise.all(
      ids.map((id) =>
        setDoc(
          doc(db(), "players", uid, "wardrobe", id),
          { desbloqueadoEn: Date.now() },
          { merge: true },
        ),
      ),
    );
  },

  async getMicroRachas(uid: string): Promise<Record<string, MicroRacha>> {
    const snap = await getDoc(microRef(uid));
    return snap.exists() ? (snap.data() as Record<string, MicroRacha>) : {};
  },

  async setMicroRachas(uid: string, rachas: Record<string, MicroRacha>): Promise<void> {
    await setDoc(microRef(uid), rachas);
  },

  async setAvatar(uid: string, avatar: Player["avatar"]): Promise<void> {
    await updateDoc(playerRef(uid), { avatar });
  },

  async setNombre(uid: string, nombre: string): Promise<void> {
    await updateDoc(playerRef(uid), { nombre });
  },

  async getIntentos(): Promise<Intento[]> {
    const q = query(collection(db(), "pacto", PACTO_ID, "intentos"), orderBy("numero"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => IntentoSchema.parse(d.data()));
  },

  // Heatmap reconstruido desde los dayLogs reales (mapeo reto-día → fecha via retoInicio).
  async getRetoDias(uid: string): Promise<DiaEstado[]> {
    const pacto = await this.getPacto();
    const diaActual = pacto.retoDiaActual;
    const inicio = pacto.retoInicio;

    const snap = await getDocs(collection(db(), "players", uid, "dayLogs"));
    const porKey: Record<string, DayLog> = {};
    for (const d of snap.docs) {
      const parsed = DayLogSchema.safeParse(d.data());
      if (parsed.success) porKey[d.id] = parsed.data;
    }

    const dias: DiaEstado[] = [];
    for (let d = 1; d <= RETO_DIAS; d++) {
      const key = inicio ? hoyKey(new Date(inicio + (d - 1) * 86_400_000)) : null;
      const log = key ? porKey[key] : undefined;

      if (log?.cerrado) {
        dias.push({
          dia: d,
          estado: log.perfecto ? "perfecto" : "cumplido",
          dayKey: key ?? undefined,
          resumen: { misionesOk: evaluarDia(log).misionesOk, perfecto: log.perfecto },
        });
      } else if (d === diaActual) {
        dias.push({ dia: d, estado: "hoy", dayKey: hoyKey() });
      } else {
        dias.push({ dia: d, estado: "futuro" });
      }
    }
    return dias;
  },
};
