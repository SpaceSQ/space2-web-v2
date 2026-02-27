// src/components/PortraitPet.tsx
import React from 'react';

interface PortraitPetProps {
  category: string;
  mood?: 'CALM' | 'JOY' | 'SAD' | 'ANGRY';
  isSpeaking?: boolean;
}

export const PortraitPet: React.FC<PortraitPetProps> = ({ category, mood = 'CALM', isSpeaking = false }) => {
  // 会说话的嘴部动画
  const mouthAnim = isSpeaking ? "animate-[bounce_0.2s_infinite]" : "";

  // 1. 🐕 像素犬 (温暖、忠诚的柴犬风格)
  const renderDog = () => (
    <g transform="translate(100, 120)">
       <rect x="-60" y="-40" width="120" height="100" fill="#f59e0b" rx="40" />
       <rect x="-40" y="-10" width="80" height="80" fill="#fef3c7" rx="30" /> {/* 白肚皮/下巴 */}
       {/* 耳朵 */}
       <path d="M -50 -30 L -70 -80 L -20 -40 Z" fill="#d97706" />
       <path d="M -45 -35 L -60 -70 L -25 -40 Z" fill="#fef3c7" />
       <path d="M 50 -30 L 70 -80 L 20 -40 Z" fill="#d97706" />
       <path d="M 45 -35 L 60 -70 L 25 -40 Z" fill="#fef3c7" />
       {/* 眼睛情绪 */}
       <g transform="translate(0, -10)">
         {mood === 'JOY' ? ( <g stroke="#451a03" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M -40 0 Q -25 -15 -10 0" /><path d="M 10 0 Q 25 -15 40 0" /></g> ) : 
          mood === 'SAD' ? ( <g stroke="#451a03" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M -40 -10 Q -25 0 -10 -5" /><path d="M 10 -5 Q 25 0 40 -10" /></g> ) : 
          mood === 'ANGRY' ? ( <g stroke="#451a03" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M -40 0 L -10 10" /><path d="M 10 10 L 40 0" /><circle cx="-25" cy="15" r="5" fill="#ef4444" stroke="none"/><circle cx="25" cy="15" r="5" fill="#ef4444" stroke="none"/></g> ) : 
          ( <g fill="#451a03"><circle cx="-25" cy="0" r="12" /><circle cx="-20" cy="-4" r="4" fill="#fff" /><circle cx="25" cy="0" r="12" /><circle cx="30" cy="-4" r="4" fill="#fff" /></g> )}
       </g>
       {/* 鼻子与嘴巴 */}
       <g transform="translate(0, 20)">
         <ellipse cx="0" cy="0" rx="15" ry="10" fill="#451a03" />
         <path d="M 0 10 L 0 25" stroke="#451a03" strokeWidth="4" />
         <path d="M -15 25 Q 0 35 15 25" stroke="#451a03" strokeWidth="4" fill="none" className={mouthAnim} />
         {isSpeaking && <path d="M -10 27 Q 0 45 10 27 Z" fill="#ef4444" className="animate-pulse" />} {/* 舌头 */}
       </g>
    </g>
  );

  // 2. 🐈 赛博猫 (金属质感、霓虹发光面甲)
  const renderCat = () => (
    <g transform="translate(100, 120)">
       <defs>
         <linearGradient id="catMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#334155" /><stop offset="100%" stopColor="#0f172a" /></linearGradient>
       </defs>
       {/* 机械耳 */}
       <polygon points="-40,-40 -70,-90 -10,-50" fill="url(#catMetal)" stroke="#06b6d4" strokeWidth="3" />
       <polygon points="-45,-45 -60,-75 -20,-50" fill="#06b6d4" opacity="0.3" className="animate-pulse" />
       <polygon points="40,-40 70,-90 10,-50" fill="url(#catMetal)" stroke="#06b6d4" strokeWidth="3" />
       <polygon points="45,-45 60,-75 20,-50" fill="#06b6d4" opacity="0.3" className="animate-pulse" />
       {/* 头部装甲 */}
       <path d="M -60 -40 C -70 40, 70 40, 60 -40 Z" fill="url(#catMetal)" />
       <path d="M -40 -40 L -20 50 L 20 50 L 40 -40 Z" fill="#1e293b" /> {/* 面部纹理线 */}
       {/* 赛博面甲 (遮住上半脸) */}
       <path d="M -70 -20 Q 0 10 70 -20 L 60 -40 Q 0 -10 -60 -40 Z" fill="#06b6d4" opacity="0.8" className="animate-[pulse_2s_infinite]" />
       {/* 动态眼睛 (在面甲上显示) */}
       <g transform="translate(0, -15)">
         {mood === 'SAD' ? ( <g fill="#fff"><rect x="-40" y="-5" width="25" height="4" rx="2" /><rect x="15" y="-5" width="25" height="4" rx="2" /></g> ) : 
          mood === 'ANGRY' ? ( <g fill="#ef4444"><polygon points="-45,-10 -15,0 -40,5" /><polygon points="45,-10 15,0 40,5" /></g> ) : 
          ( <g fill="#fff"><ellipse cx="-30" cy="0" rx="15" ry="8" /><ellipse cx="30" cy="0" rx="15" ry="8" /><circle cx="-30" cy="0" r="4" fill="#0f172a" /><circle cx="30" cy="0" r="4" fill="#0f172a" /></g> )}
       </g>
       {/* 机械下颚与发声器 */}
       <g transform="translate(0, 30)">
         <polygon points="-10,0 10,0 0,10" fill="#ec4899" />
         <rect x="-20" y="20" width="40" height="5" fill="#ec4899" className={isSpeaking ? "animate-[ping_0.3s_infinite]" : "opacity-30"} />
       </g>
    </g>
  );

  // 3. 🦊 量子狐 (半透明、发光、飘逸)
  const renderFox = () => (
    <g transform="translate(100, 130)">
       <defs>
         <filter id="foxGlow"><feGaussianBlur stdDeviation="8" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
         <linearGradient id="foxGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#ea580c" /></linearGradient>
       </defs>
       {/* 星尘尾巴背景 */}
       <circle cx="0" cy="0" r="80" fill="#ea580c" opacity="0.2" filter="url(#foxGlow)" className="animate-[pulse_3s_infinite]" />
       <circle cx="0" cy="0" r="50" fill="#38bdf8" opacity="0.3" filter="url(#foxGlow)" className="animate-[spin_4s_linear_infinite]" strokeDasharray="10,20" strokeWidth="10" stroke="#fff" />
       {/* 尖锐飘逸的脸 */}
       <path d="M -70 -50 L 0 50 L 70 -50 L 30 -70 L 0 -60 L -30 -70 Z" fill="url(#foxGrad)" filter="url(#foxGlow)" />
       <path d="M -40 -30 L 0 40 L 40 -30 Z" fill="#fff" opacity="0.9" /> {/* 白脸颊 */}
       {/* 狐狸眼 */}
       <g transform="translate(0, -10)">
         {mood === 'JOY' ? ( <g stroke="#ea580c" strokeWidth="5" strokeLinecap="round" fill="none"><path d="M -35 -10 Q -20 -25 -5 -10" /><path d="M 5 -10 Q 20 -25 35 -10" /></g> ) : 
          mood === 'ANGRY' ? ( <g stroke="#ea580c" strokeWidth="5" strokeLinecap="round" fill="none"><line x1="-35" y1="-20" x2="-5" y2="-5" /><line x1="5" y1="-5" x2="35" y2="-20" /><circle cx="-20" cy="-5" r="6" fill="#ef4444" stroke="none"/><circle cx="20" cy="-5" r="6" fill="#ef4444" stroke="none"/></g> ) : 
          ( <g stroke="#ea580c" strokeWidth="5" strokeLinecap="round" fill="none"><path d="M -35 -5 Q -20 5 -5 -5" /><path d="M 5 -5 Q 20 5 35 -5" /></g> )}
       </g>
       {/* 黑色小鼻头 */}
       <circle cx="0" cy="40" r="6" fill="#000" />
       {isSpeaking && <circle cx="0" cy="55" r="4" fill="#38bdf8" filter="url(#foxGlow)" className="animate-ping" />}
    </g>
  );

  // 4. 💧 史莱姆 (果冻流体、气泡、软萌)
  const renderSlime = () => (
    <g transform="translate(100, 150)">
       <defs>
          <radialGradient id="slimeGrad" cx="30%" cy="30%" r="70%"><stop offset="0%" stopColor="#67e8f9" /><stop offset="100%" stopColor="#0891b2" /></radialGradient>
       </defs>
       {/* 身体 */}
       <path d={mood === 'JOY' ? "M 0 20 C 80 20, 100 -50, 50 -80 C 20 -100, 0 -60, 0 -60 C 0 -60, -20 -100, -50 -80 C -100 -50, -80 20, 0 20 Z" : "M -80 20 C -80 -80, 80 -80, 80 20 Z"} 
             fill="url(#slimeGrad)" opacity="0.8" className={mood==='ANGRY' ? 'animate-bounce' : 'animate-[pulse_2s_infinite]'} />
       {/* 体内气泡 */}
       <circle cx="-30" cy="-20" r="10" fill="#fff" opacity="0.5" className="animate-bounce" />
       <circle cx="40" cy="-10" r="15" fill="#fff" opacity="0.3" className="animate-[bounce_1.5s_infinite]" />
       <circle cx="-10" cy="-50" r="5" fill="#fff" opacity="0.6" className="animate-pulse" />
       {/* 核心表情 */}
       <g transform="translate(0, -20)">
         {mood === 'JOY' ? ( <g stroke="#083344" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M -30 0 Q -15 -20 0 0" /><path d="M 0 0 Q 15 -20 30 0" /></g> ) : 
          mood === 'SAD' ? ( <g stroke="#083344" strokeWidth="6" strokeLinecap="round" fill="none"><line x1="-30" y1="-10" x2="-10" y2="0" /><line x1="10" y1="0" x2="30" y2="-10" /><path d="M -20 10 L -20 30 M 20 10 L 20 30" stroke="#fff" opacity="0.8" className="animate-pulse"/></g> ) : 
          mood === 'ANGRY' ? ( <g stroke="#083344" strokeWidth="6" strokeLinecap="round" fill="none"><line x1="-30" y1="-10" x2="-10" y2="5" /><line x1="10" y1="5" x2="30" y2="-10" /></g> ) : 
          ( <g fill="#083344"><circle cx="-20" cy="0" r="8" /><circle cx="20" cy="0" r="8" /></g> )}
         {/* 说话时嘴巴 */}
         <ellipse cx="0" cy="20" rx={isSpeaking ? 10 : 5} ry={isSpeaking ? 15 : 2} fill="#083344" className="transition-all duration-100" />
       </g>
    </g>
  );

  // （这里为了性能与美观，先渲染 4 种最具代表性的极限风格，其他可以平滑扩展）
  // 兜底渲染 (机械兔风格)
  const renderDefault = () => (
     <g transform="translate(100, 100)">
        <rect x="-10" y="-80" width="20" height="60" fill="#94a3b8" />
        <circle cx="0" cy="0" r="60" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="8" />
        <circle cx="0" cy="0" r="20" fill="#ef4444" className={isSpeaking ? "animate-ping" : ""} />
     </g>
  );

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
       {category === '赛博猫' ? renderCat() : 
        category === '量子狐' ? renderFox() : 
        category === '史莱姆' ? renderSlime() : 
        category === '像素犬' ? renderDog() : 
        renderDefault()}
    </svg>
  );
};