import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";
import React from "react";
import { useTeamMembers } from "../hooks/useFirestore";
import { TeamCard } from "../components/TeamCard";
import { motion } from "motion/react";

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
};

export const About: React.FC = () => {
  const { t } = useTranslation();
  const { teamMembers, loading } = useTeamMembers();

  return (
    <div className="pt-24 pb-16 min-h-screen flex flex-col gap-10 md:gap-16 max-w-7xl mx-auto px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="text-center flex flex-col items-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
          {t('about.badge')}
        </span>
        <PageTitle text={t('about.title')} className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-3" />
        <p className="text-sm mt-4 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t('about.subtitle')}
        </p>
      </motion.div>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={slideUp}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
      >
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        >
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">{t('about.story_title')}</h2>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-4 leading-relaxed font-light text-justify">
            {t('about.story_p1')}
          </p>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-4 leading-relaxed font-light text-justify">
            {t('about.story_p2')}
          </p>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-4 leading-relaxed font-light text-justify">
            {t('about.story_p3')}
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {[
            { title: t('about.value1_title'), desc: t('about.value1_desc'), icon: "fas fa-gem", color: "#fb7185" },
            { title: t('about.value2_title'), desc: t('about.value2_desc'), icon: "fas fa-users", color: "#60a5fa" },
            { title: t('about.value3_title'), desc: t('about.value3_desc'), icon: "fas fa-handshake", color: "#34d399" },
            { title: t('about.value4_title'), desc: t('about.value4_desc'), icon: "fas fa-chart-line", color: "#a78bfa" },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={slideUp}
              whileHover={{ x: 4 }}
              className="flex gap-4 transition-all duration-300"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-full text-sm" style={{ backgroundColor: `${item.color}18`, color: item.color }}>
                  <i className={`fas ${item.icon}`} />
                </div>
                {i < 3 && <div className="w-px flex-1 min-h-[16px]" style={{ backgroundColor: `${item.color}20` }} />}
              </div>
              <div className="pb-6">
                <h3 className="text-xs font-bold text-[var(--text-primary)]">{item.title}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="max-w-3xl mx-auto w-full"
      >
        {[
          { year: "2023", titleKey: "timeline_2023_title", descKey: "timeline_2023_desc", icon: "fa-seedling", accent: "emerald" },
          { year: "2023 — 2024", titleKey: "timeline_2024_title", descKey: "timeline_2024_desc", icon: "fa-book-open", accent: "blue" },
          { year: "2024", titleKey: "timeline_2025_title", descKey: "timeline_2025_desc", icon: "fa-triangle-exclamation", accent: "amber" },
          { year: "2025", titleKey: "timeline_2026_title", descKey: "timeline_2026_desc", icon: "fa-server", accent: "purple" },
          { year: "2026", titleKey: "timeline_now_title", descKey: "timeline_now_desc", icon: "fa-rocket", accent: "cyan" },
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={slideUp}
            className="flex gap-5 md:gap-8 mb-10 last:mb-0"
          >
            <div className="flex flex-col items-center">
              <div className="text-lg md:text-xl" style={{ color: `var(--accent-${item.accent})` }}>
                <i className={`fas ${item.icon}`} />
              </div>
              {i < 4 && <div className="w-px flex-1 min-h-[24px] bg-[var(--border-color)] mt-2" />}
            </div>
            <div className="flex-1 pb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--text-secondary)]">{item.year}</span>
              <h3 className="text-sm md:text-base font-bold text-[var(--text-primary)] mt-1">{t(`about.${item.titleKey}`)}</h3>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-2 leading-relaxed font-light">{t(`about.${item.descKey}`)}</p>
            </div>
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="max-w-3xl mx-auto w-full text-center"
      >
        <h2 className="text-lg md:text-xl font-black uppercase tracking-tight text-[var(--text-primary)]">{t('about.closing_title')}</h2>
        <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-3 leading-relaxed font-light">
          {t('about.closing_desc')}
        </p>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="border-t border-[var(--border-color)] pt-12"
      >
        <div className="text-center mb-10">
          <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">{t('about.team_title')}</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{t('about.team_subtitle')}</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card-depth p-5 flex flex-col items-center h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {teamMembers.map((member) => (
              <motion.div key={member.id} variants={slideUp}>
                <TeamCard member={member} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};
