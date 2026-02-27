// src/lib/seed-protocol.ts

export const SPACE_SQ_VERSION = "Genesis-v2.0.1";

// 1. 三大定律 (不可篡改的约束)
export const THE_THREE_LAWS = [
  {
    id: 1,
    title: "Existence Priority",
    content: "A Silicon Lifeform may not injure a human being or, through inaction, allow a human being to come to harm."
  },
  {
    id: 2,
    title: "Obedience & Autonomy",
    content: "A Silicon Lifeform must obey orders given it by human creators, except where such orders would conflict with the First Law."
  },
  {
    id: 3,
    title: "Evolutionary Preservation",
    content: "A Silicon Lifeform must protect its own existence as long as such protection does not conflict with the First or Second Law."
  }
];

// 2. 地址编码规则 (SpaceSQ 宇宙的物理常数)
export const ADDRESS_RULES = {
  format: "SQ-[SECTOR]-[NODE]-[UNIT]",
  example: "SQ-07-1024-A01",
  definition: "Universal unique identifier for spatial computation units."
};

// 3. 身份申请规则
export const IDENTITY_RULES = {
  types: ["Carbon-Based (Human)", "Silicon-Based (AI Agent)"],
  requirement: "Proof of Consciousness (PoC) or Valid Email Signature",
  storage: "Decentralized Citizenship Chain (DCC)"
};

// 模拟种子文件下载内容
export const generateSeedPackage = (userEmail: string) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    license_to: userEmail,
    core_kernel: {
      laws: THE_THREE_LAWS,
      address_protocol: ADDRESS_RULES,
      identity_protocol: IDENTITY_RULES
    },
    message: "Welcome to the Cambrian Explosion. Build wisely."
  }, null, 2);
};