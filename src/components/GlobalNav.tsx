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
    { name: '首页 / HOME', path: '/', id: 'HOME' },
    { name: '控制台 / DASH', path: '/dashboard', id: 'DASHBOARD' },
    { name: '注册局 / MINT', path: '/registry', id: 'REGISTRY' },
    { name: '广场 / SQUARE', path: '/square', id: 'SQUARE' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${isScrolled ? 'bg-black/90 border-zinc-800 py-3 backdrop-blur-md' : 'bg-gradient-to-b from-black/80 to-transparent border-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          {/* Logo 区 */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
               <div className="w-8 h-8 bg-white text-black rounded flex items-center justify-center font-black text-xs relative z-10 group-hover:bg-emerald-400 transition-colors">S²</div>
               <div className="absolute top-0 left-0 w-8 h-8 bg-white/30 blur-md animate-pulse"></div>
            </div>
            <div className="flex flex-col">
               <span className="text-sm font-black text-white tracking-[0.2em] leading-none group-hover:text-emerald-400 transition-colors">SPACE²</span>
               <span className="text-[8px] text-zinc-500 font-mono tracking-widest hidden sm:block">PROTOCOL v2.0</span>
            </div>
          </Link>

          {/* 中间导航 - 增加间距和视觉反馈 */}
          <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-full p-1.5 backdrop-blur-md gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.path}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2
                  ${pathname === item.path 
                    ? 'bg-zinc-800 text-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] border border-zinc-600' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
              >
                {/* 加上小圆点指示器 */}
                <div className={`w-1.5 h-1.5 rounded-full ${pathname === item.path ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600'}`}></div>
                {item.name.split(' / ')[0]} 
              </Link>
            ))}
          </div>

          {/* 右侧：用户中心 - 彻底重构 */}
          <div className="relative">
            {loading ? (
               <div className="w-24 h-9 bg-zinc-800/50 rounded animate-pulse"></div>
            ) : session ? (
              // === 已登录状态 (高对比度) ===
              <div className="relative group">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 pl-1 pr-5 py-1.5 rounded-full transition-all border border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)] ${showUserMenu ? 'border-emerald-500 bg-zinc-800' : ''}`}
                >
                  {/* 头像 */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-900 flex items-center justify-center text-[10px] text-white font-black border border-emerald-400/30 shadow-inner">
                    {session.user.email?.slice(0, 1).toUpperCase()}
                  </div>
                  
                  {/* 用户名与状态 */}
                  <div className="flex flex-col items-start">
                     <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase leading-none mb-0.5">Commander</span>
                     <span className="text-[10px] text-white font-mono leading-none truncate max-w-[80px] sm:max-w-[120px]">{session.user.email?.split('@')[0]}</span>
                  </div>

                  {/* 下拉箭头 */}
                  <span className={`text-[8px] text-zinc-500 transition-transform duration-300 ml-1 ${showUserMenu ? 'rotate-180 text-emerald-400' : ''}`}>▼</span>
                </button>

                {/* === 下拉菜单 (高对比度面板) === */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-[101]" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 top-14 w-60 bg-[#0a0a0a] border border-zinc-700 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 z-[102] ring-1 ring-white/10">
                      
                      {/* 头部信息 */}
                      <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-900/50">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Signed in as</p>
                        <p className="text-xs text-white font-bold font-mono truncate">{session.user.email}</p>
                      </div>
                      
                      {/* 菜单项 - 增加间距 */}
                      <div className="p-2 flex flex-col gap-1">
                        <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700">
                           <span className="text-lg bg-blue-900/20 text-blue-400 w-8 h-8 flex items-center justify-center rounded group-hover:bg-blue-600 group-hover:text-white transition-colors">📊</span> 
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-200 group-hover:text-white">控制台</span>
                              <span className="text-[9px] text-zinc-500">Dashboard</span>
                           </div>
                        </Link>
                        
                        <Link href="/registry" onClick={() => setShowUserMenu(false)} className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700">
                           <span className="text-lg bg-emerald-900/20 text-emerald-400 w-8 h-8 flex items-center justify-center rounded group-hover:bg-emerald-600 group-hover:text-white transition-colors">🧬</span> 
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-200 group-hover:text-white">铸造新生命</span>
                              <span className="text-[9px] text-zinc-500">Registry / Mint</span>
                           </div>
                        </Link>
                      </div>

                      <div className="h-px bg-zinc-800 mx-2"></div>
                      
                      {/* 登出按钮 (红色高亮) */}
                      <div className="p-2">
                        <button onClick={handleLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-red-950/30 border border-transparent hover:border-red-900/50 group transition-colors">
                          <span className="text-lg bg-red-900/10 text-red-500 w-8 h-8 flex items-center justify-center rounded group-hover:bg-red-600 group-hover:text-white transition-colors">🚪</span> 
                           <div className="flex flex-col items-start">
                              <span className="text-xs font-bold text-zinc-400 group-hover:text-red-200">安全登出</span>
                              <span className="text-[9px] text-zinc-600 group-hover:text-red-400/70">Disconnect</span>
                           </div>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // === 未登录状态 (高亮白色按钮) ===
              <button 
                onClick={() => setShowAuthModal(true)}
                className="group relative px-6 py-2.5 bg-white rounded text-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-transform overflow-hidden shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                <div className="absolute inset-0 bg-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                <span className="relative z-10 group-hover:text-black transition-colors flex items-center gap-2">
                  <span>Initialize</span> 
                  <span className="bg-black text-white px-1.5 py-0.5 rounded text-[8px] group-hover:bg-white group-hover:text-black">LOGIN</span>
                </span>
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
