import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useProducts, Plan } from "../hooks/useFirestore";
import { MinecraftOrderModal } from "../components/MinecraftOrderModal";
import { motion, AnimatePresence } from "motion/react";
import { PageTitle } from "../components/PageTitle";
import { RelatedServices } from "../components/RelatedServices";

type TabType = "milan" | "genoa";

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardSlideUp = (i: number) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.05, ease: [0.25, 0.1, 0, 1] as const } },
});

const tabMeta: { id: TabType; labelKey: string; icon: string; color: string; gradient: string; desc: string; specs: string[] }[] = [
  { id: "milan", labelKey: "cloud_vps.tab_milan", icon: "fas fa-server", color: "#a855f7", gradient: "from-purple-500 via-fuchsia-400 to-purple-600", desc: "cloud_vps.tab_milan_desc", specs: ["AMD EPYC Milan", "DDR4 RAM", "NVMe SSD", "DDoS Protection"] },
  { id: "genoa", labelKey: "cloud_vps.tab_genoa", icon: "fas fa-microchip", color: "#3b82f6", gradient: "from-blue-500 via-cyan-400 to-blue-600", desc: "cloud_vps.tab_genoa_desc", specs: ["AMD EPYC Genoa", "DDR5 RAM", "NVMe Gen4", "DDoS Protection"] },
];

export const CloudVPS: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>("milan");
  const [orderPlan, setOrderPlan] = useState<Plan | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { products, loading } = useProducts();

  const allVpsPlans = products.filter((p) => p.category === "vps");
  const milanPlans = allVpsPlans.filter((p) => !p.id.includes("genoa"));
  const genoaPlans = allVpsPlans.filter((p) => p.id.includes("genoa"));

  const getFilteredPlans = () => {
    switch (activeTab) {
      case "milan": return milanPlans;
      case "genoa": return genoaPlans;
      default: return milanPlans;
    }
  };

  const currentTab = tabMeta.find(t => t.id === activeTab)!;
  const filteredPlans = getFilteredPlans();

  const handleWhatsAppOrder = (plan: Plan) => {
    setOrderPlan(plan);
    setIsOrderModalOpen(true);
  };

  const openWA = (plan: Plan) => {
    const msg = `Halo TinnzStore, saya tertarik dengan Cloud VPS:\n\n*${plan.name}*\nRAM: ${plan.ram}\nStorage: ${plan.storage}\nHarga: Rp ${plan.price_idr.toLocaleString("id-ID")}/bulan\n\nMohon info lebih lanjut.`;
    window.open(`https://wa.me/6287844812351?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const regions = activeTab === "milan"
    ? ["Johor, Malaysia", "Singapore", "Miami, Florida", "Kansas City, Missouri", "Nuremberg, Germany", "Los Angeles, California"]
    : ["Johor, Malaysia", "Miami, Florida", "Kansas City, Missouri", "Nuremberg, Germany", "Los Angeles, California"];

  const osList = activeTab === "milan"
    ? [
        { group: "Linux Distros", list: ["Ubuntu 20.04/22.04 LTS", "Debian 11/12", "CentOS Stream 9", "Rocky Linux / AlmaLinux"] },
        { group: "Windows Server", list: ["Windows 10 / 11 Pro", "Windows Server 2012 R2", "Windows Server 2016", "Windows Server 2019", "Windows Server 2022"] },
      ]
    : [
        { group: "Linux Distros", list: ["CentOS Stream 9", "Ubuntu 20.04/22.04/24.04 LTS", "Debian 11/12", "FreeBSD", "Arch Linux"] },
        { group: "Windows Server", list: ["Windows 10 / 11 Pro", "Windows Server 2012", "Windows Server 2016", "Windows Server 2019", "Windows Server 2022"] },
      ];

  const terms = [
    t('cloud_vps.term1'),
    t('cloud_vps.term2'),
    t('cloud_vps.term3'),
    t('cloud_vps.term4'),
    t('cloud_vps.term5'),
    t('cloud_vps.term6'),
    t('cloud_vps.term7'),
    t('cloud_vps.term8'),
  ];

  return (
    <>
    <div className="pt-28 pb-16 min-h-screen flex flex-col gap-12 max-w-7xl mx-auto px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="text-center flex flex-col items-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-purple)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-purple)] bg-[var(--accent-purple)]/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)] animate-pulse" />
          {t('cloud_vps.badge')}
        </span>
        <PageTitle text={t('cloud_vps.title')} className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-3" />
        <p className="text-sm mt-4 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t('cloud_vps.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
      >
        {[
          { label: t('cloud_vps.feature1_desc'), value: t('cloud_vps.feature1_title'), icon: "fas fa-microchip", color: "#3B82F6" },
          { label: t('cloud_vps.feature2_desc'), value: t('cloud_vps.feature2_title'), icon: "fas fa-hdd", color: "#06b6d4" },
          { label: t('cloud_vps.feature3_desc'), value: t('cloud_vps.feature3_title'), icon: "fas fa-shield-alt", color: "#a855f7" },
          { label: t('cloud_vps.feature4_desc'), value: t('cloud_vps.feature4_title'), icon: "fas fa-chart-line", color: "#f59e0b" },
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
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-wrap justify-center gap-2">
        {tabMeta.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tab.id === "milan" ? milanPlans.length : genoaPlans.length;
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
                {t(`cloud_vps.tab_${activeTab}` as any)}
              </h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] font-light leading-relaxed mt-1 max-w-2xl">
                {t(currentTab.desc)}
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
      </AnimatePresence>

      <div className="mb-6">
        <h2 className="text-base font-black uppercase tracking-tight text-[var(--text-primary)] mb-2">{t('cloud_vps.choose_package')}</h2>
        <p className="text-[11px] md:text-sm text-[var(--text-secondary)] font-light leading-relaxed">{t('cloud_vps.choose_desc')}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
          {[1, 2, 3].map((n) => (
            <div key={n} className="card-depth p-8 flex flex-col gap-5 h-96 animate-pulse">
              <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-10 w-40 bg-zinc-200 dark:bg-zinc-800 mt-2" />
              <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800" />
              <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800 pt-5 space-y-3">
                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-5/6 bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-4/5 bg-zinc-200 dark:bg-zinc-800" />
              </div>
              <div className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 mt-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
          {filteredPlans.map((plan, i) => (
            <VpsCard key={plan.id} plan={plan} color={currentTab.color} index={i} onOrder={handleWhatsAppOrder} onWA={openWA} />
          ))}
        </div>
      )}

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="border-t border-[var(--border-color)] pt-12 mt-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {[
            {
              icon: "fas fa-globe-asia",
              title: t('cloud_vps.datacenter_title'),
              content: <div className="flex flex-wrap gap-1.5 mt-2">{regions.map((r, i) => <span key={i} className="px-2 py-0.5 text-[9px] font-mono font-medium text-[var(--text-secondary)]">{r}</span>)}</div>,
            },
            {
              icon: "fas fa-laptop-code",
              title: t('cloud_vps.os_title'),
              content: <div className="flex flex-wrap gap-1.5 mt-2">{osList.flatMap(o => o.list).map((os, i) => <span key={i} className="px-2 py-0.5 text-[9px] font-mono font-medium text-[var(--text-secondary)]">{os}</span>)}</div>,
            },
            {
              icon: "fas fa-shield-alt",
              title: t('cloud_vps.uptime_title'),
              content: <p className="text-xs font-mono text-[var(--text-secondary)] mt-2 leading-relaxed">{t('cloud_vps.uptime_desc')}</p>,
            },
          ].map((feat, idx) => (
            <motion.div
              key={idx}
              variants={slideUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="flex flex-col md:flex-row items-center md:items-start gap-4 p-6 card-depth hover:border-[var(--accent-purple)]/30 transition-all duration-300"
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-xl text-base shrink-0" style={{ background: 'var(--accent-purple)12' }}>
                <i className={feat.icon} style={{ color: 'var(--accent-purple)' }} />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">{feat.title}</h3>
                {feat.content}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="p-6 md:p-8 card-depth"
      >
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4 flex items-center gap-2">
          <i className="fas fa-gavel text-[var(--accent-purple)]" />
          {t('cloud_vps.terms_title')}
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {terms.map((term, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="flex items-start gap-2 text-xs font-mono leading-relaxed text-[var(--text-secondary)] break-words"
            >
              <span className="text-[var(--accent-purple)] font-bold mt-0.5">//</span>
              <span>{term}</span>
            </motion.li>
          ))}
        </ul>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="p-8 card-depth flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        {[
          { icon: "fas fa-rocket", label: t('cloud_vps.bar_deployment') },
          { icon: "fas fa-globe-asia", label: t('cloud_vps.bar_network') },
          { icon: "fas fa-sync", label: t('cloud_vps.bar_renewal') },
          { icon: "fas fa-shield-alt", label: t('cloud_vps.bar_ddos') },
        ].map((feat, idx) => (
          <motion.div
            key={idx}
            variants={slideUp}
            className="flex items-center gap-3"
          >
            <i className={`${feat.icon} text-base text-[var(--accent-purple)]`} />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-primary)]">{feat.label}</span>
          </motion.div>
        ))}
      </motion.section>

      <RelatedServices />
      <div className="flex items-center gap-3 mt-6">
        <span className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">{t('bare_metal.follow_us')}</span>
        <a href="https://www.instagram.com/tinnzstore_id" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] transition-all duration-200 hover:bg-pink-500/10 hover:border-pink-500/30" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}><i className="fab fa-instagram" /></a>
        <a href="https://www.tiktok.com/@tinnzstore_id" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center border text-[10px] transition-all duration-200 hover:bg-sky-500/10 hover:border-sky-500/30" style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}><i className="fab fa-tiktok" /></a>
      </div>
    </div>

    <MinecraftOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        plan={orderPlan}
      />
    </>
  );
};

const VpsCard: React.FC<{ plan: Plan; color: string; index: number; onOrder: (plan: Plan) => void; onWA: (plan: Plan) => void }> = ({ plan, color, index, onOrder, onWA }) => {
  const { t } = useTranslation();
  const stockBadgeLabel = plan.stock_badge === "ready" ? t('common.available') :
    plan.stock_badge === "limited" ? t('common.limited') :
    plan.stock_badge === "ask_stock" ? t('common.sold_out') : null;

  const stockBadgeColor = plan.stock_badge === "ready" ? "#10B981" :
    plan.stock_badge === "limited" ? "#F59E0B" : "#EF4444";

  return (
    <motion.div
      {...cardSlideUp(index)}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative overflow-hidden rounded-xl border"
      style={{ borderColor: `${color}25`, backgroundColor: 'var(--bg-card, #111827)' }}
    >
      <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none" style={{ opacity: 0.12 }}>
        <img src="/vps.png" alt="" className="w-full h-full object-cover object-top" />
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
                {stockBadgeLabel && (
                  <span className="text-[8px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: `${stockBadgeColor}18`, color: stockBadgeColor }}>
                    {stockBadgeLabel}
                  </span>
                )}
              </div>
              <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: `${color}bb` }}>
                {t('cloud_vps.badge')}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-black" style={{ color }}>
              Rp {plan.price_idr.toLocaleString("id-ID")}
            </div>
            <div className="text-[7px] font-mono text-[var(--text-secondary)] uppercase tracking-widest">{t('common.per_month')}</div>
          </div>
        </div>

        <div className="h-px mb-3 opacity-20" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />

        <div className="space-y-2.5 mb-4">
          {plan.specs_list && plan.specs_list.length > 0 ? (
            plan.specs_list.map((spec, idx) => {
              let icon = "fas fa-check-circle";
              const lower = spec.toLowerCase();
              if (lower.includes("vcore") || lower.includes("cpu") || lower.includes("epyc") || lower.includes("genoa") || lower.includes("amd")) icon = "fas fa-microchip";
              else if (lower.includes("ram") || lower.includes("memory") || lower.includes("ddr")) icon = "fas fa-memory";
              else if (lower.includes("storage") || lower.includes("nvme") || lower.includes("ssd")) icon = "fas fa-hdd";
              else if (lower.includes("backup")) icon = "fas fa-cloud-upload-alt";
              else if (lower.includes("alloc") || lower.includes("bandwidth")) icon = "fas fa-project-diagram";
              else if (lower.includes("location") || lower.includes("singapore") || lower.includes("malaysia") || lower.includes("indonesia")) icon = "fas fa-location-dot";
              else if (lower.includes("ddos") || lower.includes("protection")) icon = "fas fa-shield-alt";
              return (
                <div key={idx} className="flex items-center gap-3 text-[11px] font-mono">
                  <div className="w-5 h-5 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${color}12` }}>
                    <i className={`${icon} text-[8px]`} style={{ color }} />
                  </div>
                  <span className="text-[var(--text-secondary)] truncate leading-tight">{spec}</span>
                </div>
              );
            })
          ) : (
            <>
              {plan.cpu && (
                <div className="flex items-center gap-3 text-[11px] font-mono">
                  <div className="w-5 h-5 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${color}12` }}>
                    <i className="fas fa-microchip text-[8px]" style={{ color }} />
                  </div>
                  <span className="text-[var(--text-secondary)] truncate leading-tight">{plan.cpu}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="w-5 h-5 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${color}12` }}>
                  <i className="fas fa-memory text-[8px]" style={{ color }} />
                </div>
                <span className="text-[var(--text-secondary)] truncate leading-tight">{plan.ram}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="w-5 h-5 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${color}12` }}>
                  <i className="fas fa-hdd text-[8px]" style={{ color }} />
                </div>
                <span className="text-[var(--text-secondary)] truncate leading-tight">{plan.storage}</span>
              </div>
            </>
          )}
          {(!plan.specs_list || plan.specs_list.length === 0) && plan.backup_slot && (
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="w-5 h-5 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${color}12` }}>
                <i className="fas fa-cloud-upload-alt text-[8px]" style={{ color }} />
              </div>
              <span className="text-[var(--text-secondary)] truncate leading-tight">Backup: {plan.backup_slot}</span>
            </div>
          )}
          {(!plan.specs_list || plan.specs_list.length === 0) && plan.allocation_slot && (
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <div className="w-5 h-5 flex items-center justify-center rounded shrink-0" style={{ backgroundColor: `${color}12` }}>
                <i className="fas fa-project-diagram text-[8px]" style={{ color }} />
              </div>
              <span className="text-[var(--text-secondary)] truncate leading-tight">Allocation: {plan.allocation_slot}</span>
            </div>
          )}
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
              <span className="relative z-10">{t('common.buy_now')}</span>
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
