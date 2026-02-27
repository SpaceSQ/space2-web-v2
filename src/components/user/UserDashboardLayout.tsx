'use client'; // 👈 必须加这个，因为用了 useState

import React, { useState } from 'react';
import { LayoutDashboard, Map, Flag, Settings, User, Box } from 'lucide-react';

// ==========================================
// 1. 内部占位组件 (用来顶替那些还没创建的文件)
// ==========================================
const PlaceholderModule = ({ title, icon: Icon }: { title: string, icon: any }) => (
  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
    <div className="p-4 bg-white rounded-full shadow-sm mb-4">
      <Icon className="w-8 h-8 text-slate-300" />
    </div>
    <h3 className="text-lg font-medium text-slate-500">{title} Module</h3>
    <p className="text-sm text-slate-400 mt-1">Coming in next update</p>
  </div>
);

// 模拟的一个简单 Profile 面板 (内联)
const UserProfilePanel = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-2xl">
        U
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900">Commander</h2>
        <p className="text-slate-500">Level 1 • Genesis Citizen</p>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 bg-slate-50 rounded-lg">
        <div className="text-xs text-slate-500 uppercase">Reputation</div>
        <div className="text-xl font-mono font-bold text-slate-900">100</div>
      </div>
      <div className="p-4 bg-slate-50 rounded-lg">
        <div className="text-xs text-slate-500 uppercase">Credits</div>
        <div className="text-xl font-mono font-bold text-slate-900">500</div>
      </div>
    </div>
  </div>
);

// ==========================================
// 2. 主组件: UserDashboard
// ==========================================
export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button
            onClick={() => setActiveTab('territory')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'territory' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Map className="w-4 h-4" /> Territory
          </button>
          <button
            onClick={() => setActiveTab('diplomacy')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'diplomacy' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Flag className="w-4 h-4" /> Diplomacy
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-[500px]">
        {activeTab === 'overview' && <UserProfilePanel />}
        {activeTab === 'territory' && <PlaceholderModule title="Territory" icon={Map} />}
        {activeTab === 'diplomacy' && <PlaceholderModule title="Diplomacy" icon={Flag} />}
      </main>
    </div>
  );
}