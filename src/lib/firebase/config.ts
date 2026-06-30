// Inicialización de Firebase (lazy: nada corre hasta que se usa, así el build
// con USE_MOCK no necesita credenciales). Los valores vienen de env públicos.
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const cfg = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | null = null;

export function firebaseApp(): FirebaseApp {
  if (!cfg.apiKey) {
    throw new Error("Firebase no configurado: faltan las env NEXT_PUBLIC_FIREBASE_*");
  }
  app ??= getApps().length ? getApp() : initializeApp(cfg as Record<string, string>);
  return app;
}

export const firebaseAuth = (): Auth => getAuth(firebaseApp());
export const firestore = (): Firestore => getFirestore(firebaseApp());
export const firebaseStorage = (): FirebaseStorage => getStorage(firebaseApp());

/** Mapeo correo → personaje (los dos correos van en env). */
export const charDeEmail = (email: string | null | undefined): "gio" | "jenni" | null => {
  if (!email) return null;
  const e = email.toLowerCase();
  if (e === (process.env.NEXT_PUBLIC_EMAIL_GIO ?? "").toLowerCase()) return "gio";
  if (e === (process.env.NEXT_PUBLIC_EMAIL_JENNI ?? "").toLowerCase()) return "jenni";
  return null;
};
