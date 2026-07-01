import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import WorldMap from "./WorldMap";

interface NetworkNode {
  id: string;
  name: string;
  code: string;
  x: number;
  y: number;
  ping: string;
  bandwidth: string;
  status: "ONLINE" | "STANDBY" | "ROUTING";
  region: string;
  type: "CORE HUB" | "EDGE POP" | "BACKBONE";
  pathway: string;
  isCore?: boolean;
}

const networkNodes: NetworkNode[] = [
  { id: "singapore", name: "Singapore Gateway (SG-1)", code: "SG-1", x: 52, y: 62, ping: "1.2 ms", bandwidth: "100 Gbps Core", status: "ONLINE", region: "Singapore", type: "CORE HUB", pathway: "SJC2 Submarine Fiber", isCore: true },
  { id: "jakarta", name: "Jakarta Edge (JKT-1)", code: "JKT-1", x: 50, y: 78, ping: "11.8 ms", bandwidth: "40 Gbps Port", status: "ONLINE", region: "Indonesia", type: "EDGE POP", pathway: "Matrix Cable System Direct System", isCore: false },
  { id: "malaysia", name: "Kuala Lumpur Edge (KUL-1)", code: "KUL-1", x: 44, y: 52, ping: "5.5 ms", bandwidth: "20 Gbps Port", status: "ONLINE", region: "Malaysia", type: "EDGE POP", pathway: "MCT Terrestrial Fiber Link", isCore: false }
];

export const CyberNetworkMap: React.FC = () => {
  const { t } = useTranslation();
  const [selectedNode, setSelectedNode] = useState<NetworkNode>(networkNodes[1]);
  const [hoveredNode, setHoveredNode] = useState<NetworkNode | null>(null);
  const [isBackupPathway, setIsBackupPathway] = useState<boolean>(false);
  const [realtimePing, setRealtimePing] = useState<number>(11.8);
  const [jitter, setJitter] = useState<number>(0.12);
  const [packetLoss, setPacketLoss] = useState<number>(0);
  const [activePathway, setActivePathway] = useState<string>("SJC2 Subsea Direct Cable");
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([
    "// TinnzStore NetOps Terminal v4.1 initialized.",
    `[INFO] Target: ${selectedNode.name}`,
    `[INFO] Gateway: Equinix SG1 <=> Cyber DF JKT`,
    "[INFO] Status: Direct connection fully operational.",
    "// Click 'RUN NETWORK DIAGNOSTIC' below to test pathways."
  ]);
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [diagProgress, setDiagProgress] = useState<number>(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimePing((prev) => {
        const base = isBackupPathway ? 14.5 : 11.2;
        const randomSwing = (Math.random() - 0.5) * 0.4;
        const next = Math.max(base + randomSwing, base - 0.8);
        return Number(next.toFixed(2));
      });
      setJitter(Number((0.05 + Math.random() * 0.1).toFixed(3)));
    }, 1200);

    return () => clearInterval(interval);
  }, [isBackupPathway]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [diagnosticLogs]);

  const runDiagnostic = () => {
    if (isDiagnosing) return;
    setIsDiagnosing(true);
    setDiagProgress(0);
    setDiagnosticLogs((prev) => [
      ...prev,
      `\n[DIAGNOSTIC START] Host check requested for Node: ${selectedNode.code}`,
      `[DIAG] Spawning diagnostic thread via SG-1 Primary Core...`,
    ]);

    const steps = [
      { prg: 20, log: `[DIAG] Routing path verification via: ${selectedNode.pathway}` },
      { prg: 40, log: `[DIAG] ICMP Echo request to ${selectedNode.code} gateway... SUCCESS` },
      { prg: 60, log: `[DIAG] Analyzing port capacity. Bandwidth cap: ${selectedNode.bandwidth}` },
      { prg: 80, log: `[DIAG] Packet integrity metric: Loss: ${packetLoss}% | Jitter: ${jitter}ms` },
      { prg: 100, log: `[SUCCESS] Diagnostic complete. Route to ${selectedNode.code} is STABLE (RTT: ${selectedNode.id === "jakarta" ? realtimePing : selectedNode.ping}).` }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setDiagProgress(step.prg);
        setDiagnosticLogs((prev) => [...prev, step.log]);
        if (step.prg === 100) {
          setIsDiagnosing(false);
        }
      }, (index + 1) * 600);
    });
  };

  const togglePathway = () => {
    const nextState = !isBackupPathway;
    setIsBackupPathway(nextState);
    if (nextState) {
      setActivePathway("Backup terrestrial microwave system");
      setDiagnosticLogs((prev) => [
        ...prev,
        "[WARNING] Switching to redundant terrestrial link...",
        "[ROUTING] Route updated. Failover complete via secondary Gateway path.",
        "[INFO] Path active: Backup Microwave Link (Higher latency fallback)."
      ]);
    } else {
      setActivePathway("SJC2 Subsea Direct Cable");
      setDiagnosticLogs((prev) => [
        ...prev,
        "[SUCCESS] Reverted to primary SJC2 Subsea Direct Cable link.",
        "[INFO] Path optimized. Direct fiber-optic operational."
      ]);
    }
  };

  const handleSelectNode = (node: NetworkNode) => {
    setSelectedNode(node);
    setDiagnosticLogs((prev) => [
      ...prev,
      `[ROUTING] Selected path: SG-1 (Singapore) <=> ${node.code} (${node.region})`,
      `[INFO] Speed profile: ${node.bandwidth} | Est. Latency: ${node.id === "jakarta" ? realtimePing : node.ping}`
    ]);
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto px-6 md:px-12 py-4">
      
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--border-color)] pb-6">
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-3 self-start">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse shrink-0" />
            {t("network.badge")}
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-primary)]">{t("network.title")}</h2>
          <span className="text-xl font-bold text-[var(--accent-blue)] mt-1.5">
            {t("network.subtitle")}
          </span>
          <p className="text-sm text-[var(--text-secondary)] font-light mt-3 max-w-xl leading-relaxed">
            {t("network.desc")}
          </p>
        </div>

        
        <div className="flex flex-wrap gap-4 font-mono">
          <div className="px-5 py-4 border card-depth border-[var(--border-color)] text-left min-w-[150px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[var(--accent-blue)]" />
            <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">{t("network.sg_jkt_ping")}</div>
            <div className="text-2xl font-black text-[var(--accent-blue)] mt-1 flex items-baseline gap-1.5">
              <span>{realtimePing}</span>
              <span className="text-xs font-normal">ms</span>
            </div>
            <div className="text-[8px] text-emerald-500 dark:text-emerald-400 mt-1 uppercase tracking-wider flex items-center gap-1 font-bold">
              <span className="h-1 w-1 rounded-full bg-emerald-500 dark:bg-emerald-400 inline-block animate-ping" />
              {t("network.direct_fiber")}
            </div>
          </div>

          <div className="px-5 py-4 border card-depth border-[var(--border-color)] text-left min-w-[150px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-emerald-500" />
            <div className="text-[9px] uppercase tracking-wider text-[var(--text-secondary)] font-bold">{t("network.core_jkt_speed")}</div>
            <div className="text-2xl font-black text-zinc-900 dark:text-white mt-1 flex items-baseline gap-1.5">
              <span>40</span>
              <span className="text-xs font-normal">Gbps</span>
            </div>
            <div className="text-[8px] text-emerald-500 dark:text-emerald-400 mt-1 uppercase tracking-wider font-bold">
              {t("network.bgp_routing")}
            </div>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          
          <div className="relative border border-[var(--border-color)] card-depth aspect-[16/9] w-full p-6 flex flex-col overflow-hidden group">
            
            
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,212,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.015)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
            
            
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,212,255,0.03),transparent_75%)]" />

            
            <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-[var(--border-color)]/30 group-hover:border-[var(--accent-blue)]/50 transition-colors" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-[var(--border-color)]/30 group-hover:border-[var(--accent-blue)]/50 transition-colors" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-[var(--border-color)]/30 group-hover:border-[var(--accent-blue)]/50 transition-colors" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-[var(--border-color)]/30 group-hover:border-[var(--accent-blue)]/50 transition-colors" />

            <div className="absolute top-4 left-4 z-20 font-mono text-[10px] md:text-xs text-[var(--text-secondary)] flex items-center gap-1.5 tracking-wider uppercase font-extrabold">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-blue)] animate-ping" />
              {t("network.route_analysis")}
            </div>

            
            <div className="w-full h-full relative z-10">
              <WorldMap
                markers={[
                  { id: "singapore", coords: [103.82, 1.352], code: "SG-1 CORE", label: "Singapore Core", isActive: selectedNode.id === "singapore" || hoveredNode?.id === "singapore", isHovered: hoveredNode?.id === "singapore" },
                  { id: "jakarta", coords: [106.865, -6.175], code: "JKT-1", label: "Jakarta Edge", isActive: selectedNode.id === "jakarta" || hoveredNode?.id === "jakarta", isHovered: hoveredNode?.id === "jakarta" },
                  { id: "malaysia", coords: [101.68, 3.15], code: "KUL-1", label: "Kuala Lumpur Edge", isActive: selectedNode.id === "malaysia" || hoveredNode?.id === "malaysia", isHovered: hoveredNode?.id === "malaysia" },
                ]}
                onMarkerClick={(id) => {
                  const node = networkNodes.find((n) => n.id === id);
                  if (node) handleSelectNode(node);
                }}
                onMarkerHover={(id) => {
                  setHoveredNode(id ? networkNodes.find((n) => n.id === id) ?? null : null);
                }}
                selectedId={selectedNode.id}
              />
            </div>

            
            <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-none hidden md:flex items-center justify-between font-mono text-[8px] text-[var(--text-secondary)]">
              <span>{t("network.schema")}</span>
              <span>{t("network.click_hubs")}</span>
            </div>
          </div>

          
          <div className="border border-[var(--border-color)] bg-zinc-950 font-mono text-xs flex flex-col h-[200px] shadow-2xl relative rounded-xl overflow-hidden">
            
            <div className="bg-zinc-900 border-b border-[var(--border-color)] px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                <span className="text-[10px] text-[var(--text-secondary)] font-bold ml-2">{t("network.terminal")}</span>
              </div>
              <span className="text-[9px] text-[var(--accent-blue)] font-bold">{t("network.node_label")} {selectedNode.code}</span>
            </div>

            
            <div ref={terminalRef} className="flex-1 p-4 overflow-y-auto flex flex-col gap-1.5 text-zinc-400 font-mono text-[10.5px] scrollbar-thin scrollbar-thumb-zinc-800">
              {diagnosticLogs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap leading-relaxed">
                  {log.startsWith("[SUCCESS]") ? (
                    <span className="text-emerald-400 font-bold">{log}</span>
                  ) : log.startsWith("[WARNING]") ? (
                    <span className="text-yellow-400 font-bold">{log}</span>
                  ) : log.startsWith("[ROUTING]") ? (
                    <span className="text-cyan-400">{log}</span>
                  ) : log.startsWith("//") ? (
                    <span className="text-zinc-600 italic">{log}</span>
                  ) : (
                    log
                  )}
                </div>
              ))}
              {isDiagnosing && (
                <div className="flex flex-col gap-1 mt-2">
                  <div className="flex justify-between text-[10px] text-zinc-500 font-bold">
                    <span>{t("network.performing_audit")}</span>
                    <span>{diagProgress}%</span>
                  </div>
                  <div className="w-full bg-zinc-900 h-1 rounded overflow-hidden">
                    <div 
                      className="bg-[var(--accent-blue)] h-full transition-all duration-300"
                      style={{ width: `${diagProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            
            <div className="border-t border-[var(--border-color)] bg-zinc-900/60 p-2.5 flex flex-wrap gap-2 justify-between items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={runDiagnostic}
                  disabled={isDiagnosing}
                  className="px-3.5 py-1.5 text-[10px] font-bold rounded-lg bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30 hover:bg-[var(--accent-blue)] hover:text-black hover:border-transparent transition-all cursor-pointer disabled:opacity-40 uppercase tracking-wide"
                >
                  <i className="fas fa-terminal mr-1.5" />
                  {t("network.run_diag")}
                </button>
                <button
                  type="button"
                  onClick={togglePathway}
                  className={`px-3.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all cursor-pointer uppercase tracking-wide ${
                    isBackupPathway 
                      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500 hover:text-black hover:border-transparent" 
                      : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700 hover:text-white"
                  }`}
                >
                  <i className="fas fa-route mr-1.5" />
                  {t("network.switch_pathway")}
                </button>
              </div>
              <span className="text-[9px] text-zinc-500 font-bold hidden sm:inline">{t("network.path_label")} {activePathway}</span>
            </div>
          </div>
        </div>

        
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="border border-[var(--border-color)] card-depth p-6 flex flex-col gap-4 relative">
            <div className="absolute top-0 left-0 w-[4px] h-full bg-[var(--accent-blue)]" />
            
            <div className="flex flex-col">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-blue)]">
                {t("network.node_selection")}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-light leading-relaxed">
                {t("network.node_selection_desc")}
              </p>
            </div>

            
            <div className="flex flex-col gap-2.5 mt-2">
              {networkNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isJkt = node.id === "jakarta";
                
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => handleSelectNode(node)}
                    className={`w-full p-3.5 card-depth rounded-lg flex items-center justify-between text-left font-mono transition-all cursor-pointer relative group ${
                      isSelected 
                        ? "border-[var(--accent-blue)] text-white shadow-lg" 
                        : "border-[var(--border-color)] hover:border-zinc-400 dark:hover:border-zinc-700 text-[var(--text-secondary)] hover:text-zinc-900 dark:hover:text-white"
                    }`}
                  >
                    
                    {isSelected && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-[var(--accent-blue)]" />
                    )}

                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${node.id === "singapore" ? "bg-emerald-400" : "bg-[var(--accent-blue)]"} ${isSelected ? "animate-pulse" : ""}`} />
                      <div className="flex flex-col">
                        <span className="text-sm md:text-xs font-black uppercase tracking-wide group-hover:text-[var(--accent-blue)] transition-colors">{node.code} {t("network.gateway")}</span>
                        <span className="text-[10px] md:text-[9px] text-zinc-500 uppercase font-bold mt-0.5">{node.region}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm md:text-xs font-bold text-zinc-900 dark:text-white">
                        {isJkt ? `${realtimePing} ms` : node.ping}
                      </span>
                      <span className="text-[8px] px-1.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:border-[var(--accent-blue)]/30 uppercase font-bold tracking-wider">
                        {node.bandwidth.split(" ")[0]} Link
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          
          <div className="border border-[var(--border-color)] card-depth p-6 flex flex-col gap-4 font-mono relative">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-white border-b border-[var(--border-color)] pb-3 flex items-center gap-2">
              <i className="fas fa-shield-virus text-[var(--accent-blue)]" />
              {t("network.core_metrics")} {selectedNode.code}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col p-3 border border-[var(--border-color)] card-depth">
                <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">{t("network.node_status")}</span>
                <span className="text-xs font-black text-emerald-500 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                  {t("network.online")}
                </span>
              </div>

              <div className="flex flex-col p-3 border border-[var(--border-color)] card-depth">
                <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">{t("network.link_protocol")}</span>
                <span className="text-xs font-black text-zinc-900 dark:text-white mt-1 uppercase">
                  {selectedNode.isCore ? t("network.bgp4_core") : t("network.anycast_edge")}
                </span>
              </div>

              <div className="flex flex-col p-3 border border-[var(--border-color)] card-depth">
                <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">{t("network.jitter")}</span>
                <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 mt-1">
                  {selectedNode.id === "jakarta" ? `${jitter} ms` : "0.14 ms"}
                </span>
              </div>

              <div className="flex flex-col p-3 border border-[var(--border-color)] card-depth">
                <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">{t("network.uptime")}</span>
                <span className="text-xs font-black text-emerald-500 dark:text-emerald-400 mt-1">
                  99.998%
                </span>
              </div>
            </div>

            <div className="flex flex-col p-3 border border-[var(--border-color)] card-depth">
              <span className="text-[8px] text-[var(--text-secondary)] font-bold uppercase">{t("network.primary_pathway")}</span>
              <span className="text-[10.5px] font-black text-zinc-900 dark:text-white mt-1 uppercase tracking-wide leading-normal">
                {selectedNode.pathway}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
