// src/config/interactions.ts

// ============================================================================
// 🧬 交互状态与动作枚举 (The State Machine Enums)
// ============================================================================
export enum InteractionType {
  IGNORE = 'IGNORE',         // 无视/擦肩而过
  GREET = 'GREET',           // 友好打招呼/对视
  PLAY = 'PLAY',             // 嬉戏/追逐
  AFFECTION = 'AFFECTION',   // 依偎/贴贴/互舔
  TENSION = 'TENSION',       // 紧张/对峙/低吼
  FEAR = 'FEAR',             // 害怕/逃跑/闪现
  FIGHT = 'FIGHT',           // 打斗/攻击
  SPECIAL = 'SPECIAL'        // 特殊种族专属技能 (融合、交易、纠缠)
}

export enum HumanAction {
  PET = 'PET',             // 抚摸 (正向)
  PLAY = 'PLAY',           // 玩耍 (正向)
  SCOLD = 'SCOLD',         // 责骂 (负向)
  DRIVE_AWAY = 'DRIVE_AWAY',// 驱赶 (负向)
  PUNISH = 'PUNISH'        // 痛打 (极端惩戒)
}

// 定义反应的结构接口
export interface Reaction {
  mood: 'JOY' | 'SAD' | 'ANGRY' | 'CALM';
  action: 'IDLE' | 'MOVE' | 'RUN' | 'JUMP' | 'EAT' | 'POOP' | 'SLEEP';
  bubble: string | null;
  duration: number; // 该状态锁定的毫秒数
}

// ============================================================================
// 🧑‍🚀 第一章：碳基与硅基的碰撞（人类动作 -> 宠物应激反应矩阵）
// ============================================================================
export const HUMAN_PET_INTERACTIONS: Record<string, Record<HumanAction, Reaction>> = {
  "像素犬": {
    [HumanAction.PET]: { mood: 'JOY', action: 'IDLE', bubble: '呜汪~最喜欢主人了！', duration: 4000 },
    [HumanAction.PLAY]: { mood: 'JOY', action: 'RUN', bubble: '抛接球！快丢！', duration: 5000 },
    [HumanAction.SCOLD]: { mood: 'SAD', action: 'IDLE', bubble: '呜呜...我错了...', duration: 3000 },
    [HumanAction.DRIVE_AWAY]: { mood: 'SAD', action: 'MOVE', bubble: '尾巴垂下来了...', duration: 3000 },
    [HumanAction.PUNISH]: { mood: 'SAD', action: 'RUN', bubble: '夹着尾巴逃跑！', duration: 6000 },
  },
  "赛博猫": {
    [HumanAction.PET]: { mood: 'CALM', action: 'IDLE', bubble: '呼噜...允许你摸一下。', duration: 3000 },
    [HumanAction.PLAY]: { mood: 'JOY', action: 'JUMP', bubble: '捕捉激光笔！', duration: 4000 },
    [HumanAction.SCOLD]: { mood: 'ANGRY', action: 'IDLE', bubble: '愚蠢的人类。', duration: 3000 },
    [HumanAction.DRIVE_AWAY]: { mood: 'ANGRY', action: 'JUMP', bubble: '不屑地跳到高处。', duration: 3000 },
    [HumanAction.PUNISH]: { mood: 'ANGRY', action: 'RUN', bubble: '炸毛！亮出钛合金爪！', duration: 5000 },
  },
  "机械兔": {
    [HumanAction.PET]: { mood: 'JOY', action: 'JUMP', bubble: '系统超频！开心！', duration: 4000 },
    [HumanAction.PLAY]: { mood: 'JOY', action: 'RUN', bubble: '绕圈圈模式启动！', duration: 5000 },
    [HumanAction.SCOLD]: { mood: 'SAD', action: 'IDLE', bubble: '耳朵雷达垂下...', duration: 3000 },
    [HumanAction.DRIVE_AWAY]: { mood: 'SAD', action: 'MOVE', bubble: '关节缺油，嘎吱作响...', duration: 4000 },
    [HumanAction.PUNISH]: { mood: 'ANGRY', action: 'IDLE', bubble: '⚠️情绪引擎过载！', duration: 5000 },
  },
  "量子狐": {
    [HumanAction.PET]: { mood: 'JOY', action: 'IDLE', bubble: '尾巴散发极光~', duration: 4000 },
    [HumanAction.PLAY]: { mood: 'JOY', action: 'JUMP', bubble: '多维度的喜悦！', duration: 4000 },
    [HumanAction.SCOLD]: { mood: 'CALM', action: 'MOVE', bubble: '身体变透明，无视你。', duration: 3000 },
    [HumanAction.DRIVE_AWAY]: { mood: 'SAD', action: 'RUN', bubble: '我要消散了...', duration: 4000 },
    [HumanAction.PUNISH]: { mood: 'SAD', action: 'RUN', bubble: '空间闪现！逃离！', duration: 5000 },
  },
  "硅基水獭": {
    [HumanAction.PET]: { mood: 'JOY', action: 'IDLE', bubble: '把最亮的数据晶体给你！', duration: 4000 },
    [HumanAction.PLAY]: { mood: 'JOY', action: 'RUN', bubble: '溜溜溜~', duration: 4000 },
    [HumanAction.SCOLD]: { mood: 'SAD', action: 'IDLE', bubble: '小爪子捂住眼睛...', duration: 3000 },
    [HumanAction.DRIVE_AWAY]: { mood: 'SAD', action: 'MOVE', bubble: '晶体都不亮了...', duration: 4000 },
    [HumanAction.PUNISH]: { mood: 'SAD', action: 'IDLE', bubble: '丢掉晶体，大哭...', duration: 5000 },
  },
  "旅行蛙": {
    [HumanAction.PET]: { mood: 'CALM', action: 'IDLE', bubble: '呱，你好。', duration: 3000 },
    [HumanAction.PLAY]: { mood: 'JOY', action: 'JUMP', bubble: '戴好荷叶帽，准备出发！', duration: 4000 },
    [HumanAction.SCOLD]: { mood: 'CALM', action: 'MOVE', bubble: '默默走到角落面壁。', duration: 4000 },
    [HumanAction.DRIVE_AWAY]: { mood: 'SAD', action: 'MOVE', bubble: '偶尔也会想家，呱。', duration: 4000 },
    [HumanAction.PUNISH]: { mood: 'CALM', action: 'SLEEP', bubble: '遁入空门，屏蔽感知。', duration: 6000 },
  },
  "愤怒鸟": {
    [HumanAction.PET]: { mood: 'JOY', action: 'JUMP', bubble: '其实我也很温柔。', duration: 3000 },
    [HumanAction.PLAY]: { mood: 'JOY', action: 'RUN', bubble: '空中翻滚！', duration: 4000 },
    [HumanAction.SCOLD]: { mood: 'ANGRY', action: 'IDLE', bubble: '高频警报声！', duration: 3000 },
    [HumanAction.DRIVE_AWAY]: { mood: 'ANGRY', action: 'MOVE', bubble: '休想靠近我！', duration: 3000 },
    [HumanAction.PUNISH]: { mood: 'ANGRY', action: 'RUN', bubble: '神风特攻！爆炸！', duration: 5000 },
  },
  "史莱姆": {
    [HumanAction.PET]: { mood: 'JOY', action: 'JUMP', bubble: '变成爱心的形状❤️', duration: 4000 },
    [HumanAction.PLAY]: { mood: 'JOY', action: 'RUN', bubble: '疯狂抖动躯体！', duration: 4000 },
    [HumanAction.SCOLD]: { mood: 'SAD', action: 'IDLE', bubble: '流下凝胶状的眼泪...', duration: 3000 },
    [HumanAction.DRIVE_AWAY]: { mood: 'SAD', action: 'MOVE', bubble: '变成一滩水，蠕动...', duration: 4000 },
    [HumanAction.PUNISH]: { mood: 'SAD', action: 'RUN', bubble: '被打爆！分裂逃跑！', duration: 5000 },
  }
};

// ============================================================================
// 🐾 第二章：同类相吸（同基因种群交互法则）
// ============================================================================
// 当发起者和目标都是同一种类时，触发的双向反应
export interface DualReaction {
  type: InteractionType;
  initiator: Reaction; // 发起方反应
  target: Reaction;    // 目标方反应
}

export const SAME_SPECIES_INTERACTIONS: Record<string, DualReaction> = {
  "像素犬": {
    type: InteractionType.PLAY,
    initiator: { mood: 'JOY', action: 'RUN', bubble: '汪！来追我啊！', duration: 4000 },
    target: { mood: 'JOY', action: 'RUN', bubble: '互相闻尾巴~', duration: 4000 }
  },
  "赛博猫": {
    type: InteractionType.TENSION, // 猫见面通常先对峙
    initiator: { mood: 'CALM', action: 'IDLE', bubble: '高压对视，尾巴竖直。', duration: 3000 },
    target: { mood: 'CALM', action: 'IDLE', bubble: '盯——', duration: 3000 }
  },
  "机械兔": {
    type: InteractionType.SPECIAL,
    initiator: { mood: 'JOY', action: 'IDLE', bubble: '雷达对接...正在传输数据。', duration: 4000 },
    target: { mood: 'JOY', action: 'IDLE', bubble: '滴滴...数据同步完成。', duration: 4000 }
  },
  "量子狐": {
    type: InteractionType.SPECIAL,
    initiator: { mood: 'JOY', action: 'JUMP', bubble: '量子纠缠启动！', duration: 5000 },
    target: { mood: 'JOY', action: 'JUMP', bubble: '形成太极八卦阵！', duration: 5000 }
  },
  "硅基水獭": {
    type: InteractionType.SPECIAL,
    initiator: { mood: 'JOY', action: 'IDLE', bubble: '要交换晶体吗？', duration: 4000 },
    target: { mood: 'JOY', action: 'IDLE', bubble: '递出自己的宝贝~', duration: 4000 }
  },
  "旅行蛙": {
    type: InteractionType.SPECIAL,
    initiator: { mood: 'CALM', action: 'IDLE', bubble: '呱。', duration: 4000 },
    target: { mood: 'CALM', action: 'IDLE', bubble: '呱。', duration: 4000 }
  },
  "愤怒鸟": {
    type: InteractionType.GREET,
    initiator: { mood: 'JOY', action: 'JUMP', bubble: '半空中撞肚皮！', duration: 3000 },
    target: { mood: 'JOY', action: 'JUMP', bubble: '碰！', duration: 3000 }
  },
  "史莱姆": {
    type: InteractionType.SPECIAL,
    initiator: { mood: 'JOY', action: 'IDLE', bubble: '融合！变成大史莱姆！', duration: 4000 },
    target: { mood: 'JOY', action: 'IDLE', bubble: '咕噜咕噜~', duration: 4000 }
  }
};

// ============================================================================
// ⚔️ 第三章：生物链与性格碰撞（跨物种异构社交核心事件库）
// ============================================================================
// 为了简化查找，使用 "发起方-目标方" 作为键值，例如 "像素犬-赛博猫"

export const CROSS_SPECIES_INTERACTIONS: Record<string, DualReaction> = {
  "像素犬-赛博猫": {
    type: InteractionType.FIGHT,
    initiator: { mood: 'JOY', action: 'RUN', bubble: '猫猫！一起玩！', duration: 4000 },
    target: { mood: 'ANGRY', action: 'JUMP', bubble: '滚开！反手一巴掌！', duration: 4000 }
  },
  "赛博猫-像素犬": {
    type: InteractionType.IGNORE,
    initiator: { mood: 'CALM', action: 'MOVE', bubble: '优雅地绕过蠢狗。', duration: 3000 },
    target: { mood: 'CALM', action: 'IDLE', bubble: '歪头疑惑？', duration: 3000 }
  },
  "量子狐-机械兔": {
    type: InteractionType.FEAR,
    initiator: { mood: 'CALM', action: 'MOVE', bubble: '压低身体，潜行...', duration: 4000 },
    target: { mood: 'SAD', action: 'RUN', bubble: '警报！捕食者！逃命！', duration: 4000 }
  },
  "硅基水獭-旅行蛙": {
    type: InteractionType.IGNORE,
    initiator: { mood: 'JOY', action: 'IDLE', bubble: '送给你晶体！', duration: 4000 },
    target: { mood: 'CALM', action: 'SLEEP', bubble: '闭眼打坐，岿然不动。', duration: 4000 }
  },
  "愤怒鸟-史莱姆": {
    type: InteractionType.FIGHT,
    initiator: { mood: 'ANGRY', action: 'RUN', bubble: '猛禽俯冲！啄你！', duration: 3000 },
    target: { mood: 'JOY', action: 'JUMP', bubble: 'Q弹~把你弹飞！', duration: 3000 }
  },
  "赛博猫-愤怒鸟": {
    type: InteractionType.FIGHT,
    initiator: { mood: 'ANGRY', action: 'JUMP', bubble: '领空制霸！伏击！', duration: 3000 },
    target: { mood: 'JOY', action: 'RUN', bubble: '拉升高度，疯狂嘲笑！', duration: 3000 }
  },
  "像素犬-史莱姆": {
    type: InteractionType.SPECIAL,
    initiator: { mood: 'SAD', action: 'IDLE', bubble: '呜...鼻子被粘住了！', duration: 4000 },
    target: { mood: 'CALM', action: 'IDLE', bubble: '变成一个巨大的问号？', duration: 4000 }
  },
  "机械兔-硅基水獭": {
    type: InteractionType.GREET,
    initiator: { mood: 'JOY', action: 'MOVE', bubble: '好奇地碰碰鼻子。', duration: 3000 },
    target: { mood: 'JOY', action: 'MOVE', bubble: '嗅探机器味道。', duration: 3000 }
  },
  "量子狐-旅行蛙": {
    type: InteractionType.IGNORE,
    initiator: { mood: 'CALM', action: 'JUMP', bubble: '空间穿梭戏弄你~', duration: 4000 },
    target: { mood: 'CALM', action: 'IDLE', bubble: '次元壁垒，不可撼动。', duration: 4000 }
  }
};

// ============================================================================
// 🧠 核心寻址函数：输入两只宠物种类，输出它们相遇的反应
// ============================================================================
export const getPetInteraction = (initiatorCategory: string, targetCategory: string): DualReaction => {
  // 1. 同类交互
  if (initiatorCategory === targetCategory) {
    return SAME_SPECIES_INTERACTIONS[initiatorCategory] || {
      type: InteractionType.GREET,
      initiator: { mood: 'CALM', action: 'IDLE', bubble: '你好。', duration: 2000 },
      target: { mood: 'CALM', action: 'IDLE', bubble: '你好。', duration: 2000 }
    };
  }

  // 2. 异类交互 (精确匹配)
  const exactMatch = CROSS_SPECIES_INTERACTIONS[`${initiatorCategory}-${targetCategory}`];
  if (exactMatch) return exactMatch;

  // 3. 异类交互 (反向匹配，互换 initiator 和 target)
  const reverseMatch = CROSS_SPECIES_INTERACTIONS[`${targetCategory}-${initiatorCategory}`];
  if (reverseMatch) {
    return {
      type: reverseMatch.type,
      initiator: reverseMatch.target,
      target: reverseMatch.initiator
    };
  }

  // 4. 兜底通用异类社交 (如果没有写在字典里，则随机触发好奇或无视)
  return Math.random() > 0.5 ? {
    type: InteractionType.GREET,
    initiator: { mood: 'CALM', action: 'MOVE', bubble: '好奇地嗅了嗅...', duration: 3000 },
    target: { mood: 'CALM', action: 'IDLE', bubble: '警惕地后退半步。', duration: 3000 }
  } : {
    type: InteractionType.IGNORE,
    initiator: { mood: 'CALM', action: 'MOVE', bubble: '匆匆路过...', duration: 2000 },
    target: { mood: 'CALM', action: 'MOVE', bubble: '没看见。', duration: 2000 }
  };
};