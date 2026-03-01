"use client";
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

// 定义宠物数据结构
interface Pet {
  id: string;
  name: string;
  status: string;
  dna_hash?: string;
  created_at: string;
}

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. 检查用户是否登录
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        // 没登录直接踢回首页
        router.push('/');
        return;
      }
      
      setUser(session.user);

      // 2. 拉取该用户的宠物列表
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', session.user.id)
        .order('created_at', { ascending: false });

      if (data) setPets(data);
      setLoading(false);
    };

    fetchData();
  }, [supabase, router]);

  // 加载中状态
  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center font-mono">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-emerald-500 animate-pulse">CONNECTING TO NEURAL NET...</p>
        </div>
      </div>
    );
  }

  return (
    // ⚠️ 注意：这里加了 pt-24，是为了给顶部的 GlobalNav 留出位置，防止被遮挡
    <div className="min-h-screen bg-[#020617] text-white font-mono pt-24 px-4 sm:px-8 pb-12 selection:bg-emerald-500/30">
      
      {/* 欢迎头部 */}
      <header className="max-w-6xl mx-auto mb-12 border-b border-white/10 pb-8 animate-in slide-in-from-bottom-4 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
             <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
               COMMAND CENTER
             </h1>
             <p className="text-xs text-zinc-500 uppercase tracking-widest">
               Welcome back, Commander <span className="text-emerald-500">{user?.email?.split('@')[0]}</span>
             </p>
          </div>
          <div className="flex gap-4">
             <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg text-right">
                <div className="text-[10px] text-zinc-500 uppercase">Active Entities</div>
                <div className="text-xl font-bold text-white">{pets.length}</div>
             </div>
             <div className="bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg text-right">
                <div className="text-[10px] text-zinc-500 uppercase">System Status</div>
                <div className="text-xl font-bold text-emerald-500 animate-pulse">ONLINE</div>
             </div>
          </div>
        </div>
      </header>

      {/* 核心内容区 */}
      <main className="max-w-6xl mx-auto">
        
        {/* 如果没有宠物 */}
        {pets.length === 0 ? (
          <div className="bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl p-12 text-center animate-in zoom-in-95 duration-500">
            <div className="text-6xl mb-6 opacity-20">🧬</div>
            <h2 className="text-xl font-bold text-zinc-300 mb-2">No Active Lifeforms Detected</h2>
            <p className="text-sm text-zinc-500 mb-8 max-w-md mx-auto">
              您的空间扇区目前是空的。请前往注册局初始化您的第一个硅基伴生体。
            </p>
            <button 
              onClick={() => router.push('/registry')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              INITIALIZE NEW LIFE (去铸造)
            </button>
          </div>
        ) : (
          // 如果有宠物 -> 卡片网格
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
            {pets.map((pet) => (
              <div 
                key={pet.id}
                onClick={() => router.push(`/pet-profile?id=${pet.id}`)} // 点击去详情页(如果有的话)
                className="group relative bg-zinc-900/40 border border-white/5 hover:border-emerald-500/50 rounded-xl p-6 cursor-pointer transition-all hover:-translate-y-1 overflow-hidden"
              >
                {/* 装饰背景 */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-black border border-zinc-800 rounded-lg flex items-center justify-center text-2xl group-hover:border-emerald-500/50 transition-colors">
                      🐱
                    </div>
                    <span className="px-2 py-1 bg-emerald-900/20 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold rounded uppercase">
                      {pet.status || 'Active'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{pet.name}</h3>
                  <p className="text-[10px] text-zinc-500 font-mono mb-4">ID: {pet.id.slice(0, 8)}...{pet.id.slice(-4)}</p>
                  
                  <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[70%]"></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[8px] text-zinc-600">ENERGY</span>
                    <span className="text-[8px] text-emerald-500">70%</span>
                  </div>
                </div>
              </div>
            ))}

            {/* 一个永远存在的“添加”卡片 */}
            <div 
               onClick={() => router.push('/registry')}
               className="border border-dashed border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/30 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all min-h-[200px] group"
            >
               <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 text-2xl mb-3 group-hover:text-white group-hover:bg-zinc-800 transition-colors">+</div>
               <span className="text-xs font-bold text-zinc-500 group-hover:text-zinc-300">ADD NEW ENTITY</span>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
