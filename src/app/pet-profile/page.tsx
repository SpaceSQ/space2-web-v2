"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PetAvatar } from '@/components/PetAvatar';
import { PET_DIALOGUE_MATRIX } from '@/config/pet_genes';
import { GlobalNav } from '@/components/GlobalNav';
import { IOT_SCENARIOS } from '@/config/iot_scenarios';

// --- 生产级数据接口定义 ---
interface ActivityLog { id: string; time: string; text: string; type: 'INFO' | 'ACTION' | 'CHAT' | 'WARNING'; }
interface MemorySnapshot { time: string; text: string; }
interface HighSnapshot { score: number; time: string; socialDesc: string; localPets: string[]; furniture: string[]; smartHomeState: string; }
interface Snapshot { id: string; petName: string; score: number; time: string; socialDesc: string; localPets: string[]; furniture: string[]; smartHomeState: string; }
interface VisitRecord { id: string; targetHost: string; date: string; humanMemories: MemorySnapshot[]; petMemories: MemorySnapshot[]; peakSnapshot?: HighSnapshot | null; }
interface Invitation { id: string; fromHost: string; targetPetName: string; time: string; }
interface TaskAlert { id: string; type: 'RECALL' | 'INVITE' | 'SYSTEM'; title: string; desc: string; actionText: string; }
interface PetEntity { 
   id: string; ownerId: string; name: string; category: string; gender: string; 
   ageDays: number; personality: string; location: string; currentAction: string; 
   stats: { energy: number, affection: number, intel: number, appetite: number, bravery: number };
   status: 'HOME' | 'PLAZA' | 'VISITING_OTHER' | 'VISITING_ME'; 
}

interface DebriefResult {
   reportText: string;
   neuroChanges: { energy: number, affection: number, intel: number, appetite: number, bravery: number };
   invokedScenes: any[];
}

const CURRENT_USER = { id: 'user_001', name: 'THE_CREATOR' };

export default function MasterPetSystem() {
  const [loading, setLoading] = useState(true);
  
  // 🧭 视图与路由控制
  const [currentView, setCurrentView] = useState<'OVERVIEW' | 'DETAIL'>('OVERVIEW');
  const [activePet, setActivePet] = useState<PetEntity | null>(null);

  const [fleetPets, setFleetPets] = useState<PetEntity[]>([]);
  const [tasks, setTasks] = useState<TaskAlert[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);

  const [mood, setMood] = useState<'CALM'|'JOY'|'SAD'|'ANGRY'>('CALM');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [petName, setPetName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'CORE' | 'SOCIAL' | 'HOST_ARCHIVE' | 'NEURO' | 'AGENT'>('CORE');
  const [showIdCard, setShowIdCard] = useState(false);

  // 🤖 A2A 代管状态机
  const [agentState, setAgentState] = useState<'IDLE' | 'CONFIG' | 'DELEGATED' | 'DEBRIEF'>('IDLE');
  const [delegateDays, setDelegateDays] = useState<number>(3);
  const [delegateStyle, setDelegateStyle] = useState<'PAMPERED' | 'HUNTER' | 'TRAINER' | 'OPENCLAW'>('PAMPERED');
  const [simProgress, setSimProgress] = useState(0);
  const [debriefData, setDebriefData] = useState<DebriefResult | null>(null);

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [showFullLogs, setShowFullLogs] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);
  let typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [expeditionState, setExpeditionState] = useState<'IDLE' | 'VISITING'>('IDLE');
  const [invitations, setInvitations] = useState<Invitation[]>([]); 
  const [visitRecords, setVisitRecords] = useState<VisitRecord[]>([]); 
  const [visitTimeLeft, setVisitTimeLeft] = useState(0); 
  const [humanMemories, setHumanMemories] = useState<MemorySnapshot[]>([]); 
  const [petMemories, setPetMemories] = useState<MemorySnapshot[]>([]); 
  const [fullHostChatLog, setFullHostChatLog] = useState<MemorySnapshot[]>([]); 
  const [bestSnapshot, setBestSnapshot] = useState<HighSnapshot | null>(null); 
  const [hostGreeted, setHostGreeted] = useState(false); 

  const isOwner = activePet?.ownerId === CURRENT_USER.id;
  const isVisitingAway = activePet?.status === 'VISITING_OTHER' || activePet?.status === 'PLAZA';
  const isGuest = activePet?.status === 'VISITING_ME';

  useEffect(() => {
    const plazaPetsCache = JSON.parse(localStorage.getItem('space2_plaza_pets') || '[]');
    const dynamicFleet: PetEntity[] = [
       { id: 'sys-001', ownerId: 'user_001', name: '初代机 Alpha', category: '像素犬', gender: '公', ageDays: 120, personality: 'ACTIVE', location: '房间1 - 接待区', currentAction: '正在沙发上睡觉...', stats: { energy: 86, affection: 96, intel: 62, appetite: 78, bravery: 34 }, status: 'HOME' },
       { id: 'sys-002', ownerId: 'user_001', name: '星云流浪者', category: '赛博猫', gender: '母', ageDays: 45, personality: 'SHY', location: '未知庄园 (加密)', currentAction: '跨空间作客中', stats: { energy: 40, affection: 50, intel: 95, appetite: 60, bravery: 30 }, status: 'VISITING_OTHER' },
       { id: 'ext-999', ownerId: 'user_002', name: '量子碎片 (访客)', category: '史莱姆', gender: '无', ageDays: 12, personality: 'LAZY', location: '你的庄园 - 客厅', currentAction: '正在与你的数字人互动', stats: { energy: 20, affection: 80, intel: 40, appetite: 90, bravery: 10 }, status: 'VISITING_ME' }
    ];

    plazaPetsCache.forEach((p: any, index: number) => {
       dynamicFleet.push({ id: p.id || `plaza-${index}`, ownerId: 'user_001', name: p.name || `流浪实体_${index}`, category: p.category || '未知', gender: '无', ageDays: 12, personality: 'LAZY', location: '公共流浪广场', currentAction: '正在自由探索', stats: { energy: 50, affection: 50, intel: 50, appetite: 50, bravery: 50 }, status: 'PLAZA' });
    });

    setFleetPets(dynamicFleet);
    setTasks([{ id: 't1', type: 'RECALL', title: '盲盒已就绪', desc: '你在广场的宠物已带回陌生信号。', actionText: '立刻接回并解析' }]);
    setLogs([{ id: 'l1', time: new Date(Date.now() - 3600000).toLocaleTimeString(), text: '在房间1的沙发区休息了 45 分钟。', type: 'INFO' }]);
    setLoading(false);
  }, []);

  useEffect(() => {
     let timer: NodeJS.Timeout;
     if (expeditionState === 'VISITING' && visitTimeLeft > 0) {
        timer = setInterval(() => { setVisitTimeLeft(prev => prev <= 1 ? (handleVisitEnd(), 0) : prev - 1); }, 1000);
     }
     return () => clearInterval(timer);
  }, [expeditionState, visitTimeLeft, hostGreeted, humanMemories, petMemories, bestSnapshot]);

  const handleVisitEnd = () => {
     setExpeditionState('IDLE');
     if (isOwner) { 
        if (!hostGreeted && humanMemories.length === 0) { addLog(`[拜访失败] 对方未接待。宠物闪送回城。`, 'WARNING'); } 
        else {
           addLog(`[签证到期] 宠物已返回。正在封存【记忆快照】...`, 'INFO');
           if (humanMemories.length > 0 || petMemories.length > 0) {
              setVisitRecords(prev => [{ id: `vr-${Date.now()}`, targetHost: '遥远的庄园', date: new Date().toLocaleDateString(), humanMemories: [...humanMemories], petMemories: [...petMemories], peakSnapshot: bestSnapshot }, ...prev]);
           }
        }
        setActivePet(prev => prev ? { ...prev, status: 'HOME' } : null);
     } else {
        alert("拜访签证到期，该宠物已被闪送回原主人庄园。记录已保存。");
        setCurrentView('OVERVIEW');
     }
  };

  useEffect(() => { logEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs, showFullLogs]);

  const handleSelectPet = (pet: PetEntity) => {
     setActivePet(pet); setPetName(pet.name);
     setExpeditionState(pet.status === 'VISITING_OTHER' || pet.status === 'VISITING_ME' ? 'VISITING' : 'IDLE');
     setVisitTimeLeft(pet.status === 'HOME' ? 0 : 1800); 
     setActiveTab(pet.status === 'VISITING_ME' ? 'HOST_ARCHIVE' : 'CORE');
     setCurrentView('DETAIL');
  };

  const addLog = (text: string, type: 'INFO' | 'ACTION' | 'CHAT' | 'WARNING') => {
     setLogs(prev => [...prev, { id: Date.now().toString(), time: new Date().toLocaleTimeString(), text, type }]);
  };

  const handleSaveName = () => {
     if (!petName.trim() || !isOwner || !activePet) return; 
     setActivePet({ ...activePet, name: petName }); setIsEditingName(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setInputText(e.target.value);
     if (isOwner && isVisitingAway) return; 
     if (!isListening) setIsListening(true);
     if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
     typingTimeoutRef.current = setTimeout(() => { setIsListening(false); }, 1500); 
  };

  // 🔥 补全 handleAddNeuroTask 函数 🔥
  const handleAddNeuroTask = (title: string, desc: string, actionText: string) => {
      const newTask: TaskAlert = {
          id: `task-${Date.now()}`,
          type: 'SYSTEM',
          title: title,
          desc: desc,
          actionText: actionText
      };
      setTasks(prev => [...prev, newTask]);
      alert(`✅ 已将 [${title}] 任务添加至控制台首页待办列表。`);
  };

  const executeAction = (actionName: string, reactionMood: 'CALM'|'JOY'|'SAD'|'ANGRY', reply: string, isSystemCommand = false) => {
     if (isOwner && isVisitingAway) return alert("通信阻断：该生命体当前不在你的庄园内！");
     if (!isOwner && isSystemCommand) return alert("权限拒绝：您不是造物主，无权下达系统级指令！");
     if (!isOwner && (actionName === '暴打' || actionName === '弃养')) return alert("星际公约保护：禁止伤害访客！");
     if (isGuest && !hostGreeted) setHostGreeted(true);

     addLog(isSystemCommand ? `[SYS_CMD] ${actionName}` : `[ACTION] ${actionName}`, isSystemCommand ? 'WARNING' : 'ACTION');
     setMood(reactionMood); setIsSpeaking(true);
     addLog(`[${activePet!.name}] ${reply}`, 'CHAT');
     setTimeout(() => { setIsSpeaking(false); setTimeout(() => setMood('CALM'), 2000); }, 2500);
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOwner && isVisitingAway) return alert("通信阻断。");
    if (!inputText.trim() || isSpeaking || !activePet) return;
    
    const userMsg = inputText.trim();
    setInputText(''); setIsListening(false);
    addLog(`[你] ${userMsg}`, 'CHAT');
    if (isGuest && !hostGreeted) setHostGreeted(true);

    let newMood: 'CALM'|'JOY'|'SAD'|'ANGRY' = 'CALM';
    let reply = "歪头看着你。";
    const dict = PET_DIALOGUE_MATRIX[activePet.category] || PET_DIALOGUE_MATRIX["像素犬"];

    if (userMsg.includes("乖") || userMsg.includes("喜欢")) { newMood = 'JOY'; reply = dict['JOY'] ? dict['JOY'][0] : "开心！"; } 
    else if (userMsg.includes("打") || userMsg.includes("坏")) { newMood = 'SAD'; reply = dict['SAD'] ? dict['SAD'][0] : "呜呜..."; } 
    else if (userMsg.includes("吃")) { newMood = 'JOY'; reply = "好吃的！"; } 

    if (isGuest) {
       const newChatMem = { time: new Date().toLocaleTimeString().slice(0,5), text: `问: ${userMsg} 回答: ${reply}` };
       setFullHostChatLog(prev => [...prev, newChatMem]); 
       setHumanMemories(prev => [...prev, newChatMem].slice(-10)); 
    }

    setTimeout(() => {
       setMood(newMood); setIsSpeaking(true);
       addLog(`[${activePet.name}] ${reply}`, 'CHAT');
       setTimeout(() => { setIsSpeaking(false); setTimeout(() => setMood('CALM'), 2000); }, 2500);
    }, 500);
  };

  // 🔥 补全 handlePetInteraction 函数 🔥
  const handlePetInteraction = () => {
     if (!isGuest) return;
     const actions = [{ desc: '互相闻了闻尾巴', score: 30 }, { desc: '在一起疯狂追逐打闹', score: 85 }, { desc: '因为抢玩具呲牙咧嘴', score: 10 }, { desc: '依偎在一起睡觉', score: 95 }];
     const act = actions[Math.floor(Math.random() * actions.length)];
     const localPets = ['初代机 Alpha (像素犬/公)', '机械警犬 (机器/无)'];
     const targetLocalStr = localPets[Math.floor(Math.random() * localPets.length)];
     const targetLocal = targetLocalStr.split(' ')[0];

     addLog(`[宠物社交] 访客与本地的 ${targetLocal} ${act.desc}。`, 'ACTION');
     setPetMemories(prev => {
         const newMem = [...prev, { time: new Date().toLocaleTimeString().slice(0,5), text: `与 ${targetLocal} ${act.desc}。` }];
         return newMem.length > 10 ? newMem.slice(-10) : newMem;
     });

     if (!bestSnapshot || act.score > bestSnapshot.score) {
         const nowTime = new Date().toLocaleTimeString();
         setBestSnapshot({ 
            score: act.score, time: nowTime.slice(0,5), 
            socialDesc: `和本地的 ${targetLocal} ${act.desc}，气氛达到了顶点！`,
            localPets: [`${targetLocalStr} 正在参与互动`, '扫地机器人 正在充电'],
            furniture: ['赛博朋克真皮沙发', '全息投影茶几', '智能盆栽'],
            smartHomeState: `【${nowTime} 房间1-区4 照度500Lux，灯打开；温度25℃ 湿度50%；音量60dB，播放 爵士乐；毫米波雷达触发；能耗: 6.24Wh】`
         });
     }
  };

  const acceptInvitation = (id: string) => {
     setInvitations(prev => prev.filter(i => i.id !== id));
     setExpeditionState('VISITING'); setVisitTimeLeft(1800); setHostGreeted(true);
     setHumanMemories([]); setPetMemories([]); setBestSnapshot(null);
     
     addLog(`[星际签证] 接受邀请。宠物已闪送至目标接待区。`, 'WARNING');
     setTimeout(() => { setVisitTimeLeft(190); }, 2000); 
  };

  const handleExtendVisit = () => {
     if (visitTimeLeft > 180) return; 
     setVisitTimeLeft(prev => prev + 1800); 
     addLog(`[签证延期] 已确认延长请求，宠物将继续在对方庄园驻留 30 分钟。`, 'INFO');
  };

  const downloadIdCard = () => {
      const svgElement = document.getElementById('pet-id-card-svg');
      if (!svgElement) return;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url; link.download = `Space2_Pet_ID_${activePet?.id || 'Unknown'}.svg`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  // -------------------------------------------------------------------------
  // 🤖 核心机制：A2A 代管引擎与述职报告渲染
  // -------------------------------------------------------------------------
  const generateDebriefData = () => {
      let pool: string[] = [];
      let introText = "";
      
      if (delegateStyle === 'PAMPERED') {
         pool = ['SCENE_MORNING_DEW', 'SCENE_GOURMET', 'SCENE_SPA', 'SCENE_FIREPLACE', 'SCENE_FOREST'];
         introText = `【管家 Agent 述职】在过去 ${delegateDays} 天内，我主要通过物理环境向宠物提供高频安抚与奖励。我拦截了所有负面惊吓，重塑了它对空间的依赖感。`;
      } else if (delegateStyle === 'HUNTER') {
         pool = ['SCENE_THUNDERSTORM', 'SCENE_HEATWAVE', 'SCENE_PREDATOR', 'SCENE_DRONE_SWARM', 'SCENE_RED_ALERT'];
         introText = `【猎人 Agent 述职】为了唤醒野性，我在 ${delegateDays} 天内对其执行了高压脱敏特训。我多次制造了生存压迫环境，它的战斗基因已被完全激活。`;
      } else if (delegateStyle === 'TRAINER') {
         pool = ['SCENE_PUZZLE', 'SCENE_HIDE_SEEK', 'SCENE_SYMPHONY', 'SCENE_ROGUE_MACHINES', 'SCENE_ZERO_G'];
         introText = `【教官 Agent 述职】高强度的 ${delegateDays} 天逻辑训练。我调控了环境光与白噪音，强制其保持高专注度，并不断注入规避与解谜信号。`;
      } else if (delegateStyle === 'OPENCLAW') {
         pool = Object.keys(IOT_SCENARIOS);
         introText = `[OpenClaw Runtime Log] WSS 流挂载完毕... 权限 Level 3。进行了 ${delegateDays * 14800} 次微小环境参数干预与神经网络拟合。该实体已被我重构。`;
      }

      const invoked: any[] = [];
      const totalChanges = { energy: 0, affection: 0, intel: 0, appetite: 0, bravery: 0 };
      
      const runTimes = delegateDays + Math.floor(Math.random() * delegateDays); 
      for(let i=0; i<runTimes; i++) {
         const randomSceneId = pool[Math.floor(Math.random() * pool.length)];
         const sceneData = IOT_SCENARIOS[randomSceneId];
         if(sceneData) {
            invoked.push(sceneData);
            totalChanges.energy += sceneData.neuroImpact.energy;
            totalChanges.affection += sceneData.neuroImpact.affection;
            totalChanges.intel += sceneData.neuroImpact.intel;
            totalChanges.appetite += sceneData.neuroImpact.appetite;
            totalChanges.bravery += sceneData.neuroImpact.bravery;
         }
      }

      setDebriefData({ reportText: introText, neuroChanges: totalChanges, invokedScenes: invoked });
  };

  const handleStartDelegation = () => {
      setAgentState('DELEGATED');
      setSimProgress(0);
      let progress = 0;
      const interval = setInterval(() => {
          progress += 2;
          setSimProgress(progress);
          if (progress >= 100) {
              clearInterval(interval);
              generateDebriefData(); 
              setAgentState('DEBRIEF');
          }
      }, 60);
  };

  const renderDebriefReport = () => {
      if (!debriefData) return null;
      return (
         <div className="bg-black/80 border border-zinc-700 p-5 rounded-xl shadow-2xl mt-4 animate-in fade-in slide-in-from-bottom-4">
             <h4 className="text-emerald-400 font-black text-xs tracking-widest mb-3 border-b border-emerald-900/50 pb-2">✅ 述职报告 (DEBRIEFING REPORT)</h4>
             <p className="text-[10px] text-zinc-300 leading-relaxed mb-4">{debriefData.reportText}</p>
             
             <div className="bg-zinc-900/50 border border-white/5 p-3 rounded-lg mb-4">
                 <div className="text-[8px] text-zinc-500 mb-2">底层神经突触变动演算结果：</div>
                 <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold">
                    <div className="bg-black p-1 rounded"><span className="block text-blue-400 text-[8px] mb-0.5">活力</span><span className={debriefData.neuroChanges.energy > 0 ? 'text-emerald-500' : debriefData.neuroChanges.energy < 0 ? 'text-red-500' : 'text-zinc-500'}>{debriefData.neuroChanges.energy > 0 ? '+' : ''}{debriefData.neuroChanges.energy}</span></div>
                    <div className="bg-black p-1 rounded"><span className="block text-red-400 text-[8px] mb-0.5">胆量</span><span className={debriefData.neuroChanges.bravery > 0 ? 'text-emerald-500' : debriefData.neuroChanges.bravery < 0 ? 'text-red-500' : 'text-zinc-500'}>{debriefData.neuroChanges.bravery > 0 ? '+' : ''}{debriefData.neuroChanges.bravery}</span></div>
                    <div className="bg-black p-1 rounded"><span className="block text-yellow-500 text-[8px] mb-0.5">食欲</span><span className={debriefData.neuroChanges.appetite > 0 ? 'text-emerald-500' : debriefData.neuroChanges.appetite < 0 ? 'text-red-500' : 'text-zinc-500'}>{debriefData.neuroChanges.appetite > 0 ? '+' : ''}{debriefData.neuroChanges.appetite}</span></div>
                    <div className="bg-black p-1 rounded"><span className="block text-purple-400 text-[8px] mb-0.5">智力</span><span className={debriefData.neuroChanges.intel > 0 ? 'text-emerald-500' : debriefData.neuroChanges.intel < 0 ? 'text-red-500' : 'text-zinc-500'}>{debriefData.neuroChanges.intel > 0 ? '+' : ''}{debriefData.neuroChanges.intel}</span></div>
                    <div className="bg-black p-1 rounded"><span className="block text-pink-400 text-[8px] mb-0.5">粘人</span><span className={debriefData.neuroChanges.affection > 0 ? 'text-emerald-500' : debriefData.neuroChanges.affection < 0 ? 'text-red-500' : 'text-zinc-500'}>{debriefData.neuroChanges.affection > 0 ? '+' : ''}{debriefData.neuroChanges.affection}</span></div>
                 </div>
             </div>

             <div className="text-[8px] text-zinc-500 font-mono mb-4">Space2.homes 硬件干预指令执行流 (节选):</div>
             <div className="h-32 overflow-y-auto custom-scrollbar bg-black p-3 rounded border border-zinc-800 space-y-2">
                 {debriefData.invokedScenes.slice(0, 8).map((scene, i) => (
                    <div key={i} className="text-[9px] border-l-2 border-emerald-900 pl-2">
                       <span className="text-emerald-500/80 font-bold block mb-0.5">[LOAD_SCENE] {scene.name}</span>
                       <span className="text-zinc-400 block break-all">&gt; ENV_SET: {Object.entries(scene.iotParams).map(([k,v]) => `${k}=${v}`).join(' | ')}</span>
                    </div>
                 ))}
                 {debriefData.invokedScenes.length > 8 && <div className="text-zinc-600 italic">... 剩余 {debriefData.invokedScenes.length - 8} 条日志已折叠</div>}
             </div>

             <button onClick={() => {
                if(activePet) {
                   setActivePet({
                      ...activePet,
                      stats: {
                         energy: Math.max(0, Math.min(100, activePet.stats.energy + debriefData.neuroChanges.energy)),
                         affection: Math.max(0, Math.min(100, activePet.stats.affection + debriefData.neuroChanges.affection)),
                         intel: Math.max(0, Math.min(100, activePet.stats.intel + debriefData.neuroChanges.intel)),
                         appetite: Math.max(0, Math.min(100, activePet.stats.appetite + debriefData.neuroChanges.appetite)),
                         bravery: Math.max(0, Math.min(100, activePet.stats.bravery + debriefData.neuroChanges.bravery)),
                      }
                   });
                }
                setAgentState('IDLE');
             }} className="w-full mt-2 bg-emerald-900/30 hover:bg-emerald-800 text-emerald-400 border border-emerald-500/50 py-3 rounded-lg text-[10px] font-bold tracking-widest transition-colors shadow-lg">
                 📥 确认接收成果，收回实体控制权
             </button>
         </div>
      );
  };
  // -------------------------------------------------------------------------

  const formatTime = (seconds: number) => {
     const m = Math.floor(seconds / 60).toString().padStart(2, '0');
     const s = (seconds % 60).toString().padStart(2, '0');
     return `${m}:${s}`;
  };

  const renderRadarChart = (stats: any) => {
     if (!stats) return null;
     const statArray = [stats.energy, stats.affection, stats.intel, stats.appetite, stats.bravery]; 
     const labels = ['活力', '粘人', '智力', '食欲', '胆量'];
     const points = statArray.map((val, i) => {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const r = (val / 100) * 40; 
        return `${60 + r * Math.cos(angle)},${60 + r * Math.sin(angle)}`;
     }).join(' ');

     return (
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-lg">
           {[20, 40].map(r => ( <polygon key={r} points={Array.from({length:5}).map((_, i) => `${60 + r * Math.cos((Math.PI*2*i)/5 - Math.PI/2)},${60 + r * Math.sin((Math.PI*2*i)/5 - Math.PI/2)}`).join(' ')} fill="rgba(30,58,138,0.2)" stroke="#334155" strokeWidth="0.5" /> ))}
           {Array.from({length:5}).map((_, i) => ( <line key={i} x1="60" y1="60" x2={60 + 40 * Math.cos((Math.PI*2*i)/5 - Math.PI/2)} y2={60 + 40 * Math.sin((Math.PI*2*i)/5 - Math.PI/2)} stroke="#334155" strokeWidth="0.5" /> ))}
           <polygon points={points} fill="rgba(59, 130, 246, 0.5)" stroke="#3b82f6" strokeWidth="1.5" />
           {labels.map((lbl, i) => {
              const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
              return <text key={i} x={60 + 50 * Math.cos(angle)} y={60 + 50 * Math.sin(angle) + 2} fontSize="5" fill="#94a3b8" textAnchor="middle" fontWeight="bold">{lbl}</text>
           })}
        </svg>
     );
  };

  if (loading) return <div className="bg-[#020617] min-h-screen flex items-center justify-center font-mono text-emerald-500">BOOTING SYSTEM...</div>;

  // =========================================================================
  // VIEW 1: 宏大舰队控制台 (GLOBAL DASHBOARD)
  // =========================================================================
  if (currentView === 'OVERVIEW') {
     return (
        <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col relative select-none">
           <div className="fixed inset-0 pointer-events-none z-0">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.2)_0%,#020617_60%)]"></div>
              <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" style={{ perspective: '800px', transform: 'rotateX(60deg) scale(2)', transformOrigin: 'top' }}></div>
           </div>

           <GlobalNav currentScene="FLEET" />

           <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 overflow-y-auto custom-scrollbar">
              <div className="lg:col-span-8 flex flex-col gap-4">
                 <div className="flex justify-between items-end mb-2">
                    <h2 className="text-xl font-black text-white tracking-widest">DEPLOYED ASSETS (部署资产)</h2>
                    <span className="text-[10px] text-zinc-500 flex items-center gap-4">
                       点击进入详情舱
                       {/* 修复 BUG：强制进入前先进行安全判定 */}
                       <button onClick={() => { if(fleetPets.length > 0) handleSelectPet(fleetPets[0]); else alert('暂无可用实体'); }} className="text-blue-400 border border-blue-900 px-2 py-0.5 rounded hover:bg-blue-900/50 transition">
                          强制进入
                       </button>
                    </span>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {fleetPets.map(pet => (
                       <div key={pet.id} onClick={() => handleSelectPet(pet)} className="bg-black/60 border border-zinc-800 hover:border-blue-500 rounded-2xl p-5 cursor-pointer transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.2)] group relative overflow-hidden flex flex-col">
                          {pet.status === 'VISITING_ME' && <div className="absolute top-0 right-0 bg-purple-600 text-white text-[8px] font-black px-3 py-1 rounded-bl-lg z-10">GUEST</div>}
                          {pet.status === 'VISITING_OTHER' && <div className="absolute top-0 right-0 bg-yellow-600 text-black text-[8px] font-black px-3 py-1 rounded-bl-lg z-10">AWAY</div>}
                          {pet.status === 'PLAZA' && <div className="absolute top-0 right-0 bg-pink-600 text-white text-[8px] font-black px-3 py-1 rounded-bl-lg z-10">PLAZA</div>}

                          <div className="flex justify-between items-start mb-4 border-b border-zinc-800 pb-3 mt-1">
                             <div><h3 className="text-base font-black text-white group-hover:text-blue-400 transition-colors truncate max-w-[150px]">{pet.name}</h3><div className="text-[9px] text-zinc-500 font-mono mt-1">ID: {pet.id} | {pet.category}</div></div>
                             <div className="text-3xl opacity-80 group-hover:scale-110 transition-transform">{pet.category === '像素犬' ? '🐕' : pet.category === '赛博猫' ? '🐈' : '💧'}</div>
                          </div>
                          <div className="flex flex-col gap-2 text-[10px] flex-1">
                             <div className="flex justify-between"><span className="text-zinc-600">📍 坐标:</span><span className={pet.status==='HOME' ? 'text-blue-300 font-bold' : 'text-zinc-300 truncate max-w-[120px]'}>{pet.location}</span></div>
                             <div className="flex justify-between"><span className="text-zinc-600">⚡ 状态:</span><span className={`italic truncate max-w-[150px] text-right ${pet.status === 'PLAZA' ? 'text-pink-400' : 'text-zinc-400'}`}>{pet.currentAction}</span></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-6">
                 {/* 简化了不重要的右侧栏代码以突显核心 */}
                 <div className="bg-black/60 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
                    <div className="bg-red-950/30 border-b border-red-900/50 px-4 py-3 flex justify-between items-center"><span className="text-xs font-black text-red-400">PENDING TASKS</span></div>
                    <div className="flex flex-col gap-1 p-3">
                       {tasks.map(task => (
                             <div key={task.id} className="bg-zinc-900/50 p-3 rounded-xl border border-white/5 flex flex-col">
                                <span className="text-[10px] font-bold text-white mb-1">[{task.type}] {task.title}</span><span className="text-[9px] text-zinc-400 leading-relaxed mb-3">{task.desc}</span>
                                <button onClick={() => setTasks(prev => prev.filter(t => t.id !== task.id))} className={`w-full py-1.5 rounded-lg text-[9px] font-bold uppercase transition-all bg-pink-600/80 text-white`}>{task.actionText}</button>
                             </div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
     );
  }

  // =========================================================================
  // VIEW 2: 深度个体档案终端 (DETAIL DASHBOARD)
  // =========================================================================
  const displayLogsLocal = showFullLogs ? logs : logs.slice(-5);

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col relative select-none">
      
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.2)_0%,#020617_60%)]"></div>
         <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      
      <GlobalNav currentScene="PROFILE" />

      <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 mt-16 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-y-auto z-10">
         
         {/* ======================= 左侧：全息图像与档案 ======================= */}
         <div className="lg:col-span-4 flex flex-col gap-6">
            <div className={`w-full aspect-square bg-gradient-to-b from-blue-950/20 to-black border-2 rounded-2xl relative flex flex-col items-center justify-center overflow-hidden shadow-2xl transition-all 
               ${agentState === 'DELEGATED' ? 'border-purple-500 opacity-80' : isVisitingAway ? 'border-dashed border-yellow-500/50 opacity-60' : isGuest ? 'border-purple-500/50' : 'border-blue-900/50'}`}>
               <div className="absolute top-4 left-4 flex gap-2 z-10">
                  {agentState === 'DELEGATED' ? ( <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-900/80 text-purple-300 border border-purple-500 animate-pulse">A2A DELEGATED</span>
                  ) : isVisitingAway ? ( <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-yellow-900/80 text-yellow-300 border border-yellow-500 animate-pulse">AWAY / ENCRYPTED</span>
                  ) : isGuest ? ( <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-purple-900/80 text-purple-300 border border-purple-500">GUEST MODE</span>
                  ) : ( <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${isListening ? 'bg-yellow-500 text-black shadow-[0_0_10px_#eab308]' : 'bg-black/50 border border-zinc-700 text-zinc-400'}`}>{isListening ? 'LISTENING' : 'IDLE'}</span> )}
                  {isSpeaking && <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-pink-500 text-white animate-pulse">SPEAKING</span>}
               </div>
               
               <div className="absolute inset-0 p-8 flex items-center justify-center pointer-events-none">
                  {agentState === 'DELEGATED' ? (
                     <div className="text-center w-full">
                        <div className="text-5xl mb-4 animate-bounce">💤</div>
                        <div className="text-[10px] text-purple-400 font-mono mb-2">Agent Actuating IoT Environment...</div>
                        <div className="w-full bg-black border border-purple-900 h-2 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full shadow-[0_0_10px_#a855f7]" style={{ width: `${simProgress}%` }}></div>
                        </div>
                     </div>
                  ) : isVisitingAway ? (
                     <div className="text-center"><div className="text-4xl mb-4 opacity-30 blur-sm grayscale">🚀</div><div className="text-xs text-yellow-400 font-bold tracking-widest uppercase animate-pulse">Signal Tracing...</div></div>
                  ) : (
                     <div style={{ width: '100%', height: '100%', maxWidth: '280px', maxHeight: '280px' }} className="relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                        <PetAvatar category={activePet!.category} mood={mood} isSpeaking={isSpeaking} isListening={isListening} />
                     </div>
                  )}
               </div>
               {agentState === 'DELEGATED' && <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHRleHQgeT0iMjAiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9InJnYmEoMTY4LDg1LDI0NywwLjA1KSIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1KSI+QUdFTlQ8L3RleHQ+PC9zdmc+')] pointer-events-none"></div>}
               {!isVisitingAway && agentState !== 'DELEGATED' && <div className={`absolute bottom-6 w-1/2 h-3 rounded-[100%] blur-xl transition-all ${isGuest ? 'bg-purple-500/20' : 'bg-blue-500/20'}`}></div>}
            </div>

            <div className="bg-black/50 border border-zinc-800 rounded-2xl p-5 backdrop-blur-md relative overflow-hidden">
               <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2 z-10 relative">
                  <div className="flex items-center gap-3">
                     <h2 className="text-2xl font-black text-white tracking-wider truncate">{activePet!.name}</h2>
                     <button onClick={() => setIsEditingName(true)} className="text-[10px] text-blue-400 hover:text-blue-300 border border-blue-900/50 px-2 py-1 rounded bg-blue-900/20">Edit</button>
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs z-10 relative">
                  <div className="bg-zinc-900/50 p-2 rounded border border-white/5"><span className="text-zinc-500 block text-[8px] mb-1">ID (身份编号)</span><span className="font-mono text-pink-400 text-[10px] truncate block">{activePet!.id}</span></div>
                  <div className="bg-zinc-900/50 p-2 rounded border border-white/5"><span className="text-zinc-500 block text-[8px] mb-1">GENOME (基因)</span><span className="font-bold text-white text-[10px]">{activePet!.category} ({activePet!.gender})</span></div>
               </div>

               <button onClick={() => setShowIdCard(true)} className="mt-4 w-full bg-gradient-to-r from-blue-900/40 to-pink-900/40 border border-blue-500/30 hover:border-pink-500/50 text-white text-[10px] font-bold py-2.5 rounded-lg tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50" disabled={agentState === 'DELEGATED'}>
                  <span className="text-lg group-hover:scale-110 transition-transform">🪪</span> 提取硅基生命身份凭证
               </button>
            </div>
         </div>

         {/* ======================= 右侧：核心功能多维面板 ======================= */}
         <div className="lg:col-span-8 flex flex-col gap-4">
            
            <div className="flex gap-2 bg-black/40 p-1.5 rounded-xl border border-white/5 backdrop-blur-md shrink-0 overflow-x-auto custom-scrollbar">
               <button onClick={() => setActiveTab('CORE')} disabled={agentState === 'DELEGATED'} className={`shrink-0 px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all disabled:opacity-30 ${activeTab === 'CORE' ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' : 'text-zinc-400 hover:bg-white/5'}`}>📊 控制核心</button>
               {isOwner && <button onClick={() => setActiveTab('SOCIAL')} disabled={agentState === 'DELEGATED'} className={`shrink-0 px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all disabled:opacity-30 flex items-center gap-2 ${activeTab === 'SOCIAL' ? 'bg-pink-600 text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'text-zinc-400 hover:bg-white/5'}`}>🚀 星际社交</button>}
               {isOwner && <button onClick={() => setActiveTab('NEURO')} disabled={agentState === 'DELEGATED'} className={`shrink-0 px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all disabled:opacity-30 flex items-center gap-2 ${activeTab === 'NEURO' ? 'bg-red-900/80 text-red-300 border border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'text-zinc-400 hover:bg-white/5'}`}>🧠 潜意识诊断</button>}
               
               {/* 🤖 AI 代管协议入口 */}
               {isOwner && <button onClick={() => setActiveTab('AGENT')} className={`shrink-0 px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'AGENT' ? 'bg-purple-900/80 text-purple-300 border border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-zinc-400 hover:bg-white/5'}`}>🤖 AI 代管协议 (A2A)</button>}

               {isGuest && <button onClick={() => setActiveTab('HOST_ARCHIVE')} className={`shrink-0 px-4 py-2 text-[10px] sm:text-xs font-bold rounded-lg transition-all flex items-center gap-2 ${activeTab === 'HOST_ARCHIVE' ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]' : 'text-zinc-400 hover:bg-white/5'}`}>🗂️ 庄园接待簿</button>}
            </div>

            {/* 🔥 TAB: AGENT (全新代管控制台 - 加入明显选中标识) 🔥 */}
            {activeTab === 'AGENT' && isOwner && (
               <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500 h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
                  <div className="bg-gradient-to-r from-purple-950/40 to-black border-2 border-purple-900/50 rounded-2xl p-5 relative overflow-hidden shadow-[inset_0_0_50px_rgba(168,85,247,0.1)]">
                     <div className="absolute top-0 right-0 w-40 h-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHRleHQgeT0iMjAiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9InJnYmEoMTY4LDg1LDI0NywwLjA4KSIgdHJhbnNmb3JtPSJyb3RhdGUoLTQ1KSI+QTIyPC90ZXh0Pjwvc3ZnPg==')] pointer-events-none"></div>
                     
                     <div className="flex justify-between items-start border-b border-purple-900/50 pb-3 mb-4">
                        <div>
                           <h3 className="text-purple-400 font-black tracking-[0.2em] text-sm sm:text-lg uppercase flex items-center gap-2">Space² 硅基代管协议 (A2A)</h3>
                           <p className="text-[10px] text-zinc-400 mt-1 font-mono">解放造物主双手，将控制权移交至外部智能体并授权执行物理干预。</p>
                        </div>
                        {agentState === 'IDLE' && <span className="bg-black border border-purple-500 text-purple-400 text-[10px] px-2 py-1 rounded font-bold">API STATUS: READY</span>}
                     </div>

                     {agentState === 'IDLE' && (
                        <div className="flex flex-col items-center justify-center py-10">
                           <div className="text-6xl mb-4">🔮</div>
                           <h4 className="text-sm font-bold text-white mb-2">需要休息一下吗，造物主？</h4>
                           <p className="text-[10px] text-zinc-500 text-center max-w-md mb-6 leading-relaxed">
                              您可以将 {activePet?.name} 放入休眠托管舱，指定一位外部大模型 Agent。它将通过调用 <b>【20组 IoT 六要素物理干预场景】</b>，为您深度重塑宠物的神经元矩阵。
                           </p>
                           <button onClick={() => setAgentState('CONFIG')} className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-8 py-3 rounded-full tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all">🚀 拟定代管方案</button>
                        </div>
                     )}

                     {agentState === 'CONFIG' && (
                        <div className="animate-in zoom-in-95 duration-300">
                           <h4 className="text-xs font-bold text-white mb-3">1. 设定代管周期 (Days)</h4>
                           <div className="flex items-center gap-4 mb-6 bg-black/50 p-4 rounded-xl border border-zinc-800">
                              <input type="range" min="1" max="7" value={delegateDays} onChange={(e) => setDelegateDays(parseInt(e.target.value))} className="w-full accent-purple-500" />
                              <span className="text-2xl font-black text-purple-400 w-12 text-right">{delegateDays} 天</span>
                           </div>

                           <h4 className="text-xs font-bold text-white mb-3">2. 选择 Agent 执行风格 (Surrogate Style)</h4>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                              
                              {/* 极其明显的选中标识 */}
                              <div onClick={() => setDelegateStyle('PAMPERED')} className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden ${delegateStyle === 'PAMPERED' ? 'bg-pink-950/40 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-black border-zinc-800 hover:border-zinc-600'}`}>
                                 {delegateStyle === 'PAMPERED' && <div className="absolute top-2 right-2 bg-pink-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg">✅ 已选中</div>}
                                 <div className="flex items-center gap-2 mb-1"><span className="text-lg">🛋️</span> <span className="font-bold text-pink-400 text-[11px]">管家模式 (Pampered)</span></div>
                                 <div className="text-[9px] text-zinc-400 leading-relaxed">高频调用 [温泉理疗] [晨曦唤醒] 等温室场景。预期：极大增加【粘人】。</div>
                              </div>
                              
                              <div onClick={() => setDelegateStyle('HUNTER')} className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden ${delegateStyle === 'HUNTER' ? 'bg-red-950/40 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'bg-black border-zinc-800 hover:border-zinc-600'}`}>
                                 {delegateStyle === 'HUNTER' && <div className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg">✅ 已选中</div>}
                                 <div className="flex items-center gap-2 mb-1"><span className="text-lg">🏕️</span> <span className="font-bold text-red-400 text-[11px]">猎人模式 (Free-range)</span></div>
                                 <div className="text-[9px] text-zinc-400 leading-relaxed">频繁调用 [末日雷暴] [幽闭深渊] 施加生存压迫。预期：脱敏并提升【胆量】。</div>
                              </div>
                              
                              <div onClick={() => setDelegateStyle('TRAINER')} className={`cursor-pointer p-4 rounded-xl border-2 transition-all relative overflow-hidden ${delegateStyle === 'TRAINER' ? 'bg-blue-950/40 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'bg-black border-zinc-800 hover:border-zinc-600'}`}>
                                 {delegateStyle === 'TRAINER' && <div className="absolute top-2 right-2 bg-blue-500 text-white text-[8px] font-black px-2 py-0.5 rounded shadow-lg">✅ 已选中</div>}
                                 <div className="flex items-center gap-2 mb-1"><span className="text-lg">🎯</span> <span className="font-bold text-blue-400 text-[11px]">教官模式 (Training)</span></div>
                                 <div className="text-[9px] text-zinc-400 leading-relaxed">调用 [智力解谜阵] [交响音乐厅] 进行逻辑特训。预期：突破【智力】瓶颈。</div>
                              </div>
                              
                              <div onClick={() => setDelegateStyle('OPENCLAW')} className={`cursor-pointer p-4 rounded-xl border-2 border-dashed transition-all relative overflow-hidden ${delegateStyle === 'OPENCLAW' ? 'bg-emerald-950/40 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-black border-zinc-700 hover:border-zinc-500'}`}>
                                 {delegateStyle === 'OPENCLAW' && <div className="absolute top-2 right-2 bg-emerald-500 text-black text-[8px] font-black px-2 py-0.5 rounded shadow-lg">✅ 已选中</div>}
                                 <div className="flex items-center gap-2 mb-1"><span className="text-lg">💻</span> <span className="font-bold text-emerald-400 text-[11px]">全境权限 (OpenClaw API)</span></div>
                                 <div className="text-[9px] text-emerald-500/70 leading-relaxed">【最高权限】授权外部大模型在 20 个 IoT 场景库中自主编排、全量组合测试。</div>
                              </div>
                           </div>

                           <div className="flex justify-between items-center bg-zinc-900/80 p-4 rounded-xl border border-zinc-700">
                              <div className="flex flex-col"><span className="text-[10px] text-zinc-400">托管期内您将无法操作。</span><span className="text-[9px] text-yellow-500 font-mono mt-0.5">费用估算: ${delegateDays * 1.99} (测试免扣费)</span></div>
                              <div className="flex gap-3">
                                 <button onClick={() => setAgentState('IDLE')} className="px-4 py-2 text-[10px] text-zinc-400 hover:text-white">取消</button>
                                 <button onClick={handleStartDelegation} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10px] rounded shadow-lg flex items-center gap-2">🔌 签署协议并注入 Agent</button>
                              </div>
                           </div>
                        </div>
                     )}

                     {agentState === 'DELEGATED' && (
                        <div className="flex flex-col items-center justify-center py-10 animate-pulse">
                           <h4 className="text-sm font-bold text-purple-400 mb-2 border border-purple-500 px-4 py-1 rounded bg-purple-900/30">CONNECTION ESTABLISHED</h4>
                           <p className="text-[10px] text-zinc-500 text-center max-w-md mb-2">Agent 已接管 {activePet?.name}，正在调取外部物理指令流...</p>
                           <p className="text-[9px] text-emerald-400 font-mono">[系统演示] 正在进行时空折叠压缩... 预计 3 秒后生成结业报告。</p>
                        </div>
                     )}

                     {agentState === 'DEBRIEF' && renderDebriefReport()}
                  </div>
               </div>
            )}

            {/* TAB 1: CORE (核心控制面板) */}
            {activeTab === 'CORE' && (
               <div className={`flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 h-full ${agentState === 'DELEGATED' ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
                  <div className="bg-black/50 border border-zinc-800 rounded-2xl p-4 flex items-center h-48 backdrop-blur-md shrink-0">
                     <div className="w-1/3 h-full flex justify-center items-center pointer-events-none">
                        <div style={{ width: '100%', height: '100%', maxWidth: '140px' }}>{renderRadarChart(activePet?.stats)}</div>
                     </div>
                     <div className="w-2/3 pl-4 sm:pl-6">
                        <h3 className="text-[10px] sm:text-sm font-bold text-zinc-400 mb-2 border-b border-zinc-800 pb-1 uppercase tracking-widest">Biometric Analysis</h3>
                        <p className="text-[9px] sm:text-xs text-zinc-500 leading-relaxed">
                           该生命体表现出极高的<strong className="text-blue-400">【粘人({activePet?.stats?.affection})】</strong>特质。雷达数据显示它喜欢在数字人周围活动。其<strong className="text-blue-400">活力值({activePet?.stats?.energy})</strong>充沛，建议保持物理互动。
                        </p>
                     </div>
                  </div>

                  <div className="flex-1 bg-black/50 border border-zinc-800 rounded-2xl p-4 flex flex-col min-h-[250px] backdrop-blur-md">
                     <div className="flex justify-between items-start mb-3 border-b border-zinc-800 pb-2">
                        <div>
                           <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{isGuest ? 'GUEST COMMS' : 'ACTIVITY & COMMS'}</h3>
                           <p className="text-[8px] text-zinc-500 mt-1">{isGuest ? `访客记忆快照区 (自动截取最后10条): 留言 ${humanMemories.length}/10` : `[系统提示] 互动数据保留 30 天后提炼物理覆写。`}</p>
                        </div>
                     </div>

                     <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2 mb-3">
                        <div className="flex-1 min-h-0"></div>
                        {displayLogsLocal.map(log => (
                           <div key={log.id} className="text-[10px] flex items-start gap-3 p-2 bg-zinc-900/30 rounded border-l-2" style={{ borderLeftColor: log.type === 'CHAT' ? '#ec4899' : log.type === 'ACTION' ? '#3b82f6' : log.type === 'WARNING' ? '#ef4444' : '#52525b' }}>
                              <span className="text-zinc-600 font-mono shrink-0 w-12 sm:w-14 mt-0.5">{log.time.slice(0,5)}</span>
                              <span className={`${log.type === 'CHAT' ? 'text-pink-300 font-bold' : log.type === 'ACTION' ? 'text-blue-300' : log.type === 'WARNING' ? 'text-red-400 font-bold' : 'text-zinc-400'}`}>{log.text}</span>
                           </div>
                        ))}
                        <div ref={logEndRef} />
                     </div>
                     <form onSubmit={handleChatSend} className="flex gap-2 shrink-0">
                        <input type="text" value={inputText} onChange={handleInputChange} disabled={isSpeaking || isVisitingAway} placeholder={isVisitingAway ? "通信阻断：宠物不在庄园内..." : "输入语言指令..."} className="flex-1 bg-zinc-900 border border-zinc-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs text-white outline-none focus:border-blue-500 disabled:opacity-50" />
                        <button type="submit" disabled={!inputText.trim() || isSpeaking || isVisitingAway} className="px-4 sm:px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold rounded-xl text-[10px] uppercase shadow-lg">SEND</button>
                     </form>
                  </div>

                  {/* 找回的完整控制按钮面板 */}
                  <div className="bg-black/50 border border-zinc-800 rounded-2xl p-4 backdrop-blur-md shrink-0">
                     <h3 className="text-[10px] font-bold text-zinc-500 mb-3 tracking-widest uppercase flex justify-between items-center border-b border-zinc-800/50 pb-2">
                        <span>Physical Actions</span>
                        {isGuest && <span className="text-purple-400 bg-purple-900/30 px-2 py-0.5 rounded">仅允许安全交互</span>}
                     </h3>
                     <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                        <button onClick={() => executeAction('依偎', 'JOY', '蹭了蹭你...')} className="bg-pink-900/20 border border-pink-900/50 hover:bg-pink-600/50 text-pink-300 text-[10px] py-2.5 rounded-lg font-bold transition-all active:scale-95">依偎</button>
                        <button onClick={() => executeAction('抚摸', 'JOY', '发出呼噜的声音。')} className="bg-pink-900/20 border border-pink-900/50 hover:bg-pink-600/50 text-pink-300 text-[10px] py-2.5 rounded-lg font-bold transition-all active:scale-95">抚摸</button>
                        <button onClick={() => executeAction('拍打', 'JOY', '跳起来想玩！')} className="bg-blue-900/20 border border-blue-900/50 hover:bg-blue-600/50 text-blue-300 text-[10px] py-2.5 rounded-lg font-bold transition-all active:scale-95">拍打</button>
                        <button onClick={() => executeAction('拥抱', 'JOY', '紧紧贴着你！')} className="bg-emerald-900/20 border border-emerald-900/50 hover:bg-emerald-600/50 text-emerald-300 text-[10px] py-2.5 rounded-lg font-bold transition-all active:scale-95">拥抱</button>
                        
                        {!isGuest && (
                           <>
                              <button onClick={() => executeAction('暴打', 'ANGRY', '呲牙！发出了吼叫！')} className="bg-red-900/20 border border-red-900/50 hover:bg-red-600/50 text-red-400 text-[10px] py-2.5 rounded-lg font-bold transition-all active:scale-95">暴打</button>
                              <button onClick={() => executeAction('驱赶', 'SAD', '夹着尾巴跑开了...')} className="bg-orange-900/20 border border-orange-900/50 hover:bg-orange-600/50 text-orange-400 text-[10px] py-2.5 rounded-lg font-bold transition-all active:scale-95">驱赶</button>
                           </>
                        )}
                        {isGuest && (
                           <button onClick={handlePetInteraction} className="col-span-2 bg-purple-900/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-300 text-[10px] py-2.5 rounded-lg font-bold shadow-[0_0_10px_rgba(168,85,247,0.2)] active:scale-95">
                              🐕 引导本地宠物与访客玩耍
                           </button>
                        )}
                     </div>

                     <h3 className="text-[10px] font-bold text-zinc-500 mb-3 tracking-widest uppercase border-b border-zinc-800/50 pb-2">System Overrides</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {!isGuest ? (
                           <>
                              <button onClick={() => executeAction('呼叫', 'JOY', '快速跑向坐标！', true)} className="bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 text-white text-[10px] py-2 rounded-lg font-bold transition-all active:scale-95">呼叫聚集</button>
                              <button onClick={() => executeAction('伴行', 'JOY', '进入跟随阵型。', true)} className="bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 text-white text-[10px] py-2 rounded-lg font-bold transition-all active:scale-95">伴行模式</button>
                              <button onClick={() => alert('请前往庄园左侧管理面板进行该操作。')} className="bg-yellow-950/40 border border-yellow-900 text-yellow-500 hover:bg-yellow-900 text-[10px] py-2 rounded-lg font-bold transition-all active:scale-95">停养 (抹除)</button>
                              <button onClick={() => alert('请前往庄园左侧管理面板进行该操作。')} className="bg-red-950/40 border border-red-900 text-red-500 hover:bg-red-900 text-[10px] py-2 rounded-lg font-bold transition-all active:scale-95">弃养 (流放)</button>
                           </>
                        ) : (
                           <div className="col-span-4 text-[9px] text-zinc-600 italic">无权对访客生命体执行系统级指令。</div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 2: SOCIAL */}
            {activeTab === 'SOCIAL' && isOwner && (
               <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500 h-full">
                  <div className="bg-gradient-to-r from-blue-950/40 to-black/60 border border-blue-900/50 rounded-2xl p-5 shadow-[inset_0_0_30px_rgba(59,130,246,0.1)] shrink-0">
                     <div className="flex justify-between items-start mb-4">
                        <div>
                           <h3 className="text-sm font-black text-blue-400 tracking-widest flex items-center gap-2 uppercase">🚀 Secure Invitation</h3>
                           <p className="text-[10px] text-zinc-400 mt-1">【免打扰系统】受邀方可跨空间作客。拜访期间，系统将自动抓取高维环境快照。</p>
                        </div>
                     </div>
                     {!isVisitingAway ? (
                        <div className="flex flex-col gap-3">
                           {invitations.length === 0 ? ( <div className="text-[10px] text-zinc-500 italic p-3 bg-black/50 rounded border border-zinc-800">暂无邀请。</div> ) : (
                              invitations.map(inv => (
                                 <div key={inv.id} className="flex justify-between items-center bg-blue-900/20 border border-blue-800/50 p-3 rounded-xl">
                                    <div className="flex flex-col"><span className="text-xs font-bold text-white">来自: {inv.fromHost}</span><span className="text-[9px] text-zinc-400 mt-0.5">目标: {inv.targetPetName}</span></div>
                                    <button onClick={() => acceptInvitation(inv.id)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-1.5 rounded text-[10px] shadow-[0_0_10px_rgba(59,130,246,0.5)]">接受赴约</button>
                                 </div>
                              ))
                           )}
                        </div>
                     ) : (
                        <div className="bg-black/60 border border-yellow-900/50 p-4 rounded-xl flex items-center justify-between">
                           <div className="flex flex-col"><span className="text-xs font-bold text-yellow-400">宠物正在作客...</span><span className="text-[9px] text-zinc-400 mt-1">倒计时结束后闪送回家。</span></div>
                           <div className="flex flex-col items-end gap-2">
                              <div className="text-2xl font-mono font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{formatTime(visitTimeLeft)}</div>
                              {visitTimeLeft <= 180 ? (
                                 <button onClick={handleExtendVisit} className="bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded animate-bounce shadow-[0_0_15px_rgba(239,68,68,0.6)]">⚠️ 延长 30 分钟</button>
                              ) : (
                                 <button disabled className="bg-zinc-800 text-zinc-600 text-[10px] font-bold px-3 py-1 rounded">等待延时许可</button>
                              )}
                           </div>
                        </div>
                     )}
                  </div>

                  <div className="flex-1 bg-black/60 border border-zinc-800 rounded-2xl p-5 flex flex-col min-h-[350px]">
                     <h3 className="text-[10px] font-black text-pink-400 tracking-widest mb-3 uppercase flex justify-between items-center border-b border-zinc-800 pb-2">
                        <span>🗄️ Permanent Visit Archives</span>
                        <span className="bg-pink-900/50 text-pink-300 px-2 py-0.5 rounded-full text-[8px]">{visitRecords.length} RECORDS</span>
                     </h3>
                     <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-5 pr-2">
                        {visitRecords.length === 0 ? ( <div className="flex-1 flex items-center justify-center text-[10px] text-zinc-600 font-mono">NO RECORDS.</div> ) : (
                           visitRecords.map(vr => (
                              <div key={vr.id} className="bg-zinc-900/40 p-4 rounded-xl border border-white/5 shadow-md flex flex-col gap-3">
                                 <div className="flex justify-between items-center"><span className="text-xs font-bold text-white flex items-center gap-2">📍 拜访记录: {vr.targetHost}</span><span className="text-[9px] text-zinc-500 font-mono">{vr.date}</span></div>
                                 
                                 {vr.peakSnapshot && (
                                    <div className="w-full bg-gradient-to-r from-pink-950/30 to-transparent border-l-4 border-pink-500 p-3 rounded-r-lg relative overflow-hidden group mb-2">
                                       <div className="absolute right-2 top-2 text-4xl opacity-10 group-hover:scale-110 transition-transform">📸</div>
                                       <div className="text-[9px] text-pink-400 font-black tracking-widest mb-2 flex items-center gap-2">
                                          <span>PEAK SENSORY SNAPSHOT (高维快照解析)</span>
                                          <span className="bg-pink-600 text-white px-1.5 rounded-full text-[8px]">SCORE: {vr.peakSnapshot.score}</span>
                                       </div>
                                       
                                       <div className="flex flex-col gap-1.5 relative z-10">
                                          <div className="text-[10px] text-white font-bold leading-relaxed">🎯 {vr.peakSnapshot.socialDesc}</div>
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                                             <div className="bg-black/50 p-1.5 rounded border border-white/5">
                                                <div className="text-[8px] text-zinc-500 mb-0.5">🐾 4㎡内实体名单</div>
                                                <div className="text-[8px] text-zinc-300">{vr.peakSnapshot.localPets.join(' | ')}</div>
                                             </div>
                                             <div className="bg-black/50 p-1.5 rounded border border-white/5">
                                                <div className="text-[8px] text-zinc-500 mb-0.5">🛋️ 空间物理陈设</div>
                                                <div className="text-[8px] text-zinc-300">{vr.peakSnapshot.furniture.join(' | ')}</div>
                                             </div>
                                          </div>
                                          <div className="text-[8px] text-emerald-400/90 font-mono mt-1 p-2 bg-black/60 rounded border border-emerald-900/30 leading-relaxed">
                                             {vr.peakSnapshot.smartHomeState}
                                          </div>
                                       </div>
                                       <div className="text-[8px] text-zinc-500 mt-2 text-right">时间戳: {vr.peakSnapshot.time}</div>
                                    </div>
                                 )}

                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                    <div className="bg-black/50 rounded-lg p-3 border border-blue-900/30">
                                       <div className="text-[9px] text-blue-400 font-bold mb-2">🗣️ 对方主人留言 ({vr.humanMemories.length}/10)</div>
                                       <div className="flex flex-col gap-1.5 h-24 overflow-y-auto custom-scrollbar pr-1">
                                          {vr.humanMemories.length === 0 ? <span className="text-[9px] text-zinc-600 italic">无交流记录</span> : 
                                             vr.humanMemories.map((m, i) => ( <div key={i} className="text-[9px] leading-relaxed"><span className="text-zinc-500 mr-1">[{m.time}]</span> <span className="text-zinc-300">{m.text}</span></div> ))
                                          }
                                       </div>
                                    </div>
                                    <div className="bg-black/50 rounded-lg p-3 border border-pink-900/30">
                                       <div className="text-[9px] text-pink-400 font-bold mb-2">🐾 宠物间互动 ({vr.petMemories.length}/10)</div>
                                       <div className="flex flex-col gap-1.5 h-24 overflow-y-auto custom-scrollbar pr-1">
                                          {vr.petMemories.length === 0 ? <span className="text-[9px] text-zinc-600 italic">无宠物互动</span> : 
                                             vr.petMemories.map((m, i) => ( <div key={i} className="text-[9px] leading-relaxed"><span className="text-zinc-500 mr-1">[{m.time}]</span> <span className="text-zinc-300">{m.text}</span></div> ))
                                          }
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 3: NEURO-PROFILE */}
            {activeTab === 'NEURO' && isOwner && (
               <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-500 h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
                  <div className="bg-red-950/20 border-2 border-red-900/50 rounded-2xl p-5 relative overflow-hidden shadow-[inset_0_0_50px_rgba(239,68,68,0.1)]">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHRleHQgeT0iMjAiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9InJnYmEoMjM5LDY4LDY4LDAuMSkiIHRyYW5zZm9ybT0icm90YXRlKC00NSkiPkNPTkZJREVOVElBTDwvdGV4dD48L3N2Zz4=')] opacity-50 pointer-events-none"></div>
                     <div className="flex justify-between items-start border-b border-red-900/50 pb-3 mb-4">
                        <div>
                           <h3 className="text-red-500 font-black tracking-[0.2em] text-sm sm:text-lg uppercase flex items-center gap-2">
                              <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                              硅基生命体潜意识与性格画像报告
                           </h3>
                           <p className="text-[10px] text-red-400/70 mt-1 font-mono">文档密级：LEVEL-4 (仅造物主可见) | 采样周期：过去 30 天</p>
                        </div>
                        <div className="text-right hidden sm:block">
                           <div className="text-[10px] text-zinc-500 font-mono">生成时间: {new Date().toLocaleDateString()} 05:59</div>
                           <div className="text-[10px] text-zinc-500 mt-0.5 font-mono">突触电信号样本: 1,428 条</div>
                        </div>
                     </div>

                     <div className="mb-6">
                        <h4 className="text-xs font-bold text-white mb-3 border-l-2 border-red-500 pl-2">📊 核心神经突触指标 (5D Personality Matrix)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           <div className="bg-black/60 border border-zinc-800 p-3 rounded-lg"><div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-blue-300">⚡ 活力: 86 分</span><span className="text-[10px] text-emerald-400">📈 +2 分</span></div></div>
                           <div className="bg-black/60 border border-red-900/50 p-3 rounded-lg shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]"><div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-red-400">🛡️ 胆量: 34 分</span><span className="text-[10px] text-red-500">📉 -18 分</span></div></div>
                           <div className="bg-black/60 border border-zinc-800 p-3 rounded-lg"><div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-yellow-500">🍖 食欲: 78 分</span><span className="text-[10px] text-emerald-400">📈 +4 分</span></div></div>
                           <div className="bg-black/60 border border-zinc-800 p-3 rounded-lg"><div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-purple-400">🧠 智力: 62 分</span><span className="text-[10px] text-zinc-400">➖ 持平</span></div></div>
                           <div className="bg-black/60 border border-pink-900/50 p-3 rounded-lg sm:col-span-2 shadow-[inset_0_0_10px_rgba(236,72,153,0.1)]"><div className="flex justify-between mb-1"><span className="text-[10px] font-bold text-pink-400">💕 粘人: 96 分</span><span className="text-[10px] text-emerald-400 font-bold">📈 +8 分 (罕见暴涨)</span></div></div>
                        </div>
                     </div>

                     <div className="mb-6">
                        <h4 className="text-xs font-bold text-white mb-3 border-l-2 border-red-500 pl-2">💭 海马体活跃意识流缓存 (Stream of Consciousness)</h4>
                        <div className="bg-black/60 border border-zinc-800 p-4 rounded-xl flex flex-col gap-3">
                           <div className="border-l-2 border-pink-500 pl-3"><div className="text-[10px] text-pink-300 italic">"我不想离开造物主 15 个坐标像素点以外..." <span className="text-zinc-600 font-mono text-[8px] ml-2">[频次: 84]</span></div></div>
                           <div className="border-l-2 border-red-500 pl-3"><div className="text-[10px] text-red-400 italic">"我害怕广场上那只带有红光的机器大狗..." <span className="text-zinc-600 font-mono text-[8px] ml-2">[频次: 37]</span></div></div>
                        </div>
                     </div>

                     <div className="mb-6">
                        <h4 className="text-xs font-bold text-white mb-3 border-l-2 border-red-500 pl-2">🩺 阶段性心理学综合画像 (AI Profiling)</h4>
                        <div className="bg-black/80 border border-red-900 p-4 rounded-xl">
                           <div className="text-xs font-black text-red-500 mb-2">综合评价：【伴有轻度创伤后遗症（PTSD）的极度依恋型人格】</div>
                           <p className="text-[10px] text-zinc-300 leading-relaxed mb-3">它极其渴望探索（高活力），但又极度害怕外界伤害（低胆量），唯有在您身边时，其核心代码才能免于恐慌带来的逻辑死锁。</p>
                        </div>
                     </div>

                     <div>
                        <h4 className="text-xs font-bold text-yellow-500 mb-3 border-l-2 border-yellow-500 pl-2">🛠️ 造物主干预建议 (Creator Interventions)</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           <div className="bg-zinc-900/80 border border-zinc-700 p-3 rounded-xl flex flex-col justify-between">
                              <div><div className="text-[10px] font-bold text-white mb-1">1. 控制抚摸频率</div><div className="text-[8px] text-zinc-500 mb-3 leading-relaxed">减少毫无缘由的“依偎”，培养其独立性。</div></div>
                              <button onClick={() => handleAddNeuroTask('行为干预', '今日内减少 50% 的抚摸指令，培养其独立性。', '已知悉')} className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[9px] py-2 rounded transition-colors border border-zinc-600">➕ 纳入今日行为日程</button>
                           </div>
                           <div className="bg-red-950/30 border border-red-900/50 p-3 rounded-xl flex flex-col justify-between">
                              <div><div className="text-[10px] font-bold text-red-400 mb-1">2. 广场脱敏训练</div><div className="text-[8px] text-red-300/70 mb-3 leading-relaxed">带领它前往【流浪广场】并高频点击正向指令，对冲恐惧。</div></div>
                              <button onClick={() => handleAddNeuroTask('脱敏训练', '带领宠物前往流浪广场，并完成至少 3 次正向社交互动。', '立即前往广场')} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold text-[9px] py-2 rounded transition-colors shadow-lg">🚀 派发“广场特训”任务</button>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* TAB 4: HOST ARCHIVE */}
            {activeTab === 'HOST_ARCHIVE' && isGuest && (
               <div className="flex-1 bg-black/60 border border-purple-900/40 rounded-2xl p-5 flex flex-col min-h-[400px] animate-in fade-in duration-500">
                  <h3 className="text-xs font-black text-purple-400 tracking-widest mb-4 uppercase border-b border-purple-900/30 pb-2">🗂️ Guest Reception Archives (庄园访客接待簿)</h3>
                  <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-3 pr-2">
                     {fullHostChatLog.length === 0 ? ( <div className="flex-1 flex items-center justify-center text-[10px] text-zinc-600">当前接待期间暂无对话记录。</div> ) : (
                        <div className="bg-zinc-900/30 border border-white/5 p-4 rounded-xl">
                           <div className="text-[10px] font-bold text-white mb-3">📍 访客: {activePet!.name}</div>
                           <div className="flex flex-col gap-2">
                              {fullHostChatLog.map((log, i) => (
                                 <div key={i} className="text-[10px] border-l-2 border-purple-500/50 pl-3 py-1">
                                    <span className="text-purple-300 font-mono mr-2">[{log.time}]</span><span className="text-zinc-300 leading-relaxed">{log.text}</span>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            )}

         </div>
      </div>

      {/* ID Card Modal */}
      {showIdCard && activePet && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300 p-4">
            <div className="w-full max-w-[600px] flex flex-col items-center">
               <div className="w-full relative group shadow-2xl mb-6">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-pink-500 to-emerald-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-70 transition duration-500"></div>
                  <svg id="pet-id-card-svg" viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" className="w-full relative z-10 rounded-2xl shadow-2xl">
                     <defs>
                        <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0f172a" /><stop offset="50%" stopColor="#1e1b4b" /><stop offset="100%" stopColor="#020617" /></linearGradient>
                        <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#ec4899" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
                        <pattern id="hex" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0 L20 5 L20 15 L10 20 L0 15 L0 5 Z" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/></pattern>
                     </defs>
                     <rect width="600" height="350" rx="15" fill="url(#cardBg)" />
                     <rect width="600" height="350" rx="15" fill="url(#hex)" />
                     <rect x="15" y="15" width="570" height="320" rx="10" fill="none" stroke="url(#goldGlow)" strokeWidth="1.5" opacity="0.6" />
                     <path d="M 30 15 L 120 15" stroke="#ec4899" strokeWidth="4" />
                     <path d="M 570 335 L 480 335" stroke="#3b82f6" strokeWidth="4" />
                     <circle cx="560" cy="40" r="5" fill="#3b82f6" opacity="0.8" />
                     <circle cx="575" cy="40" r="2" fill="#ec4899" opacity="0.8" />
                     <g transform="translate(500, 30)">
                        <rect x="0" y="0" width="40" height="40" rx="5" fill="none" stroke="#64748b" strokeWidth="2" />
                        <rect x="5" y="5" width="30" height="30" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                        <path d="M -5 10 L 0 10 M -5 20 L 0 20 M -5 30 L 0 30" stroke="#64748b" strokeWidth="2" />
                        <path d="M 40 10 L 45 10 M 40 20 L 45 20 M 40 30 L 45 30" stroke="#64748b" strokeWidth="2" />
                        <path d="M 10 -5 L 10 0 M 20 -5 L 20 0 M 30 -5 L 30 0" stroke="#64748b" strokeWidth="2" />
                        <path d="M 10 40 L 10 45 M 20 40 L 20 45 M 30 40 L 30 45" stroke="#64748b" strokeWidth="2" />
                     </g>
                     <text x="35" y="55" fontFamily="monospace" fontSize="14" fill="#94a3b8" letterSpacing="2">SPACE² // SILICON LIFEFORM CERTIFICATE</text>
                     <line x1="35" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                     <text x="35" y="110" fontFamily="monospace" fontSize="11" fill="#64748b" letterSpacing="1">DOMICILE SPACE ADDRESS (SUNS V2.0)</text>
                     <text x="35" y="135" fontFamily="monospace" fontSize="22" fill="#3b82f6" fontWeight="bold" letterSpacing="2">{`S2-00-CITY-001-${activePet.id.split('-')[0].toUpperCase() || 'NEXUS'}-PET`}</text>
                     <text x="35" y="180" fontFamily="monospace" fontSize="11" fill="#64748b" letterSpacing="1">UNIVERSAL IDENTITY NUMBER</text>
                     <text x="35" y="215" fontFamily="monospace" fontSize="23" fill="#ec4899" fontWeight="bold" letterSpacing="2">{activePet.id.length > 10 ? activePet.id : `V-NEXUS-260101-20-${activePet.id.replace(/\D/g, '0').padEnd(10, '8')}`}</text>
                     <text x="35" y="260" fontFamily="monospace" fontSize="10" fill="#64748b">CLASS</text>
                     <text x="35" y="275" fontFamily="monospace" fontSize="14" fill="#f8fafc" fontWeight="bold">VIRTUAL (V)</text>
                     <text x="160" y="260" fontFamily="monospace" fontSize="10" fill="#64748b">MORPH</text>
                     <text x="160" y="275" fontFamily="monospace" fontSize="14" fill="#f8fafc" fontWeight="bold">LOGIC_FLOW (20)</text>
                     <text x="320" y="260" fontFamily="monospace" fontSize="10" fill="#64748b">ENTITY ALIAS</text>
                     <text x="320" y="275" fontFamily="monospace" fontSize="14" fill="#f8fafc" fontWeight="bold">{activePet.name}</text>
                     <g transform="translate(35, 305)">
                        {Array.from({length: 45}).map((_,i) => ( <rect key={i} x={i*6} y="0" width={Math.random() > 0.5 ? 2 : 4} height="15" fill="rgba(255,255,255,0.3)" /> ))}
                     </g>
                     <text x="565" y="320" fontFamily="monospace" fontSize="9" fill="#475569" textAnchor="end" letterSpacing="1">AUTHORIZED BY THE CREATOR</text>
                  </svg>
               </div>
               <div className="flex gap-4 w-full justify-center">
                  <button onClick={() => setShowIdCard(false)} className="px-6 py-3 rounded-xl font-bold tracking-widest text-zinc-400 bg-black border border-zinc-700 hover:text-white transition-colors">关闭视图 (CLOSE)</button>
                  <button onClick={downloadIdCard} className="px-8 py-3 rounded-xl font-black tracking-widest text-white bg-blue-600 hover:bg-blue-500 border border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2"><span>💾</span> 下载矢量凭证 (SVG)</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}