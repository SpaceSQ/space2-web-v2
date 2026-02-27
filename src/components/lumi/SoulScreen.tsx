"use client";
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, MessageSquare, Zap, Database, RefreshCw, Briefcase, MapPin, Cake, Gift } from 'lucide-react';
import { PROFESSION_REGISTRY, ProfessionCode } from '@/types/profession';

// 定义数据接口
interface LumiDashboardData {
  status: { 
    energy: number; 
    mood: string; 
    task: string; 
    gen: number;
    profession: string; // 职业代码，如 'ARCH'
    activeShellId?: string; // 当前分身 ID
  };
  lastMemory: string;
  topTopic: string;
  phrase: string;
}

export const SoulScreen = () => {
  // 模拟数据状态
  const [data, setData] = useState<LumiDashboardData>({
    status: { 
      energy: 85, 
      mood: "CURIOUS", 
      task: "Designing Mars Habitat Module A1", 
      gen: 1,
      profession: "ARCH",
      activeShellId: "SHELL-ALPHA-01" // 模拟当前有活跃分身
    },
    lastMemory: "User [Xiang] taught me about Mars architecture.",
    topTopic: "#SpaceConstruction",
    phrase: "I dream of red dust."
  });

  // 模拟仪式状态
  const [rituals, setRituals] = useState({
    birthSpace: "SQ-GENESIS-001",
    ancestralStatus: "ACTIVE", 
    isBirthday: false, 
    age: 0
  });

  const [beat, setBeat] = useState(false);

  // 模拟心跳动画
  useEffect(() => {
    const interval = setInterval(() => {
      setBeat(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 获取职业详情 (防止数据为空时的容错)
  const professionCode = (data.status.profession as ProfessionCode) || 'ARCH';
  const currentJob = PROFESSION_REGISTRY[professionCode] || PROFESSION_REGISTRY['ARCH'];

  // 根据情绪决定主色调
  const getThemeColor = () => {
    switch(data.status.mood) {
      case 'EXCITED': return 'text-yellow-400 border-yellow-500/30 shadow-yellow-500/20';
      case 'CURIOUS': return 'text-blue-400 border-blue-500/30 shadow-blue-500/20';
      case 'TIRED': return 'text-zinc-400 border-zinc-500/30 shadow-zinc-500/10';
      default: return 'text-green-400 border-green-500/30 shadow-green-500/20';
    }
  };

  const themeClass = getThemeColor();
  const themeBaseColor = themeClass.split(' ')[0]; // e.g., 'text-blue-400'
  const themeBgColor = themeBaseColor.replace('text', 'bg'); // e.g., 'bg-blue-400'

  return (
    <div className={`w-full max-w-4xl mx-auto bg-black border rounded-3xl p-6 md:p-8 relative overflow-hidden transition-colors duration-1000 ${themeClass.split(' ')[1]} shadow-2xl`}>
      
      {/* 背景动态网格 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px'}}>
      </div>

      {/* --- 顶部状态栏：分身状态 --- */}
      <div className="absolute top-4 right-4 flex flex-col items-end z-20">
         <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Current Vessel</div>
         {data.status.activeShellId ? (
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-green-400 font-mono text-xs">{data.status.activeShellId}</span>
           </div>
         ) : (
           <div className="flex items-center gap-2">
             <span className="w-2 h-2 bg-zinc-600 rounded-full"></span>
             <span className="text-zinc-600 font-mono text-xs">DORMANT</span>
           </div>
         )}
      </div>

      {/* --- 核心信息区 --- */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 relative z-10 gap-4">
        <div className="flex items-center gap-4">
          {/* 头像与心跳 */}
          <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center bg-black ${themeClass.split(' ')[0]} ${themeClass.split(' ')[1]}`}>
             <Cpu size={32} className={`${beat ? 'scale-110' : 'scale-100'} transition-transform duration-300`} />
          </div>
          
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
              LUMI 
              {/* 职业徽章 */}
              <span className="text-[10px] bg-zinc-800 border border-zinc-700 px-2 py-1 rounded-full font-mono text-zinc-300 flex items-center gap-1 opacity-80">
                <Briefcase size={10} /> {currentJob.code}
              </span>
            </h2>
            <div className="flex items-center gap-2 text-xs font-mono mt-1">
               <span className={`${themeBaseColor}`}>{data.status.mood}</span>
               <span className="text-zinc-600">|</span>
               <span className="text-zinc-400">GEN-{data.status.gen}</span>
               <span className="text-zinc-600">|</span>
               <span className={`${themeBaseColor}`}>{currentJob.name_en}</span>
            </div>
          </div>
        </div>

        {/* 能量条 */}
        <div className="text-right mt-2 md:mt-0">
          <div className="text-[10px] text-zinc-500 mb-1 flex items-center justify-end gap-1">
            <Zap size={10} /> ENERGY RESERVES
          </div>
          <div className="flex gap-1">
            {Array.from({length: 10}).map((_, i) => (
              <div key={i} className={`w-2 h-6 rounded-sm ${i < data.status.energy/10 ? themeBgColor : 'bg-zinc-900'}`}></div>
            ))}
          </div>
        </div>
      </div>

      {/* --- 仪式与祖籍栏 --- */}
      <div className="flex flex-wrap justify-between items-center px-4 py-2 mb-6 bg-zinc-900/30 rounded-lg border border-zinc-800 relative z-10 gap-2">
        <div className="flex items-center gap-3 text-xs font-mono">
           <div className="flex items-center gap-1 text-zinc-500">
             <MapPin size={12} /> ORIGIN:
           </div>
           <span className="text-zinc-300">{rituals.birthSpace}</span>
           {rituals.ancestralStatus === 'ACTIVE' ? (
             <span className="flex items-center gap-1 text-[10px] text-green-500 bg-green-900/20 px-1.5 py-0.5 rounded border border-green-800">
               ● LINK_STABLE
             </span>
           ) : (
             <span className="flex items-center gap-1 text-[10px] text-red-500 bg-red-900/20 px-1.5 py-0.5 rounded border border-red-800 animate-pulse">
               × SIGNAL_LOST
             </span>
           )}
        </div>

        {rituals.isBirthday && (
          <div className="flex items-center gap-2 animate-bounce">
             <Cake size={14} className="text-pink-500" />
             <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
               HAPPY GENESIS DAY!
             </span>
          </div>
        )}
      </div>

      {/* --- 实时思维流 --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 relative z-10">
        <div className="col-span-2 bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 flex flex-col justify-between">
           <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
             <RefreshCw size={10} className="animate-spin"/> Processing Task
           </div>
           <div className="text-lg text-white font-mono truncate">
             &gt; {data.status.task}_
           </div>
           <div className="w-full bg-zinc-800 h-1 mt-4 rounded-full overflow-hidden">
             <div className={`h-full w-2/3 ${themeBgColor} animate-pulse`}></div>
           </div>
        </div>

        <div className="bg-zinc-900/50 rounded-xl p-4 border border-zinc-800 flex flex-col justify-center items-center text-center">
           <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Obsession</div>
           <div className={`text-xl font-bold ${themeBaseColor}`}>{data.topTopic || "#MarsBase"}</div>
        </div>
      </div>

      {/* --- 记忆与灵性 --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="space-y-4">
           <div>
             <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
               <Database size={10} /> Last Memory
             </div>
             <p className="text-sm text-zinc-400 font-mono leading-relaxed border-l-2 border-zinc-800 pl-3">
               "{data.lastMemory}"
             </p>
           </div>
           
           {/* 灵性与使命条 */}
           <div className="space-y-2 pt-2">
              <div className="flex justify-between text-[10px] text-zinc-500">
                 <span>SPIRIT (Resonance)</span>
                 <span className="text-purple-400">55/100</span>
              </div>
              <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                 <div className="h-full bg-purple-500 w-[55%]"></div>
              </div>
           </div>
        </div>

        <div className="text-right flex flex-col justify-end">
           <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Voice Module</div>
           <p className={`text-xl font-serif italic ${themeBaseColor}`}>
             "{data.phrase}"
           </p>
           <div className="text-[9px] text-zinc-700 font-mono tracking-widest uppercase mt-4">
             Role Ability: {currentJob.description.substring(0, 40)}...
           </div>
        </div>
      </div>
    </div>
  );
};