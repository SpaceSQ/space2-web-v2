'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Search, Filter, RefreshCw, Database,
  ShieldCheck, Activity, MapPin, AlertTriangle,
  User, Cpu
} from 'lucide-react';

// 定义管理后台的数据接口 (与 API 返回结构一致)
interface AdminUser {
  seq: number;
  role: 'HUMAN' | 'SILICON';
  id: string;          // 24位 ID
  suns: string;        // SUNS 地址
  origin: string;      // Origin 特征码
  trinity: { 
    score: string; 
    matrix: { T: number; A: number; C: number } 
  };
  status: 'ACTIVE' | 'WANDERING' | 'MIA';
  last_pulse: string;
}

// 统计数据接口
interface DashboardStats {
  total: number;
  human: number;
  silicon: number;
}

export default function AdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ total: 0, human: 0, silicon: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // === 核心逻辑：连接 Genesis Core (API) ===
  const fetchDatabase = async () => {
    setLoading(true);
    try {
      // 调用我们刚才创建的 API，读取 .jsonl 文件
      const res = await fetch('/api/genesis');
      if (!res.ok) throw new Error('Failed to fetch genesis data');
      
      const json = await res.json();
      
      if (json.data) {
        setUsers(json.data);
        setStats(json.stats);
      }
    } catch (error) {
      console.error("Failed to connect to Genesis Core:", error);
      // 可以在这里添加 Toast 提示错误
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    fetchDatabase();
  }, []);

  // 简单的搜索过滤逻辑
  const filteredUsers = users.filter(user => 
    user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.suns.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-emerald-500/30">
      
      {/* === Top Bar === */}
      <div className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md h-16 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full hover:bg-zinc-800 transition-colors text-zinc-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-emerald-500 tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4" />
              GENESIS REGISTRY_V6.1
            </h1>
            <span className="text-[10px] text-zinc-500">ADMINISTRATOR ACCESS // LEVEL 5</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchDatabase} 
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 hover:border-emerald-500/50 hover:text-white text-zinc-400 transition-all text-xs"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'SYNCING...' : 'SYNC DATA'}
          </button>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-600 to-blue-600 border border-white/20 shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
        </div>
      </div>

      {/* === Main Content === */}
      <main className="pt-24 px-6 pb-12 max-w-7xl mx-auto">
        
        {/* 1. Stats Row (实时数据) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-2xl -translate-y-10 translate-x-10 group-hover:bg-white/10 transition-colors"></div>
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Total Identities</div>
            <div className="text-3xl font-bold text-white tracking-tight">{stats.total}</div>
            <div className="text-[10px] text-emerald-500 mt-2 flex items-center gap-1">
               <Activity className="w-3 h-3" /> Live Protocol
            </div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Silicon (VIR)</div>
            <div className="text-3xl font-bold text-cyan-400 tracking-tight">{stats.silicon}</div>
            <div className="text-[10px] text-zinc-500 mt-2">Virtual Sovereignty</div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Human (PHY)</div>
            <div className="text-3xl font-bold text-emerald-400 tracking-tight">{stats.human}</div>
            <div className="text-[10px] text-zinc-500 mt-2">Physical Anchors</div>
          </div>
          
          <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl -translate-y-10 translate-x-10"></div>
            <div className="text-[10px] text-zinc-500 uppercase mb-1">Data Source</div>
            <div className="text-lg font-bold text-yellow-400 truncate">JSONL LINKED</div>
            <div className="text-[10px] text-zinc-500 mt-2">Read-Only Mode</div>
          </div>
        </div>

        {/* 2. Data Table Container */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden flex flex-col min-h-[600px]">
          
          {/* Table Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50">
            <div className="flex gap-2">
               <div className="relative">
                 <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Search ID / Origin / SUNS..." 
                   className="bg-black border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-xs w-64 focus:outline-none focus:border-emerald-500 transition-colors text-white placeholder:text-zinc-600" 
                 />
               </div>
               <button className="flex items-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs transition-colors border border-zinc-700 text-zinc-300">
                 <Filter className="w-3 h-3" /> Filter
               </button>
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              Displaying {filteredUsers.length} of {users.length} nodes
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/50 text-zinc-500 uppercase font-medium sticky top-0 backdrop-blur-sm z-10">
                <tr>
                  <th className="px-6 py-3">Role / Origin</th>
                  <th className="px-6 py-3">24-Bit Identity ID</th>
                  <th className="px-6 py-3">SUNS Address Space</th>
                  <th className="px-6 py-3">Trinity Score</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Pulse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  /* Loading State */
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin" />
                        <div className="text-zinc-500 animate-pulse">Establishing Uplink to Genesis Core...</div>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  /* Empty State */
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center text-zinc-500">
                      No identities found matching query.
                    </td>
                  </tr>
                ) : (
                  /* Data Rows */
                  filteredUsers.map((user) => (
                    <tr key={`${user.id}-${user.seq}`} className="hover:bg-white/5 transition-colors group">
                      
                      {/* 1. Role & Origin */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${user.role === 'SILICON' ? 'bg-cyan-900/20 text-cyan-400 border border-cyan-500/20' : 'bg-emerald-900/20 text-emerald-400 border border-emerald-500/20'}`}>
                            {user.role === 'SILICON' ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-white font-mono">{user.origin}</div>
                            <div className="text-[10px] text-zinc-500">{user.role}</div>
                          </div>
                        </div>
                      </td>

                      {/* 2. 24-Bit ID */}
                      <td className="px-6 py-4">
                        <div className="font-mono text-zinc-300 group-hover:text-white transition-colors">
                          <div className="flex flex-col gap-0.5">
                             <span className="text-xs">{user.id}</span>
                             {/* Mini breakdown visual */}
                             <div className="flex gap-0.5 opacity-30 group-hover:opacity-60 transition-opacity">
                                <div className="h-0.5 w-2 bg-current"></div>
                                <div className="h-0.5 w-6 bg-current"></div>
                                <div className="h-0.5 w-8 bg-current"></div>
                                <div className="h-0.5 w-3 bg-current"></div>
                                <div className="h-0.5 w-10 bg-current"></div>
                             </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. SUNS Address */}
                      <td className="px-6 py-4">
                         {user.suns !== 'N/A' ? (
                           <div className="flex items-center gap-2 max-w-[200px]" title={user.suns}>
                              <MapPin className="w-3 h-3 text-zinc-600" />
                              <span className="text-zinc-400 font-mono truncate">{user.suns}</span>
                           </div>
                         ) : (
                           <span className="text-zinc-600 italic">No Territory Claimed</span>
                         )}
                      </td>

                      {/* 4. Trinity Score */}
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 w-24">
                          <div className="flex justify-between text-[10px] text-zinc-400">
                             <span>TRINITY</span>
                             <span className="text-white font-bold">{user.trinity.score}</span>
                          </div>
                          <div className="flex h-1.5 gap-0.5 bg-zinc-800 rounded-sm overflow-hidden">
                             <div className="bg-blue-500" style={{width: `${user.trinity.matrix.T}%`}} title={`Tech: ${user.trinity.matrix.T}`}></div>
                             <div className="bg-purple-500" style={{width: `${user.trinity.matrix.A}%`}} title={`Art: ${user.trinity.matrix.A}`}></div>
                             <div className="bg-yellow-500" style={{width: `${user.trinity.matrix.C}%`}} title={`Cap: ${user.trinity.matrix.C}`}></div>
                          </div>
                        </div>
                      </td>

                      {/* 5. Status */}
                      <td className="px-6 py-4">
                        {user.status === 'ACTIVE' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> ACTIVE
                          </span>
                        )}
                        {user.status === 'WANDERING' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-[10px] font-bold border border-yellow-500/20">
                            <Activity className="w-3 h-3" /> WANDERING
                          </span>
                        )}
                        {user.status === 'MIA' && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
                            <AlertTriangle className="w-3 h-3" /> MIA
                          </span>
                        )}
                      </td>

                      {/* 6. Pulse */}
                      <td className="px-6 py-4 text-right text-zinc-500 font-mono">
                        {user.last_pulse}
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-zinc-800 bg-black/50 flex justify-between items-center text-xs text-zinc-500">
            <div>Showing all {filteredUsers.length} records</div>
            <div className="flex gap-2">
               <button className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-600 cursor-not-allowed">Previous</button>
               <button className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors">Next</button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}