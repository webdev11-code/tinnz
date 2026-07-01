import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { HeroConsole } from "../components/HeroConsole";
import { HostingSlider } from "../components/HostingSlider";
import { ControlPanelShowcase } from "../components/ControlPanelShowcase";
import { FAQAccordion } from "../components/FAQAccordion";
import { CyberNetworkMap } from "../components/CyberNetworkMap";
import { useReviews } from "../hooks/useFirestore";

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0, 1] as const } },
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0, 1] as const } },
};

const CountUp: React.FC<{ end: string }> = ({ end }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const match = end.match(/^([\d,.]+)(.*)/);
  const raw = match ? match[1].replace(/,/g, "") : "0";
  const suffix = match ? match[2] : "";
  const numeric = parseFloat(raw) || 0;
  const isDone = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el || !numeric || isDone.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isDone.current) {
          isDone.current = true;
          let val = 0;
          const step = Math.ceil(numeric / 40);
          timerRef.current = setInterval(() => {
            val += step;
            if (val >= numeric) {
              val = numeric;
              clearInterval(timerRef.current);
              timerRef.current = undefined;
            }
            setCount(val);
          }, 40);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = undefined;
      }
    };
  }, [numeric]);

  if (!numeric) return <span ref={ref}>{end}</span>;
  const display = Number.isInteger(numeric) ? count.toLocaleString() : count.toFixed(1);
  return (
    <span ref={ref}>
      {display}{suffix}
      {count < numeric && <span className="animate-pulse text-[var(--accent-blue)]">|</span>}
    </span>
  );
};

const FadeInView: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({
  children, className, delay = 0,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0, 1] as const }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { reviews } = useReviews();
  const [testiIdx, setTestiIdx] = useState(0);
  const testiTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reviews.length === 0) return;
    testiTimer.current = setInterval(() => {
      setTestiIdx((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(testiTimer.current);
  }, [reviews.length]);

  return (
    <div className="min-h-screen flex flex-col gap-10 md:gap-24 pt-20 pb-16 bg-animated">
      <div className="orb-3" />
      <section className="relative overflow-hidden py-16 md:py-24 max-w-7xl mx-auto px-6 md:px-12 w-full flex flex-col lg:flex-row items-center gap-12">
        <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--accent-blue)]/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0, 1] as const }}
          className="flex-1 flex flex-col items-start text-left gap-4 relative z-10"
        >
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
              {t('home.badge')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-[48px] sm:text-[64px] md:text-[84px] font-black leading-[0.85] tracking-[-0.04em] uppercase"
          >
            <span className="text-[var(--text-primary)]">ULTRA</span><br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent inline-block hover:scale-110 active:scale-110 transition-transform duration-300 cursor-default">STABLE</span><br />
            <span className="text-[var(--text-primary)]">HOSTING</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-2 text-sm md:text-lg text-[var(--text-secondary)] max-w-md font-light leading-relaxed"
          >
            {t('home.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-center gap-4 mt-4"
          >
            <Link
              to="/game-hosting"
              className="group relative px-6 py-3.5 bg-[var(--text-primary)] text-[var(--bg-primary)] text-[10px] font-mono uppercase tracking-[0.2em] font-bold hover:bg-[var(--accent-blue)] hover:text-white transition-all duration-300 border border-[var(--text-primary)] hover:border-[var(--accent-blue)] overflow-hidden rounded-xl btn-depth"
            >
              <span className="relative z-10 flex items-center gap-2">
                <i className="fas fa-rocket" />
                {t('home.cta_start')}
              </span>
              <span className="absolute inset-0 bg-[var(--accent-blue)] translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3.5 border border-[var(--border-color)] text-[var(--text-primary)] text-[10px] font-mono uppercase tracking-[0.2em] font-bold hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 flex items-center gap-2 rounded-xl btn-outline btn-depth"
            >
              <i className="fab fa-whatsapp" />
              {t('home.cta_contact')}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-wrap gap-4 md:gap-12 items-end mt-6 md:mt-8 border-t border-[var(--border-color)] pt-6 md:pt-8 w-full"
          >
            {[
              { label: t('home.stat_active_users'), value: "2,500+", isAccent: false },
              { label: t('home.stat_uptime'), value: "99.9%", isAccent: true },
              { label: t('home.stat_support'), value: "24/7", isAccent: false },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-[9px] md:text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-1.5">
                  {stat.label}
                </span>
                <span className={`text-2xl md:text-3xl font-black ${stat.isAccent ? "text-[var(--accent-blue)]" : "text-[var(--text-primary)]"}`}>
                  <CountUp end={stat.value} />
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0, 1] as const }}
          className="flex-1 w-full flex justify-center relative z-10"
        >
          <HeroConsole />
        </motion.div>
      </section>

      <div className="w-full overflow-hidden py-12 marquee-fade border-y border-[var(--border-color)] bg-[var(--bg-card)]/50 section-depth">
        <div className="flex flex-col gap-8">
          <div className="marquee-track">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-xl md:text-4xl font-black uppercase tracking-tight select-none whitespace-nowrap marquee-text">
                24/7 SUPPORT • MINECRAFT HOSTING • CLOUD VPS • PTERODACTYL SERVICE • SERVER SETUP
              </span>
            ))}
            {[...Array(6)].map((_, i) => (
              <span key={`dup-${i}`} className="text-xl md:text-4xl font-black uppercase tracking-tight select-none whitespace-nowrap marquee-text">
                24/7 SUPPORT • MINECRAFT HOSTING • CLOUD VPS • PTERODACTYL SERVICE • SERVER SETUP
              </span>
            ))}
          </div>
          <div className="marquee-track marquee-reverse">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="text-lg md:text-3xl font-black uppercase tracking-tight select-none whitespace-nowrap marquee-text-dim">
                DDOS PROTECTION • LOW LATENCY • INSTANT DEPLOY • HIGH PERFORMANCE
              </span>
            ))}
            {[...Array(6)].map((_, i) => (
              <span key={`dup-${i}`} className="text-lg md:text-3xl font-black uppercase tracking-tight select-none whitespace-nowrap marquee-text-dim">
                DDOS PROTECTION • LOW LATENCY • INSTANT DEPLOY • HIGH PERFORMANCE
              </span>
            ))}
          </div>
        </div>
      </div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="bg-zinc-900/5 dark:bg-zinc-950/20 py-16 md:py-20 transition-colors duration-300 border-t border-b border-[var(--border-color)] section-depth relative overflow-hidden"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[700px] bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-purple-500/5 rounded-full blur-[150px] pointer-events-none animate-wave-move" />
        <div className="absolute inset-0 opacity-[0.02] animate-noise pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")', backgroundSize: '200px 200px' }} />
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16 flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
              {t('home.advantages_badge')}
            </span>
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mt-3 text-[var(--text-primary)]">
              {t('home.advantages_title')}
            </h2>
            <p className="text-xs md:text-sm mt-4 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
              {t('home.advantages_subtitle')}
            </p>
          </motion.div>

          <motion.div
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 auto-rows-auto"
          >
            
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative card-depth p-6 md:p-7 flex flex-col gap-4 overflow-hidden border-t-2 border-t-emerald-500/30 hover:border-t-emerald-400/60 hover:shadow-[0_0_40px_rgba(52,211,153,0.1)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-[80px] group-hover:bg-emerald-500/20 transition-all duration-700 pointer-events-none" />
              
              <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden opacity-[0.08] pointer-events-none max-sm:hidden">
                <svg viewBox="0 0 400 80" className="w-full h-full">
                  <path d="M0 60 Q50 20 100 40 T200 30 T300 50 T400 40 L400 80 L0 80Z" fill="url(#waveGrad)" className="animate-wave-move">
                    <animate attributeName="d" dur="4s" repeatCount="indefinite"
                      values="M0 60 Q50 20 100 40 T200 30 T300 50 T400 40 L400 80 L0 80Z;
                              M0 50 Q50 35 100 25 T200 45 T300 35 T400 45 L400 80 L0 80Z;
                              M0 60 Q50 20 100 40 T200 30 T300 50 T400 40 L400 80 L0 80Z" />
                  </path>
                  <defs>
                    <linearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                  <i className="fas fa-headset text-lg animate-wave-move" />
                </div>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold font-mono text-emerald-400 uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  {t('home.advantages_support_online')}
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-emerald-400 transition-colors duration-300">{t('home.advantages_support_title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-light mt-2 leading-relaxed">{t('home.advantages_support_desc')}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex items-end gap-[2px] h-8 max-sm:animate-none">
                    <div className="w-1.5 bg-emerald-400/60 rounded-full animate-signal-pulse" />
                    <div className="w-1.5 bg-emerald-400/60 rounded-full animate-signal-pulse-2" />
                    <div className="w-1.5 bg-emerald-400/60 rounded-full animate-signal-pulse-3" />
                    <div className="w-1.5 bg-emerald-400/60 rounded-full animate-signal-pulse-4" />
                    <div className="w-1.5 bg-emerald-400/60 rounded-full animate-signal-pulse-5" />
                    <div className="w-1.5 bg-emerald-400/60 rounded-full animate-signal-pulse-6" />
                  </div>
                  <div className="text-[10px] font-mono text-emerald-400/80">
                    {t('home.advantages_support_response')} <strong className="text-emerald-400">&lt; 5 mins</strong>
                  </div>
                </div>
              </div>
            </motion.div>

            
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative card-depth p-6 md:p-7 flex flex-col gap-4 overflow-hidden border-t-2 border-t-cyan-500/30 hover:border-t-cyan-400/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.1)] transition-all duration-500 sm:col-span-2 lg:col-span-2"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/10 rounded-full blur-[80px] group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none" />
              
              <div className="absolute top-6 right-6 w-28 h-28 pointer-events-none opacity-[0.12] max-sm:hidden">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle cx="60" cy="60" r="55" fill="none" stroke="#22D3EE" strokeWidth="0.5" className="animate-orbit" />
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#22D3EE" strokeWidth="0.3" className="animate-orbit-reverse" />
                  <circle cx="60" cy="60" r="35" fill="none" stroke="#22D3EE" strokeWidth="0.5" className="animate-orbit" style={{ animationDuration: '4s' }} />
                  <circle cx="60" cy="60" r="8" fill="#22D3EE" opacity="0.4">
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 transition-all duration-300 mb-4">
                  <i className="fas fa-shield-halved text-lg" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-cyan-400 transition-colors duration-300">{t('home.advantages_ddos_title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-light mt-2 leading-relaxed">{t('home.advantages_ddos_desc')}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-400">L7 Mitigation</span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-400">Always-On</span>
                  <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-[9px] font-mono text-cyan-400">Auto-Scaling</span>
                </div>
                
                <div className="absolute -top-2 right-4 flex gap-1 pointer-events-none max-sm:hidden">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-particle" />
                  <span className="w-1 h-1 rounded-full bg-cyan-400 animate-particle-2" />
                  <span className="w-1 h-1.5 rounded-full bg-cyan-400 animate-particle-3" />
                </div>
              </div>
            </motion.div>

            
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative card-depth p-6 md:p-7 flex flex-col gap-4 overflow-hidden border-t-2 border-t-amber-500/30 hover:border-t-amber-400/60 hover:shadow-[0_0_40px_rgba(251,191,36,0.1)] transition-all duration-500 sm:col-span-2 lg:col-span-2"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-[80px] group-hover:bg-amber-500/20 transition-all duration-700 pointer-events-none" />
              
              <div className="absolute top-4 left-4 w-20 h-20 pointer-events-none opacity-[0.15] max-sm:hidden">
                <svg viewBox="0 0 80 80" className="w-full h-full">
                  <text x="0" y="16" fontSize="10" fill="#FBBF24" className="animate-star-sparkle">★</text>
                  <text x="50" y="10" fontSize="6" fill="#FBBF24" className="animate-star-sparkle-2">✦</text>
                  <text x="60" y="40" fontSize="8" fill="#FBBF24" className="animate-star-sparkle-3">★</text>
                  <text x="20" y="50" fontSize="5" fill="#FBBF24" className="animate-star-sparkle-2">✦</text>
                  <text x="70" y="60" fontSize="6" fill="#FBBF24" className="animate-star-sparkle">✦</text>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all duration-300 mb-4">
                  <i className="fas fa-star text-lg" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-amber-400 transition-colors duration-300">{t('home.advantages_reviews_title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-light mt-2 leading-relaxed">{t('home.advantages_reviews_desc')}</p>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-black bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">4.9</span>
                    <span className="text-[8px] font-mono text-[var(--text-secondary)] uppercase tracking-wider mt-0.5">{t('home.advantages_reviews_rating')}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="flex gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star text-[11px] ${i === 4 ? 'animate-star-sparkle' : ''}`} />
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="h-1.5 flex-1 rounded-full bg-zinc-700/50 overflow-hidden min-w-[60px]">
                        <div className="h-full w-[98%] rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 max-sm:animate-none" />
                      </div>
                      <span className="text-[8px] font-mono text-[var(--text-secondary)]">98%</span>
                    </div>
                    <span className="text-[8px] font-mono text-[var(--text-secondary)]">Trustpilot</span>
                  </div>
                </div>
              </div>
            </motion.div>

            
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative card-depth p-6 md:p-7 flex flex-col gap-4 overflow-hidden border-t-2 border-t-blue-500/30 hover:border-t-blue-400/60 hover:shadow-[0_0_40px_rgba(59,130,246,0.1)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none" />
              
              <div className="absolute top-5 right-5 w-16 h-16 pointer-events-none max-sm:hidden">
                <div className="absolute inset-0 rounded-full border border-blue-400/20 animate-pulse-ring" />
                <div className="absolute inset-0 rounded-full border border-blue-400/15 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
                <div className="absolute inset-0 rounded-full border border-blue-400/10 animate-pulse-ring" style={{ animationDelay: '1s' }} />
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300 mb-4">
                  <i className="fas fa-shield text-lg" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-blue-400 transition-colors duration-300">{t('home.advantages_money_title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-light mt-2 leading-relaxed">{t('home.advantages_money_desc')}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold font-mono text-blue-400">
                    <i className="fas fa-check-circle text-[9px]" />
                    <span>{t('home.advantages_money_riskfree')}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)]">
                    <strong className="text-blue-400">7 Days</strong> {t('home.advantages_money_refund')}
                  </span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 text-6xl text-blue-500/5 pointer-events-none max-sm:hidden">
                <i className="fas fa-check-circle" />
              </div>
            </motion.div>

            
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative card-depth p-6 md:p-7 flex flex-col gap-4 overflow-hidden border-t-2 border-t-purple-500/30 hover:border-t-purple-400/60 hover:shadow-[0_0_40px_rgba(167,139,250,0.1)] transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />
              
              <div className="absolute bottom-4 right-4 w-20 h-20 pointer-events-none opacity-[0.15] max-sm:hidden">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="4" opacity="0.2" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#8B5CF6" strokeWidth="4"
                    strokeDasharray="251.2" strokeDashoffset="251.2"
                    strokeLinecap="round" transform="rotate(-90 50 50)">
                    <animate attributeName="stroke-dashoffset" from="251.2" to="50.24" dur="3s" repeatCount="indefinite" />
                  </circle>
                  <line x1="50" y1="50" x2="50" y2="20" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round">
                    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="4s" repeatCount="indefinite" />
                  </line>
                </svg>
              </div>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300 mb-4">
                  <i className="fas fa-gauge-high text-lg" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-purple-400 transition-colors duration-300">{t('home.advantages_performance_title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-light mt-2 leading-relaxed">{t('why_choose_us.performance_desc')}</p>
                
                <div className="mt-4 flex items-end gap-2 h-14 max-sm:animate-none">
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-purple-500/20 rounded-t-sm animate-bar-1" style={{ height: '40%' }} />
                    <span className="text-[7px] font-mono text-[var(--text-secondary)]">Read</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-purple-400/30 rounded-t-sm animate-bar-2" style={{ height: '60%' }} />
                    <span className="text-[7px] font-mono text-[var(--text-secondary)]">Write</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-purple-500/20 rounded-t-sm animate-bar-3" style={{ height: '45%' }} />
                    <span className="text-[7px] font-mono text-[var(--text-secondary)]">CPU</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full bg-purple-400/30 rounded-t-sm animate-bar-4" style={{ height: '75%' }} />
                    <span className="text-[7px] font-mono text-[var(--text-secondary)]">RAM</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono text-purple-400">Ryzen 5 5600</span>
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono text-purple-400">NVMe SSD</span>
                  <span className="px-2.5 py-1 rounded-md bg-purple-500/10 border border-purple-500/20 text-[9px] font-mono text-purple-400">DDR4 ECC</span>
                </div>
              </div>
            </motion.div>

            
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.3 } }}
              className="group relative card-depth p-6 md:p-7 flex flex-col gap-4 overflow-hidden border-t-2 border-t-rose-500/30 hover:border-t-rose-400/60 hover:shadow-[0_0_40px_rgba(244,63,94,0.1)] transition-all duration-500 sm:col-span-2 lg:col-span-2"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-rose-500/10 rounded-full blur-[80px] group-hover:bg-rose-500/20 transition-all duration-700 pointer-events-none" />
              
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-3 pointer-events-none opacity-[0.15] max-sm:hidden">
                <div className="w-1 h-6 rounded-full bg-rose-400 animate-rocket" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-8 rounded-full bg-rose-500 animate-rocket" style={{ animationDelay: '0.3s' }} />
                <div className="w-1 h-5 rounded-full bg-rose-400 animate-rocket" style={{ animationDelay: '0.6s' }} />
                <div className="w-1 h-7 rounded-full bg-rose-500 animate-rocket" style={{ animationDelay: '0.9s' }} />
                <div className="w-1 h-4 rounded-full bg-rose-400 animate-rocket" style={{ animationDelay: '1.2s' }} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 group-hover:bg-rose-500/20 transition-all duration-300">
                    <i className="fas fa-bolt text-lg" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-[8px] font-black font-mono text-rose-400 uppercase tracking-[0.2em] animate-pulse">INSTANT</span>
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-rose-400 transition-colors duration-300">{t('home.advantages_setup_title')}</h3>
                <p className="text-xs text-[var(--text-secondary)] font-light mt-2 leading-relaxed">{t('why_choose_us.setup_desc')}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative w-14 h-14 flex items-center justify-center">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-500/20" />
                      <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" strokeWidth="2"
                        strokeDasharray="97.4" strokeDashoffset="97.4"
                        strokeLinecap="round" className="text-rose-400">
                        <animate attributeName="stroke-dashoffset" from="97.4" to="9.74" dur="2s" repeatCount="indefinite" />
                      </circle>
                    </svg>
                    <span className="absolute text-[9px] font-black font-mono text-rose-400 animate-pulse">&lt;30s</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-rose-400/80">{t('home.advantages_setup_autodeploy')}</span>
                    <span className="text-[9px] font-mono text-[var(--text-secondary)]">Pterodactyl Panel</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      <FadeInView>
        <section className="bg-zinc-100/60 dark:bg-zinc-950/40 border-b border-[var(--border-color)] section-depth">
          <CyberNetworkMap />
        </section>
      </FadeInView>

      <FadeInView>
        <section>
          <HostingSlider />
        </section>
      </FadeInView>

      <FadeInView>
        <section className="bg-zinc-900/5 dark:bg-zinc-950/20 py-12 md:py-16 border-y border-[var(--border-color)] section-depth">
          <ControlPanelShowcase />
        </section>
      </FadeInView>

      <section className="max-w-7xl mx-auto px-6 md:px-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-12 flex flex-col items-center"
        >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
              {t('home.reviews_badge')}
            </span>
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mt-3 text-[var(--text-primary)]">
              {t('home.reviews_title')}
            </h2>
          </motion.div>

          {reviews.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
              className="max-w-3xl mx-auto card-depth rounded-xl p-8 md:p-14 flex flex-col items-center text-center gap-8 relative overflow-hidden bg-[var(--glass-bg)] backdrop-blur-sm border-[var(--border-color)] group hover:border-[var(--accent-blue)]/30 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-blue)]/5 via-transparent to-[var(--accent-purple)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--accent-blue)]/40 to-transparent" />
              <i className="fas fa-quote-left text-3xl md:text-4xl text-[var(--accent-blue)] opacity-10 absolute top-8 left-8" />
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[var(--accent-blue)]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[var(--accent-blue)]/20 transition-all duration-700" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[var(--accent-purple)]/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-[var(--accent-purple)]/20 transition-all duration-700" />

              <AnimatePresence mode="wait">
                <motion.p
                  key={testiIdx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-sm md:text-base leading-relaxed text-[var(--text-primary)] font-light max-w-xl relative z-10"
                >
                  "{i18n.language === "en" && reviews[testiIdx].text_en ? reviews[testiIdx].text_en : reviews[testiIdx].text}"
                </motion.p>
              </AnimatePresence>

              <div className="flex items-center justify-center gap-1 text-amber-400 relative z-10">
                {Array.from({ length: reviews[testiIdx].rating }, (_, i) => (
                  <i key={i} className="fas fa-star text-sm" />
                ))}
                {Array.from({ length: 5 - reviews[testiIdx].rating }, (_, i) => (
                  <i key={i} className="far fa-star text-sm text-zinc-600" />
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={testiIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 relative z-10 border-t border-[var(--border-color)] pt-6 w-full"
                >
                  {reviews[testiIdx].photo ? (
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/40 to-[var(--accent-purple)]/40 blur-md" />
                      <img src={reviews[testiIdx].photo} alt={reviews[testiIdx].name} className="relative w-14 h-14 rounded-full object-cover border-2 border-[var(--border-color)]" referrerPolicy="no-referrer" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/20 to-[var(--accent-purple)]/20 flex items-center justify-center border-2 border-[var(--border-color)] shrink-0">
                      <i className="fas fa-user text-lg text-[var(--accent-blue)]" />
                    </div>
                  )}
                  <div className="flex flex-col items-start gap-0.5 text-left">
                    <h4 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">
                      {reviews[testiIdx].name}
                    </h4>
                    <span className="text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-wider">
                      {reviews[testiIdx].role}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center gap-2.5 relative z-10">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestiIdx(i)}
                    className={`rounded-full transition-all duration-500 ${
                      testiIdx === i
                        ? "w-9 h-2.5 bg-[var(--accent-blue)] shadow-[0_0_10px_var(--accent-blue)]"
                        : "w-2.5 h-2.5 bg-[var(--border-color)] hover:bg-[var(--text-secondary)]"
                    }`}
                    aria-label={`Show review ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
      </section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="bg-zinc-900/5 dark:bg-zinc-950/20 py-16 md:py-20 border-t border-[var(--border-color)] section-depth"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="text-center mb-12 md:mb-16 flex flex-col items-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
              {t('home.faq_badge')}
            </span>
            <h2 className="text-2xl md:text-5xl font-black uppercase tracking-tight mt-3 text-[var(--text-primary)]">
              {t('home.faq_title')}
            </h2>
          </div>
          <FAQAccordion />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
            className="relative overflow-hidden card-depth rounded-xl border bg-[var(--glass-bg)] backdrop-blur-sm border-[var(--border-color)] p-6 md:p-10 mt-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)]/10 via-transparent to-[var(--accent-purple)]/10 animate-gradient-x pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-3">
                <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent-blue)]">
                  <i className="fas fa-circle text-[6px]" />
                  {t('home.cta_badge')}
                </span>
                <h3 className="text-lg md:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
                  {t('home.cta_title')}
                </h3>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] font-light leading-relaxed max-w-xl">
                  {t('home.cta_desc')}
                </p>
              </div>
              <a
                href="https://clients.tinnzstore.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-[var(--accent-blue)] to-blue-600 hover:from-blue-500 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-[var(--accent-blue)]/20 active:scale-95 w-fit shrink-0 btn-depth"
              >
                {t('home.cta_deploy')}
                <i className="fas fa-arrow-right text-[10px]" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};
