// src/config/blueprints.ts

export const DEFAULT_CELLS = [
  true, true, true,
  true, true, true,
  true, true, true
];

// 初始化 1 号房间 (默认有沙发和电视，属于公共区)
export const ROOM_1_ITEMS = [
  { type: 'SOFA', x: 20, y: 15, w: 12, h: 24 }, // 沙发：触发摄像头
  { type: 'TV', x: 80, y: 20, w: 15, h: 5 },    // 电视：触发影像
  { type: 'SUPPLY', x: 40, y: 55, w: 10, h: 6 },
  { type: 'LITTER_BOX', x: 52, y: 55, w: 10, h: 6 }
];

export const AGI_BLUEPRINTS: Record<string, any[]> = {
  // 现代客厅：有沙发、电视 -> 有摄像、有电视
  'LIVING_MODERN': [
    { type: 'SOFA', x: 15, y: 20, w: 12, h: 24 },
    { type: 'TV', x: 80, y: 25, w: 15, h: 5 },
    { type: 'PLANT', x: 10, y: 10, w: 8, h: 8 },
  ],
  // 探险游乐区：有游乐设施 -> 有摄像、无电视
  'ADVENTURE_SPACE': [
    { type: 'MAZE', x: 20, y: 20, w: 20, h: 20 },
    { type: 'SWING', x: 60, y: 20, w: 20, h: 10 },
  ],
  // 私密睡眠舱：只有床 -> 无摄像、无电视
  'PRIVATE_BEDROOM': [
    { type: 'BED', x: 40, y: 40, w: 25, h: 18 },
  ],
  // 餐厅：只有桌子 -> 有摄像 (公共区)、无电视
  'DINING_FEAST': [
    { type: 'TABLE', x: 30, y: 40, w: 30, h: 15 },
    { type: 'PLANT', x: 80, y: 10, w: 8, h: 8 },
  ]
};