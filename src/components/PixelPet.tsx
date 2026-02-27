// src/components/PixelPet.tsx
import React from 'react';

interface PixelPetProps {
  x: number;
  y: number;
  mood?: string;
  action?: string;
  chatBubble?: string | null;
  speed?: number;
  facingRight?: boolean;
  dangerTimer?: number;
  isVisitor?: boolean;
  category?: string; 
}

export const PixelPet: React.FC<PixelPetProps> = ({ 
  x, y, mood = 'CALM', action = 'IDLE', chatBubble, speed = 3, facingRight = true, category = '像素犬' 
}) => {
  
  const isMoving = action === 'MOVE' || action === 'RUN';
  const isEating = action === 'EAT';
  const isPooping = action === 'POOP';
  const isJumping = action === 'JUMP';

  const animDur = action === 'RUN' ? 0.2 : (action === 'MOVE' ? 0.4 : 0.6);

  const renderFace = (eyeColor: string, offsetX: number = 0, offsetY: number = 0) => {
    return (
       <g transform={`translate(${offsetX}, ${offsetY})`}>
          {mood === 'JOY' && (
             <g fill="none" stroke={eyeColor} strokeWidth="1" strokeLinecap="round">
                <path d="M -2.5 -1 Q -1.5 -3 -0.5 -1" /><path d="M 0.5 -1 Q 1.5 -3 2.5 -1" />
             </g>
          )}
          {mood === 'SAD' && (
             <g fill="none" stroke={eyeColor} strokeWidth="1" strokeLinecap="round">
                <line x1="-3" y1="-1" x2="-1" y2="0" /><line x1="1" y1="0" x2="3" y2="-1" />
                <circle cx="-2" cy="1" r="0.5" fill="#3b82f6" stroke="none" className="animate-pulse" />
             </g>
          )}
          {mood === 'ANGRY' && (
             <g fill="none" stroke={eyeColor} strokeWidth="1.2" strokeLinecap="round">
                <line x1="-3" y1="-2" x2="-1" y2="0" /><line x1="1" y1="0" x2="3" y2="-2" />
                <circle cx="-2" cy="0" r="0.5" fill="#ef4444" stroke="none" /><circle cx="2" cy="0" r="0.5" fill="#ef4444" stroke="none" />
             </g>
          )}
          {mood === 'CALM' && (
             <g fill={eyeColor}>
                <circle cx="-2" cy="-1" r="0.8" /><circle cx="2" cy="-1" r="0.8" />
             </g>
          )}
       </g>
    );
  };

  const renderSpecies = () => {
    switch (category) {
      case '像素犬': return (
        <g>
           <rect x="-8" y="-9" width="4" height="1.5" fill="#d97706" style={{ transformOrigin: '-6px -8px', animation: `wag ${isMoving ? animDur : 1}s infinite alternate` }} />
           <rect x="-6" y="-8" width="10" height="6" fill="#f59e0b" rx="2" />
           <rect x="-4" y="-2" width="2" height="2" fill="#b45309" className={isMoving ? 'animate-[walk_0.4s_infinite]' : ''} />
           <rect x="2" y="-2" width="2" height="2" fill="#b45309" className={isMoving ? 'animate-[walk_0.4s_infinite_reverse]' : ''} />
           <rect x="2" y="-10" width="6" height="6" fill="#f59e0b" rx="1" />
           <rect x="3" y="-12" width="1.5" height="2" fill="#d97706" />
           <rect x="6.5" y="-12" width="1.5" height="2" fill="#d97706" />
           {renderFace("#451a03", 6, -7)}
           <rect x="7" y="-5" width="2" height="1" fill="#451a03" />
        </g>
      );
      case '赛博猫': return (
        <g>
           <path d="M -6.5 -6 Q -9 -10 -5 -12" fill="none" stroke="#06b6d4" strokeWidth="1" className={isMoving ? 'animate-pulse' : ''} />
           <rect x="-5" y="-6" width="8" height="5" fill="#1e293b" rx="2" />
           <rect x="-5" y="-4" width="8" height="0.5" fill="#ec4899" className="animate-pulse" />
           <rect x="-3" y="-1" width="1.5" height="1" fill="#0f172a" className={isMoving ? 'animate-[walk_0.3s_infinite]' : ''} />
           <rect x="2" y="-1" width="1.5" height="1" fill="#0f172a" className={isMoving ? 'animate-[walk_0.3s_infinite_reverse]' : ''} />
           <circle cx="4" cy="-5" r="3" fill="#1e293b" />
           <polygon points="2,-8 1,-10 4,-8" fill="#06b6d4" />
           <polygon points="5,-8 8,-10 7,-8" fill="#06b6d4" />
           {mood !== 'SAD' && mood !== 'ANGRY' ? <rect x="3" y="-6.5" width="4" height="1.5" fill="#06b6d4" className="animate-pulse" /> : renderFace("#06b6d4", 5, -5)}
           <circle cx="5.5" cy="-3.5" r="0.5" fill="#ec4899" />
        </g>
      );
      case '机械兔': return (
        <g>
           <rect x="-1" y="-13" width="1.5" height="6" fill="#94a3b8" /> 
           <rect x="2" y="-12" width="1.5" height="5" fill="#cbd5e1" transform="rotate(15 2.5 -9.5)" />
           <circle cx="0" cy="-4" r="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="0.5" /> 
           <circle cx="-2" cy="-4" r="1.5" fill="#ef4444" className="animate-pulse" /> 
           {renderFace("#ef4444", 2, -5)}
           <ellipse cx="1" cy="-1" rx="2" ry="1" fill="#64748b" className={isMoving ? 'animate-[walk_0.2s_infinite]' : ''} />
        </g>
      );
      case '量子狐': return (
        <g className="drop-shadow-[0_0_5px_rgba(56,189,248,0.8)]">
           <ellipse cx="-5" cy="-5" rx="4" ry="2" fill="#f97316" opacity="0.6" style={{ transformOrigin: '0px -5px', animation: 'wag 2s infinite ease-in-out' }} />
           <ellipse cx="-7" cy="-4" rx="3" ry="1.5" fill="#38bdf8" opacity="0.8" className="animate-pulse" />
           <path d="M -3 -1 L -1 -5 L 5 -5 L 7 -1 Z" fill="#ea580c" />
           <path d="M 1 -5 L 4 -9 L 7 -5 Z" fill="#f97316" />
           {renderFace("#fff", 4, -5)}
           <rect x="-1" y="-1" width="1.5" height="1" fill="#9a3412" className={isMoving ? 'animate-[walk_0.5s_infinite]' : ''} />
           <rect x="3" y="-1" width="1.5" height="1" fill="#9a3412" className={isMoving ? 'animate-[walk_0.5s_infinite_reverse]' : ''} />
        </g>
      );
      case '硅基水獭': return (
        <g>
           <rect x="-9.5" y="-4" width="14" height="3" fill="#0ea5e9" rx="1.5" /> 
           <rect x="-9.5" y="-3" width="3" height="1.5" fill="#0284c7" />
           <circle cx="5" cy="-3.5" r="2.5" fill="#0ea5e9" />
           {renderFace("#0f172a", 6, -3.5)}
           {!isMoving && !isEating && <polygon points="2,-3 3,-4.5 4,-3 3,-1.5" fill="#a78bfa" className="animate-pulse" />}
           <rect x="-5" y="-1" width="1.5" height="1" fill="#0284c7" className={isMoving ? 'animate-[walk_0.4s_infinite]' : ''} />
           <rect x="1" y="-1" width="1.5" height="1" fill="#0284c7" className={isMoving ? 'animate-[walk_0.4s_infinite_reverse]' : ''} />
        </g>
      );
      case '旅行蛙': return (
        <g className={isMoving ? 'animate-[bounce_0.6s_infinite]' : ''}>
           <path d="M 1 -7 Q -2 -8 -3.5 -5" fill="none" stroke="#22c55e" strokeWidth="0.5" /> 
           <polygon points="-1,-7 3.5,-9 2.5,-6" fill="#16a34a" /> 
           <ellipse cx="0" cy="-3" rx="3.5" ry="2.5" fill="#22c55e" /> 
           <ellipse cx="0" cy="-2" rx="2.5" ry="1.5" fill="#fef08a" /> 
           <circle cx="-1.5" cy="-5" r="1.2" fill="#fff" stroke="#166534" strokeWidth="0.3" /> 
           <circle cx="1.5" cy="-5" r="1.2" fill="#fff" stroke="#166534" strokeWidth="0.3" />
           <circle cx={facingRight ? "-1" : "-2"} cy="-5" r="0.5" fill="#000" />
           <circle cx={facingRight ? "2" : "1"} cy="-5" r="0.5" fill="#000" />
           {mood === 'SAD' && <path d="M -1 -3 Q 0 -4 1 -3" fill="none" stroke="#000" strokeWidth="0.5" />}
           {mood !== 'SAD' && <path d="M -1 -3 Q 0 -2 1 -3" fill="none" stroke="#000" strokeWidth="0.5" />}
        </g>
      );
      case '愤怒鸟': return (
        <g className={isMoving ? 'animate-[bounce_0.3s_infinite]' : ''}>
           <circle cx="0" cy="-2.5" r="2.5" fill="#ef4444" />
           <ellipse cx="0" cy="-1" rx="1.5" ry="1" fill="#fecaca" /> 
           <g transform="translate(0, -3.5)">
              {mood === 'JOY' ? (
                 <g><line x1="-1.5" y1="0.5" x2="-0.5" y2="0" stroke="#000" /><line x1="0.5" y1="0" x2="1.5" y2="0.5" stroke="#000" /></g>
              ) : mood === 'SAD' ? (
                 <g><line x1="-1.5" y1="-0.5" x2="-0.5" y2="0" stroke="#000" /><line x1="0.5" y1="0" x2="1.5" y2="-0.5" stroke="#000" /></g>
              ) : ( 
                 <g><line x1="-2" y1="-0.5" x2="-0.5" y2="0.5" stroke="#000" /><line x1="0.5" y1="0.5" x2="2" y2="-0.5" stroke="#000" /></g>
              )}
           </g>
           <circle cx="-1" cy="-2.5" r="0.5" fill="#fff" /><circle cx="-1" cy="-2.5" r="0.2" fill="#000" />
           <circle cx="1" cy="-2.5" r="0.5" fill="#fff" /><circle cx="1" cy="-2.5" r="0.2" fill="#000" />
           <polygon points="0.5,-1.5 2,-0.5 0.5,0" fill="#facc15" /> 
           {isMoving && <path d="M -2.5 -2.5 L -4 -3.5 L -4 -1.5 Z" fill="#dc2626" className="animate-[wag_0.2s_infinite]" />} 
        </g>
      );
      case '史莱姆': return (
        <g>
           <path d="M -5 0 C -5 -8, 5 -8, 5 0 Z" fill="#22d3ee" opacity="0.7" 
                 className={isMoving ? 'animate-[bounce_0.5s_infinite]' : 'animate-[pulse_2s_infinite]'} 
                 style={{ transformOrigin: '0px 0px' }} />
           <circle cx="-2" cy="-4" r="0.8" fill="#cffafe" className="animate-bounce" />
           <circle cx="2" cy="-2" r="0.4" fill="#cffafe" className="animate-[bounce_1s_infinite]" />
           {renderFace("#083344", 1, -4)}
           {isPooping && <circle cx="-6" cy="0" r="1.5" fill="#06b6d4" opacity="0.5" />} 
        </g>
      );
      default: return <rect x="-4" y="-8" width="8" height="8" fill="#555" />;
    }
  };

  const getBodyTransform = () => {
    if (isJumping) return `translateY(-6px)`;
    if (isEating) return `rotate(15deg) translateY(2px)`; 
    if (isPooping) return `scale(1, 0.8) translateY(1px)`; 
    return 'none';
  };

  return (
    <g transform={`translate(${x}, ${y})`} style={{ transition: `transform ${isJumping ? 0.3 : (10 - speed)*0.1}s linear`, pointerEvents: 'none' }}>
      <style>{`
        @keyframes walk { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
        @keyframes wag { 0% { transform: rotate(-10deg); } 100% { transform: rotate(10deg); } }
      `}</style>

      {/* 🔮 核心升级：全息透光极简气泡，绝不遮挡宠物轮廓 */}
      {chatBubble && (
        <g transform="translate(0, -16)" style={{ pointerEvents: 'none' }} className="animate-pulse">
          <rect x="-24" y="-8" width="48" height="9" fill="rgba(0,0,0,0.5)" rx="4" />
          <text x="0" y="-1.5" fontSize="3" fill="rgba(255,255,255,0.95)" textAnchor="middle" fontWeight="bold" fontFamily="sans-serif" style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.8)' }}>
             {chatBubble}
          </text>
        </g>
      )}

      {/* 情绪符微调高度 */}
      {mood === 'ANGRY' && <text x="7" y="-12" fontSize="5" className="animate-pulse">💢</text>}
      {mood === 'SAD' && <text x="7" y="-12" fontSize="4" className="animate-bounce">💧</text>}
      {mood === 'JOY' && <text x="0" y="-12" fontSize="5" fill="#ec4899" textAnchor="middle" className="animate-[ping_1s_infinite]">❤️</text>}

      {isPooping && category !== '史莱姆' && (
        <g transform={`translate(${facingRight ? -6 : 6}, 0)`}><path d="M -1.5 0 Q 0 -3 1.5 0 Z" fill="#78350f" /></g>
      )}
      {isEating && (
        <g transform={`translate(${facingRight ? 6 : -6}, 0)`}><ellipse cx="0" cy="0" rx="2" ry="0.5" fill="#94a3b8" /><circle cx="0" cy="-0.8" r="0.6" fill="#eab308" /><circle cx="-0.8" cy="-0.3" r="0.5" fill="#eab308" /></g>
      )}

      <g style={{ transformOrigin: '0px 0px', transform: `scale(${facingRight ? 1 : -1}, 1) ${getBodyTransform()}`, transition: 'transform 0.2s ease-in-out' }}>
        {renderSpecies()}
      </g>
      
      <ellipse cx="0" cy="0" rx="4" ry="1" fill="rgba(0,0,0,0.3)" />
    </g>
  );
};