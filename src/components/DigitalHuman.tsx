// src/components/DigitalHuman.tsx
import React from 'react';
import { AVATAR_ROLES } from '@/config/avatars';

interface DigitalHumanProps {
  x: number;
  y: number;
  roleKey: string;
  isMoving: boolean;
  facingRight: boolean;
  action: string;
  chatBubble: string | null;
  speed?: number;
}

export const DigitalHuman: React.FC<DigitalHumanProps> = ({ 
  x, y, roleKey, isMoving, facingRight, action, chatBubble, speed = 0.8 
}) => {
  const role = AVATAR_ROLES[roleKey] || AVATAR_ROLES.UNCLE;
  const { top, bottom, skin, hair, acc } = role.colors;
  
  // 严格遵循白皮书规范：宽 6 x 高 20
  const width = 6; 
  const height = 20; 

  const isSitting = action === 'SIT';
  const isLaying = action === 'LAY' || action === 'SLEEP';
  const isSleeping = action === 'SLEEP';

  const animSpeed = speed / 2;

  return (
    <g 
      transform={`translate(${x - width/2}, ${y - height})`} 
      style={{ transition: `transform ${speed}s linear`, pointerEvents: 'none' }}
    >
      <style>{`
        @keyframes humanWalk { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.5px); } }
        @keyframes wagSlow { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(15deg); } 75% { transform: rotate(-15deg); } }
        @keyframes wagSlowRev { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-15deg); } 75% { transform: rotate(15deg); } }
      `}</style>
      
      {/* 对话气泡与状态 (高度提升) */}
      {chatBubble && (
        <g transform="translate(3, -10)" className="animate-bounce">
          <rect x="-25" y="-12" width="50" height="12" fill="#ffffff" rx="2" className="shadow-lg" />
          <polygon points="-2,2 2,2 0,6" fill="#ffffff" />
          <text x="0" y="-3" fontSize="4" fill="#000000" textAnchor="middle" fontWeight="black">{chatBubble}</text>
        </g>
      )}
      {isSleeping && <text x="3" y="-5" fontSize="6" fill="#94a3b8" textAnchor="middle" fontWeight="bold" className="animate-[bounce_2s_infinite]">Zzz...</text>}

      {/* 躯干全局物理变换 */}
      <g style={{ 
        animation: isMoving && !isSitting && !isLaying ? `humanWalk ${animSpeed}s infinite` : 'none',
        transformOrigin: '3px 20px',
        transform: isLaying ? 'rotate(90deg) translate(8px, -6px)' : isSitting ? 'translate(0, 6px) scale(1, 0.7)' : 'none',
        transition: 'transform 0.5s ease-in-out'
      }}>
        {/* 朝向翻转层 */}
        <g style={{ transformOrigin: '3px 10px', transform: facingRight ? 'scaleX(1)' : 'scaleX(-1)', transition: 'transform 0.2s' }}>
          <svg width={width} height={height} viewBox="0 0 12 40" style={{ overflow: 'visible' }}>
             
             {/* 远端的腿 (更修长) */}
             <rect x="3" y="26" width="3" height={isSitting ? "14" : "14"} fill={bottom} opacity="0.7" style={{transformOrigin: '4.5px 26px', animation: isMoving && !isSitting && !isLaying ? `wagSlowRev ${animSpeed}s infinite` : 'none'}} />
             
             {/* 身体主躯干 */}
             <rect x="2" y="10" width="8" height="18" fill={top} rx="2" />
             <path d="M 2 10 L 10 10 L 8 28 L 2 28 Z" fill={acc} opacity="0.4" /> {/* 服装配件点缀 */}
             
             {/* 近端的腿 */}
             <rect x="6" y="26" width="3" height={isSitting ? "14" : "14"} fill={bottom} style={{transformOrigin: '7.5px 26px', animation: isMoving && !isSitting && !isLaying ? `wagSlow ${animSpeed}s infinite` : 'none'}} />
             
             {/* 细长的手臂摆动 */}
             <rect x="4" y="12" width="2" height="12" fill={skin} rx="1" style={{transformOrigin: '5px 12px', animation: isMoving && !isSitting && !isLaying ? `wagSlowRev ${animSpeed}s infinite` : 'none'}} />
             
             {/* 头部 (比例缩小，显得高挑) */}
             <circle cx="6" cy="5" r="5" fill={skin} />
             <path d="M 1 5 Q 6 -3 11 5 L 11 0 Q 6 -4 1 0 Z" fill={hair} /> {/* 头发 */}
             
             {/* 眼睛 */}
             {isSleeping ? <rect x="7" y="4" width="3" height="1" fill="#000" /> : <rect x="8" y="4" width="1.5" height="1.5" fill="#000" />}
          </svg>
        </g>
      </g>
      
      {/* 物理占位脚底阴影 */}
      <ellipse cx="3" cy="20" rx="5" ry="1.5" fill="rgba(0,0,0,0.4)" />
    </g>
  );
};