// src/types/admin.ts

export type SystemStatus = 'STABLE' | 'WARNING' | 'CRITICAL' | 'MAINTENANCE';

export interface AdminLog {
  id: string;
  timestamp: string;
  action: string;
  admin: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface BackupRecord {
  id: string;
  filename: string;
  size: string;
  date: string;
  type: 'FULL' | 'INCREMENTAL';
}

export interface RegisteredUser {
  id: string;
  email: string;
  role: string;
  addressID: string; // 分配的空间地址 SQ-XX-XXXX
  seedDownloaded: boolean;
  joinedAt: string;
  status: 'ACTIVE' | 'BANNED';
}

// 模拟的后台数据
export const MOCK_LOGS: AdminLog[] = [
  { id: 'L-001', timestamp: '2026-02-11 14:20:01', action: 'System Backup Auto-run', admin: 'SYSTEM', status: 'SUCCESS' },
  { id: 'L-002', timestamp: '2026-02-11 13:45:12', action: 'User Ban: bot_x99', admin: 'Xiang', status: 'SUCCESS' },
  { id: 'L-003', timestamp: '2026-02-11 12:30:00', action: 'Seed Protocol v2.1 Push', admin: 'Gemini', status: 'SUCCESS' },
];

export const MOCK_USERS: RegisteredUser[] = [
  { id: 'u1', email: 'neo@gmail.com', role: 'ARCHITECT', addressID: 'SQ-01-1024', seedDownloaded: true, joinedAt: '2025-11-20', status: 'ACTIVE' },
  { id: 'u2', email: 'trinity@163.com', role: 'PIONEER', addressID: 'SQ-01-0001', seedDownloaded: true, joinedAt: '2025-11-21', status: 'ACTIVE' },
  { id: 'u3', email: 'agent_smith@ai.net', role: 'SILICON', addressID: 'SQ-99-ERROR', seedDownloaded: false, joinedAt: '2026-02-10', status: 'BANNED' },
];