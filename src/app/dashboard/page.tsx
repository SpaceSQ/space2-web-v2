"use client";
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ---------------------------------------------------------
// 1. 类型定义 (混合了真实DB字段与前端演示字段)
// ---------------------------------------------------------
interface PetAsset { 
  id: string; 
  name: string; 
  status: string;         
  created_at: string;
  // 以下字段为前端模拟，用于展示五维和位置
  stats: { energy: number; intel: number; }; 
  location: 'LIVING_ROOM' | 'BEDROOM' | 'KITCHEN'; 
}

interface RoomNode {
  id: string;
  name: string;
  type: 'LIVING' | 'BED' | 'FUNCTIONAL';
  style: string; // e.g., 'Cyberpunk', 'Zen', 'Minimalist'
  iot_count: number;
}

// ---------------------------------------------------------
// 2. 主页面组件
// ---------------------------------------------------------
export default function UserDashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // --- 状态管理 ---
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENTITIES' | 'SPATIAL' | 'BILLING'>('OVERVIEW');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<PetAsset[]>([]);
  
  // 空间管理状态
  const [isEditMode, setIsEditMode] = useState(false);
  const [rooms, setRooms] = useState<RoomNode[]>([
    { id: 'r1', name: '主指挥舱 (Living)', type: 'LIVING', style: 'Cyberpunk v1', iot_count: 4 },
    { id: 'r2', name: '休眠胶囊 (Bed)', type: 'BED', style: 'Deep Sleep', iot_count: 2 },
    { id: 'r3', name: '能源补给站 (Kitchen)', type: 'FUNCTIONAL', style: 'Industrial', iot_count: 1 },
  ]);

  // --- 初始化逻辑 ---
  useEffect(() => {
    const initData = async () => {
      // 1. 检查 Session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/'); return; }
      setUser(session.user);

      // 2. 拉取真实宠物数据
      const { data: realPets } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false });

      if (realPets) {
        // 数据清洗与补全
        const formattedPets: PetAsset[] = realPets.map((p: any) => ({
          id: p.id,
          name: p.name || 'Unnamed Unit',
          status: p.status || 'ACTIVE',
          created_at: p.created_at,
          // 随机分配位置和属性，为了演示效果
          location: ['LIVING_ROOM', 'BEDROOM', 'KITCHEN'][Math.floor(Math.random() * 3)] as any,
          stats: { 
            energy: Math.floor(Math.random() * 40) + 60, 
            intel: Math.floor(Math.random() * 40) + 60 
          }
        }));
        setPets(formattedPets);
      }
      setLoading(false);
    };

    initData();
  }, [supabase, router]);

  // --- AGI 生成逻辑模拟 ---
  const handleAGIGenerate = (roomId: string) => {
    if (!confirm('启动 AGI 空间重构协议？\n将消耗 50 NBT 算力生成新的装修方案。')) return;
    alert('✨ AGI 正在分析您的空间结构...\n生成风格: Neo-Tokyo 2077');
    // 乐观更新 UI
    setRooms(rooms.map(r => r.id === roomId ? { ...r, style: 'Neo-Tokyo 2077 (Generated)' } : r));
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-emerald-500 font-mono text-xs">LOADING SPACE OS...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col md:flex-row relative selection:bg-emerald-500/30">
      
      {/* ================= 左侧导航 (Sidebar) - 保持原版完善架构 ================= */}
      <aside className="w-full md:w-64 border-r border-white/5 bg-black/40 backdrop-blur-md flex flex-col fixed md:relative z-20 h-auto md:h-screen pt-20 md:pt-0">
         <div className="hidden md:flex p-6 border-b border-white/5 items-center gap-3">
            <div className="w-8 h-8 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center text-emerald-500 text-lg">⌘</div>
            <div>
              <div className="font-black text-xs tracking-[0.1em]">COMMANDER</div>
              <div className="text-[8px] text-zinc-500">Tier: <span className="text-white">PRO</span></div>
            </div>
         </div>
         
         <nav className="flex-1 p-4 space-y-1">
            <button onClick={() => setActiveTab('OVERVIEW')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'OVERVIEW' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
               <span>◎</span> Overview (总览)
            </button>
            <button onClick={() => setActiveTab('SPATIAL')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'SPATIAL' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
               <span>◫</span> Spatial Map (空间管理)
            </button>
            <button onClick={() => setActiveTab('ENTITIES')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'ENTITIES' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
               <span>🧬</span> Entities (硅基生命)
            </button>
            <button onClick={() => setActiveTab('BILLING')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'BILLING' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
               <span>$</span> Billing (算力)
            </button>
         </nav>
      </aside>

      {/* ================= 主内容区 ================= */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto pt-24 md:pt-10">
         
         {/* 顶部 Header */}
         <header className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
            <div>
               <h1 className="text-2xl md:text-3xl font-black text-white mb-1">
                 {activeTab === 'OVERVIEW' && 'SYSTEM OVERVIEW'}
                 {activeTab === 'SPATIAL' && 'SPATIAL TOPOLOGY'}
                 {activeTab === 'ENTITIES' && 'NEURAL MANAGEMENT'}
                 {activeTab === 'BILLING' && 'RESOURCE & BILLING'}
               </h1>
               <div className="flex gap-4 text-[10px] text-zinc-500 font-mono">
                 <span>UIN: {user?.id.slice(0, 8)}</span>
                 <span className="text-emerald-600">● ONLINE</span>
               </div>
            </div>
            {/* 修复点1：使用 Link 修复“申请新实体”无反应问题 */}
            <Link 
               href="/registry" 
               className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-bold text-[10px] hover:bg-emerald-400 transition-colors uppercase tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.3)]"
            >
               + Initialize New Entity
            </Link>
         </header>

         {/* ------------------ 1. OVERVIEW (概览) ------------------ */}
         {activeTab === 'OVERVIEW' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
             <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
               {/* 统计卡片 */}
               <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
                 <div className="text-[9px] text-zinc-500 uppercase">Total Entities</div>
                 <div className="text-2xl font-black text-white">{pets.length}</div>
               </div>
               <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
                 <div className="text-[9px] text-zinc-500 uppercase">IoT Devices</div>
                 <div className="text-2xl font-black text-blue-400">{rooms.reduce((acc, r) => acc + r.iot_count, 0)}</div>
               </div>
               <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
                 <div className="text-[9px] text-zinc-500 uppercase">NBT Compute</div>
                 <div className="text-2xl font-black text-emerald-400">8.4TB</div>
               </div>
             </div>

             {/* 快捷入口 */}
             <div className="lg:col-span-2 bg-gradient-to-r from-emerald-950/20 to-zinc-900/40 border border-emerald-500/20 p-6 rounded-xl flex items-center justify-between">
                <div>
                   <h3 className="text-lg font-bold text-white mb-1">Sector Alpha is Active</h3>
                   <p className="text-xs text-zinc-400">Your spatial operating system is running optimally.</p>
                </div>
                <button onClick={() => setActiveTab('SPATIAL')} className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded font-bold text-xs uppercase transition-colors">
                   Enter Spatial View ➔
                </button>
             </div>
           </div>
         )}

         {/* ------------------ 2. SPATIAL (空间重建 - 核心修复) ------------------ */}
         {activeTab === 'SPATIAL' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4">
             {/* 顶部操作栏 */}
             <div className="flex justify-between items-center bg-zinc-900/30 p-4 rounded-xl border border-white/5">
                <div className="flex gap-4">
                   <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Real-time Monitoring
                   </div>
                   <div className="text-xs text-zinc-500">Connected to 3 Zones</div>
                </div>
                <button 
                  onClick={() => setIsEditMode(!isEditMode)} 
                  className={`px-4 py-2 rounded text-[10px] font-bold uppercase border transition-all ${isEditMode ? 'bg-yellow-500 text-black border-yellow-500' : 'bg-transparent text-zinc-300 border-zinc-600 hover:border-white'}`}
                >
                  {isEditMode ? 'Done Editing' : 'Edit Layout / AGI Decorate'}
                </button>
             </div>

             {/* 户型图容器 (Floor Plan) */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#050505] border border-zinc-800 rounded-xl p-6 relative min-h-[400px]">
                   <h3 className="text-[10px] font-bold text-zinc-500 uppercase absolute top-4 left-4">Sector Map: Home-Alpha</h3>
                   
                   {/* CSS 绘制的户型图 */}
                   <div className="mt-8 w-full h-[320px] relative border-2 border-zinc-800/50 bg-zinc-900/10 rounded-lg overflow-hidden">
                      
                      {/* 客厅 (Living) */}
                      <div className="absolute top-0 left-0 w-[65%] h-[70%] border-r border-b border-zinc-700 bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors group">
                         <span className="absolute top-2 left-2 text-[9px] font-bold text-zinc-500">LIVING ROOM</span>
                         {isEditMode && (
                           <button onClick={() => handleAGIGenerate('r1')} className="absolute bottom-2 right-2 bg-purple-600 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              ✨ AGI Re-Design
                           </button>
                         )}
                         {/* 显示在该区域的宠物 */}
                         {pets.filter(p => p.location === 'LIVING_ROOM').map(p => (
                            <div key={p.id} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce cursor-pointer">
                               <span className="text-2xl drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">🐱</span>
                               <span className="text-[8px] bg-black/80 text-emerald-400 px-1.5 rounded mt-1">{p.name}</span>
                            </div>
                         ))}
                      </div>

                      {/* 卧室 (Bedroom) */}
                      <div className="absolute top-0 right-0 w-[35%] h-[50%] border-b border-l border-zinc-700 bg-zinc-800/20 hover:bg-zinc-800/40 transition-colors group">
                         <span className="absolute top-2 left-2 text-[9px] font-bold text-zinc-500">BEDROOM</span>
                         {isEditMode && (
                           <button onClick={() => handleAGIGenerate('r2')} className="absolute bottom-2 right-2 bg-purple-600 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              ✨ AGI
                           </button>
                         )}
                         {pets.filter(p => p.location === 'BEDROOM').map(p => (
                            <div key={p.id} className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center animate-pulse">
                               <span className="text-2xl">💤</span>
                               <span className="text-[8px] bg-black/80 text-blue-400 px-1.5 rounded mt-1">{p.name}</span>
                            </div>
                         ))}
                      </div>

                      {/* 厨房 (Kitchen) */}
                      <div className="absolute bottom-0 right-0 w-[35%] h-[50%] border-l border-zinc-700 bg-zinc-800/10 hover:bg-zinc-800/40 transition-colors group">
                         <span className="absolute top-2 left-2 text-[9px] font-bold text-zinc-500">KITCHEN</span>
                         {isEditMode && (
                           <button onClick={() => handleAGIGenerate('r3')} className="absolute bottom-2 right-2 bg-purple-600 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              ✨ AGI
                           </button>
                         )}
                      </div>

                      {/* 花园 (Garden) */}
                      <div className="absolute bottom-0 left-0 w-[65%] h-[30%] border-t border-zinc-700 bg-green-900/10">
                         <span className="absolute top-2 left-2 text-[9px] font-bold text-green-700">GARDEN (OUTSIDE)</span>
                      </div>
                   </div>
                </div>

                {/* 右侧：空间属性面板 */}
                <div className="space-y-4">
                   {rooms.map(room => (
                      <div key={room.id} className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl flex justify-between items-center">
                         <div>
                            <div className="text-xs font-bold text-white">{room.name}</div>
                            <div className="text-[9px] text-zinc-500">Style: <span className="text-purple-400">{room.style}</span></div>
                         </div>
                         <div className="text-right">
                            <div className="text-[9px] text-zinc-500">IoT Devices</div>
                            <div className="text-lg font-mono text-white">{room.iot_count}</div>
                         </div>
                      </div>
                   ))}
                   <button className="w-full py-3 border border-dashed border-zinc-700 text-zinc-500 text-[10px] font-bold uppercase rounded-xl hover:bg-zinc-900 hover:text-white transition-colors">
                      + Connect New Room
                   </button>
                </div>
             </div>
           </div>
         )}

         {/* ------------------ 3. ENTITIES (硅基生命管理 - 修复链接) ------------------ */}
         {activeTab === 'ENTITIES' && (
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in slide-in-from-right-4">
             {pets.length === 0 ? (
               <div className="col-span-2 text-center p-12 border border-dashed border-zinc-800 rounded-xl">
                 <p className="text-zinc-500 mb-4">No entities found.</p>
                 <Link href="/registry" className="text-emerald-500 font-bold underline">MINT NOW ↗</Link>
               </div>
             ) : (
               pets.map(pet => (
                 <div key={pet.id} className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-colors"></div>
                    
                    {/* 信息区 */}
                    <div className="flex-1">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-black text-white">{pet.name}</h3>
                          <span className="px-1.5 py-0.5 text-[8px] rounded border border-emerald-600 text-emerald-500">{pet.status}</span>
                       </div>
                       <div className="text-[9px] text-zinc-500 font-mono mb-4">ID: {pet.id}</div>
                       
                       <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] text-zinc-500 w-8">ENERGY</span>
                             <div className="flex-1 h-1 bg-zinc-800 rounded-full"><div className="h-full bg-emerald-500" style={{width: `${pet.stats.energy}%`}}></div></div>
                          </div>
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] text-zinc-500 w-8">INTEL</span>
                             <div className="flex-1 h-1 bg-zinc-800 rounded-full"><div className="h-full bg-blue-500" style={{width: `${pet.stats.intel}%`}}></div></div>
                          </div>
                       </div>

                       {/* 修复点2：操作按钮链接到 /pet-profile */}
                       <div className="flex gap-2">
                          <Link 
                             href={`/pet-profile?id=${pet.id}`} 
                             className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[9px] font-bold py-2 rounded text-center uppercase transition-colors"
                          >
                             ⚙️ Manage Profile
                          </Link>
                          <Link 
                             href={`/square?entity=${pet.id}`} 
                             className="flex-1 bg-emerald-900/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/30 text-[9px] font-bold py-2 rounded text-center uppercase transition-colors"
                          >
                             🚀 Go Square
                          </Link>
                       </div>
                    </div>
                 </div>
               ))
             )}
           </div>
         )}

         {/* ------------------ 4. BILLING (保留原版) ------------------ */}
         {activeTab === 'BILLING' && (
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-8 rounded-xl animate-in fade-in">
               <h2 className="text-xl font-bold mb-6">Compute & Storage Billing</h2>
               <div className="text-[10px] text-zinc-500 uppercase">Current Balance (NBT)</div>
               <div className="text-4xl font-black text-white mb-8">$420.69 <span className="text-sm font-normal text-zinc-500">USD</span></div>
               <div className="flex gap-4">
                  <button className="flex-1 bg-zinc-800 hover:bg-white hover:text-black text-white py-3 rounded font-bold text-xs uppercase transition-colors">Top Up</button>
               </div>
            </div>
         )}

      </main>
    </div>
  );
}
