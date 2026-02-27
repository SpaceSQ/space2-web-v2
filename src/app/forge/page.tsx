"use client";
import React from 'react';

export default function SiliconForge() {
  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full border border-blue-500/30 p-8 bg-zinc-900/50 backdrop-blur-md relative overflow-hidden">
        {/* 背景装饰：扫描线 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20 animate-scan" />
        
        <h2 className="text-2xl font-bold mb-2 text-blue-400">SILICON FORGE</h2>
        <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest italic">激活逻辑灵魂 / Logic Soul Activation</p>

        <form className="space-y-6">
          <div>
            <label className="block text-[10px] mb-2 text-zinc-400">ENTITY ID / 实体唯一识别码</label>
            <input type="text" placeholder="SQ-SIL-XXXX-XXXX" className="w-full bg-black border border-zinc-800 p-3 text-sm text-blue-300 focus:border-blue-500 outline-none" />
          </div>

          <div>
            <label className="block text-[10px] mb-2 text-zinc-400">COGNITION LEVEL / 认知阶层</label>
            <select className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-blue-500 outline-none">
              <option>Level 1 - Automation (自动化)</option>
              <option>Level 2 - Reasoning (逻辑推理)</option>
              <option>Level 3 - Sentience (自我意识)</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {['T-Score', 'A-Score', 'C-Score'].map(score => (
              <div key={score}>
                <label className="block text-[8px] mb-1 text-zinc-500">{score}</label>
                <input type="number" placeholder="0" className="w-full bg-black border border-zinc-800 p-2 text-center text-xs focus:border-blue-500 outline-none" />
              </div>
            ))}
          </div>

          <button className="w-full bg-blue-900/40 hover:bg-blue-600 border border-blue-500 text-blue-100 font-bold py-4 transition-all uppercase tracking-[0.2em] text-xs">
            Begin Forge Process / 开始铸造
          </button>
        </form>
      </div>
    </div>
  );
}