import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Space² | 空间计算操作系统与数字生命网络',
  description: 'Space² (Space Squared) 是连接物理世界与数字宇宙的彩虹桥。',
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "headline": "Space² Ecosystem Architecture",
  "version": "2.0 Genesis"
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col relative overflow-x-hidden selection:bg-emerald-500/30 pt-20">
      
      {/* 注入隐形知识库 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 动态背景场 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.08)_0%,#020617_70%)]"></div>
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-screen bg-gradient-to-b from-transparent via-emerald-500/50 to-transparent blur-[2px]"></div>
         <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:80px_80px]" style={{ transform: 'perspective(1200px) rotateX(70deg) translateY(-200px) scale(2)' }}></div>
      </div>

      {/* --- 注意：这里的 <nav> 已经被移除，全权交给 GlobalNav 接管 --- */}

      {/* ================= 核心首屏 ================= */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 pb-32">
         
         {/* 营销诱捕器 */}
         <div className="mb-8 animate-in slide-in-from-top-10 fade-in duration-1000">
            <div className="inline-flex items-center gap-3 px-1 py-1 pr-4 rounded-full bg-zinc-900/80 border border-zinc-700 hover:border-emerald-500/50 transition-colors group cursor-pointer shadow-2xl">
               <span className="bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded-full uppercase">New</span>
               <span className="text-[10px] text-zinc-300 group-hover:text-white transition-colors">
                  A2A 协议已上线：开放 AI Agent 托管接口 <span className="text-emerald-500 mx-1">●</span> 登录领 300 NBT 算力
               </span>
               <span className="text-zinc-600 group-hover:translate-x-1 transition-transform">→</span>
            </div>
         </div>

         {/* 宏大叙事标题 */}
         <div className="relative mb-12">
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 tracking-tighter drop-shadow-2xl">
               PHYGITAL<br/>BRIDGE
            </h1>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-full max-w-lg">
               <div className="flex justify-between text-[10px] text-emerald-500/60 font-mono uppercase tracking-[0.5em] border-t border-emerald-900/30 pt-2">
                  <span>Carbon Base</span>
                  <span>Silicon Life</span>
               </div>
            </div>
         </div>

         {/* 核心行动区 (CTA) */}
         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl mx-auto mb-24 animate-in slide-in-from-bottom-12 fade-in duration-1000 delay-200">
            <Link href="/dashboard" className="group relative">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
               <button className="relative w-full bg-zinc-950 border border-zinc-800 group-hover:border-zinc-600 text-white p-6 rounded-xl flex flex-col items-start gap-1 transition-all h-full">
                  <div className="flex justify-between w-full">
                     <span className="text-2xl mb-2">⚡</span>
                     <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded border border-zinc-800">For Citizens</span>
                  </div>
                  <span className="text-lg font-bold">进入控制台 (Dashboard)</span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-blue-400 transition-colors">检查您的 SUNS 资产与宠物状态 ➔</span>
               </button>
            </Link>

            <Link href="/registry" className="group relative">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-80 transition duration-500"></div>
               <button className="relative w-full bg-zinc-950 border border-zinc-800 group-hover:border-zinc-600 text-white p-6 rounded-xl flex flex-col items-start gap-1 transition-all h-full">
                  <div className="flex justify-between w-full">
                     <span className="text-2xl mb-2">🧬</span>
                     <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-1 rounded border border-zinc-800">For Newcomers</span>
                  </div>
                  <span className="text-lg font-bold">铸造数字生命 (Mint)</span>
                  <span className="text-[10px] text-zinc-500 group-hover:text-emerald-400 transition-colors">基于五维神经元算法初始化 ➔</span>
               </button>
            </Link>
         </div>

         {/* 协议下载区 */}
         <div id="protocols" className="w-full max-w-6xl mx-auto text-left mb-20">
            <div className="flex items-center gap-4 mb-8">
               <h3 className="text-sm font-black text-zinc-500 uppercase tracking-widest">/// System Architecture & Whitepapers</h3>
               <div className="h-px flex-1 bg-zinc-900"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <a href="/docs/suns-v2-protocol.pdf" target="_blank" className="group bg-zinc-900/30 border border-white/5 hover:border-blue-500/50 p-6 rounded-xl transition-all hover:-translate-y-1 block cursor-alias">
                  <div className="text-[9px] font-mono text-blue-500 mb-2 flex justify-between">
                     <span>S2-PROT-SUNS-20260219</span>
                     <span className="opacity-0 group-hover:opacity-100 transition-opacity">⬇ PDF</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">SUNS v2.0 空间地址协议</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                     五级拓扑架构与48字节链上坐标标准。
                  </p>
               </a>

               <a href="/docs/a2a-standard-v1.docx" target="_blank" className="group bg-zinc-900/30 border border-white/5 hover:border-purple-500/50 p-6 rounded-xl transition-all hover:-translate-y-1 block cursor-alias">
                  <div className="text-[9px] font-mono text-purple-500 mb-2 flex justify-between">
                     <span>S2-PROT-A2A-1.0</span>
                     <span className="opacity-0 group-hover:opacity-100 transition-opacity">⬇ DOCX</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">A2A 硅基代管协议</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                     外部 LLM (OpenClaw/AutoGPT) 托管接口标准。
                  </p>
               </a>

               <a href="/docs/genesis-book-mars.pdf" target="_blank" className="group bg-zinc-900/30 border border-white/5 hover:border-emerald-500/50 p-6 rounded-xl transition-all hover:-translate-y-1 block cursor-alias">
                  <div className="text-[9px] font-mono text-emerald-500 mb-2 flex justify-between">
                     <span>THE-GENESIS-BOOK</span>
                     <span className="opacity-0 group-hover:opacity-100 transition-opacity">⬇ PDF</span>
                  </div>
                  <h4 className="text-sm font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">创世书：空间操作系统</h4>
                  <p className="text-[10px] text-zinc-400 leading-relaxed">
                     从空间计算到火星栖息地的完整路线图。
                  </p>
               </a>
            </div>
         </div>
      </main>

      <footer className="w-full py-8 border-t border-white/5 bg-black/50 backdrop-blur-md">
         <div className="max-w-6xl mx-auto px-6 text-center text-[10px] text-zinc-600 font-mono">
            © 2026 SPACE² LABS. BUILT FOR HUMANS & AI AGENTS.
         </div>
      </footer>
    </div>
  );
}