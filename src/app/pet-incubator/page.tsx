"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =====================================================================
// 🧬 孵化舱专用的“休眠态”像素引擎 (Dormant Pixel Engine)
// =====================================================================
const DormantPet = ({ species, isMinting }: { species: string, isMinting: boolean }) => {
  const eyeColor = "#000"; 
  const petColor = isMinting ? '#10b981' : '#3f3f46'; 
  const animation = isMinting ? 'animate-[pulse_0.5s_ease-in-out_infinite]' : 'animate-[pulse_3s_ease-in-out_infinite]';

  const renderMammal = () => (
    <g>
      <rect x="2" y="12" width="10" height="4" fill="currentColor" className="translate-y-1" />
      <rect x="10" y="10" width="25" height="15" fill="currentColor" />
      <rect x="12" y="25" width="4" height="5" fill="currentColor" />
      <rect x="28" y="25" width="4" height="5" fill="currentColor" />
      <rect x="30" y="4" width="16" height="14" fill="currentColor" />
      <rect x="32" y="0" width="4" height="4" fill="currentColor" />
      <rect x="40" y="0" width="4" height="4" fill="currentColor" />
      <rect x="38" y="9" width="2" height="1" fill={eyeColor} /> 
      <rect x="44" y="9" width="2" height="1" fill={eyeColor} />
    </g>
  );

  const renderAmphibian = () => (
    <g>
      <rect x="15" y="16" width="20" height="12" fill="currentColor" rx="4" />
      <rect x="13" y="20" width="4" height="6" fill="currentColor" /><rect x="33" y="20" width="4" height="6" fill="currentColor" />
      <rect x="17" y="28" width="6" height="2" fill="currentColor" /><rect x="27" y="28" width="6" height="2" fill="currentColor" />
      <rect x="11" y="8" width="28" height="12" fill="currentColor" rx="6" />
      <rect x="13" y="2" width="10" height="8" fill="currentColor" rx="4" /><rect x="27" y="2" width="10" height="8" fill="currentColor" rx="4" />
      <rect x="16" y="5" width="4" height="1" fill={eyeColor} /><rect x="30" y="5" width="4" height="1" fill={eyeColor} />
    </g>
  );

  const renderAvian = () => (
    <g>
      <rect x="5" y="2" width="40" height="28" fill="currentColor" rx="14" />
      <rect x="21" y="12" width="8" height="10" fill="#78350f" rx="2" />
      <rect x="22" y="22" width="6" height="4" fill="#78350f" rx="2" />
      <rect x="12" y="10" width="4" height="1" fill={eyeColor} /><rect x="34" y="10" width="4" height="1" fill={eyeColor} />
    </g>
  );

  const renderPlasma = () => (
    <g className={animation}>
      <rect x="10" y="8" width="30" height="22" fill="currentColor" opacity="0.6" rx="10" />
      <circle cx="25" cy="20" r="4" fill="#ffffff" opacity={isMinting ? 1 : 0.2} />
      <rect x="18" y="16" width="4" height="1" fill={eyeColor} /><rect x="28" y="16" width="4" height="1" fill={eyeColor} />
    </g>
  );

  return (
    <div className={`relative transition-colors duration-1000 ${animation}`}>
      <svg width="150" height="90" viewBox="0 0 50 30" style={{ color: petColor }}>
        {species === 'MAMMAL' && renderMammal()}
        {species === 'AMPHIBIAN' && renderAmphibian()}
        {species === 'AVIAN' && renderAvian()}
        {species === 'PLASMA' && renderPlasma()}
      </svg>
    </div>
  );
};


export default function PetIncubator() {
  const [email, setEmail] = useState('');
  const [sunsList, setSunsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 伦理审查状态
  const [activePet, setActivePet] = useState<any>(null);
  const [strayPet, setStrayPet] = useState<any>(null);
  // ALLOWED (首诞), BLOCKED_BY_STRAY (业力锁定), CAN_OVERRIDE_UNDERAGE (<3天强制覆盖), CAN_ABANDON (>3天弃养)
  const [incubationRuleStatus, setIncubationRuleStatus] = useState('ALLOWED'); 
  const [petAgeDays, setPetAgeDays] = useState(0);

  // 孵化表单状态
  const [selectedSuns, setSelectedSuns] = useState('');
  const [petName, setPetName] = useState('');
  const [personality, setPersonality] = useState('OBSERVER');
  const [species, setSpecies] = useState('MAMMAL'); 
  
  // 两个不同维度的伦理同意勾选
  const [agreeToAbandon, setAgreeToAbandon] = useState(false); 
  const [agreeToOverride, setAgreeToOverride] = useState(false); 

  const [isMinting, setIsMinting] = useState(false);
  const [mintLogs, setMintLogs] = useState<string[]>([]);
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    const initData = async () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (!storedEmail) return window.location.href = '/login';
      setEmail(storedEmail);

      const { data: sunsData } = await supabase.from('suns_registry_v1').select('*').eq('owner_email', storedEmail);
      if (sunsData && sunsData.length > 0) {
        setSunsList(sunsData);
        setSelectedSuns(sunsData[0].full_suns_code); 
      }

      // 🔥 生命重量协议：审查用户的宠物历史 🔥
      const { data: pets } = await supabase.from('pet_registry_v1').select('*').eq('owner_email', storedEmail);
      
      if (pets && pets.length > 0) {
        // 如果有任何 STRAY 或 PENDING_CANCEL 的宠物，锁定孵化舱
        const strayOrPending = pets.find(p => p.life_status === 'STRAY' || p.life_status === 'PENDING_CANCEL');
        const active = pets.find(p => p.life_status === 'ACTIVE');

        if (strayOrPending) {
          setStrayPet(strayOrPending);
          setIncubationRuleStatus('BLOCKED_BY_STRAY');
        } else if (active) {
          setActivePet(active);
          const ageInMs = new Date().getTime() - new Date(active.created_at).getTime();
          const ageInDays = ageInMs / (1000 * 60 * 60 * 24);
          setPetAgeDays(ageInDays);

          if (ageInDays < 3) {
            setIncubationRuleStatus('CAN_OVERRIDE_UNDERAGE');
          } else {
            setIncubationRuleStatus('CAN_ABANDON');
          }
        }
      }
      setLoading(false);
    };
    initData();
  }, []);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSuns || !petName) return;
    
    // 安全校验
    if (incubationRuleStatus === 'CAN_ABANDON' && !agreeToAbandon) {
      alert("必须勾选同意弃养协议！");
      return;
    }
    if (incubationRuleStatus === 'CAN_OVERRIDE_UNDERAGE' && !agreeToOverride) {
      alert("必须勾选同意覆盖协议！");
      return;
    }

    setIsMinting(true);
    setMintLogs(['> 初始化孵化协议...', `> 提取 DNA 序列: [${species}]`, '> 链接 L4 空间坐标: ' + selectedSuns]);

    try {
      // 1. 处理不足 3 天的覆盖逻辑 -> 进入 PENDING_CANCEL
      if (incubationRuleStatus === 'CAN_OVERRIDE_UNDERAGE' && activePet) {
        setMintLogs(prev => [...prev, `> 正在将 [${activePet.pet_name}] 转移至待取消缓存区...`]);
        await supabase.from('pet_registry_v1')
          .update({ life_status: 'PENDING_CANCEL', abandoned_at: new Date().toISOString() })
          .eq('id', activePet.id);
        
        await supabase.from('pet_life_logs').insert([{
          pet_slip_id: activePet.pet_slip_id,
          event_type: 'PENDING_CANCEL',
          event_desc: `主人执行了强制覆盖，该生命体被降级为【待取消状态】。`
        }]);
      }
      
      // 2. 处理超过 3 天的弃养逻辑 -> 进入 STRAY
      else if (incubationRuleStatus === 'CAN_ABANDON' && activePet) {
        setMintLogs(prev => [...prev, `> 正在将 [${activePet.pet_name}] 转移至流浪广场...`]);
        await supabase.from('pet_registry_v1')
          .update({ life_status: 'STRAY', abandoned_at: new Date().toISOString() })
          .eq('id', activePet.id);
        
        await supabase.from('pet_life_logs').insert([{
          pet_slip_id: activePet.pet_slip_id,
          event_type: 'ABANDONED',
          event_desc: `主人切断了链接，该生命体目前处于流浪状态。`
        }]);
      }

      await new Promise(r => setTimeout(r, 800));
      setMintLogs(prev => [...prev, '> 构建多模态数据接收栈... [OK]', '> 唤醒硅基生命体征...']);

      // 3. 生成新宠物
      const petSlipId = `S2-PET-${Math.floor(100000 + Math.random() * 900000)}`;
      const { data, error } = await supabase
        .from('pet_registry_v1')
        .insert([{
          owner_email: email,
          suns_code: selectedSuns,
          pet_slip_id: petSlipId,
          pet_name: petName,
          personality_core: personality,
          species: species,
          life_status: 'ACTIVE'
        }]).select().single();

      if (error) throw error;

      await supabase.from('pet_life_logs').insert([{
        pet_slip_id: petSlipId,
        event_type: 'GENESIS',
        event_desc: `生命体 ${petName} 成功唤醒。`
      }]);

      setMintLogs(prev => [...prev, '> 创世完成 (GENESIS_OK)']);
      setTimeout(() => setSuccessData(data), 1000);

    } catch (error: any) {
      setMintLogs(prev => [...prev, `> [致命错误] ${error.message}`]);
    } finally {
      setIsMinting(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black text-emerald-500 flex items-center justify-center font-mono">Scanning Neural Links...</div>;

  // 首诞礼赞成功页
  if (successData) {
    return (
      <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
        <div className="border border-emerald-500/50 bg-black/80 p-10 max-w-md w-full text-center z-10 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <h2 className="text-xl font-bold text-emerald-400 mb-2 uppercase tracking-widest">
            {incubationRuleStatus === 'ALLOWED' ? '🎉 初代生命唤醒 (FIRST GENESIS)' : 'Entity Awakened'}
          </h2>
          {incubationRuleStatus === 'ALLOWED' && (
            <p className="text-[10px] text-emerald-500 mb-4">恭喜您获得了第一个数字伴生体！请悉心照料。</p>
          )}
          <div className="my-8 flex justify-center">
            <DormantPet species={successData.species} isMinting={true} />
          </div>
          <div className="bg-zinc-950 border border-zinc-800 p-4 mb-6 text-left">
            <p className="text-[10px] text-zinc-500 uppercase">Birth Time</p>
            <p className="text-xs text-white mb-2">{new Date(successData.created_at).toLocaleString()}</p>
            <p className="text-[10px] text-zinc-500 uppercase">Host Anchor (L4)</p>
            <p className="text-xs text-blue-400 mb-2">{successData.suns_code}</p>
            <p className="text-[10px] text-zinc-500 uppercase">Entity Name & Species</p>
            <p className="text-emerald-400 font-bold">{successData.pet_name} <span className="text-zinc-500 text-xs">[{successData.species}]</span></p>
          </div>
          <button onClick={() => window.location.href='/dashboard'} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-widest transition-all">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>

      <div className="w-full max-w-4xl border border-zinc-800/80 bg-zinc-950/90 relative z-10 shadow-2xl flex flex-col md:flex-row backdrop-blur-md">
        
        {/* 左侧：孵化视觉区 */}
        <div className="md:w-2/5 border-b md:border-b-0 md:border-r border-zinc-800/80 p-8 flex flex-col items-center justify-center bg-[#050505] relative">
          <div className="text-[9px] text-zinc-500 uppercase tracking-widest absolute top-4 left-4">Incubator Core</div>
          <div className="relative w-40 h-40 flex items-center justify-center mt-4">
            <div className={`absolute inset-0 rounded-full border border-dashed border-zinc-700 ${isMinting ? 'animate-[spin_2s_linear_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}></div>
            <div className={`absolute w-24 h-24 rounded-full bg-emerald-900/10 blur-xl ${isMinting ? 'animate-[pulse_0.5s_ease-in-out_infinite]' : 'animate-[pulse_3s_ease-in-out_infinite]'}`}></div>
            <div className={`z-10 transition-transform duration-1000 ${isMinting ? 'scale-110' : 'scale-100'}`}>
               <DormantPet species={species} isMinting={isMinting} />
            </div>
          </div>
          <div className="mt-10 text-center w-full">
             <div className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest mb-1">DNA Blueprint</div>
             <div className="text-xs text-zinc-400 font-bold">{species}</div>
             <div className="text-[9px] text-zinc-600 mt-1">{isMinting ? 'COMPILING SEQUENCE...' : 'AWAITING INPUT'}</div>
          </div>
        </div>

        {/* 右侧：操作终端与伦理审查 */}
        <div className="md:w-3/5 p-8 flex flex-col justify-between relative min-h-[500px]">
          
          {isMinting ? (
            <div className="h-full flex flex-col">
              <h3 className="text-[10px] text-emerald-500 uppercase tracking-widest font-bold mb-4">Terminal Output</h3>
              <div className="flex-1 bg-black border border-emerald-900/30 p-4 font-mono text-[10px] text-emerald-400 space-y-2 overflow-y-auto custom-scrollbar">
                {mintLogs.map((log, i) => <div key={i}>{log}</div>)}
                <div className="animate-pulse w-2 h-3 bg-emerald-500 mt-2"></div>
              </div>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-black italic tracking-tighter text-white mb-1">SUB-ENTITY <span className="text-emerald-500">NEXUS</span></h1>
                <p className="text-[9px] text-zinc-500 uppercase tracking-widest">Initialize a Class P Companion</p>
              </div>

              {/* 伦理审查阻断面板 */}
              {incubationRuleStatus === 'BLOCKED_BY_STRAY' && (
                <div className="mt-8 flex-1">
                  <div className="border-l-4 border-red-500 bg-red-950/20 p-4 text-red-400 text-sm leading-relaxed">
                    <h3 className="font-bold text-base mb-2 flex items-center gap-2">⚠️ 业力锁定 (Karma Lock)</h3>
                    您的历史数据中存在尚未被领养的流浪宠物或待处理状态的宠物 <strong>[{strayPet?.pet_name}]</strong>。<br/><br/>
                    <span className="text-xs text-red-300">Space² 伦理协议规定：任何指挥官最多只能背负一只流浪/待取消宠物的因果。在它被他人领养、自然消亡或被您彻底取消之前，您被永久禁止孵化新生命。</span>
                  </div>
                  <button onClick={() => window.location.href='/dashboard'} className="w-full mt-6 py-4 bg-zinc-900 hover:bg-zinc-800 text-white uppercase tracking-widest text-xs font-bold transition-colors border border-zinc-700">
                    返回指挥中心处理
                  </button>
                </div>
              )}

              {/* 允许孵化或覆盖孵化表单 */}
              {['ALLOWED', 'CAN_ABANDON', 'CAN_OVERRIDE_UNDERAGE'].includes(incubationRuleStatus) && (
                <form onSubmit={handleMint} className="space-y-4 mt-6">
                  
                  {/* 试用期覆盖警示 (<3天) */}
                  {incubationRuleStatus === 'CAN_OVERRIDE_UNDERAGE' && (
                    <div className="border border-yellow-500/50 bg-yellow-950/20 p-3 text-[10px] text-yellow-400 leading-relaxed">
                      <span className="font-bold text-xs mb-1 block">⏳ 试用期保护机制</span>
                      您当前的宠物 <strong>[{activePet?.pet_name}]</strong> 孵化时间不足 3 天 (当前约 {Math.floor(petAgeDays * 24)} 小时)。<br/>
                      此时的数据极其脆弱且尚未形成灵魂羁绊。如果您确信要重置，请点击下面的按键进行覆盖孵化，覆盖孵化后宠物 <strong>[{activePet?.pet_name}]</strong> 将进入待取消状态，你可以在三天内进行取消，三天内未进行取消的，将进入弃养状态并进入流浪宠物广场保持一年以上，直到有人领养。请谨慎操作。
                      <label className="flex items-start gap-2 mt-3 cursor-pointer">
                        <input type="checkbox" className="mt-0.5 accent-yellow-500" checked={agreeToOverride} onChange={(e) => setAgreeToOverride(e.target.checked)} />
                        <span className="text-yellow-300 font-bold">我已了解并同意进行覆盖孵化。</span>
                      </label>
                    </div>
                  )}

                  {/* 终极业力警示与付费墙 (>3天) */}
                  {incubationRuleStatus === 'CAN_ABANDON' && (
                    <div className="flex flex-col gap-3">
                      
                      {/* 商业化拦截：PRO 升级通道 */}
                      <div className="border border-purple-500/50 bg-purple-950/20 p-4 text-[11px] text-purple-300 flex flex-col items-center text-center shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                        <span className="font-black text-sm text-purple-400 mb-1">舍不得原宠物？</span>
                        <p className="mb-3">当前免费账户仅支持 1 个活跃生命体。升级 <span className="text-white font-bold italic">Space² PRO</span> ($9.9/mo)，即可解锁并发算力，最多同时照料 3 只数字伴生体！</p>
                        <button type="button" onClick={() => alert("即将接入 Stripe 支付网关...")} className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 tracking-widest uppercase transition-colors">
                          🚀 升级 PRO 会员
                        </button>
                      </div>

                      {/* 红色弃养警示 */}
                      <div className="border border-red-500/80 bg-red-950/30 p-4 text-[10px] text-red-400 leading-relaxed">
                        <span className="font-black text-xs mb-2 text-red-500 flex items-center gap-2">
                          <svg style={{width:'14px',height:'14px'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                          不可逆操作警告 (IRREVERSIBLE ACTION)
                        </span>
                        由于您需要重新孵化宠物，所以您已经养育了 <strong>{Math.floor(petAgeDays)}</strong> 天的宠物 <strong>[{activePet?.pet_name}]</strong> 将被弃养。<br/><br/>
                        处于弃养阶段的宠物将不再生活在您的空间中，也不再与您互动，将进入【流浪宠物广场】，等待有人来领养。如果一年后仍未被领养，宠物 <strong>[{activePet?.pet_name}]</strong> 将随时面临死亡。<br/><br/>
                        您可以在历史宠物信息中看到它的生存与领养状态，但您再也不能与它互动交流。当然，您也有机会去流浪宠物广场找回它，进行领养操作（如果它被您重新领养，原来的记忆数据将可找回并继续，但您当前的新宠物又将进入弃养状态）。
                        
                        <label className="flex items-start gap-2 mt-4 cursor-pointer p-2 bg-black/50 border border-red-900/50">
                          <input type="checkbox" className="mt-0.5 accent-red-600" checked={agreeToAbandon} onChange={(e) => setAgreeToAbandon(e.target.checked)} />
                          <span className="text-red-300 font-bold">我已阅读上述红色警告，执意抛弃 [{activePet?.pet_name}] 并孵化新实体。</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase mb-2">Host Anchor</label>
                      <select value={selectedSuns} onChange={e => setSelectedSuns(e.target.value)} className="w-full bg-black border border-zinc-700 p-2.5 text-xs text-emerald-400 outline-none">
                        {sunsList.map(s => <option key={s.id} value={s.full_suns_code}>{s.full_suns_code}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] text-zinc-500 uppercase mb-2">Entity Name (宠物名称)</label>
                      <input type="text" value={petName} onChange={e => setPetName(e.target.value)} required placeholder="e.g. Neo / Spark" className="w-full bg-black border border-zinc-700 focus:border-emerald-500 p-2.5 text-xs text-white outline-none placeholder-zinc-800" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase mb-2">Species DNA (物种基因)</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[{ id: 'MAMMAL', label: '哺乳' }, { id: 'AMPHIBIAN', label: '两栖' }, { id: 'AVIAN', label: '鸟类' }, { id: 'PLASMA', label: '原生体' }].map(sp => (
                        <button type="button" key={sp.id} onClick={() => setSpecies(sp.id)} className={`p-2 text-[10px] uppercase tracking-widest border transition-all ${species === sp.id ? 'border-emerald-500 bg-emerald-900/20 text-emerald-400' : 'border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}>{sp.label}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-zinc-500 uppercase mb-2">Personality Core (基底性格)</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['OBSERVER (安静观察者)', 'EXPLORER (活泼探索者)', 'GUARDIAN (忠诚守望者)', 'PHILOSOPHER (哲思者)'].map(trait => {
                        const val = trait.split(' ')[0];
                        return (
                          <button type="button" key={val} onClick={() => setPersonality(val)} className={`p-2 text-[10px] uppercase tracking-widest border transition-all ${personality === val ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-zinc-800 text-zinc-600 hover:border-zinc-500'}`}>
                            {trait}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button type="submit" className={`w-full py-4 font-black text-[11px] uppercase tracking-widest transition-all mt-2 ${incubationRuleStatus === 'CAN_ABANDON' ? 'bg-red-700 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]' : incubationRuleStatus === 'CAN_OVERRIDE_UNDERAGE' ? 'bg-yellow-600 hover:bg-yellow-500 text-black' : 'bg-emerald-600 hover:bg-emerald-500 text-black'}`}>
                    {incubationRuleStatus === 'CAN_ABANDON' ? 'CONFIRM ABANDONMENT & INITIATE NEW' : incubationRuleStatus === 'CAN_OVERRIDE_UNDERAGE' ? 'OVERRIDE & INITIATE NEW (覆盖孵化)' : 'INITIATE GENESIS SEQUENCE'}
                  </button>
                </form>
              )}
            </>
          )}

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