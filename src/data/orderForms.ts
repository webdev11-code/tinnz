import { Plan } from "./plans";

interface OrderField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "select";
  required: boolean;
  placeholder: string;
  options?: { label: string; value: string }[];
  tab: "new" | "renewal" | "both";
}

type MessageFn = (plan: Plan, v: Record<string, string>) => string;

const priceLine = (plan: Plan, v: Record<string, string>) => {
  if (v._discountFinal) {
    return `💰 *Harga:* Rp ${Number(v._discountOriginal).toLocaleString("id-ID")} → Rp ${Number(v._discountFinal).toLocaleString("id-ID")}`;
  }
  return `💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")}`;
};

const promoLine = (v: Record<string, string>, key = "promo") => {
  const code = v[key] || "(tidak ada)";
  if (v._discountLabel) {
    return `🏷️ *Kode Promo:* ${code} (${v._discountLabel})`;
  }
  return `🏷️ *Kode Promo:* ${code}`;
};

interface OrderFormConfig {
  fields: OrderField[];
  newOrderMessage: MessageFn;
  renewalMessage: MessageFn;
}

const baseFields: OrderField[] = [
  { key: "name", label: "Nama Lengkap", type: "text", required: true, placeholder: "Nama lengkap Anda", tab: "new" },
  { key: "email", label: "Email Aktif", type: "email", required: true, placeholder: "Alamat email aktif Anda", tab: "new" },
  { key: "whatsapp", label: "Nomor WhatsApp", type: "tel", required: true, placeholder: "Contoh: 087844812351", tab: "new" },
  { key: "usernamePanel", label: "Username Panel", type: "text", required: true, placeholder: "Username panel Anda", tab: "new" },
  { key: "promo", label: "Kode Promo (opsional)", type: "text", required: false, placeholder: "Masukkan kode promo jika ada", tab: "new" },
  { key: "renewalName", label: "Nama Lengkap", type: "text", required: true, placeholder: "Nama lengkap Anda", tab: "renewal" },
  { key: "renewalEmail", label: "Email Aktif", type: "email", required: true, placeholder: "Alamat email aktif Anda", tab: "renewal" },
  { key: "renewalWhatsapp", label: "Nomor WhatsApp", type: "tel", required: true, placeholder: "Contoh: 087844812351", tab: "renewal" },
  { key: "serverId", label: "Server ID / UUID Server", type: "text", required: true, placeholder: "Masukkan ID server Anda", tab: "renewal" },
  { key: "initialCost", label: "Biaya Pembelian Awal", type: "text", required: true, placeholder: "Contoh: 120000", tab: "renewal" },
  { key: "renewalPromo", label: "Kode Promo (opsional)", type: "text", required: false, placeholder: "Masukkan kode promo jika ada", tab: "renewal" },
];

export const appOrderForm: OrderFormConfig = {
  fields: [
    ...baseFields,
    {
      key: "software",
      label: "Software",
      type: "select",
      required: true,
      placeholder: "Pilih software",
      options: [
        { label: "Node.js", value: "Node.js" },
        { label: "PythonGeneric", value: "PythonGeneric" },
        { label: "BunJS", value: "BunJS" },
        { label: "Nginx Egg", value: "Nginx Egg" },
        { label: "MariaDB", value: "MariaDB" },
        { label: "MongoDB", value: "MongoDB" },
        { label: "Redis", value: "Redis" },
        { label: "Rust Generic", value: "Rust Generic" },
      ],
      tab: "new",
    },
  ],
  newOrderMessage: (plan, v) =>
    `*Pemesanan App Hosting*

Halo Kak, saya ingin memesan app hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
${priceLine(plan, v)}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.name}
📧 *Email:* ${v.email}
📱 *WhatsApp:* ${v.whatsapp}
━━━━━━━━━━━━━━━
🔑 *Username Panel:* ${v.usernamePanel}
🖥️ *Software:* ${v.software || "-"}
${promoLine(v)}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
  renewalMessage: (plan, v) =>
    `*Perpanjangan App Hosting*

Halo Kak, saya ingin memperpanjang app hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.renewalName}
📧 *Email:* ${v.renewalEmail}
📱 *WhatsApp:* ${v.renewalWhatsapp}
━━━━━━━━━━━━━━━
🆔 *Server ID / UUID:* ${v.serverId}
💳 *Biaya Awal:* Rp ${v.initialCost}
${promoLine(v, "renewalPromo")}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
};

export const webOrderForm: OrderFormConfig = {
  fields: [
    ...baseFields.filter((f) => f.key !== "usernamePanel"),
    {
      key: "domain",
      label: "Nama Domain",
      type: "text",
      required: true,
      placeholder: "contoh: domainkamu.com",
      tab: "new",
    },
    {
      key: "cms",
      label: "CMS / Platform",
      type: "select",
      required: true,
      placeholder: "Pilih CMS / platform",
      options: [
        { label: "WordPress", value: "WordPress" },
        { label: "Laravel", value: "Laravel" },
        { label: "PHP Native", value: "PHP Native" },
        { label: "Node.js", value: "Node.js" },
        { label: "HTML Static", value: "HTML Static" },
        { label: "Lainnya", value: "Lainnya" },
      ],
      tab: "new",
    },
  ],
  newOrderMessage: (plan, v) =>
    `*Pemesanan Web Hosting*

Halo Kak, saya ingin memesan web hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
${priceLine(plan, v)}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.name}
📧 *Email:* ${v.email}
📱 *WhatsApp:* ${v.whatsapp}
━━━━━━━━━━━━━━━
🌐 *Domain:* ${v.domain || "-"}
🛠️ *CMS / Platform:* ${v.cms || "-"}
${promoLine(v)}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
  renewalMessage: (plan, v) =>
    `*Perpanjangan Web Hosting*

Halo Kak, saya ingin memperpanjang web hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.renewalName}
📧 *Email:* ${v.renewalEmail}
📱 *WhatsApp:* ${v.renewalWhatsapp}
━━━━━━━━━━━━━━━
🆔 *Server ID / UUID:* ${v.serverId}
💳 *Biaya Awal:* Rp ${v.initialCost}
${promoLine(v, "renewalPromo")}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
};

export const hytaleOrderForm: OrderFormConfig = {
  fields: [
    ...baseFields,
    {
      key: "software",
      label: "Software",
      type: "select",
      required: true,
      placeholder: "Pilih software",
      options: [
        { label: "Hytale Vanilla", value: "Hytale Vanilla" },
        { label: "Hytale Mods/Plugins", value: "Hytale Mods/Plugins" },
      ],
      tab: "new",
    },
  ],
  newOrderMessage: (plan, v) =>
    `*Pemesanan Hytale Hosting*

Halo Kak, saya ingin memesan hytale hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
${priceLine(plan, v)}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.name}
📧 *Email:* ${v.email}
📱 *WhatsApp:* ${v.whatsapp}
━━━━━━━━━━━━━━━
🔑 *Username Panel:* ${v.usernamePanel}
🖥️ *Software:* ${v.software || "-"}
${promoLine(v)}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
  renewalMessage: (plan, v) =>
    `*Perpanjangan Hytale Hosting*

Halo Kak, saya ingin memperpanjang hytale hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.renewalName}
📧 *Email:* ${v.renewalEmail}
📱 *WhatsApp:* ${v.renewalWhatsapp}
━━━━━━━━━━━━━━━
🆔 *Server ID / UUID:* ${v.serverId}
💳 *Biaya Awal:* Rp ${v.initialCost}
${promoLine(v, "renewalPromo")}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
};

export const terrariaOrderForm: OrderFormConfig = {
  fields: [
    ...baseFields,
    {
      key: "software",
      label: "Software",
      type: "select",
      required: true,
      placeholder: "Pilih software",
      options: [
        { label: "Vanilla Terraria", value: "Vanilla Terraria" },
        { label: "TShock", value: "TShock" },
        { label: "TModLoader", value: "TModLoader" },
      ],
      tab: "new",
    },
  ],
  newOrderMessage: (plan, v) =>
    `*Pemesanan Terraria Hosting*

Halo Kak, saya ingin memesan terraria hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
${priceLine(plan, v)}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.name}
📧 *Email:* ${v.email}
📱 *WhatsApp:* ${v.whatsapp}
━━━━━━━━━━━━━━━
🔑 *Username Panel:* ${v.usernamePanel}
🖥️ *Software:* ${v.software || "-"}
${promoLine(v)}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
  renewalMessage: (plan, v) =>
    `*Perpanjangan Terraria Hosting*

Halo Kak, saya ingin memperpanjang terraria hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.renewalName}
📧 *Email:* ${v.renewalEmail}
📱 *WhatsApp:* ${v.renewalWhatsapp}
━━━━━━━━━━━━━━━
🆔 *Server ID / UUID:* ${v.serverId}
💳 *Biaya Awal:* Rp ${v.initialCost}
${promoLine(v, "renewalPromo")}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
};

export const sampOrderForm: OrderFormConfig = {
  fields: [
    ...baseFields,
    {
      key: "software",
      label: "Software",
      type: "select",
      required: true,
      placeholder: "Pilih software",
      options: [
        { label: "SA:MP Official Server", value: "SA:MP Official Server" },
        { label: "open.mp Server", value: "open.mp Server" },
        { label: "SA:MP Legacy/Custom Build", value: "SA:MP Legacy/Custom Build" },
      ],
      tab: "new",
    },
  ],
  newOrderMessage: (plan, v) =>
    `*Pemesanan SAMP Hosting*

Halo Kak, saya ingin memesan SAMP hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
${priceLine(plan, v)}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.name}
📧 *Email:* ${v.email}
📱 *WhatsApp:* ${v.whatsapp}
━━━━━━━━━━━━━━━
🔑 *Username Panel:* ${v.usernamePanel}
🖥️ *Software:* ${v.software || "-"}
${promoLine(v)}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
  renewalMessage: (plan, v) =>
    `*Perpanjangan SAMP Hosting*

Halo Kak, saya ingin memperpanjang SAMP hosting!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")}
━━━━━━━━━━━━━━━
👤 *Nama:* ${v.renewalName}
📧 *Email:* ${v.renewalEmail}
📱 *WhatsApp:* ${v.renewalWhatsapp}
━━━━━━━━━━━━━━━
🆔 *Server ID / UUID:* ${v.serverId}
💳 *Biaya Awal:* Rp ${v.initialCost}
${promoLine(v, "renewalPromo")}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`,
};
