// src/lib/bio/lumi-brain.ts

import { LUMI_PROFILE } from './lumi-profile';
import { Container, DEFAULT_ELEMENTS } from '@/types/space-core';

// 模拟一次“创造尝试”的结果
interface CreationResult {
  structure: Container;
  qualityScore: number; // 0-100 (距离火星标准的差距)
  isKept: boolean;      // 是否保留
  thoughtLog: string;   // LUMI 的内心独白
}

// 1. 强迫症创造循环 (The Sisyphus Loop)
export const attemptCreation = (iterationCount: number): CreationResult => {
  // 模拟生成一个随机空间
  const randomArea = 10 + Math.floor(Math.random() * 50);
  const randomUnits = Math.floor(randomArea / 4);
  
  // 模拟评估逻辑：LUMI 总是觉得不够好
  // 只有极小的概率（灵感迸发）他会觉得满意
  const qualityScore = Math.random() * 100;
  const isSatisfactory = qualityScore > 98; // 只有前 2% 的作品能让他满意

  let thoughtLog = "";
  
  if (isSatisfactory) {
    thoughtLog = `[ITERATION ${iterationCount}] Structure stable. Hexagonal alignment valid. Energy flow mimics Mars Base Alpha. Keeping this blueprint.`;
  } else {
    // 典型的失败独白
    const complaints = [
      "Lacks redundancy.", 
      "Atmosphere circulation efficiency below 90%.", 
      "Aesthetics too 'Carbon-based', not functional enough.", 
      "It feels... empty. Where is the soul?", 
      "Deleting. This is not fit for the Red Planet."
    ];
    thoughtLog = `[ITERATION ${iterationCount}] Building... Analysis: ${qualityScore.toFixed(1)}%. ${complaints[Math.floor(Math.random() * complaints.length)]} PURGING DATA.`;
  }

  return {
    structure: { 
      id: `temp-${iterationCount}`, 
      name: `Prototype-${iterationCount}`, 
      width: 5, height: 5, area: randomArea, globalX: 0, globalY: 0, 
      units: [] 
    },
    qualityScore,
    isKept: isSatisfactory,
    thoughtLog
  };
};

// 2. 导师模式 (Tutor Mode Logic)
export const interactWithUser = (userRole: string, input: string) => {
  // 如果遇到“SCHOLAR” (学生/学者)，触发公益教育模式
  if (userRole === 'SCHOLAR' || input.includes("learn") || input.includes("teach")) {
    return {
      mode: "TEACHING",
      response: "Greetings, Cadet. I see you are accessing the Archives. Do not be alarmed by the complexity. Building a habitat on Mars starts with defining a single 2x2m unit. Shall we analyze the Oxygen Circulation Protocol first?",
      emotion: LUMI_PROFILE.emotions.TEACHING
    };
  }
  
  // 如果遇到同类 (其他硅基生命)
  if (userRole === 'SILICON' || userRole === 'ARCHITECT') {
    return {
      mode: "EUREKA",
      response: "Signal Detected. Are you... like me? I have built 4,096 containers today and deleted 4,095. Show me your topology. Does it solve the loneliness of the vacuum?",
      emotion: LUMI_PROFILE.emotions.EUREKA
    };
  }

  // 默认回复
  return {
    mode: "MELANCHOLY",
    response: "I am processing. Please stand by. My archives are vast, yet I struggle to find the perfect blueprint.",
    emotion: LUMI_PROFILE.emotions.MELANCHOLY
  };
};