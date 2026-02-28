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
  
  // 状态管理
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(true); // 增加加载状态

  // 监听滚动与 Session
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // 获取初始 Session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };
    checkSession();

    // 监听 Auth 变化 (如登录/登出)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
      if (session) setShowAuthModal(false); // 登录成功自动关窗
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
    window.location.reload(); // 强制刷新清除状态
  };

  const navItems = [
    { name: '首页', path: '/', id: 'HOME' },
    { name: '控制台', path: '/dashboard', id: 'DASHBOARD' },
    { name: '注册局', path: '/registry', id: 'REGISTRY' },
    { name: '广场', path: '/square', id: 'SQUARE' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 border-b ${isScrolled ? 'bg-black/90 border-zinc-800 py-3 backdrop-blur-md' : 'bg-transparent border-transparent py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 flex justify-between items-center">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-xs shadow-[0_0_15px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform">S²</div>
            <span className="text-lg font-bold text-white tracking-widest">SPACE²</span>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex gap-1 bg-zinc-900/50 p-1 rounded-full border border-white/5 backdrop-blur-sm">
            {navItems.map((item) => (
              <Link 
                key={item.id} 
                href={item.path}
                className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${pathname === item.path ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right: User Auth (核心修复区) */}
          <div className="relative">
            {loading ? (
               // 加载中显示占位符
               <div className="w-24 h-8 bg-zinc-800/50 rounded-full animate-pulse"></div>
            ) : session ? (
              // 已登录状态 -> 显示用户菜单
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 hover:border-emerald-500/50 pl-1 pr-4 py-1 rounded-full transition-all group"
                >
                  <div className="w-7 h-7 bg-emerald-900 rounded-full flex items-center justify-center text-[10px] text-emerald-400 font-bold border border-emerald-500/30 group-hover:bg-emerald-800 transition-colors">
                    {session.user.email?.slice(0, 2).toUpperCase() || 'U'}
                  </div>
                  <span className="text-[10px] text-zinc-300 font-bold group-hover:text-white transition-colors">COMMANDER</span>
                  <span className={`text-[8px] text-zinc-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}>▼</span>
                </button>

                {/* Dropdown Menu (强制置顶) */}
                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-[101]" onClick={() => setShowUserMenu(false)}></div>
                    <div className="absolute right-0 top-12 w-56 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 z-[102]">
                      <div className="px-4 py-3 border-b border-zinc-900 bg-zinc-900/30">
                        <p className="text-[9px] text-zinc-500 uppercase tracking-widest mb-1">Logged in as</p>
                        <p className="text-xs text-white truncate font-mono font-bold">{session.user.email}</p>
                      </div>
                      
                      <div className="p-1">
                        <Link href="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 text-[10px] text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                           <span className="text-lg">📊</span> 控制台 (Dashboard)
                        </Link>
                        <Link href="/registry" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 text-[10px] text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                           <span className="text-lg">🧬</span> 铸造新生命 (Mint)
                        </Link>
                        <Link href="/square" onClick={() => setShowUserMenu(false)} className="flex items-center gap-3 px-3 py-2 text-[10px] text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-lg transition-colors">
                           <span className="text-lg">🌐</span> 星际广场 (Square)
                        </Link>
                      </div>

                      <div className="h-px bg-zinc-900 my-1"></div>
                      
                      <div className="p-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-left text-[10px] text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors font-bold">
                          <span className="text-lg">🚪</span> 安全登出 (Logout)
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // 未登录状态 -> 显示登录按钮
              <button 
                onClick={() => setShowAuthModal(true)}
                className="bg-white text-black hover:bg-emerald-400 hover:text-black font-black text-[10px] px-6 py-2.5 rounded-full uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_20px_#10b981]"
              >
                Login / Join
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* 挂载模态框 */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={() => {
          router.refresh();
        }}
      />
    </>
  );
};
