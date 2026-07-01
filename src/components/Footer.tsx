import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  const socialLinks = [
    { icon: "fab fa-discord hover:text-[#5865F2]", url: "https://discord.gg/Nz9b6bMuNe" },
    { icon: "fab fa-whatsapp hover:text-[#25D366]", url: "https://wa.me/6287844812351" },
    { icon: "fab fa-instagram hover:text-pink-500", url: "https://www.instagram.com/tinnzstore_id" },
    { icon: "fab fa-tiktok hover:text-sky-400", url: "https://www.tiktok.com/@tinnzstore_id" }
  ];

  return (
    <footer className="relative transition-colors duration-300 bg-[var(--bg-card)] section-depth">
      
      <div className="absolute top-0 left-0 right-0 h-8 md:h-10 overflow-hidden pointer-events-none -translate-y-full">
        <svg className="w-full h-full" viewBox="0 0 1200 32" preserveAspectRatio="none">
          <path
            d="M0,32 L0,8 L440,8 L480,0 L720,0 L760,8 L1200,8 L1200,32 Z"
            fill="var(--bg-card)"
            className="drop-shadow-[0_-1px_1px_rgba(0,0,0,0.04)] dark:drop-shadow-[0_-1px_1px_rgba(255,255,255,0.02)]"
          />
          <polyline
            points="0,8 440,8 480,0 720,0 760,8 1200,8"
            fill="none"
            stroke="var(--accent-blue)"
            strokeWidth="0.6"
            opacity="0.2"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 md:py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="TinnzStore"
              className="h-10 md:h-12 max-h-10 md:max-h-12 w-auto object-contain filter dark:brightness-100"
              referrerPolicy="no-referrer"
            />
          </Link>
          <p className="text-xs md:text-sm leading-relaxed text-[var(--text-secondary)] card-desc">
            {t('footer.description')}
          </p>

          <div className="flex items-start gap-2.5">
            <i className="fas fa-location-dot text-[var(--accent-blue)] mt-0.5 text-sm md:text-base" />
            <span className="text-xs md:text-sm leading-relaxed text-[var(--text-secondary)]">
              Jl. Agus Salim, Bekasi Timur, Bekasi Jaya
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center border text-[11px] font-mono uppercase tracking-widest transition-all duration-300 bg-transparent border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-blue)]/5 active:scale-90 active:text-[var(--accent-blue)] btn-depth"
              >
                <i className={link.icon} />
              </a>
            ))}
          </div>
        </div>

        
        <div className="flex flex-col gap-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
            {t('footer.services')}
          </span>
          <div className="flex flex-col gap-3">
            <Link to="/game-hosting" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.game_hosting')}
            </Link>
            <Link to="/shared-hosting" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.shared_hosting')}
            </Link>
            <Link to="/private-hosting" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.private_hosting')}
            </Link>
            <Link to="/terraria-hosting" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.terraria_hosting')}
            </Link>
            <Link to="/app-hosting" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.app_hosting')}
            </Link>
            <Link to="/web-hosting" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.web_hosting')}
            </Link>
            <Link to="/cloud-vps" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.cloud_vps')}
            </Link>
          </div>
        </div>

        
        <div className="flex flex-col gap-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
            {t('footer.company')}
          </span>
          <div className="flex flex-col gap-3">
            <Link to="/about" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.about_us')}
            </Link>
            <a href="https://clients.tinnzstore.com" target="_blank" rel="noopener noreferrer" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.client_area')}
            </a>
            <Link to="/hardware" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.our_hardware')}
            </Link>
            <Link to="/terms" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.terms')}
            </Link>
            <Link to="/sponsor" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.sponsorships')}
            </Link>
            <Link to="/sla" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.sla_guarantee')}
            </Link>
          </div>
        </div>

        
        <div className="flex flex-col gap-5">
          <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-primary)]">
            {t('footer.support')}
          </span>
          <div className="flex flex-col gap-3">
            <Link to="/contact" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.contact_support')}
            </Link>
            <a href="https://discord.gg/Nz9b6bMuNe" target="_blank" rel="noopener noreferrer" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.discord_server')}
            </a>
            <a href="https://wa.me/6287844812351" target="_blank" rel="noopener noreferrer" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">
              {t('footer.whatsapp_helpdesk')}
            </a>
            <span className="text-xs text-[var(--text-secondary)] mt-1 card-desc">
              support@tinnzstore.com
            </span>
          </div>
        </div>
      </div>

      
      <div className="border-t border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 md:py-5 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4 text-[10px] md:text-xs font-mono uppercase tracking-[0.1em] text-[var(--text-secondary)]">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A5CFF] animate-pulse"></div>
            <span>{t('footer.rights')}</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">{t('footer.terms')}</Link>
            <a href="#" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">{t('footer.privacy')}</a>
            <Link to="/sla" className="text-[11px] md:text-sm text-[var(--text-secondary)] hover:text-[var(--accent-blue)] active:text-[var(--accent-blue)] transition-colors duration-200">{t('footer.sla_guarantee')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
