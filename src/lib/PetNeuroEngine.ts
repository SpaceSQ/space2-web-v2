// src/lib/PetNeuroEngine.ts

// 定义五维性格数据结构
export interface PetStats {
  energy: number;     // 活力
  bravery: number;    // 胆量
  appetite: number;   // 食欲
  intel: number;      // 智力
  affection: number;  // 粘人
}

// 关键词词库 (引入了生物学的正负向双轨机制)
const KEYWORD_DICTIONARY = {
  energy: {
    positive: ['活力', '精神', '活跃', '活泼', '旺盛', '充沛', '跑', '运动', '玩耍', '兴奋'],
    negative: ['累', '困', '虚弱', '生病', '奄奄一息', '睡觉', '不动']
  },
  bravery: {
    positive: ['胆大', '勇敢', '保护', '打架', '不害怕', '冲', '咬'],
    negative: ['害怕', '躲', '逃跑', '发抖', '吓', '巨大声响']
  },
  appetite: {
    positive: ['吃', '饿', '食物', '抢食', '大胃', '香', '零食'],
    negative: ['厌食', '吐', '不吃', '剩饭']
  },
  intel: {
    positive: ['聪明', '听懂', '指令', '学习', '思考', '发现', '狡猾'],
    negative: ['笨', '撞墙', '傻', '没反应', '迷路']
  },
  affection: {
    positive: ['粘人', '跟随', '抱', '摸', '贴贴', '蹭', '喜欢主人', '乖巧'],
    negative: ['打', '骂', '驱赶', '孤单', '不理', '抛弃', '独立']
  }
};

export class PetNeuroEngine {
  
  /**
   * 核心算法 1：计算每日性格增量 (完美还原白皮书的边际递减法则)
   * @param currentScore 当前该维度的分数
   * @param weightScore 今日通过文本匹配获得的权值得分 (正数或负数)
   */
  static calculateIncrement(currentScore: number, weightScore: number): number {
    if (weightScore === 0) return 0;

    let multiplier = 1;
    // 无论是加分还是扣分，都受当前分数的阻力影响
    // 越接近极值，改变越难 (还原白皮书的 1/2, 1/4, 1/8... 逻辑)
    if (currentScore >= 50 && currentScore < 60) multiplier = 0.5;
    else if (currentScore >= 60 && currentScore < 70) multiplier = 0.25;
    else if (currentScore >= 70 && currentScore < 80) multiplier = 0.125; // 1/8
    else if (currentScore >= 80 && currentScore < 85) multiplier = 0.0625; // 1/16
    else if (currentScore >= 85 && currentScore < 90) multiplier = 0.03125; // 1/32
    else if (currentScore >= 90 && currentScore < 95) multiplier = 0.015625; // 1/64
    else if (currentScore >= 95) multiplier = 0.0078125; // 1/128

    // 如果分数极低，恢复起来也会有特定曲线 (这里简化为低分段快速反弹)
    if (currentScore < 50) {
       multiplier = 1.0; 
    }

    return weightScore * multiplier;
  }

  /**
   * 核心算法 2：每日日志解析与神经元重塑 (Daily Batch Processing)
   * 在每天 5:59 分由 Cron Job 调用
   */
  static processDailyLogs(currentStats: PetStats, dailyTextLogs: string): PetStats {
    const newStats = { ...currentStats };
    const logStr = dailyTextLogs.toLowerCase();

    // 遍历五个维度
    for (const dimension in KEYWORD_DICTIONARY) {
      const key = dimension as keyof PetStats;
      let dailyWeightScore = 0;

      // 统计正向关键词
      KEYWORD_DICTIONARY[key].positive.forEach(word => {
        const regex = new RegExp(word, 'g');
        const matches = logStr.match(regex);
        if (matches) dailyWeightScore += matches.length; // 每次出现 +1 分
      });

      // 统计负向关键词 (创伤扣分)
      KEYWORD_DICTIONARY[key].negative.forEach(word => {
        const regex = new RegExp(word, 'g');
        const matches = logStr.match(regex);
        if (matches) dailyWeightScore -= matches.length; // 每次出现 -1 分
      });

      // 突触修剪法则 (生物遗忘曲线)：如果今天没有任何刺激，微弱掉分回归 50
      if (dailyWeightScore === 0) {
         if (newStats[key] > 50) newStats[key] -= 0.2;
         else if (newStats[key] < 50) newStats[key] += 0.2;
      } else {
         // 应用边际递减算法进行增量加减
         const increment = this.calculateIncrement(newStats[key], dailyWeightScore);
         newStats[key] += increment;
      }

      // 物理极值锁定
      newStats[key] = Math.max(0, Math.min(100, newStats[key]));
    }

    return newStats;
  }

  /**
   * 核心算法 3：基于性格生成行为概率 (平滑 Sigmoid 函数替代生硬的If-Else)
   * @param traitValue 某项性格的值 (0-100)
   * @param isHostileEnvironment 环境是否恶劣/陌生 (影响基准线)
   * @returns 触发特定高级行为的概率 (0.00 - 1.00)
   */
  static getActionProbability(traitValue: number, isHostileEnvironment: boolean = false): number {
    // 将 0-100 映射到 Sigmoid 曲线的 X 轴 (-5 到 5)
    // 假设 50 分是 50% 概率，75分是 88% 概率，90分是 98% 概率
    let x = (traitValue - 50) / 10; 
    
    // 如果环境恶劣，整体表现欲望下降 (曲线右移)
    if (isHostileEnvironment) x -= 1.5;

    // Sigmoid function: f(x) = 1 / (1 + e^-x)
    const probability = 1 / (1 + Math.exp(-x));
    
    return probability;
  }

  /**
   * 业务应用示例：判断宠物看到陌生人是否会摇尾巴打招呼
   */
  static willGreetStranger(stats: PetStats): boolean {
    // 综合【活力】和【胆量】
    const compositeScore = (stats.energy * 0.6) + (stats.bravery * 0.4);
    const prob = this.getActionProbability(compositeScore);
    // 掷骰子
    return Math.random() < prob;
  }
}