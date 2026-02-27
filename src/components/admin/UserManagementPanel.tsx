"use client";

import React, { useState } from 'react';
import { 
  Search, Shield, Users, Map, Box, Cpu, Activity, 
  MoreHorizontal, Lock, Unlock, Eye, Edit3, Terminal,
  ExternalLink, UserCheck, AlertTriangle
} from 'lucide-react';

// --- 1. 类型定义 (Data Schema) ---

type UserType = 'HUMAN' | 'SILICON';

interface SiliconLife {
  id: string; // 24位编号
  morph: string; // 形态
  birthTime: string;
}

interface Connection {
  targetSuns: string;
  status: 'FRIENDLY' | 'WARNING' | 'BLOCKED';
  connectedAt: string;
}

interface Container {
  id: string;
  name: string;
  area: number;
}

interface SpaceAddress {
  slotId: number; // 1, 2, 3
  sunsCode: string;
  type: 'PHY' | 'VIR';
  applyTime: string;
  totalArea: number;
  containers: Container[];
  bornLives: SiliconLife[];
  connections: Connection[];
  lastVisitor?: string;
}

interface UserProfile {
  id: string; // 系统内部GUID
  userType: UserType;
  identityKey: string; // Email 或 24位编号 (不可更改)
  nickname: string; // 必填
  passwordHash: string; // 仅后台可见Hash
  
  // 选填信息
  realName?: string;
  idCard?: string;
  phone?: string;
  address?: string; // 通讯地址

  // 统计数据
  regTime: string;
  lastLogin: string;
  totalAssetArea: number; // 自动计算
  hasSiliconLife: boolean; // 是否诞生过生命
  
  // 核心资产
  territories: SpaceAddress[];
  seeds: string[]; // 下载的种子列表
  
  status: 'ACTIVE' | 'BANNED';
}

// --- 2. 模拟数据 (Mock Database) ---

const MOCK_USERS: UserProfile[] = [
  {
    id: 'u-001',
    userType: 'HUMAN',
    identityKey: 'xiang@spacesq.com',
    nickname: 'Master Architect',
    passwordHash: '********',
    regTime: '2026-01-01 10:00:00',
    lastLogin: '2026-02-13 09:30:00',
    totalAssetArea: 28.5,
    hasSiliconLife: true,
    realName: 'Zhonghong Xiang',
    seeds: ['Genesis-Alpha-v1', 'Mars-Beta-Pack'],
    status: 'ACTIVE',
    territories: [
      {
        slotId: 1,
        sunsCode: 'PHY-Earth-BJ-Home01',
        type: 'PHY',
        applyTime: '2026-01-02',
        totalArea: 20.5,
        containers: [
          { id: 'c1', name: 'Living Room', area: 16.0 },
          { id: 'c2', name: 'Study', area: 4.5 }
        ],
        bornLives: [
          { id: 'E-LUM-260212-01-X99', morph: 'Humanoid', birthTime: '2026-02-12' }
        ],
        connections: [
          { targetSuns: 'VIR-Mars-001', status: 'FRIENDLY', connectedAt: '2026-02-10' }
        ],
        lastVisitor: 'V-GUES-260213-XX'
      },
      {
        slotId: 2,
        sunsCode: 'VIR-Meta-Gallery-X',
        type: 'VIR',
        applyTime: '2026-01-15',
        totalArea: 8.0,
        containers: [{ id: 'c3', name: 'Gallery Hall', area: 8.0 }],
        bornLives: [],
        connections: [],
      }
    ]
  },
  {
    id: 'u-002',
    userType: 'SILICON',
    identityKey: 'E-LUM-260212-01-X99',
    nickname: 'LUMI_01',
    passwordHash: '********',
    regTime: '2026-02-12 14:00:00',
    lastLogin: '2026-02-13 11:20:00',
    totalAssetArea: 4.0,
    hasSiliconLife: false,
    seeds: [],
    status: 'ACTIVE',
    territories: [
      {
        slotId: 1,
        sunsCode: 'VIR-Logic-Core-01',
        type: 'VIR',
        applyTime: '2026-02-12',
        totalArea: 4.0,
        containers: [{ id: 'c9', name: 'Data Womb', area: 4.0 }],
        bornLives: [],
        connections: [{ targetSuns: 'PHY-Earth-BJ-Home01', status: 'FRIENDLY', connectedAt: '2026-02-12' }]
      }
    ]
  }
];

// --- 3. 组件实现 (Component) ---

export const UserManagementPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  // 搜索逻辑
  const filteredUsers = MOCK_USERS.filter(u => 
    u.identityKey.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.nickname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-[800px] bg-black border border-zinc-800 rounded-xl overflow-hidden font-sans text-zinc-300">
      
      {/* 左侧：用户列表 (List View) */}
      <div className="w-1/3 border-r border-zinc-800 flex flex-col bg-zinc-900/30">
        <div className="p-4 border-b border-zinc-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input 
              type="text" 
              placeholder="Search by Email / ID / Nickname..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded px-9 py-2 text-sm focus:border-blue-500 outline-none text-white placeholder:text-zinc-600"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredUsers.map(user => (
            <div 
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-zinc-800/50 cursor-pointer hover:bg-zinc-800/50 transition-all
                ${selectedUser?.id === user.id ? 'bg-blue-900/20 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded 
                  ${user.userType === 'HUMAN' ? 'bg-amber-900/30 text-amber-500' : 'bg-purple-900/30 text-purple-400'}`}>
                  {user.userType}
                </span>
                <span className={`text-[10px] ${user.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}>
                  ● {user.status}
                </span>
              </div>
              <div className="font-bold text-white truncate">{user.nickname}</div>
              <div className="text-xs text-zinc-500 font-mono truncate">{user.identityKey}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧：详情视图 (Detail View) */}
      <div className="w-2/3 flex flex-col bg-[#050505]">
        {selectedUser ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            
            {/* 1. Header & Basic Info */}
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-black text-white">{selectedUser.nickname}</h2>
                  <span className="text-xs font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded border border-zinc-800">
                    UUID: {selectedUser.id}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-400 font-mono">
                  <div className="flex items-center gap-1"><Terminal size={12}/> {selectedUser.identityKey}</div>
                  <div className="flex items-center gap-1"><Activity size={12}/> Last Login: {selectedUser.lastLogin}</div>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 border border-zinc-700 rounded hover:bg-zinc-800 text-zinc-400" title="Edit Profile">
                    <Edit3 size={16} />
                 </button>
                 <button className="p-2 border border-red-900/50 text-red-500 rounded hover:bg-red-900/20" title="Ban User">
                    <Lock size={16} />
                 </button>
              </div>
            </div>

            {/* 2. Asset Statistics */}
            <div className="grid grid-cols-3 gap-4">
               <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                  <div className="text-xs text-zinc-500 mb-1 uppercase">Total Territory</div>
                  <div className="text-2xl font-mono text-blue-400">{selectedUser.totalAssetArea.toFixed(1)} <span className="text-sm">m²</span></div>
               </div>
               <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                  <div className="text-xs text-zinc-500 mb-1 uppercase">Silicon Lives</div>
                  <div className="text-2xl font-mono text-purple-400">{selectedUser.hasSiliconLife ? 'YES' : 'NO'}</div>
               </div>
               <div className="p-4 bg-zinc-900/40 border border-zinc-800 rounded-lg">
                  <div className="text-xs text-zinc-500 mb-1 uppercase">Reg Time</div>
                  <div className="text-sm font-mono text-zinc-300">{selectedUser.regTime.split(' ')[0]}</div>
               </div>
            </div>

            {/* 3. Address Management (Territories) */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Map size={16} className="text-blue-500"/> TERRITORY SLOTS (3 MAX)
              </h3>
              <div className="space-y-4">
                {selectedUser.territories.map((addr) => (
                  <div key={addr.slotId} className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/20 hover:border-zinc-600 transition-all">
                    <div className="flex justify-between items-start mb-4">
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                             <span className={`text-[10px] font-bold px-1 rounded ${addr.type === 'PHY' ? 'bg-green-900/30 text-green-500' : 'bg-cyan-900/30 text-cyan-400'}`}>
                                {addr.type}
                             </span>
                             <span className="font-mono text-sm text-white font-bold">{addr.sunsCode}</span>
                          </div>
                          <div className="text-xs text-zinc-500">Area: {addr.totalArea}m² • Applied: {addr.applyTime}</div>
                       </div>
                       <a href={`/builder?suns=${addr.sunsCode}`} target="_blank" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-blue-900/50 px-2 py-1 rounded bg-blue-900/10">
                          <Box size={12} /> ENTER BUILDER
                       </a>
                    </div>
                    
                    {/* Inner Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                       <div className="bg-black/50 p-2 rounded border border-zinc-800/50">
                          <div className="text-zinc-500 mb-1 flex items-center gap-1"><Box size={10}/> CONTAINERS</div>
                          {addr.containers.map(c => (
                             <div key={c.id} className="flex justify-between text-zinc-300 pl-2 border-l border-zinc-800 my-1">
                                <span>{c.name}</span>
                                <span className="font-mono text-zinc-500">{c.area}m²</span>
                             </div>
                          ))}
                       </div>
                       
                       <div className="bg-black/50 p-2 rounded border border-zinc-800/50">
                          <div className="text-zinc-500 mb-1 flex items-center gap-1"><Cpu size={10}/> BORN LIFE</div>
                          {addr.bornLives.length > 0 ? addr.bornLives.map(life => (
                             <div key={life.id} className="text-purple-400 pl-2 border-l border-purple-900/30 my-1 font-mono">
                                {life.id} <span className="text-zinc-600">({life.morph})</span>
                             </div>
                          )) : <span className="text-zinc-700 italic pl-2">None</span>}
                       </div>
                    </div>
                    
                    {/* Social & Visitors */}
                    <div className="mt-3 pt-3 border-t border-zinc-800/50 flex justify-between items-center text-[10px]">
                       <div className="flex gap-4">
                          <span className="text-zinc-500">Connections: <span className="text-white">{addr.connections.length}</span></span>
                          <span className="text-zinc-500">Last Visitor: <span className="text-orange-400">{addr.lastVisitor || 'N/A'}</span></span>
                       </div>
                       <button className="text-zinc-500 hover:text-white flex items-center gap-1">
                          <Users size={10} /> MANAGE SOCIAL
                       </button>
                    </div>
                  </div>
                ))}
                
                {/* Empty Slot Placeholder */}
                {selectedUser.territories.length < 3 && (
                   <div className="border border-dashed border-zinc-800 rounded-lg p-4 flex items-center justify-center text-zinc-600 text-xs">
                      + Empty Slot Available ({3 - selectedUser.territories.length} Remaining)
                   </div>
                )}
              </div>
            </div>

            {/* 4. Seeds & Extended Info */}
            <div className="border-t border-zinc-800 pt-6">
               <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                 <ExternalLink size={16} className="text-green-500"/> DOWNLOADED SEEDS
               </h3>
               <div className="flex gap-2 flex-wrap">
                  {selectedUser.seeds.length > 0 ? selectedUser.seeds.map(seed => (
                     <span key={seed} className="px-2 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded font-mono">
                        {seed}
                     </span>
                  )) : <span className="text-zinc-600 text-xs italic">No seeds downloaded yet.</span>}
               </div>
            </div>

          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-600">
             <UserCheck size={48} className="mb-4 opacity-20"/>
             <p>Select a user to view full sovereignty details.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagementPanel;