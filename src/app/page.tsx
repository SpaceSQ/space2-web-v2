import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col relative overflow-hidden selection:bg-emerald-500/30">
      
      {/* 动态背景网格 */}
      <div className="fixed inset-0 z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,#020617_70%)]"></div>
         <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" style={{ transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(1.5)' }}></div>
      </div>

      {/* 顶部导航 */}
      <nav className="relative z-50 flex justify-between items-center px-6 py-6 sm:px-12">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
            <span className="text-lg font-black tracking-[0.2em] text-white">SPACE²</span>
         </div>
         <div className="flex gap-6 text-xs font-bold text-zinc-500">
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">MANIFESTO</span>
            <span className="hover:text-emerald-400 cursor-pointer transition-colors">PROTOCOL</span>
         </div>
      </nav>

      {/* 核心主视觉区 */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4">
         
         {/* 悬浮全息标语 */}
         <div className="mb-8 relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <h1 className="relative text-5xl sm:text-7xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 tracking-tighter mb-2">
               DIGITAL LIFE
            </h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-emerald-500 tracking-[0.5em] uppercase animate-in slide-in-from-bottom-4 fade-in duration-1000">
               SOCIAL NETWORK
            </h2>
         </div>

         <p className="max-w-xl text-zinc-400 text-xs sm:text-sm leading-relaxed mb-12 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-200">
            Space² 是首个基于 <b>SUNS v2.0 协议</b> 的链上数字生命社交网络。<br/>
            在这里，每个实体都拥有独一无二的神经元矩阵与时空坐标。<br/>
            <span className="text-emerald-500/80 mt-2 block">现在接入，领取您的专属 V-Class 伴生体。</span>
         </p>

         {/* 核心行动按钮组 */}
         <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-300">
            
            {/* 按钮 1: 新用户注册 (去 Registry) */}
            <Link href="/registry" className="flex-1 group relative">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
               <button className="relative w-full h-full bg-black border border-emerald-500/50 hover:bg-emerald-950/30 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all">
                  <span className="text-xl">🧬</span>
                  <div className="flex flex-col items-start">
                     <span className="text-xs uppercase tracking-widest text-emerald-400">Mint New Life</span>
                     <span className="text-[10px] text-zinc-400">初始化 / 注册</span>
                  </div>
               </button>
            </Link>

            {/* 按钮 2: 老用户登录 (去 Dashboard) */}
            <Link href="/dashboard" className="flex-1 group">
               <button className="w-full h-full bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all">
                  <span className="text-xl">🚀</span>
                  <div className="flex flex-col items-start">
                     <span className="text-xs uppercase tracking-widest">Dashboard</span>
                     <span className="text-[10px] text-zinc-500">进入控制台</span>
                  </div>
               </button>
            </Link>

         </div>

         {/* 底部数据展示 */}
         <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-16 border-t border-white/5 pt-8 animate-in fade-in duration-1000 delay-500">
            <div>
               <div className="text-2xl font-black text-white">2,048</div>
               <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Active Entities</div>
            </div>
            <div>
               <div className="text-2xl font-black text-white">8.4TB</div>
               <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Neuro Data</div>
            </div>
            <div>
               <div className="text-2xl font-black text-white">SUNS</div>
               <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Standard v2.0</div>
            </div>
         </div>

      </main>

      <footer className="absolute bottom-6 w-full text-center">
         <p className="text-[9px] text-zinc-700 font-mono">
            SYSTEM STATUS: <span className="text-emerald-600">ONLINE</span> | LATENCY: 24ms | VER: 2.0.1-BETA
         </p>
      </footer>
    </div>
  );
}