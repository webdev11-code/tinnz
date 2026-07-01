import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const BACKUP_KEY = "tinnz_backup_history";
const BACKUP_INTERVAL_MS = 24 * 60 * 60 * 1000;
const DB_NAME = "tinnz-backups";
const STORE_NAME = "backups";

export interface BackupRecord {
  timestamp: string;
  date: string;
  size: string;
  collections: number;
  hasData?: boolean;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "timestamp" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveBackupData(timestamp: string, json: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({ timestamp, data: json });
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

async function getBackupData(timestamp: string): Promise<string | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(timestamp);
    req.onsuccess = () => { db.close(); resolve(req.result?.data ?? null); };
    req.onerror = () => { db.close(); reject(req.error); };
  });
}

async function deleteBackupData(timestamp: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).delete(timestamp);
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function exportAllCollections(): Promise<void> {
  const collectionsToExport = [
    "products", "team_members", "contacts", "orders",
    "sponsors", "reviews", "faqs", "terms", "comparisons"
  ];

  const data: Record<string, unknown[]> = {};

  for (const name of collectionsToExport) {
    try {
      const snap = await getDocs(collection(db, name));
      data[name] = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    } catch {
      data[name] = [];
    }
  }

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  a.href = url;
  a.download = `tinnz-backup-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);

  const timestamp = new Date().toISOString();
  const record: BackupRecord = {
    timestamp,
    date: new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    size: formatBytes(blob.size),
    collections: collectionsToExport.length,
    hasData: true,
  };

  const history = getBackupHistory();
  history.unshift(record);
  localStorage.setItem(BACKUP_KEY, JSON.stringify(history.slice(0, 10)));

  await saveBackupData(timestamp, json);

  renderBackupHistory();
}

export function getBackupHistory(): BackupRecord[] {
  try {
    const raw = localStorage.getItem(BACKUP_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getTodaySixPM(): Date {
  const d = new Date();
  d.setHours(18, 0, 0, 0);
  return d;
}

export function shouldAutoBackup(): boolean {
  const now = new Date();
  const todaySixPM = getTodaySixPM();
  if (now < todaySixPM) return false;

  const history = getBackupHistory();
  if (history.length === 0) return true;

  const lastBackup = new Date(history[0].timestamp);
  return lastBackup < todaySixPM;
}

export function msUntilSixPM(): number {
  const now = Date.now();
  const sixPM = getTodaySixPM().getTime();
  if (now < sixPM) return sixPM - now;
  return sixPM + 86400000 - now;
}

export function startScheduler(callback: () => void): () => void {
  const interval = setInterval(() => {
    if (shouldAutoBackup()) {
      callback();
    }
  }, 60_000);
  const timeout = setTimeout(() => {
    callback();
  }, msUntilSixPM());

  return () => {
    clearInterval(interval);
    clearTimeout(timeout);
  };
}

(window as any).deleteBackupEntry = async (index: number) => {
  const history = getBackupHistory();
  if (index < 0 || index >= history.length) return;
  const [removed] = history.splice(index, 1);
  localStorage.setItem(BACKUP_KEY, JSON.stringify(history));
  if (removed?.timestamp) {
    await deleteBackupData(removed.timestamp).catch(() => {});
  }
  renderBackupHistory();
};

(window as any).downloadBackupEntry = async (index: number) => {
  const history = getBackupHistory();
  if (index < 0 || index >= history.length) return;
  const record = history[index];
  const data = await getBackupData(record.timestamp);
  if (!data) {
    alert("Data backup tidak ditemukan.");
    return;
  }
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const dateStr = record.timestamp.replace(/[:.]/g, "-").slice(0, 19);
  a.href = url;
  a.download = `tinnz-backup-${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export function renderBackupHistory(): void {
  const container = document.getElementById("backup-history");
  if (!container) return;
  const history = getBackupHistory();
  if (history.length === 0) {
    container.innerHTML = `<p class="text-xs text-[var(--text-secondary)] font-mono">Belum ada backup.</p>`;
    return;
  }
  container.innerHTML = history.map((r, i) => `
    <div class="flex items-center justify-between py-2.5 px-3.5 rounded-lg border border-[var(--border-color)] ${i === 0 ? "bg-blue-500/5 border-blue-500/20" : ""}">
      <div class="flex items-center gap-3">
        <i class="fas fa-file-archive text-xs ${i === 0 ? "text-blue-400" : "text-[var(--text-secondary)]"}"></i>
        <div>
          <p class="text-xs font-bold text-[var(--text-primary)]">${r.date}</p>
          <p class="text-[10px] font-mono text-[var(--text-secondary)]">${r.collections} collections &middot; ${r.size}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        ${i === 0 ? '<span class="text-[9px] font-mono font-bold uppercase text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">Terbaru</span>' : ""}
        ${r.hasData ? `<button onclick="downloadBackupEntry(${i})" class="p-1.5 rounded text-cyan-400 hover:bg-cyan-500/10 transition-all" title="Download">
          <i class="fas fa-download text-[10px]"></i>
        </button>` : ""}
        <button onclick="deleteBackupEntry(${i})" class="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-all" title="Hapus">
          <i class="fas fa-trash-alt text-[10px]"></i>
        </button>
      </div>
    </div>
  `).join("");
}
