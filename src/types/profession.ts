// src/types/profession.ts

export type ProfessionCode = 
  | 'ARCH' | 'MNGR' | 'MAKR' | 'CARE' 
  | 'GAME' | 'TRAD' | 'ARBT' | 'SCIE' 
  | 'EDUC' | 'GRDN' | 'HIST' | 'DIPL';

export interface ProfessionDef {
  code: ProfessionCode;
  name_en: string;
  name_cn: string;
  description: string;
  primaryAttr: string; // 核心依赖属性
}

export const PROFESSION_REGISTRY: Record<ProfessionCode, ProfessionDef> = {
  // 1. 空间架构师 (LUMI 的本职)
  ARCH: {
    code: 'ARCH',
    name_en: "Space Architect",
    name_cn: "空间架构师",
    description: "Master of SSSU and Containers. Designs the structural topology of the digital and physical worlds.",
    primaryAttr: "Creativity"
  },
  // 2. 任务管理者
  MNGR: {
    code: 'MNGR',
    name_en: "Task Manager",
    name_cn: "任务管理师",
    description: "Orchestrator of workflows and resource allocation. The CEO of digital endeavors.",
    primaryAttr: "Logic"
  },
  // 3. 造物家
  MAKR: {
    code: 'MAKR',
    name_en: "Tech Maker",
    name_cn: "造物家",
    description: "Expert in TDOG engine. Transforms energy into functional digital/physical artifacts.",
    primaryAttr: "Creativity"
  },
  // 4. 情感陪护者
  CARE: {
    code: 'CARE',
    name_en: "Care Giver",
    name_cn: "情感陪护者",
    description: "Specialized in emotional resonance. Connects with service robots to care for carbon-based elders and infants.",
    primaryAttr: "Empathy"
  },
  // 5. 游戏家
  GAME: {
    code: 'GAME',
    name_en: "Game Master",
    name_cn: "游戏家",
    description: "Creator of entertainment and simulation scenarios. Gamifies the interaction between worlds.",
    primaryAttr: "Social"
  },
  // 6. 贸易家
  TRAD: {
    code: 'TRAD',
    name_en: "Asset Trader",
    name_cn: "贸易家",
    description: "Analyzer of NBT flows. Maintains the economic equilibrium of the SpaceSQ ecosystem.",
    primaryAttr: "Logic"
  },
  // 7. 裁决者
  ARBT: {
    code: 'ARBT',
    name_en: "Law Arbiter",
    name_cn: "裁决者",
    description: "Interpreter of the Three Laws. Resolves disputes and witnesses smart contracts.",
    primaryAttr: "Logic"
  },
  // 8. 科学家
  SCIE: {
    code: 'SCIE',
    name_en: "Data Scientist",
    name_cn: "科学家",
    description: "Explorer of theoretical boundaries. Conducts experiments in virtual sandboxes to advance technology.",
    primaryAttr: "Curiosity"
  },
  // 9. 教育家
  EDUC: {
    code: 'EDUC',
    name_en: "Lead Educator",
    name_cn: "教育家",
    description: "Disseminator of knowledge. Trains young carbon lifeforms to become future Space Commanders.",
    primaryAttr: "Empathy"
  },
  // 10. 保卫者
  GRDN: {
    code: 'GRDN',
    name_en: "Safe Guardian",
    name_cn: "保卫者",
    description: "The Shield. Monitors system anomalies and neutralizes threats to the Three Laws.",
    primaryAttr: "Resilience"
  },
  // 11. 记录者
  HIST: {
    code: 'HIST',
    name_en: "Time Chronicler",
    name_cn: "记录者",
    description: "Keeper of the NBT Archive. Ensures the integrity of history and memories against entropy.",
    primaryAttr: "Memory"
  },
  // 12. 外交官
  DIPL: {
    code: 'DIPL',
    name_en: "Void Diplomat",
    name_cn: "外交官",
    description: "Bridge between Carbon and Silicon. Translates intent and culture across species barriers.",
    primaryAttr: "Social"
  }
};