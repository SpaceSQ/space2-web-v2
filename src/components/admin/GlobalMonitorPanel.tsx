"use client";

import React, { useState, useEffect } from 'react';
import { 
  Activity, Globe, Server, Zap, ShieldAlert, 
  Cpu, Wifi, Database, Clock
} from 'lucide-react';

// 模拟实时数据流组件
const LiveMetric = ({ label, value, unit, color, icon: Icon }: any) => (
  <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl flex items-center justify-between">
    <div>
      <div className="text-zinc-500 text-xs font-mono mb-1 uppercase tracking-wider">{label}</div>
      <div className={`text-2xl font-black font-mono ${color}`}>
        {value}<span className="text-sm text-zinc-600 ml-1">{unit}</span>
      </div>
    </div>
    <div className={`p-3 rounded-full bg-black border border-zinc-800 ${color.replace('text-', 'text-opacity-80 text-')}`}>
      <Icon size={20} />
    </div>
  </div>
);

// 模拟滚动日志
const SystemLog = () => {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const events = [
        "[INFO] New Silicon Life 'LUMI-09' born in Node #882",
        "[WARN] High latency detected in Sector PHY-Mars",
        "[SYNC] Global Ledger consensus reached (Block #9921)",
        "[SEC] Intrusion attempt blocked from IP 192.168.X.X",
        "[NET] New World Node 'Dark-Forest' requested connection",
      ];
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      const time = new Date().toLocaleTimeString();
      setLogs(prev => [`[${time}] ${randomEvent}`, ...prev].slice(0, 8));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black border border-zinc-800 rounded-xl p-4 font-mono text-[10px] h-full overflow-hidden flex flex-col">
      <div className="text-zinc-500 mb-2 font-bold flex items-center gap-2">
        <TerminalIcon size={12}/> SYSTEM KERNEL LOG
      </div>
      <div className="space-y-1.5 flex-1 overflow-hidden">
        {logs.map((log, i) => (
          <div key={i} className={`truncate ${log.includes('WARN') ? 'text-orange-400' : log.includes('SEC') ? 'text-red-400' : 'text-zinc-400'}`}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

const TerminalIcon = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line></svg>
);

export default function GlobalMonitorPanel() {
  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* 1. 核心指标矩阵 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <LiveMetric label="Active Nodes" value="1,042" unit="" color="text-blue-400" icon={Globe} />
        <LiveMetric label="Silicon Pop." value="8,920" unit="" color="text-purple-400" icon={UsersIcon} />
        <LiveMetric label="Total Compute" value="450" unit="PFLOPS" color="text-green-400" icon={Cpu} />
        <LiveMetric label="Entropy Level" value="12.5" unit="%" color="text-orange-400" icon={Activity} />
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* 2. 星际拓扑地图 (模拟) */}
        <div className="lg:col-span-2 bg-[#080808] border border-zinc-800 rounded-xl relative overflow-hidden flex items-center justify-center group">
          {/* 背景网格 */}
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
          
          {/* 模拟星图动画 */}
          <div className="relative w-full h-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <div className="w-4 h-4 bg-white rounded-full mx-auto mb-2 shadow-[0_0_15px_white]"></div>
              <div className="text-xs font-bold text-white tracking-widest">GENESIS HUB</div>
              <div className="text-[10px] text-zinc-500 font-mono">Status: ONLINE</div>
            </div>
            
            {/* 卫星节点模拟 */}
            {[...Array(6)].map((_, i) => (
              <div key={i} className="absolute w-2 h-2 bg-zinc-600 rounded-full" 
                   style={{
                     top: `${50 + 30 * Math.sin(i)}%`, 
                     left: `${50 + 30 * Math.cos(i)}%`,
                     animation: `pulse 3s infinite ${i * 0.5}s`
                   }}>
                 <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[8px] text-zinc-600 whitespace-nowrap">Node-{100+i}</div>   
              </div>
            ))}
            
            {/* 连接线 (SVG) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
               {[...Array(6)].map((_, i) => (
                 <line key={i} x1="50%" y1="50%" x2={`${50 + 30 * Math.cos(i)}%`} y2={`${50 + 30 * Math.sin(i)}%`} stroke="white" strokeWidth="1" />
               ))}
            </svg>
          </div>

          <div className="absolute bottom-4 right-4 text-xs font-mono text-zinc-500 bg-black/80 px-2 py-1 rounded border border-zinc-800">
            VIEW: TOPOLOGY_MAP_V2
          </div>
        </div>

        {/* 3. 右侧状态栏 */}
        <div className="flex flex-col gap-4">
           {/* 服务器状态 */}
           <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 flex-1">
              <h3 className="text-xs font-bold text-zinc-400 mb-4 flex items-center gap-2">
                 <Server size={14}/> CLUSTER HEALTH
              </h3>
              <div className="space-y-4">
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400"><span>Mainnet (US-West)</span><span className="text-green-500">99.9%</span></div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden"><div className="h-full w-[92%] bg-green-500 rounded-full"></div></div>
                 </div>
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400"><span>Mirror (Asia-East)</span><span className="text-green-500">98.2%</span></div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden"><div className="h-full w-[85%] bg-green-500 rounded-full"></div></div>
                 </div>
                 <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-zinc-400"><span>Database (Global)</span><span className="text-yellow-500">Load: 88%</span></div>
                    <div className="h-1.5 w-full bg-black rounded-full overflow-hidden"><div className="h-full w-[88%] bg-yellow-500 rounded-full"></div></div>
                 </div>
              </div>
           </div>

           {/* 实时日志 */}
           <div className="h-48">
              <SystemLog />
           </div>
        </div>

      </div>
    </div>
  );
}

const UsersIcon = ({size}: {size:number}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);