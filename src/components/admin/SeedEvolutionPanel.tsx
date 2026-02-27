"use client";

import React, { useState } from 'react';
import { 
  Sprout, Globe, Shield, AlertTriangle, Download, 
  GitBranch, Lock, Unlock, Zap, FileJson 
} from 'lucide-react';

// 模拟的世界连接数据
const WORLD_NODES = [
  { id: 'w-001', name: 'Genesis Prime', suns: 'PHY-Earth-01', status: 'FRIENDLY', version: 'v1.0.2', latency: '24ms' },
  { id: 'w-002', name: 'Mars Colony Beta', suns: 'VIR-Mars-01', status: 'WARNING', version: 'v0.9.8', latency: '320ms' },
  { id: 'w-003', name: 'Dark Forest', suns: 'UNK-Deep-99', status: 'DENIED', version: 'unknown', latency: '---' },
  { id: 'w-004', name: 'Open Museum', suns: 'VIR-Pub-02', status: 'FRIENDLY', version: 'v1.0.2', latency: '45ms' },
];

// 模拟的种子版本
const SEED_VERSIONS = [
  { ver: 'v1.0.2', type: 'STABLE', downloads: 1240, hash: '0x8f...2a', active: true },
  { ver: 'v1.1.0-beta', type: 'BETA', downloads: 85, hash: '0x3c...9b', active: false },
];

export default function SeedEvolutionPanel() {
  const [activeTab, setActiveTab] = useState<'DIPLOMACY' | 'GENES'>('DIPLOMACY');

  return (
    <div className="h-full flex flex-col bg-black border border-zinc-800 rounded-xl overflow-hidden font-sans text-zinc-300">
      
      {/* 顶部 Tab 切换 */}
      <div className="flex border-b border-zinc-800">
        <button 
          onClick={() => setActiveTab('DIPLOMACY')}
          className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all ${activeTab === 'DIPLOMACY' ? 'text-blue-400 border-b-2 border-blue-400 bg-zinc-900/50' : 'text-zinc-500'}`}
        >
          <Globe size={16}/> INTER-WORLD DIPLOMACY (IWCP)
        </button>
        <button 
          onClick={() => setActiveTab('GENES')}
          className={`flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 hover:bg-zinc-900 transition-all ${activeTab === 'GENES' ? 'text-green-400 border-b-2 border-green-400 bg-zinc-900/50' : 'text-zinc-500'}`}
        >
          <Sprout size={16}/> SEED GENE EDITOR
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        
        {/* === 模块 1: 外交官 (DIPLOMACY) === */}
        {activeTab === 'DIPLOMACY' && (
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                 <h2 className="text-xl font-black text-white mb-2">THE TRINITY LIST</h2>
                 <p className="text-xs text-zinc-500 max-w-lg">
                   Managing the consensus list for the <strong>Inter-World Connection Protocol (S2-IWCP)</strong>. 
                   Nodes marked as <span className="text-red-500">DENIED</span> are physically hard-forked from the network.
                 </p>
              </div>
              <button className="px-3 py-1.5 bg-blue-900/30 border border-blue-800 text-blue-400 rounded text-[10px] font-bold hover:bg-blue-800/50">
                SYNC CONSENSUS NOW
              </button>
            </div>

            {/* 世界列表 */}
            <div className="border border-zinc-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900/50 text-zinc-500 font-mono">
                  <tr>
                    <th className="p-3">WORLD NAME / ID</th>
                    <th className="p-3">SUNS PREFIX</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">VERSION</th>
                    <th className="p-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {WORLD_NODES.map(world => (
                    <tr key={world.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-white">{world.name}</div>
                        <div className="text-[10px] text-zinc-600 font-mono">{world.id}</div>
                      </td>
                      <td className="p-3 font-mono text-zinc-400">{world.suns}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold border
                          ${world.status === 'FRIENDLY' ? 'bg-green-900/20 text-green-500 border-green-900/50' : 
                            world.status === 'WARNING' ? 'bg-orange-900/20 text-orange-500 border-orange-900/50' : 
                            'bg-red-900/20 text-red-500 border-red-900/50'}`}>
                          {world.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-zinc-500">{world.version}</td>
                      <td className="p-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400" title="View Manifest"><FileJson size={14}/></button>
                          {world.status !== 'DENIED' && <button className="p-1.5 hover:bg-red-900/30 rounded text-red-500" title="Sanction"><Lock size={14}/></button>}
                          {world.status === 'DENIED' && <button className="p-1.5 hover:bg-green-900/30 rounded text-green-500" title="Pardon"><Unlock size={14}/></button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === 模块 2: 基因编辑器 (GENES) === */}
        {activeTab === 'GENES' && (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* 物理常数编辑 */}
                <div className="bg-zinc-900/20 border border-zinc-800 p-5 rounded-xl">
                   <h3 className="text-sm font-bold text-green-400 mb-4 flex items-center gap-2">
                     <Zap size={16}/> BASE PHYSICS CONSTANTS
                   </h3>
                   <div className="space-y-4">
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-zinc-400">Time Dilation Limit</span>
                         <span className="font-mono bg-black px-2 py-1 rounded border border-zinc-800">1.0x (Fixed)</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-zinc-400">Max Gravity Sim</span>
                         <span className="font-mono bg-black px-2 py-1 rounded border border-zinc-800">100 G</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                         <span className="text-zinc-400">SMP Enforcement</span>
                         <span className="font-mono text-green-500 font-bold">STRICT</span>
                      </div>
                      <div className="mt-4 p-3 bg-orange-900/10 border border-orange-900/30 rounded text-[10px] text-orange-400">
                         ⚠️ Modifying base constants requires a genesis hard-fork. Changes will propagate to all 1,042 nodes.
                      </div>
                   </div>
                </div>

                {/* 版本分发管理 */}
                <div className="bg-zinc-900/20 border border-zinc-800 p-5 rounded-xl">
                   <h3 className="text-sm font-bold text-blue-400 mb-4 flex items-center gap-2">
                     <GitBranch size={16}/> SEED DISTRIBUTION
                   </h3>
                   <div className="space-y-3">
                      {SEED_VERSIONS.map(ver => (
                        <div key={ver.ver} className="flex items-center justify-between p-3 bg-black border border-zinc-800 rounded">
                           <div>
                              <div className="text-xs font-bold text-white flex items-center gap-2">
                                 {ver.ver} 
                                 {ver.active && <span className="px-1.5 py-0.5 bg-green-900/30 text-green-500 text-[9px] rounded">LIVE</span>}
                              </div>
                              <div className="text-[10px] text-zinc-600 font-mono mt-1">Hash: {ver.hash}</div>
                           </div>
                           <div className="text-right">
                              <div className="text-xs font-bold text-zinc-300">{ver.downloads}</div>
                              <div className="text-[9px] text-zinc-600">Installs</div>
                           </div>
                        </div>
                      ))}
                      <button className="w-full py-2 mt-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 rounded border border-zinc-700">
                         UPLOAD NEW PATCH
                      </button>
                   </div>
                </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}