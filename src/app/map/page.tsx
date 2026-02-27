'use client';

import React from 'react';
import Link from 'next/link';
import UniverseMap from '@/components/world/UniverseMap';
import { ArrowLeft, Radar, Database } from 'lucide-react';

export default function MapPage() {
  return (
    // [FIX] 使用 h-[100dvh] 强制适应视口高度，overflow-hidden 禁止任何滚动
    <div className="fixed inset-0 w-screen h-[100dvh] bg-black text-white font-sans flex flex-col overflow-hidden">
      
      {/* Top Bar (固定高度 60px) */}
      <div className="flex-none h-[60px] px-4 md:px-6 flex justify-between items-center border-b border-white/10 bg-zinc-950/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 rounded-full bg-zinc-900 border border-zinc-800 hover:bg-white hover:text-black transition-all">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-sm md:text-lg font-bold flex items-center gap-2">
            <Radar className="w-4 h-4 text-emerald-500 animate-spin-slow" />
            <span className="hidden md:inline tracking-widest">GALACTIC NAVIGATION DECK</span>
            <span className="md:hidden">NAV DECK</span>
          </h1>
        </div>
        
        {/* 数据源状态指示器 */}
        <div className="flex items-center gap-3 text-[10px] md:text-xs font-mono">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-blue-900/20 border border-blue-500/30 text-blue-400">
            <Database className="w-3 h-3" />
            <span>LIVE DATA: 345 NODES</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-500">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            ONLINE
          </div>
        </div>
      </div>

      {/* Map Container (自动填满剩余空间) */}
      <main className="flex-1 w-full h-full relative bg-black overflow-hidden">
        <UniverseMap />
      </main>

    </div>
  );
}