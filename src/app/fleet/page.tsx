"use client";
import React, { useState, useEffect } from 'react';

// --- 全局数据接口 ---
interface PetEntity { id: string; name: string; category: string; ageDays: number; status: 'HOME' | 'PLAZA' | 'VISITING_OTHER' | 'VISITING_ME'; location: string; currentAction: string; }
interface TaskAlert { id: string; type: 'RECALL' | 'INVITE' | 'SYSTEM'; title: string; desc: string; actionText: string; }
interface Snapshot { id: string; petName: string; score: number; desc: string; time: string; }

export default function FleetCommandCenter() {
  const [loading, setLoading] = useState(true);
  const [fleetPets, setFleetPets] = useState<PetEntity[]>([]);
  const [tasks, setTasks] = useState<TaskAlert[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  
  useEffect(() => {
    // 模拟从服务器拉取全盘数据
    setFleetPets([
       { id: 'sys-001', name: '初代机 Alpha', category: '像素犬', ageDays: 120, status: 'HOME', location: '庄园-接待区', currentAction: '正在睡觉...' },
       { id: 'sys-002', name: '星云流浪者', category: '赛博猫', ageDays: 45, status: 'VISITING_OTHER', location: 'L4-SYS-12.05', currentAction: '正在执行作客任务' },
       { id: 'sys-003', name: '量子碎片', category: '史莱姆', ageDays: 12, status: 'PLAZA', location: '公共流浪广场', currentAction: '已驻留 2.5 小时' },
       { id: 'ext-999', name: '暗影刺客的猫', category: '赛博猫', ageDays: 30, status: 'VISITING_ME', location: '庄园-客厅', currentAction: '正在玩耍' }
    ]);

    setTasks([
       { id: 't1', type: 'RECALL', title: '盲盒已就绪', desc: '【量子碎片】在广场已达最短驻留时长，带回了 3 条陌生信号。', actionText: '立刻接回并解析' },
       { id: 't2', type: 'INVITE', title: '收到拜访邀请', desc: 'L4-SYS-88.01 邀请你的【初代机 Alpha】前往作客。', actionText: '查看并回应' },
       { id: 't3', type: 'SYSTEM', title: '签证即将到期', desc: '【星云流浪者】的拜访签证还剩 3 分钟。', actionText: '申请延长30分钟' }
    ]);

    setSnapshots([
       { id: 's1', petName: '星云流浪者', score: 95, desc: '和对方主人的赛博猫在沙发上打滚，兴奋度爆表！', time: '14:30' },
       { id: 's2', petName: '初代机 Alpha', score: 88, desc: '成功向陌生流浪犬递交了你的信件。', time: '昨天' }
    ]);

    setLoading(false);
  }, []);

  const navigateToProfile = (petId: string) => {
     // 真实项目中这里可以通过路由传参: window.location.href = `/pet-profile?id=${petId}`
     window.location.href = '/pet-profile';
  };

  const handleTaskAction = (taskId: string) => {
     setTasks(prev => prev.filter(t => t.id !== taskId));
     alert("任务指令已下达，系统正在处理...");
  };

  if (loading) return <div className="bg-[#020617] min-h-screen flex items-center justify-center font-mono text-blue-500">INITIALIZING FLEET...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col relative select-none">
      
      {/* 🌌 大盘背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(15,23,42,1)_0%,#020617_100%)]"></div>
         <div className="w-full h-full bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* 🛡️ 顶栏 */}
      <div className="w-full h-16 px-6 sm:px-8 flex justify-between items-center bg-black/80 border-b border-blue-900/50 backdrop-blur-md z-20 shrink-0">
         <div className="flex flex-col">
            <h1 className="text-sm font-black text-blue-400 tracking-widest uppercase flex items-center gap-3">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div> LIFEFORM FLEET COMMAND
            </h1>
            <span className="text-[9px] text-zinc-500 mt-0.5">全域生命体调度大盘</span>
         </div>
         <div className="flex items-center gap-4">
            <button onClick={() => window.location.href='/holodeck'} className="text-[10px] text-zinc-400 hover:text-white border border-zinc-700 px-3 py-1 rounded transition-colors">返回庄园俯视图</button>
            <div className="hidden sm:flex flex-col items-end">
               <span className="text-xs font-bold text-white">THE_CREATOR</span>
               <span className="text-[9px] text-emerald-500">ASSET CAPACITY: {fleetPets.length}/10</span>
            </div>
         </div>
      </div>

      {/* 🎛️ 核心网格布局 */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 overflow-y-auto custom-scrollbar">
         
         {/* ======================= 左侧：生命体舰队卡片 (占 8 列) ======================= */}
         <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex justify-between items-end mb-2">
               <h2 className="text-xl font-black text-white tracking-widest">DEPLOYED ASSETS (部署资产)</h2>
               <span className="text-[10px] text-zinc-500">点击进入详情舱</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {fleetPets.map(pet => (
                  <div key={pet.id} onClick={() => navigateToProfile(pet.id)} className="bg-black/60 border border-zinc-800 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] group relative overflow-hidden flex flex-col">
                     
                     {/* 状态标签 */}
                     {pet.status === 'VISITING_ME' && <div className="absolute top-0 right-0 bg-purple-600 text-white text-[8px] font-black px-3 py-1 rounded-bl-lg z-10">GUEST</div>}
                     {pet.status === 'VISITING_OTHER' && <div className="absolute top-0 right-0 bg-yellow-600 text-black text-[8px] font-black px-3 py-1 rounded-bl-lg z-10">AWAY</div>}
                     {pet.status === 'PLAZA' && <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-black px-3 py-1 rounded-bl-lg z-10">PLAZA</div>}

                     <div className="flex justify-between items-start mb-4 border-b border-zinc-800 pb-3 mt-1">
                        <div>
                           <h3 className="text-base font-black text-white group-hover:text-blue-400 transition-colors">{pet.name}</h3>
                           <div className="text-[9px] text-zinc-500 font-mono mt-1">ID: {pet.id} | {pet.category}</div>
                        </div>
                        <div className="text-3xl opacity-80 group-hover:scale-110 transition-transform">
                           {pet.category === '像素犬' ? '🐕' : pet.category === '赛博猫' ? '🐈' : pet.category === '史莱姆' ? '💧' : '🤖'}
                        </div>
                     </div>
                     
                     <div className="flex flex-col gap-2 text-[10px] flex-1">
                        <div className="flex justify-between"><span className="text-zinc-600">📍 坐标定位:</span><span className={pet.status==='HOME' ? 'text-blue-300 font-bold' : 'text-zinc-300'}>{pet.location}</span></div>
                        <div className="flex justify-between"><span className="text-zinc-600">⚡ 当前动作:</span><span className={`italic truncate max-w-[150px] text-right ${pet.status === 'PLAZA' ? 'text-pink-400' : 'text-zinc-400'}`}>{pet.currentAction}</span></div>
                     </div>
                  </div>
               ))}
               
               {/* 孵化槽 */}
               <div className="bg-blue-950/10 border-2 border-dashed border-blue-900/30 rounded-2xl p-5 flex flex-col items-center justify-center text-blue-500/50 hover:border-blue-500 hover:text-blue-400 cursor-pointer transition-colors min-h-[160px]">
                  <div className="text-3xl mb-1">+</div>
                  <div className="text-[10px] font-bold tracking-widest">前往孵化中心</div>
               </div>
            </div>

            {/* 🔥 新增：全局情报信箱 (群发/写信中心) */}
            <div className="mt-4 bg-gradient-to-r from-blue-950/30 to-black border border-blue-900/50 rounded-2xl p-5">
               <h3 className="text-sm font-black text-blue-400 tracking-widest mb-3 flex items-center gap-2"><span>📨 Payload Center (情报信箱)</span></h3>
               <p className="text-[10px] text-zinc-400 mb-3">在此编写新的 48 字符密信，指派给即将前往广场的宠物携带。</p>
               <div className="flex gap-2">
                  <input type="text" maxLength={48} placeholder="编写全局信件..." className="flex-1 bg-black/80 border border-zinc-700 px-3 py-2 rounded-lg text-xs text-white outline-none focus:border-blue-500" />
                  <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg text-[10px] uppercase shadow-lg">存入军械库</button>
               </div>
            </div>
         </div>


         {/* ======================= 右侧：任务与荣誉中心 (占 4 列) ======================= */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* 🔴 紧急任务控制台 */}
            <div className="bg-black/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
               <div className="bg-red-950/30 border-b border-red-900/50 px-4 py-3 flex justify-between items-center">
                  <span className="text-xs font-black text-red-400 tracking-widest flex items-center gap-2"><div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div> PENDING TASKS</span>
                  <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full">{tasks.length}</span>
               </div>
               <div className="flex flex-col gap-1 p-3">
                  {tasks.length === 0 ? <div className="text-[10px] text-zinc-600 text-center py-4">ALL CLEAR. 没有待处理任务。</div> : 
                     tasks.map(task => (
                        <div key={task.id} className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 flex flex-col">
                           <span className="text-[10px] font-bold text-white mb-1">[{task.type}] {task.title}</span>
                           <span className="text-[9px] text-zinc-400 leading-relaxed mb-3">{task.desc}</span>
                           <button onClick={() => handleTaskAction(task.id)} className={`w-full py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all ${task.type === 'RECALL' ? 'bg-pink-600/80 hover:bg-pink-500 text-white' : task.type === 'INVITE' ? 'bg-blue-600/80 hover:bg-blue-500 text-white' : 'bg-yellow-600/80 hover:bg-yellow-500 text-black'}`}>
                              {task.actionText}
                           </button>
                        </div>
                     ))
                  }
               </div>
            </div>

            {/* 📸 星际回忆长廊 (全局快照墙) */}
            <div className="bg-black/60 border border-zinc-800 rounded-2xl flex flex-col flex-1 min-h-[250px] overflow-hidden">
               <div className="bg-pink-950/20 border-b border-pink-900/30 px-4 py-3">
                  <span className="text-xs font-black text-pink-400 tracking-widest">📸 MEMORY VAULT (高光快照)</span>
               </div>
               <div className="flex-1 p-3 overflow-y-auto custom-scrollbar flex flex-col gap-3">
                  {snapshots.map(snap => (
                     <div key={snap.id} className="bg-gradient-to-r from-pink-950/40 to-transparent border-l-2 border-pink-500 p-3 rounded-r-xl">
                        <div className="flex justify-between items-start mb-1">
                           <span className="text-[10px] font-bold text-white">{snap.petName}</span>
                           <span className="bg-pink-600 text-white text-[8px] px-1.5 py-0.5 rounded font-mono">SCORE: {snap.score}</span>
                        </div>
                        <p className="text-[9px] text-zinc-300 italic">"{snap.desc}"</p>
                        <div className="text-[8px] text-zinc-600 mt-2 text-right">{snap.time}</div>
                     </div>
                  ))}
               </div>
            </div>

            {/* 🏆 造物主荣耀 */}
            <div className="bg-black/60 border border-yellow-900/30 rounded-2xl p-4 flex items-center justify-between shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-yellow-500 tracking-widest mb-1">GLOBAL RANKING</span>
                  <span className="text-xs font-bold text-white">综合社交排位: TOP 2%</span>
               </div>
               <div className="text-3xl grayscale opacity-80">🏅</div>
            </div>

         </div>
      </div>
    </div>
  );
}