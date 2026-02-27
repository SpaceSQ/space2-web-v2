// src/components/SVGSymbols.tsx
import React from 'react';

export const SVGSymbols: Record<string, (w?: number, h?: number, label?: string) => React.ReactNode> = {
  // =====================================================================
  // 🛋️ 1. 原生核心生存与家居资产
  // =====================================================================
  SOFA: (w=12, h=24) => (<g><rect width={w} height={h} fill="#1e3a8a" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="1" rx="2" /><text x={w/2} y={h/2+1} fontSize="2.5" fill="#93c5fd" textAnchor="middle" dominantBaseline="middle" className="font-mono font-bold">SOFA</text></g>),
  BED: (w=25, h=18) => (<g><rect width={w} height={h} fill="#312e81" fillOpacity="0.5" stroke="#4f46e5" strokeWidth="1" rx="2" /><rect x="2" y="2" width={8} height={h-4} fill="#e0e7ff" rx="1" opacity="0.8" /><text x={w/2} y={h/2+1} fontSize="2.5" fill="#c7d2fe" textAnchor="middle" dominantBaseline="middle" className="font-mono font-bold">BED</text></g>),
  PLANT: (w=8, h=8) => (<g><circle cx={w/2} cy={h/2} r={w/2-1} fill="#064e3b" fillOpacity="0.3" stroke="#10b981" strokeWidth="1" /><text x={w/2} y={h/2+4} fontSize="2" fill="#6ee7b7" textAnchor="middle" className="font-mono font-bold">PLANT</text></g>),
  AQUARIUM: (w=15, h=8) => (<g><rect width={w} height={h} fill="#083344" fillOpacity="0.4" stroke="#06b6d4" strokeWidth="1" /><text x={w/2} y={h/2+1} fontSize="2.5" fill="#67e8f9" textAnchor="middle" dominantBaseline="middle" className="font-mono font-bold">FISH TANK</text></g>),
  CAT_TREE: (w=10, h=10) => (<g><rect width={w} height={h} fill="#451a03" fillOpacity="0.3" stroke="#d97706" strokeWidth="1" /><text x={w/2} y={h/2+1} fontSize="2.5" fill="#fcd34d" textAnchor="middle" dominantBaseline="middle" className="font-mono font-bold">PET BED</text></g>),
  TV_SYSTEM: (w=30, h=6) => (<g><rect width={w} height={h} fill="#18181b" fillOpacity="0.6" stroke="#a1a1aa" strokeWidth="1" /><rect x="2" y={h/2 - 1} width={w-4} height="2" fill="#3f3f46" /><text x={w/2} y={h/2+3} fontSize="2.5" fill="#d4d4d8" textAnchor="middle" className="font-mono font-bold">TV SET</text></g>),
  TEA_TABLE: (w=16, h=10) => (<g><circle cx={w/2} cy={h/2} r={w/2 - 2} fill="#78350f" fillOpacity="0.4" stroke="#d97706" strokeWidth="1" /><text x={w/2} y={h/2+4} fontSize="2" fill="#fcd34d" textAnchor="middle" className="font-mono font-bold">TABLE</text></g>),
  SUPPLY: (w=10, h=6) => (<g><rect width={w} height={h} fill="#3f3f46" fillOpacity="0.8" stroke="#a1a1aa" strokeWidth="1" rx="1" /><circle cx={w/2-2} cy={h/2} r="1.5" fill="#3b82f6" /><circle cx={w/2+2} cy={h/2} r="1.5" fill="#d97706" /><text x={w/2} y={h/2+4} fontSize="2" fill="#d4d4d8" textAnchor="middle" className="font-mono font-bold">FEEDER</text></g>),
  LITTER_BOX: (w=10, h=6) => (<g><rect width={w} height={h} fill="#27272a" fillOpacity="0.9" stroke="#52525b" strokeWidth="1" rx="1" /><rect x="1" y="1" width={w-2} height={h-2} fill="#d4d4d8" fillOpacity="0.2" strokeDasharray="1,1" stroke="#a1a1aa" /><text x={w/2} y={h/2+4} fontSize="2" fill="#a1a1aa" textAnchor="middle" className="font-mono font-bold">LITTER</text></g>),
  SMART_HUB: (w=6, h=6) => (<g><circle cx={w/2} cy={h/2} r={w/2-1} fill="#4c1d95" fillOpacity="0.4" stroke="#8b5cf6" strokeWidth="1" className="animate-pulse" /><text x={w/2} y={h/2+4} fontSize="2" fill="#a78bfa" textAnchor="middle" className="font-mono font-bold">HUB</text></g>),
  DINING_TABLE: (w=30, h=20) => (<g><rect width={w} height={h} fill="#713f12" fillOpacity="0.6" stroke="#fbbf24" strokeWidth="1" rx="3" /><text x={w/2} y={h/2+1} fontSize="2.5" fill="#fde047" textAnchor="middle" dominantBaseline="middle" className="font-mono font-bold">DINING</text></g>),
  BOOKSHELF: (w=8, h=30) => (<g><rect width={w} height={h} fill="#451a03" fillOpacity="0.8" stroke="#d97706" strokeWidth="1" /><line x1="2" y1={h/3} x2={w-2} y2={h/3} stroke="#d97706" strokeWidth="0.5"/><line x1="2" y1={(h/3)*2} x2={w-2} y2={(h/3)*2} stroke="#d97706" strokeWidth="0.5"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fcd34d" textAnchor="middle" dominantBaseline="middle" className="font-mono font-bold">BOOKS</text></g>),
  ARCADE: (w=12, h=15) => (<g><rect width={w} height={h} fill="#0f172a" fillOpacity="0.9" stroke="#ec4899" strokeWidth="1" rx="2" className="animate-[pulse_2s_infinite]" /><rect x="2" y="2" width={w-4} height={h/2-2} fill="#db2777" opacity="0.5" /><text x={w/2} y={h/2+3} fontSize="2" fill="#fbcfe8" textAnchor="middle" className="font-mono font-bold">ARCADE</text></g>),
  POD: (w=20, h=30) => (<g><rect width={w} height={h} fill="#0f766e" fillOpacity="0.5" stroke="#2dd4bf" strokeWidth="1" rx={w/2} /><text x={w/2} y={h/2+1} fontSize="2.5" fill="#ccfbf1" textAnchor="middle" dominantBaseline="middle" className="font-mono font-bold">SLEEP POD</text></g>),

  // =====================================================================
  // 🏋️‍♂️ 2. 找回并修复的：室外/载具/游乐设施/科学仪器
  // =====================================================================
  TREADMILL: (w=12, h=25) => (<g><rect width={w} height={h} fill="#334155" rx="2"/><rect x="2" y="4" width={w-4} height={h-8} fill="#0f172a"/><rect x="0" y="0" width={w} height="4" fill="#64748b" rx="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#94a3b8" textAnchor="middle" transform={`rotate(-90 ${w/2} ${h/2})`}>TREADMILL</text></g>),
  DUMBBELL: (w=15, h=6) => (<g><rect x="0" y="0" width="4" height={h} fill="#475569" rx="1"/><rect x="4" y={h/2-0.5} width={w-8} height="1" fill="#94a3b8"/><rect x={w-4} y="0" width="4" height={h} fill="#475569" rx="1"/></g>),
  BICYCLE: (w=20, h=8) => (<g><circle cx="4" cy="4" r="3.5" fill="none" stroke="#64748b" strokeWidth="1"/><circle cx={w-4} cy="4" r="3.5" fill="none" stroke="#64748b" strokeWidth="1"/><path d={`M 4 4 L 10 2 L 14 4 Z`} fill="none" stroke="#ef4444" strokeWidth="1"/><rect x="8" y="0" width="4" height="2" fill="#1e293b"/></g>),
  MOTORCYCLE: (w=24, h=10) => (<g><circle cx="5" cy="5" r="4" fill="#0f172a" stroke="#475569" strokeWidth="1"/><circle cx={w-5} cy="5" r="4" fill="#0f172a" stroke="#475569" strokeWidth="1"/><rect x="5" y="2" width={w-10} height="4" fill="#eab308" rx="2"/><rect x="8" y="1" width="6" height="2" fill="#000"/></g>),
  CAR: (w=35, h=16) => (<g><rect width={w} height={h} fill="#3b82f6" rx="4"/><rect x="6" y="2" width={w-12} height={h-4} fill="#0f172a" rx="2"/><rect x="10" y="3" width={w-20} height={h-6} fill="#3b82f6" rx="1"/><circle cx="5" cy="3" r="1.5" fill="#fde047"/><circle cx="5" cy={h-3} r="1.5" fill="#fde047"/><text x={w/2} y={h/2+1.5} fontSize="3" fill="#93c5fd" textAnchor="middle" fontWeight="bold">VEHICLE</text></g>),
  TOY_CAR: (w=15, h=10) => (<g><rect width={w} height={h} fill="#ec4899" rx="3"/><circle cx={w/2} cy={h/2} r="3" fill="#fbcfe8"/><rect x={w-2} y="2" width="2" height="6" fill="#be185d"/></g>),
  MODEL: (w=10, h=10) => (<g><rect x="2" y="8" width="6" height="2" fill="#475569"/><path d="M 5 8 L 5 4 L 1 4 L 5 0 L 9 4 L 5 4" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5"/></g>),
  LAB_EQUIPMENT: (w=15, h=10) => (<g><rect width={w} height={h} fill="#f1f5f9" rx="1" stroke="#cbd5e1"/><path d="M 3 8 L 5 4 L 5 2 L 7 2 L 7 4 L 9 8 Z" fill="#38bdf8" opacity="0.6"/><circle cx="12" cy="7" r="2" fill="#22c55e" opacity="0.6"/></g>),
  OBSTACLE: (w=15, h=15) => (<g><rect width={w} height={h} fill="#b45309" stroke="#713f12" strokeDasharray="2,2"/><line x1="0" y1="0" x2={w} y2={h} stroke="#713f12" strokeWidth="2"/><line x1={w} y1="0" x2="0" y2={h} stroke="#713f12" strokeWidth="2"/></g>),
  TRAINING_GROUND: (w=40, h=40) => (<g><rect width={w} height={h} fill="#166534" fillOpacity="0.4" stroke="#22c55e" strokeWidth="1" strokeDasharray="4,4"/><circle cx={w/2} cy={h/2} r={w/4} fill="none" stroke="#4ade80" strokeWidth="1"/><line x1={w/2} y1="0" x2={w/2} y2={h} stroke="#4ade80" strokeWidth="1"/></g>),
  MAZE: (w=40, h=40) => (<g><rect width={w} height={h} fill="#020617" stroke="#475569" strokeWidth="2"/><rect x="5" y="5" width={w-10} height={h-10} fill="none" stroke="#475569" strokeWidth="2"/><rect x="10" y="10" width={w-20} height={h-20} fill="none" stroke="#475569" strokeWidth="2"/><path d="M 5 15 L 10 15 M 35 25 L 30 25 M 20 5 L 20 10 M 20 35 L 20 30" stroke="#020617" strokeWidth="3"/></g>),
  MIRROR: (w=10, h=20) => (<g><rect width={w} height={h} fill="#f8fafc" stroke="#94a3b8" rx="5"/><path d="M 2 5 Q 5 10 2 15" fill="none" stroke="#38bdf8" strokeWidth="1"/></g>),
  // 🔥 完美修复截断断点的 SWING 组件 🔥
  SWING: (w=20, h=10) => (
    <g>
      <path d={`M 2 ${h} L 4 2 L ${w-4} 2 L ${w-2} ${h} M ${w/2} 2 L ${w/2} ${h-2}`} fill="none" stroke="#64748b" strokeWidth="1"/>
      <rect x={w/2 - 3} y={h-2} width="6" height="2" fill="#ef4444" rx="1"/>
      <text x={w/2} y={h/2+4} fontSize="2" fill="#f8fafc" textAnchor="middle" className="font-mono font-bold">SWING</text>
    </g>
  ),

  // =====================================================================
  // 🔶 3. 创世 18 炫彩几何体 (广场/迷宫搭建神器)
  // =====================================================================
  GEO_01: (w=10, h=10) => (<g><rect width={w} height={h} fill="#ef4444" fillOpacity="0.8" stroke="#f87171" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">RED_SQR</text></g>), // 红方块
  GEO_02: (w=10, h=10) => (<g><circle cx={w/2} cy={h/2} r={w/2} fill="#3b82f6" fillOpacity="0.8" stroke="#60a5fa" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">BLU_CIR</text></g>), // 蓝圆
  GEO_03: (w=10, h=10) => (<g><polygon points={`${w/2},0 0,${h} ${w},${h}`} fill="#10b981" fillOpacity="0.8" stroke="#34d399" strokeWidth="1"/><text x={w/2} y={h/2+2} fontSize="2" fill="#fff" textAnchor="middle">GRN_TRI</text></g>), // 绿三角
  GEO_04: (w=10, h=10) => (<g><polygon points={`${w/2},0 ${w},${h/2} ${w/2},${h} 0,${h/2}`} fill="#eab308" fillOpacity="0.8" stroke="#fde047" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">YEL_DIA</text></g>), // 黄菱形
  GEO_05: (w=10, h=10) => (<g><polygon points={`${w/4},0 ${w*0.75},0 ${w},${h/2} ${w*0.75},${h} ${w/4},${h} 0,${h/2}`} fill="#a855f7" fillOpacity="0.8" stroke="#c084fc" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">PUR_HEX</text></g>), // 紫六边形
  GEO_06: (w=10, h=10) => (<g><rect width={w} height={h} rx={w/2} fill="#f97316" fillOpacity="0.8" stroke="#fb923c" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">ORG_CAP</text></g>), // 橙胶囊体
  GEO_07: (w=10, h=10) => (<g><circle cx={w/2} cy={h/2} r={w/2-2} fill="none" stroke="#06b6d4" strokeWidth="3"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">CYN_RNG</text></g>), // 青色圆环
  GEO_08: (w=10, h=10) => (<g><path d={`M ${w/3} 0 L ${w*2/3} 0 L ${w*2/3} ${h/3} L ${w} ${h/3} L ${w} ${h*2/3} L ${w*2/3} ${h*2/3} L ${w*2/3} ${h} L ${w/3} ${h} L ${w/3} ${h*2/3} L 0 ${h*2/3} L 0 ${h/3} L ${w/3} ${h/3} Z`} fill="#ec4899" fillOpacity="0.8" stroke="#f472b6" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">PNK_CRS</text></g>), // 粉十字
  GEO_09: (w=10, h=10) => (<g><rect width={w} height={h} fill="#14b8a6" fillOpacity="0.5" stroke="#2dd4bf" strokeWidth="1" transform={`rotate(15 ${w/2} ${h/2})`}/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">TEA_TILT</text></g>), // 倾斜青砖
  GEO_10: (w=10, h=10) => (<g><polygon points={`0,${h/4} ${w},0 ${w},${h*0.75} 0,${h}`} fill="#8b5cf6" fillOpacity="0.8" stroke="#a78bfa" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">IND_PRL</text></g>), // 靛蓝平行四边形
  GEO_11: (w=10, h=10) => (<g><polygon points={`${w/2},0 ${w},${h*0.4} ${w*0.8},${h} ${w*0.2},${h} 0,${h*0.4}`} fill="#84cc16" fillOpacity="0.8" stroke="#a3e635" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">LIM_PEN</text></g>), // 亮绿五边形
  GEO_12: (w=10, h=10) => (<g><ellipse cx={w/2} cy={h/2} rx={w/2} ry={h/4} fill="#f43f5e" fillOpacity="0.8" stroke="#fb7185" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">ROS_ELL</text></g>), // 玫瑰椭圆
  GEO_13: (w=10, h=10) => (<g><path d={`M 0 ${h} Q ${w/2} 0 ${w} ${h} Z`} fill="#d946ef" fillOpacity="0.8" stroke="#f43f5e" strokeWidth="1"/><text x={w/2} y={h/2+3} fontSize="2" fill="#fff" textAnchor="middle">FUC_ARC</text></g>), // 紫红半拱门
  GEO_14: (w=10, h=10) => (<g><rect width={w} height={h} fill="#64748b" fillOpacity="0.8" stroke="#94a3b8" strokeWidth="1" strokeDasharray="1,1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">SLT_GRD</text></g>), // 虚线网格块
  GEO_15: (w=10, h=10) => (<g><polygon points={`${w/4},0 ${w*0.75},0 ${w},${h} 0,${h}`} fill="#06b6d4" fillOpacity="0.8" stroke="#22d3ee" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">CYN_TRP</text></g>), // 青色梯形
  GEO_16: (w=10, h=10) => (<g><path d={`M ${w/2} 0 L ${w} ${h/3} L ${w/2} ${h} L 0 ${h/3} Z`} fill="#10b981" fillOpacity="0.8" stroke="#34d399" strokeWidth="1"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">EMR_KTE</text></g>), // 祖母绿风筝形
  GEO_17: (w=10, h=10) => (<g><circle cx={w/2} cy={h/2} r={w/2} fill="#f59e0b" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="2"/><circle cx={w/2} cy={h/2} r={w/4} fill="#f59e0b" fillOpacity="0.8"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">AMB_TAR</text></g>), // 琥珀靶心
  GEO_18: (w=10, h=10) => (<g><rect width={w} height={h} fill="#334155" fillOpacity="0.9" stroke="#cbd5e1" strokeWidth="2" rx="1"/><path d={`M 0 0 L ${w} ${h} M ${w} 0 L 0 ${h}`} stroke="#cbd5e1" strokeWidth="1" opacity="0.5"/><text x={w/2} y={h/2+1} fontSize="2" fill="#fff" textAnchor="middle">STE_BOX</text></g>), // 钢铁X箱子

  // =====================================================================
  // ⚙️ 4. 默认兜底占位符 (防止任何未知物品导致系统崩溃)
  // =====================================================================
  GENERIC: (w=10, h=10, label="ITEM") => (<g><rect width={w} height={h} fill="#27272a" fillOpacity="0.6" stroke="#52525b" strokeWidth="0.5" strokeDasharray="2,2"/><text x={w/2} y={h/2+1} fontSize="2.5" fill="#a1a1aa" textAnchor="middle" dominantBaseline="middle" className="font-mono font-bold">{label?.substring(0,10)}</text></g>)
};