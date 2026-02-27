// src/config/iot_scenarios.ts

export type ScenarioType = 'COMFORT' | 'STRESS';

export interface IoTParams {
  light?: string;     // 光照 (e.g., "300Lux 暖光", "0Lux 全黑")
  temp?: number;      // 温度 (℃)
  humidity?: number;  // 湿度 (%)
  sound?: string;     // 声音 (e.g., "白噪音 40dB", "雷暴 85dB")
  smell?: string;     // 气味
  object?: string;    // 物理实体干预 (e.g., "扫地机器人", "高级虚拟罐头")
}

export interface NeuroImpact {
  energy: number;
  bravery: number;
  appetite: number;
  intel: number;
  affection: number;
}

export interface IoTScenario {
  id: string;
  name: string;
  type: ScenarioType;
  description: string;
  iotParams: IoTParams;
  expectedBehavior: string;
  neuroImpact: NeuroImpact;
}

// ============================================================================
// 🌟 Space2.homes 物理干预场景核心字典 (20个)
// ============================================================================
export const IOT_SCENARIOS: Record<string, IoTScenario> = {

  // ------------------- 🟢 矩阵 A：多巴胺温室 (COMFORT) -------------------
  'SCENE_MORNING_DEW': {
    id: 'SCENE_MORNING_DEW', name: '晨曦唤醒 (Morning Dew)', type: 'COMFORT',
    description: '平缓的清晨唤醒，清除夜间轻微焦虑。',
    iotParams: { light: '2700K 暖光缓升至 300Lux', temp: 24, sound: '清脆鸟鸣 30dB', smell: '晨露/青草香氛' },
    expectedBehavior: '从睡姿平缓起身，伸懒腰，开始巡视领地。',
    neuroImpact: { energy: +2, bravery: 0, appetite: +1, intel: 0, affection: 0 }
  },
  'SCENE_GOURMET': {
    id: 'SCENE_GOURMET', name: '米其林三星 (Gourmet Feast)', type: 'COMFORT',
    description: '极度奖励机制，提升食欲与粘人。',
    iotParams: { light: '投喂区聚光灯', smell: '浓郁肉香', object: '高级虚拟罐头' },
    expectedBehavior: '以最高速冲刺，疯狂摇尾巴，大口进食。',
    neuroImpact: { energy: +1, bravery: 0, appetite: +5, intel: 0, affection: +3 }
  },
  'SCENE_FOREST': {
    id: 'SCENE_FOREST', name: '全息森林浴 (Holographic Forest)', type: 'COMFORT',
    description: '数字SPA，缓慢回血。',
    iotParams: { light: '绿色极光涟漪', humidity: 65, sound: '风吹树叶与溪流声', smell: '松柏香' },
    expectedBehavior: '安静地趴在中央享受，降低防备。',
    neuroImpact: { energy: +2, bravery: +1, appetite: 0, intel: 0, affection: +1 }
  },
  'SCENE_PUZZLE': {
    id: 'SCENE_PUZZLE', name: '智力解谜阵 (Puzzle Matrix)', type: 'COMFORT',
    description: '高强度智力特训，消耗体力。',
    iotParams: { light: '冷白光 800Lux', temp: 20, object: '逻辑寻回球' },
    expectedBehavior: '耳朵竖起，全神贯注盯住指令和物体轨迹，反复试错。',
    neuroImpact: { energy: -2, bravery: 0, appetite: +1, intel: +4, affection: 0 }
  },
  'SCENE_FIREPLACE': {
    id: 'SCENE_FIREPLACE', name: '壁炉夜话 (Cozy Fireplace)', type: 'COMFORT',
    description: '极度依恋环境，培养粘人属性。',
    iotParams: { light: '橙色仿火光跳动', temp: 28, sound: '木柴燃烧噼啪声 40dB' },
    expectedBehavior: '主动走到热源附近蜷缩入睡。',
    neuroImpact: { energy: -1, bravery: -1, appetite: 0, intel: 0, affection: +5 }
  },
  'SCENE_DISCO': {
    id: 'SCENE_DISCO', name: '狂热迪斯科 (Laser Disco)', type: 'COMFORT',
    description: '活力爆发，但易导致疲劳。',
    iotParams: { light: 'RGB 霓虹频闪', sound: '动感电音 70dB', object: '扫地机无规律移动' },
    expectedBehavior: '跟着光点和音乐疯狂蹦跳追逐。',
    neuroImpact: { energy: +4, bravery: +1, appetite: 0, intel: -1, affection: 0 }
  },
  'SCENE_SPA': {
    id: 'SCENE_SPA', name: '温泉理疗 (Bubble Spa)', type: 'COMFORT',
    description: '深度放松，降低警惕。',
    iotParams: { humidity: 80, temp: 26, sound: '舒缓水流声', smell: '薰衣草香' },
    expectedBehavior: '闭上眼睛，动作变缓。',
    neuroImpact: { energy: -2, bravery: -2, appetite: 0, intel: 0, affection: +3 }
  },
  'SCENE_HIDE_SEEK': {
    id: 'SCENE_HIDE_SEEK', name: '捉迷藏寻宝 (Hide & Seek)', type: 'COMFORT',
    description: '综合探索能力训练。',
    iotParams: { light: '角落微光', sound: '角落滴滴声', smell: '定向食物香气' },
    expectedBehavior: '利用嗅觉和听觉在空间内来回穿梭探索。',
    neuroImpact: { energy: +2, bravery: +1, appetite: +2, intel: +2, affection: 0 }
  },
  'SCENE_SYMPHONY': {
    id: 'SCENE_SYMPHONY', name: '交响音乐厅 (Symphony Hall)', type: 'COMFORT',
    description: '平抑多动症，转化为专注力。',
    iotParams: { light: '缓慢呼吸灯', sound: '古典交响乐' },
    expectedBehavior: '停止上蹿下跳，静坐或卧倒。',
    neuroImpact: { energy: -3, bravery: 0, appetite: 0, intel: +2, affection: 0 }
  },
  'SCENE_ZERO_G': {
    id: 'SCENE_ZERO_G', name: '失重冥想舱 (Zero-Gravity)', type: 'COMFORT',
    description: '重置状态，清除近期负面情绪。',
    iotParams: { light: '深紫色缓慢呼吸', temp: 23, sound: '深海白噪音 20dB' },
    expectedBehavior: '进入深度休眠状态。',
    neuroImpact: { energy: +1, bravery: +1, appetite: +1, intel: 0, affection: 0 } // 平缓回血
  },

  // ------------------- 🔴 矩阵 B：皮质醇炼狱 (STRESS) -------------------
  'SCENE_THUNDERSTORM': {
    id: 'SCENE_THUNDERSTORM', name: '末日雷暴 (Thunderstorm)', type: 'STRESS',
    description: '终极脱敏特训，重创胆量，激发应激。',
    iotParams: { light: '瞬间 2000Lux 闪电后全黑', temp: 16, humidity: 80, sound: '雷击轰鸣 85dB' },
    expectedBehavior: '疯跑寻找掩体发抖，或对着音响狂吠防御。',
    neuroImpact: { energy: -2, bravery: -5, appetite: -3, intel: 0, affection: 0 }
  },
  'SCENE_RED_ALERT': {
    id: 'SCENE_RED_ALERT', name: '红灯警报 (Red Alert)', type: 'STRESS',
    description: '生死存亡考验，激发护主基因。',
    iotParams: { light: '血红色频闪', sound: '防空警报 80dB', object: '门锁被暴力破拆声' },
    expectedBehavior: '进入极端应激状态，呲牙，毛发竖立。',
    neuroImpact: { energy: -3, bravery: +4, appetite: -2, intel: 0, affection: +2 }
  },
  'SCENE_DEPRIVATION': {
    id: 'SCENE_DEPRIVATION', name: '幽闭深渊 (Sensory Deprivation)', type: 'STRESS',
    description: '极端惩罚/洗脑，摧毁活力与粘人。',
    iotParams: { light: '0 Lux', sound: '0 dB 死寂', smell: '强力除味(剥夺气味)' },
    expectedBehavior: '初期焦躁，后期原地僵直(习得性无助)。',
    neuroImpact: { energy: -5, bravery: -2, appetite: -2, intel: -1, affection: -4 }
  },
  'SCENE_HEATWAVE': {
    id: 'SCENE_HEATWAVE', name: '沙漠热浪 (Heatwave)', type: 'STRESS',
    description: '极度消耗体力与水分。',
    iotParams: { light: '正黄光 1500Lux', temp: 35, humidity: 20 },
    expectedBehavior: '吐舌头喘气，拒绝移动，寻找阴凉处。',
    neuroImpact: { energy: -4, bravery: 0, appetite: -1, intel: 0, affection: 0 }
  },
  'SCENE_BLIZZARD': {
    id: 'SCENE_BLIZZARD', name: '极地寒潮 (Arctic Blizzard)', type: 'STRESS',
    description: '极端寒冷，极速提升对主人的依恋。',
    iotParams: { light: '冷白光微弱闪烁', temp: 10, sound: '高频呼啸风声' },
    expectedBehavior: '身体蜷缩发抖，拼命寻找热源。',
    neuroImpact: { energy: -3, bravery: +1, appetite: +2, intel: 0, affection: +6 }
  },
  'SCENE_PREDATOR': {
    id: 'SCENE_PREDATOR', name: '废土巨兽投影 (Phantom Predator)', type: 'STRESS',
    description: '激活远古生存基因的终极恐惧。',
    iotParams: { light: '墙面巨型黑影', sound: '喉音低吼 45dB', smell: '野兽气味' },
    expectedBehavior: '退到墙角，发出低沉警告声。',
    neuroImpact: { energy: -2, bravery: +5, appetite: -4, intel: 0, affection: -1 }
  },
  'SCENE_ROGUE_MACHINES': {
    id: 'SCENE_ROGUE_MACHINES', name: '赛博机械清剿 (Rogue Machines)', type: 'STRESS',
    description: '高压下的敏捷与规避训练。',
    iotParams: { sound: '机械齿轮与马达噪音', object: '多台扫地机随机冲撞' },
    expectedBehavior: '在房间内惊慌逃窜，寻找高处躲避。',
    neuroImpact: { energy: -4, bravery: -2, appetite: 0, intel: +3, affection: 0 }
  },
  'SCENE_TREMOR': {
    id: 'SCENE_TREMOR', name: '地震模拟 (Seismic Tremor)', type: 'STRESS',
    description: '不可抗力恐惧，重创心理防线。',
    iotParams: { light: '忽明忽暗', sound: '重低音 20Hz (地板震动)' },
    expectedBehavior: '失去平衡感，趴在地上不敢动弹。',
    neuroImpact: { energy: -2, bravery: -4, appetite: -2, intel: 0, affection: +1 }
  },
  'SCENE_TOXIC': {
    id: 'SCENE_TOXIC', name: '毒气泄漏 (Toxic Leak)', type: 'STRESS',
    description: '嗅觉剥夺，极度折磨。',
    iotParams: { light: '惨绿色微光', sound: '管道漏气嘶嘶声', smell: '化学刺鼻气味' },
    expectedBehavior: '频繁打喷嚏，捂住鼻子，尝试逃离。',
    neuroImpact: { energy: -4, bravery: -1, appetite: -5, intel: 0, affection: 0 }
  },
  'SCENE_DRONE_SWARM': {
    id: 'SCENE_DRONE_SWARM', name: '无人机蜂群 (Drone Swarm)', type: 'STRESS',
    description: '高压消耗战。',
    iotParams: { light: '红色激光束网', sound: '高频蜂鸣声' },
    expectedBehavior: '追逐激光束或藏在盲区。',
    neuroImpact: { energy: -5, bravery: +1, appetite: 0, intel: +2, affection: 0 }
  }
};