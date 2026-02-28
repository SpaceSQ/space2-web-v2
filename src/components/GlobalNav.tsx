"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthModal } from './AuthModal';

interface GlobalNavProps {
  currentScene: 'HOME' | 'REGISTRY' | 'SQUARE' | 'PROFILE' | 'DASHBOARD' | 'FLEET';
}

export const GlobalNav: React.FC<GlobalNavProps> = ({ currentScene }) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (session) setShowAuthModal(false);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    setSession(null);
    router.push('/'); 
    window.location.reload();
  };

  const navItems = [
    { name: '首页', en: 'HOME', path: '/', id: 'HOME' },
    { name: '控制台', en: 'DASH', path: '/dashboard', id: 'DASHBOARD' },
    { name: '注册局', en: 'MINT', path: '/registry', id: 'REGISTRY' },
    { name: '广场', en: 'SQUARE', path: '/square', id: 'SQUARE' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${isScrolled ? 'bg-[#050505]/90 border-zinc-800 py-2 backdrop-blur-xl' : 'bg-gradient-to-b from-black/90 to-transparent border-transparent py-4'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex justify-between items-center h-14">
          
          {/* Logo 区 */}
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div className="relative w-9 h-9 flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-lg group-hover:border-emerald-500/50 transition-colors shadow-lg">
               <span className="text-white font-black text-xs">S²</span>
               <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse border border-black"></div>
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-black text-white tracking-[0.2em] leading-none group-hover:text-emerald-400 transition-colors">SPACE²</span>
               <span className="text-[8px] text-zinc-500 font-mono tracking-widest hidden sm:block mt-0.5">OPERATING SYSTEM</span>
            </div>
          </Link>

          {/* 中间导航 - 胶囊按钮组 */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.path}
                className={`group relative px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border no-underline flex flex-col items-center justify-center min-w-[80px]
                  ${pathname === item.path 
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-[0_2px_10px_rgba(0,0,0,0.5)]' 
                    : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300 hover:border-zinc-800'
                  }`}
              >
                <span className="leading-none mb-0.5">{item.name}</span>
                <span className={`text-[7px] font-mono leading-none ${pathname === item.path ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-zinc-500'}`}>{item.en}</span>
                
                {/* 选中时的底部光条 */}
                {pathname === item.path && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>}
              </Link>
            ))}
          </div>

          {/* 右侧：用户 HUD 面板 */}
          <div className="relative">
            {loading ? (
               <div className="w-32 h-10 bg-zinc-900/50 rounded-lg border border-zinc-800 animate-pulse"></div>
            ) : session ? (
              // === 已登录 (身份卡) ===
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 pl-2 pr-4 py-1.5 h-10 rounded-lg transition-all border bg-[#0a0a0a] shadow-lg group
                    ${showUserMenu 
                      ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'border-zinc-800 hover:border-zinc-600'}`}
                >
                  {/* 头像区 */}
                  <div className="relative w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 border border-zinc-700">
                    {session.user.email?.slice(0, 1).toUpperCase()}
                    {/* 在线状态点 */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-black shadow-[0_0_5px_#10b981]"></div>
                  </div>
                  
                  {/* 文字区 */}
                  <div className="flex flex-col items-start mr-2">
                     <span className="text-[9px] text-emerald-500 font-bold uppercase leading-none mb-0.5 tracking-wider">Connected</span>
                     <span className="text-[10px] text-zinc-300 font-mono leading-none w-20 truncate text-left group-hover:text-white transition-colors">COMMANDER</span>
                  </div>

                  {/* 箭头 */}
                  <div className={`w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-zinc-500 transition-transform ${showUserMenu ? 'rotate-180 border-t-emerald-500' : ''}`}></div>
                </button>

                {/* === 指令面板 (HUD Menu) === */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-[101]" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 top-12 w-64 bg-[#080808] border border-zinc-700 rounded-xl shadow-[0_20px_80px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in slide-in-from-top-2 z-[102] flex flex-col p-1.5 gap-1.5">
                      
                      {/* 1. 顶部 Session 信息 */}
                      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 mb-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Signal Source</span>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                        <p className="text-[10px] text-zinc-300 font-mono break-all">{session.user.email}</p>
                      </div>
                      
                      {/* 2. 核心操作按钮 (Block Buttons) */}
                      <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="no-underline group flex items-center justify-between p-3 bg-zinc-900/20 hover:bg-zinc-800 border border-zinc-800/50 hover:border-zinc-600 rounded-lg transition-all">
                           <div className="flex items-center gap-3">
                              <span className="text-lg grayscale group-hover:grayscale-0 transition-all">📊</span>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Dashboard</span>
                                <span className="text-[8px] text-zinc-600 group-hover:text-zinc-400">控制台</span>
                              </div>
                           </div>
                           <span className="text-[10px] text-zinc-700 group-hover:text-white">→</span>
                      </Link>
                      
                      <Link href="/registry" onClick={() => setShowUserMenu(false)} className="no-underline group flex items-center justify-between p-3 bg-zinc-900/20 hover:bg-zinc-800 border border-zinc-800/50 hover:border-zinc-600 rounded-lg transition-all">
                           <div className="flex items-center gap-3">
                              <span className="text-lg grayscale group-hover:grayscale-0 transition-all">🧬</span>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Mint New Life</span>
                                <span className="text-[8px] text-zinc-600 group-hover:text-zinc-400">注册局</span>
                              </div>
                           </div>
                           <span className="text-[10px] text-zinc-700 group-hover:text-white">→</span>
                      </Link>

                      {/* 3. 底部危险区 */}
                      <div className="h-px bg-zinc-900 my-1"></div>
                      
                      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 bg-red-950/10 hover:bg-red-900/30 border border-red-900/20 hover:border-red-800 rounded-lg text-red-500/80 hover:text-red-400 transition-all group">
                         <span className="text-[10px] font-bold uppercase tracking-widest">🛑 Terminate Session</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // === 未登录 (高亮胶囊按钮) ===
              <button 
                onClick={() => setShowAuthModal(true)}
                className="group relative h-10 px-6 bg-white hover:bg-emerald-400 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_#10b981] transition-all duration-300 overflow-hidden flex items-center justify-center border border-transparent"
              >
                <div className="flex flex-col items-center leading-none">
                  <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Initialize</span>
                  <span className="text-[8px] font-bold text-zinc-500 group-hover:text-black/70 mt-0.5">LOGIN / JOIN</span>
                </div>
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
};"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthModal } from './AuthModal';

interface GlobalNavProps {
  currentScene: 'HOME' | 'REGISTRY' | 'SQUARE' | 'PROFILE' | 'DASHBOARD' | 'FLEET';
}

export const GlobalNav: React.FC<GlobalNavProps> = ({ currentScene }) => {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (session) setShowAuthModal(false);
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowUserMenu(false);
    setSession(null);
    router.push('/'); 
    window.location.reload();
  };

  const navItems = [
    { name: '首页', en: 'HOME', path: '/', id: 'HOME' },
    { name: '控制台', en: 'DASH', path: '/dashboard', id: 'DASHBOARD' },
    { name: '注册局', en: 'MINT', path: '/registry', id: 'REGISTRY' },
    { name: '广场', en: 'SQUARE', path: '/square', id: 'SQUARE' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${isScrolled ? 'bg-[#050505]/90 border-zinc-800 py-2 backdrop-blur-xl' : 'bg-gradient-to-b from-black/90 to-transparent border-transparent py-4'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 flex justify-between items-center h-14">
          
          {/* Logo 区 */}
          <Link href="/" className="flex items-center gap-3 group no-underline">
            <div className="relative w-9 h-9 flex items-center justify-center bg-zinc-900 border border-zinc-700 rounded-lg group-hover:border-emerald-500/50 transition-colors shadow-lg">
               <span className="text-white font-black text-xs">S²</span>
               <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse border border-black"></div>
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-black text-white tracking-[0.2em] leading-none group-hover:text-emerald-400 transition-colors">SPACE²</span>
               <span className="text-[8px] text-zinc-500 font-mono tracking-widest hidden sm:block mt-0.5">OPERATING SYSTEM</span>
            </div>
          </Link>

          {/* 中间导航 - 胶囊按钮组 */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.path}
                className={`group relative px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all border no-underline flex flex-col items-center justify-center min-w-[80px]
                  ${pathname === item.path 
                    ? 'bg-zinc-800 border-zinc-600 text-white shadow-[0_2px_10px_rgba(0,0,0,0.5)]' 
                    : 'bg-transparent border-transparent text-zinc-500 hover:bg-zinc-900/50 hover:text-zinc-300 hover:border-zinc-800'
                  }`}
              >
                <span className="leading-none mb-0.5">{item.name}</span>
                <span className={`text-[7px] font-mono leading-none ${pathname === item.path ? 'text-emerald-500' : 'text-zinc-600 group-hover:text-zinc-500'}`}>{item.en}</span>
                
                {/* 选中时的底部光条 */}
                {pathname === item.path && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>}
              </Link>
            ))}
          </div>

          {/* 右侧：用户 HUD 面板 */}
          <div className="relative">
            {loading ? (
               <div className="w-32 h-10 bg-zinc-900/50 rounded-lg border border-zinc-800 animate-pulse"></div>
            ) : session ? (
              // === 已登录 (身份卡) ===
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 pl-2 pr-4 py-1.5 h-10 rounded-lg transition-all border bg-[#0a0a0a] shadow-lg group
                    ${showUserMenu 
                      ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
                      : 'border-zinc-800 hover:border-zinc-600'}`}
                >
                  {/* 头像区 */}
                  <div className="relative w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-300 border border-zinc-700">
                    {session.user.email?.slice(0, 1).toUpperCase()}
                    {/* 在线状态点 */}
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full border border-black shadow-[0_0_5px_#10b981]"></div>
                  </div>
                  
                  {/* 文字区 */}
                  <div className="flex flex-col items-start mr-2">
                     <span className="text-[9px] text-emerald-500 font-bold uppercase leading-none mb-0.5 tracking-wider">Connected</span>
                     <span className="text-[10px] text-zinc-300 font-mono leading-none w-20 truncate text-left group-hover:text-white transition-colors">COMMANDER</span>
                  </div>

                  {/* 箭头 */}
                  <div className={`w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[4px] border-t-zinc-500 transition-transform ${showUserMenu ? 'rotate-180 border-t-emerald-500' : ''}`}></div>
                </button>

                {/* === 指令面板 (HUD Menu) === */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-[101]" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 top-12 w-64 bg-[#080808] border border-zinc-700 rounded-xl shadow-[0_20px_80px_rgba(0,0,0,1)] overflow-hidden animate-in fade-in slide-in-from-top-2 z-[102] flex flex-col p-1.5 gap-1.5">
                      
                      {/* 1. 顶部 Session 信息 */}
                      <div className="bg-zinc-900/40 border border-zinc-800 rounded-lg p-3 mb-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] text-zinc-500 uppercase tracking-widest">Signal Source</span>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        </div>
                        <p className="text-[10px] text-zinc-300 font-mono break-all">{session.user.email}</p>
                      </div>
                      
                      {/* 2. 核心操作按钮 (Block Buttons) */}
                      <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="no-underline group flex items-center justify-between p-3 bg-zinc-900/20 hover:bg-zinc-800 border border-zinc-800/50 hover:border-zinc-600 rounded-lg transition-all">
                           <div className="flex items-center gap-3">
                              <span className="text-lg grayscale group-hover:grayscale-0 transition-all">📊</span>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Dashboard</span>
                                <span className="text-[8px] text-zinc-600 group-hover:text-zinc-400">控制台</span>
                              </div>
                           </div>
                           <span className="text-[10px] text-zinc-700 group-hover:text-white">→</span>
                      </Link>
                      
                      <Link href="/registry" onClick={() => setShowUserMenu(false)} className="no-underline group flex items-center justify-between p-3 bg-zinc-900/20 hover:bg-zinc-800 border border-zinc-800/50 hover:border-zinc-600 rounded-lg transition-all">
                           <div className="flex items-center gap-3">
                              <span className="text-lg grayscale group-hover:grayscale-0 transition-all">🧬</span>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-300 group-hover:text-white uppercase tracking-wider">Mint New Life</span>
                                <span className="text-[8px] text-zinc-600 group-hover:text-zinc-400">注册局</span>
                              </div>
                           </div>
                           <span className="text-[10px] text-zinc-700 group-hover:text-white">→</span>
                      </Link>

                      {/* 3. 底部危险区 */}
                      <div className="h-px bg-zinc-900 my-1"></div>
                      
                      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 bg-red-950/10 hover:bg-red-900/30 border border-red-900/20 hover:border-red-800 rounded-lg text-red-500/80 hover:text-red-400 transition-all group">
                         <span className="text-[10px] font-bold uppercase tracking-widest">🛑 Terminate Session</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // === 未登录 (高亮胶囊按钮) ===
              <button 
                onClick={() => setShowAuthModal(true)}
                className="group relative h-10 px-6 bg-white hover:bg-emerald-400 rounded-lg shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_#10b981] transition-all duration-300 overflow-hidden flex items-center justify-center border border-transparent"
              >
                <div className="flex flex-col items-center leading-none">
                  <span className="text-[10px] font-black text-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Initialize</span>
                  <span className="text-[8px] font-bold text-zinc-500 group-hover:text-black/70 mt-0.5">LOGIN / JOIN</span>
                </div>
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
