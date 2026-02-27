'use client';

import React, { useState, useRef } from 'react';
import IsometricGrid, { BlueprintType } from './IsometricGrid';
import { 
  Printer, Box, AlertTriangle, Zap, CheckCircle, Ruler, 
  Sparkles, Upload, Grid, BrainCircuit, Loader2, FileCode 
} from 'lucide-react';

// 👇 1. 显式定义 SSSU 接口，确保与 IsometricGrid 的 Props 匹配
interface SSSU {
  id: string;
  x: number;
  y: number;
  content: BlueprintType;
  status: 'active' | 'printing' | 'locked'; // 关键：锁定类型，防止推断为 string
  height: number;
}

// === 蓝图数据结构 ===
interface Blueprint {
  id: string;
  name: string;
  type: BlueprintType;
  nbtCost: number;
  occupied: number;
  source: 'SYSTEM' | 'AI_GEN' | 'IMPORTED';
  icon?: React.ReactNode;
  desc?: string;
}

// === 初始标准库 ===
const SYSTEM_BLUEPRINTS: Blueprint[] = [
  { id: 'FLOOR', name: 'Standard Floor', type: 'FLOOR', nbtCost: 10, occupied: 0, source: 'SYSTEM', icon: <Box className="w-4 h-4" />, desc: 'Basic infrastructure unit.' },
  { id: 'SERVER', name: 'Quantum Core', type: 'SERVER', nbtCost: 500, occupied: 0.9, source: 'SYSTEM', icon: <Zap className="w-4 h-4 text-indigo-400" />, desc: 'High-density compute node.' },
  { id: 'SOFA', name: 'Bio-Rest Unit', type: 'SOFA', nbtCost: 50, occupied: 0.3, source: 'SYSTEM', icon: <Box className="w-4 h-4 text-emerald-400" />, desc: 'Carbon lifeform recharge station.' },
];

export default function TDOGController() {
  // 👇 2. 使用泛型 <SSSU[]> 强制类型
  const [grid, setGrid] = useState<SSSU[]>(() => {
    const init: SSSU[] = [];
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        init.push({ 
          id: `${x}-${y}`, 
          x, 
          y, 
          content: 'EMPTY', // BlueprintType
          status: 'active', // 'active' | 'printing' | 'locked'
          height: 0 
        });
      }
    }
    return init;
  });

  // UI State
  const [mode, setMode] = useState<'catalog' | 'ai' | 'import'>('catalog');
  const [blueprints, setBlueprints] = useState<Blueprint[]>(SYSTEM_BLUEPRINTS);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint>(SYSTEM_BLUEPRINTS[0]);
  const [isPrinting, setIsPrinting] = useState(false);
  const [log, setLog] = useState('TDOG Kernel v2.1 Online. Ready for instructions.');
  
  // AI Gen State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Import State
  const fileInputRef = useRef<HTMLInputElement>(null);

  // === 核心逻辑：打印 ===
  const handleGridClick = (x: number, y: number) => {
    if (isPrinting || isGenerating) return;

    if (selectedBlueprint.occupied > 0.8) {
       setLog(`WARNING: High Occupancy Object! Checking Carbon-Life Safety Zone...`);
    }

    setIsPrinting(true);
    setLog(`MATERIALIZING: ${selectedBlueprint.name} [Source: ${selectedBlueprint.source}]...`);
    
    // 更新状态为 printing
    setGrid(prev => prev.map(cell => 
      cell.x === x && cell.y === y ? { ...cell, status: 'printing' } : cell
    ));

    setTimeout(() => {
      // 更新内容并恢复状态为 active
      setGrid(prev => prev.map(cell => 
        cell.x === x && cell.y === y 
          ? { ...cell, content: selectedBlueprint.type, status: 'active' } 
          : cell
      ));
      setIsPrinting(false);
      setLog(`PRINT COMPLETE. Entropy Stabilized. -${selectedBlueprint.nbtCost} NBT`);
    }, 1500);
  };

  // === 核心逻辑：AI 生成模拟 ===
  const handleAIGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);
    setLog(`AI_DREAM_FORGE: Analyzing prompt "${aiPrompt}"...`);

    setTimeout(() => { setLog(`AI_DREAM_FORGE: Constructing geometry via Stable-Point-E...`); }, 1000);
    setTimeout(() => { setLog(`AI_DREAM_FORGE: Calculating physics weights...`); }, 2000);
    
    setTimeout(() => {
      const newBP: Blueprint = {
        id: `AI_${Date.now()}`,
        name: aiPrompt.length > 15 ? aiPrompt.substring(0, 15) + '...' : aiPrompt,
        type: 'SERVER', // 视觉暂代
        nbtCost: 800,
        occupied: 0.5,
        source: 'AI_GEN',
        icon: <Sparkles className="w-4 h-4 text-purple-400" />,
        desc: `Generative Artifact: "${aiPrompt}"`
      };

      setBlueprints(prev => [newBP, ...prev]);
      setSelectedBlueprint(newBP);
      setIsGenerating(false);
      setLog(`GENERATION SUCCESS. Blueprint [${newBP.id}] added to memory.`);
      setAiPrompt('');
    }, 3500);
  };

  // === 核心逻辑：文件导入模拟 ===
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsGenerating(true);
    setLog(`IMPORT_GATEWAY: Reading ${file.name} (${(file.size/1024).toFixed(1)}KB)...`);

    setTimeout(() => {
      const newBP: Blueprint = {
        id: `IMP_${Date.now()}`,
        name: file.name.split('.')[0],
        type: 'SOFA', // 视觉暂代
        nbtCost: 100,
        occupied: 0.4,
        source: 'IMPORTED',
        icon: <FileCode className="w-4 h-4 text-blue-400" />,
        desc: `Imported asset from ${file.name}`
      };
      
      setBlueprints(prev => [newBP, ...prev]);
      setSelectedBlueprint(newBP);
      setIsGenerating(false);
      setLog(`IMPORT SUCCESS. Mesh optimized for SSSU.`);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      {/* 左侧：2.5D 视图 */}
      <div className="lg:col-span-2 bg-black/20 rounded-xl border border-white/5 relative">
         <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="px-2 py-1 bg-black/50 backdrop-blur rounded text-[10px] text-zinc-500 font-mono border border-zinc-800">
              GRID: 3x3 SSSU
            </div>
            {selectedBlueprint && (
              <div className="px-2 py-1 bg-indigo-900/50 backdrop-blur rounded text-[10px] text-indigo-300 font-mono border border-indigo-500/30 flex items-center gap-2">
                <Printer className="w-3 h-3" />
                ACTIVE: {selectedBlueprint.name.toUpperCase()}
              </div>
            )}
         </div>
         {/* 👇 这里的 grid 现在类型完全匹配了 */}
         <IsometricGrid gridData={grid} onCellClick={handleGridClick} isPrinting={isPrinting} />
      </div>

      {/* 右侧：TDOG 控制面板 */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-0 flex flex-col h-[600px] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950">
           <h2 className="text-lg font-bold text-white flex items-center gap-2">
             <Printer className="w-5 h-5 text-emerald-500" /> TDOG Controller
           </h2>
           <div className="flex gap-2 mt-4">
             <button onClick={()=>setMode('catalog')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode==='catalog'?'bg-zinc-800 text-white':'text-zinc-500 hover:text-zinc-300'}`}><Grid className="w-4 h-4 mx-auto mb-1"/>Catalog</button>
             <button onClick={()=>setMode('ai')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode==='ai'?'bg-indigo-900/50 text-indigo-400 border border-indigo-500/30':'text-zinc-500 hover:text-zinc-300'}`}><BrainCircuit className="w-4 h-4 mx-auto mb-1"/>AI Forge</button>
             <button onClick={()=>setMode('import')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode==='import'?'bg-zinc-800 text-white':'text-zinc-500 hover:text-zinc-300'}`}><Upload className="w-4 h-4 mx-auto mb-1"/>Import</button>
           </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/20">
          
          {/* CATALOG */}
          {mode === 'catalog' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-right-4">
              <p className="text-xs text-zinc-500 uppercase font-bold mb-2">Available Blueprints</p>
              {blueprints.map(bp => (
                <button
                  key={bp.id}
                  onClick={() => setSelectedBlueprint(bp)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all text-left group ${
                    selectedBlueprint.id === bp.id 
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' 
                      : 'bg-zinc-900 border-zinc-800 text-slate-400 hover:bg-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded ${selectedBlueprint.id===bp.id?'bg-white/20':'bg-black'}`}>{bp.icon}</div>
                    <div>
                      <div className="font-bold text-sm truncate w-32">{bp.name}</div>
                      <div className={`text-[10px] font-mono ${selectedBlueprint.id===bp.id?'text-indigo-200':'text-zinc-600'}`}>{bp.source}</div>
                    </div>
                  </div>
                  <div className={`text-xs font-mono ${selectedBlueprint.id===bp.id?'text-white':'text-emerald-600'}`}>{bp.nbtCost} NBT</div>
                </button>
              ))}
            </div>
          )}

          {/* AI FORGE */}
          {mode === 'ai' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 h-full flex flex-col">
              <div className="p-4 bg-indigo-900/20 border border-indigo-500/20 rounded-xl">
                <h3 className="text-sm font-bold text-indigo-400 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> Text-to-Matter</h3>
                <p className="text-xs text-indigo-300/70 leading-relaxed">
                  Describe an object to instantiate it from the latent space.
                  <br/><span className="opacity-50">Cost: 800 NBT/Generation</span>
                </p>
              </div>
              <form onSubmit={handleAIGenerate} className="flex-1 flex flex-col gap-4">
                <textarea 
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="e.g. A cyberpunk holographic desk..." 
                  className="w-full h-32 bg-black border border-zinc-700 rounded-lg p-3 text-sm text-white placeholder-zinc-600 focus:border-indigo-500 outline-none resize-none font-mono"
                  disabled={isGenerating}
                />
                <button type="submit" disabled={isGenerating || !aiPrompt.trim()} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
                  {isGenerating ? 'Dreaming...' : 'Generate Blueprint'}
                </button>
              </form>
            </div>
          )}

          {/* IMPORT */}
          {mode === 'import' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2"><FileCode className="w-4 h-4"/> External Assets</h3>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">Supported: .OBJ, .STL, .GLB<br/>System will auto-normalize scale.</p>
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer hover:bg-zinc-800 hover:border-zinc-500 transition-all ${isGenerating ? 'opacity-50 pointer-events-none' : ''}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isGenerating ? <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" /> : <Upload className="w-8 h-8 text-zinc-500 mb-2" />}
                    <p className="text-xs text-zinc-400">{isGenerating ? 'Processing Mesh...' : 'Click to Upload Model'}</p>
                  </div>
                  <input ref={fileInputRef} type="file" accept=".obj,.stl,.glb" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Log */}
        <div className="p-4 bg-black border-t border-zinc-800 font-mono text-[10px] text-zinc-400 h-24 overflow-y-auto custom-scrollbar">
           <div className="flex justify-between items-center mb-1"><span className="text-zinc-600">KERNEL_LOG:</span>{isPrinting && <span className="text-emerald-500 animate-pulse">BUSY</span>}</div>
           <div className="text-indigo-400 break-words">&gt; {log}</div>
        </div>

      </div>
    </div>
  );
}