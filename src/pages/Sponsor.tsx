import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PageTitle } from "../components/PageTitle";
import { useSponsors } from "../hooks/useFirestore";
import { useTranslation } from "react-i18next";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
};

const DISCORD = "https://discord.gg/Nz9b6bMuNe";

const terms = [
  { number: "01", title: "sponsor.term1_title", desc: "sponsor.term1_desc" },
  { number: "02", title: "sponsor.term2_title", desc: "sponsor.term2_desc" },
  { number: "03", title: "sponsor.term3_title", desc: "sponsor.term3_desc" },
  { number: "04", title: "sponsor.term4_title", desc: "sponsor.term4_desc" },
  { number: "05", title: "sponsor.term5_title", desc: "sponsor.term5_desc" },
  { number: "06", title: "sponsor.term6_title", desc: "sponsor.term6_desc" },
];

const ProjectCard: React.FC<{ p: { id?: string; title: string; image: string; game: string; desc: string; desc_en?: string; owners: string } }> = ({ p }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language === "en";
  const descKey = p.id ? `sponsor_data.${p.id.replace(/-/g, "_")}_desc` : "";
  const desc = isEn && p.desc_en ? p.desc_en : descKey ? t(descKey, { defaultValue: p.desc }) : p.desc;
  return (
    <motion.div
      variants={slideUp}
      whileHover={{ y: -6, transition: { duration: 0.3 } }}
      className="group relative overflow-hidden card-depth transition-all duration-500 hover:shadow-2xl hover:shadow-[var(--accent-blue)]/5"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[var(--accent-blue)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-gradient-to-b from-[var(--accent-blue)] to-[var(--accent-purple)] transition-all duration-500" />
      <div className="p-6 flex flex-col gap-4 relative">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--accent-blue)]/30 to-[var(--accent-purple)]/30 blur-sm group-hover:blur-md transition-all duration-500" />
            <img
              src={p.image}
              alt={p.title}
              className="relative w-14 h-14 md:w-16 md:h-16 rounded-full object-cover border-2 border-[var(--border-color)] group-hover:border-[var(--accent-blue)]/50 transition-all duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-black uppercase tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors duration-300">{p.title}</h3>
            <span className="text-[9px] font-mono font-bold tracking-widest text-[var(--text-secondary)]">{p.game}</span>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">{desc}</p>
        <div className="border-t border-[var(--border-color)] pt-3 mt-auto">
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--accent-blue)]">{t('sponsor.owner_label')}</span>
          <p className="text-[11px] text-[var(--text-primary)] font-semibold mt-0.5">{p.owners}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const Sponsor: React.FC = () => {
  const { t } = useTranslation();
  const { sponsors } = useSponsors();

  const activeProjects = sponsors.filter(s => s.status === "AKTIF");
  const alumniProjects = sponsors.filter(s => s.status === "ALUMNI");

  return (
    <div className="pt-24 pb-16 min-h-screen flex flex-col gap-10 md:gap-16 max-w-7xl mx-auto px-6 md:px-12 overflow-hidden relative">
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--accent-blue)]/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-60 right-0 w-[400px] h-[400px] bg-[var(--accent-purple)]/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="text-center flex flex-col items-center relative"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
          {t('sponsor.badge')}
        </span>
        <PageTitle text={t('sponsor.title')} className="text-4xl md:text-6xl font-black uppercase tracking-tight mt-2 leading-tight" />
        <p className="text-sm mt-5 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t('sponsor.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <Link
            to="/sponsor/apply"
className="inline-flex items-center gap-2.5 px-7 py-3.5 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-[rgba(0,212,255,0.15)] transition-all duration-300 active:scale-95"
>
  <span className="flex items-center gap-2.5">
              {t('sponsor.cta_submit')}
              <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-bold rounded-xl text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)]/40 transition-all duration-300 active:scale-95"
          >
            <i className="fas fa-arrow-left text-[10px] group-hover:-translate-x-1 transition-transform" />
            {t('sponsor.cta_back')}
          </Link>
        </div>
      </motion.div>

      {activeProjects.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-emerald-400">{t('sponsor.active')}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-emerald-500/30 to-transparent" />
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {activeProjects.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </motion.div>
        </motion.section>
      )}

      {alumniProjects.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-cyan-400">{t('sponsor.alumni')}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-cyan-500/30 to-transparent" />
          </div>
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {alumniProjects.map((p) => (
              <ProjectCard key={p.id} p={p} />
            ))}
          </motion.div>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="border-t border-[var(--border-color)] pt-12 md:pt-16 relative"
      >
        <h2 className="text-xl md:text-3xl font-black uppercase tracking-tight text-center text-[var(--text-primary)]">{t('sponsor.transparency_title')}</h2>
        <p className="text-xs md:text-sm text-[var(--text-secondary)] font-light text-center mt-2 mb-8 md:mb-10 max-w-lg mx-auto">
          {t('sponsor.transparency_desc')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {terms.map((term) => (
            <motion.div
              key={term.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: Number(term.number) * 0.05, duration: 0.4 }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden card-depth p-5 flex flex-col gap-3 transition-all duration-300 hover:border-[var(--accent-blue)]/40 hover:shadow-[0_0_20px_rgba(0,212,255,0.05)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-blue)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="flex items-center gap-3 relative">
                <span className="w-8 h-8 flex items-center justify-center text-[11px] font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">
                  {term.number}
                </span>
                <h3 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-blue)] transition-colors duration-300">{t(term.title)}</h3>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] font-light leading-relaxed relative">{t(term.desc)}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden card-depth p-8 md:p-14 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)]/10 via-transparent to-[var(--accent-purple)]/10 animate-gradient-x pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-[var(--accent-blue)]/10 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[var(--accent-purple)]/10 blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-5">
          <span className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--accent-blue)]/30 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/10 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
            #sponsorship
          </span>
          <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">
            {t('sponsor.cta_title')}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] font-light max-w-lg">
            {t('sponsor.cta_desc')}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
            <Link
              to="/sponsor/apply"
              className="group relative inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-bold text-white rounded-xl overflow-hidden transition-all duration-300 active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)] to-blue-600 group-hover:from-blue-500 group-hover:to-blue-700 transition-all duration-300" />
              <span className="relative z-10 flex items-center gap-2.5">
                {t('sponsor.cta_submit_sponsor')}
                <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              to="/"
            className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-xs font-bold rounded-xl text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)]/40 transition-all duration-300 active:scale-95"
          >
            {t('sponsor.cta_back_home')}
            </Link>
          </div>
        </div>
      </motion.section>

    </div>
  );
};
