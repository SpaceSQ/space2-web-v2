"use client";
import React, { useState } from 'react';
import { ArrowRight, Loader2, Lock, Terminal, AlertCircle } from 'lucide-react';

interface ImmigrationGateProps {
  onUnlock: (email: string) => void;
}

export const ImmigrationGate = ({ onUnlock }: ImmigrationGateProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'granted'>('idle');

  // 处理提交的核心逻辑
  const handleSubmit = async (e?: React.FormEvent) => {
    // 1. 阻止表单默认的刷新页面行为
    if (e) e.preventDefault(); 
    
    // 2. 基础验证
    if (!email) {
      setError('// ERROR: IDENTITY_NULL');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('// ERROR: INVALID_FORMAT_EXCEPTION');
      return;
    }

    // 3. 进入加载状态
    setLoading(true);
    setError('');
    setStatus('verifying');

    // 4. 模拟网络请求 (制造一点黑客仪式感)
    setTimeout(() => {
      // 简单模拟验证通过 (你可以根据需要限制特定域名)
      const isAuthorized = true; 

      if (isAuthorized) {
        setStatus('granted');
        localStorage.setItem('spacesq_citizen', email);
        
        // 触发父组件的回调
        if (onUnlock) {
            onUnlock(email);
        }
      } else {
        setError('// ERROR: ACCESS_DENIED (Domain Restricted)');
        setStatus('idle');
      }
      setLoading(false);
    }, 1500); // 1.5秒延迟
  };

  // 如果验证通过，显示成功状态
  if (status === 'granted') {
    return (
      <div className="w-full p-8 border border-green-500/30 bg-green-500/10 rounded-xl text-center animate-in fade-in zoom-in duration-500">
        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
           <Lock className="text-green-500" size={24} />
        </div>
        <h3 className="text-xl font-black text-green-400 mb-2 tracking-wider">ACCESS GRANTED</h3>
        <p className="text-xs font-mono text-green-300/70 mb-4">Identity Hash Verified: {email}</p>
        <div className="inline-block px-3 py-1 bg-green-900/40 border border-green-800 rounded text-[10px] text-green-500 font-mono animate-pulse">
          &gt; Redirecting to secure channel...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-zinc-900/30 border border-zinc-800 p-6 md:p-8 rounded-xl relative overflow-hidden group hover:border-zinc-700 transition-all duration-300 shadow-xl">
      
      {/* 顶部装饰条 */}
      <div className="flex items-center justify-between mb-8 text-[10px] font-mono text-zinc-600">
         <div className="flex items-center gap-2">
           <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
           SECURE_GATE_V1
         </div>
         <div className="flex items-center gap-1">
           <Lock size={10} /> ENCRYPTED
         </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-zinc-500 mb-3 uppercase tracking-widest flex items-center gap-2">
            Citizenship Identification
          </label>
          
          {/* 关键修复：使用 <form> 包裹 input 
            这样在输入框内按 Enter 键会自动触发 onSubmit 
          */}
          <form onSubmit={handleSubmit} className="relative group/input">
             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors group-focus-within/input:text-blue-500">
                <Terminal size={18} />
             </div>
             
             <input 
               type="email" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="Enter verified email address..."
               className="w-full bg-black border border-zinc-700 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 text-white pl-12 pr-12 py-4 rounded-lg font-mono text-sm outline-none transition-all placeholder:text-zinc-700"
               disabled={loading}
               autoComplete="email"
             />
             
             {/* 提交按钮 */}
             <button 
               type="submit"
               disabled={loading}
               className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zinc-800 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
             >
               {loading ? <Loader2 size={18} className="animate-spin text-blue-500" /> : <ArrowRight size={18} />}
             </button>
          </form>
          
          {/* 错误信息展示区 */}
          {error && (
            <div className="mt-3 text-[10px] font-mono text-red-400 flex items-center gap-2 animate-in slide-in-from-top-1">
              <AlertCircle size={12} />
              {error}
            </div>
          )}
        </div>

        {/* 底部协议声明 */}
        <div className="pt-6 border-t border-zinc-800/50">
           <div className="text-[10px] text-zinc-600 font-mono leading-relaxed">
             <span className="text-zinc-500">&gt;</span> By proceeding, you agree to the <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors border-b border-zinc-700 hover:border-white">S2-SLIP Protocol</span>.<br/>
             <span className="text-zinc-500">&gt;</span> Only authorized silicon & carbon entities allowed.
           </div>
        </div>
      </div>
      
      {/* 背景动态网格 */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none"></div>
    </div>
  );
};