'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Globe, Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo - 点击回首页 */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-105 transition-transform">
            <Globe className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-white tracking-wide leading-none group-hover:text-slate-300 transition-colors">
              SpaceSQ
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest leading-none mt-1">
              Genesis World
            </span>
          </div>
        </Link>

        {/* 桌面端导航 - 纯白字体，高对比度 */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/about" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Manifesto (宣言)
          </Link>
          
          <Link href="/docs" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Rules & Whitepaper
          </Link>

          {/* 分隔符 */}
          <div className="h-5 w-[1px] bg-white/20 mx-2"></div>

          <Link href="/login" className="text-sm font-bold text-white hover:text-indigo-300 transition-colors">
            Login
          </Link>
          
          <Link 
            href="/register" 
            className="group flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-bold rounded-full hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
          >
            Get Citizenship
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 移动端菜单展开 */}
      {isOpen && (
        <div className="md:hidden bg-zinc-950 border-b border-white/10 p-6 space-y-4">
          <Link href="/about" className="block text-lg font-medium text-slate-300 py-2">Manifesto</Link>
          <Link href="/docs" className="block text-lg font-medium text-slate-300 py-2">Rules & Docs</Link>
          <Link href="/login" className="block text-lg font-medium text-white py-2">Login</Link>
          <Link href="/register" className="block w-full text-center py-3 bg-white text-black font-bold rounded-lg">Get Citizenship</Link>
        </div>
      )}
    </nav>
  );
}