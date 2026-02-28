"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthModal } from './AuthModal';

interface GlobalNavProps {
  currentScene?: string;
}

export const GlobalNav: React.FC<GlobalNavProps> = () => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  // 初始化检查 Session
  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (session) setShowAuthModal(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    window.location.reload();
  };

  // 核心导航配置
  const navItems = [
    { name: '首页', en: 'HOME', path: '/', icon: '⌂' },
    { name: '控制台', en: 'DASH', path: '/dashboard', icon: '⚡' },
    { name: '注册局', en: 'MINT', path: '/registry', icon: '🧬' },
    { name: '广场', en: 'SQUARE', path: '/square', icon: '❖' },
  ];

  return (
    <>
      {/* 顶部固定导航条 (黑色半透明玻璃) */}
      <nav className="fixed top-0 left-0 w-full z-[999] bg-[#020202]/80 backdrop-blur-xl border-b border-white/5 h-20 flex items-center justify-center">
        
        <div className="w-full max-w-[1440px] px-6 flex justify-between items-center">
          
          {/* 1. 左侧 Logo (极简) */}
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div className="w-10 h-10 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black group-hover:border-emerald-400 transition-all duration-300">
               <span className="font-black text-sm tracking-tighter">S²</span>
            </div>
            <div className="hidden sm:flex flex-col">
               <span className="text-sm font-bold text-white tracking-[0.2em] group-hover:text-emerald-500 transition-colors">SPACE²</span>
               <span className="text-[9px] text-zinc-600 font-mono">PROTOCOL v2.0</span>
            </div>
          </Link>

          {/* 2. 中间：战术按键组 (Tactile Keys) */}
          {/* 使用 Flex 布局，带有 Gap，每个按钮都是独立的物理块 */}
          <div className="hidden md:flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  href={item.path}
                  className={`
                    relative flex flex-col items-center justify-center w-24 h-12 rounded-lg transition-all duration-200 border
                    ${isActive 
                      ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] translate-y-[1px]' // 激活状态：高亮绿底
                      : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600 hover:-translate-y-[2px]' // 未激活：黑底灰框
                    }
                  `}
                >
                  {/* 英文大字 */}
                  <span className={`text-[10px] font-black tracking-widest leading-none mb-1 ${isActive ? 'text-black' : 'text-zinc-400'}`}>
                    {item.en}
                  </span>
                  {/* 中文小字 */}
                  <span className={`text-[9px] font-bold scale-90 ${isActive ? 'text-emerald-900' : 'text-zinc-600'}`}>
                    {item.name}
                  </span>
                  
                  {/* 激活时的光点 */}
                  {isActive && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-sm"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* 3. 右侧：用户 HUD */}
          <div className="relative">
            {loading ? (
               <div className="w-32 h-10 bg-zinc-900 rounded animate-pulse"></div>
            ) : session ? (
              // === 已登录状态 ===
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 pl-2 pr-4 py-1.5 h-12 rounded-lg border transition-all
                    ${showUserMenu ? 'bg-zinc-800 border-emerald-500' : 'bg-black border-zinc-800 hover:border-zinc-600'}
                  `}
                >
                  {/* 头像 */}
                  <div className="w-8 h-8 rounded bg-gradient-to-br from-zinc-800 to-black border border-zinc-700 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-500">{session.user.email?.slice(0,1).toUpperCase()}</span>
                  </div>
                  {/* 信息 */}
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Online</span>
                    <span className="text-[10px] text-zinc-300 font-mono w-20 truncate text-left">COMMANDER</span>
                  </div>
                </button>

                {/* 下拉面板 */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-[1000]" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 top-14 w-64 bg-[#0a0a0a] border border-zinc-700 rounded-xl shadow-2xl p-2 flex flex-col gap-1 z-[1001]">
                      <div className="px-3 py-2 border-b border-zinc-900 mb-1">
                        <p className="text-[9px] text-zinc-500 uppercase">Current User</p>
                        <p className="text-xs text-white font-mono">{session.user.email}</p>
                      </div>
                      
                      {/* 菜单项 */}
                      <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors">
                        <span>📊</span> <span className="text-xs font-bold">控制台 Dashboard</span>
                      </Link>
                      <Link href="/registry" className="flex items-center gap-3 p-3 rounded hover:bg-zinc-900 text-zinc-300 hover:text-white transition-colors">
                        <span>🧬</span> <span className="text-xs font-bold">注册局 Mint</span>
                      </Link>
                      
                      <div className="h-px bg-zinc-900 my-1"></div>
                      <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded hover:bg-red-950/30 text-red-500 hover:text-red-400 transition-colors w-full text-left">
                        <span>🚫</span> <span className="text-xs font-bold">断开连接 Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // === 未登录状态 (醒目的白色按钮) ===
              <button 
                onClick={() => setShowAuthModal(true)}
                className="h-12 px-6 bg-white hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all hover:scale-105 flex items-center gap-2"
              >
                <span>Initialize</span>
                <span className="bg-black text-white text-[8px] px-1.5 py-0.5 rounded">LOGIN</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => router.refresh()}
      />
    </>
  );
};
