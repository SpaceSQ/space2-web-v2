"use client";
import React from 'react';
import { LayoutDashboard, Users, Database, ShieldAlert, Activity, LogOut } from 'lucide-react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const AdminSidebar = ({ activeTab, onTabChange }: Props) => {
  const menu = [
    { id: 'dashboard', label: 'System Overview', icon: LayoutDashboard },
    { id: 'users', label: 'Citizen Registry', icon: Users },
    { id: 'maintenance', label: 'Core Maintenance', icon: Database },
    { id: 'security', label: 'Security & Logs', icon: ShieldAlert },
  ];

  return (
    <div className="w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-6 border-b border-zinc-800">
        <div className="flex items-center gap-2 text-xl font-bold text-white tracking-tighter">
          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-[10px] text-white">OP</div>
          <span>ADMIN_CONSOLE</span>
        </div>
        <div className="text-[10px] text-zinc-500 font-mono mt-1">ACCESS LEVEL: GOD_MODE</div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menu.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all
              ${activeTab === item.id 
                ? 'bg-zinc-800 text-white border-l-4 border-blue-500' 
                : 'text-zinc-500 hover:text-white hover:bg-zinc-900'}
            `}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="bg-zinc-900/50 p-3 rounded mb-4">
          <div className="text-[10px] text-zinc-500 mb-1">SYSTEM HEARTBEAT</div>
          <div className="flex items-center gap-2 text-green-500 font-mono text-xs">
            <Activity size={12} className="animate-pulse" /> ONLINE (14ms)
          </div>
        </div>
        <button className="w-full flex items-center justify-center gap-2 text-xs text-red-500 hover:text-red-400 py-2">
          <LogOut size={14} /> SECURE LOGOUT
        </button>
      </div>
    </div>
  );
};