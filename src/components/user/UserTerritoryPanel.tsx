'use client';

import React, { useState } from 'react';
import { Map, Hammer, LayoutGrid, BrainCircuit, ListTodo, Code } from 'lucide-react';
// 👇 关键修复：全部使用 @ 绝对路径引用，防止路径错误
import TDOGController from '@/components/world/TDOGController';
import SpaceTopologyBuilder from '@/components/world/SpaceTopologyBuilder';
import LumiInterface from '@/components/world/LumiInterface';
import TaskOrchestrator from '@/components/world/TaskOrchestrator';
import GenesisCodeLab from '@/components/contribution/GenesisCodeLab';

interface Props {
  userEmail: string;
}

export default function UserTerritoryPanel({ userEmail }: Props) {
  // 增加 'lab' 模式
  const [activeTab, setActiveTab] = useState<'topology' | 'build' | 'soul' | 'task' | 'lab'>('topology');

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Map className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Space Management</h2>
            <p className="text-xs text-slate-500">Commander: {userEmail}</p>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto custom-scrollbar">
          <button onClick={() => setActiveTab('topology')} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'topology' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <LayoutGrid className="w-4 h-4" /> Topology
          </button>
          <button onClick={() => setActiveTab('build')} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'build' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <Hammer className="w-4 h-4" /> TDOG
          </button>
          <button onClick={() => setActiveTab('soul')} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'soul' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <BrainCircuit className="w-4 h-4" /> LUMI
          </button>
          <button onClick={() => setActiveTab('task')} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'task' ? 'bg-white shadow text-amber-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <ListTodo className="w-4 h-4" /> Tasks
          </button>
          <button onClick={() => setActiveTab('lab')} className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-md transition-all whitespace-nowrap ${activeTab === 'lab' ? 'bg-zinc-800 text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}>
            <Code className="w-4 h-4" /> Code Lab
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'topology' && <div className="h-full animate-in fade-in"><SpaceTopologyBuilder /></div>}
        {activeTab === 'build' && <div className="h-full animate-in fade-in"><TDOGController /></div>}
        {activeTab === 'soul' && <div className="h-full animate-in fade-in"><LumiInterface /></div>}
        {activeTab === 'task' && <div className="h-full animate-in fade-in"><TaskOrchestrator /></div>}
        {activeTab === 'lab' && <div className="h-full animate-in fade-in"><GenesisCodeLab /></div>}
      </div>
    </div>
  );
}