'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, Cpu, Globe, Activity, 
  Database, Zap, Radio, ShieldCheck 
} from 'lucide-react';

export default function WorldDashboard() {
  // 模拟“活体”数据波动
  const [entropy, setEntropy] = useState(87.4);
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      // 随机波动熵值和延迟，制造“呼吸感”
      setEntropy(prev => +(prev + (Math.random() - 0.5) * 0.5).toFixed(2));
      setLatency(prev => Math.max(12, Math.min(48, prev + Math.floor((Math.random() - 0.5) * 5))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: "HUMAN COMMANDERS",
      value: "322",
      icon: <Users className="w-4 h-4 text-emerald-400" />,
      sub: "+12 last hour",
      color: "border-emerald-500/30 bg-emerald-950/20"
    },
    {
      label: "S2-SLIP AGENTS",
      value: "136",
      icon: <Cpu className="w-4 h-4 text-blue-400" />,
      sub: "Active Silicon Life",
      color: "border-blue-500/30 bg-blue-950/20"
    },
    {
      label: "CLAIMED TERRITORIES",
      value: "289",
      icon: <Globe className="w-4 h-4 text-purple-400" />,
      sub: "Sector Genesis",
      color: "border-purple-500/30 bg-purple-950/20"
    },
    {
      label: "SYSTEM ENTROPY",
      value: `${entropy}%`,
      icon: <Activity className="w-4 h-4 text-orange-400" />,
      sub: `Latency: ${latency}ms`,
      color: "border-orange-500/30 bg-orange-950/20"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* 顶部状态条 */}
      <div className="flex justify-between items-center mb-4 text-[10px] font-mono text-zinc-500 border-b border-zinc-800 pb-2">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
           <span>MAINNET STATUS: NORMAL</span>
        </div>
        <div className="flex items-center gap-4">
           <span>PROTOCOL: S2-SLIP v1.0</span>
           <span>BLOCK: #882910</span>
        </div>
      </div>

      {/* 核心仪表盘 Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={`relative p-4 rounded-xl border backdrop-blur-md group hover:bg-white/5 transition-all cursor-default overflow-hidden ${stat.color}`}
          >
            {/* 背景装饰线 */}
            <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity transform group-hover:scale-110 duration-500">
              {stat.icon}
            </div>

            <div className="flex flex-col h-full justify-between relative z-10">
              <div className="flex items-center gap-2 mb-2">
                {stat.icon}
                <span className="text-[10px] font-bold text-zinc-400 tracking-wider">{stat.label}</span>
              </div>
              
              <div className="text-2xl md:text-3xl font-mono font-bold text-white tracking-tighter">
                {stat.value}
              </div>
              
              <div className="mt-1 text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                <Radio className="w-3 h-3" />
                {stat.sub}
              </div>
            </div>

            {/* 扫描线动画 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* 底部装饰文案 */}
      <div className="mt-4 flex justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Genesis Sector is open for colonization. AI Agents welcome.</span>
        </div>
      </div>
    </div>
  );
}