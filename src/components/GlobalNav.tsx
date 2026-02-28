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
    { name: '首页', path: '/', id: 'HOME' },
    { name: '控制台', path: '/dashboard', id: 'DASHBOARD' },
    { name: '注册局', path: '/registry', id: 'REGISTRY' },
    { name: '广场', path: '/square', id: 'SQUARE' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${isScrolled ? 'bg-black/90 border-zinc-800 py-3 backdrop-blur-md' : 'bg-gradient-to-b from-black/80 to-transparent border-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
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

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center bg-black/40 border border-white/10 rounded-full p-1 backdrop-blur-md gap-1">
            {navItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.path}
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all flex items-center gap-2
                  ${pathname === item.path 
                    ? 'bg-zinc-800 text-white shadow-lg border border-zinc-600' 
                    : 'text-zinc-400 hover:text-white hover:bg-white/10 border border-transparent'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: User HUD */}
          <div className="relative">
            {loading ? (
               <div className="w-24 h-9 bg-zinc-800/50 rounded animate-pulse"></div>
            ) : session ? (
              // === 已登录 (Command Center) ===
              <div className="relative group">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full transition-all border border-zinc-800 bg-zinc-950 hover:border-emerald-500/50 ${showUserMenu ? 'border-emerald-500 ring-1 ring-emerald-500/50' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-950 flex items-center justify-center border border-emerald-500/30">
                    <span className="text-xs font-black text-emerald-400">{session.user.email?.slice(0, 1).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col items-start mr-2">
                     <span className="text-[9px] text-zinc-400 font-bold uppercase leading-none mb-0.5">Commander</span>
                     <span className="text-[10px] text-white font-mono leading-none w-20 truncate text-left">{session.user.email?.split('@')[0]}</span>
                  </div>
                  <span className={`text-[8px] text-zinc-600 transition-transform duration-300 ${showUserMenu ? 'rotate-180 text-emerald-500' : ''}`}>▼</span>
                </button>

                {/* === 下拉菜单面板 (HUD Panel) === */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-[101]" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 top-14 w-72 bg-[#050505] border border-zinc-800 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden animate-in fade-in slide-in-from-top-4 z-[102] flex flex-col">
                      
                      {/* 1. 头部身份卡 */}
                      <div className="p-4 border-b border-zinc-900 bg-zinc-900/20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 opacity-20"><div className="w-16 h-16 bg-emerald-500 blur-2xl rounded-full"></div></div>
                        <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest mb-1">Active Session</p>
                        <p className="text-xs text-white font-mono break-all">{session.user.email}</p>
                      </div>
                      
                      {/* 2. 功能菜单网格 */}
                      <div className="p-2 grid grid-cols-1 gap-1 bg-black">
                        
                        <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800">
                           <div className="w-10 h-10 bg-blue-950/30 rounded flex items-center justify-center text-xl group-hover:scale-110 transition-transform">📊</div>
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-300 group-hover:text-blue-400 transition-colors">控制台 (Dashboard)</span>
                              <span className="text-[9px] text-zinc-600 group-hover:text-zinc-500">查看宠物状态与资产</span>
                           </div>
                        </Link>
                        
                        <Link href="/registry" onClick={() => setShowUserMenu(false)} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800">
                           <div className="w-10 h-10 bg-emerald-950/30 rounded flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🧬</div>
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-300 group-hover:text-emerald-400 transition-colors">注册局 (Registry)</span>
                              <span className="text-[9px] text-zinc-600 group-hover:text-zinc-500">铸造新的数字生命</span>
                           </div>
                        </Link>

                         <Link href="/square" onClick={() => setShowUserMenu(false)} className="group flex items-center gap-4 p-3 rounded-lg hover:bg-zinc-900 transition-all border border-transparent hover:border-zinc-800">
                           <div className="w-10 h-10 bg-purple-950/30 rounded flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🌐</div>
                           <div className="flex flex-col">
                              <span className="text-xs font-bold text-zinc-300 group-hover:text-purple-400 transition-colors">星际广场 (Square)</span>
                              <span className="text-[9px] text-zinc-600 group-hover:text-zinc-500">访问公共区域</span>
                           </div>
                        </Link>
                      </div>

                      {/* 3. 底部危险区 */}
                      <div className="p-2 border-t border-zinc-900 bg-zinc-950">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-950/10 hover:bg-red-900/20 text-red-500/70 hover:text-red-400 transition-all font-bold text-[10px] uppercase tracking-widest border border-transparent hover:border-red-900/30">
                          <span>⚠️ Disconnect / Logout</span>
                        </button>
                      </div>

                    </div>
                  </>
                )}
              </div>
            ) : (
              // === 未登录 (Neon Button) ===
              <button 
                onClick={() => setShowAuthModal(true)}
                className="group relative px-6 py-2 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] overflow-hidden"
              >
                <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center gap-2">
                   <span>Initialize</span>
                   <span className="bg-black text-white px-1.5 py-0.5 rounded text-[8px] group-hover:bg-white group-hover:text-black transition-colors">LOGIN</span>
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
