import React, { useState } from "react";
import { useProducts, Plan } from "../hooks/useFirestore";
import { MinecraftOrderModal } from "../components/MinecraftOrderModal";
import { RelatedServices } from "../components/RelatedServices";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";

interface SharedHostingProps {
  onAddToCart: (plan: Plan) => void;
}

type TabType = "nexa" | "neon" | "nano";

const cardSlideUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0, 1] as const } },
});

const tabMeta: { id: TabType; labelKey: string; icon: string; color: string; gradient: string; desc: string; specs: string[] }[] = [
  { id: "nexa", labelKey: "shared_hosting.tab_nexa", icon: "fas fa-bolt", color: "#3B82F6", gradient: "from-blue-500 via-cyan-400 to-blue-600", desc: "shared_hosting.desc_nexa", specs: ["DDR4 RAM", "NVMe Storage", "DDoS Protection"] },
  { id: "neon", labelKey: "shared_hosting.tab_neon", icon: "fas fa-microchip", color: "#06b6d4", gradient: "from-cyan-500 via-teal-400 to-cyan-600", desc: "shared_hosting.desc_neon", specs: ["DDR5 RAM", "NVMe Gen4", "DDoS Protection"] },
  { id: "nano", labelKey: "shared_hosting.tab_nano", icon: "fas fa-shield-alt", color: "#a855f7", gradient: "from-purple-500 via-violet-400 to-purple-600", desc: "shared_hosting.desc_nano", specs: ["DDR5 RAM", "NVMe Gen4", "DDoS Protection"] },
];

export const SharedHosting: React.FC<SharedHostingProps> = ({ onAddToCart }) => {
  const [activeTab, setActiveTab] = useState<TabType>("nexa");
  const [orderPlan, setOrderPlan] = useState<Plan | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { products, loading } = useProducts();

  const nexaPlans = products.filter((p) => p.category === "minecraft-nexa");
  const neonPlans = products.filter((p) => p.category === "minecraft-neon");
  const nanoPlans = products.filter((p) => p.category === "minecraft-nano");

  const getFilteredPlans = () => {
    switch (activeTab) {
      case "nexa": return nexaPlans;
      case "neon": return neonPlans;
      case "nano": return nanoPlans;
      default: return nexaPlans;
    }
  };

  const currentTab = tabMeta.find(t => t.id === activeTab)!;
  const filteredPlans = getFilteredPlans();

  const handleWhatsAppOrder = (plan: Plan) => {
    setOrderPlan(plan);
    setIsOrderModalOpen(true);
  };

  const openWA = (plan: Plan) => {
    const msg = `Halo TinnzStore, saya tertarik dengan Shared Hosting:\n\n*${plan.name}*\nRAM: ${plan.ram}\nStorage: ${plan.storage}\nHarga: Rp ${plan.price_idr.toLocaleString("id-ID")}/bulan\n\nMohon info lebih lanjut.`;
    window.open(`https://wa.me/6287844812351?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="pt-20 pb-16 min-h-screen flex flex-col gap-10 max-w-7xl mx-auto px-4 md:px-8 relative">
      <div className="fixed pointer-events-none inset-0 overflow-hidden -z-10">
        <div className="absolute top-[15%] left-[8%] w-24 h-24 border border-blue-500/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[35%] right-[12%] w-16 h-16 border border-cyan-500/10 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-[25%] left-[20%] w-20 h-20 border border-purple-500/10 rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute top-[60%] right-[25%] w-12 h-12 border border-blue-400/10 rounded-lg -rotate-12 animate-pulse" style={{ animationDuration: '3.5s' }} />
        <div className="absolute top-[10%] right-[40%] w-32 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-[40%] left-[5%] w-px h-32 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent animate-pulse" style={{ animationDuration: '4.5s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center flex flex-col items-center relative pt-6"
      >
        <div className="absolute -top-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] animate-pulse" />
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400 bg-blue-500/10 mb-4 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {t('shared_hosting.badge')}
        </span>
        <PageTitle text={t('shared_hosting.title')} className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-2" />
        <p className="text-xs md:text-sm mt-3 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t('shared_hosting.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: "Enterprise Grade Processors", value: "High Performance CPU", sub: "AMD EPYC / Genoa / Ryzen", icon: "fas fa-microchip", color: "#3B82F6" },
          { label: "Ultra Fast Storage", value: "NVMe SSD", icon: "fas fa-hdd", color: "#06b6d4" },
          { label: "Advance DDoS Security", value: "8 Tbit/s Protection", icon: "fas fa-shield-alt", color: "#a855f7" },
          { label: "Maximum Reliability", value: "99.9% Uptime", icon: "fas fa-chart-line", color: "#f59e0b" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            whileHover={{ y: -4 }}
            className="relative overflow-hidden rounded-2xl border group cursor-default"
            style={{ borderColor: `${stat.color}25`, backgroundColor: `${stat.color}06` }}
          >
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-all duration-700" style={{ backgroundColor: stat.color }} />
            <div className="absolute -bottom-8 -left-8 w-16 h-16 rounded-full blur-2xl opacity-10" style={{ backgroundColor: stat.color }} />
            <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-30 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: stat.color }} />
            <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full opacity-20" style={{ backgroundColor: stat.color }} />
            <div className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-60" style={{ background: `linear-gradient(90deg, transparent, ${stat.color}, transparent)` }} />
            <div className="p-[16px]">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0" style={{ backgroundColor: `${stat.color}15` }}>
                  <i className={`${stat.icon} text-sm`} style={{ color: stat.color }} />
                </div>
              </div>
              <div>
                <div className="text-sm font-black text-[var(--text-primary)] leading-tight">{stat.value}</div>
                <div className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-secondary)] mt-0.5">{stat.label}</div>
                {'sub' in stat && (
                  <div className="text-[7px] font-mono uppercase tracking-widest mt-1.5" style={{ color: `${stat.color}aa` }}>{stat.sub}</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2">
        {tabMeta.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.id === "nexa" ? nexaPlans.length : tab.id === "neon" ? neonPlans.length : nanoPlans.length;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex items-center gap-2 px-4 py-2.5 text-[11px] font-mono font-bold uppercase tracking-wider border rounded-xl transition-all duration-300"
              style={{
                borderColor: isActive ? tab.color : 'var(--border-color)',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                backgroundColor: isActive ? tab.color : 'transparent',
                boxShadow: isActive ? `0 0 20px ${tab.color}40` : 'none',
              }}
            >
              <i className={`${tab.icon} text-xs`} />
              <span>{t(tab.labelKey)}</span>
              <span className="text-[9px] opacity-60">({count})</span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-2xl border p-6 md:p-8"
          style={{ borderColor: `${currentTab.color}30`, backgroundColor: `${currentTab.color}05` }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${currentTab.color}, ${currentTab.color}80, ${currentTab.color}, transparent)` }} />
          <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[120px]" style={{ backgroundColor: `${currentTab.color}15` }} />
          <div className="absolute bottom-0 left-0 w-32 h-32" style={{ background: `radial-gradient(circle at bottom left, ${currentTab.color}10, transparent)` }} />
          <div className="flex flex-col md:flex-row md:items-center gap-6 relative z-10">
            <div className="w-16 h-16 flex items-center justify-center rounded-2xl text-2xl shrink-0 relative" style={{ background: `linear-gradient(135deg, ${currentTab.color}25, ${currentTab.color}10)`, color: currentTab.color }}>
              <div className="absolute inset-0 rounded-2xl border" style={{ borderColor: `${currentTab.color}30` }} />
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: `${currentTab.color}40` }} />
              <i className={currentTab.icon} />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-black uppercase tracking-tight" style={{ color: currentTab.color }}>
                {t(`shared_hosting.tab_${activeTab}_short` as any)}
              </h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] font-light leading-relaxed mt-1 max-w-2xl">
                {t(currentTab.desc)}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full border" style={{ borderColor: `${currentTab.color}30`, color: currentTab.color, backgroundColor: `${currentTab.color}10` }}>
                  <span className="w-1 h-1 rounded-full" style={{ backgroundColor: currentTab.color }} />
                  {activeTab === "nexa" ? "AMD Ryzen 5 5600" : activeTab === "neon" ? "AMD EPYC Genoa 9654" : "AMD Ryzen 9 9950X"}
                </span>
                {currentTab.specs.map((s, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-full border" style={{ borderColor: `${currentTab.color}30`, color: currentTab.color, backgroundColor: `${currentTab.color}10` }}>
                    <span className="w-1 h-1 rounded-full" style={{ backgroundColor: currentTab.color }} />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mb-6">
        <h2 className="text-base font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">{t('shared_hosting.choose_package')}</h2>
        <p className="text-[11px] md:text-sm text-[var(--text-secondary)] font-light leading-relaxed">{t('shared_hosting.choose_desc')}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((n) => (
            <div key={n} className="rounded-xl border border-[var(--border-color)] p-5 animate-pulse bg-[var(--bg-card)]">
              <div className="h-4 w-20 bg-zinc-700 rounded mb-3" />
              <div className="h-3 w-32 bg-zinc-700 rounded mb-2" />
              <div className="h-3 w-28 bg-zinc-700 rounded mb-2" />
              <div className="h-3 w-36 bg-zinc-700 rounded mb-4" />
              <div className="h-10 w-full bg-zinc-700 rounded-lg" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan, i) => (
            <SharedCard key={plan.id} plan={plan} color={currentTab.color} index={i} onOrder={handleWhatsAppOrder} onWA={openWA} />
          ))}
        </div>
      )}

      <RelatedServices />
      <MinecraftOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        plan={orderPlan}
      />
    </div>
  );
};

const SharedCard: React.FC<{ plan: Plan; color: string; index: number; onOrder: (plan: Plan) => void; onWA: (plan: Plan) => void }> = ({ plan, color, index, onOrder, onWA }) => {
  const { t } = useTranslation();
  const stockBadgeLabel = plan.stock_badge === "ready" ? t('common.available') :
    plan.stock_badge === "limited" ? t('common.limited') :
    plan.stock_badge === "ask_stock" ? t('common.contact_sales') : null;

  const stockBadgeColor = plan.stock_badge === "ready" ? "#10B981" :
    plan.stock_badge === "limited" ? "#F59E0B" : "#3B82F6";

  return (
    <motion.div
      {...cardSlideUp(index)}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-xl border"
      style={{ borderColor: `${color}25`, backgroundColor: 'var(--bg-card, #111827)' }}
    >
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none" style={{ opacity: 0.12 }}>
        <img src="/minecraft-1.jpg" alt="" className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, var(--bg-card, #111827) 100%)` }} />
      </div>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700" style={{ backgroundColor: color }} />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundColor: color }} />
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: color }} />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: color }} />

      <div className="p-5 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: `${color}18` }}>
              <i className="fas fa-server" style={{ color }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[var(--text-primary)] tracking-tight">{plan.name}</h3>
                {plan.badge && (
                  <span className="relative inline-flex items-center gap-1 px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.15em] rounded-full" style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)`, color: '#fff', boxShadow: `0 0 10px ${color}30` }}>
                    {plan.badge}
                  </span>
                )}
                {stockBadgeLabel && (
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${stockBadgeColor}18`, color: stockBadgeColor }}>
                    {stockBadgeLabel}
                  </span>
                )}
              </div>
              <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `${color}bb` }}>
                Minecraft Hosting
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black" style={{ color }}>
              Rp {plan.price_idr.toLocaleString("id-ID")}
            </div>
            <div className="text-[7px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">/bulan</div>
          </div>
        </div>

        <div className="h-px mb-3 opacity-20" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

        <div className="space-y-2.5 mb-4">
          {[
            { icon: "fas fa-microchip", label: plan.cpu || "1 Core" },
            { icon: "fas fa-memory", label: plan.ram },
            { icon: "fas fa-hdd", label: plan.storage },
            { icon: "fas fa-shield-alt", label: "DDoS Protection" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[11px] font-mono">
              <div className="w-5 h-5 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${color}12` }}>
                <i className={`${item.icon} text-[8px]`} style={{ color }} />
              </div>
              <span className="text-[var(--text-secondary)] truncate leading-tight">{item.label}</span>
            </div>
          ))}
        </div>

        {plan.redirect_url ? (
          <>
            <a
              href={plan.redirect_url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative w-full py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-white overflow-hidden transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
              style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
            >
              <span className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
              <i className="fas fa-shopping-cart text-sm relative z-10" />
              <span className="relative z-10">Beli Sekarang</span>
            </a>
            <button
              onClick={() => onOrder(plan)}
              className="relative w-full py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 border group/btn mt-3"
              style={{ borderColor: `${color}40`, color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.color = color; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              <i className="fab fa-whatsapp text-sm" />
              <span>{t('bare_metal.cta_whatsapp')}</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => onWA(plan)}
            className="relative w-full py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-white overflow-hidden transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
            style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
          >
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            <i className="fab fa-whatsapp text-sm relative z-10" />
            <span className="relative z-10">{t('bare_metal.cta_whatsapp')}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};
