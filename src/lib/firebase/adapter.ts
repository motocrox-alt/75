// Selector de adapter: mock o Firestore según USE_MOCK. La anotación de tipo
// fuerza que firestoreAdapter implemente EXACTAMENTE la interfaz del mock.
import { USE_MOCK, mockAdapter } from "@/lib/firebase/mockAdapter";
import { firestoreAdapter } from "@/lib/firebase/firestoreAdapter";

export const adapter: typeof mockAdapter = USE_MOCK ? mockAdapter : firestoreAdapter;
export { USE_MOCK };
