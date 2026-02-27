"use client";
import React, { useState, useEffect, useRef } from 'react';
import { PortraitPet } from '@/components/PortraitPet';
import { PortraitHuman } from '@/components/PortraitHuman';
import { PET_DIALOGUE_MATRIX } from '@/config/pet_genes';

interface Message {
  id: string;
  sender: 'HUMAN' | 'PET' | 'SYSTEM';
  text: string;
  timestamp: number;
}

export default function DeepDiveRoom() {
  const [loading, setLoading] = useState(true);
  
  const [avatarRole, setAvatarRole] = useState('HACKER');
  const [petData, setPetData] = useState<any>(null);

  const [humanMood, setHumanMood] = useState<'CALM'|'JOY'|'SAD'|'ANGRY'>('CALM');
  const [petMood, setPetMood] = useState<'CALM'|'JOY'|'SAD'|'ANGRY'>('CALM');
  const [humanSpeaking, setHumanSpeaking] = useState(false);
  const [petSpeaking, setPetSpeaking] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  
  const [transmissionPos, setTransmissionPos] = useState<number | null>(null); 
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 🔥 定义什么是“正在对话/交互中”（包括人在说、数据在传、宠物在说）
  const isInteracting = humanSpeaking || petSpeaking || transmissionPos !== null;

  useEffect(() => {
    const role = localStorage.getItem('space2_avatar_role') || 'HACKER';
    setAvatarRole(role);
    
    const targetId = localStorage.getItem('space2_interaction_target');
    let targetPet = null;
    if (targetId) {
      const adopted = JSON.parse(localStorage.getItem('space2_adopted_pets') || '[]');
      targetPet = adopted.find((p: any) => p.id === targetId);
    }
    if (!targetPet) {
      const main = JSON.parse(localStorage.getItem('space2_main_pet') || '{}');
      targetPet = main.id ? main : { id: 'sys-01', name: '初代测试体', category: '赛博猫', personality: 'ACTIVE' };
    }
    setPetData(targetPet);
    
    setMessages([{ id: 'sys-0', sender: 'SYSTEM', text: 'NEURAL LINK ESTABLISHED. 终端连接已建立。', timestamp: Date.now() }]);
    setLoading(false);
  }, []);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const generateAIResponse = (userText: string, petCategory: string) => {
    const text = userText.toLowerCase();
    let newMood: 'CALM' | 'JOY' | 'SAD' | 'ANGRY' = 'CALM';
    let reply = "...";
    const dict = PET_DIALOGUE_MATRIX[petCategory] || PET_DIALOGUE_MATRIX["像素犬"];

    if (text.includes("乖") || text.includes("喜欢") || text.includes("好") || text.includes("抱")) {
       newMood = 'JOY'; reply = dict['JOY'] ? dict['JOY'][Math.floor(Math.random() * dict['JOY'].length)] : "收到指令，心率加快！";
    } else if (text.includes("打") || text.includes("滚") || text.includes("坏") || text.includes("讨厌")) {
       newMood = 'SAD'; reply = dict['SAD'] ? dict['SAD'][Math.floor(Math.random() * dict['SAD'].length)] : "警告：检测到负面情绪...";
    } else if (text.includes("吃") || text.includes("饿")) {
       newMood = 'JOY'; reply = dict['EAT'] ? dict['EAT'][Math.floor(Math.random() * dict['EAT'].length)] : "能源补给模块激活！";
    } else if (text.includes("傻") || text.includes("笨")) {
       newMood = 'ANGRY'; reply = dict['ANGRY'] ? dict['ANGRY'][Math.floor(Math.random() * dict['ANGRY'].length)] : "错误！逻辑驳回！";
    } else {
       reply = dict['IDLE'] ? dict['IDLE'][Math.floor(Math.random() * dict['IDLE'].length)] : "正在分析您的语义...";
    }
    return { reply, mood: newMood };
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || humanSpeaking || petSpeaking) return;

    const userMsg = inputText.trim();
    setInputText('');

    setHumanSpeaking(true); setHumanMood('CALM');
    setMessages(prev => [...prev, { id: `h-${Date.now()}`, sender: 'HUMAN', text: userMsg, timestamp: Date.now() }]);
    const speakingDuration = Math.max(1500, userMsg.length * 150);

    setTimeout(() => {
       setHumanSpeaking(false);
       
       setTransmissionPos(0);
       let progress = 0;
       const transTimer = setInterval(() => {
          progress += 5;
          setTransmissionPos(progress);
          if (progress >= 100) {
             clearInterval(transTimer);
             setTransmissionPos(null);
             
             const ai = generateAIResponse(userMsg, petData.category);
             setPetMood(ai.mood); setPetSpeaking(true);
             setMessages(prev => [...prev, { id: `p-${Date.now()}`, sender: 'PET', text: ai.reply, timestamp: Date.now() }]);
             
             const petSpeakingDuration = Math.max(2000, ai.reply.length * 200);
             setTimeout(() => {
                setPetSpeaking(false);
                setTimeout(() => setPetMood('CALM'), 2000); 
             }, petSpeakingDuration);
          }
       }, 20);
    }, speakingDuration);
  };

  if (loading || !petData) return <div className="bg-[#020617] min-h-screen flex items-center justify-center font-mono text-blue-500">BOOTING TERMINAL...</div>;

  return (
    <div className="w-screen h-[100dvh] overflow-hidden bg-[#020617] text-white font-mono flex flex-col relative select-none">
      
      {/* ========================================================= */}
      {/* 🌌 全新立体深渊背景 (3D Perspective Floor) */}
      {/* ========================================================= */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex flex-col">
         {/* 上半部分：深空穹顶 */}
         <div className="h-[50%] w-full bg-[radial-gradient(ellipse_at_bottom,rgba(30,58,138,0.4)_0%,rgba(2,6,23,1)_80%)]"></div>
         
         {/* 下半部分：3D 赛博网格地板 */}
         <div className="h-[50%] w-full relative" style={{ perspective: '800px' }}>
            {/* 地平线发光带 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_20px_#3b82f6] z-10"></div>
            
            {/* 透视地板平面 */}
            <div 
               className="absolute top-0 left-[-50%] w-[200%] h-[200%] border-t border-blue-900/50"
               style={{ 
                  transform: 'rotateX(75deg) translateY(-50px)', 
                  transformOrigin: 'top center',
                  backgroundImage: `
                     linear-gradient(rgba(59,130,246,0.2) 2px, transparent 2px),
                     linear-gradient(90deg, rgba(59,130,246,0.2) 2px, transparent 2px)
                  `,
                  backgroundSize: '60px 60px',
                  backgroundColor: '#020617'
               }}
            >
               {/* 地板渐变暗化，融入深渊 */}
               <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent"></div>
            </div>
         </div>
      </div>

      {/* 🛡️ 顶栏 */}
      <div className="relative z-20 w-full h-16 px-4 sm:px-6 flex justify-between items-center bg-black/50 border-b border-blue-900/30 backdrop-blur-md shrink-0">
         <button onClick={() => window.location.href='/holodeck'} className="text-zinc-400 hover:text-white text-[10px] sm:text-xs font-bold uppercase transition-colors">
            ← Disconnect
         </button>
         <div className="text-[9px] sm:text-[10px] font-bold text-blue-400 tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span> 
            SYS.LINK_ACTIVE
         </div>
      </div>

      {/* ========================================================= */}
      {/* 🎭 3D 卡牌对峙舞台：纯物理横向布局 */}
      {/* ========================================================= */}
      <div 
         className="flex-1 w-full relative z-10"
         style={{ 
            display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'space-evenly', 
            perspective: '1500px', padding: '0 10px'
         }} 
      >
         
         {/* 🧑‍🚀 左侧：数字人卡牌 */}
         <div 
            style={{ 
               width: '40%', maxWidth: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column',
               // 🔥 核心动效：闲置时正视前方(0deg)，交互时卡牌向内倾斜注视对方(20deg)
               transform: isInteracting ? 'rotateY(20deg) translateZ(30px)' : 'rotateY(0deg) translateZ(0px)',
               opacity: isInteracting ? (humanSpeaking ? 1 : 0.8) : 0.9, 
               transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s',
               transformStyle: 'preserve-3d'
            }}
         >
            <div className={`w-full aspect-[3/4] rounded-xl sm:rounded-2xl border border-white/10 flex flex-col overflow-hidden backdrop-blur-xl transition-shadow duration-500
               ${humanSpeaking ? 'bg-blue-950/50 shadow-[0_0_80px_rgba(59,130,246,0.4)] border-blue-400/50' : 'bg-black/50 shadow-2xl'}
            `}>
               {/* 头部栏 */}
               <div className="h-6 sm:h-8 bg-white/5 w-full flex items-center px-2 sm:px-4 border-b border-white/10 shrink-0">
                  <div className="flex gap-1 sm:gap-1.5 mr-auto">
                     <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-red-500"></div><div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-yellow-500"></div><div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-zinc-400 font-bold uppercase tracking-widest truncate">{avatarRole}.EXE</span>
               </div>
               
               <div className="flex-1 w-full relative flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                  {humanSpeaking && <div className="absolute inset-0 bg-blue-500/10 animate-pulse"></div>}
                  {/* 静态翻转：人类原图朝左，我们让他静态朝右即可。不加动画，杜绝转圈。 */}
                  <div style={{ transform: 'scaleX(-1)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <PortraitHuman roleKey={avatarRole} mood={humanMood} isSpeaking={humanSpeaking} />
                  </div>
               </div>

               {/* 底部槽 */}
               <div className="h-8 sm:h-10 border-t border-white/5 flex items-center justify-center px-2 shrink-0 bg-black/40">
                  {humanSpeaking ? ( <div className="flex items-center gap-1 h-3 sm:h-4">{[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-0.5 sm:w-1 bg-blue-400 rounded-sm animate-bounce" style={{ height: `${Math.random()*100}%`, animationDelay: `${i*0.05}s` }}></div>)}</div>
                  ) : <span className="text-[8px] sm:text-[10px] text-zinc-600 truncate">IDLE_STATE</span>}
               </div>
            </div>
            {/* 地板投影 */}
            <div className={`mx-auto mt-4 w-3/4 h-2 rounded-[100%] blur-md transition-all ${isInteracting ? 'bg-blue-500/50' : 'bg-black/50'}`}></div>
         </div>


         {/* 🐾 右侧：宠物卡牌 */}
         <div 
            style={{ 
               width: '40%', maxWidth: '300px', flexShrink: 0, display: 'flex', flexDirection: 'column',
               // 🔥 核心动效：闲置时正视前方(0deg)，交互时卡牌向内倾斜注视对方(-20deg)
               transform: isInteracting ? 'rotateY(-20deg) translateZ(30px)' : 'rotateY(0deg) translateZ(0px)',
               opacity: isInteracting ? (petSpeaking ? 1 : 0.8) : 0.9, 
               transition: 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 0.5s',
               transformStyle: 'preserve-3d'
            }}
         >
            <div className={`w-full aspect-[3/4] rounded-xl sm:rounded-2xl border border-white/10 flex flex-col overflow-hidden backdrop-blur-xl transition-shadow duration-500
               ${petSpeaking ? 'bg-pink-950/50 shadow-[0_0_80px_rgba(236,72,153,0.4)] border-pink-400/50' : 'bg-black/50 shadow-2xl'}
            `}>
               {/* 头部栏 */}
               <div className="h-6 sm:h-8 bg-white/5 w-full flex items-center px-2 sm:px-4 border-b border-white/10 shrink-0">
                  <div className="flex gap-1 sm:gap-1.5 mr-auto">
                     <div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-zinc-700"></div><div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-zinc-700"></div><div className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-pink-500 animate-pulse"></div>
                  </div>
                  <span className="text-[8px] sm:text-[9px] text-zinc-400 font-bold uppercase tracking-widest truncate">{petData.name}.DAT</span>
               </div>
               
               <div className="flex-1 w-full relative flex items-center justify-center p-2 sm:p-6 overflow-hidden">
                  {petMood !== 'CALM' && !petSpeaking && (
                     <div className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-2xl animate-bounce drop-shadow-md z-20">
                        {petMood === 'JOY' ? '✨' : petMood === 'SAD' ? '🌧️' : '💢'}
                     </div>
                  )}
                  {petSpeaking && <div className="absolute inset-0 bg-pink-500/10 animate-pulse"></div>}
                  
                  {/* 静态原位：宠物原图就是朝左，不需要翻转 */}
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <PortraitPet category={petData.category} mood={petMood} isSpeaking={petSpeaking} />
                  </div>
               </div>

               {/* 底部槽 */}
               <div className="h-8 sm:h-10 border-t border-white/5 flex items-center justify-center px-2 shrink-0 bg-black/40">
                  {petSpeaking ? ( <div className="flex items-center gap-1 h-3 sm:h-4">{[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-0.5 sm:w-1 bg-pink-400 rounded-sm animate-bounce" style={{ height: `${Math.random()*100}%`, animationDelay: `${i*0.05}s` }}></div>)}</div>
                  ) : <span className="text-[8px] sm:text-[10px] text-zinc-600 truncate">IDLE_STATE</span>}
               </div>
            </div>
            {/* 地板投影 */}
            <div className={`mx-auto mt-4 w-3/4 h-2 rounded-[100%] blur-md transition-all ${isInteracting ? 'bg-pink-500/50' : 'bg-black/50'}`}></div>
         </div>

      </div>

      {/* ========================================================= */}
      {/* 💬 底部聊天气泡与输入控制台 */}
      {/* ========================================================= */}
      <div className="relative w-full shrink-0 flex flex-col items-center bg-gradient-to-t from-[#020617] via-black/90 to-transparent pt-8 pb-6 px-4 z-30">
         
         <div className="w-full max-w-2xl h-16 sm:h-20 flex items-center justify-center mb-4 sm:mb-6">
            {messages.length > 0 && (
               <div key={messages[messages.length - 1].id} className="animate-in fade-in zoom-in duration-300 text-center">
                  {messages[messages.length - 1].sender === 'SYSTEM' ? (
                     <div className="text-[8px] sm:text-[10px] text-zinc-500 font-mono tracking-widest bg-black/50 px-4 py-1 rounded-full">{messages[messages.length - 1].text}</div>
                  ) : (
                     <div className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm md:text-base font-bold shadow-2xl tracking-wide border
                        ${messages[messages.length - 1].sender === 'HUMAN' 
                           ? 'bg-blue-950/80 border-blue-500/50 text-blue-100 shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                           : 'bg-pink-950/80 border-pink-500/50 text-pink-100 shadow-[0_0_20px_rgba(236,72,153,0.3)]'}`}
                     >
                        "{messages[messages.length - 1].text}"
                     </div>
                  )}
               </div>
            )}
         </div>

         <form onSubmit={handleSend} className="w-full max-w-2xl flex gap-2 sm:gap-3 relative bg-zinc-900/80 p-1.5 sm:p-2 rounded-xl border border-white/10 backdrop-blur-md focus-within:border-white/30 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <button type="button" className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 bg-white/5 rounded-lg flex items-center justify-center text-sm sm:text-lg">🎤</button>
            <input 
               type="text" 
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               disabled={humanSpeaking || petSpeaking}
               placeholder={humanSpeaking || petSpeaking ? "WAITING FOR SYNC..." : "Enter command to target..."}
               className="flex-1 bg-transparent px-2 text-white text-xs sm:text-sm outline-none disabled:opacity-30 font-mono"
            />
            <button 
               type="submit" 
               disabled={!inputText.trim() || humanSpeaking || petSpeaking}
               className="px-4 sm:px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white font-bold rounded-lg transition-colors text-[10px] sm:text-xs tracking-wider"
            >
               SEND
            </button>
         </form>
      </div>

    </div>
  );
}