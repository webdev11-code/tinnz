import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

interface GroupDef {
  key: string;
  label: string;
  icon: string;
  items: { label: string; desc: string; to: string; external?: boolean; icon: string }[];
}

export const SidebarContent: React.FC<{ onItemClick?: () => void }> = ({ onItemClick }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const isActive = (path: string) => location.pathname === path;

  const toggleGroup = (key: string) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const linkSubClass = (path: string) =>
    `flex flex-col px-3 py-2 rounded-lg transition-all ${
      isActive(path) ? "bg-[rgba(0,212,255,0.1)]" : "hover:bg-[rgba(0,212,255,0.08)]"
    }`;

  const groups: GroupDef[] = [
    {
      key: "services",
      label: t('sidebar.services'),
      icon: "fas fa-bolt",
      items: [
        { label: t('sidebar.game_hosting'), desc: t('sidebar.game_hosting_desc'), to: "/game-hosting", icon: "fas fa-gamepad" },
        { label: t('sidebar.bare_metal'), desc: t('sidebar.bare_metal_desc'), to: "/bare-metal", icon: "fas fa-microchip" },
        { label: t('sidebar.cloud_vps'), desc: t('sidebar.cloud_vps_desc'), to: "/cloud-vps", icon: "fas fa-server" }
      ]
    },
    {
      key: "server_hosting",
      label: t('sidebar.server_hosting'),
      icon: "fas fa-server",
      items: [
        { label: t('sidebar.shared_hosting'), desc: t('sidebar.shared_hosting_desc'), to: "/shared-hosting", icon: "fas fa-cubes" },
        { label: t('sidebar.private_hosting'), desc: t('sidebar.private_hosting_desc'), to: "/private-hosting", icon: "fas fa-user-shield" },
        { label: t('sidebar.app_hosting'), desc: t('sidebar.app_hosting_desc'), to: "/app-hosting", icon: "fas fa-robot" },
        { label: t('sidebar.web_hosting'), desc: t('sidebar.web_hosting_desc'), to: "/web-hosting", icon: "fas fa-globe" },
        { label: t('sidebar.samp_hosting'), desc: t('sidebar.samp_hosting_desc'), to: "/samp-hosting", icon: "fas fa-car" },
        { label: t('sidebar.terraria_hosting'), desc: t('sidebar.terraria_hosting_desc'), to: "/terraria-hosting", icon: "fas fa-tree" },
        { label: t('sidebar.hytale_hosting'), desc: t('sidebar.hytale_hosting_desc'), to: "/hytale-hosting", icon: "fas fa-gamepad" }
      ]
    },
    {
      key: "resources",
      label: t('sidebar.resources'),
      icon: "fas fa-compass",
      items: [
        { label: t('sidebar.terms'), desc: t('sidebar.terms_desc'), to: "/terms", icon: "fas fa-file-contract" },
        { label: t('sidebar.hardware_details'), desc: t('sidebar.hardware_desc'), to: "/hardware", icon: "fas fa-microchip" },
        { label: t('sidebar.about'), desc: t('sidebar.about_desc'), to: "/about", icon: "fas fa-info-circle" },
        { label: t('sidebar.contact_support'), desc: t('sidebar.contact_desc'), to: "/contact", icon: "fas fa-headset" }
      ]
    },
    {
      key: "others",
      label: t('sidebar.others'),
      icon: "fas fa-ellipsis-h",
      items: [
        { label: t('sidebar.documentation'), desc: t('sidebar.documentation_desc'), to: "https://docs.tinnzstore.com", external: true, icon: "fas fa-book" },
        { label: t('sidebar.uptime_info'), desc: t('sidebar.uptime_desc'), to: "https://status.tinnzstore.com", external: true, icon: "fas fa-chart-line" },
        { label: t('sidebar.host_comparison'), desc: t('sidebar.host_comparison_desc'), to: "/host-comparison", icon: "fas fa-table" },
        { label: t('sidebar.sponsorship'), desc: t('sidebar.sponsorship_desc'), to: "/sponsor", icon: "fas fa-star" }
      ]
    }
  ];

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center border-b pb-4 border-[var(--border-color)]">
        <Link to="/" className="flex items-center gap-2" onClick={onItemClick}>
          <img
            src="/logo.png"
            alt="TinnzStore"
            className="h-10 md:h-12 max-h-10 md:max-h-12 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>
      </div>

      <nav className="flex flex-col gap-3 text-sm flex-1 overflow-y-auto">
        
        <Link
          to="/"
          onClick={onItemClick}
          className={linkSubClass("/")}
        >
          <div className="flex items-center gap-3 font-semibold text-[var(--text-primary)]">
            <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs border shrink-0 transition-all ${
              isActive("/") ? "bg-[var(--accent-blue)]/15 text-[var(--accent-blue)] border-[var(--accent-blue)]/20" : "bg-transparent text-[var(--text-secondary)] border-transparent"
            }`}>
              <i className="fas fa-home" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold ${isActive("/") ? "text-[var(--accent-blue)]" : "text-[var(--text-primary)]"}`}>
                {t('sidebar.welcome')}
              </span>
              <span className="text-[9px] text-[var(--text-secondary)] mt-0.5 font-normal">
                {t('sidebar.welcome_desc')}
              </span>
            </div>
          </div>
        </Link>

        
        {groups.map((group) => {
          const isOpen = openGroups[group.key] ?? false;
          const groupActive = group.items.some((item) => !item.external && isActive(item.to));
          return (
            <div key={group.key} className="flex flex-col">
              <button
                onClick={() => toggleGroup(group.key)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  groupActive ? "bg-[var(--accent-blue)]/8 text-[var(--accent-blue)]" : "text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <i className={`${group.icon} text-xs w-4 text-center`} />
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.12em]">{group.label}</span>
                </div>
                <i className={`fas fa-chevron-down text-[8px] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.1, 0, 1] as const }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5 pl-4 mt-1 border-l border-[var(--border-color)] ml-3">
                      {group.items.map((item, idx) => {
                        const active = !item.external && isActive(item.to);
                        const content = (
                          <div className={`flex items-start gap-3 px-3 py-2 rounded-lg transition-all group/sub ${
                            active ? "bg-[var(--accent-blue)]/10" : "hover:bg-[var(--accent-blue)]/5"
                          }`}>
                            <div className={`w-7 h-7 flex items-center justify-center rounded-lg text-[9px] border shrink-0 transition-all ${
                              active ? "bg-[var(--accent-blue)]/15 text-[var(--accent-blue)] border-[var(--accent-blue)]/20" : "bg-transparent text-[var(--text-secondary)] border-transparent group-hover/sub:bg-[var(--accent-blue)]/10 group-hover/sub:text-[var(--accent-blue)] group-hover/sub:border-[var(--accent-blue)]/20"
                            }`}>
                              <i className={item.icon} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className={`text-[11px] font-bold transition-colors ${
                                active ? "text-[var(--accent-blue)]" : "text-[var(--text-primary)] group-hover/sub:text-[var(--accent-blue)]"
                              }`}>
                                {item.label}
                              </span>
                              <span className="text-[9px] text-[var(--text-secondary)] mt-0.5 line-clamp-1 font-normal">{item.desc}</span>
                            </div>
                          </div>
                        );
                        if (item.external) {
                          return (
                            <a key={idx} href={item.to} target="_blank" rel="noopener noreferrer" onClick={onItemClick}>
                              {content}
                            </a>
                          );
                        }
                        return (
                          <Link key={idx} to={item.to} onClick={onItemClick}>
                            {content}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-[var(--border-color)]">
        <a
          href="https://clients.tinnzstore.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onItemClick}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-bold text-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-md shadow-[rgba(0,212,255,0.15)] active:scale-95"
        >
          <i className="fas fa-sign-in-alt" />
          <span>{t('sidebar.client_area')}</span>
        </a>
      </div>
    </div>
  );
};
