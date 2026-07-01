import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";

export const HeroConsole: React.FC = () => {
  const { t } = useTranslation();
  const [lines, setLines] = useState<string[]>([]);
  const consoleContainerRef = useRef<HTMLDivElement>(null);

  const logsSequence = [
    "> Loading system configuration...",
    "> Fetching system libraries...",
    "> starting minecraft server...",
    "[15:20:00 INFO]: Starting minecraft server version 1.20.4",
    "[15:20:01 INFO]: Loading properties",
    "[15:20:01 INFO]: Default game type: SURVIVAL",
    "[15:20:01 INFO]: Generating keypair",
    "[15:20:02 INFO]: Starting Minecraft server on *:25565",
    "[15:20:03 INFO]: Preparing level \"world\"",
    "[15:20:05 INFO]: Preparing start region for dimension minecraft:overworld",
    "[15:20:07 INFO]: Preparing start region for dimension minecraft:the_nether",
    "[15:20:09 INFO]: Preparing start region for dimension minecraft:the_end",
    "[15:20:10 INFO]: Time elapsed: 7856ms",
    "[15:20:10 INFO]: Done (8.21s)! For help, type \"help\"",
    "> Running performance check...",
    "[SYSTEM INFO]: CPU core load: 1.2% | RAM load: 245MB / 4096MB",
    "> Server started on port 25565",
    "[15:20:12 INFO]: Player Tinnz (UUID: 89fca6-22bf) joined the game",
    "[15:20:13 INFO]: Player PiuPiuu (UUID: a12bc3-44ee) joined the game",
    "[15:20:15 INFO]: <Tinnz> Welcome to TinnzStore Premium Server!",
    "[15:20:16 INFO]: <PiuPiuu> Wow, this server latencies are incredibly low!",
    "> Saving level world...",
    "[SYSTEM INFO]: Auto-save complete. Backup synced with Google Drive cloud database safely."
  ];

  useEffect(() => {
    let currentIdx = 0;
    setLines([logsSequence[0]]);

    const interval = setInterval(() => {
      currentIdx++;
      if (currentIdx < logsSequence.length) {
        setLines((prev) => [...prev, logsSequence[currentIdx]]);
      } else {
        currentIdx = 0;
        setLines([logsSequence[0]]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <div className="w-full lg:max-w-2xl bg-black rounded-xl border border-zinc-800 shadow-2xl relative overflow-hidden flex flex-col h-80 font-mono text-xs">
      
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block" />
          <span className="text-zinc-400 font-semibold text-xs ml-2 select-none">tinnz@minecraft-console:~</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500 text-xs">
          <i className="fas fa-terminal" />
          <span>{t("hero.live_session")}</span>
        </div>
      </div>

      
      <div 
        ref={consoleContainerRef}
        className="flex-1 p-5 overflow-y-auto text-green-400 space-y-2 terminal-scanlines select-text"
      >
        {lines.map((line, idx) => {
          let textClass = "text-green-400";
          if (line.includes("ERROR") || line.includes("failed")) {
            textClass = "text-red-400";
          } else if (line.includes("SYSTEM INFO")) {
            textClass = "text-blue-400 font-bold";
          } else if (line.startsWith(">")) {
            textClass = "text-cyan-400";
          } else if (line.includes("<")) {
            textClass = "text-yellow-200";
          }
          return (
            <div key={idx} className={`${textClass} leading-relaxed break-all`}>
              {line}
            </div>
          );
        })}
        
        <div className="text-zinc-500 flex items-center">
          <span>{">"}</span>
          <span className="ml-1 text-green-400 font-bold">_</span>
          <span className="w-1.5 h-3.5 bg-green-400 ml-0.5 cursor-blink inline-block" />
        </div>
      </div>

      
      <div className="bg-zinc-950 px-4 py-2 flex items-center justify-between text-[10px] text-zinc-500 border-t border-zinc-900">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
          <span>{t("hero.node")} srv-1.tsrv.me</span>
        </div>
        <div>{t("hero.uptime")} 99.98%</div>
        <div className="text-cyan-400">FPS: 60</div>
      </div>
    </div>
  );
};
