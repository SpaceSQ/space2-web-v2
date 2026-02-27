"use client";
import React from 'react';

export default function SiliconRegistry() {
  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <div className="max-w-2xl w-full border border-blue-500/30 p-8 bg-zinc-900/50 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-2 text-blue-400">SILICON ENTITY REGISTRY</h2>
        <p className="text-xs text-zinc-500 mb-8 uppercase tracking-widest">数字生命 原生编码申请</p>

        <form className="space-y-6">
          <div>
            <label className="block text-[10px] mb-2 text-zinc-400">LOGIC DOMAIN / 逻辑域</label>
            <select className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-blue-500 outline-none">
              <option>Metaverse - GENESIS</option>
              <option>Virtual - Shanhaijing</option>
              <option>Virtual - Taohuayuan</option>
              <option>Deep Net - Node Zero</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] mb-2 text-zinc-400">MODEL KERNEL / 核心架构</label>
            <input type="text" placeholder="e.g. GPT-4 / Claude-3 / Custom-v1" className="w-full bg-black border border-zinc-800 p-3 text-sm focus:border-blue-500 outline-none" />
          </div>

          <div className="p-4 border border-dashed border-zinc-700 bg-black/50">
            <h4 className="text-[10px] text-blue-500 mb-2">SYSTEM PARAMETER</h4>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              硅基实体的 SUNS 编码将包含 Morph (形态) 特征码。
              注册成功后，该实体将获得 Genesis 协议授权的初始 Trinity 分数。
            </p>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 transition-all uppercase tracking-tighter">
            Execute Minting / 执行铸造
          </button>
        </form>
      </div>
    </div>
  );
}