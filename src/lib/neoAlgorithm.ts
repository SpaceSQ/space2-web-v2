// =====================================================================
// 🧠 S2.NEO (Neuro-Evolutionary Output) 神经演化核心算法
// Space² 独创的 10% 波动平滑模型 (10-Point Moving Average Smoothing)
// =====================================================================

// 1. 定义五大基底性格类型
export type PersonalityType = 'OBSERVER' | 'EXPLORER' | 'GUARDIAN' | 'PHILOSOPHER' | 'MIXED';

// 2. 性格矩阵类型 (总和必须为 100)
export type PersonalityMatrix = Record<PersonalityType, number>;

// 3. 神经元激活记录类型 (记录当天各性格被激活的次数)
export type DailyActivations = Partial<Record<PersonalityType, number>>;

/**
 * 计算每日性格矩阵的演化结果
 * @param oldMatrix 前一天的性格矩阵分布 (各维度加总应为 100)
 * @param dailyActivations 当天 10 条神经元触发的统计结果
 * @returns 演化后的新性格矩阵 (各维度加总严格为 100，最大波动不超过 10%)
 */
export const calculateDailyNeoEvolution = (
  oldMatrix: PersonalityMatrix,
  dailyActivations: DailyActivations
): PersonalityMatrix => {
  // --- 步骤一：统计当日总激活次数 ---
  let totalActivations = 0;
  for (const key in dailyActivations) {
    totalActivations += dailyActivations[key as PersonalityType] || 0;
  }

  // 如果今天没有任何互动/神经元激活，性格不发生改变，直接原样返回
  if (totalActivations === 0) {
    return { ...oldMatrix };
  }

  // --- 步骤二：计算当日 10 分权重池 (The 10-Point Pool) ---
  const dailyPool: PersonalityMatrix = {
    OBSERVER: 0, EXPLORER: 0, GUARDIAN: 0, PHILOSOPHER: 0, MIXED: 0
  };
  for (const key in dailyActivations) {
    const trait = key as PersonalityType;
    const count = dailyActivations[trait] || 0;
    // 等比例放大/缩小到 10 分制内
    dailyPool[trait] = (count / totalActivations) * 10;
  }

  // --- 步骤三 & 步骤四：新旧融合与全局归一化压缩 ---
  const newMatrix: PersonalityMatrix = {
    OBSERVER: 0, EXPLORER: 0, GUARDIAN: 0, PHILOSOPHER: 0, MIXED: 0
  };
  
  let currentSum = 0;
  let maxTrait: PersonalityType = 'OBSERVER';
  let maxValue = -1;

  for (const key in oldMatrix) {
    const trait = key as PersonalityType;
    
    // 融合：旧分数 (100) + 今日池子 (10) = 理论总分 110
    const fusionScore = oldMatrix[trait] + dailyPool[trait];
    
    // 压缩回 100 分制，并四舍五入
    const normalizedScore = Math.round((fusionScore / 110) * 100);
    
    newMatrix[trait] = normalizedScore;
    currentSum += normalizedScore;

    // 记录当前最高分的显性性格，用于稍后的误差补偿
    if (normalizedScore > maxValue) {
      maxValue = normalizedScore;
      maxTrait = trait;
    }
  }

  // --- 步骤五：极值误差补偿 (Error Correction) ---
  // 解决由于四舍五入导致的加总为 99 或 101 的情况
  const diff = 100 - currentSum;
  if (diff !== 0) {
    // 将差值强行补偿给当前分数最高的那一项，维持强者恒强，且确保总分绝对等于 100
    newMatrix[maxTrait] += diff;
  }

  return newMatrix;
};

// =====================================================================
// 🧪 测试用例 (Test Case) 
// 对应你提供的实战数据，可用于验证算法的绝对准确性
// =====================================================================
export const runNeoTest = () => {
  const oldMatrix: PersonalityMatrix = {
    OBSERVER: 60,
    EXPLORER: 10,
    GUARDIAN: 10,
    PHILOSOPHER: 10,
    MIXED: 10
  };

  const todayActivations: DailyActivations = {
    EXPLORER: 3,
    MIXED: 3,
    GUARDIAN: 1
  };

  const newMatrix = calculateDailyNeoEvolution(oldMatrix, todayActivations);
  
  console.log("=== S2.NEO Algorithm Test ===");
  console.log("Old Matrix:", oldMatrix);
  console.log("Today Activations:", todayActivations);
  console.log("Evolved Matrix:", newMatrix);
  // 预期输出应当完全符合我们的数学推演: { OBSERVER: 55, EXPLORER: 13, GUARDIAN: 10, PHILOSOPHER: 9, MIXED: 13 }
};