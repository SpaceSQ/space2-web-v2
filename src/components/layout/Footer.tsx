import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Copyright, TrendingUp } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
        
        {/* 左侧：版权信息 - 修正为 2026 */}
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
            <Copyright className="w-4 h-4" />
            <span>2026 SpaceSQ Genesis Foundation. All Rights Reserved.</span>
          </div>
          <p className="text-slate-600 text-xs">
            Decentralized Autonomous Territory Protocol.
          </p>
        </div>

        {/* 中间：投资与合作 */}
        <div className="flex items-center gap-6">
          <Link href="/docs" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <TrendingUp className="w-4 h-4" />
            <span>Investor Relations</span>
          </Link>
        </div>

        {/* 右侧：管理员入口 (隐蔽处理) */}
        <div>
          <Link 
            href="/admin" 
            className="flex items-center gap-2 text-zinc-700 hover:text-zinc-500 transition-colors text-xs font-mono"
          >
            <ShieldCheck className="w-3 h-3" />
            <span>SYSTEM_ADMIN</span>
          </Link>
        </div>

      </div>
    </footer>
  );
}