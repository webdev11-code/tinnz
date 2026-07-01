import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { useProducts, Plan } from "../hooks/useFirestore";
import { PageTitle } from "../components/PageTitle";
import { RelatedServices } from "../components/RelatedServices";

type TabType = "all" | "intel-core" | "intel-xeon" | "amd-ryzen";

const tabs: { id: TabType; labelKey: string; icon: string; color: string; gradient: string; descKey: string; specs: string[] }[] = [
  { id: "all", labelKey: "bare_metal.tab_all", icon: "fas fa-th-large", color: "#3B82F6", gradient: "from-blue-500 via-cyan-400 to-blue-600", descKey: "bare_metal.tab_all_desc", specs: [] },
  { id: "intel-core", labelKey: "bare_metal.tab_intel_core", icon: "fas fa-microchip", color: "#3B82F6", gradient: "from-blue-500 via-blue-400 to-blue-600", descKey: "bare_metal.desc_intel_core", specs: ["Intel Core i7 / i5", "12-12 vCPU @ 4.4-4.6 GHz", "16-32 GB RAM", "NVMe SSD Storage", "Indonesia Data Center"] },
  { id: "intel-xeon", labelKey: "bare_metal.tab_intel_xeon", icon: "fas fa-microchip", color: "#8B5CF6", gradient: "from-violet-500 via-purple-400 to-violet-600", descKey: "bare_metal.desc_intel_xeon", specs: ["Intel Xeon E5 v4", "28-36 vCPU @ 3.3-3.5 GHz", "32-128 GB RAM", "NVMe SSD Storage", "Indonesia Data Center"] },
  { id: "amd-ryzen", labelKey: "bare_metal.tab_amd_ryzen", icon: "fas fa-microchip", color: "#10B981", gradient: "from-emerald-500 via-green-400 to-emerald-600", descKey: "bare_metal.desc_amd_ryzen", specs: ["AMD Ryzen 5 3600 / 5600", "12-12 vCPU @ 4.2-4.4 GHz", "16-32 GB RAM", "NVMe SSD Storage", "Indonesia Data Center"] },
];

function getGroup(id: string): TabType {
  if (id.startsWith("icbr")) return "intel-core";
  if (id.startsWith("ixbr")) return "intel-xeon";
  if (id.startsWith("ar5br")) return "amd-ryzen";
  return "intel-core";
}

function parseCpu(cpu: string | undefined): { model: string; vcpu: string; ghz: string } {
  if (!cpu) return { model: "", vcpu: "", ghz: "" };
  const m = cpu.match(/(.+?)\s*\((\d+)\s*vCPU\s*@\s*([\d.]+)\s*GHz\)/);
  if (m) return { model: m[1], vcpu: m[2], ghz: m[3] };
  return { model: cpu, vcpu: "", ghz: "" };
}

const cardSlideUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0, 1] as const } },
});

const BareMetal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const { t } = useTranslation();
  const { products, loading } = useProducts();

  const allPlans = useMemo(() => products.filter((p) => p.category === "bare-metal"), [products]);

  const filteredPlans = useMemo(() => {
    if (activeTab === "all") return allPlans;
    return allPlans.filter((p) => getGroup(p.id) === activeTab);
  }, [allPlans, activeTab]);

  const currentTab = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="pt-20 pb-16 min-h-screen flex flex-col gap-10 max-w-7xl mx-auto px-4 md:px-8 relative">
      <div className="fixed pointer-events-none inset-0 overflow-hidden -z-10">
        <div className="absolute top-[15%] left-[8%] w-24 h-24 border border-blue-500/10 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute top-[35%] right-[12%] w-16 h-16 border border-purple-500/10 rounded-lg rotate-45 animate-pulse" style={{ animationDuration: '5s' }} />
        <div className="absolute bottom-[25%] left-[20%] w-20 h-20 border border-emerald-500/10 rounded-full animate-pulse" style={{ animationDuration: '6s' }} />
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
          {t('bare_metal.badge')}
        </span>
        <PageTitle text={t('bare_metal.title')} className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-2" />
        <p className="text-xs md:text-sm mt-3 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t('bare_metal.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: t('bare_metal.stat_total'), value: allPlans.length, icon: "fas fa-server", color: "#3B82F6" },
          { label: t('bare_metal.stat_location'), value: "Indonesia", icon: "fas fa-map-marker-alt", color: "#F59E0B" },
          { label: t('bare_metal.stat_uptime'), value: "99.9%", icon: "fas fa-shield-alt", color: "#10B981" },
          { label: t('bare_metal.stat_support'), value: "24/7", icon: "fas fa-headset", color: "#8B5CF6" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="relative overflow-hidden rounded-xl border backdrop-blur-sm p-4 text-center group"
            style={{ borderColor: `${stat.color}20`, backgroundColor: `${stat.color}08` }}
          >
            <div className="absolute -top-6 -right-6 w-12 h-12 rounded-full blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500" style={{ backgroundColor: stat.color }} />
            <i className={`${stat.icon} text-lg mb-1.5`} style={{ color: stat.color }} />
            <div className="text-lg font-black text-[var(--text-primary)]">{typeof stat.value === "number" ? stat.value : stat.value}</div>
            <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.id === "all" ? allPlans.length : allPlans.filter(p => getGroup(p.id) === tab.id).length;
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
        {activeTab !== "all" && (
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
                <h3 className="text-base font-black uppercase tracking-tight" style={{ color: currentTab.color }}>{t(currentTab.labelKey)}</h3>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] font-light leading-relaxed mt-1 max-w-2xl">
                  {t(currentTab.descKey)}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
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
        )}
      </AnimatePresence>

      <div className="mb-6">
        <h2 className="text-base font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">{t('bare_metal.choose_package')}</h2>
        <p className="text-[11px] md:text-sm text-[var(--text-secondary)] font-light leading-relaxed">{t('bare_metal.choose_desc')}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="rounded-xl border border-[var(--border-color)] p-5 animate-pulse bg-[var(--bg-card)]">
              <div className="h-4 w-20 bg-zinc-700 rounded mb-3" />
              <div className="h-3 w-32 bg-zinc-700 rounded mb-2" />
              <div className="h-3 w-28 bg-zinc-700 rounded mb-2" />
              <div className="h-3 w-36 bg-zinc-700 rounded mb-4" />
              <div className="h-10 w-full bg-zinc-700 rounded-lg" />
            </div>
          ))}
        </div>
      ) : activeTab === "all" ? (
        <div key="all" className="flex flex-col gap-14">
          {(["intel-core", "intel-xeon", "amd-ryzen"] as const).map((groupId) => {
            const groupPlans = allPlans.filter(p => getGroup(p.id) === groupId);
            if (groupPlans.length === 0) return null;
            const groupTab = tabs.find(t => t.id === groupId)!;
            return (
              <section key={groupId}>
                <div className="relative mb-6">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0" style={{ background: `${groupTab.color}18`, color: groupTab.color }}>
                      <i className={groupTab.icon} />
                    </div>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-tight text-[var(--text-primary)]">{t(groupTab.labelKey)}</h3>
                      <p className="text-[10px] font-mono text-[var(--text-secondary)]">{groupPlans.length} {t('bare_metal.server_available')}</p>
                    </div>
                    <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${groupTab.color}40, transparent)` }} />
                  </div>
                  <div className="absolute -top-8 -left-4 w-24 h-24 rounded-full blur-[80px] opacity-30 pointer-events-none" style={{ backgroundColor: groupTab.color }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {groupPlans.map((plan, i) => (
                    <BareMetalCard key={plan.id} plan={plan} color={groupTab.color} tabIcon={groupTab.icon} index={i} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        <div key={activeTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan, i) => (
            <BareMetalCard key={plan.id} plan={plan} color={currentTab.color} tabIcon={currentTab.icon} index={i} />
          ))}
        </div>
      )}

      {!loading && activeTab !== "all" && filteredPlans.length === 0 && (
        <div className="text-center py-16 text-[var(--text-secondary)]">
          <i className="fas fa-server text-3xl mb-3 opacity-40" />
          <p className="text-sm font-mono">{t('bare_metal.no_products')}</p>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-2xl border border-blue-500/20 mt-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-6 md:p-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400">
              <i className="fas fa-phone-alt text-lg" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-tight">{t('bare_metal.need_help_title')}</h3>
              <p className="text-xs text-[var(--text-secondary)] font-light mt-0.5">{t('bare_metal.need_help_desc')}</p>
            </div>
          </div>
          <a
            href="https://wa.me/6287844812351"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider text-white transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
          >
            <i className="fab fa-whatsapp text-sm" />
            {t('bare_metal.contact_us')}
          </a>
        </div>
      </motion.div>
      <RelatedServices />
      <div className="flex items-center gap-3 mt-6">
        <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">{t('bare_metal.follow_us')}</span>
        <a href="https://www.instagram.com/tinnzstore_id" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] transition-all duration-200 hover:bg-pink-500/10 hover:border-pink-500/30" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}><i className="fab fa-instagram" /></a>
        <a href="https://www.tiktok.com/@tinnzstore_id" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] transition-all duration-200 hover:bg-sky-500/10 hover:border-sky-500/30" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}><i className="fab fa-tiktok" /></a>
      </div>
    </div>
  );
};

const BareMetalCard: React.FC<{ plan: Plan; color: string; tabIcon: string; index: number }> = ({ plan, color, tabIcon, index }) => {
  const { model, vcpu, ghz } = parseCpu(plan.cpu);
  const cores = vcpu && !isNaN(Number(vcpu)) ? Math.floor(Number(vcpu) / 2).toString() : "";

  const openWA = () => {
    const msg = `Halo TinnzStore, saya tertarik dengan Dedicated Server:\n\n*${plan.name}*\nCPU: ${plan.cpu}\nRAM: ${plan.ram}\nStorage: ${plan.storage}\nHarga: Rp ${plan.price_idr.toLocaleString("id-ID")}/bulan\n\nMohon info lebih lanjut.`;
    window.open(`https://wa.me/6287844812351?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const stockBadgeLabel = plan.stock_badge === "ready" ? "Siap" :
    plan.stock_badge === "limited" ? "Terbatas" :
    plan.stock_badge === "ask_stock" ? "Tanya Stock" : null;

  const stockBadgeColor = plan.stock_badge === "ready" ? "#10B981" :
    plan.stock_badge === "limited" ? "#F59E0B" : "#3B82F6";

  const location = plan.specs_list?.[1] || "Indonesia";

  return (
    <motion.div
      {...cardSlideUp(index)}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-xl border"
      style={{ borderColor: `${color}25`, backgroundColor: 'var(--bg-card, #111827)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700" style={{ backgroundColor: color }} />
      <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700" style={{ backgroundColor: color }} />

      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: color }} />
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full opacity-30" style={{ backgroundColor: color }} />

      <div className="p-5 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 flex items-center justify-center rounded-xl text-base" style={{ backgroundColor: `${color}18`, color }}>
              <i className="fas fa-server" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-[var(--text-primary)] tracking-tight">{model || plan.name}</h3>
                {stockBadgeLabel && (
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${stockBadgeColor}18`, color: stockBadgeColor }}>
                    {stockBadgeLabel}
                  </span>
                )}
              </div>
              <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `${color}bb` }}>
                {plan.specs_list?.[2] || "Dedicated Server"}
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
            ...(model ? [{ icon: "fas fa-microchip", label: `${model} ${vcpu} vCores` }] : []),
            ...(ghz ? [{ icon: "fas fa-tachometer-alt", label: `${ghz} GHz Turbo Boost` }] : []),
            { icon: "fas fa-memory", label: `${plan.ram} RAM` },
            { icon: "fas fa-hdd", label: plan.storage },
            { icon: "fas fa-network-wired", label: "10Gbps Network" },
            { icon: "fas fa-map-marker-alt", label: location },
          ].filter(Boolean).map((item: any, idx) => (
            <div key={idx} className="flex items-center gap-3 text-[11px] font-mono">
              <div className="w-5 h-5 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${item.icon === "fas fa-map-marker-alt" ? "#F59E0B" : color}12` }}>
                <i className={`${item.icon} text-[8px]`} style={{ color: item.icon === "fas fa-map-marker-alt" ? "#F59E0B" : color }} />
              </div>
              <span className="text-[var(--text-secondary)] truncate leading-tight">{item.label || '-'}</span>
            </div>
          ))}
        </div>

        <button
          onClick={openWA}
          className="relative w-full py-2.5 rounded-lg text-[11px] font-black uppercase tracking-wider text-white overflow-hidden transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 group/btn"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}bb)` }}
        >
          <span className="absolute inset-0 bg-white/10 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
          <i className="fab fa-whatsapp text-sm relative z-10" />
          <span className="relative z-10">Pesan via WhatsApp</span>
        </button>
      </div>
    </motion.div>
  );
};

export default BareMetal;