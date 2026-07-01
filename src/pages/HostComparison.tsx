import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";
import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { useComparisons, ComparisonCategory, ComparisonData } from "../hooks/useFirestore";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0, 1] as const } },
};

const categories: { id: ComparisonCategory; labelKey: string; icon: string }[] = [
  { id: "shared", labelKey: "comparison.tab_shared", icon: "fas fa-layer-group" },
  { id: "private", labelKey: "comparison.tab_private", icon: "fas fa-server" },
  { id: "vps", labelKey: "comparison.tab_vps", icon: "fas fa-cloud" },
  { id: "web", labelKey: "comparison.tab_web", icon: "fas fa-globe" },
];

const valueTranslations: Record<string, string> = {
  Included: "comparison.val_included",
  Weekly: "comparison.val_weekly",
  Daily: "comparison.val_daily",
  "Daily + Snap": "comparison.val_daily_snap",
  Standard: "comparison.val_standard",
  Priority: "comparison.val_priority",
  "24/7 VIP": "comparison.val_247_vip",
  Enterprise: "comparison.val_enterprise",
  "Coming Soon": "comparison.val_coming_soon",
  Unlimited: "comparison.val_unlimited",
  "Up to 3.0 GHz": "comparison.val_up_to_3ghz",
  "Up to 3.7 GHz": "comparison.val_up_to_37ghz",
  Yes: "comparison.val_yes",
  Shared: "comparison.val_shared",
  Auto: "comparison.val_auto",
  Premium: "comparison.val_premium",
  "\u2014": "\u2014",
};

const tVal = (t: (key: string) => string, val: string) => {
  const key = valueTranslations[val];
  return key ? t(key) : val;
};

const featureTranslations: Record<string, string> = {
  CPU: "comparison.feature_cpu",
  RAM: "comparison.feature_ram",
  Storage: "comparison.feature_storage",
  DDoS: "comparison.feature_ddos",
  Backup: "comparison.feature_backup",
  Support: "comparison.feature_support",
  Network: "comparison.feature_network",
  vCPU: "comparison.feature_vcpu",
  NVMe: "comparison.feature_nvme",
  Bandwidth: "comparison.feature_bandwidth",
  Email: "comparison.feature_email",
  SSL: "comparison.feature_ssl",
  cPanel: "comparison.feature_cpanel",
  IP: "comparison.feature_ip",
  Sites: "comparison.feature_sites",
  SSD: "comparison.feature_ssd",
};

const tFeature = (t: (key: string) => string, feature: string) => {
  const key = featureTranslations[feature];
  return key ? t(key) : feature;
};

const PLAN_COLORS = ["#3b82f6", "#06b6d4", "#a855f7", "#10b981"];
const PLAN_COLORS_DIM = ["rgba(59,130,246,0.15)", "rgba(6,182,212,0.15)", "rgba(168,85,247,0.15)", "rgba(16,185,129,0.15)"];

const FEATURE_ICONS: Record<string, string> = {
  CPU: "fas fa-microchip",
  RAM: "fas fa-memory",
  Storage: "fas fa-hdd",
  SSD: "fas fa-database",
  vCPU: "fas fa-microchip",
  NVMe: "fas fa-database",
  Bandwidth: "fas fa-wifi",
  Backup: "fas fa-history",
  DDoS: "fas fa-shield-alt",
  Support: "fas fa-headset",
  Network: "fas fa-network-wired",
  Email: "fas fa-envelope",
  SSL: "fas fa-lock",
  cPanel: "fas fa-cpanel",
  IP: "fas fa-globe",
  Sites: "fas fa-copy",
};

const scoreValue = (val: string): number => {
  const lower = val.toLowerCase();
  if (lower.includes("unlimited") || lower === "yes" || lower.includes("24/7")) return 100;
  if (lower.includes("enterprise") || lower.includes("premium") || lower.includes("priority")) return 85;
  if (lower.includes("daily + snap") || lower.includes("auto")) return 75;
  if (lower.includes("daily")) return 60;
  if (lower.includes("standard") || lower.includes("shared")) return 45;
  if (lower.includes("weekly") || lower.includes("coming soon")) return 30;
  if (val === "\u2014") return 0;
  const freqMatch = lower.match(/(\d+(?:\.\d+)?)\s*ghz/i);
  if (freqMatch) return Math.min(parseFloat(freqMatch[1]) * 30, 100);
  const numMatch = lower.match(/(\d+)\s*(?:gb|tb|core|ipv|copies|sites)/i);
  if (numMatch) {
    const num = parseInt(numMatch[1]);
    if (lower.includes("tb")) return Math.min(num * 20, 100);
    if (lower.includes("gb")) return Math.min(num * 2, 100);
    if (lower.includes("core") || lower.includes("ipv")) return Math.min(num * 25, 100);
    return Math.min(num * 10, 100);
  }
  return 50;
};

const ChartTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-3 py-2 text-xs font-mono shadow-lg">
      <p className="font-bold text-[var(--text-primary)] mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  );
};

const PlanCards: React.FC<{ data: ComparisonData; t: (key: string) => string }> = ({ data, t }) => {
  const score = (planIdx: number, feature: string): number => {
    const row = data.rows.find(r => r.feature === feature);
    if (!row) return 0;
    return scoreValue(row.values[planIdx]);
  };

  const overallScore = (planIdx: number): number => {
    const scores = data.rows.map(r => scoreValue(r.values[planIdx]));
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  };

  const planCount = data.plans.length;
  const gridCols = planCount === 1 ? "grid-cols-1"
    : planCount === 2 ? "grid-cols-1 md:grid-cols-2"
    : planCount === 3 ? "grid-cols-1 md:grid-cols-3"
    : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";

  return (
    <div className={`grid ${gridCols} gap-4`}>
      {data.plans.map((plan, idx) => (
        <motion.div
          key={plan}
          variants={slideUp}
          whileHover={{ y: -6, transition: { duration: 0.3 } }}
          className="relative overflow-hidden rounded-2xl border group"
          style={{ borderColor: `${PLAN_COLORS[idx % PLAN_COLORS.length]}30`, backgroundColor: 'var(--bg-card, #111827)' }}
        >
          <div className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: `linear-gradient(90deg, transparent, ${PLAN_COLORS[idx % PLAN_COLORS.length]}, transparent)` }} />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at top, ${PLAN_COLORS_DIM[idx % PLAN_COLORS.length]}, transparent 70%)` }}
          />
          <div className="p-5 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{plan}</span>
              <div className="w-10 h-10 flex items-center justify-center rounded-full text-xs font-black"
                style={{ backgroundColor: PLAN_COLORS_DIM[idx % PLAN_COLORS.length], color: PLAN_COLORS[idx % PLAN_COLORS.length] }}>
                {overallScore(idx)}
              </div>
            </div>
            <div className="space-y-2.5">
              {data.rows.slice(0, 4).map((row) => (
                <div key={row.feature} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className={`${FEATURE_ICONS[row.feature] || "fas fa-circle"} text-[8px]`}
                      style={{ color: PLAN_COLORS[idx % PLAN_COLORS.length] }} />
                    <span className="text-[10px] font-mono text-[var(--text-secondary)]">{tFeature(t, row.feature)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-[var(--border-color)] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${score(idx, row.feature)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.25, 0.1, 0, 1] }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: PLAN_COLORS[idx % PLAN_COLORS.length] }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-[var(--text-secondary)] min-w-[24px] text-right">{score(idx, row.feature)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const RadarChartView: React.FC<{ data: ComparisonData; t: (key: string) => string }> = ({ data, t }) => {
  const chartData = useMemo(() => {
    return data.rows.map(row => {
      const entry: any = { feature: tFeature(t, row.feature) };
      data.plans.forEach((plan, i) => {
        entry[plan] = scoreValue(row.values[i]);
      });
      return entry;
    });
  }, [data, t]);

  return (
    <motion.div variants={fadeIn} className="rounded-2xl border p-6"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card, #111827)' }}>
      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <i className="fas fa-chart-pie text-[var(--accent-blue)]" />
        {t("comparison.radar_title")}
      </h3>
      <ResponsiveContainer width="100%" height={380}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="var(--border-color)" strokeDasharray="3 3" />
          <PolarAngleAxis dataKey="feature" tick={{ fontSize: 10, fill: "var(--text-secondary)", fontFamily: "monospace" }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--text-secondary)" }} />
          {data.plans.map((plan, i) => (
            <Radar key={plan} name={plan} dataKey={plan} stroke={PLAN_COLORS[i % PLAN_COLORS.length]}
              fill={PLAN_COLORS[i % PLAN_COLORS.length]} fillOpacity={0.1} strokeWidth={2} />
          ))}
          <Tooltip content={<ChartTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

const BarChartView: React.FC<{ data: ComparisonData; t: (key: string) => string }> = ({ data, t }) => {
  const numericRows = data.rows.filter(r => r.values.some(v => scoreValue(v) > 0));

  return (
    <motion.div variants={fadeIn} className="rounded-2xl border p-6"
      style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card, #111827)' }}>
      <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-6 flex items-center gap-2">
        <i className="fas fa-chart-bar text-[var(--accent-blue)]" />
        {t("comparison.bar_title")}
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={numericRows.map(row => {
          const entry: any = { feature: tFeature(t, row.feature) };
          data.plans.forEach((plan, i) => { entry[plan] = scoreValue(row.values[i]); });
          return entry;
        })} barSize={20} barGap={4}>
          <XAxis dataKey="feature" tick={{ fontSize: 10, fill: "var(--text-secondary)", fontFamily: "monospace" }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: "var(--text-secondary)" }} />
          <Tooltip content={<ChartTooltip />} />
          {data.plans.map((plan, i) => (
            <Bar key={plan} dataKey={plan} fill={PLAN_COLORS[i % PLAN_COLORS.length]}
              radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

const ComparisonTable: React.FC<{ data: ComparisonData; t: (key: string) => string }> = ({ data, t }) => (
  <div className="block lg:hidden">
    <div className="grid grid-cols-1 gap-3">
      {data.rows.map((row) => (
        <motion.div key={row.feature} variants={slideUp} className="rounded-2xl border overflow-hidden"
          style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card, #111827)' }}>
          <div className="px-4 py-2.5 border-b" style={{ backgroundColor: `${PLAN_COLORS[0]}10`, borderColor: 'var(--border-color)' }}>
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: PLAN_COLORS[0] }}>{tFeature(t, row.feature)}</span>
          </div>
          {data.plans.map((plan, i) => (
            <div key={plan} className="flex items-center justify-between px-4 py-2.5 border-b last:border-b-0"
              style={{ borderColor: 'var(--border-color)' }}>
              <span className="text-[10px] font-black uppercase tracking-tight text-[var(--text-primary)]">{plan}</span>
              <span className="text-xs text-[var(--text-secondary)] font-mono text-right">{tVal(t, row.values[i])}</span>
            </div>
          ))}
        </motion.div>
      ))}
    </div>
  </div>
);

const DesktopTable: React.FC<{ data: ComparisonData; t: (key: string) => string }> = ({ data, t }) => (
  <div className="hidden lg:block overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="text-left text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)] p-4 border-b"
            style={{ borderColor: 'var(--border-color)' }}>
            {t("comparison.feature")}
          </th>
          {data.plans.map((plan, i) => (
            <th key={plan} className="text-center text-xs font-black uppercase tracking-tight p-4 border-b"
              style={{ color: PLAN_COLORS[i % PLAN_COLORS.length], borderColor: 'var(--border-color)' }}>
              {plan}
            </th>
          ))}
        </tr>
      </thead>
      <motion.tbody variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
        {data.rows.map((row) => (
          <motion.tr key={row.feature} variants={slideUp}
            className="transition-colors" style={{ borderBottom: `1px solid var(--border-color)` }}>
            <td className="text-xs font-bold text-[var(--text-primary)] p-4">{tFeature(t, row.feature)}</td>
            {row.values.map((val, i) => (
              <td key={i} className="text-xs p-4 text-center font-mono leading-relaxed whitespace-pre-line"
                style={{ color: val === "\u2014" ? "var(--text-secondary)" : PLAN_COLORS[i % PLAN_COLORS.length] }}>
                {tVal(t, val)}
              </td>
            ))}
          </motion.tr>
        ))}
      </motion.tbody>
    </table>
  </div>
);

export const HostComparison: React.FC = () => {
  const { t } = useTranslation();
  const { comparisons, loading } = useComparisons();
  const [activeCategory, setActiveCategory] = useState<ComparisonCategory>("shared");
  const [showTable, setShowTable] = useState(false);
  const data = comparisons ? comparisons[activeCategory] : null;

  if (loading || !data) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex flex-col gap-8 md:gap-12 max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen flex flex-col gap-8 md:gap-12 max-w-7xl mx-auto px-6 md:px-12 relative">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #3b82f6, transparent)" }} />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-[0.04]"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />
        <div className="absolute top-1/3 left-1/4 w-60 h-60 rounded-full blur-3xl opacity-[0.02]"
          style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="text-center flex flex-col items-center">
        <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
          {t("comparison.badge")}
        </motion.span>
        <PageTitle text={t("comparison.title")} className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-3" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="text-sm mt-4 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t("comparison.subtitle")}
        </motion.p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex justify-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <motion.button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }}
            className={`relative flex items-center gap-2 px-4 md:px-5 py-3 text-[10px] font-mono font-bold uppercase tracking-wider border transition-all duration-300 rounded-xl ${
              activeCategory === cat.id
                ? "border-[var(--accent-blue)] text-[var(--accent-blue)] bg-[var(--accent-blue)]/8 shadow-[0_0_20px_var(--accent-glow)]"
                : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)]/30 hover:text-[var(--text-primary)] bg-transparent"
            }`}>
            {activeCategory === cat.id && (
              <motion.span layoutId="tab-glow-compare"
                className="absolute inset-0 rounded-xl bg-gradient-to-b from-[var(--accent-blue)]/8 to-transparent pointer-events-none"
                transition={{ type: "spring", stiffness: 500, damping: 30 }} />
            )}
            <i className={`${cat.icon} text-xs relative z-10`} />
            <span className="relative z-10">{t(cat.labelKey)}</span>
          </motion.button>
        ))}
      </motion.div>

      {data.note && (
        <p className="text-[10px] text-[var(--text-secondary)] font-mono text-center -mt-2">{data.note}</p>
      )}

      <motion.div key={activeCategory} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-30px" }}
          className="flex flex-col gap-8">
          <PlanCards data={data} t={t} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RadarChartView data={data} t={t} />
            <BarChartView data={data} t={t} />
          </div>

          <motion.div variants={fadeIn} className="rounded-2xl border p-6"
            style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card, #111827)' }}>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <i className="fas fa-chart-line text-[var(--accent-blue)]" />
              {t("comparison.score_title")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.plans.map((plan, idx) => {
                const scores = data.rows.map(r => scoreValue(r.values[idx]));
                const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
                return (
                  <motion.div key={plan} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: idx * 0.1 }}
                    className="text-center p-4 border rounded-lg" style={{ borderColor: 'var(--border-color)' }}>
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border-color)" strokeWidth="6" />
                        <motion.circle cx="40" cy="40" r="34" fill="none"
                          stroke={PLAN_COLORS[idx % PLAN_COLORS.length]} strokeWidth="6" strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 34}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                          whileInView={{ strokeDashoffset: 2 * Math.PI * 34 * (1 - avg / 100) }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: [0.25, 0.1, 0, 1] }} />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-sm font-black"
                        style={{ color: PLAN_COLORS[idx % PLAN_COLORS.length] }}>{avg}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-tight text-[var(--text-primary)]">{plan}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div variants={fadeIn}>
            <button onClick={() => setShowTable(!showTable)}
              className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-blue)] hover:underline mb-4 transition-colors">
              <i className={`fas fa-chevron-${showTable ? 'up' : 'down'} text-[8px]`} />
              {showTable ? t("comparison.table_hide") : t("comparison.table_show")} {t("comparison.table_full_spec")}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showTable ? 'max-h-[10000px] opacity-100' : 'max-h-0 opacity-0'}`}>
              <ComparisonTable data={data} t={t} />
              <DesktopTable data={data} t={t} />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="text-[10px] text-[var(--text-secondary)] font-mono text-center max-w-2xl mx-auto">
        {t("comparison.footer")}
      </motion.p>
    </div>
  );
};
