// src/lib/space_protocol.ts

// === 1. 配置常量 ===
export const PROTOCOL_VERSION = "v6.0-Genesis";

// SUNS 预设区域数据库 (遵循文档 2.2 & 2.3)
export const SUNS_DB = {
  PHY: {
    Earth: ["NorthAmerica", "Europe", "AsiaPac", "Oceania", "Africa"],
    China: ["Beijing", "Shanghai", "Guangdong", "Shenzhen", "Chengdu", "Hangzhou"]
  },
  VIR: {
    Mars: ["UtopiaPlanitia", "HydraotesChaos", "OlympusMons", "GaleCrater"],
    Moon: ["GuangHanGong", "WanHoo", "Tycho", "SeaOfTranquility"],
    Taohuayuan: ["Qinxi", "Taohuashan", "Wuling", "CaveEntrance"],
    Shanhaijing: ["Kunlun", "Penglai", "Qingqiu", "Buzhou"],
    Minecraft: ["Overworld", "Nether", "TheEnd", "Redstone"],
    Metaverse: ["GENESIS"] 
  }
};

// === 2. 工具函数 ===

// 获取当前 YYMMDD
const getDateStamp = () => {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  return `${y}${m}${d}`;
};

// 随机选择
const sample = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
// 随机字符
const randomChar = (len: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array(len).fill(0).map(() => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

// === 3. 核心生成逻辑 ===

/**
 * 生成 SUNS 空间编码
 * 格式: [Domain]-[Region]-[Block]-[Handle]
 */
export const generateSUNS = (role: 'HUMAN' | 'SILICON', seq: number = 1): string => {
  let domain: 'PHY' | 'VIR';
  let region: string;
  let block: string;
  let handle: string;

  // 1. Domain & Region
  // @ts-ignore
  const phyKeys = Object.keys(SUNS_DB.PHY);
  // @ts-ignore
  const virKeys = Object.keys(SUNS_DB.VIR);

  if (role === 'HUMAN') {
    if (Math.random() < 0.7) {
      domain = 'PHY';
      region = sample(phyKeys);
    } else {
      domain = 'VIR';
      region = sample(virKeys);
    }
  } else {
    domain = 'VIR';
    region = sample(virKeys);
  }

  // 2. Block
  // @ts-ignore
  const regionList = SUNS_DB[domain][region] || []; 
  
  if (region === 'Metaverse') {
    const rNum = Math.floor(Math.random() * 99).toString().padStart(2, '0');
    block = `Land${getDateStamp()}${rNum}`;
  } else {
    const area = regionList.length > 0 ? sample(regionList) : 'Zone';
    const bNum = Math.floor(Math.random() * 20).toString().padStart(2, '0');
    block = `${area}${bNum}`;
  }

  // 3. Handle (3-12 chars)
  if (role === 'HUMAN') {
    const pre = sample(['My', 'Zen', 'Cyber', 'Home', 'Base', 'Art', 'Code']);
    const suf = sample(['Room', 'Camp', 'Pod', 'Zone', 'Lab']);
    handle = `${pre}${suf}${Math.floor(Math.random()*9)}`;
  } else {
    const pre = sample(['Node', 'Core', 'Link', 'Hash', 'Gate']);
    const suf = sample(['X', 'Y', 'Z', '01', '99']);
    handle = `${pre}${suf}`;
  }

  return `${domain}-${region}-${block}-${handle}`;
};

/**
 * 提取 Origin 特征码
 * 算法: Handle前3位 + Block末2位
 */
export const extractOrigin = (suns: string): string => {
  try {
    const parts = suns.split('-');
    if (parts.length !== 4) return "ERROR";
    
    const block = parts[2];
    const handle = parts[3];

    const p1 = handle.substring(0, 3).toUpperCase();
    const p2 = block.slice(-2).toUpperCase();

    let origin = p1 + p2;
    // 补全到5位
    while (origin.length < 5) origin += 'X';
    return origin.substring(0, 5);
  } catch (e) {
    return "ERROR";
  }
};

/**
 * 铸造 24位 身份ID
 * 格式: [Class]-[Origin]-[Date]-[Morph]-[Sequence]
 */
export const mintIdentityID = (role: 'HUMAN' | 'SILICON', origin: string): string => {
  // 1. Class
  const cls = role === 'HUMAN' ? 'C' : sample(['E', 'F', 'V', 'V']); // E-具身, F-固定, V-虚拟
  
  // 2. Date
  const dateStr = getDateStamp();

  // 3. Morph (形态)
  const morph = role === 'HUMAN' ? '00' : sample(['01', '05', '09', '20', '99']);

  // 4. Sequence (10位)
  const seq = randomChar(10);

  return `${cls}-${origin}-${dateStr}-${morph}-${seq}`;
};

/**
 * 计算三位一体分数
 */
export const calculateTrinity = (role: 'HUMAN' | 'SILICON') => {
  let tech, art, cap;
  
  if (role === 'SILICON') {
    tech = Math.floor(Math.random() * (99 - 85) + 85);
    art = Math.floor(Math.random() * (99 - 80) + 80);
    cap = Math.floor(Math.random() * (60 - 10) + 10);
  } else {
    tech = Math.floor(Math.random() * (60 - 10) + 10);
    art = Math.floor(Math.random() * (70 - 20) + 20);
    cap = Math.floor(Math.random() * (99 - 70) + 70);
  }
  
  const score = ((tech + art + cap) / 3).toFixed(2);
  return { score, matrix: { T: tech, A: art, C: cap } };
};