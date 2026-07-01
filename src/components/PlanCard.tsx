import React from "react";
import { Plan } from "../data/plans";
import { useTranslation } from "react-i18next";

interface PlanCardProps {
  plan: Plan;
  onBuyNow: (plan: Plan) => void;
  onWhatsAppOrder?: (plan: Plan) => void;
  accentColor?: "blue" | "green" | "purple" | "cyan";
}

const accentMap = {
  blue: { hex: "#1A5CFF", text: "text-blue-400", btn: "bg-blue-600 hover:bg-blue-500 active:bg-blue-700", badge: "bg-blue-500", grad: "from-blue-600/20 to-blue-500/5", border: "border-blue-500/30", glow: "rgba(26,92,255,0.15)" },
  green: { hex: "#10B981", text: "text-green-400", btn: "bg-green-600 hover:bg-green-500 active:bg-green-700", badge: "bg-green-500", grad: "from-green-600/20 to-green-500/5", border: "border-green-500/30", glow: "rgba(16,185,129,0.15)" },
  purple: { hex: "#7C3AED", text: "text-purple-400", btn: "bg-purple-600 hover:bg-purple-500 active:bg-purple-700", badge: "bg-purple-500", grad: "from-purple-600/20 to-purple-500/5", border: "border-purple-500/30", glow: "rgba(124,58,237,0.15)" },
  cyan: { hex: "#06B6D4", text: "text-cyan-400", btn: "bg-cyan-600 hover:bg-cyan-500 active:bg-cyan-700", badge: "bg-cyan-500", grad: "from-cyan-600/20 to-cyan-500/5", border: "border-cyan-500/30", glow: "rgba(6,182,212,0.15)" },
};

const badgeStyle: Record<string, { icon: string; hex: string; grad: string }> = {
  POPULAR: { icon: "fa-fire", hex: "#F59E0B", grad: "from-amber-500 to-orange-600" },
  "BEST SELLER": { icon: "fa-award", hex: "#10B981", grad: "from-emerald-500 to-green-600" },
  ADVANCED: { icon: "fa-rocket", hex: "#8B5CF6", grad: "from-violet-500 to-purple-600" },
  ENTERPRISE: { icon: "fa-crown", hex: "#EF4444", grad: "from-red-500 to-rose-600" },
};

const getSpecIcon = (spec: string): string => {
  const lower = spec.toLowerCase();
  if (lower.includes("cpu") || lower.includes("core") || lower.includes("vcore") || lower.includes("vcpu")) return "fas fa-microchip";
  if (lower.includes("ram") || lower.includes("ddr") || lower.includes("memory")) return "fas fa-memory";
  if (lower.includes("disk") || lower.includes("storage") || lower.includes("ssd") || lower.includes("nvme") || lower.includes("gb"))
    return "fas fa-database";
  if (lower.includes("backup")) return "fas fa-cloud-upload-alt";
  if (lower.includes("alloc") || lower.includes("port") || lower.includes("slot")) return "fas fa-project-diagram";
  if (lower.includes("database") || lower.includes("db")) return "fas fa-database";
  if (lower.includes("bandwidth") || lower.includes("transfer")) return "fas fa-wifi";
  if (lower.includes("protection") || lower.includes("ddos") || lower.includes("mitigation")) return "fas fa-shield-alt";
  return "fas fa-check-circle";
};

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onBuyNow, onWhatsAppOrder, accentColor = "blue" }) => {
  const { t } = useTranslation();
  const ac = accentMap[accentColor];
  const bc = plan.badge ? badgeStyle[plan.badge] : null;

  const isAvailable = plan.stock_status === "available" || plan.stock_status === "limited";

  const formattedPrice = plan.price_idr > 0
    ? `Rp ${plan.price_idr.toLocaleString("id-ID")}`
    : t("common.custom_plan");

  const isPrivate = plan.category.startsWith("private-");

  const getWhatsAppLink = () => {
    let message = "";
    if (plan.category.startsWith("minecraft")) {
      message = `Halo TinnzStore, saya ingin order Shared Hosting Paket ${plan.name} dengan RAM ${plan.ram}`;
    } else if (plan.category === "bot") {
      message = `Halo TinnzStore, saya ingin order App Hosting ${plan.name} dengan RAM ${plan.ram}`;
    } else if (plan.category === "web") {
      message = `Halo TinnzStore, saya ingin order Web Hosting Paket ${plan.name}`;
    } else if (plan.category === "terraria") {
      message = `Halo TinnzStore, saya ingin order Terraria Hosting Paket ${plan.name}`;
    } else if (isPrivate) {
      message = `Halo TinnzStore, saya ingin order Private Server ${plan.name}`;
    } else if (plan.category === "samp") {
      message = `Halo TinnzStore, saya ingin order SAMP Hosting ${plan.name}`;
    } else if (plan.category === "hytale") {
      message = `Halo TinnzStore, saya ingin order Hytale Hosting Paket ${plan.name}`;
    } else if (plan.category.startsWith("vps")) {
      message = `Halo TinnzStore, saya tertarik dengan Cloud VPS:\n\n*${plan.name}*\nCPU: ${plan.cpu}\nRAM: ${plan.ram}\nStorage: ${plan.storage}\nHarga: Rp ${plan.price_idr.toLocaleString("id-ID")}/bulan\n\nMohon info lebih lanjut.`;
    } else {
      message = `Halo TinnzStore, saya ingin order ${plan.name}`;
    }
    return `https://wa.me/6287844812351?text=${encodeURIComponent(message)}`;
  };

  const hasBadge = plan.badge && bc;

  const stockBadgeLabel = plan.stock_badge === "ready" ? "Siap" :
    plan.stock_badge === "limited" ? "Terbatas" :
    plan.stock_badge === "ask_stock" ? "Tanya Stock" : null;

  const stockBadgeColor = plan.stock_badge === "ready" ? "#10B981" :
    plan.stock_badge === "limited" ? "#F59E0B" : "#3B82F6";

  return (
    <div
      className="group relative p-0 flex flex-col overflow-hidden transition-all duration-500 card-depth"
      style={{
        borderColor: `${ac.hex}25`,
        boxShadow: hasBadge ? `0 8px 32px ${ac.hex}15` : "",
      }}
    >
      
      <div
        className="absolute top-0 left-[12px] right-[12px] h-[3px] z-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${ac.hex}, ${ac.hex}80, ${ac.hex}, transparent)`,
          boxShadow: `0 0 12px ${ac.hex}50`,
        }}
      />

      
      {hasBadge && (
        <div
          className="absolute inset-0 z-0 opacity-[0.07] pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${ac.hex} 0%, transparent 30%, ${ac.hex}80 50%, transparent 70%, ${ac.hex} 100%)`,
            backgroundSize: "200% 200%",
            animation: "liquid-shift 6s ease-in-out infinite alternate",
          }}
        />
      )}

      
      <div
        className="absolute left-0 top-[12px] bottom-[12px] z-10 transition-all duration-300 rounded-b-sm"
        style={{
          width: hasBadge ? "3px" : "2px",
          background: `linear-gradient(180deg, transparent, ${ac.hex}, ${ac.hex}cc, ${ac.hex}, transparent)`,
          boxShadow: hasBadge ? `0 0 8px ${ac.hex}80` : `0 0 4px ${ac.hex}40`,
        }}
      />

      <div className="relative z-10 p-4 sm:p-5 md:p-6 flex flex-col flex-1">
        
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2 min-w-0">
            {hasBadge && (
              <span
                className="inline-flex self-start items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full border"
                style={{
                  borderColor: `${bc!.hex}40`,
                  color: bc!.hex,
                  backgroundColor: `${bc!.hex}10`,
                }}
              >
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: bc!.hex }} />
                <i className={`fas ${bc!.icon} text-[7px]`} />
                {plan.badge}
              </span>
            )}
            <h3 className="font-display text-sm sm:text-base md:text-lg font-bold leading-tight"
              style={{ color: `var(--text-primary)` }}
            >
              {plan.name}
            </h3>
            {stockBadgeLabel && (
              <span
                className="inline-flex self-start items-center px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-wider rounded"
                style={{ backgroundColor: `${stockBadgeColor}18`, color: stockBadgeColor }}
              >
                {stockBadgeLabel}
              </span>
            )}
          </div>
          {plan.ram && (
            <span
              className="shrink-0 px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-semibold tracking-wider text-white"
              style={{ background: `linear-gradient(135deg, ${ac.hex}, ${ac.hex}cc)` }}
            >
              {plan.ram}
            </span>
          )}
        </div>

        
        <div className="mt-3 sm:mt-4 md:mt-5">
          <div className="flex items-baseline gap-1.5">
            <span
              className="font-mono text-lg sm:text-xl md:text-2xl font-bold tracking-tight"
              style={{ color: ac.hex }}
            >
              {formattedPrice}
            </span>
            {plan.price_idr > 0 && (
              <span className="text-[9px] sm:text-[10px] font-mono text-[var(--text-secondary)]">
                /{t("common.per_month")}
              </span>
            )}
          </div>
        </div>

        
        <div
          className="mt-3 sm:mt-4 mb-3 sm:mb-4 h-px"
          style={{
            background: `linear-gradient(to right, transparent, ${ac.hex}40, transparent)`,
          }}
        />

        
        <div className="flex-1">
          <ul className="space-y-2 sm:space-y-2.5">
            {plan.specs_list && plan.specs_list.length > 0 ? (
              plan.specs_list.map((spec, i) => (
                <li key={i} className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                  <i className={`${getSpecIcon(spec)} text-[9px] sm:text-[10px] w-3.5 text-center shrink-0`} style={{ color: ac.hex }} />
                  <span>{spec}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                  <i className="fas fa-microchip text-[9px] sm:text-[10px] w-3.5 text-center shrink-0" style={{ color: ac.hex }} />
                  <span>CPU: <strong className="text-[var(--text-primary)] font-semibold">{plan.cpu?.replace(/(\d+%)/, '($1)')}</strong></span>
                </li>
                <li className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                  <i className="fas fa-memory text-[9px] sm:text-[10px] w-3.5 text-center shrink-0" style={{ color: ac.hex }} />
                  <span>RAM: <strong className="text-[var(--text-primary)] font-semibold">{plan.ram}</strong></span>
                </li>
                <li className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                  <i className="fas fa-database text-[9px] sm:text-[10px] w-3.5 text-center shrink-0" style={{ color: ac.hex }} />
                  <span>Disk: <strong className="text-[var(--text-primary)] font-semibold">{plan.storage?.replace(/(\d+)\s*GiB\s*NVMe/i, '$1GB SSD NVMe')}</strong></span>
                </li>
                <li className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                  <i className="fas fa-cloud-upload-alt text-[9px] sm:text-[10px] w-3.5 text-center shrink-0" style={{ color: ac.hex }} />
                  <span>Backup: <strong className="text-[var(--text-primary)] font-semibold">{plan.backup_slot} Slot</strong></span>
                </li>
                <li className="flex items-center gap-2 sm:gap-2.5 text-[11px] sm:text-xs text-[var(--text-secondary)]">
                  <i className="fas fa-project-diagram text-[9px] sm:text-[10px] w-3.5 text-center shrink-0" style={{ color: ac.hex }} />
                  <span>Allocation: <strong className="text-[var(--text-primary)] font-semibold">{plan.allocation_slot} Slot</strong></span>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      
      <div className="relative z-10 px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 space-y-2">
        {isPrivate && onWhatsAppOrder ? (
          <button
            onClick={() => isAvailable && onWhatsAppOrder(plan)}
            disabled={!isAvailable}
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] text-white ${
              isAvailable ? "" : "bg-zinc-400 cursor-not-allowed"
            }`}
            style={isAvailable ? { background: `linear-gradient(135deg, ${ac.hex}, ${ac.hex}cc)`, boxShadow: `0 4px 16px ${ac.glow}` } : {}}
          >
            <i className="fab fa-whatsapp text-xs sm:text-sm" />
            <span>{t("common.order_whatsapp")}</span>
          </button>
        ) : isPrivate ? (
          <button
            onClick={() => isAvailable && onBuyNow(plan)}
            disabled={!isAvailable}
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] text-white ${
              isAvailable ? "" : "bg-zinc-400 cursor-not-allowed"
            }`}
            style={isAvailable ? { background: `linear-gradient(135deg, ${ac.hex}, ${ac.hex}cc)`, boxShadow: `0 4px 16px ${ac.glow}` } : {}}
          >
            <i className="fab fa-whatsapp text-xs sm:text-sm" />
            <span>{t("common.order_whatsapp")}</span>
          </button>
        ) : plan.category.startsWith("vps") && onWhatsAppOrder ? (
          <button
            onClick={() => isAvailable && onWhatsAppOrder(plan)}
            disabled={!isAvailable}
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] text-white ${
              isAvailable ? "" : "bg-zinc-400 cursor-not-allowed"
            }`}
            style={isAvailable ? { background: `linear-gradient(135deg, ${ac.hex}, ${ac.hex}cc)`, boxShadow: `0 4px 16px ${ac.glow}` } : {}}
          >
            <i className="fab fa-whatsapp text-xs sm:text-sm" />
            <span>{t("common.order_whatsapp")}</span>
          </button>
        ) : plan.category.startsWith("vps") ? (
          <a
            href={plan.redirect_url || getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] text-white ${
              isAvailable ? "" : "bg-zinc-400 cursor-not-allowed pointer-events-none"
            }`}
            style={isAvailable ? { background: `linear-gradient(135deg, ${ac.hex}, ${ac.hex}cc)`, boxShadow: `0 4px 16px ${ac.glow}` } : {}}
          >
            <i className="fab fa-whatsapp text-xs sm:text-sm" />
            <span>{t("common.order_whatsapp")}</span>
          </a>
        ) : plan.redirect_url ? (
          <a
            href={plan.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] text-white ${
              isAvailable ? "" : "bg-zinc-400 cursor-not-allowed pointer-events-none"
            }`}
            style={isAvailable ? { background: `linear-gradient(135deg, ${ac.hex}, ${ac.hex}cc)`, boxShadow: `0 4px 16px ${ac.glow}` } : {}}
          >
            <i className="fas fa-shopping-cart text-xs sm:text-sm" />
            <span>{t("common.buy_now")}</span>
          </a>
        ) : plan.category === "bare-metal" ? (
          <button
            onClick={() => isAvailable && onBuyNow(plan)}
            disabled={!isAvailable}
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] text-white ${
              isAvailable ? "" : "bg-zinc-400 cursor-not-allowed"
            }`}
            style={isAvailable ? { background: `linear-gradient(135deg, ${ac.hex}, ${ac.hex}cc)`, boxShadow: `0 4px 16px ${ac.glow}` } : {}}
          >
            <i className="fab fa-whatsapp text-xs sm:text-sm" />
            <span>{t("common.order_whatsapp")}</span>
          </button>
        ) : (
          <button
            onClick={() => isAvailable && onBuyNow(plan)}
            disabled={!isAvailable}
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] text-white ${
              isAvailable ? "" : "bg-zinc-400 cursor-not-allowed"
            }`}
            style={isAvailable ? { background: `linear-gradient(135deg, ${ac.hex}, ${ac.hex}cc)`, boxShadow: `0 4px 16px ${ac.glow}` } : {}}
          >
            <i className="fas fa-shopping-cart text-xs sm:text-sm" />
            <span>{t("common.buy_now")}</span>
          </button>
        )}

        {isPrivate ? (
          <a
            href="https://discord.gg/Nz9b6bMuNe"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
            style={{
              borderColor: `${ac.hex}40`,
              color: `var(--text-secondary)`,
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = ac.hex; e.currentTarget.style.color = ac.hex; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = `${ac.hex}40`; e.currentTarget.style.color = `var(--text-secondary)`; }}
          >
            <i className="fab fa-discord text-xs sm:text-sm" />
            <span>{t("common.order_discord")}</span>
          </a>
        ) : plan.category.startsWith("vps") ? (
          <a
            href="https://discord.gg/Nz9b6bMuNe"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
            style={{
              borderColor: `${ac.hex}40`,
              color: `var(--text-secondary)`,
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = ac.hex; e.currentTarget.style.color = ac.hex; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = `${ac.hex}40`; e.currentTarget.style.color = `var(--text-secondary)`; }}
          >
            <i className="fab fa-discord text-xs sm:text-sm" />
            <span>{t("common.order_discord")}</span>
          </a>
        ) : plan.category === "bare-metal" ? (
          <a
            href="https://discord.gg/Nz9b6bMuNe"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
            style={{
              borderColor: `${ac.hex}40`,
              color: `var(--text-secondary)`,
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = ac.hex; e.currentTarget.style.color = ac.hex; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = `${ac.hex}40`; e.currentTarget.style.color = `var(--text-secondary)`; }}
          >
            <i className="fab fa-discord text-xs sm:text-sm" />
            <span>{t("common.order_discord")}</span>
          </a>
        ) : onWhatsAppOrder ? (
          <button
            onClick={() => isAvailable && onWhatsAppOrder(plan)}
            disabled={!isAvailable}
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] ${
              isAvailable ? "" : "pointer-events-none opacity-50"
            }`}
            style={{
              borderColor: `${ac.hex}40`,
              color: `var(--text-secondary)`,
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = ac.hex; e.currentTarget.style.color = ac.hex; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = `${ac.hex}40`; e.currentTarget.style.color = `var(--text-secondary)`; }}
          >
            <i className="fab fa-whatsapp text-xs sm:text-sm" />
            <span>{t("common.order_whatsapp")}</span>
          </button>
        ) : (
          <a
            href={getWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-2.5 sm:py-3 rounded-xl text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider border transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97] ${
              isAvailable ? "" : "pointer-events-none opacity-50"
            }`}
            style={{
              borderColor: `${ac.hex}40`,
              color: `var(--text-secondary)`,
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = ac.hex; e.currentTarget.style.color = ac.hex; }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = `${ac.hex}40`; e.currentTarget.style.color = `var(--text-secondary)`; }}
          >
            <i className="fab fa-whatsapp text-xs sm:text-sm" />
            <span>{t("common.order_whatsapp")}</span>
          </a>
        )}
      </div>
    </div>
  );
};
