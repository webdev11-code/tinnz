import React from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl flex items-center justify-center border transition-all duration-300 text-sm hover:scale-105 active:scale-95 bg-transparent border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] btn-depth"
      aria-label={t("common.toggle_theme")}
    >
      <i className={`fas ${theme === "dark" ? "fa-moon text-[var(--accent-blue)]" : "fa-sun text-[var(--accent-blue)]"}`} />
    </button>
  );
};
