import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

export const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 rounded-xl flex items-center gap-2 border transition-all duration-300 bg-transparent border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--accent-blue)] active:scale-95 btn-depth"
      >
        <img src={language === "id" ? "https://flagcdn.com/w40/id.png" : "https://flagcdn.com/w40/gb.png"} alt={language} className="w-5 h-3.5 rounded-sm object-cover" />
        <span className="text-xs font-mono font-semibold uppercase">{language}</span>
        <i className={`fas fa-chevron-down text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl shadow-xl border overflow-hidden z-50 animate-fade-in bg-[var(--bg-card)] border-[var(--border-color)]">
          <button
            onClick={() => {
              changeLanguage("id");
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
              language === "id"
                ? "bg-[rgba(255,62,0,0.1)] text-[var(--accent-blue)]"
                : "text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-white/5"
            }`}
          >
            <img src="https://flagcdn.com/w40/id.png" alt="ID" className="w-5 h-3.5 rounded-sm object-cover" />
            <span className="flex-1">ID</span>
            {language === "id" && <i className="fas fa-check text-[10px]" />}
          </button>
          <button
            onClick={() => {
              changeLanguage("en");
              setIsOpen(false);
            }}
            className={`w-full px-4 py-2.5 text-left text-xs font-mono font-medium flex items-center gap-2 transition-colors ${
              language === "en"
                ? "bg-[rgba(255,62,0,0.1)] text-[var(--accent-blue)]"
                : "text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.05)] dark:hover:bg-white/5"
            }`}
          >
            <img src="https://flagcdn.com/w40/gb.png" alt="EN" className="w-5 h-3.5 rounded-sm object-cover" />
            <span className="flex-1">EN</span>
            {language === "en" && <i className="fas fa-check text-[10px]" />}
          </button>
        </div>
      )}
    </div>
  );
};
