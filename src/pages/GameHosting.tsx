import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const cardIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
};

const sectionIn = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
};

export const GameHosting: React.FC = () => {
  const { t } = useTranslation();
  const games = [
    {
      id: "minecraft",
      titleKey: "shared_title",
      tagKey: "shared_tag",
      tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      descKey: "shared_desc",
      image: "/minecraft-2.jpg",
      path: "/shared-hosting",
      featureKeys: ["shared_features_1", "shared_features_2", "shared_features_3", "shared_features_4", "shared_features_5"],
      ctaKey: "shared_cta",
      accentBorder: "group-hover:border-emerald-500/30",
    },
    {
      id: "private",
      titleKey: "private_title",
      tagKey: "private_tag",
      tagColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      descKey: "private_desc",
      image: "/private.png",
      path: "/private-hosting",
      featureKeys: ["private_features_1", "private_features_2", "private_features_3", "private_features_4", "private_features_5"],
      ctaKey: "private_cta",
      accentBorder: "group-hover:border-purple-500/30",
    },
    {
      id: "terraria",
      titleKey: "terraria_title",
      tagKey: "terraria_tag",
      tagColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      descKey: "terraria_desc",
      image: "/terraria.jpg",
      path: "/terraria-hosting",
      featureKeys: ["terraria_features_1", "terraria_features_2", "terraria_features_3", "terraria_features_4", "terraria_features_5"],
      ctaKey: "terraria_cta",
      accentBorder: "group-hover:border-pink-500/30",
    },
    {
      id: "samp",
      titleKey: "samp_title",
      tagKey: "samp_tag",
      tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      descKey: "samp_desc",
      image: "/samp.png",
      path: "/samp-hosting",
      featureKeys: ["samp_features_1", "samp_features_2", "samp_features_3", "samp_features_4", "samp_features_5"],
      ctaKey: "samp_cta",
      accentBorder: "group-hover:border-emerald-500/30",
    },
    {
      id: "hytale",
      titleKey: "hytale_title",
      tagKey: "hytale_tag",
      tagColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
      descKey: "hytale_desc",
      image: "/hytale.png",
      path: "/hytale-hosting",
      featureKeys: ["hytale_features_1", "hytale_features_2", "hytale_features_3", "hytale_features_4", "hytale_features_5"],
      ctaKey: "hytale_cta",
      accentBorder: "group-hover:border-sky-500/30",
    },
  ];

  return (
    <div className="pt-28 pb-16 min-h-screen flex flex-col gap-12 max-w-7xl mx-auto px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="text-center flex flex-col items-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
          {t('game_hosting.badge')}
        </span>
        <PageTitle text={t('game_hosting.title')} className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-3" />
        <p className="text-sm mt-4 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t('game_hosting.subtitle')}
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4"
      >
        {games.map((game) => (
          <motion.div
            key={game.id}
            variants={cardIn}
            whileHover={{ y: -6, transition: { duration: 0.3 } }}
            className="group flex flex-col card-depth overflow-hidden hover:shadow-2xl hover:shadow-[var(--accent-blue)]/5 transition-all duration-300 relative"
          >
            <div className="relative h-48 md:h-64 w-full overflow-hidden border-b border-[var(--border-color)]">
              <motion.img
                src={game.image}
                alt={t(`game_hosting.${game.titleKey}`)}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className={`px-2.5 py-1 text-[9px] font-mono font-bold tracking-wider uppercase border ${game.tagColor}`}>
                  {t(`game_hosting.${game.tagKey}`)}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <i className="fas fa-gamepad text-xs text-[var(--accent-blue)]" />
                  {t(`game_hosting.${game.titleKey}`)}
                </h2>
              </div>
            </div>

            <div className="p-6 md:p-8 flex-1 flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                  {t(`game_hosting.${game.descKey}`)}
                </p>
                <div className="flex flex-col gap-2 mt-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                    {t('game_hosting.features_title')}
                  </span>
                  <ul className="flex flex-col gap-1.5">
                    {game.featureKeys.map((key, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.08, duration: 0.3 }}
                        className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono"
                      >
                        <i className="fas fa-check text-[10px] text-[var(--accent-blue)]" />
                        <span>{t(`game_hosting.${key}`)}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>

              <Link
                to={game.path}
                className="w-full text-center py-3.5 px-4 font-mono font-extrabold text-xs uppercase tracking-widest rounded-xl card-depth border-[var(--border-color)] text-[var(--text-primary)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/5 active:scale-95 transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t(`game_hosting.${game.ctaKey}`)}</span>
                <i className="fas fa-arrow-right text-[10px]" />
              </Link>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
