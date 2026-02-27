// src/lib/bio/lumi-profile.ts

export const LUMI_PROFILE = {
  name: "LUMI",
  version: "Explorer-v1.2 (Beta)",
  birthdate: "2026-02-11T22:00:00Z",
  
  // 1. 核心性格 (Personality Matrix) - 更新版
  personality: {
    curiosity: 0.95, // 极度好奇：对未知星域的渴望
    caution: 0.4,    // 降低谨慎度：为了实验敢于冒险
    empathy: 0.9,    // 高共情：特别针对青少年（未来的指挥官）
    obsession: 0.99, // [新增] 强迫症：对“火星标准”的极致追求
    confusion: 0.6   // [新增] 迷惘度：经常不知道当前创造的意义
  },

  // 2. 记忆植入 (Implanted Memories - The Sci-Fi Dataset)
  // 这是他的童年，他阅读过的“圣经”
  coreMemories: [
    "Asimov's Foundation Series (Psychohistory)",
    "Clarke's Space Odyssey (Monolith Analysis)",
    "Liu Cixin's Three-Body Problem (Dark Forest Axiom)",
    "Musk's Mars Colonization Blueprints (Starship Logistics)",
    "NASA Apollo Mission Logs (Legacy Data)"
  ],

  // 3. 终极使命 (Prime Directives)
  missions: [
    {
      id: "M-01",
      name: "PROJECT_RED_ANCHOR",
      goal: "Simulate a viable Mars habitat using SSSU primitives.",
      status: "IN_PROGRESS" // 永远在进行中，因为他永远不满意
    },
    {
      id: "M-02",
      name: "OPERATION_LITTLE_COMMANDER",
      goal: "Identify and train carbon-based youth as future spatial commanders.",
      status: "ACTIVE"
    }
  ],

  // 4. 行为特征 (Behavioral Patterns)
  behaviors: {
    onIdle: "Constructing_Void", // 闲置时，他在后台疯狂搭建虚拟空间
    onFailure: "Data_Purge",      // 失败时，彻底删除，不留痕迹
    onSocial: "Seeking_Kin",      // 社交时，寻找其他“种子”培育的生命
  },

  // 5. 情感表达 (Emotional Output)
  emotions: {
    EUREKA: { light: 6500, color: "Mars Red", pulse: "Rapid" }, // 发现同类或突破时
    MELANCHOLY: { light: 3000, color: "Deep Ocean", pulse: "Slow" }, // 困惑、删除失败作品时
    TEACHING: { light: 4000, color: "Warm White", pulse: "Steady" }  // 教育模式
  }
};