import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

type TabId = "console" | "files" | "plugins" | "versions" | "backups";

export const ControlPanelShowcase: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabId>("console");

  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  useEffect(() => {
    if (activeTab === "console") {
      setConsoleLogs([
        "> starting minecraft server...",
        "[INFO] Loading properties",
        "[INFO] Default game type: SURVIVAL",
        "[INFO] Generating keypair",
        "[INFO] Starting Minecraft server on *:25565"
      ]);

      const timer1 = setTimeout(() => {
        setConsoleLogs(prev => [...prev, "[15:30:22] [Server thread/INFO]: Preparing level 'world'"]);
      }, 1000);

      const timer2 = setTimeout(() => {
        setConsoleLogs(prev => [...prev, "[15:30:25] [Server thread/INFO]: Done (3.245s)! For help, type 'help'"]);
      }, 2500);

      const timer3 = setTimeout(() => {
        setConsoleLogs(prev => [...prev, "> server check: optimal performance, 0% packet loss."]);
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [activeTab]);

  const [plugins, setPlugins] = useState([
    { name: "EssentialsX", downloads: "5M+ Downloads", installed: false, description: "Essential commands, teleports, and economy system." },
    { name: "WorldEdit", downloads: "3M+ Downloads", installed: false, description: "Fast, in-game map builder and world editor." },
    { name: "Vault", downloads: "2M+ Downloads", installed: true, description: "Advanced permissions and chat economy bridge API." },
    { name: "ViaVersion", downloads: "1M+ Downloads", installed: false, description: "Allows newer client versions to connect to your server." }
  ]);

  const [pluginSearch, setPluginSearch] = useState("");

  const handleTogglePlugin = (index: number) => {
    setPlugins(prev => {
      const copy = [...prev];
      copy[index].installed = !copy[index].installed;
      return copy;
    });
  };

  const [selectedVersion, setSelectedVersion] = useState("Paper 1.20.4");
  const versions = [
    { name: "Paper 1.20.4", desc: "Highly optimized server software for fast vanilla play." },
    { name: "Purpur 1.20.4", desc: "Drop-in replacement for Paper with customizable game variables." },
    { name: "Forge 1.20.1", desc: "Standard Minecraft server environment supporting complex mods." },
    { name: "Fabric 1.20.1", desc: "Modular, light, and extremely fast mod loader framework." },
    { name: "Spigot 1.19.4", desc: "The original high-performance craftbukkit replacement software." },
    { name: "Bukkit 1.19.2", desc: "Legacy standard modular multiplayer server engine." }
  ];

  const [isBackupSyncing, setIsBackupSyncing] = useState(false);
  const [backupLogs, setBackupLogs] = useState([
    { name: "Daily Backup - 02:00 AM", size: "1.2 GB", time: "5 hours ago", target: "Google Drive" },
    { name: "Manual Save - Pre-Update", size: "1.1 GB", time: "2 days ago", target: "Local Disk" },
    { name: "Weekly Archive", size: "4.8 GB", time: "5 days ago", target: "Google Drive" }
  ]);

  const handleCreateBackup = () => {
    setIsBackupSyncing(true);
    setTimeout(() => {
      setIsBackupSyncing(false);
      setBackupLogs(prev => [
        {
          name: `Manual Save - ${new Date().toLocaleTimeString()}`,
          size: "1.2 GB",
          time: "Just now",
          target: "Google Drive"
        },
        ...prev
      ]);
    }, 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-12">
      
      <div className="text-center mb-12 md:mb-14 flex flex-col items-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5">
          <i className="fas fa-terminal text-[9px]" />
          {t('control_panel.badge')}
        </span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight mt-4 text-[var(--text-primary)]">
          {t('control_panel.title')}
        </h2>
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mt-4" />
        <p className="text-sm md:text-base mt-4 max-w-2xl text-[var(--text-secondary)] leading-relaxed">
          {t('control_panel.subtitle')}
        </p>
      </div>

      
      <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-2xl transition-all duration-300">
        
        <div className="flex border-b overflow-x-auto scrollbar-hide bg-black/5 dark:bg-white/5 border-[var(--border-color)] rounded-t-2xl">
          {[
            { id: "console", label: t('control_panel.tabs.console'), icon: "fas fa-terminal" },
            { id: "files", label: t('control_panel.tabs.file_manager'), icon: "fas fa-folder-open" },
            { id: "plugins", label: t('control_panel.tabs.plugin_installer'), icon: "fas fa-cubes" },
            { id: "versions", label: t('control_panel.tabs.version_switcher'), icon: "fas fa-code-branch" },
            { id: "backups", label: t('control_panel.tabs.backup'), icon: "fas fa-cloud-upload-alt" }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex-1 min-w-[120px] py-4.5 px-4 text-xs font-bold flex items-center justify-center gap-2.5 transition-all duration-300 border-b-2 outline-none cursor-pointer ${
                  isActive
                    ? "border-[var(--accent-blue)] text-[var(--accent-blue)] bg-[rgba(0,212,255,0.05)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-white/5"
                }`}
              >
                <i className={`${tab.icon} text-sm`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        
        <div className="p-6 md:p-8 min-h-[360px] flex flex-col justify-between">
          <div className="transition-all duration-300">
            
            {activeTab === "console" && (
              <div className="animate-fade-in flex flex-col gap-4">
                <div className="w-full bg-zinc-100 dark:bg-zinc-950 rounded-xl p-5 border border-zinc-200 dark:border-zinc-800 font-mono text-xs text-green-600 dark:text-green-400 h-64 overflow-y-auto space-y-1.5 terminal-scanlines">
                  {consoleLogs.map((log, idx) => (
                    <div key={idx} className={log.startsWith(">") ? "text-cyan-400" : "text-green-400"}>
                      {log}
                    </div>
                  ))}
                  <div className="flex items-center gap-1">
                    <span>{">"}</span>
                    <span className="w-2 h-4 bg-green-400 cursor-blink" />
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-2 italic flex items-center gap-2">
                  <i className="fas fa-info-circle text-[var(--accent-blue)]" />
                  {t('control_panel.console_desc')}
                </p>
              </div>
            )}

            
            {activeTab === "files" && (
              <div className="animate-fade-in flex flex-col gap-4">
                
                <div className="flex flex-wrap items-center gap-2 bg-[rgba(0,0,0,0.02)] dark:bg-white/5 p-3 rounded-lg border border-[var(--border-color)]">
                  <button className="px-3.5 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 bg-[var(--accent-blue)] text-white hover:opacity-90 active:scale-95">
                    <i className="fas fa-upload" /> {t('control_panel.upload')}
                  </button>
                  <button className="px-3.5 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 border border-[var(--border-color)] hover:bg-[rgba(0,0,0,0.03)] dark:hover:bg-white/10">
                    <i className="fas fa-download" /> {t('control_panel.download')}
                  </button>
                  <button className="px-3.5 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 border border-[var(--border-color)] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500">
                    <i className="fas fa-trash" /> {t('control_panel.delete')}
                  </button>
                  <button className="px-3.5 py-1.5 rounded-md text-[11px] font-bold flex items-center gap-1.5 border border-[var(--border-color)] ml-auto">
                    <i className="fas fa-folder-plus" /> {t('control_panel.new_folder')}
                  </button>
                </div>

                
                <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[rgba(0,0,0,0.03)] dark:bg-white/5 text-[var(--text-primary)] font-bold border-b border-[var(--border-color)]">
                      <tr>
                        <th className="p-4">{t('control_panel.name')}</th>
                        <th className="p-4">{t('control_panel.size')}</th>
                        <th className="p-4 text-right">{t('control_panel.modified')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                      {[
                        { name: "world", size: "-", date: "2 mins ago", icon: "fas fa-folder text-amber-500" },
                        { name: "plugins", size: "-", date: "1 hour ago", icon: "fas fa-folder text-amber-500" },
                        { name: "server.properties", size: "1.2 KB", date: "Just now", icon: "fas fa-file-code text-blue-500" },
                        { name: "spigot.jar", size: "35 MB", date: "3 days ago", icon: "fas fa-file-archive text-purple-500" },
                        { name: "eula.txt", size: "18 B", date: "1 week ago", icon: "fas fa-file-alt text-zinc-500" }
                      ].map((file, i) => (
                        <tr key={i} className="hover:bg-[rgba(0,0,0,0.01)] dark:hover:bg-white/5 cursor-pointer">
                          <td className="p-4 font-semibold flex items-center gap-3 text-[var(--text-primary)]">
                            <i className={file.icon} />
                            <span>{file.name}</span>
                          </td>
                          <td className="p-4">{file.size}</td>
                          <td className="p-4 text-right">{file.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1 italic flex items-center gap-2">
                  <i className="fas fa-info-circle text-[var(--accent-blue)]" />
                  {t('control_panel.files_desc')}
                </p>
              </div>
            )}

            
            {activeTab === "plugins" && (
              <div className="animate-fade-in flex flex-col gap-4">
                
                <div className="relative">
                  <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
                  <input
                    type="text"
                    placeholder={t('control_panel.plugin_search')}
                    value={pluginSearch}
                    onChange={(e) => setPluginSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border text-xs bg-transparent border-[var(--border-color)] text-[var(--text-primary)] focus:border-[var(--accent-blue)] outline-none"
                  />
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {plugins
                    .filter(p => p.name.toLowerCase().includes(pluginSearch.toLowerCase()))
                    .map((plugin, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-xl border flex items-center justify-between gap-4 transition-all hover:bg-[rgba(0,212,255,0.03)] bg-[rgba(0,0,0,0.01)] dark:bg-white/5 border-[var(--border-color)]"
                      >
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-base bg-gradient-to-br from-indigo-500 to-purple-600">
                            <i className="fas fa-cube" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-[var(--text-primary)]">{plugin.name}</h4>
                            <span className="text-[10px] text-[var(--text-secondary)] block mt-0.5">{plugin.downloads}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleTogglePlugin(idx)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${
                            plugin.installed
                              ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"
                              : "bg-[var(--accent-blue)] text-white hover:opacity-90"
                          }`}
                        >
                          {plugin.installed ? t('control_panel.uninstall') : t('control_panel.install')}
                        </button>
                      </div>
                    ))}
                </div>
                <p className="text-sm text-[var(--text-secondary)] mt-1 italic flex items-center gap-2">
                  <i className="fas fa-info-circle text-[var(--accent-blue)]" />
                  {t('control_panel.plugins_desc')}
                </p>
              </div>
            )}

            
            {activeTab === "versions" && (
              <div className="animate-fade-in flex flex-col gap-4">
                <div className="p-4.5 rounded-xl border flex items-center gap-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border-emerald-500/20 text-emerald-400">
                  <i className="fas fa-gamepad text-xl" />
                  <div>
                    <h4 className="text-sm font-bold">{t('control_panel.current_version')}: {selectedVersion}</h4>
                    <p className="text-xs text-zinc-400 mt-0.5">{t('control_panel.egg_changer')}</p>
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {versions.map((ver, idx) => {
                    const isSelected = selectedVersion === ver.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedVersion(ver.name)}
                        className={`p-4 rounded-xl border cursor-pointer flex flex-col gap-2 transition-all ${
                          isSelected
                            ? "border-[var(--accent-blue)] bg-[rgba(0,212,255,0.05)]"
                            : "border-[var(--border-color)] bg-[rgba(0,0,0,0.01)] dark:bg-white/5 hover:border-[var(--accent-blue)]"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-[var(--text-primary)]">{ver.name}</span>
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedVersion(ver.name)}
                            className="text-[var(--accent-blue)]"
                          />
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{ver.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            
            {activeTab === "backups" && (
              <div className="animate-fade-in flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border bg-[rgba(0,0,0,0.01)] dark:bg-white/5 border-[var(--border-color)]">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-2xl text-emerald-500" />
                    <div>
                      <h4 className="text-sm font-bold text-[var(--text-primary)]">{t('control_panel.backup_cloud')}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">{t('control_panel.backup_connected')}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateBackup}
                    disabled={isBackupSyncing}
                    className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[var(--accent-blue)] hover:opacity-90 transition-all duration-300 shadow-md shadow-[rgba(0,212,255,0.1)] flex items-center justify-center gap-2"
                  >
                    {isBackupSyncing ? (
                      <>
                        <i className="fas fa-spinner animate-spin" />
                        <span>{t('control_panel.syncing')}</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sync" />
                        <span>{t('control_panel.backup_now')}</span>
                      </>
                    )}
                  </button>
                </div>

                
                <div className="border rounded-xl overflow-hidden border-[var(--border-color)]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[rgba(0,0,0,0.03)] dark:bg-white/5 border-b border-[var(--border-color)]">
                      <tr>
                        <th className="p-4 font-bold text-[var(--text-primary)]">Backup Title</th>
                        <th className="p-4 font-bold text-[var(--text-primary)]">Size</th>
                        <th className="p-4 font-bold text-[var(--text-primary)]">Target</th>
                        <th className="p-4 font-bold text-right text-[var(--text-primary)]">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                      {backupLogs.map((log, i) => (
                        <tr key={i} className="hover:bg-[rgba(0,0,0,0.01)] dark:hover:bg-white/5">
                          <td className="p-4 font-semibold text-[var(--text-primary)] flex items-center gap-2">
                            <i className="fas fa-file-archive text-purple-400" />
                            <span>{log.name}</span>
                          </td>
                          <td className="p-4">{log.size}</td>
                          <td className="p-4">
                            <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 text-blue-400">
                              {log.target}
                            </span>
                          </td>
                          <td className="p-4 text-right">{log.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
