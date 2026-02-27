'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Server, Shield, Terminal, Users, Globe, Database, AlertCircle, CheckCircle } from 'lucide-react';

// 模拟的节点数据
const MOCK_NODES = [
  { id: 'N-001', name: 'Alpha Prime', type: 'Core', status: 'active', load: 45, region: 'us-east' },
  { id: 'N-002', name: 'Sovereign Edge', type: 'Relay', status: 'active', load: 12, region: 'eu-central' },
  { id: 'N-003', name: 'Deep Archive', type: 'Storage', status: 'syncing', load: 89, region: 'asia-ne' },
  { id: 'N-004', name: 'Ghost Node', type: 'Unknown', status: 'offline', load: 0, region: 'unknown' },
];

export default function GenesisControlCenter() {
  const [activeTab, setActiveTab] = useState('overview');
  const [logs, setLogs] = useState<string[]>([]);

  // 模拟产生实时日志
  useEffect(() => {
    const interval = setInterval(() => {
      const actions = ['SYNC_PACKET', 'CHECK_INTEGRITY', 'NODE_PING', 'USER_AUTH', 'BLOCK_VALIDATION'];
      const newLog = `[${new Date().toISOString().split('T')[1].split('.')[0]}] SYSTEM: ${actions[Math.floor(Math.random() * actions.length)]} :: OK`;
      setLogs(prev => [newLog, ...prev].slice(0, 8)); // 只保留最新8条
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 顶部状态栏 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">System Status</p>
            <p className="text-xl font-bold text-slate-900">OPERATIONAL</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Active Citizens</p>
            <p className="text-xl font-bold text-slate-900">1,248</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Block Height</p>
            <p className="text-xl font-bold text-slate-900">#892,104</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500">Network Load</p>
            <p className="text-xl font-bold text-slate-900">34%</p>
          </div>
        </div>
      </div>

      {/* 主控制区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 左侧：节点列表 */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-indigo-500" /> Node Topology
            </h3>
            <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">LIVE</span>
          </div>
          <div className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Node ID</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Load</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {MOCK_NODES.map(node => (
                  <tr key={node.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-700">{node.id}</td>
                    <td className="px-6 py-4 text-slate-600">{node.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        node.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                        node.status === 'syncing' ? 'bg-blue-100 text-blue-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                           node.status === 'active' ? 'bg-emerald-500' :
                           node.status === 'syncing' ? 'bg-blue-500' : 'bg-slate-500'
                        }`}></span>
                        {node.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${node.load > 80 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                          style={{ width: `${node.load}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 右侧：终端日志 */}
        <div className="bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-sm font-mono text-zinc-400 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> KERNEL_LOG
            </h3>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/50"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
          </div>
          <div className="flex-1 p-4 font-mono text-xs space-y-2 overflow-y-auto min-h-[300px]">
            {logs.map((log, i) => (
              <div key={i} className="text-green-500/90 animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="opacity-50 mr-2">&gt;</span>{log}
              </div>
            ))}
            <div className="animate-pulse text-green-500">_</div>
          </div>
        </div>

      </div>
    </div>
  );
}