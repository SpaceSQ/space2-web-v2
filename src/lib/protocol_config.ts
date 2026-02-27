// src/lib/protocol_config.ts

export const REGISTRY_CONFIG = {
  VERSION: "1.0.2-GENESIS",
  ALLOWED_DOMAINS: ["gmail.com", "163.com", "qq.com", "outlook.com"],
  // 模拟母库：实际开发中这些数据会从服务器 JSONL 读取
  MASTER_SAMPLES: [
    { address_id: "SH-BASE-001", email: "david@gmail.com", area: 125 },
    { address_id: "BJ-CORE-002", email: "user@163.com", area: 88 }
  ]
};

export type IdentityRole = 'HUMAN_REPRESENTATIVE' | 'SILICON_ENTITY';

export interface RegistryData {
  addressId: string;
  email: string;
  area: number;
  targetName: string;
  role: IdentityRole;
}