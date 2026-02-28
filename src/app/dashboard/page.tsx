"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CommanderDashboard() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [sunsData, setSunsData] = useState<any>(null);
  const [identityData, setIdentityData] = useState<any>(null);
  const [lifeLogs, setLifeLogs] = useState<any[]>([]);
  
  // 🔥 多宠物生态状态 🔥
  const [petsList, setPetsList] = useState<any[]>([]);
  const [userTier, setUserTier] = useState('FREE'); 
  const [maxCapacity, setMaxCapacity] = useState(2); // FREE默认最多2只(含领养奖励)
  const [hasKarmaLock, setHasKarmaLock] = useState(false); // 业力锁定(是否有流浪/待取消)

  // 改名状态 (精准定位到具体的 pet_id)
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [newPetName, setNewPetName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const initData = async () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (!storedEmail) return window.location.href = '/login';
      setEmail(storedEmail);

      try {
        // 1. 获取空间
        const { data: sunsRes } = await supabase.from('suns_registry_v1').select('*').eq('owner_email', storedEmail).order('created_at', { ascending: false }).limit(1).maybeSingle();
        if (sunsRes) setSunsData(sunsRes);

        // 2. 获取身份与会员等级
        const { data: idRes } = await supabase.from('identity_registry_v1').select('*').eq('owner_email', storedEmail).order('created_at', { ascending: false }).limit(1).maybeSingle();
        let currentTier = 'FREE';
        if (idRes) {
          setIdentityData(idRes);
          // 假设我们通过数据库扩展了会员字段，这里提供容错
          currentTier = idRes.membership_tier || 'FREE';
          setUserTier(currentTier);
          
          // 根据矩阵设定最大并发容量
          const capacityMap: Record<string, number> = { FREE: 2, PLUS: 5, PRO: 15 };
          setMaxCapacity(capacityMap[currentTier] || 2);
        }

        // 🔥 3. 获取名下所有宠物 (生命矩阵) 🔥
        const { data: petsRes } = await supabase.from('pet_registry_v1').select('*').eq('owner_email', storedEmail).order('created_at', { ascending: false });
        if (petsRes && petsRes.length > 0) {
          setPetsList(petsRes);
          // 检查业力锁定
          const locked = petsRes.some(p => p.life_status === 'STRAY' || p.life_status === 'PENDING_CANCEL');
          setHasKarmaLock(locked);
        }

        // 4. 合并主人与所有宠物的日志
        if (idRes) {
          const { data: logsRes } = await supabase.from('life_chain_logs').select('*').eq('s2_slip_id', idRes.s2_slip_id); 
          let combinedLogs = logsRes || [];

          if (petsRes && petsRes.length > 0) {
             const petIds = petsRes.map(p => p.pet_slip_id);
             const { data: petLogsRes } = await supabase.from('pet_life_logs').select('*').in('pet_slip_id', petIds);
             
             if (petLogsRes) {
                // 给日志打上具体宠物的名字标签
                const markedPetLogs = petLogsRes.map(log => {
                  const petInfo = petsRes.find(p => p.pet_slip_id === log.pet_slip_id);
                  return {...log, isPet: true, petName: petInfo?.pet_name || 'Unknown'};
                });
                combinedLogs = [...combinedLogs, ...markedPetLogs];
             }
          }
          // 统一按时间线倒序
          combinedLogs.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setLifeLogs(combinedLogs);
        }
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleLogout = () => { localStorage.clear(); window.location.href = '/login'; };

  const getEnvironmentalImpact = (area: number) => {
    if (!area) return "分析空间参数中...";
    if (area > 500) return "宽广空间，探索欲上升。";
    if (area > 100) return "空间适中，状态平稳。";
    return "空间狭小，极度依恋锚点核心。";
  };

  // 🔥 精准提交某只宠物的改名请求 🔥
  const submitNameChange = async (petId: string, oldName: string, slipId: string) => {
    if (!newPetName.trim() || newPetName === oldName) {
      setEditingPetId(null);
      return;
    }
    setIsUpdating(true);
    try {
      const { error } = await supabase.from('pet_registry_v1').update({ pet_name: newPetName }).eq('id', petId);
      if (!error) {
        setPetsList(petsList.map(p => p.id === petId ? { ...p, pet_name: newPetName } : p));
        await supabase.from('pet_life_logs').insert([{
          pet_slip_id: slipId, event_type: 'RENAME', event_desc: `主人将其名称重载为: ${newPetName}`
        }]);
      }
    } catch (err) { console.error(err); } 
    finally { setIsUpdating(false); setEditingPetId(null); }
  };

  // 🔥 物理销毁 (< 3天) 🔥
  const handleTerminatePet = async (petId: string, petName: string, slipId: string) => {
    if (confirm(`【警告】该操作将彻底物理销毁 [${petName}] 的所有数据！\n因为存活不足3天，它不会进入流浪广场。确认销毁吗？`)) {
      setLoading(true);
      await supabase.from('pet_registry_v1').delete().eq('id', petId);
      await supabase.from('pet_life_logs').delete().eq('pet_slip_id', slipId);
      window.location.reload();
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center font-mono"><div className="text-emerald-500 text-xs font-bold animate-pulse uppercase">INITIALIZING COCKPIT...</div></div>;

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col relative">
      <div className="pointer-events-none fixed inset-0 z-50 opacity-10 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]"></div>

      <header className="flex justify-between items-end px-8 py-6 border-b border-zinc-900 bg-zinc-950/50 relative z-10">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter text-white">SPACE² <span className="text-emerald-500">COMMANDER</span></h1>
          <p className="text-[10px] text-zinc-500 tracking-widest mt-1 uppercase">Sys_User: {email}</p>
        </div>
        <button onClick={handleLogout} className="text-[10px] border border-zinc-800 bg-black px-6 py-2 hover:bg-red-900/20 hover:text-red-500 transition-all tracking-widest">TERMINATE</button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-8 relative z-10">
        
        {/* =================左侧阵列================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className="grid grid-cols-2 gap-6">
            <div className="border border-blue-900/50 bg-blue-950/10 p-5 relative">
              <h3 className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span> Identity</h3>
              {identityData ? (<p className="text-lg font-black text-white break-all">{identityData.s2_slip_id}</p>) : (<p className="text-zinc-600">NULL</p>)}
            </div>
            <div className="border border-emerald-900/50 bg-emerald-950/10 p-5 relative">
              <h3 className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-sm"></span> Spatial Anchor</h3>
              {sunsData ? (<><p className="text-lg font-black text-white break-all">{sunsData.full_suns_code}</p><p className="text-[10px] text-zinc-400 mt-1">AREA: {sunsData.total_area} m²</p></>) : (<p className="text-zinc-600">NULL</p>)}
            </div>
          </div>

          {/* 🔥 进化版：生命矩阵列表 (Life Matrix Roster) 🔥 */}
          <div className="border border-purple-900/50 bg-purple-950/10 p-6 relative flex flex-col max-h-[600px]">
            
            {/* 顶部容量仪表盘 */}
            <div className="flex justify-between items-center mb-4 border-b border-purple-900/30 pb-4">
              <div>
                <h3 className="text-purple-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></span> Life Matrix Roster
                </h3>
                <p className="text-[9px] text-zinc-500 mt-1 uppercase">Tier: <span className={userTier === 'PRO' ? 'text-yellow-500' : 'text-purple-300'}>{userTier}</span></p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-1">Capacity</p>
                 <div className="flex items-baseline gap-1">
                   <span className="text-xl font-black text-white">{petsList.length}</span>
                   <span className="text-xs text-zinc-500">/ {maxCapacity}</span>
                 </div>
              </div>
            </div>

            {/* 业力锁定全局警告 */}
            {hasKarmaLock && (
              <div className="bg-red-950/30 border border-red-900 p-2 mb-4 text-[9px] text-red-400 uppercase tracking-widest text-center">
                ⚠️ Karma Lock Active: Incubation Disabled
              </div>
            )}

            {/* 宠物独立卡片列表 */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
               {petsList.length === 0 ? (
                 <div className="text-center py-10">
                   <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-4">No active entities detected.</p>
                   <button onClick={() => window.location.href='/pet-incubator'} className="border border-purple-500 text-purple-400 hover:bg-purple-900/30 px-6 py-2 text-[10px] uppercase font-bold transition-colors">Initiate Genesis</button>
                 </div>
               ) : (
                 petsList.map(pet => {
                   const ageInDays = (new Date().getTime() - new Date(pet.created_at).getTime()) / (1000 * 60 * 60 * 24);
                   
                   return (
                     <div key={pet.id} className={`p-4 border relative ${pet.life_status === 'ACTIVE' ? 'bg-[#050505] border-zinc-800' : pet.life_status === 'STRAY' ? 'bg-red-950/10 border-red-900/30' : 'bg-yellow-950/10 border-yellow-900/30'}`}>
                        
                        {/* 状态徽章 */}
                        <div className="absolute top-3 right-3 flex gap-2">
                           {pet.life_status === 'ACTIVE' && <span className="text-[8px] bg-emerald-900/30 text-emerald-500 px-1.5 py-0.5 uppercase border border-emerald-900/50">Active</span>}
                           {pet.life_status === 'STRAY' && <span className="text-[8px] bg-red-900/30 text-red-500 px-1.5 py-0.5 uppercase border border-red-900/50 animate-pulse">Stray</span>}
                           {pet.life_status === 'PENDING_CANCEL' && <span className="text-[8px] bg-yellow-900/30 text-yellow-500 px-1.5 py-0.5 uppercase border border-yellow-900/50">Pending Cancel</span>}
                        </div>

                        {/* 名字与改名逻辑 */}
                        <div className="mb-2 w-3/4">
                          {editingPetId === pet.id ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <input type="text" value={newPetName} onChange={e => setNewPetName(e.target.value)} className="bg-zinc-900 border border-purple-500 text-purple-400 text-xs px-2 py-1 outline-none w-28" autoFocus disabled={isUpdating}/>
                              <button onClick={() => submitNameChange(pet.id, pet.pet_name, pet.pet_slip_id)} className="text-emerald-500 hover:text-emerald-400 p-1"><svg style={{width:'12px',height:'12px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg></button>
                              <button onClick={() => setEditingPetId(null)} className="text-red-500 hover:text-red-400 p-1"><svg style={{width:'12px',height:'12px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 group/edit cursor-pointer w-fit" onClick={() => pet.life_status === 'ACTIVE' && (setEditingPetId(pet.id), setNewPetName(pet.pet_name))}>
                              <span className={`text-base font-black tracking-wider ${pet.life_status === 'ACTIVE' ? 'text-purple-400 group-hover/edit:text-purple-300' : 'text-zinc-500'}`}>{pet.pet_name}</span>
                              {pet.life_status === 'ACTIVE' && <svg className="text-zinc-600 group-hover/edit:text-purple-400" style={{width:'10px',height:'10px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>}
                            </div>
                          )}
                        </div>

                        {/* 基因信息 */}
                        <div className="text-[9px] text-zinc-500 uppercase mb-3 space-x-2">
                           <span>DNA: <strong className="text-zinc-300">{pet.species}</strong></span>
                           <span>|</span>
                           <span>Core: <strong className="text-zinc-300">{pet.personality_core}</strong></span>
                           <span>|</span>
                           <span>Age: <strong className="text-zinc-300">{Math.floor(ageDays)}d</strong></span>
                        </div>

                        {/* 环境影响 (仅活跃状态显示) */}
                        {pet.life_status === 'ACTIVE' && (
                          <div className="mb-4">
                             <div className="text-[8px] text-emerald-600 uppercase mb-1 flex items-center gap-1"><svg style={{ width: '10px', height: '10px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Spatial Status</div>
                             <p className="text-[9px] text-zinc-400">{sunsData ? getEnvironmentalImpact(sunsData.total_area) : 'Syncing...'}</p>
                          </div>
                        )}

                        {/* 操作面板 */}
                        <div className="mt-auto">
                           {pet.life_status === 'ACTIVE' && (
                             <div className="flex gap-2">
                               <button onClick={() => window.location.href='/interaction'} className="flex-1 bg-purple-900/20 hover:bg-purple-600 border border-purple-900 text-purple-400 hover:text-white py-1.5 text-[9px] font-bold uppercase transition-all">Interact ↗</button>
                               {ageDays < 3 && (
                                 <button onClick={() => handleTerminatePet(pet.id, pet.pet_name, pet.pet_slip_id)} className="px-3 border border-red-900/50 text-red-500 hover:bg-red-600 hover:text-white text-[9px] uppercase transition-all">Terminate</button>
                               )}
                             </div>
                           )}
                           
                           {pet.life_status === 'PENDING_CANCEL' && (
                              <button onClick={() => handleTerminatePet(pet.id, pet.pet_name, pet.pet_slip_id)} className="w-full bg-yellow-900/20 hover:bg-yellow-600 border border-yellow-900 text-yellow-500 hover:text-black py-1.5 text-[9px] font-bold uppercase transition-all">Confirm Termination (彻底销毁)</button>
                           )}

                           {pet.life_status === 'STRAY' && (
                              <p className="text-[9px] text-red-500 text-center italic bg-red-950/20 py-1.5 border border-red-900/20">Wandering in Stray Square...</p>
                           )}
                        </div>

                     </div>
                   );
                 })
               )}
            </div>

            {/* 底部新增孵化入口 */}
            {petsList.length > 0 && petsList.length < maxCapacity && !hasKarmaLock && (
               <button onClick={() => window.location.href='/pet-incubator'} className="w-full mt-4 py-2 border border-dashed border-purple-500/50 text-purple-400 hover:bg-purple-900/20 text-[10px] uppercase tracking-widest transition-colors">
                 + Incubate New Entity
               </button>
            )}

          </div>

        </div>

        {/* =================右侧终端================= */}
        <div className="lg:col-span-7 flex flex-col h-[700px] lg:h-auto border border-zinc-800 bg-black relative shadow-[0_0_30px_rgba(16,185,129,0.02)]">
           <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center px-4 justify-between select-none">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div><div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div><div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div></div>
                <span className="text-[10px] text-zinc-400 font-bold tracking-widest">LIFE_CHAIN_DAEMON // SECURE_STREAM</span>
              </div>
              <div className="text-[9px] text-emerald-700">ENCRYPTED</div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed custom-scrollbar relative">
              {!identityData ? (
                 <div className="h-full flex flex-col items-center justify-center text-zinc-600"><p className="text-sm font-bold text-zinc-500 mb-2">AWAITING GENESIS</p></div>
              ) : lifeLogs.length === 0 ? (
                 <div className="text-emerald-500/50 animate-pulse">&gt; connection established.<br/>&gt; awaiting block sequence...</div>
              ) : (
                 <div className="space-y-6 pb-10">
                    <div className="text-zinc-500 mb-8 border-b border-zinc-900 pb-4">
                       <p className="text-emerald-600">Space² Omniscience Log Terminal</p>
                       <p>Host ID: {identityData.s2_slip_id}</p>
                       <p className="mt-2 text-[9px] uppercase">Tracking {petsList.length} entities in local space...</p>
                    </div>

                    {lifeLogs.map((log) => (
                      <div key={log.id} className={`relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:shadow-[0_0_10px_rgba(16,185,129,0.8)] border-l ${log.isPet ? 'before:bg-purple-500 border-purple-900/50' : 'before:bg-emerald-500 border-emerald-900/50'}`}>
                         <div className="flex items-baseline gap-3 mb-1">
                            <span className="text-zinc-600 text-[9px]">[{new Date(log.created_at).toISOString().replace('T', ' ').slice(0, 19)}]</span>
                            
                            {/* 🔥 标注具体是哪只宠物的行为 🔥 */}
                            <span className={`font-bold text-[10px] ${log.isPet ? 'text-purple-400' : 'text-emerald-400'}`}>
                               &lt;{log.isPet ? `${log.petName}::${log.event_type}` : log.event_type}&gt;
                            </span>
                         </div>
                         <div className="text-zinc-300 mb-2">&gt; {log.event_desc}</div>
                         {log.metadata && Object.keys(log.metadata).length > 0 && (
                            <div className="bg-zinc-900/30 border border-zinc-800 p-3 rounded-sm mt-2">
                               <pre className="text-[9px] text-zinc-500 overflow-x-auto">{JSON.stringify(log.metadata, null, 2)}</pre>
                            </div>
                         )}
                      </div>
                    ))}
                 </div>
              )}
           </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #000; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; }
      `}</style>
    </div>
  );
}
