"use client";
import React from 'react';
import { Users, Download, Zap, Server } from 'lucide-react';

export const SystemDashboard = () => {
  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 1. 核心指标卡 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL CITIZENS', value: '14,203', icon: Users, color: 'text-blue-500' },
          { label: 'SEED DOWNLOADS', value: '8,942', icon: Download, color: 'text-green-500' },
          { label: 'ACTIVE NODES', value: '2,105', icon: Zap, color: 'text-yellow-500' },
          { label: 'STORAGE USED', value: '42%', icon: Server, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-zinc-500 text-xs font-bold tracking-wider mb-1">{stat.label}</div>
              <div className="text-3xl font-mono text-white">{stat.value}</div>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
          </div>
        ))}
      </div>

      {/* 2. 实时流量监控 (SVG模拟) */}
      <div className="bg-black border border-zinc-800 p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-white font-bold text-lg">Network Traffic (Real-time)</h3>
          <div className="flex gap-2">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span className="text-xs text-zinc-500 font-mono">LIVE FEED</span>
          </div>
        </div>
        <div className="h-64 w-full bg-zinc-900/20 rounded relative overflow-hidden flex items-end">
           {/* 模拟柱状图 */}
           {Array.from({length: 40}).map((_, i) => (
             <div 
               key={i} 
               className="flex-1 bg-blue-600/50 hover:bg-blue-500 transition-all mx-[1px]" 
               style={{ height: `${20 + Math.random() * 60}%` }}
             ></div>
           ))}
        </div>
      </div>

      {/* 3. 区域状态 */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-black border border-zinc-800 p-6 rounded-xl">
           <h4 className="text-zinc-400 text-sm font-bold mb-4">SEED DISTRIBUTION MAP</h4>
           <div className="space-y-3">
             <div className="flex justify-between text-xs text-zinc-300"><span>Asia Sector</span><span>45%</span></div>
             <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[45%]"></div></div>
             
             <div className="flex justify-between text-xs text-zinc-300"><span>NA Sector</span><span>30%</span></div>
             <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[30%]"></div></div>
             
             <div className="flex justify-between text-xs text-zinc-300"><span>EU Sector</span><span>25%</span></div>
             <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden"><div className="bg-green-500 h-full w-[25%]"></div></div>
           </div>
        </div>
        <div className="bg-black border border-zinc-800 p-6 rounded-xl">
           <h4 className="text-zinc-400 text-sm font-bold mb-4">SYSTEM HEALTH</h4>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-900 rounded text-center">
                 <div className="text-green-500 font-bold text-xl">OK</div>
                 <div className="text-[10px] text-zinc-500">DATABASE</div>
              </div>
              <div className="p-3 bg-zinc-900 rounded text-center">
                 <div className="text-green-500 font-bold text-xl">99.9%</div>
                 <div className="text-[10px] text-zinc-500">UPTIME</div>
              </div>
              <div className="p-3 bg-zinc-900 rounded text-center">
                 <div className="text-yellow-500 font-bold text-xl">HIGH</div>
                 <div className="text-[10px] text-zinc-500">CPU LOAD</div>
              </div>
              <div className="p-3 bg-zinc-900 rounded text-center">
                 <div className="text-blue-500 font-bold text-xl">v2.1</div>
                 <div className="text-[10px] text-zinc-500">KERNEL</div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};