"use client";

import React from 'react';
import { 
  Shield, AlertTriangle, Lock, RefreshCw, 
  Database, FileCode, CheckCircle, XCircle 
} from 'lucide-react';

const ATTACK_LOGS = [
  { id: 1, type: 'SQL Injection', source: '192.168.1.X', time: '10:42:01', status: 'BLOCKED' },
  { id: 2, type: 'DDoS (L7)', source: 'Botnet-X', time: '10:40:55', status: 'MITIGATED' },
  { id: 3, type: 'Illegal SMP Override', source: 'User-009', time: '09:15:22', status: 'BANNED' },
];

const VULNERABILITY_SCAN = [
  { id: 1, name: 'OpenSSL Heartbleed Variant', severity: 'CRITICAL', status: 'PATCHED' },
  { id: 2, name: 'SSSU Overflow Glitch', severity: 'HIGH', status: 'PENDING' },
  { id: 3, name: 'Weak Password Policy', severity: 'LOW', status: 'IGNORED' },
];

export default function SecOpsPanel() {
  return (
    <div className="h-full flex flex-col gap-6 font-sans text-zinc-300">
      
      {/* 1. 顶部状态卡 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* 防御等级 */}
         <div className="bg-red-900/10 border border-red-900/50 p-6 rounded-xl flex items-center justify-between">
            <div>
               <div className="text-red-400 text-xs font-bold tracking-widest mb-2">DEFCON LEVEL</div>
               <div className="text-4xl font-black text-red-500">4</div>
               <div className="text-[10px] text-red-400/70 mt-1">Increased Surveillance</div>
            </div>
            <Shield size={48} className="text-red-500 opacity-20"/>
         </div>

         {/* 备份状态 */}
         <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
            <div>
               <div className="text-zinc-500 text-xs font-bold tracking-widest mb-2">LAST SNAPSHOT</div>
               <div className="text-2xl font-bold text-white">04:00 AM</div>
               <div className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
                  <CheckCircle size={10}/> Integrity Verified
               </div>
            </div>
            <Database size={48} className="text-zinc-500 opacity-20"/>
         </div>

         {/* 漏洞扫描 */}
         <div className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-xl flex items-center justify-between">
            <div>
               <div className="text-zinc-500 text-xs font-bold tracking-widest mb-2">VULNERABILITY</div>
               <div className="text-2xl font-bold text-orange-400">1 PENDING</div>
               <div className="text-[10px] text-zinc-500 mt-1">Next Auto-Scan: 2h 15m</div>
            </div>
            <AlertTriangle size={48} className="text-orange-400 opacity-20"/>
         </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* 2. 攻击日志 (WAF) */}
        <div className="bg-black border border-zinc-800 rounded-xl flex flex-col overflow-hidden">
           <div className="p-4 border-b border-zinc-800 bg-zinc-900/20 flex justify-between items-center">
              <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2"><Lock size={16}/> WAF ATTACK LOGS</h3>
              <button className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-400">EXPORT CSV</button>
           </div>
           <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {ATTACK_LOGS.map(log => (
                 <div key={log.id} className="flex justify-between items-center p-3 border border-zinc-800/50 rounded bg-zinc-900/10">
                    <div>
                       <div className="text-xs font-bold text-white">{log.type}</div>
                       <div className="text-[10px] text-zinc-500 font-mono">Src: {log.source} | {log.time}</div>
                    </div>
                    <span className="px-2 py-1 bg-green-900/20 text-green-500 text-[9px] font-bold border border-green-900/30 rounded">
                       {log.status}
                    </span>
                 </div>
              ))}
              {[...Array(5)].map((_,i) => (
                 <div key={i+10} className="flex justify-between items-center p-3 border border-zinc-800/30 rounded bg-black opacity-50">
                    <div>
                       <div className="text-xs text-zinc-600">Port Scan Probe</div>
                       <div className="text-[10px] text-zinc-700 font-mono">Src: Unknown | 03:0{i}:00</div>
                    </div>
                    <span className="text-zinc-700 text-[9px]">IGNORED</span>
                 </div>
              ))}
           </div>
        </div>

        {/* 3. 备份与系统操作 */}
        <div className="bg-black border border-zinc-800 rounded-xl flex flex-col">
           <div className="p-4 border-b border-zinc-800 bg-zinc-900/20">
              <h3 className="text-sm font-bold text-zinc-300 flex items-center gap-2"><RefreshCw size={16}/> SYSTEM RECOVERY</h3>
           </div>
           <div className="p-6 space-y-6">
              
              <div>
                 <div className="text-xs font-bold text-zinc-500 mb-3 uppercase">Time Machine (Snapshots)</div>
                 <div className="space-y-2">
                    <button className="w-full p-3 border border-zinc-700 hover:bg-zinc-900 rounded flex justify-between items-center transition-all group">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-900/20 text-blue-500 rounded"><Database size={16}/></div>
                          <div className="text-left">
                             <div className="text-xs font-bold text-white">Full Database Backup</div>
                             <div className="text-[10px] text-zinc-500">Includes User, Space & Log tables</div>
                          </div>
                       </div>
                       <span className="text-[10px] font-bold text-blue-500 group-hover:underline">CREATE NOW</span>
                    </button>

                    <button className="w-full p-3 border border-zinc-700 hover:bg-zinc-900 rounded flex justify-between items-center transition-all group">
                       <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-900/20 text-purple-500 rounded"><FileCode size={16}/></div>
                          <div className="text-left">
                             <div className="text-xs font-bold text-white">Codebase Freeze</div>
                             <div className="text-[10px] text-zinc-500">Lock current version for rollback</div>
                          </div>
                       </div>
                       <span className="text-[10px] font-bold text-purple-500 group-hover:underline">FREEZE</span>
                    </button>
                 </div>
              </div>

              <div className="pt-4 border-t border-zinc-800">
                 <div className="text-xs font-bold text-zinc-500 mb-3 uppercase">Danger Zone</div>
                 <button className="w-full py-3 bg-red-900/10 border border-red-900/50 hover:bg-red-900/30 text-red-500 rounded text-xs font-bold flex justify-center items-center gap-2">
                    <XCircle size={14}/> INITIATE EMERGENCY SHUTDOWN
                 </button>
              </div>

           </div>
        </div>

      </div>
    </div>
  );
}