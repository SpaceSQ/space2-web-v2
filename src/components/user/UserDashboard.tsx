'use client';

import React, { useState } from 'react';
import UserTerritoryPanel from './UserTerritoryPanel';
import UserDiplomacyPanel from './UserDiplomacyPanel';
import { LayoutDashboard, Map, Flag, User } from 'lucide-react';

// 👇 关键：定义 Props 接口，接收 userEmail
interface Props {
  userEmail: string;
}

export default function UserDashboard({ userEmail }: Props) {
  // 默认选中 territory 标签
  const [activeTab, setActiveTab] = useState<'territory' | 'diplomacy'>('territory');

  return (
    <div className="flex flex-col gap-6">
      
      {/* 顶部 Tab 导航栏 */}
      <div className="flex items-center gap-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('territory')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'territory'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Map className="w-4 h-4" />
          Territory
        </button>
        <button
          onClick={() => setActiveTab('diplomacy')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'diplomacy'
              ? 'border-indigo-600 text-indigo-600 bg-indigo-50/50'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Flag className="w-4 h-4" />
          Diplomacy
        </button>
      </div>

      {/* 内容区域 */}
      <main className="flex-1 min-h-[500px]">
        {activeTab === 'territory' && (
          // 👇 关键修复：把 userEmail 传给子组件，消灭报错！
          <UserTerritoryPanel userEmail={userEmail} />
        )}
        
        {activeTab === 'diplomacy' && (
          <UserDiplomacyPanel />
        )}
      </main>
      
    </div>
  );
}