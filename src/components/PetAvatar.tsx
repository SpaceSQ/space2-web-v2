// src/components/PetAvatar.tsx
import React from 'react';

interface PetAvatarProps {
  category: string;
  mood?: 'CALM' | 'JOY' | 'SAD' | 'ANGRY';
  isSpeaking?: boolean;
  isListening?: boolean; // 新增：倾听状态
}

export const PetAvatar: React.FC<PetAvatarProps> = ({ category, mood = 'CALM', isSpeaking = false, isListening = false }) => {
  const mouthAnim = isSpeaking ? "animate-[bounce_0.2s_infinite]" : "";
  const earTransform = isListening ? "rotate(0)" : ""; // 听的时候耳朵竖直

  // 1. 🐕 像素犬 (包含半身与尾巴)
  const renderDog = () => (
    <g transform="translate(100, 120)">
       {/* 摇摆的尾巴 */}
       <path d="M 40 20 Q 80 -20 60 -60" fill="none" stroke="#d97706" strokeWidth="15" strokeLinecap="round" className={mood==='JOY' ? "animate-[spin_0.2s_linear_infinite_alternate] origin-bottom-left" : "animate-[spin_1s_linear_infinite_alternate] origin-bottom-left"} />
       {/* 躯干与爪子 */}
       <rect x="-45" y="10" width="90" height="70" fill="#f59e0b" rx="30" />
       <circle cx="-25" cy="75" r="15" fill="#fef3c7" />
       <circle cx="25" cy="75" r="15" fill="#fef3c7" />
       
       {/* 头部 */}
       <rect x="-60" y="-40" width="120" height="90" fill="#f59e0b" rx="40" />
       <rect x="-40" y="-10" width="80" height="70" fill="#fef3c7" rx="30" />
       
       {/* 动态耳朵 */}
       <g style={{ transform: isListening ? 'rotate(15deg)' : 'rotate(-15deg)', transformOrigin: '-40px -30px', transition: 'transform 0.3s' }}>
          <path d="M -50 -30 L -70 -80 L -20 -40 Z" fill="#d97706" /><path d="M -45 -35 L -60 -70 L -25 -40 Z" fill="#fef3c7" />
       </g>
       <g style={{ transform: isListening ? 'rotate(-15deg)' : 'rotate(15deg)', transformOrigin: '40px -30px', transition: 'transform 0.3s' }}>
          <path d="M 50 -30 L 70 -80 L 20 -40 Z" fill="#d97706" /><path d="M 45 -35 L 60 -70 L 25 -40 Z" fill="#fef3c7" />
       </g>

       {/* 情绪眼睛 */}
       <g transform="translate(0, -10)">
         {isListening ? ( <g fill="#451a03"><ellipse cx="-25" cy="0" rx="12" ry="16" /><ellipse cx="25" cy="0" rx="12" ry="16" /><circle cx="-25" cy="-5" r="5" fill="#fff"/><circle cx="25" cy="-5" r="5" fill="#fff"/></g> ) :
          mood === 'JOY' ? ( <g stroke="#451a03" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M -40 0 Q -25 -15 -10 0" /><path d="M 10 0 Q 25 -15 40 0" /></g> ) : 
          mood === 'SAD' ? ( <g stroke="#451a03" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M -40 -10 Q -25 0 -10 -5" /><path d="M 10 -5 Q 25 0 40 -10" /></g> ) : 
          mood === 'ANGRY' ? ( <g stroke="#451a03" strokeWidth="6" strokeLinecap="round" fill="none"><path d="M -40 0 L -10 10" /><path d="M 10 10 L 40 0" /></g> ) : 
          ( <g fill="#451a03"><circle cx="-25" cy="0" r="12" /><circle cx="-20" cy="-4" r="4" fill="#fff" /><circle cx="25" cy="0" r="12" /><circle cx="30" cy="-4" r="4" fill="#fff" /></g> )}
       </g>
       <g transform="translate(0, 20)">
         <ellipse cx="0" cy="0" rx="15" ry="10" fill="#451a03" />
         <path d="M 0 10 L 0 25" stroke="#451a03" strokeWidth="4" />
         <path d="M -15 25 Q 0 35 15 25" stroke="#451a03" strokeWidth="4" fill="none" className={mouthAnim} />
         {isSpeaking && <path d="M -10 27 Q 0 45 10 27 Z" fill="#ef4444" className="animate-pulse" />} 
       </g>
    </g>
  );

  // 2. 🐈 赛博猫 (包含机体)
  const renderCat = () => (
    <g transform="translate(100, 120)">
       <defs><linearGradient id="catMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#334155" /><stop offset="100%" stopColor="#0f172a" /></linearGradient></defs>
       {/* 机械尾巴 */}
       <path d="M 40 20 Q 90 0 70 -50" fill="none" stroke="#06b6d4" strokeWidth="8" strokeDasharray="10 5" className={isListening ? "animate-pulse" : ""} />
       {/* 躯干 */}
       <path d="M -40 10 L 40 10 L 50 80 L -50 80 Z" fill="url(#catMetal)" stroke="#06b6d4" strokeWidth="2" />
       
       <g style={{ transform: isListening ? 'rotate(10deg)' : 'rotate(-20deg)', transformOrigin: '-40px -40px', transition: 'transform 0.2s' }}>
          <polygon points="-40,-40 -70,-90 -10,-50" fill="url(#catMetal)" stroke="#06b6d4" strokeWidth="3" />
          <polygon points="-45,-45 -60,-75 -20,-50" fill="#06b6d4" opacity="0.3" className="animate-pulse" />
       </g>
       <g style={{ transform: isListening ? 'rotate(-10deg)' : 'rotate(20deg)', transformOrigin: '40px -40px', transition: 'transform 0.2s' }}>
          <polygon points="40,-40 70,-90 10,-50" fill="url(#catMetal)" stroke="#06b6d4" strokeWidth="3" />
          <polygon points="45,-45 60,-75 20,-50" fill="#06b6d4" opacity="0.3" className="animate-pulse" />
       </g>

       <path d="M -60 -40 C -70 40, 70 40, 60 -40 Z" fill="url(#catMetal)" />
       <path d="M -70 -20 Q 0 10 70 -20 L 60 -40 Q 0 -10 -60 -40 Z" fill="#06b6d4" opacity="0.8" className="animate-[pulse_2s_infinite]" />
       <g transform="translate(0, -15)">
         {isListening ? ( <g fill="#fff"><circle cx="-30" cy="0" r="12" /><circle cx="30" cy="0" r="12" /></g> ) :
          mood === 'SAD' ? ( <g fill="#fff"><rect x="-40" y="-5" width="25" height="4" rx="2" /><rect x="15" y="-5" width="25" height="4" rx="2" /></g> ) : 
          mood === 'ANGRY' ? ( <g fill="#ef4444"><polygon points="-45,-10 -15,0 -40,5" /><polygon points="45,-10 15,0 40,5" /></g> ) : 
          ( <g fill="#fff"><ellipse cx="-30" cy="0" rx="15" ry="8" /><ellipse cx="30" cy="0" rx="15" ry="8" /><circle cx="-30" cy="0" r="4" fill="#0f172a" /><circle cx="30" cy="0" r="4" fill="#0f172a" /></g> )}
       </g>
       <g transform="translate(0, 30)">
         <polygon points="-10,0 10,0 0,10" fill="#ec4899" />
         <rect x="-20" y="20" width="40" height="5" fill="#ec4899" className={isSpeaking ? "animate-[ping_0.3s_infinite]" : "opacity-30"} />
       </g>
    </g>
  );

  // 兜底渲染 (圆滚滚的通用体)
  const renderDefault = () => (
     <g transform="translate(100, 100)">
        <circle cx="0" cy="0" r="60" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="8" />
        <circle cx="-20" cy="-10" r="10" fill="#0f172a" className={isListening ? "animate-ping" : ""} />
        <circle cx="20" cy="-10" r="10" fill="#0f172a" className={isListening ? "animate-ping" : ""} />
        <circle cx="0" cy="20" r={isSpeaking ? 15 : 5} fill="#ef4444" className="transition-all" />
     </g>
  );

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
       {category === '赛博猫' ? renderCat() : 
        category === '像素犬' ? renderDog() : 
        renderDefault()}
    </svg>
  );
};