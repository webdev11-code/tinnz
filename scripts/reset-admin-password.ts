import { initializeApp, cert } from "firebase-admin";
import { getAuth } from "firebase-admin/auth";
import { readFileSync } from "fs";
import { resolve } from "path";

const args = process.argv.slice(2);
const serviceAccountPath = args[0];
const newPassword = args[1];
const email = args[2] || "admin@tinnzstore.com";

if (!serviceAccountPath || !newPassword) {
  console.error("Usage: npx tsx scripts/reset-admin-password.ts <path-to-service-account.json> <new-password> [email]");
  console.error("Example: npx tsx scripts/reset-admin-password.ts ./service-account.json tinnz123321#");
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(resolve(serviceAccountPath), "utf-8"));

initializeApp({
  credential: cert(serviceAccount),
});

const auth = getAuth();

try {
  const user = await auth.getUserByEmail(email);
  await auth.updateUser(user.uid, { password: newPassword });
  console.log(`Password untuk ${email} berhasil diubah.`);
} catch (err: any) {
  if (err.code === "auth/user-not-found") {
    console.error(`User dengan email ${email} tidak ditemukan.`);
  } else {
    console.error("Gagal mengubah password:", err.message);
  }
  process.exit(1);
}
