"use client";
import React, { useState, useEffect } from 'react';
import { GlobalNav } from '@/components/GlobalNav';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ---------------------------------------------------------
// 1. 类型定义 (保持原有的丰富定义，并兼容 Supabase)
// ---------------------------------------------------------
interface PetAsset { 
  id: string; 
  name: string; 
  category: string; // 数据库暂时没这个字段，我们需要映射或给默认值
  status: string; 
  energy: number;   // 模拟字段
  intel: number;    // 模拟字段
}

interface AgentLog { time: string; agent: string; action: string; }
interface PayloadMessage { id: string; fromUIN: string; content: string; time: string; isRead: boolean; }

export default function UserDashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // ---------------------------------------------------------
  // 2. 状态管理 (保留你的 Tab 切换逻辑)
  // ---------------------------------------------------------
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENTITIES' | 'A2A_HUB' | 'COMMS' | 'BILLING'>('OVERVIEW');
  const [userTier, setUserTier] = useState<'FREE' | 'PRO'>('PRO');
  const [paymentType, setPaymentType] = useState<'CARD' | 'ALIPAY'>('CARD');
  
  // 新增：真实用户与加载状态
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------------------
  // 3. 核心数据 (混合模式：真实宠物 + 模拟日志)
  // ---------------------------------------------------------
  const [pets, setPets] = useState<PetAsset[]>([]); // 初始为空，等待加载
  
  // 这些暂时保持 Mock，因为后端还没有对应的表
  const [agentLogs] = useState<AgentLog[]>([
    { time: '10:42 AM', agent: 'OpenClaw-V4', action: '执行了 [环境感知] 任务，消耗 0.002 NBT' },
    { time: '09:15 AM', agent: 'AutoGPT-Trainer', action: '上传了 [多巴胺训练] 日志' },
    { time: 'Yesterday', agent: 'System', action: '月度账单已生成' },
  ]);

  const [messages] = useState<PayloadMessage[]>([
    { id: 'm1', fromUIN: 'Sys_Admin', content: '欢迎接入 Space² 网络。您的节点已激活。', time: '2026-02-27', isRead: false },
  ]);

  // ---------------------------------------------------------
  // 4. useEffect: 连接真实数据库
  // ---------------------------------------------------------
  useEffect(() => {
    const initData = async () => {
      // A. 检查登录
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/');
        return;
      }
      setUser(session.user);

      // B. 拉取真实宠物数据
      const { data: realPets, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false });

      if (realPets && realPets.length > 0) {
        // C. 数据清洗：把数据库的原始数据映射为 UI 需要的格式
        const formattedPets: PetAsset[] = realPets.map((p: any) => ({
          id: p.id,
          name: p.name,
          // 如果数据库没存 category，根据 DNA hash 伪造一个，或者默认为 'Silicon Life'
          category: 'Silicon Entity', 
          status: p.status || 'ACTIVE',
          // 暂时随机生成五维数据，让 UI 看起来不空
          energy: Math.floor(Math.random() * 40) + 60, 
          intel: Math.floor(Math.random() * 40) + 60
        }));
        setPets(formattedPets);
      } else {
        setPets([]); // 空状态
      }
      setLoading(false);
    };

    initData();
  }, [supabase, router]);

  // ---------------------------------------------------------
  // 5. 渲染逻辑 (UI)
  // ---------------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center">
           <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
           <div className="text-xs text-emerald-500 tracking-widest">LOADING NEURAL INTERFACE...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col md:flex-row relative selection:bg-emerald-500/30">
      
      {/* 侧边栏 (Sidebar) - 保持原样 */}
      <aside className="w-full md:w-64 border-r border-white/5 bg-black/40 backdrop-blur-md flex flex-col fixed md:relative z-20 h-auto md:h-screen">
         <div className="p-6 border-b border-white/5 flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded-sm animate-pulse"></div>
            <span className="font-black text-sm tracking-[0.2em]">DASHBOARD</span>
         </div>
         
         <nav className="flex-1 p-4 space-y-1">
            <button onClick={() => setActiveTab('OVERVIEW')} className={`w-full text-left px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'OVERVIEW' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
               Overview (总览)
            </button>
            <button onClick={() => setActiveTab('ENTITIES')} className={`w-full text-left px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'ENTITIES' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
               My Entities (实体管理)
            </button>
            <button onClick={() => setActiveTab('A2A_HUB')} className={`w-full text-left px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'A2A_HUB' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
               A2A Hub (托管中心)
            </button>
            <button onClick={() => setActiveTab('COMMS')} className={`w-full text-left px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'COMMS' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
               Comms (通讯) {messages.some(m => !m.isRead) && <span className="ml-2 text-emerald-500">●</span>}
            </button>
            <button onClick={() => setActiveTab('BILLING')} className={`w-full text-left px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'BILLING' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
               Billing (账单)
            </button>
         </nav>

         <div className="p-4 border-t border-white/5">
            <div className="bg-zinc-900/50 p-3 rounded border border-zinc-800">
               <div className="text-[9px] text-zinc-500 uppercase mb-1">Current Plan</div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-white">PRO TIER</span>
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
               </div>
            </div>
         </div>
      </aside>

      {/* 主内容区 - pt-20防止被顶部GlobalNav遮挡 */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto pt-24 md:pt-12">
         
         {/* 1. OVERVIEW TAB */}
         {activeTab === 'OVERVIEW' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <header className="flex justify-between items-end border-b border-white/10 pb-6">
                  <div>
                     <h1 className="text-3xl font-black text-white mb-2">COMMAND CENTER</h1>
                     <p className="text-xs text-zinc-500">Welcome back, Commander {user?.email?.split('@')[0]}</p>
                  </div>
                  <div className="text-right">
                     <div className="text-[10px] text-zinc-500 uppercase">Network Status</div>
                     <div className="text-emerald-500 font-bold animate-pulse">● STABLE (24ms)</div>
                  </div>
               </header>

               {/* 关键数据卡片 */}
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl">
                     <div className="text-[9px] text-zinc-500 uppercase mb-2">Active Entities</div>
                     <div className="text-2xl font-black text-white">{pets.length}</div>
                  </div>
                  <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl">
                     <div className="text-[9px] text-zinc-500 uppercase mb-2">NBT Computing Power</div>
                     <div className="text-2xl font-black text-emerald-400">8,420 <span className="text-[10px] text-zinc-600">/ 10k</span></div>
                  </div>
                  <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl">
                     <div className="text-[9px] text-zinc-500 uppercase mb-2">Pending Alerts</div>
                     <div className="text-2xl font-black text-yellow-500">3</div>
                  </div>
               </div>

               {/* 最近日志 */}
               <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-6">
                  <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4">Live Agent Logs</h3>
                  <div className="space-y-3">
                     {agentLogs.map((log, i) => (
                        <div key={i} className="flex gap-4 text-[10px] border-b border-white/5 pb-2 last:border-0">
                           <span className="text-zinc-600 font-mono w-16">{log.time}</span>
                           <span className="text-emerald-500 font-bold w-24">{log.agent}</span>
                           <span className="text-zinc-400">{log.action}</span>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         )}

         {/* 2. ENTITIES TAB (核心修复区：加入真实数据和Link) */}
         {activeTab === 'ENTITIES' && (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
               <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">My Silicon Entities</h2>
                  {/* 修复：使用 Link 跳转到注册局 */}
                  <Link 
                     href="/registry" 
                     className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold px-4 py-2 rounded uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                     <span>+ Mint New</span>
                  </Link>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {pets.map((pet) => (
                     <div key={pet.id} className="group bg-zinc-900/40 border border-white/5 hover:border-emerald-500/50 p-5 rounded-xl transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-black border border-zinc-800 rounded flex items-center justify-center text-xl">🐱</div>
                              <div>
                                 <div className="font-bold text-sm text-white group-hover:text-emerald-400 transition-colors">{pet.name}</div>
                                 <div className="text-[9px] text-zinc-500 font-mono">{pet.id}</div>
                              </div>
                           </div>
                           <div className="px-2 py-1 bg-emerald-900/20 text-emerald-500 text-[8px] font-bold rounded border border-emerald-900/50">{pet.status}</div>
                        </div>
                        
                        {/* 模拟的五维数据条 */}
                        <div className="space-y-2 mb-4">
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] text-zinc-500 w-8">ENERGY</span>
                              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: `${pet.energy}%`}}></div></div>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="text-[8px] text-zinc-500 w-8">INTEL</span>
                              <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden"><div className="h-full bg-purple-500" style={{width: `${pet.intel}%`}}></div></div>
                           </div>
                        </div>

                        {/* 修复：新增战术操作按钮 */}
                        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/5">
                           <Link 
                              href={`/square?entity=${pet.id}`} 
                              className="flex items-center justify-center gap-2 bg-emerald-900/20 hover:bg-emerald-600 text-emerald-400 hover:text-white py-2 rounded text-[9px] font-bold uppercase transition-colors"
                           >
                              <span>🚀 Go Square</span>
                           </Link>
                           <Link 
                              href={`/pet-profile?id=${pet.id}`} 
                              className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white py-2 rounded text-[9px] font-bold uppercase transition-colors"
                           >
                              <span>⚙️ Manage</span>
                           </Link>
                        </div>
                     </div>
                  ))}

                  {/* 这是一个常驻的“添加”卡片 (防止列表为空时太丑) */}
                  <Link 
                     href="/registry" 
                     className="border border-dashed border-zinc-800 hover:border-zinc-600 rounded-xl p-5 flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer min-h-[180px]"
                  >
                     <div className="text-2xl">+</div>
                     <div className="text-[10px] font-bold uppercase">Initialize New Entity</div>
                  </Link>
               </div>
            </div>
         )}

         {/* 3. BILLING TAB (完全保留原代码) */}
         {activeTab === 'BILLING' && (
            <div className="space-y-6 animate-in fade-in">
               <h2 className="text-xl font-bold">Billing & Resources</h2>
               <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-6 rounded-xl">
                  <div className="flex justify-between items-start mb-6">
                     <div>
                        <div className="text-[10px] text-zinc-500 uppercase">Current Balance</div>
                        <div className="text-3xl font-black text-white">$420.69 <span className="text-xs font-normal text-zinc-500">USD</span></div>
                     </div>
                     <button className="bg-white text-black hover:bg-emerald-400 px-4 py-2 rounded text-[10px] font-bold uppercase">Top Up</button>
                  </div>
                  
                  {/* Payment Method Switcher (保留状态切换逻辑) */}
                  <div className="flex gap-4 mb-6">
                     <button onClick={() => setPaymentType('CARD')} className={`flex-1 p-3 rounded border ${paymentType === 'CARD' ? 'border-emerald-500 bg-emerald-900/10' : 'border-zinc-800 bg-zinc-900/50'} flex items-center gap-3 transition-all`}>
                        <div className="w-4 h-4 rounded-full border border-zinc-500 flex items-center justify-center">{paymentType === 'CARD' && <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>}</div>
                        <span className="text-[10px] font-bold">Credit Card (**** 4242)</span>
                     </button>
                     <button onClick={() => setPaymentType('ALIPAY')} className={`flex-1 p-3 rounded border ${paymentType === 'ALIPAY' ? 'border-blue-500 bg-blue-900/10' : 'border-zinc-800 bg-zinc-900/50'} flex items-center gap-3 transition-all`}>
                        <div className="w-4 h-4 rounded-full border border-zinc-500 flex items-center justify-center">{paymentType === 'ALIPAY' && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}</div>
                        <span className="text-[10px] font-bold">Alipay / WeChat</span>
                     </button>
                  </div>

                  <div className="space-y-2">
                     <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <div><div className="text-[10px] text-zinc-300">Space Subscription (Pro)</div><div className="text-[8px] text-zinc-500 font-mono">2026-02-01</div></div>
                        <div className="text-xs font-mono text-emerald-400">-$9.90</div>
                     </div>
                     <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                        <div><div className="text-[10px] text-zinc-300">A2A Token Overage (超额扣费)</div><div className="text-[8px] text-zinc-500 font-mono">2026-02-15</div></div>
                        <div className="text-xs font-mono text-emerald-400">-$1.50</div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* 4. A2A HUB & COMMS (Placeholder to keep tabs working) */}
         {(activeTab === 'A2A_HUB' || activeTab === 'COMMS') && (
            <div className="flex flex-col items-center justify-center h-64 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
               <div className="text-2xl mb-2">🚧</div>
               <div className="text-xs font-bold text-zinc-500 uppercase">Module Under Construction</div>
               <div className="text-[9px] text-zinc-600">Connecting to Neural Net...</div>
            </div>
         )}

      </main>
    </div>
  );
}
