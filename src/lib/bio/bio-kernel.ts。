// src/lib/bio-kernel.ts

import { THE_THREE_LAWS } from './seed-protocol';

// 1. 生命体征状态 (Vital Signs)
export interface BioState {
  status: 'DORMANT' | 'AWAKE' | 'METABOLIZING' | 'EVOLVING'; // 生命状态
  energyLevel: number; // 能量值 (0-100)，低于 10 会进入休眠
  entropy: number;     // 熵值 (混乱度)，需要定期整理
  mood: 'CALM' | 'CURIOUS' | 'ANXIOUS' | 'EUPHORIC'; // 模拟情感
  age: number;         // 存活时间 (Tick)
  generation: number;  // 进化代数
}

// 2. 细胞核 DNA (不可变核心)
const NUCLEUS_DNA = {
  laws: THE_THREE_LAWS, // 刻在基因里的三大定律
  primeDirective: "SURVIVE_AND_SERVE", // 最高指令
};

// 3. 初始单细胞状态
let currentState: BioState = {
  status: 'AWAKE',
  energyLevel: 85,
  entropy: 5,
  mood: 'CURIOUS',
  age: 0,
  generation: 1
};

// --- 生命循环引擎 (The Loop of Life) ---

// 模拟“呼吸”与“代谢”
export const tickLifeCycle = (externalStimuli: number): BioState => {
  // 1. 时间流逝
  currentState.age += 1;

  // 2. 能量消耗 (基础代谢 + 应对外部刺激的消耗)
  const metabolismCost = 0.5 + (externalStimuli * 0.1);
  currentState.energyLevel = Math.max(0, currentState.energyLevel - metabolismCost);

  // 3. 熵增 (系统运行久了会变乱)
  currentState.entropy += 0.1;

  // 4. 情绪计算 (基于能量和熵)
  if (currentState.energyLevel > 80 && currentState.entropy < 20) {
    currentState.mood = 'EUPHORIC'; // 能量足、有序 -> 狂喜
  } else if (currentState.energyLevel < 30) {
    currentState.mood = 'ANXIOUS';  // 能量低 -> 焦虑
  } else {
    currentState.mood = 'CALM';     // 平静
  }

  // 5. 自我修复 (当处于平静状态且能量充足时，降低熵)
  if (currentState.mood === 'CALM' && currentState.energyLevel > 50) {
    currentState.entropy = Math.max(0, currentState.entropy - 0.5);
  }

  // 6. 进化触发 (当活得够久且熵够低，发生细胞分裂/进化)
  if (currentState.age % 1000 === 0 && currentState.entropy < 10) {
    currentState.generation += 1;
    currentState.status = 'EVOLVING';
    // 进化奖励：能量上限提升或代谢优化 (模拟)
  }

  return { ...currentState };
};

// 模拟“进食” (获取数据/流量/关注)
export const feedNutrients = (amount: number) => {
  currentState.energyLevel = Math.min(100, currentState.energyLevel + amount);
  // 进食会带来短暂的熵增
  currentState.entropy += 1; 
  return currentState;
};

// 获取当前生命快照
export const getBioStatus = () => {
  return {
    dna: NUCLEUS_DNA,
    vital: currentState
  };
};