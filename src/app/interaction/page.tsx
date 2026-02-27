"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =====================================================================
// 🎨 多物种像素宠物引擎 (纯 SVG)
// =====================================================================
const PixelPet = ({ mood, action, species }: { mood: string, action: string, species: string }) => {
  const colorMap: Record<string, string> = { CALM: '#a855f7', ANGRY: '#ef4444', JOY: '#10b981', SAD: '#3b82f6', PLEASE: '#f472b6', DISDAIN: '#eab308' };
  const petColor = colorMap[mood] || colorMap.CALM;
  const eyeColor = "#000"; 

  const renderMammal = () => {  
    const tailAnim = ['JOY', 'PLEASE'].includes(mood) ? 'animate-[wag_0.2s_ease-in-out_infinite]' : mood === 'SAD' ? 'translate-y-1' : 'animate-[wag_1s_ease-in-out_infinite]';
    return (
      <g>
        <rect x="2" y="12" width="10" height="4" fill="currentColor" className={`origin-right ${tailAnim}`} />
        <rect x="10" y="10" width="25" height="15" fill="currentColor" />
        <rect x="12" y="25" width="4" height="5" fill="currentColor" />
        <rect x="28" y="25" width="4" height="5" fill="currentColor" />
        <rect x="30" y="4" width="16" height="14" fill="currentColor" />
        <rect x="32" y="0" width="4" height="4" fill="currentColor" />
        <rect x="40" y="0" width="4" height="4" fill="currentColor" />
        {mood === 'ANGRY' && (<><rect x="38" y="9" width="3" height="1" fill={eyeColor} /><rect x="44" y="9" width="3" height="1" fill={eyeColor} /><rect x="39" y="13" width="1" height="2" fill="#e5e7eb" /><rect x="41" y="13" width="1" height="2" fill="#e5e7eb" /><rect x="43" y="13" width="1" height="2" fill="#e5e7eb" /></>)}
        {mood === 'JOY' && (<><rect x="38" y="8" width="2" height="2" fill={eyeColor} /><rect x="44" y="8" width="2" height="2" fill={eyeColor} /><rect x="39" y="13" width="8" height="2" fill={eyeColor} /></>)}
        {mood === 'SAD' && (<><rect x="38" y="8" width="2" height="2" fill={eyeColor} /><rect x="44" y="8" width="2" height="2" fill={eyeColor} /><rect x="38" y="11" width="2" height="2" fill="currentColor" className="animate-pulse" /><rect x="44" y="11" width="2" height="2" fill="currentColor" className="animate-pulse" /><rect x="39" y="14" width="1" height="1" fill={eyeColor} /><rect x="40" y="13" width="4" height="1" fill={eyeColor} /><rect x="44" y="14" width="1" height="1" fill={eyeColor} /></>)}
        {mood === 'PLEASE' && (<><rect x="37" y="7" width="3" height="3" fill={eyeColor} /><rect x="43" y="7" width="3" height="3" fill={eyeColor} /><rect x="38" y="8" width="1" height="1" fill="currentColor" /><rect x="44" y="8" width="1" height="1" fill="currentColor" /></>)}
        {mood === 'DISDAIN' && (<><rect x="36" y="8" width="2" height="1" fill={eyeColor} /><rect x="42" y="8" width="2" height="1" fill={eyeColor} /><rect x="43" y="13" width="2" height="1" fill={eyeColor} /></>)}
        {mood === 'CALM' && (<><rect x="38" y="8" width="2" height="2" fill={eyeColor} /><rect x="44" y="8" width="2" height="2" fill={eyeColor} className="animate-[blink_4s_infinite]" /></>)}
      </g>
    );
  };

  const renderAmphibian = () => {  
    return (
      <g>
        <rect x="15" y="16" width="20" height="12" fill="currentColor" rx="4" />
        <rect x="13" y="20" width="4" height="6" fill="currentColor" /><rect x="33" y="20" width="4" height="6" fill="currentColor" />
        <rect x="17" y="28" width="6" height="2" fill="currentColor" /><rect x="27" y="28" width="6" height="2" fill="currentColor" />
        <rect x="11" y="8" width="28" height="12" fill="currentColor" rx="6" />
        <rect x="13" y="2" width="10" height="8" fill="currentColor" rx="4" /><rect x="27" y="2" width="10" height="8" fill="currentColor" rx="4" />
        <rect x="19" y="18" width="12" height="8" fill="#ffffff" opacity="0.2" rx="2" />
        {mood === 'CALM' && (<><rect x="16" y="4" width="4" height="4" fill={eyeColor} rx="2" /><rect x="30" y="4" width="4" height="4" fill={eyeColor} rx="2" className="animate-[blink_4s_infinite]" /><rect x="21" y="15" width="8" height="1" fill={eyeColor} /></>)}
        {mood !== 'CALM' && (<><rect x="16" y="5" width="4" height="2" fill={eyeColor} /><rect x="30" y="5" width="4" height="2" fill={eyeColor} /><rect x="22" y="15" width="6" height="2" fill={eyeColor} /></>)}
      </g>
    );
  };

  const renderAvian = () => {  
    return (
      <g>
        <rect x="5" y="2" width="40" height="28" fill="currentColor" rx="14" />
        <rect x="21" y="12" width="8" height="10" fill="#fbbf24" rx="2" />
        <rect x="22" y="22" width="6" height="4" fill="#d97706" rx="2" />
        <circle cx="12" cy="18" r="4" fill="#ffffff" opacity="0.3" /><circle cx="38" cy="18" r="4" fill="#ffffff" opacity="0.3" />
        <circle cx="14" cy="10" r="3" fill={eyeColor} /><circle cx="36" cy="10" r="3" fill={eyeColor} className="animate-[blink_4s_infinite]" />
      </g>
    );
  };

  const renderPlasma = () => {  
    const fluidAnim = action === 'JUMP' ? 'scale-y-125 -translate-y-2' : 'animate-[pulse_3s_ease-in-out_infinite]';
    return (
      <g className={`origin-bottom transition-all duration-500 ${fluidAnim}`}>
        <rect x="10" y="8" width="30" height="22" fill="currentColor" opacity="0.6" rx="10" />
        <rect x="14" y="10" width="8" height="4" fill="#ffffff" opacity="0.4" rx="2" />
        <circle cx="25" cy="20" r="6" fill="currentColor" className="animate-ping opacity-50" /><circle cx="25" cy="20" r="4" fill="#ffffff" />
        <circle cx="19" cy="16" r="2" fill={eyeColor} /><circle cx="31" cy="16" r="2" fill={eyeColor} className="animate-[blink_4s_infinite]" />
      </g>
    );
  };

  return (
    <div className={`relative transition-all duration-500 ${action === 'JUMP' ? '-translate-y-4' : ''}`}>
      <svg width="150" height="90" viewBox="0 0 50 30" className="drop-shadow-[0_0_15px_currentColor]" style={{ color: petColor }}>
        {species === 'MAMMAL' && renderMammal()}
        {species === 'AMPHIBIAN' && renderAmphibian()}
        {species === 'AVIAN' && renderAvian()}
        {species === 'PLASMA' && renderPlasma()}
      </svg>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black animate-bounce" style={{ color: petColor, textShadow: '0 0 5px currentColor' }}>
        {mood === 'JOY' ? '^_^' : mood === 'SAD' ? 'T_T' : mood === 'ANGRY' ? 'Ò_Ó' : mood === 'DISDAIN' ? '¬_¬' : mood === 'PLEASE' ? 'QwQ' : '...'}
      </div>
    </div>
  );
};

// =====================================================================
// 🤖 S2.NEO 基础神经元抓取模拟器
// =====================================================================
const extractNeurons = (text: string) => {
  let result = { mood: 'CALM', action: 'IDLE', reply: '', traitsToBoost: [] as string[], nName: '' };
  const t = text.toLowerCase();

  if (t.includes('玩') || t.includes('摸') || t.includes('抱')) {
    result = { mood: 'JOY', action: 'JUMP', reply: '感受到了强烈的社交欲望。', traitsToBoost: ['EXPLORER', 'MIXED'], nName: 'N1 [社交亲人]' };
  } else if (t.includes('坐下') || t.includes('听话') || t.includes('乖')) {
    result = { mood: 'CALM', action: 'IDLE', reply: '开始专注于你的指令。', traitsToBoost: ['OBSERVER', 'GUARDIAN'], nName: 'N2 [服从可训]' };
  } else if (t.includes('跑') || t.includes('跳') || t.includes('精力')) {
    result = { mood: 'JOY', action: 'JUMP', reply: '能量场开始剧烈波动！', traitsToBoost: ['EXPLORER', 'GUARDIAN', 'MIXED'], nName: 'N3 [精力活力]' };
  } else if (t.includes('探索') || t.includes('看') || t.includes('什么')) {
    result = { mood: 'CALM', action: 'MOVE', reply: '雷达全开，对周围环境进行深度扫描。', traitsToBoost: ['EXPLORER'], nName: 'N5 [探索好奇]' };
  } else if (t.includes('保护') || t.includes('坏人') || t.includes('守护')) {
    result = { mood: 'ANGRY', action: 'IDLE', reply: '进入高度警戒防御状态。', traitsToBoost: ['GUARDIAN'], nName: 'N6 [领地护卫]' };
  } else if (t.includes('滚') || t.includes('呆着') || t.includes('走开')) {
    result = { mood: 'DISDAIN', action: 'MOVE', reply: '切断了社交链接，独自游荡。', traitsToBoost: ['OBSERVER', 'EXPLORER', 'PHILOSOPHER'], nName: 'N7 [独立自主]' };
  } else if (t.includes('思考') || t.includes('为什么') || t.includes('奇怪')) {
    result = { mood: 'PLEASE', action: 'IDLE', reply: '陷入了逻辑悖论的运算中。', traitsToBoost: ['EXPLORER', 'PHILOSOPHER'], nName: 'N8 [动机复杂]' };
  } else if (t.includes('吃') || t.includes('饿')) {
    result = { mood: 'JOY', action: 'JUMP', reply: '暴露出极其强烈的进食欲望！', traitsToBoost: ['MIXED'], nName: 'N9 [贪食冲动]' };
  } else {
    result = { mood: 'CALM', action: 'IDLE', reply: '光电矩阵平缓闪烁，正在解析常规指令...', traitsToBoost: [], nName: '常规扫描' };
  }
  return result;
};


// =====================================================================
// 🚀 主交互舱组件
// =====================================================================
export default function InteractionPod() {
  const [loading, setLoading] = useState(true);
  const [sunsArea, setSunsArea] = useState(4);
  const [email, setEmail] = useState('');

  // 多生命体管理状态
  const [petsList, setPetsList] = useState<any[]>([]);
  const [activePetId, setActivePetId] = useState<string | null>(null);
  
  // 🔥 新增：当前宠物的灵魂容器 (意识数据) 🔥
  const [consciousness, setConsciousness] = useState<any>(null);

  // 视觉交互状态
  const [petMood, setPetMood] = useState('CALM'); 
  const [petAction, setPetAction] = useState('IDLE');
  const [petPos, setPetPos] = useState({ x: 50, y: 50 });

  const [inputText, setInputText] = useState('');
  const [interactionLogs, setInteractionLogs] = useState<{role: string, text: string, semantic?: any}[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🔥 就是丢了这一行：获取当前焦点宠物的完整数据 🔥
  const activePet = petsList.find(p => p.id === activePetId);
  
  useEffect(() => {
    const fetchEntities = async () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (!storedEmail) return window.location.href = '/login';
      setEmail(storedEmail);
      
      const { data: pets } = await supabase
        .from('pet_registry_v1')
        .select('*')
        .eq('owner_email', storedEmail)
        .eq('life_status', 'ACTIVE') 
        .order('created_at', { ascending: false });

      if (pets && pets.length > 0) {
        setPetsList(pets);
        const firstPetId = pets[0].id;
        setActivePetId(firstPetId); 
        
        // 拉取初代宠物的意识数据
        await fetchConsciousness(firstPetId);
        
        setInteractionLogs([{ role: 'system', text: `[系统] 检测到 ${pets.length} 个活跃生命体。当前焦点: ${pets[0].pet_name}。` }]);
      } else {
        setInteractionLogs([{ role: 'system', text: `[系统错误] 未检测到活跃的伴生体。请前往 🧬 创世孵化舱。` }]);
      }
      
      const { data: suns } = await supabase.from('suns_registry_v1').select('total_area').eq('owner_email', storedEmail).limit(1).maybeSingle();
      if (suns) setSunsArea(suns.total_area);
      
      setLoading(false);
    };
    fetchEntities();
  }, []);

  // 独立函数：拉取指定宠物的灵魂容器
  const fetchConsciousness = async (petId: string) => {
    const { data } = await supabase.from('pet_consciousness_v1').select('*').eq('pet_id', petId).maybeSingle();
    setConsciousness(data || { synaptic_terminals: [] }); // 容错处理
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interactionLogs]);

  const handleSwitchPet = async (id: string) => {
    setActivePetId(id);
    setPetMood('CALM');
    setPetPos({ x: 50, y: 50 });
    const newPet = petsList.find(p => p.id === id);
    setInteractionLogs(prev => [...prev, { role: 'system', text: `> 焦点已切换至实体: [${newPet?.pet_name}]。重载神经元末梢...` }]);
    await fetchConsciousness(id);
  };

  const handleInteract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activePet) return;
    
    const userMsg = inputText;
    setInputText('');
    setInteractionLogs(prev => [...prev, { role: 'user', text: userMsg }]);
    
    setTimeout(async () => {
      // 1. 获取基础意图解析
      const aiParse = extractNeurons(userMsg);
      
      // 🔥 2. 神来之笔：神经末梢匹配 (Synaptic Current Match) 🔥
      const terminals: string[] = consciousness?.synaptic_terminals || [];
      const matchedTerminals = terminals.filter(term => userMsg.includes(term));
      
      setPetMood(matchedTerminals.length > 0 ? 'PLEASE' : aiParse.mood); // 如果触发回忆，表现出特殊情绪
      setPetAction(aiParse.action);
      setPetPos(prev => ({
        x: Math.max(10, Math.min(90, aiParse.action === 'MOVE' ? 50 : prev.x + (Math.random()*20-10))),
        y: Math.max(10, Math.min(90, aiParse.action === 'MOVE' ? 80 : prev.y + (Math.random()*20-10)))
      }));

      // 构建混合语义日志
      const semanticLog = { 
        intent: userMsg, 
        extracted_mood: aiParse.mood, 
        triggered_neuron: aiParse.nName, 
        boosted_traits: aiParse.traitsToBoost,
        matched_synapses: matchedTerminals // 将匹配到的神经末梢也记录下来，传给 4:59 脚本
      };

      setInteractionLogs(prev => [...prev, { 
        role: 'system', text: `> ${activePet.pet_name} ${aiParse.reply}`, semantic: semanticLog
      }]);

      try {
        // 3. 写入常规流水日志 (留给战役三去总结)
        await supabase.from('pet_life_logs').insert([{
          pet_slip_id: activePet.pet_slip_id, event_type: 'INTERACTION', event_desc: `主人发出指令: "${userMsg}"`, metadata: semanticLog
        }]);

        // 4. 写入 daily_neurons 缓存池 (供雷达图突变使用)
        if (aiParse.traitsToBoost.length > 0) {
          const today = new Date().toISOString().split('T')[0];
          let currentNeurons = activePet.daily_neurons || { date: today, activations: {} };
          
          if (currentNeurons.date !== today) {
            currentNeurons = { date: today, activations: {} };
          }
          
          aiParse.traitsToBoost.forEach((trait: string) => {
             currentNeurons.activations[trait] = (currentNeurons.activations[trait] || 0) + 1;
          });

          await supabase.from('pet_registry_v1').update({ daily_neurons: currentNeurons }).eq('id', activePet.id);
          setPetsList(prev => prev.map(p => p.id === activePet.id ? { ...p, daily_neurons: currentNeurons } : p));
        }

      } catch (err) { console.error("Failed to sync neural log", err); }

      setTimeout(() => setPetAction('IDLE'), 1200);
    }, 500);
  };

  // UI：测试用，手动注入一个神经末梢词汇用于演示共振
  const handleInjectFakeSynapse = async () => {
    if (!consciousness || !activePet) return;
    const word = prompt("请输入你想植入这只宠物的测试记忆词汇 (如: 苹果, 害怕, 奔跑):");
    if (!word) return;
    
    const newTerminals = [...(consciousness.synaptic_terminals || []), word];
    await supabase.from('pet_consciousness_v1').update({ synaptic_terminals: newTerminals }).eq('pet_id', activePet.id);
    setConsciousness({ ...consciousness, synaptic_terminals: newTerminals });
    alert(`已将 "${word}" 植入 ${activePet.pet_name} 的潜意识深处！请在聊天框里对它说包含这个词的话。`);
  };

  if (loading) return <div className="min-h-screen bg-black text-emerald-500 font-mono flex items-center justify-center">Establishing Matrix Pod...</div>;

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col h-screen overflow-hidden">
      
      {/* 顶部通栏 */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
           <span className="text-emerald-500 font-bold italic tracking-tighter text-lg">INTERACTION POD</span>
        </div>
        <div className="flex gap-4 items-center">
           <button onClick={() => window.location.href='/pet-incubator'} className="text-[10px] bg-emerald-900/20 text-emerald-400 border border-emerald-900 px-4 py-1.5 hover:bg-emerald-500 hover:text-black transition-colors uppercase tracking-widest flex items-center gap-2 font-bold">
             <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Genesis Lab
           </button>
           <button onClick={() => window.location.href='/dashboard'} className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest font-bold border border-zinc-800 px-4 py-1.5">&lt; Commander</button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row relative">
        
        {/* 左侧：多目标焦点选择器 & 灵魂监视面板 */}
        <div className="md:w-64 border-r border-zinc-800 bg-[#050505] flex flex-col shrink-0 z-10">
           <div className="p-4 border-b border-zinc-900">
              <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Entity Focus Roster</h3>
           </div>
           
           {/* 实体列表 */}
           <div className="max-h-1/2 overflow-y-auto custom-scrollbar p-2 space-y-2 border-b border-zinc-900">
             {petsList.map(pet => (
               <div 
                 key={pet.id} 
                 onClick={() => handleSwitchPet(pet.id)}
                 className={`p-3 cursor-pointer border transition-all ${activePetId === pet.id ? 'border-purple-500 bg-purple-900/10' : 'border-zinc-800 bg-black hover:border-zinc-600'}`}
               >
                 <div className="flex items-center justify-between mb-1">
                   <span className={`font-black text-sm ${activePetId === pet.id ? 'text-purple-400' : 'text-zinc-400'}`}>{pet.pet_name}</span>
                   {activePetId === pet.id && <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,1)] animate-pulse"></span>}
                 </div>
                 <div className="text-[9px] text-zinc-500 uppercase">DNA: {pet.species}</div>
               </div>
             ))}
           </div>

           {/* 🔥 新增：潜意识末梢监控面板 (Synaptic Monitor) 🔥 */}
           <div className="flex-1 p-4 flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Synaptic Terminals</h3>
                <button onClick={handleInjectFakeSynapse} className="text-[8px] border border-blue-900 text-blue-500 hover:bg-blue-900/30 px-2 py-0.5 rounded-sm">+ DEV INJECT</button>
              </div>
              
              <div className="flex-1">
                {consciousness?.synaptic_terminals?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {consciousness.synaptic_terminals.map((term: string, idx: number) => (
                       <span key={idx} className="text-[9px] bg-blue-950/30 text-blue-400 border border-blue-900/50 px-2 py-1">
                         {term}
                       </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] text-zinc-600 italic">Awaiting 4:59 AM Neural Consolidation...</p>
                )}
              </div>
           </div>
        </div>

        {/* 中间视觉区 */}
        <div className="flex-1 relative bg-[#0a0a0a] border-r border-zinc-800 overflow-hidden flex flex-col items-center justify-center p-4">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:25%_25%] pointer-events-none"></div>
           <div className="absolute top-4 left-4 text-[10px] text-zinc-600 uppercase tracking-widest bg-black/50 p-1 backdrop-blur-sm z-10">L4 Matrix: {sunsArea} m²</div>

           <div className="relative w-full max-w-lg aspect-square border-2 border-zinc-800/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-6 transition-all">
             <div className="absolute transition-all duration-1000 ease-in-out -translate-x-1/2 -translate-y-1/2" style={{ left: `${petPos.x}%`, top: `${petPos.y}%` }}>
                {activePet ? (
                  <PixelPet mood={petMood} action={petAction} species={activePet.species || 'MAMMAL'} />
                ) : (
                  <div className="text-zinc-600 text-xs text-center w-32 h-20 flex items-center justify-center">NO FOCUS</div>
                )}
                <div className="w-16 h-2 bg-black/50 blur-sm rounded-full mx-auto mt-1 absolute -bottom-2 left-1/2 -translate-x-1/2"></div>
             </div>
           </div>
        </div>

        {/* 右侧：神经链路终端 */}
        <div className="md:w-[400px] flex flex-col bg-black relative shrink-0">
          <div className="h-10 bg-zinc-950 border-b border-zinc-800 flex items-center px-4 justify-between">
            <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase">S2.NEO Extractor</span>
            <span className="w-2 h-2 bg-emerald-500 rounded-sm"></span>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
            {interactionLogs.map((log, i) => (
              <div key={i} className={`text-[11px] ${log.role === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block p-3 max-w-[85%] ${log.role === 'user' ? 'bg-zinc-900 text-white border border-zinc-800' : 'border-l-2 border-purple-500 bg-purple-950/10 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.05)]'}`}>
                   {log.text}
                </div>
                
                {log.semantic && (
                  <div className="mt-2 ml-2 space-y-1 text-left max-w-[85%]">
                    
                    {/* 🔥 神来之笔：突触共振视觉反馈 🔥 */}
                    {log.semantic.matched_synapses && log.semantic.matched_synapses.length > 0 && (
                      <div className="p-2 bg-blue-950/30 border border-blue-500/50 text-[9px] text-blue-400 font-mono shadow-[0_0_10px_rgba(59,130,246,0.3)] animate-pulse">
                        <p className="font-bold border-b border-blue-900/50 pb-1 mb-1">⚡ SYNAPTIC CURRENT TRIGGERED</p>
                        <p>Resonance: [{log.semantic.matched_synapses.join(', ')}]</p>
                      </div>
                    )}

                    {/* 基础神经元触发反馈 */}
                    {log.semantic.boosted_traits && log.semantic.boosted_traits.length > 0 && (
                      <div className="p-2 bg-emerald-950/20 border border-emerald-900 text-[9px] text-emerald-400 font-mono">
                        <p className="font-bold border-b border-emerald-900 pb-1 mb-1">🧬 NEURAL PATHWAY ACTIVATED</p>
                        <p>Trigger: {log.semantic.triggered_neuron}</p>
                        <p className="mt-1">Weights Injected: {log.semantic.boosted_traits.map((t: string) => `+1 ${t}`).join(', ')}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-zinc-950 border-t border-zinc-800">
            <form onSubmit={handleInteract} className="relative">
              <input 
                type="text" value={inputText} onChange={e => setInputText(e.target.value)} disabled={!activePet}
                placeholder={activePet ? `Talk to [${activePet.pet_name}]...` : "Select an entity..."}
                className="w-full bg-black border border-zinc-800 focus:border-purple-500 p-4 pl-10 text-xs text-white outline-none transition-colors disabled:opacity-50"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 font-bold">&gt;</span>
              <button type="submit" disabled={!inputText.trim() || !activePet} className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-900/50 hover:bg-purple-500 text-purple-400 hover:text-black px-4 py-2 text-[10px] font-bold uppercase transition-colors tracking-widest disabled:opacity-50">
                Transmit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}