// src/components/PortraitHuman.tsx
import React from 'react';

// 因为组件是独立的，我们直接在这里定义 12 种角色的配色与部件特征
const HUMAN_STYLES: Record<string, any> = {
  UNCLE: { skin: '#fca5a5', hair: '#451a03', top: '#3b82f6', feature: 'STUBBLE' }, // 大叔
  YOUTH: { skin: '#fef08a', hair: '#1e293b', top: '#f87171', feature: 'CAP' },    // 少年
  MOM: { skin: '#fbcfe8', hair: '#831843', top: '#a78bfa', feature: 'ELEGANT' },  // 辣妈
  WANDERER: { skin: '#e2e8f0', hair: '#64748b', top: '#0f172a', feature: 'HELMET' }, // 星际漫游者
  HACKER: { skin: '#c7d2fe', hair: '#312e81', top: '#000000', feature: 'VR_GOGGLES' }, // 赛博骇客
  MECHANIC: { skin: '#fdba74', hair: '#78350f', top: '#ea580c', feature: 'GOGGLES_UP' }, // 废土机修师
  MAGICAL_GIRL: { skin: '#fce7f3', hair: '#f472b6', top: '#fb7185', feature: 'TWINTAILS' }, // 魔法少女
  ASSASSIN: { skin: '#cbd5e1', hair: '#020617', top: '#1e293b', feature: 'MASK' }, // 暗影刺客
  PILOT: { skin: '#bfdbfe', hair: '#0369a1', top: '#0284c7', feature: 'HEADSET' }, // 机甲驾驶员
  GAMER: { skin: '#ddd6fe', hair: '#171717', top: '#4c1d95', feature: 'RGB_EARS' }, // 硬核电竞控
  SCAVENGER: { skin: '#d6d3d1', hair: '#451a03', top: '#3f3f46', feature: 'GAS_MASK' }, // 末日拾荒者
  PROPHET: { skin: '#f3e8ff', hair: '#f8fafc', top: '#5b21b6', feature: 'THIRD_EYE' }, // 像素先知
};

interface PortraitHumanProps {
  roleKey: string;
  mood?: 'CALM' | 'JOY' | 'SAD' | 'ANGRY';
  isSpeaking?: boolean;
}

export const PortraitHuman: React.FC<PortraitHumanProps> = ({ roleKey, mood = 'CALM', isSpeaking = false }) => {
  const style = HUMAN_STYLES[roleKey] || HUMAN_STYLES.HACKER;
  const { skin, hair, top, feature } = style;

  const mouthAnim = isSpeaking ? "animate-[bounce_0.2s_infinite]" : "";

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
       <g transform="translate(100, 110)">
          
          {/* 脖子与躯干基底 */}
          <rect x="-20" y="40" width="40" height="50" fill={skin} opacity="0.8" />
          <path d="M -45 70 L 45 70 L 60 110 L -60 110 Z" fill={top} />
          
          {/* 脸部轮廓 */}
          <rect x="-50" y="-60" width="100" height="110" fill={skin} rx="40" />

          {/* 🌟 1. 发型与头部基底特征 🌟 */}
          <g fill={hair}>
             {feature === 'TWINTAILS' && ( <g><path d="M -50 -20 Q -90 -80 -80 0 Q -60 -40 -50 -20" /><path d="M 50 -20 Q 90 -80 80 0 Q 60 -40 50 -20" /><path d="M -55 -20 Q 0 -90 55 -20 Z" /></g> )}
             {(feature === 'HELMET' || feature === 'GAS_MASK' || feature === 'MASK') && ( <path d="M -55 -20 Q 0 -80 55 -20 Z" fill="#1e293b" /> )}
             {(feature === 'ELEGANT' || feature === 'PROPHET') && ( <path d="M -55 20 Q -60 -90 0 -90 Q 60 -90 55 20 L 45 20 Q 50 -70 0 -70 Q -50 -70 -45 20 Z" /> )}
             {(feature === 'STUBBLE' || feature === 'YOUTH' || feature === 'HACKER' || feature === 'MECHANIC' || feature === 'HEADSET' || feature === 'RGB_EARS') && ( <path d="M -55 -20 Q 0 -80 55 -20 Q 60 -50 50 -50 Q 0 -60 -50 -50 Z" /> )}
          </g>

          {/* 🌟 2. 情绪眼睛 (避开遮挡视线的面具) 🌟 */}
          {feature !== 'VR_GOGGLES' && feature !== 'HELMET' && (
             <g transform="translate(0, -10)">
               {mood === 'JOY' ? ( <g stroke="#000" strokeWidth="4" strokeLinecap="round" fill="none"><path d="M -35 0 Q -25 -10 -15 0" /><path d="M 15 0 Q 25 -10 35 0" /></g> ) : 
                mood === 'SAD' ? ( <g stroke="#000" strokeWidth="4" strokeLinecap="round" fill="none"><path d="M -35 -5 Q -25 5 -15 -5" /><path d="M 15 -5 Q 25 5 35 -5" /><circle cx="-25" cy="15" r="3" fill="#3b82f6" stroke="none" className="animate-pulse"/></g> ) : 
                mood === 'ANGRY' ? ( <g stroke="#000" strokeWidth="5" strokeLinecap="round" fill="none"><line x1="-35" y1="-10" x2="-15" y2="0" /><line x1="15" y1="0" x2="35" y2="-10" /><circle cx="-25" cy="5" r="4" fill="#000" stroke="none"/><circle cx="25" cy="5" r="4" fill="#000" stroke="none"/></g> ) : 
                ( <g fill="#000"><circle cx="-25" cy="0" r="6" /><circle cx="-23" cy="-2" r="2" fill="#fff" /><circle cx="25" cy="0" r="6" /><circle cx="27" cy="-2" r="2" fill="#fff" /></g> )}
             </g>
          )}

          {/* 🌟 3. 动态嘴巴 (避开防毒面具和刺客面罩) 🌟 */}
          {feature !== 'MASK' && feature !== 'GAS_MASK' && feature !== 'HELMET' && (
             <g transform="translate(0, 30)">
               {isSpeaking ? ( <ellipse cx="0" cy="0" rx="10" ry="8" fill="#451a03" className={mouthAnim} /> ) : 
                mood === 'JOY' ? ( <path d="M -15 0 Q 0 15 15 0" stroke="#451a03" strokeWidth="3" fill="none" /> ) : 
                mood === 'SAD' ? ( <path d="M -10 10 Q 0 0 10 10" stroke="#451a03" strokeWidth="3" fill="none" /> ) : 
                ( <line x1="-10" y1="0" x2="10" y2="0" stroke="#451a03" strokeWidth="3" /> )}
             </g>
          )}

          {/* 🌟 4. 专属职业配件叠加层 🌟 */}
          
          {/* 大叔胡茬 */}
          {feature === 'STUBBLE' && ( <g fill="#451a03" opacity="0.3"><circle cx="-20" cy="25" r="1.5"/><circle cx="20" cy="25" r="1.5"/><circle cx="0" cy="35" r="1.5"/><circle cx="-10" cy="30" r="1.5"/><circle cx="10" cy="30" r="1.5"/></g> )}
          
          {/* 少年反戴鸭舌帽 */}
          {feature === 'CAP' && ( <g><path d="M -60 -40 C -60 -90, 60 -90, 60 -40 Z" fill="#ef4444" /><rect x="-80" y="-45" width="40" height="5" fill="#dc2626" rx="2" transform="rotate(-15 -60 -45)" /></g> )}
          
          {/* 漫游者全息头盔 */}
          {feature === 'HELMET' && ( <g><circle cx="0" cy="-10" r="55" fill="#0ea5e9" opacity="0.6" /><path d="M -40 -30 Q 0 -60 40 -30 Q 0 -10 -40 -30 Z" fill="#fff" opacity="0.4" /><rect x="-30" y="40" width="60" height="15" fill="#cbd5e1" rx="5" /></g> )}
          
          {/* 骇客 VR 眼镜 */}
          {feature === 'VR_GOGGLES' && ( <g transform="translate(0, -15)"><rect x="-60" y="-10" width="120" height="25" fill="#1e293b" rx="5" /><rect x="-40" y="-5" width="80" height="15" fill="#06b6d4" className="animate-[pulse_2s_infinite]" /><line x1="-60" y1="2" x2="60" y2="2" stroke="#fff" opacity="0.3" /></g> )}
          
          {/* 机修师护目镜 */}
          {feature === 'GOGGLES_UP' && ( <g transform="translate(0, -45)"><rect x="-50" y="-10" width="100" height="15" fill="#475569" rx="2" /><circle cx="-25" cy="-2" r="15" fill="#1e293b" stroke="#f59e0b" strokeWidth="4" /><circle cx="25" cy="-2" r="15" fill="#1e293b" stroke="#f59e0b" strokeWidth="4" /></g> )}
          
          {/* 魔法少女星星发饰 */}
          {feature === 'TWINTAILS' && ( <polygon points="-30,-40 -20,-45 -15,-35 -25,-30" fill="#fde047" className="animate-spin-slow" style={{transformOrigin: '-22px -37px'}} /> )}
          
          {/* 刺客面罩 */}
          {feature === 'MASK' && ( <g transform="translate(0, 15)"><path d="M -50 0 L 0 -10 L 50 0 L 40 40 L -40 40 Z" fill="#0f172a" /><line x1="-20" y1="0" x2="-20" y2="20" stroke="#334155" strokeWidth="2" /><line x1="20" y1="0" x2="20" y2="20" stroke="#334155" strokeWidth="2" /></g> )}
          
          {/* 机甲驾驶员通讯耳机 */}
          {feature === 'HEADSET' && ( <g><rect x="-65" y="-30" width="15" height="40" fill="#f1f5f9" rx="5" /><rect x="50" y="-30" width="15" height="40" fill="#f1f5f9" rx="5" /><path d="M 50 0 Q 30 20 20 30" fill="none" stroke="#94a3b8" strokeWidth="3" /><circle cx="20" cy="30" r="3" fill="#ef4444" className="animate-ping" /></g> )}
          
          {/* RGB电竞猫耳耳机 */}
          {feature === 'RGB_EARS' && ( <g><path d="M -55 -20 C -55 -80, 55 -80, 55 -20" fill="none" stroke="#1e293b" strokeWidth="10" /><polygon points="-40,-65 -20,-70 -30,-40" fill="#1e293b" stroke="#ec4899" strokeWidth="3" className="animate-pulse" /><polygon points="40,-65 20,-70 30,-40" fill="#1e293b" stroke="#06b6d4" strokeWidth="3" className="animate-pulse" /><rect x="-65" y="-30" width="20" height="40" fill="#1e293b" rx="10" /><rect x="45" y="-30" width="20" height="40" fill="#1e293b" rx="10" /></g> )}
          
          {/* 拾荒者防毒面具 */}
          {feature === 'GAS_MASK' && ( <g transform="translate(0, 20)"><rect x="-40" y="-10" width="80" height="40" fill="#3f3f46" rx="20" /><circle cx="-20" cy="15" r="12" fill="#18181b" stroke="#71717a" strokeWidth="4" /><circle cx="20" cy="15" r="12" fill="#18181b" stroke="#71717a" strokeWidth="4" /><line x1="-10" y1="0" x2="10" y2="0" stroke="#000" strokeWidth="4" /></g> )}
          
          {/* 像素先知第三只眼 */}
          {feature === 'THIRD_EYE' && ( <g transform="translate(0, -35)"><polygon points="0,-10 10,0 0,10 -10,0" fill="#a855f7" className="animate-ping" /><circle cx="0" cy="0" r="3" fill="#fff" /></g> )}

       </g>
    </svg>
  );
};