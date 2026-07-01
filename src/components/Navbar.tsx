import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

interface SubItem {
  label: string;
  desc: string;
  to: string;
  external?: boolean;
  icon: string;
}

interface NavItem {
  label: string;
  icon: string;
  items: SubItem[];
}

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

const subIcons: Record<string, string> = {
  "welcome": "fas fa-home",
  "game-hosting": "fas fa-gamepad",
  "bare-metal": "fas fa-microchip",
  "cloud-vps": "fas fa-server",
  "shared-hosting": "fas fa-cubes",
  "private-hosting": "fas fa-user-shield",
  "bot-hosting": "fas fa-robot",
  "web-hosting": "fas fa-globe",
  "samp-hosting": "fas fa-car",
  "terraria-hosting": "fas fa-tree",
  "hytale-hosting": "fas fa-gamepad",
  "terms": "fas fa-file-contract",
  "hardware": "fas fa-microchip",
  "about": "fas fa-info-circle",
  "contact": "fas fa-headset",
  "documentation": "fas fa-book",
  "uptime": "fas fa-chart-line",
  "host-comparison": "fas fa-table",
  "sponsor": "fas fa-star",
};

const getIcon = (to: string): string => {
  for (const [key, icon] of Object.entries(subIcons)) {
    if (to.includes(key)) return icon;
  }
  return "fas fa-link";
};

const Dropdown: React.FC<{ item: NavItem }> = ({ item }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isActive = item.items.some((sub) => !sub.external && sub.to === location.pathname);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-display font-bold uppercase tracking-[0.08em] transition-all duration-200 ${
          isActive
            ? "text-[var(--accent-blue)] bg-[var(--accent-blue)]/8"
            : "text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/5"
        }`}
      >
        <i className={`${item.icon} text-xs`} />
        {item.label}
        <i className={`fas fa-chevron-down text-[8px] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.25, 0.1, 0, 1] as const }}
            className="absolute top-full left-0 mt-2 w-64 rounded-xl border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-2xl shadow-black/20 overflow-hidden z-50"
          >
            <div className="py-1.5">
              {item.items.map((sub, idx) => {
                const isSubActive = !sub.external && sub.to === location.pathname;
                const content = (
                  <div className={`flex items-start gap-3.5 px-4 py-2.5 mx-1.5 rounded-lg transition-all duration-200 relative group ${
                    isSubActive
                      ? "bg-[var(--accent-blue)]/10"
                      : "hover:bg-[var(--accent-blue)]/5"
                  }`}>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs border shrink-0 transition-all duration-200 ${
                      isSubActive
                        ? "bg-[var(--accent-blue)]/15 text-[var(--accent-blue)] border-[var(--accent-blue)]/20"
                        : "bg-transparent text-[var(--text-secondary)] border-transparent group-hover:bg-[var(--accent-blue)]/10 group-hover:text-[var(--accent-blue)] group-hover:border-[var(--accent-blue)]/20"
                    }`}>
                      <i className={sub.icon} />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className={`text-[13px] font-display font-bold tracking-tight transition-colors ${
                          isSubActive ? "text-[var(--accent-blue)]" : "text-[var(--text-primary)] group-hover:text-[var(--accent-blue)]"
                        }`}>{sub.label}</span>
                      <span className="text-[11px] text-[var(--text-secondary)] mt-0.5 line-clamp-1">{sub.desc}</span>
                    </div>
                    {isSubActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[var(--accent-blue)]" />
                    )}
                  </div>
                );
                if (sub.external) {
                  return (
                    <a key={idx} href={sub.to} target="_blank" rel="noopener noreferrer">
                      {content}
                    </a>
                  );
                }
                return (
                  <Link key={idx} to={sub.to} onClick={() => setOpen(false)}>
                    {content}
                  </Link>
                );
              })}
            </div>

            <div className="h-1 bg-gradient-to-r from-[var(--accent-blue)]/40 via-[var(--accent-blue)]/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenCart, cartCount }) => {
  const { t } = useTranslation();
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: t("sidebar.services"),
      icon: "fas fa-bolt",
      items: [
        { label: t("sidebar.game_hosting"), desc: t("sidebar.game_hosting_desc"), to: "/game-hosting", icon: "fas fa-gamepad" },
        { label: t("sidebar.bare_metal"), desc: t("sidebar.bare_metal_desc"), to: "/bare-metal", icon: "fas fa-microchip" },
        { label: t("sidebar.cloud_vps"), desc: t("sidebar.cloud_vps_desc"), to: "/cloud-vps", icon: "fas fa-server" }
      ]
    },
    {
      label: t("sidebar.server_hosting"),
      icon: "fas fa-server",
      items: [
        { label: t("sidebar.shared_hosting"), desc: t("sidebar.shared_hosting_desc"), to: "/shared-hosting", icon: "fas fa-cubes" },
        { label: t("sidebar.private_hosting"), desc: t("sidebar.private_hosting_desc"), to: "/private-hosting", icon: "fas fa-user-shield" },
        { label: t("sidebar.app_hosting"), desc: t("sidebar.app_hosting_desc"), to: "/app-hosting", icon: "fas fa-robot" },
        { label: t("sidebar.web_hosting"), desc: t("sidebar.web_hosting_desc"), to: "/web-hosting", icon: "fas fa-globe" },
        { label: t("sidebar.samp_hosting"), desc: t("sidebar.samp_hosting_desc"), to: "/samp-hosting", icon: "fas fa-car" },
        { label: t("sidebar.terraria_hosting"), desc: t("sidebar.terraria_hosting_desc"), to: "/terraria-hosting", icon: "fas fa-tree" },
        { label: t("sidebar.hytale_hosting"), desc: t("sidebar.hytale_hosting_desc"), to: "/hytale-hosting", icon: "fas fa-gamepad" }
      ]
    },
    {
      label: t("sidebar.resources"),
      icon: "fas fa-compass",
      items: [
        { label: t("sidebar.terms"), desc: t("sidebar.terms_desc"), to: "/terms", icon: "fas fa-file-contract" },
        { label: t("sidebar.hardware_details"), desc: t("sidebar.hardware_desc"), to: "/hardware", icon: "fas fa-microchip" },
        { label: t("sidebar.about"), desc: t("sidebar.about_desc"), to: "/about", icon: "fas fa-info-circle" },
        { label: t("sidebar.contact_support"), desc: t("sidebar.contact_desc"), to: "/contact", icon: "fas fa-headset" }
      ]
    },
    {
      label: t("sidebar.others"),
      icon: "fas fa-ellipsis-h",
      items: [
        { label: t("sidebar.documentation"), desc: t("sidebar.documentation_desc"), to: "https://docs.tinnzstore.com", external: true, icon: "fas fa-book" },
        { label: t("sidebar.uptime_info"), desc: t("sidebar.uptime_desc"), to: "https://status.tinnzstore.com", external: true, icon: "fas fa-chart-line" },
        { label: t("sidebar.host_comparison"), desc: t("sidebar.host_comparison_desc"), to: "/host-comparison", icon: "fas fa-table" },
        { label: t("sidebar.sponsorship"), desc: t("sidebar.sponsorship_desc"), to: "/sponsor", icon: "fas fa-star" }
      ]
    }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 z-40 glassmorphism flex items-center justify-between px-4 md:px-8 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-2 rounded-lg flex items-center justify-center border text-lg bg-transparent border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] active:scale-95"
          aria-label="Open Navigation Sidebar"
        >
          <i className="fas fa-bars" />
        </button>

        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/logo.png"
            alt="TinnzStore"
            className="h-10 md:h-12 max-h-10 md:max-h-12 w-auto object-contain"
            referrerPolicy="no-referrer"
          />
        </Link>

        <div className="hidden md:flex items-center gap-0.5 ml-4">
          <Link
            to="/"
className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-display font-bold uppercase tracking-[0.08em] transition-all duration-200 ${
              location.pathname === "/"
                ? "text-[var(--accent-blue)] bg-[var(--accent-blue)]/8"
                : "text-[var(--text-secondary)] hover:text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/5"
            }`}
          >
            <i className="fas fa-house-chimney text-xs" />
            Home
          </Link>
          {navItems.map((item, idx) => (
            <Dropdown key={idx} item={item} />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenCart}
          className="relative p-2.5 rounded-xl flex items-center justify-center border transition-all duration-300 text-sm hover:scale-105 active:scale-95 bg-transparent border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] btn-depth"
          aria-label="View Shopping Cart"
        >
          <i className="fas fa-shopping-cart text-[var(--text-secondary)] hover:text-[var(--accent-blue)]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[var(--accent-blue)] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-lg">
              {cartCount}
            </span>
          )}
        </button>

        <LanguageSwitcher />

        <a
          href="https://clients.tinnzstore.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-display uppercase tracking-widest font-bold shadow-lg shadow-[var(--accent-blue)]/20 transition-all duration-300 text-white bg-[var(--accent-blue)] hover:bg-black dark:hover:bg-white dark:hover:text-black border border-[var(--accent-blue)] btn-depth"
        >
          <i className="fas fa-user-circle text-xs" />
          <span>{t("nav.clientArea")}</span>
        </a>
      </div>
    </nav>
  );
};
