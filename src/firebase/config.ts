import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import firebaseConfig from "../../firebase-applet-config.json";

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const databaseId = (firebaseConfig as { firestoreDatabaseId?: string }).firestoreDatabaseId || firebaseConfig.firestoreDatabaseId;
const db = getFirestore(app, databaseId);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };

export const ADMIN_EMAILS = [
  "tinnzstore.id@gmail.com",
];
