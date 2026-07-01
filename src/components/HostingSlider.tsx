import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const HostingSlider: React.FC = () => {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayRef = useRef<(() => void) | null>(null);

  const categories = [
    {
      titleKey: "slider.shared_title",
      descKey: "slider.shared_desc",
      image: "/minecraft-2.jpg",
      path: "/shared-hosting",
      accent: "blue",
      icon: "fas fa-server",
    },
    {
      titleKey: "slider.private_title",
      descKey: "slider.private_desc",
      image: "/minecraft-1.jpg",
      path: "/private-hosting",
      accent: "purple",
      icon: "fas fa-user-shield",
    },
    {
      titleKey: "slider.bot_title",
      descKey: "slider.bot_desc",
      image: "/bot.png",
      path: "/app-hosting",
      accent: "purple",
      icon: "fas fa-robot",
    },
    {
      titleKey: "slider.web_title",
      descKey: "slider.web_desc",
      image: "/webhosting.png",
      path: "/web-hosting",
      accent: "green",
      icon: "fas fa-globe",
    },
    {
      titleKey: "slider.terraria_title",
      descKey: "slider.terraria_desc",
      image: "/terraria.jpg",
      path: "/terraria-hosting",
      accent: "pink",
      icon: "fas fa-tree",
    },
    {
      titleKey: "slider.samp_title",
      descKey: "slider.samp_desc",
      image: "/samp.png",
      path: "/samp-hosting",
      accent: "emerald",
      icon: "fas fa-car",
    },
    {
      titleKey: "slider.hytale_title",
      descKey: "slider.hytale_desc",
      image: "/hytale.png",
      path: "/hytale-hosting",
      accent: "blue",
      icon: "fas fa-gamepad",
    },
  ];

  const accentMap: Record<string, { color: string; glow: string; from: string; to: string }> = {
    blue: { color: "var(--accent-blue)", glow: "rgba(26,92,255,0.15)", from: "from-cyan-500", to: "to-blue-600" },
    purple: { color: "var(--accent-purple)", glow: "rgba(124,58,237,0.15)", from: "from-purple-500", to: "to-indigo-600" },
    green: { color: "var(--accent-green)", glow: "rgba(16,185,129,0.15)", from: "from-emerald-500", to: "to-green-600" },
    pink: { color: "#ec4899", glow: "rgba(236,72,153,0.15)", from: "from-pink-500", to: "to-rose-600" },
    emerald: { color: "#10b981", glow: "rgba(16,185,129,0.15)", from: "from-emerald-500", to: "to-green-600" },
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };

  useEffect(() => {
    autoPlayRef.current = nextSlide;
  });

  useEffect(() => {
    const play = () => {
      autoPlayRef.current?.();
    };
    const interval = setInterval(play, 5000);
    return () => clearInterval(interval);
  }, []);

  const cat = categories[currentIndex];
  const accent = accentMap[cat.accent];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12 relative group/slider">
      
      <div className="text-center mb-10">
        <span className="px-3.5 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest border select-none bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-[var(--accent-blue)] text-[var(--accent-blue)]">
          {t("categories.title")}
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-3 text-[var(--text-primary)]">{t("slider.heading")}</h2>
        <p className="text-sm mt-2 max-w-2xl mx-auto text-[var(--text-secondary)]">
          {t("categories.subtitle")}
        </p>
      </div>

      
      <div className="relative overflow-hidden card-depth shadow-2xl transition-all duration-500">
        
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]" style={{ background: `radial-gradient(ellipse at 30% 50%, ${accent.glow} 0%, transparent 70%)` }} />

        <div className="relative z-10 flex flex-col md:flex-row h-full">
          
          <div className="w-full md:w-[40%] h-48 md:h-auto relative overflow-hidden flex items-center justify-center bg-zinc-950">
            <img
              src={cat.image}
              alt={t(cat.titleKey)}
              className="w-full h-full object-cover transition-all duration-700 ease-in-out transform scale-102 group-hover/slider:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
            <div className="absolute inset-0 border-r border-white/5" />
          </div>

          
          <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <span
                className="w-8 h-8 flex items-center justify-center rounded-lg text-sm border"
                style={{ borderColor: `${accent.color}40`, color: accent.color, backgroundColor: `${accent.color}10` }}
              >
                <i className={cat.icon} />
              </span>
              <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                {t("slider.category_label")} {currentIndex + 1} / {categories.length}
              </span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)] card-title">
              {t(cat.titleKey)}
            </h3>

            <p className="text-xs md:text-sm mt-4 leading-relaxed text-[var(--text-secondary)] max-w-lg card-desc">
              {t(cat.descKey)}
            </p>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to={cat.path}
                className="px-6 py-3 rounded-xl text-[10px] font-mono font-bold uppercase tracking-[0.15em] transition-all duration-300 inline-flex items-center gap-2 border bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)] hover:bg-[var(--accent-blue)] hover:text-white hover:border-[var(--accent-blue)] btn-depth"
              >
                <span>{t("categories.view_plans")}</span>
                <i className="fas fa-arrow-right text-[10px]" />
              </Link>

              
              <div className="flex items-center gap-2 ml-auto">
                {categories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className="h-2 rounded-full transition-all duration-300"
                    style={{
                      width: currentIndex === i ? 24 : 8,
                      backgroundColor: currentIndex === i ? accent.color : "var(--border-color)",
                    }}
                    aria-label={t("slider.go_to_slide", { n: i + 1 })}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <button
        onClick={prevSlide}
        className="absolute left-1 md:left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center text-sm transition-all duration-300 bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)] hover:scale-105 active:scale-95 shadow-lg select-none opacity-0 group-hover/slider:opacity-100"
        aria-label={t("slider.prev_slide")}
      >
        <i className="fas fa-chevron-left" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-1 md:right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border flex items-center justify-center text-sm transition-all duration-300 bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-blue)] hover:scale-105 active:scale-95 shadow-lg select-none opacity-0 group-hover/slider:opacity-100"
        aria-label={t("slider.next_slide")}
      >
        <i className="fas fa-chevron-right" />
      </button>
    </div>
  );
};
