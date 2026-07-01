import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const __dirname = dirname(fileURLToPath(import.meta.url));

const config = JSON.parse(readFileSync(join(__dirname, "firebase-applet-config.json"), "utf-8"));
const databaseId = config.firestoreDatabaseId;

const app = initializeApp(config);
const db = getFirestore(app, databaseId);
const auth = getAuth(app);

const COLLECTIONS = [
  "products", "team_members", "contacts", "orders",
  "sponsors", "reviews", "faqs", "terms"
];

const ORDER_FIELDS = {
  products: "order",
  team_members: "order",
  sponsors: "order",
  reviews: "order",
  faqs: "order",
  terms: "order",
  contacts: "created_at",
  orders: "created_at",
};

async function main() {
  try {
    await signInAnonymously(auth);
    console.log("Authenticated successfully\n");
  } catch (err) {
    console.warn("Auth warning (proceeding anyway):", err.message);
  }

  const backupDir = join(__dirname, "firebase-backup");
  mkdirSync(backupDir, { recursive: true });

  const allData = {};
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  for (const col of COLLECTIONS) {
    process.stdout.write(`Exporting ${col}... `);
    try {
      const orderField = ORDER_FIELDS[col] || "order";
      const q = query(collection(db, col), orderBy(orderField, "asc"));
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      allData[col] = docs;
      writeFileSync(join(backupDir, `${col}.json`), JSON.stringify(docs, null, 2));
      console.log(`${docs.length} documents`);
    } catch (err) {
      console.error(`FAILED: ${err.message}`);
      allData[col] = [];
    }
    await new Promise(r => setTimeout(r, 500));
  }

  writeFileSync(join(backupDir, `full-backup-${timestamp}.json`), JSON.stringify(allData, null, 2));
  console.log(`\nDone! Backup saved to firebase-backup/ (${timestamp})`);
}

main().catch(console.error);
