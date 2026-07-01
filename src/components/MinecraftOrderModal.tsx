import React, { useState, useEffect } from "react";
import { Plan } from "../data/plans";
import { useTranslation } from "react-i18next";
import { PromoCodeInput, DiscountResult } from "./PromoCodeInput";
import { usePromoCodes } from "../hooks/useFirestore";

interface MinecraftOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

const getSoftwareOptions = (category?: string): string[] => {
  if (category?.startsWith("private") || category?.startsWith("minecraft")) {
    return [
      "Java - Paper",
      "Java - Sponge",
      "Java - Fabric",
      "Java - Purpur",
      "Java - Spigot",
      "Java - Mohist",
      "Java - NeoForge",
      "Java - Forge",
      "Java - Archlight",
      "Java Proxy - Bungeecord",
      "Java Proxy - Velocity",
      "Bedrock - PocketmineMP",
      "Bedrock - Vanilla Bedrock",
      "Bedrock - WaterdogPE",
    ];
  }
  if (category?.startsWith("vps")) {
    return [
      "Ubuntu 20.04 LTS",
      "Ubuntu 22.04 LTS",
      "Ubuntu 24.04 LTS",
      "Debian 11",
      "Debian 12",
      "CentOS Stream 9",
      "Rocky Linux 9",
      "AlmaLinux 9",
      "FreeBSD 13",
      "Arch Linux",
      "Windows Server 2019",
      "Windows Server 2022",
    ];
  }
  return ["Default"];
};

const getCategoryLabel = (plan: Plan): string => {
  const cat = plan.category;
  if (cat?.startsWith("vps")) {
    if (plan.id.includes("genoa")) return "VPS Genoa";
    return "VPS Milan";
  }
  if (cat?.startsWith("minecraft")) return "Hosting";
  if (cat?.startsWith("private")) return "Private Server";
  if (cat === "samp") return "SAMP Hosting";
  if (cat === "bot") return "App Hosting";
  if (cat === "web") return "Web Hosting";
  if (cat === "terraria") return "Terraria Hosting";
  if (cat === "hytale") return "Hytale Hosting";
  if (cat === "bare-metal") return "Bare Metal";
  return "Hosting";
};



type FormTab = "new" | "renewal";

export const MinecraftOrderModal: React.FC<MinecraftOrderModalProps> = ({
  isOpen,
  onClose,
  plan,
}) => {
  const { t } = useTranslation();
  const { promoCodes, incrementPromoCodeUsage } = usePromoCodes();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const [tab, setTab] = useState<FormTab>("new");

  const switchTab = (t: FormTab) => {
    setTab(t);
    setDiscountResult(null);
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [usernamePanel, setUsernamePanel] = useState("");
  const [software, setSoftware] = useState("");

  const softwareOptions = plan ? getSoftwareOptions(plan.category) : ["Default"];

  useEffect(() => {
    if (softwareOptions.length > 0 && !softwareOptions.includes(software)) {
      setSoftware(softwareOptions[0]);
    }
  }, [plan?.category]);
  const [promoCode, setPromoCode] = useState("");
  const [notes, setNotes] = useState("");

  const [renewalEmail, setRenewalEmail] = useState("");
  const [renewalWhatsapp, setRenewalWhatsapp] = useState("");
  const [renewalName, setRenewalName] = useState("");
  const [serverId, setServerId] = useState("");
  const [initialCost, setInitialCost] = useState("");
  const [renewalPromoCode, setRenewalPromoCode] = useState("");
  const [discountResult, setDiscountResult] = useState<DiscountResult | null>(null);

  const handleSubmitNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    if (discountResult) {
      incrementPromoCodeUsage(discountResult.promoCodeId);
    }

    const priceLine = discountResult
      ? `💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")} → Rp ${discountResult.discountedPrice.toLocaleString("id-ID")}`
      : `💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")}`;

    const promoLine = discountResult
      ? `🏷️ *Kode Promo:* ${promoCode} (${discountResult.type === "percent" ? `${discountResult.value}%` : `Rp ${discountResult.value.toLocaleString("id-ID")}`})`
      : `🏷️ *Kode Promo:* ${promoCode || "(tidak ada)"}`;

    const label = getCategoryLabel(plan);

    const specsLines = [
      plan.cpu && `🖥️ *CPU:* ${plan.cpu}`,
      plan.ram && `💾 *RAM:* ${plan.ram}`,
      plan.storage && `📀 *Storage:* ${plan.storage}`,
    ].filter(Boolean).join("\n");
    const specsBlock = specsLines ? `${specsLines}\n━━━━━━━━━━━━━━━\n` : "";

    const message = `*Pemesanan Paket ${label}*

Halo Kak, saya ingin memesan paket ${label.toLowerCase()}!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
${priceLine}
${specsBlock}👤 *Nama:* ${name}
📧 *Email:* ${email}
📱 *WhatsApp:* ${whatsapp}
━━━━━━━━━━━━━━━
🔑 *Username Panel:* ${usernamePanel}
🖥️ *Software Server:* ${software}
${promoLine}
📝 *Catatan:* ${notes || "(tidak ada)"}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`;

    const waLink = `https://wa.me/6287844812351?text=${encodeURIComponent(message)}`;
    window.location.href = waLink;
  };

  const handleSubmitRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;

    if (discountResult) {
      incrementPromoCodeUsage(discountResult.promoCodeId);
    }

    const priceLine = discountResult
      ? `💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")} → Rp ${discountResult.discountedPrice.toLocaleString("id-ID")}`
      : `💰 *Harga:* Rp ${plan.price_idr.toLocaleString("id-ID")}`;

    const promoLine = discountResult
      ? `🏷️ *Kode Promo:* ${renewalPromoCode} (${discountResult.type === "percent" ? `${discountResult.value}%` : `Rp ${discountResult.value.toLocaleString("id-ID")}`})`
      : `🏷️ *Kode Promo:* ${renewalPromoCode || "(tidak ada)"}`;

    const label = getCategoryLabel(plan);

    const specsLines = [
      plan.cpu && `🖥️ *CPU:* ${plan.cpu}`,
      plan.ram && `💾 *RAM:* ${plan.ram}`,
      plan.storage && `📀 *Storage:* ${plan.storage}`,
    ].filter(Boolean).join("\n");
    const specsBlock = specsLines ? `${specsLines}\n━━━━━━━━━━━━━━━\n` : "";

    const message = `*Perpanjangan Paket ${label}*

Halo Kak, saya ingin memperpanjang paket ${label.toLowerCase()}!

━━━━━━━━━━━━━━━
📦 *Paket:* ${plan.name}
${priceLine}
${specsBlock}👤 *Nama:* ${renewalName || name}
📧 *Email:* ${renewalEmail}
📱 *WhatsApp:* ${renewalWhatsapp}
━━━━━━━━━━━━━━━
🆔 *Server ID / UUID:* ${serverId}
💳 *Biaya Pembelian Awal:* Rp ${initialCost}
${promoLine}
━━━━━━━━━━━━━━━

Mohon konfirmasi agar bisa segera diproses, terima kasih 🙏`;

    const waLink = `https://wa.me/6287844812351?text=${encodeURIComponent(message)}`;
    window.location.href = waLink;
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl z-10 animate-fade-in text-[var(--text-primary)] mx-4">
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between sticky top-0 bg-[var(--bg-card)] z-20">
          <div className="flex items-center gap-2.5">
            <i className="fab fa-whatsapp text-emerald-400 text-lg" />
            <h2 className="text-base font-extrabold tracking-tight">{t("minecraft_order.title")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border hover:border-red-500 hover:text-red-500 transition-all bg-transparent border-[var(--border-color)] text-[var(--text-secondary)]"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="flex border-b border-[var(--border-color)]">
          <button
            onClick={() => switchTab("new")}
            className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
              tab === "new"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t("minecraft_order.tab_new")}
          </button>
          <button
            onClick={() => switchTab("renewal")}
            className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
              tab === "renewal"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {t("minecraft_order.tab_renewal")}
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[rgba(0,0,0,0.1)] mb-5">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                {t("minecraft_order.package")}
              </span>
              <p className="text-base font-extrabold mt-0.5">{plan.name}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                {t("minecraft_order.price")}
              </span>
              {discountResult ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[var(--text-secondary)] line-through">
                    Rp {plan.price_idr.toLocaleString("id-ID")}
                  </span>
                  <span className="text-base font-black text-emerald-400 mt-0.5">
                    Rp {discountResult.discountedPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              ) : (
                <p className="text-base font-black text-[var(--accent-blue)] mt-0.5">
                  Rp {plan.price_idr.toLocaleString("id-ID")}
                </p>
              )}
            </div>
          </div>

          {tab === "new" ? (
            <form onSubmit={handleSubmitNew} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.name")}
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("minecraft_order.name_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.email")}
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("minecraft_order.email_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.whatsapp")}
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder={t("minecraft_order.whatsapp_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.username_panel")}
                </label>
                <input
                  type="text"
                  required
                  value={usernamePanel}
                  onChange={(e) => setUsernamePanel(e.target.value)}
                  placeholder={t("minecraft_order.username_panel_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.software")}
                </label>
                <div className="relative">
                  <select
                    required
                    value={software}
                    onChange={(e) => setSoftware(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none appearance-none cursor-pointer"
                  >
                    {softwareOptions.map((opt) => (
                      <option key={opt} value={opt} className="bg-[var(--bg-card)]">
                        {opt}
                      </option>
                    ))}
                  </select>
                  <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-secondary)] pointer-events-none" />
                </div>
              </div>

              <PromoCodeInput
                value={promoCode}
                onChange={setPromoCode}
                plan={plan}
                promoCodes={promoCodes}
                onDiscountResult={setDiscountResult}
                discountResult={discountResult}
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.notes")}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={t("minecraft_order.notes_placeholder")}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <i className="fab fa-whatsapp text-sm" />
                <span>{t("minecraft_order.send_wa")}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitRenewal} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.renewal_name")}
                </label>
                <input
                  type="text"
                  required
                  value={renewalName}
                  onChange={(e) => setRenewalName(e.target.value)}
                  placeholder={t("minecraft_order.name_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.renewal_email")}
                </label>
                <input
                  type="email"
                  required
                  value={renewalEmail}
                  onChange={(e) => setRenewalEmail(e.target.value)}
                  placeholder={t("minecraft_order.email_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.whatsapp")}
                </label>
                <input
                  type="tel"
                  required
                  value={renewalWhatsapp}
                  onChange={(e) => setRenewalWhatsapp(e.target.value)}
                  placeholder={t("minecraft_order.whatsapp_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.server_id")}
                </label>
                <input
                  type="text"
                  required
                  value={serverId}
                  onChange={(e) => setServerId(e.target.value)}
                  placeholder={t("minecraft_order.server_id_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                  {t("minecraft_order.initial_cost")}
                </label>
                <input
                  type="text"
                  required
                  value={initialCost}
                  onChange={(e) => setInitialCost(e.target.value)}
                  placeholder={t("minecraft_order.initial_cost_placeholder")}
                  className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                />
              </div>

              <PromoCodeInput
                value={renewalPromoCode}
                onChange={setRenewalPromoCode}
                plan={plan}
                promoCodes={promoCodes}
                onDiscountResult={setDiscountResult}
                discountResult={discountResult}
              />

              <button
                type="submit"
                className="w-full py-4 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <i className="fab fa-whatsapp text-sm" />
                <span>{t("minecraft_order.send_wa")}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
