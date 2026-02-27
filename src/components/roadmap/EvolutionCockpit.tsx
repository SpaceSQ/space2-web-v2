"use client";
import React, { useState } from 'react';
import { Box, PaintBucket, Layers, Activity, Globe } from 'lucide-react';

const STAGES = [
  { id: 1, name: "GENESIS", subtitle: "Logic & Topology", icon: Box, color: "text-blue-500", border: "border-blue-500" },
  { id: 2, name: "AESTHETICS", subtitle: "Skin & Interior", icon: PaintBucket, color: "text-purple-500", border: "border-purple-500" },
  { id: 3, name: "BIM ENGINEERING", subtitle: "Structure & MEP", icon: Layers, color: "text-yellow-500", border: "border-yellow-500" },
  { id: 4, name: "DIGITAL TWIN", subtitle: "IoT & Sync", icon: Activity, color: "text-green-500", border: "border-green-500" },
  { id: 5, name: "SYMBIOSIS", subtitle: "Physical Portal", icon: Globe, color: "text-red-500", border: "border-red-500" },
];

export const EvolutionCockpit = () => {
  const [stage, setStage] = useState(1);

  return (
    <div className="w-full bg-black border border-zinc-800 rounded-2xl overflow-hidden flex flex-col md:flex-row h-[600px] shadow-2xl">
      
      {/* 左侧：控制面板 */}
      <div className="w-full md:w-1/3 bg-zinc-900/50 p-6 flex flex-col border-r border-zinc-800">
        <div className="mb-8">
          <div className="text-[10px] text-zinc-500 font-mono tracking-widest mb-1">ROADMAP SIMULATION</div>
          <h2 className="text-2xl font-bold text-white">Evolution Engine</h2>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          {STAGES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStage(s.id)}
              className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 relative overflow-hidden group
                ${stage === s.id 
                  ? `bg-black ${s.border} shadow-[0_0_20px_rgba(0,0,0,0.5)]` 
                  : 'bg-transparent border-transparent hover:bg-zinc-800/50 text-zinc-500'}
              `}
            >
              <div className={`p-2 rounded-lg bg-zinc-900 transition-colors ${stage === s.id ? s.color : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                <s.icon size={20} />
              </div>
              <div className="z-10">
                <div className={`text-xs font-bold transition-colors ${stage === s.id ? 'text-white' : 'group-hover:text-zinc-300'}`}>EPOCH {s.id}</div>
                <div className="text-[10px] font-mono opacity-80">{s.name}</div>
              </div>
              {/* 进度条背景动画 */}
              {stage === s.id && (
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-${s.color.split('-')[1]}-500 to-transparent w-full animate-pulse`}></div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-8 p-4 bg-black rounded-lg border border-zinc-800 text-[10px] font-mono text-zinc-400">
          &gt; SIMULATING: {STAGES[stage-1].subtitle}<br/>
          &gt; KERNEL: SpaceSQ v{stage}.0<br/>
          &gt; STATUS: <span className="animate-pulse text-green-500">RUNNING</span>
        </div>
      </div>

      {/* 右侧：视觉模拟窗 */}
      <div className="flex-1 bg-black relative flex items-center justify-center perspective-1000 overflow-hidden">
        
        {/* 背景网格 */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${stage >= 1 ? 'opacity-20' : 'opacity-0'}`} 
             style={{backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
        </div>

        {/* 核心立方体模拟 (3D 变换容器) */}
        <div className="relative w-64 h-64 transition-all duration-1000 transform hover:scale-105">
          
          {/* EPOCH 1: 线框 (Wireframe) - 逻辑容器 */}
          <div className={`absolute inset-0 border-2 border-blue-500 bg-blue-900/10 transition-all duration-700 backdrop-blur-sm
            ${stage === 1 ? 'opacity-100 scale-100' : 'opacity-20 scale-90 border-dashed'}
          `}>
            <div className="absolute top-2 left-2 text-[10px] text-blue-400 font-mono">SSSU-001</div>
            {stage === 1 && <div className="absolute inset-0 flex items-center justify-center text-blue-500/20 text-4xl font-black tracking-tighter">LOGIC</div>}
            
            <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-blue-400"></div>
            <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-blue-400"></div>
          </div>

          {/* EPOCH 2: 材质与内饰 (Aesthetics) - 视觉层 */}
          <div className={`absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-900 border-2 border-zinc-600 transition-all duration-700 shadow-2xl
            ${stage >= 2 ? 'opacity-100 translate-x-4 -translate-y-4' : 'opacity-0 scale-90'}
          `}>
             <div className="absolute bottom-0 left-4 w-12 h-8 bg-orange-500/20 border border-orange-500 rounded-t-lg"></div>
             <div className="absolute top-4 right-4 w-8 h-20 bg-zinc-700 rounded-lg border border-zinc-600"></div>
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-yellow-500/10 blur-2xl rounded-full pointer-events-none"></div>
             {stage === 2 && <div className="absolute bottom-2 right-2 text-[10px] text-zinc-500 font-mono">RENDER: PBR</div>}
          </div>

          {/* EPOCH 3: BIM 管道 (Engineering) - 工程层 */}
          <div className={`absolute inset-0 transition-all duration-700 pointer-events-none z-20
            ${stage >= 3 ? 'opacity-100 translate-x-4 -translate-y-4' : 'opacity-0'}
          `}>
             <div className="absolute top-4 left-0 w-full h-0.5 bg-yellow-500/50"></div>
             <div className="absolute bottom-12 left-0 w-full h-1 bg-blue-500/50"></div>
             <div className="absolute top-0 right-12 h-full w-0.5 bg-red-500/50"></div>
             
             <div className="absolute top-2 right-2 text-[8px] text-yellow-500 font-mono bg-black px-1 border border-yellow-500/50">MEP: OK</div>
             <div className="absolute bottom-2 left-2 text-[8px] text-blue-500 font-mono bg-black px-1 border border-blue-500/50">H2O: OK</div>
          </div>

          {/* EPOCH 4: IoT 数据流 (Digital Twin) - 数据层 */}
          <div className={`absolute -inset-8 transition-all duration-700 pointer-events-none z-30
            ${stage >= 4 ? 'opacity-100' : 'opacity-0'}
          `}>
             <div className="absolute top-0 left-0 text-[10px] text-green-500 font-mono bg-black/90 px-2 py-1 rounded border border-green-500/50 animate-bounce shadow-[0_0_10px_rgba(34,197,94,0.3)]">
               TEMP: 24°C
             </div>
             <div className="absolute bottom-0 right-0 text-[10px] text-green-500 font-mono bg-black/90 px-2 py-1 rounded border border-green-500/50 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.3)]">
               PWR: 150W
             </div>
             <div className="absolute inset-0 border border-green-500/20 rounded-xl"></div>
          </div>

          {/* EPOCH 5: 物理入口 (Symbiosis) - 虚实融合 */}
          <div className={`absolute -inset-16 border-[6px] border-red-600/80 rounded-full flex items-center justify-center transition-all duration-1000 z-40
            ${stage === 5 ? 'opacity-100 scale-100 animate-spin-slow' : 'opacity-0 scale-150 pointer-events-none'}
          `} style={{ animationDuration: '20s' }}>
             <div className="absolute -top-3 bg-black text-red-500 text-xs font-bold px-2 tracking-[0.2em]">PHYSICAL_PORTAL</div>
             <div className="absolute -bottom-3 bg-black text-red-500 text-xs font-bold px-2 tracking-[0.2em]">REALITY_LINK</div>
          </div>
          
          {stage === 5 && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full blur-xl animate-pulse z-50 mix-blend-overlay"></div>
          )}

        </div>

        {/* 底部描述 */}
        <div className="absolute bottom-8 text-center px-6">
           <div className={`text-sm font-bold tracking-widest mb-1 transition-colors duration-500 ${STAGES[stage-1].color}`}>
             {STAGES[stage-1].name} PHASE
           </div>
           <div className="text-xs text-zinc-500 max-w-md mx-auto">
             {stage === 1 && "Creating the fundamental digital container logic (SSSU)."}
             {stage === 2 && "Generative aesthetics and PBR rendering for human comfort."}
             {stage === 3 && "Structural integrity validation and BIM integration."}
             {stage === 4 && "Real-time synchronization with physical sensors (Digital Twin)."}
             {stage === 5 && "The boundary dissolves. Virtual logic controls physical reality."}
           </div>
        </div>

      </div>
    </div>
  );
};