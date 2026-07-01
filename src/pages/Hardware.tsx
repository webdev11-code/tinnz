import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import WorldMap from "../components/WorldMap";
import { PageTitle } from "../components/PageTitle";
import { useTranslation } from "react-i18next";

const flagEmoji = (code: string) => {
  const base = 0x1F1E6;
  const a = code.charCodeAt(0) - 97 + base;
  const b = code.charCodeAt(1) - 97 + base;
  return String.fromCodePoint(a) + String.fromCodePoint(b);
};

interface NodeSpecs {
  cpu: string;
  cores: string;
  ram: string;
  storage: string;
  network: string;
  ddos: string;
  power: string;
  cooling: string;
}

interface NodeData {
  id: string;
  flag: string;
  location: string;
  type: "Baremetal" | "Virtual Machine";
  status: "Online" | "Offline" | "Maintenance";
  ping: string;
  desc: string;
  coords: [number, number];
  code: string;
  specs: NodeSpecs;
}

const nodes: NodeData[] = [
  {
    id: "jkt-baremetal",
    flag: "id",
    location: "Jakarta, Indonesia",
    type: "Baremetal",
    status: "Online",
    ping: "< 8ms",
    desc: "hardware.node_desc_jkt",
    coords: [106.865, -6.175],
    code: "JKT",
    specs: {
      cpu: "AMD EPYC 9654P Genoa",
      cores: "96 Cores / 192 Threads",
      ram: "512 GB DDR5 ECC",
      storage: "4× 3.84 TB NVMe Gen4",
      network: "10 Gbps Uplink",
      ddos: "8+ Tbit/s Protection",
      power: "Redundant 2× PSU",
      cooling: "Liquid Cooling",
    },
  },
  {
    id: "sg-baremetal",
    flag: "sg",
    location: "Singapore",
    type: "Baremetal",
    status: "Online",
    ping: "< 20ms",
    desc: "hardware.node_desc_sg",
    coords: [103.82, 1.352],
    code: "SIN",
    specs: {
      cpu: "AMD EPYC 7282",
      cores: "16 Cores / 32 Threads",
      ram: "256 GB DDR4 ECC",
      storage: "2× 1.92 TB NVMe Gen4",
      network: "10 Gbps Uplink",
      ddos: "8+ Tbit/s Protection",
      power: "Redundant 2× PSU",
      cooling: "Air Cooling",
    },
  },
  {
    id: "my-baremetal",
    flag: "my",
    location: "Kuala Lumpur, Malaysia",
    type: "Baremetal",
    status: "Online",
    ping: "< 25ms",
    desc: "hardware.node_desc_my",
    coords: [101.68, 3.15],
    code: "KUL",
    specs: {
      cpu: "AMD EPYC 7302",
      cores: "16 Cores / 32 Threads",
      ram: "128 GB DDR4 ECC",
      storage: "2× 2 TB NVMe Gen4",
      network: "10 Gbps Uplink",
      ddos: "8+ Tbit/s Protection",
      power: "Redundant 2× PSU",
      cooling: "Air Cooling",
    },
  },
];

const specIcons: Record<keyof NodeSpecs, string> = {
  cpu: "fa-microchip",
  cores: "fa-cubes",
  ram: "fa-memory",
  storage: "fa-database",
  network: "fa-network-wired",
  ddos: "fa-shield-halved",
  power: "fa-bolt",
  cooling: "fa-fan",
};

const specLabels: Record<keyof NodeSpecs, string> = {
  cpu: "CPU",
  cores: "Cores",
  ram: "RAM",
  storage: "Storage",
  network: "Network",
  ddos: "DDoS",
  power: "Power",
  cooling: "Cooling",
};

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  React.useEffect(() => {
    if (done) return;
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setDone(true);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [text, done]);

  return (
    <span>
      {displayed}
      {!done && <span className="animate-pulse">▌</span>}
    </span>
  );
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

export const Hardware: React.FC = () => {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  const handleMarkerClick = useCallback((id: string) => {
    const node = nodes.find((n) => n.id === id);
    if (node) setSelectedNode(node);
  }, []);

  const handleMarkerHover = useCallback((id: string | null) => {
    setHoveredCode(id ? nodes.find((n) => n.id === id)?.code ?? null : null);
  }, []);

  const stats = [
    { value: "3", label: "hardware.stat_nodes", icon: "fa-location-dot" },
    { value: "99.9%", label: "hardware.stat_uptime", icon: "fa-chart-line" },
    { value: "8 Tbit/s", label: "hardware.stat_ddos", icon: "fa-shield-halved" },
    { value: "< 8ms", label: "hardware.stat_ping", icon: "fa-bolt" },
  ];

  return (
    <div className="pt-24 pb-20 min-h-screen flex flex-col gap-12 md:gap-20 max-w-7xl mx-auto px-6 md:px-12 overflow-hidden relative bg-animated">
      <div className="orb-3" />
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[300px] md:h-[500px] bg-[var(--accent-blue)]/5 rounded-full blur-[120px]" />
        <div className="absolute top-60 right-0 w-[300px] md:w-[500px] h-[200px] md:h-[400px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0, 1] as const }}
        className="relative flex flex-col items-center text-center pt-8 md:pt-12"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
            {t('hardware.badge')}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <PageTitle text={t('hardware.title')} className="text-4xl sm:text-5xl md:text-7xl font-black uppercase tracking-tight leading-[0.9]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-5 max-w-2xl"
        >
          <p className="text-sm md:text-base text-[var(--text-secondary)] font-mono leading-relaxed">
            <TypewriterText text={t('hardware.subtitle')} />
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center gap-6 mt-8 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-secondary)]"
        >
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {t('hardware.status_active')}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-0.5 bg-[var(--accent-blue)]" />
            {t('hardware.network')}
          </span>
        </motion.div>
      </motion.section>

      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 relative"
      >
        {stats.map((s) => (
          <motion.div
            key={s.label}
            variants={slideUp}
            whileHover={{ y: -4, transition: { duration: 0.3 } }}
            className="group relative p-4 md:p-8 card-depth flex flex-col items-center text-center transition-all duration-500 hover:border-[var(--accent-blue)] hover:shadow-[0_0_30px_rgba(0,212,255,0.08)]"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--accent-blue)]/0 via-[var(--accent-blue)]/0 to-[var(--accent-blue)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <i className={`fas ${s.icon} text-lg text-[var(--accent-blue)]`} />
            <span className="text-2xl md:text-3xl font-black text-[var(--text-primary)] mt-4 tracking-tight">{s.value}</span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)] mt-1.5">{t(s.label)}</span>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={slideUp}
        className="flex flex-col gap-6 relative"
      >
        <motion.div
          variants={slideUp}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-4"
        >
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
              <span className="w-1 h-1 rounded-full bg-[var(--accent-blue)] animate-pulse" />
              {t('hardware.topology_badge')}
            </span>
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[var(--text-primary)]">{t('hardware.topology_title')}</h2>
            <p className="text-xs md:text-sm mt-2 max-w-xl text-[var(--text-secondary)] font-mono leading-relaxed">
              {t('hardware.topology_desc')}
            </p>
          </div>
          <div className="flex items-center gap-5 text-[10px] text-[var(--text-secondary)] font-mono uppercase tracking-wider">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--accent-blue)] animate-pulse" />
              {t('hardware.topology_active')}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-0.5 bg-[var(--accent-blue)] opacity-60" />
              {t('hardware.topology_route')}
            </span>
          </div>
        </motion.div>

        <motion.div
          variants={slideUp}
          className="card-depth relative overflow-hidden"
        >
          <div className="absolute -inset-[1px] bg-gradient-to-r from-transparent via-[var(--accent-blue)]/5 to-transparent opacity-50" />
          <div className="w-full aspect-[16/10] md:aspect-[21/9] relative z-10">
            <WorldMap
              markers={nodes.map((n) => ({
                id: n.id,
                coords: n.coords,
                code: n.code,
                label: n.location,
                isActive: selectedNode?.code === n.code,
                isHovered: hoveredCode === n.code,
              }))}
              onMarkerClick={handleMarkerClick}
              onMarkerHover={handleMarkerHover}
              selectedId={selectedNode?.id ?? null}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 md:px-8 py-4 border-t border-[var(--border-color)] text-[10px] md:text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider relative z-10">
            <span className="flex items-center gap-2">
              <i className="fas fa-mouse text-[var(--accent-blue)]" />
              {t('hardware.topology_scroll')}
            </span>
            <span className="text-[var(--accent-blue)] font-bold flex items-center gap-2">
              <i className="fas fa-circle-info" />
              {t('hardware.topology_click')}
            </span>
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedNode && (
            <motion.div
              key={selectedNode.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0, 1] as const }}
              className="card-depth p-6 md:p-8 relative overflow-hidden"
            >
              <div
                className="absolute top-0 left-[12px] right-[12px] h-[1px] z-10"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--accent-blue), rgba(59,130,246,0.4), var(--accent-blue), transparent)",
                  boxShadow: "0 0 8px rgba(59,130,246,0.2)",
                }}
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 flex items-center justify-center card-depth border-[var(--border-color)] overflow-hidden text-3xl">
                    <span>{flagEmoji(selectedNode.flag)}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">{selectedNode.location}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2 py-0.5 rounded-lg border border-[var(--accent-blue)]/20">{t('hardware.type_' + selectedNode.type.toLowerCase().replace(/\s+/g, '_'))}</span>
                      <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-mono font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {t('hardware.status_' + selectedNode.status.toLowerCase())}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] border-l border-[var(--border-color)] pl-2 ml-1">Ping: {selectedNode.ping}</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById(`node-${selectedNode.id}`);
                    el?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="text-[10px] font-mono font-bold uppercase tracking-wider text-white rounded-xl bg-[var(--accent-blue)] hover:bg-black dark:hover:bg-white dark:hover:text-black border border-[var(--accent-blue)] px-5 py-3 transition-all duration-300 flex items-center gap-2 w-fit cursor-pointer"
                >
                  {t('hardware.specs_label')} <i className="fas fa-arrow-down text-[9px]" />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-light mt-4 max-w-2xl">{t(selectedNode.desc)}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.section>

      <section className="flex flex-col gap-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
            <span className="w-1 h-1 rounded-full bg-[var(--accent-blue)] animate-pulse" />
            {t('hardware.deploy_badge')}
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tight text-[var(--text-primary)]">{t('hardware.deploy_title')}</h2>
          <p className="text-xs md:text-sm mt-2 max-w-xl text-[var(--text-secondary)] font-mono leading-relaxed">
            {t('hardware.deploy_desc')}
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-8"
        >
          {nodes.map((node, idx) => (
            <motion.div
              id={`node-${node.id}`}
              key={node.id}
              variants={slideUp}
              className="relative card-depth"
            >
              <div
                className="absolute top-0 left-[12px] right-[12px] h-[2px] z-10"
                style={{
                  background: "linear-gradient(90deg, transparent, var(--accent-blue), rgba(59,130,246,0.5), var(--accent-blue), transparent)",
                  boxShadow: "0 0 10px rgba(59,130,246,0.3)",
                }}
              />
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[var(--accent-blue)]/3 to-transparent" />

              <div className="p-6 md:p-8 lg:p-10 relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 flex items-center justify-center card-depth border-[var(--border-color)] overflow-hidden shrink-0 text-3xl">
                      <span>{flagEmoji(node.flag)}</span>
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">{node.location}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 px-2.5 py-0.5 rounded-lg border border-[var(--accent-blue)]/20">{t('hardware.type_' + node.type.toLowerCase().replace(/\s+/g, '_'))}</span>
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-500 font-mono font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          {t('hardware.status_' + node.status.toLowerCase())}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)]">{node.ping}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {idx === 0 && (
                      <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                        <i className="fas fa-crown text-[8px]" /> {t('hardware.node_flag')}
                      </span>
                    )}
                    <span className="text-[9px] font-mono text-[var(--text-secondary)] border border-[var(--border-color)] px-2.5 py-1.5 rounded-lg">
                      NODE-{String(idx + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-light mb-8 max-w-3xl">{t(node.desc)}</p>

                <motion.div
                  variants={stagger}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5"
                >
                  {(Object.keys(node.specs) as (keyof NodeSpecs)[]).map((key) => (
                    <motion.div
                      key={key}
                      variants={slideUp}
                      whileHover={{ y: -3, transition: { duration: 0.2 } }}
                      className="group/spec card-depth p-3 md:p-5 flex flex-col gap-3 transition-all duration-300 hover:border-[var(--accent-blue)]/40"
                    >
                      <i className={`fas ${specIcons[key]} text-base text-[var(--accent-blue)]`} />
                      <div>
                        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">{specLabels[key]}</span>
                        <p className="text-xs md:text-sm font-semibold text-[var(--text-primary)] leading-tight mt-1">{node.specs[key]}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="card-depth border-[var(--border-color)] bg-gradient-to-r from-[var(--accent-blue)]/5 via-transparent to-blue-600/5 p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-start gap-5 relative overflow-hidden"
        >
          <div
            className="absolute top-0 left-[12px] right-[12px] h-[1px] z-10"
            style={{
              background: "linear-gradient(90deg, transparent, var(--accent-blue), rgba(59,130,246,0.3), transparent)",
              boxShadow: "0 0 6px rgba(59,130,246,0.15)",
            }}
          />
          <div className="w-14 h-14 flex items-center justify-center border border-[var(--accent-blue)]/30 text-2xl shrink-0 bg-[var(--accent-blue)]/5">💡</div>
          <div className="flex-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--text-primary)]">{t('hardware.flag_baremetal')}</span>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed mt-2 font-light max-w-3xl">
              {t('hardware.flag_desc1')}
              {t('hardware.flag_desc2')}
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
