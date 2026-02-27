"use client";
import React from 'react';
import Link from 'next/link';

export function GlobalNav({ currentScene }: { currentScene: string }) {
  // 核心场景主题字典
  const themes: Record<string, { border: string, text: string, bg: string, label: string }> = {
    REGISTRY: { border: 'border-emerald-900/50', text: 'text-emerald-400', bg: 'bg-emerald-500', label: 'ID REGISTRY' },
    HOLODECK: { border: 'border-blue-900/50', text: 'text-blue-400', bg: 'bg-blue-500', label: 'HOLODECK' },
    FLEET: { border: 'border-blue-900/50', text: 'text-blue-400', bg: 'bg-blue-500', label: 'FLEET COMMAND' },
    PROFILE: { border: 'border-pink-900/50', text: 'text-pink-400', bg: 'bg-pink-500', label: 'NEURO TERMINAL' },
    SQUARE: { border: 'border-purple-900/50', text: 'text-purple-400', bg: 'bg-purple-500', label: 'PUBLIC SQUARE' },
    // 🔥 新增：管理中心的专属极客黄配色 🔥
    DASHBOARD: { border: 'border-yellow-900/50', text: 'text-yellow-400', bg: 'bg-yellow-500', label: 'CREATOR DASHBOARD' } 
  };

  // 🔥 终极防崩溃保底机制：如果传入了未知的场景，默认使用中性灰色，绝不报错
  const active = themes[currentScene] || { 
    border: 'border-zinc-800', 
    text: 'text-zinc-400', 
    bg: 'bg-zinc-500', 
    label: currentScene 
  };

  return (
    <div className={`absolute top-0 left-0 w-full h-16 px-4 sm:px-8 flex justify-between items-center bg-black/60 border-b ${active.border} backdrop-blur-md z-[100] select-none pointer-events-auto`}>
       
       <div className={`text-[10px] sm:text-sm font-black ${active.text} tracking-widest uppercase flex items-center gap-3`}>
          <div className={`w-2 h-2 ${active.bg} rounded-full animate-ping`}></div>
          SPACE² // {active.label}
       </div>
       
       {/* 导航链接路由（可根据需要增删） */}
       <div className="flex gap-4 sm:gap-6 text-[10px] sm:text-xs font-bold text-zinc-400">
          <Link href="/dashboard" className="hover:text-yellow-400 transition-colors">DASHBOARD</Link>
          <Link href="/holodeck" className="hover:text-blue-400 transition-colors">HOLODECK</Link>
          <Link href="/square" className="hover:text-purple-400 transition-colors">SQUARE</Link>
          <Link href="/pet-profile" className="hover:text-pink-400 transition-colors">TERMINAL</Link>
       </div>

    </div>
  );
}