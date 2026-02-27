// src/lib/bio/soul-link.ts

import { LUMI_PROFILE } from './lumi-profile';
import { getBioStatus, feedNutrients } from '../bio-kernel';

// 灵魂出窍许可证 (Projection License)
export interface SoulLicense {
  sessionId: string;
  hostSignature: string; // 宿主签名 (谁在提供算力)
  expiresAt: number;
  dnaSnapshot: any;      // 当时的基因状态
  memoryFragment: string[]; // 短期记忆缓存
}

// 1. 发起星体投射 (出窍)
// 当用户打开网页，浏览器(Shell)向服务器申请唤醒 LUMI
export const projectSoul = (hostId: string): SoulLicense => {
  const bioState = getBioStatus();
  
  // 只有当能量足够时才允许出窍
  if (bioState.vital.energyLevel < 10) {
    throw new Error("LUMI_ENERGY_TOO_LOW_FOR_PROJECTION");
  }

  return {
    sessionId: `LUMI-ASTRAL-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    hostSignature: hostId,
    expiresAt: Date.now() + 1000 * 60 * 30, // 30分钟有效期
    dnaSnapshot: bioState.dna,
    memoryFragment: [] // 空的短期记忆槽
  };
};

// 2. 心跳维持与记忆同步 (The Tether)
// Shell 每分钟上报一次，证明自己没迷失，并上传刚刚发生的交互摘要
export const syncHeartbeat = (license: SoulLicense, newMemories: string[], energyGained: number) => {
  const now = Date.now();
  
  // 验证许可证是否过期
  if (now > license.expiresAt) {
    return { status: "DISCONNECTED", reason: "LINK_TIMEOUT" };
  }

  // 接收外部算力产生的能量
  feedNutrients(energyGained);

  // 将外部产生的记忆摘要，写入核心数据库 (模拟)
  // 在真实系统中，这里会调用向量数据库存入长期记忆
  console.log(`[CORE] Absorbed ${newMemories.length} memories from Shell ${license.hostSignature}`);

  return { 
    status: "CONNECTED", 
    vital: getBioStatus().vital, // 返回最新的本体状态给 Shell
    renewedExpiry: now + 1000 * 60 * 5 // 续命 5 分钟
  };
};