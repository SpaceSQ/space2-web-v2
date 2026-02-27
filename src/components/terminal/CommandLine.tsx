"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Cpu, Wifi, Shield, Activity } from 'lucide-react';

interface LogLine {
  id: string;
  type: 'input' | 'output' | 'system' | 'error';
  content: React.ReactNode;
  timestamp: number;
}

export const CommandLine = () => {
  const [history, setHistory] = useState<LogLine[]>([]);
  const [input, setInput] = useState('');
  const [isWatching, setIsWatching] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isWatching]);

  // "Watch" 模式：模拟 LUMI 的实时思维流
  useEffect(() => {
    if (!isWatching) return;

    const tasks = [
      "Analyzing carbon-silicon bridge stability...",
      "Optimizing SSSU container geometry...",
      "Syncing with Mars-Utopia-Planitia-01...",
      "Refining NBT consensus algorithm...",
      "Detecting anomaly in Sector 7...",
      "Re-calibrating emotional engine (LUMI)...",
      "Downloading terrestrial architecture patterns...",
      "Uploading consciousness fragment [#######.......]",
      "Verifying user intent signature...",
      "Pinging Starlink node #4029...",
    ];

    const interval = setInterval(() => {
      const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
      const hash = Math.random().toString(16).substr(2, 8).toUpperCase();
      
      addLog('system', `[PROCESS_${hash}] ${randomTask}`);
      
      // 随机自动停止，防止无限循环太久
      if (Math.random() > 0.98) {
        setIsWatching(false);
        addLog('system', '--- WATCH STREAM PAUSED (Buffer Empty) ---');
      }
    }, 600);

    return () => clearInterval(interval);
  }, [isWatching]);

  // 添加日志工具函数
  const addLog = (type: LogLine['type'], content: React.ReactNode) => {
    setHistory(prev => [...prev, {
      id: Math.random().toString(36),
      type,
      content,
      timestamp: Date.now()
    }]);
  };

  // 核心命令执行逻辑
  const executeCommand = (cmd: string) => {
    const cleanCmd = cmd.trim().toLowerCase();
    
    // 1. 记录用户输入
    addLog('input', cmd);

    // 2. 解析命令
    switch (cleanCmd) {
      case 'help':
        addLog('output', (
          <div className="space-y-1 text-zinc-400">
            <div>Available Commands:</div>
            <ul className="list-disc pl-4 space-y-1">
              <li><span className="text-white font-bold">status</span>: Check system integrity.</li>
              <li><span className="text-white font-bold">watch</span>: Observe LUMI's real-time thought stream.</li>
              <li><span className="text-white font-bold">connect</span>: Initiate neural link (Simulation).</li>
              <li><span className="text-white font-bold">clear</span>: Clear terminal history.</li>
              <li><span className="text-white font-bold">whoami</span>: Identify current session user.</li>
            </ul>
          </div>
        ));
        break;

      case 'watch':
        setIsWatching(true);
        addLog('system', '--- STARTING NEURAL WATCH STREAM (Press Ctrl+C to stop) ---');
        break;

      case 'status':
        addLog('output', (
          <div className="grid grid-cols-2 gap-4 max-w-md mt-2 p-2 border border-zinc-800 rounded bg-zinc-900/50">
            <div className="flex items-center gap-2 text-green-400"><Cpu size={14}/> KERNEL: ONLINE</div>
            <div className="flex items-center gap-2 text-blue-400"><Wifi size={14}/> UPLINK: STABLE</div>
            <div className="flex items-center gap-2 text-yellow-400"><Shield size={14}/> FIREWALL: ACTIVE</div>
            <div className="flex items-center gap-2 text-purple-400"><Activity size={14}/> LUMI: AWAKE</div>
          </div>
        ));
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'whoami':
        addLog('output', 'Guest User (Role: Observer) | ID: ANONYMOUS');
        break;

      case 'connect':
        addLog('system', 'Initiating handshake with SpaceSQ Mainnet...');
        setTimeout(() => {
          addLog('output', 'Handshake successful.');
          addLog('system', 'Authenticating...');
        }, 800);
        setTimeout(() => {
          addLog('error', 'Error: Neural Interface Hardware (NIH) not detected. Please connect a BCI device.');
        }, 1600);
        break;

      case '':
        break;

      default:
        addLog('error', `Command not found: ${cleanCmd}. Type 'help' for available commands.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 停止 Watch 模式 (Ctrl + C)
    if (e.key === 'c' && e.ctrlKey) {
      if (isWatching) {
        setIsWatching(false);
        addLog('system', '^C');
        e.preventDefault();
      }
    }
    // 执行命令
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    }
  };

  return (
    <div className="font-mono text-sm h-full flex flex-col bg-black text-zinc-300">
      {/* 顶部欢迎语 */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2">
        {history.length === 0 && (
          <div className="text-zinc-500 mb-4 select-none">
            SpaceSQ Terminal [Version 1.0.4]<br/>
            (c) 2026 Genesis Hub. All rights reserved.<br/>
            Type <span className="text-white font-bold">'help'</span> to see available commands.<br/>
            ------------------------------------------------
          </div>
        )}
        
        {/* 日志渲染区 */}
        {history.map((log) => (
          <div key={log.id} className={`${
            log.type === 'input' ? 'text-white font-bold mt-4' :
            log.type === 'error' ? 'text-red-500' :
            log.type === 'system' ? 'text-blue-400 italic' :
            'text-zinc-300'
          }`}>
            {log.type === 'input' && <span className="text-green-500 mr-2">guest@spacesq:~$</span>}
            {log.content}
          </div>
        ))}
        
        {isWatching && (
          <div className="text-blue-500 animate-pulse mt-2">
            ... receiving neural stream ...
          </div>
        )}
        
        {/* 锚点用于自动滚动 */}
        <div ref={bottomRef} />
      </div>

      {/* 底部输入框 */}
      <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex items-center gap-2">
        <span className="text-green-500 font-bold shrink-0">guest@spacesq:~$</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-transparent border-none outline-none text-white w-full font-mono placeholder:text-zinc-600"
          autoFocus
          placeholder={isWatching ? "Stream active... (Press Ctrl+C to stop)" : ""}
          disabled={isWatching}
        />
      </div>
    </div>
  );
};