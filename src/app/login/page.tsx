"use client";
import React, { useState } from 'react';
import { GlobalNav } from '@/components/GlobalNav';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // 模拟网络请求与数据库对接 (未来此处接入 Supabase Auth)
    setTimeout(() => {
      setIsLoading(false);
      // 注册/登录成功后，直接将玩家传送至大盘或庄园
      window.location.href = '/dashboard'; 
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col relative select-none">
      {/* 赛博朋克背景光效 */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,#020617_70%)]"></div>
         <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 顶部导航栏占位 (仅显示基础LOGO) */}
      <div className="absolute top-0 left-0 w-full h-16 px-8 flex items-center z-50 border-b border-zinc-800 bg-black/50 backdrop-blur-md">
         <span className="text-sm font-black text-white tracking-widest">SPACE² // NETWORK</span>
      </div>

      <div className="flex-1 flex items-center justify-center z-10 px-4">
         <div className="w-full max-w-md bg-black/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
            
            {/* 装饰性边缘 */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-500 to-pink-600"></div>

            <div className="text-center mb-8">
               <h1 className="text-3xl font-black text-white tracking-widest mb-2 uppercase">
                  {isLogin ? 'SYSTEM LOGIN' : 'INITIATE CREATOR'}
               </h1>
               <p className="text-[10px] text-zinc-500 font-mono">
                  {isLogin ? '欢迎回归，造物主。请输入身份凭证。' : '注册并获取您的星际通行证，开始创造数字生命。'}
               </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
               {!isLogin && (
                  <div>
                     <label className="block text-[10px] text-zinc-400 mb-1 tracking-widest">CREATOR ALIAS (造物主代号)</label>
                     <input type="text" required value={nickname} onChange={e => setNickname(e.target.value)} placeholder="如: THE_HACKER_99" className="w-full bg-zinc-900/80 border border-zinc-700 px-4 py-3 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition-colors" />
                  </div>
               )}
               
               <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 tracking-widest">COMM CHANNEL (电子邮箱)</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full bg-zinc-900/80 border border-zinc-700 px-4 py-3 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition-colors" />
               </div>

               <div>
                  <label className="block text-[10px] text-zinc-400 mb-1 tracking-widest">SECURITY CIPHER (安全秘钥)</label>
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-zinc-900/80 border border-zinc-700 px-4 py-3 rounded-xl text-sm text-white outline-none focus:border-blue-500 transition-colors" />
               </div>

               <button type="submit" disabled={isLoading} className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-black tracking-widest text-sm py-3.5 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all disabled:opacity-50">
                  {isLoading ? 'VERIFYING...' : (isLogin ? 'ENTER MATRIX' : 'GENERATE ID')}
               </button>
            </form>

            <div className="mt-6 text-center text-[10px] text-zinc-500">
               {isLogin ? "还没有签发身份？ " : "已拥有节点权限？ "}
               <button onClick={() => setIsLogin(!isLogin)} className="text-blue-400 hover:text-blue-300 font-bold underline underline-offset-4 decoration-blue-900/50">
                  {isLogin ? '注册新坐标' : '直接接入'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}