import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarContent } from "./SidebarContent";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onClose();
  }, [location.pathname]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  return (
    <>
      
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-45 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 bottom-0 w-[280px] z-50 shadow-2xl transition-transform duration-300 overflow-y-auto flex flex-col py-6 px-5 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } backdrop-blur-xl border-r border-white/5`}
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-card) 85%, transparent)",
          color: "var(--text-primary)",
          borderColor: "var(--border-color)"
        }}
      >
        <SidebarContent onItemClick={onClose} />
      </div>
    </>
  );
};
