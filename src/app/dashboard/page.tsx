"use client";
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// ---------------------------------------------------------
// 1. 深度类型定义 (基于白皮书还原)
// ---------------------------------------------------------

// 五维性格矩阵 (The Big Five)
interface NeuroStats {
  energy: number;   // 活力 (E)
  bravery: number;  // 胆量 (B)
  appetite: number; // 食欲 (A)
  intel: number;    // 智力 (I)
  affection: number;// 粘人 (Af)
}

// 空间六要素 (The 6 Physical Elements)
interface SpaceElements {
  temp: number;     // 温度 (°C)
  light: number;    // 光照 (Lux)
  sound: number;    // 声噪 (dB)
  humidity: number; // 湿度 (%)
  air: string;      // 空气 (Quality)
  matter: number;   // 物体 (Count)
}

interface PetAsset { 
  id: string; 
  name: string; 
  status: string;         
  created_at: string;
  stats: NeuroStats;
  location: 'LIVING_ROOM' | 'BEDROOM' | 'KITCHEN' | 'GARDEN';
  // 意识流缓存 (Consciousness Buffer)
  thoughts: string[]; 
}

// ---------------------------------------------------------
// 2. 组件：Space² 专用雷达图 (SVG)
// ---------------------------------------------------------
const NeuroRadar = ({ stats }: { stats: NeuroStats }) => {
  const size = 120;
  const center = size / 2;
  const radius = size / 2 - 10;
  // 维度映射
  const keys: (keyof NeuroStats)[] = ['energy', 'bravery', 'appetite', 'intel', 'affection'];
  const values = keys.map(k => stats[k]);
  
  const getPoint = (val: number, i: number, total: number) => {
    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
    const r = (val / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  };

  const polyPoints = values.map((v, i) => getPoint(v, i, 5)).join(' ');
  const bgLevels = [100, 75, 50, 25].map(l => values.map((_, i) => getPoint(l, i, 5)).join(' '));

  return (
    <div className="relative w-32 h-32">
      <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* 背景层级网格 */}
        {bgLevels.map((pts, i) => (
          <polygon key={i} points={pts} fill="none" stroke="#27272a" strokeWidth="1" />
        ))}
        {/* 轴线 */}
        {keys.map((_, i) => {
          const end = getPoint(100, i, 5);
          return <line key={i} x1={center} y1={center} x2={end.split(',')[0]} y2={end.split(',')[1]} stroke="#27272a" strokeWidth="1" />;
        })}
        {/* 数据层 */}
        <polygon points={polyPoints} fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="2" />
        {/* 顶点 */}
        {values.map((v, i) => {
          const [x, y] = getPoint(v, i, 5).split(',');
          return <circle key={i} cx={x} cy={y} r="2" fill="#10b981" />;
        })}
      </svg>
      {/* 标签 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 text-[8px] text-zinc-500 font-mono">NRG</div>
      <div className="absolute top-[35%] right-[-8px] text-[8px] text-zinc-500 font-mono">BRV</div>
      <div className="absolute bottom-[5%] right-0 text-[8px] text-zinc-500 font-mono">APT</div>
      <div className="absolute bottom-[5%] left-0 text-[8px] text-zinc-500 font-mono">INT</div>
      <div className="absolute top-[35%] left-[-8px] text-[8px] text-zinc-500 font-mono">AFF</div>
    </div>
  );
};

// ---------------------------------------------------------
// 3. 主控制台逻辑
// ---------------------------------------------------------
export default function UserDashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  // 状态管理
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENTITIES' | 'SPATIAL' | 'BILLING'>('OVERVIEW');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [pets, setPets] = useState<PetAsset[]>([]);
  
  // 模拟环境数据 (IoT 传感器)
  const [envData, setEnvData] = useState<SpaceElements>({
    temp: 24.5, light: 450, sound: 35, humidity: 42, air: 'Excellent', matter: 12
  });

  // 模拟时间周期 (Neuro Cycle)
  const [cycle] = useState({
    day: 142, // 运行天数
    phase: 'Evening / Dopamine Audit', // 当前阶段：晚间多巴胺结算
    weekStr: 'Week 21'
  });

  // 初始化
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push('/'); return; }
      setUser(session.user);

      const { data: realPets } = await supabase.from('pets').select('*').eq('owner_id', session.user.id);
      
      if (realPets) {
        setPets(realPets.map((p: any) => ({
          id: p.id,
          name: p.name || 'Unknown',
          status: p.status || 'ACTIVE',
          created_at: p.created_at,
          location: 'LIVING_ROOM', // 默认位置
          stats: { // 模拟五维
            energy: 70 + Math.random() * 20,
            bravery: 50 + Math.random() * 30,
            appetite: 60,
            intel: 85,
            affection: 40
          },
          thoughts: [ // 意识流缓存
            '检测到环境光线变暗，准备进入休眠模式...',
            '刚刚OpenClaw接管了我的逻辑，学习了“坐下”指令。'
          ]
        })));
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-emerald-500 font-mono text-xs">SYNCING NEURAL NET...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col md:flex-row relative selection:bg-emerald-500/30">
      
      {/* === 左侧指挥导航 (Sidebar) === */}
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
               <span>◫</span> Spatial Map (空间)
            </button>
            <button onClick={() => setActiveTab('ENTITIES')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'ENTITIES' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
               <span>🧬</span> Entities (生命)
            </button>
            <button onClick={() => setActiveTab('BILLING')} className={`w-full flex items-center gap-3 px-4 py-3 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'BILLING' ? 'bg-zinc-800 text-white border-l-2 border-emerald-500' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}>
               <span>$</span> Billing (算力)
            </button>
         </nav>

         {/* 周期指示器 (Cycle Indicator) */}
         <div className="p-4 border-t border-white/5">
            <div className="bg-emerald-900/10 border border-emerald-500/20 p-3 rounded">
               <div className="flex justify-between text-[9px] text-emerald-500 font-bold mb-1">
                 <span>DAY {cycle.day}</span>
                 <span>{cycle.weekStr}</span>
               </div>
               <div className="text-[8px] text-zinc-500 mb-2">{cycle.phase}</div>
               <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                 <div className="w-[75%] h-full bg-emerald-500"></div>
               </div>
            </div>
         </div>
      </aside>

      {/* === 主显示区 === */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto pt-24 md:pt-10">
         
         {/* --- 顶部通栏 --- */}
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
                 <span className="text-emerald-600">● NET_LINK_ESTABLISHED</span>
               </div>
            </div>
            <Link href="/registry" className="hidden sm:flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-bold text-[10px] hover:bg-emerald-400 transition-colors uppercase tracking-widest">
               + Create New Space
            </Link>
         </header>

         {/* ================= 1. OVERVIEW: 全局态势 ================= */}
         {activeTab === 'OVERVIEW' && (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
             
             {/* 核心指标 */}
             <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
                 <div className="text-[9px] text-zinc-500 uppercase">Entities</div>
                 <div className="text-2xl font-black text-white">{pets.length}</div>
               </div>
               <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
                 <div className="text-[9px] text-zinc-500 uppercase">Active Agents</div>
                 <div className="text-2xl font-black text-emerald-400">2</div>
               </div>
               <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
                 <div className="text-[9px] text-zinc-500 uppercase">Avg. Intel</div>
                 <div className="text-2xl font-black text-blue-400">85.4</div>
               </div>
               <div className="bg-zinc-900/40 border border-zinc-800 p-4 rounded-xl">
                 <div className="text-[9px] text-zinc-500 uppercase">Alerts</div>
                 <div className="text-2xl font-black text-yellow-500">0</div>
               </div>
             </div>

             {/* 环境监控 (6 Elements) */}
             <div className="lg:col-span-2 bg-zinc-900/30 border border-white/5 rounded-xl p-6">
                <h3 className="text-xs font-bold text-zinc-300 uppercase mb-4 flex items-center gap-2">
                  <span>Environment Sensors</span>
                  <span className="px-1.5 py-0.5 bg-zinc-800 text-zinc-500 text-[8px] rounded">Live</span>
                </h3>
                <div className="grid grid-cols-3 gap-y-6 gap-x-4">
                  {/* Temp */}
                  <div>
                    <div className="text-[9px] text-zinc-500 mb-1">TEMPERATURE</div>
                    <div className="text-xl font-mono text-white">{envData.temp}°C</div>
                    <div className="w-full bg-zinc-800 h-1 mt-2 rounded"><div style={{width: '60%'}} className="h-full bg-orange-500"></div></div>
                  </div>
                  {/* Light */}
                  <div>
                    <div className="text-[9px] text-zinc-500 mb-1">LIGHT (Lux)</div>
                    <div className="text-xl font-mono text-white">{envData.light}</div>
                    <div className="w-full bg-zinc-800 h-1 mt-2 rounded"><div style={{width: '80%'}} className="h-full bg-yellow-400"></div></div>
                  </div>
                  {/* Sound */}
                  <div>
                    <div className="text-[9px] text-zinc-500 mb-1">SOUND (dB)</div>
                    <div className="text-xl font-mono text-white">{envData.sound}</div>
                    <div className="w-full bg-zinc-800 h-1 mt-2 rounded"><div style={{width: '30%'}} className="h-full bg-emerald-500"></div></div>
                  </div>
                   {/* Humidity */}
                   <div>
                    <div className="text-[9px] text-zinc-500 mb-1">HUMIDITY</div>
                    <div className="text-xl font-mono text-white">{envData.humidity}%</div>
                    <div className="w-full bg-zinc-800 h-1 mt-2 rounded"><div style={{width: '42%'}} className="h-full bg-blue-500"></div></div>
                  </div>
                   {/* Air */}
                   <div>
                    <div className="text-[9px] text-zinc-500 mb-1">AIR QUALITY</div>
                    <div className="text-xl font-mono text-emerald-400">{envData.air}</div>
                  </div>
                </div>
             </div>

             {/* 意识流预览 */}
             <div className="bg-zinc-900/30 border border-white/5 rounded-xl p-6">
               <h3 className="text-xs font-bold text-zinc-300 uppercase mb-4">Consciousness Stream</h3>
               <div className="space-y-4">
                 {pets.slice(0,2).map(p => (
                   <div key={p.id} className="border-l-2 border-emerald-500 pl-3">
                     <div className="text-[9px] text-emerald-500 font-bold mb-1">{p.name}</div>
                     <div className="text-[10px] text-zinc-400 italic">"{p.thoughts[0]}"</div>
                   </div>
                 ))}
               </div>
             </div>

           </div>
         )}

         {/* ================= 2. SPATIAL: 空间平面图与管理 ================= */}
         {activeTab === 'SPATIAL' && (
           <div className="space-y-6 animate-in slide-in-from-bottom-4">
             {/* 户型图容器 */}
             <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 relative min-h-[400px]">
                <div className="absolute top-4 left-4 z-10">
                   <h3 className="text-sm font-bold text-white uppercase">Sector: Living Quarters</h3>
                   <p className="text-[10px] text-zinc-500">SUNS Address: S2-CN-HOME-001</p>
                </div>
                
                {/* 模拟 CSS 户型图 */}
                <div className="w-full h-[320px] mt-8 relative border-2 border-zinc-800 bg-zinc-900/20 rounded">
                   {/* 客厅区域 */}
                   <div className="absolute top-0 left-0 w-[60%] h-[100%] border-r border-zinc-700 p-2">
                      <span className="text-[10px] text-zinc-600 font-bold">LIVING ROOM</span>
                      {/* 宠物 Avatar */}
                      {pets.filter(p => p.location === 'LIVING_ROOM').map(p => (
                        <div key={p.id} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce cursor-pointer group">
                           <span className="text-2xl drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">🐱</span>
                           <span className="text-[8px] bg-black text-emerald-400 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">{p.name}</span>
                        </div>
                      ))}
                   </div>

                   {/* 卧室区域 */}
                   <div className="absolute top-0 right-0 w-[40%] h-[60%] border-b border-zinc-700 p-2">
                      <span className="text-[10px] text-zinc-600 font-bold">BEDROOM</span>
                       {pets.filter(p => p.location === 'BEDROOM').map(p => (
                        <div key={p.id} className="absolute top-1/2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                           <span className="text-2xl">🐱</span>
                        </div>
                      ))}
                   </div>

                   {/* 厨房 */}
                   <div className="absolute bottom-0 right-0 w-[40%] h-[40%] p-2 bg-zinc-800/20">
                      <span className="text-[10px] text-zinc-600 font-bold">KITCHEN</span>
                   </div>
                </div>

                {/* 操作栏 */}
                <div className="mt-4 flex gap-2 justify-end">
                   <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">Edit Layout</button>
                   <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-[10px] font-bold uppercase">+ Add IoT Device</button>
                </div>
             </div>
           </div>
         )}

         {/* ================= 3. ENTITIES: 神经元管理 ================= */}
         {activeTab === 'ENTITIES' && (
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 animate-in slide-in-from-right-4">
             {pets.length === 0 ? (
               <div className="col-span-2 text-center p-12 border border-dashed border-zinc-800 rounded-xl">
                 <p className="text-zinc-500 mb-4">No entities found.</p>
                 <Link href="/registry" className="text-emerald-500 font-bold underline">MINT NOW</Link>
               </div>
             ) : (
               pets.map(pet => (
                 <div key={pet.id} className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 flex gap-6">
                    {/* 左侧：五维雷达图 */}
                    <div className="flex-shrink-0 flex flex-col items-center">
                       <NeuroRadar stats={pet.stats} />
                       <div className="mt-2 text-[9px] text-zinc-500 font-mono text-center">NEURO-MATRIX</div>
                    </div>

                    {/* 右侧：详细信息 */}
                    <div className="flex-1 flex flex-col">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-black text-white">{pet.name}</h3>
                          <span className={`px-1.5 py-0.5 text-[8px] rounded border ${pet.status === 'INCUBATING' ? 'border-yellow-600 text-yellow-500' : 'border-emerald-600 text-emerald-500'}`}>{pet.status}</span>
                       </div>
                       
                       <div className="text-[9px] text-zinc-500 font-mono mb-4">
                          LOC: <span className="text-white">{pet.location}</span> | AGE: {cycle.day} Days
                       </div>

                       {/* 意识流 */}
                       <div className="bg-black/40 p-2 rounded border border-white/5 mb-4 h-16 overflow-y-auto">
                          <p className="text-[9px] text-zinc-400 italic">"{pet.thoughts[0]}"</p>
                       </div>

                       {/* 按钮组 */}
                       <div className="mt-auto grid grid-cols-2 gap-2">
                          <Link href={`/square?entity=${pet.id}`} className="bg-emerald-900/20 hover:bg-emerald-600 text-emerald-500 hover:text-white border border-emerald-500/30 text-[9px] font-bold py-2 rounded text-center transition-colors">
                             GO PLAZA
                          </Link>
                          <Link href={`/pet-profile?id=${pet.id}`} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-[9px] font-bold py-2 rounded text-center transition-colors">
                             MANAGE
                          </Link>
                       </div>
                    </div>
                 </div>
               ))
             )}
           </div>
         )}

         {/* ================= 4. BILLING: 算力计费 ================= */}
         {activeTab === 'BILLING' && (
            <div className="bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 p-8 rounded-xl animate-in fade-in">
               <h2 className="text-xl font-bold mb-6">Compute & Storage Billing</h2>
               <div className="text-[10px] text-zinc-500 uppercase">Current Balance (NBT)</div>
               <div className="text-4xl font-black text-white mb-8">$420.69 <span className="text-sm font-normal text-zinc-500">USD</span></div>
               
               <div className="flex gap-4">
                  <button className="flex-1 bg-zinc-800 hover:bg-white hover:text-black text-white py-3 rounded font-bold text-xs uppercase transition-colors">Top Up Credit</button>
                  <button className="flex-1 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white py-3 rounded font-bold text-xs uppercase transition-colors">View Invoices</button>
               </div>
            </div>
         )}

      </main>
    </div>
  );
}
