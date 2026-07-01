import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LinkItem {
  to: string;
  labelKey: string;
}

const links: LinkItem[] = [
  { to: "/game-hosting", labelKey: "sidebar.game_hosting" },
  { to: "/shared-hosting", labelKey: "sidebar.shared_hosting" },
  { to: "/private-hosting", labelKey: "sidebar.private_hosting" },
  { to: "/web-hosting", labelKey: "sidebar.web_hosting" },
  { to: "/app-hosting", labelKey: "sidebar.app_hosting" },
  { to: "/terraria-hosting", labelKey: "sidebar.terraria_hosting" },
  { to: "/samp-hosting", labelKey: "sidebar.samp_hosting" },
  { to: "/hytale-hosting", labelKey: "sidebar.hytale_hosting" },
  { to: "/cloud-vps", labelKey: "sidebar.cloud_vps" },
  { to: "/bare-metal", labelKey: "sidebar.bare_metal" },
  { to: "/hardware", labelKey: "hardware.title" },
  { to: "/host-comparison", labelKey: "sidebar.host_comparison" },
];

export const RelatedServices: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="mt-10 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)]">
      <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[var(--text-primary)] mb-3">{t('common.related_services')}</h3>
      <div className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 hover:translate-y-[-1px]"
            style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-blue)'; e.currentTarget.style.color = 'var(--accent-blue)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            {t(link.labelKey)}
          </Link>
        ))}
      </div>
    </div>
  );
};
