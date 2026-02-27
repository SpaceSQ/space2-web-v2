'use client';

import React, { useState, useEffect } from 'react';
import { 
  Box, Layers, Zap, Wifi, Wind, Droplets, Cpu, 
  Plus, Trash2, Maximize, Settings, Terminal, Activity, 
  Sun, Thermometer, Volume2, Eye, LayoutGrid, CheckCircle // 👈 补上了 CheckCircle
} from 'lucide-react';

// === 数据结构定义 (遵循白皮书) ===

// 1. 五枢 (The Five Pivots) - 容器级接口
type PivotType = 'POWER' | 'NET' | 'AIR' | 'WATER' | 'CORE';
interface Pivot {
  id: string;
  type: PivotType;
  status: 'active' | 'offline';
  load: number; // 负载 %
}

// 2. 六要素 (The Six Elements) - SSSU 级属性
interface Elements {
  L: number; // Light (lux)
  T: number; // Temp (celsius)
  A: number; // Acoustics (db)
  P: number; // Perception (human presence probability)
  H: number; // Humidity (%)
  Q: number; // Air Quality (AQI)
}

// 3. 标准空间单元 (SSSU)
interface SSSU {
  id: string; // Coordinate ID e.g., "2-3"
  x: number;
  y: number;
  name: string; // e.g., "Sofa Zone"
  elements: Elements;
}

// 4. 容器 (Container)
interface Container {
  id: string;
  name: string; // e.g., "Living Room"
  color: string;
  cells: string[]; // List of SSSU IDs contained
  pivots: Pivot[];
}

// === 默认初始数据 ===
const INITIAL_GRID_SIZE = 4; // 4x4 Grid (16 SSSUs)

export default function SpaceTopologyBuilder() {
  // 状态管理
  const [sssus, setSssus] = useState<SSSU[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  
  // 交互状态
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
  const [mode, setMode] = useState<'SELECT' | 'PIVOT' | 'ELEMENT'>('SELECT');
  const [terminalLog, setTerminalLog] = useState<string[]>(['> KERNEL: Space Topology System v2.0 Ready...']);

  // 初始化网格
  useEffect(() => {
    const initGrid = [];
    for (let x = 0; x < INITIAL_GRID_SIZE; x++) {
      for (let y = 0; y < INITIAL_GRID_SIZE; y++) {
        initGrid.push({
          id: `${x}-${y}`, x, y,
          name: 'Unassigned Void',
          elements: { L: 0, T: 20, A: 40, P: 0, H: 50, Q: 98 }
        });
      }
    }
    setSssus(initGrid);
  }, []);

  // === 核心逻辑：创建容器 (圈地) ===
  const createContainer = () => {
    if (selectedCells.length === 0) return;
    
    // 检查选中的格子是否已被占用
    const isOccupied = containers.some(c => c.cells.some(cell => selectedCells.includes(cell)));
    if (isOccupied) {
      addLog('ERROR: Selected space overlaps with existing container.');
      return;
    }

    const newContainer: Container = {
      id: `CONT-${Date.now()}`,
      name: `Container ${containers.length + 1}`,
      color: `hsl(${Math.random() * 360}, 70%, 20%)`, // 随机深色背景
      cells: [...selectedCells],
      pivots: [
        { id: 'P-CORE', type: 'CORE', status: 'active', load: 10 }, // 默认自带智枢
        { id: 'P-PWR', type: 'POWER', status: 'active', load: 0 }   // 默认自带能枢
      ] 
    };

    setContainers([...containers, newContainer]);
    setActiveContainerId(newContainer.id);
    setSelectedCells([]);
    addLog(`SUCCESS: Materialized [${newContainer.name}] with ${newContainer.cells.length} SSSUs.`);
  };

  // === 核心逻辑：添加枢纽 (五枢) ===
  const addPivot = (type: PivotType) => {
    if (!activeContainerId) return;
    setContainers(prev => prev.map(c => {
      if (c.id === activeContainerId) {
        // 检查是否已存在
        if (c.pivots.find(p => p.type === type)) {
          addLog(`INFO: ${type} Pivot already exists in ${c.name}.`);
          return c;
        }
        addLog(`INFRASTRUCTURE: Installed ${type} Pivot to ${c.name}. Interface Open.`);
        return { ...c, pivots: [...c.pivots, { id: `P-${type}-${Date.now()}`, type, status: 'active', load: 0 }] };
      }
      return c;
    }));
  };

  // === 核心逻辑：AI 免协议连接模拟 ===
  const simulateAIConnect = () => {
    if (!activeContainerId) return;
    addLog('AI_AGENT: Scanning local RF spectrum...');
    setTimeout(() => addLog('AI_AGENT: Device Signal Detected [MAC: AA:BB:CC]'), 500);
    setTimeout(() => addLog('AI_AGENT: Identifying device capability -> "Luminous Emitter"'), 1200);
    setTimeout(() => addLog('AI_AGENT: Generating JIT Driver...'), 2000);
    setTimeout(() => {
      addLog('SUCCESS: Device mapped to SSSU Element [L] (Lighting). No Protocol Required.');
      // 模拟增加光照
      updateElement('L', 800); 
    }, 3000);
  };

  // === 辅助逻辑：更新要素 ===
  const updateElement = (key: keyof Elements, value: number) => {
    if (!activeContainerId) return;
    const targetContainer = containers.find(c => c.id === activeContainerId);
    if (!targetContainer) return;

    setSssus(prev => prev.map(s => {
      if (targetContainer.cells.includes(s.id)) {
        return { ...s, elements: { ...s.elements, [key]: value } };
      }
      return s;
    }));
  };

  // 点击格子处理
  const handleCellClick = (id: string) => {
    if (mode === 'SELECT') {
      // 切换选中状态
      if (selectedCells.includes(id)) {
        setSelectedCells(selectedCells.filter(c => c !== id));
      } else {
        setSelectedCells([...selectedCells, id]);
      }
      
      // 如果点击了已存在的容器，激活它
      const owner = containers.find(c => c.cells.includes(id));
      if (owner) setActiveContainerId(owner.id);
      else setActiveContainerId(null);
    }
  };

  const addLog = (msg: string) => {
    setTerminalLog(prev => [`> ${msg}`, ...prev].slice(0, 8));
  };

  // 获取当前激活的容器对象
  const activeContainer = containers.find(c => c.id === activeContainerId);

  return (
    <div className="flex flex-col lg:flex-row h-[800px] gap-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-white font-sans">
      
      {/* === 左侧：2.5D 拓扑视图 === */}
      <div className="flex-1 relative bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-inner group">
        
        {/* 背景网格 */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.05),transparent_70%)]"></div>
        <div className="absolute top-4 left-4 z-10 flex gap-2">
           <div className="px-3 py-1 bg-black/60 border border-zinc-700 rounded text-xs font-mono text-zinc-400">
             GRID: {INITIAL_GRID_SIZE}x{INITIAL_GRID_SIZE} SSSU
           </div>
           <div className="px-3 py-1 bg-black/60 border border-zinc-700 rounded text-xs font-mono text-zinc-400 flex items-center gap-2">
             <Layers className="w-3 h-3" />
             CONTAINERS: {containers.length}
           </div>
        </div>

        {/* Isometric Grid Container */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]">
          {sssus.map((cell) => {
            // Isometric 坐标变换
            const isoX = (cell.x - cell.y) * 40;
            const isoY = (cell.x + cell.y) * 20;
            
            // 样式计算
            const isSelected = selectedCells.includes(cell.id);
            const containerOwner = containers.find(c => c.cells.includes(cell.id));
            const isActive = containerOwner?.id === activeContainerId;

            let bgColor = 'bg-zinc-800';
            let borderColor = 'border-zinc-700';
            let opacity = 'opacity-100';

            if (containerOwner) {
              bgColor = containerOwner.color; // 使用容器颜色
              borderColor = isActive ? 'border-white' : 'border-white/20';
              opacity = isActive ? 'opacity-100' : 'opacity-60';
            }
            if (isSelected) {
              bgColor = 'bg-indigo-600';
              borderColor = 'border-indigo-400';
            }

            return (
              <div
                key={cell.id}
                onClick={() => handleCellClick(cell.id)}
                className={`absolute w-[80px] h-[80px] transition-all duration-300 cursor-pointer hover:-translate-y-1 z-${cell.x + cell.y}`}
                style={{
                  transform: `translate(${isoX}px, ${isoY}px) scaleY(0.5) rotate(45deg)`,
                  backgroundColor: containerOwner ? undefined : undefined, // Tailwind override
                }}
              >
                <div className={`w-full h-full border ${borderColor} ${!containerOwner && !isSelected ? 'bg-zinc-800 hover:bg-zinc-700' : ''} shadow-lg`}
                     style={{ backgroundColor: containerOwner ? undefined : '' }}>
                   {/* 如果有容器，这里用内联样式覆盖背景色，因为它是动态生成的 */}
                   {containerOwner && <div className="absolute inset-0 opacity-80" style={{ backgroundColor: containerOwner.color }}></div>}
                </div>
                
                {/* 选中高亮框 */}
                {isSelected && <div className="absolute inset-0 border-2 border-white animate-pulse"></div>}
              </div>
            );
          })}
        </div>

        {/* 覆盖在顶部的 Pivot 指示器 (简化处理) */}
        {activeContainer && (
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
             {activeContainer.pivots.map(p => (
               <div key={p.id} className="flex items-center gap-2 text-xs font-mono bg-black/80 px-2 py-1 rounded border border-zinc-700">
                 {p.type === 'POWER' && <Zap className="w-3 h-3 text-amber-400" />}
                 {p.type === 'NET' && <Wifi className="w-3 h-3 text-blue-400" />}
                 {p.type === 'AIR' && <Wind className="w-3 h-3 text-cyan-400" />}
                 {p.type === 'WATER' && <Droplets className="w-3 h-3 text-blue-600" />}
                 {p.type === 'CORE' && <Cpu className="w-3 h-3 text-purple-400" />}
                 <span>{p.type}_LINK: ONLINE</span>
               </div>
             ))}
          </div>
        )}
      </div>

      {/* === 右侧：控制台 === */}
      <div className="w-full lg:w-96 flex flex-col gap-4">
        
        {/* 1. 操作面板 */}
        <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex-1 flex flex-col">
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-indigo-500" />
              Topology Manager
            </h2>
            <div className="flex gap-1 bg-black p-1 rounded-lg">
               <button onClick={() => setMode('SELECT')} className={`p-2 rounded ${mode==='SELECT'?'bg-zinc-700 text-white':'text-zinc-500 hover:text-zinc-300'}`} title="Select Space"><Maximize className="w-4 h-4"/></button>
               <button onClick={() => setMode('PIVOT')} className={`p-2 rounded ${mode==='PIVOT'?'bg-zinc-700 text-white':'text-zinc-500 hover:text-zinc-300'}`} title="Manage Pivots"><Settings className="w-4 h-4"/></button>
               <button onClick={() => setMode('ELEMENT')} className={`p-2 rounded ${mode==='ELEMENT'?'bg-zinc-700 text-white':'text-zinc-500 hover:text-zinc-300'}`} title="View Elements"><Activity className="w-4 h-4"/></button>
            </div>
          </div>

          {/* 模式 A: 容器管理 */}
          {mode === 'SELECT' && (
            <div className="space-y-4 animate-in fade-in">
              {activeContainer ? (
                <div className="p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-indigo-300">{activeContainer.name}</h3>
                    <span className="text-xs font-mono text-indigo-400/60">ID: {activeContainer.id.split('-')[1]}</span>
                  </div>
                  <div className="space-y-2 text-xs text-zinc-400">
                    <p>Total Area: {activeContainer.cells.length * 4}m²</p>
                    <p>SSSU Count: {activeContainer.cells.length}</p>
                    <p>Pivot Status: {activeContainer.pivots.length}/5 Active</p>
                  </div>
                  <button 
                    onClick={() => setActiveContainerId(null)}
                    className="mt-4 w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded"
                  >
                    Deselect Container
                  </button>
                </div>
              ) : (
                <div className="text-center p-6 border-2 border-dashed border-zinc-800 rounded-xl text-zinc-500">
                  {selectedCells.length > 0 ? (
                    <div className="space-y-3">
                      <p>{selectedCells.length} SSSU Selected ({selectedCells.length * 4}m²)</p>
                      <button 
                        onClick={createContainer}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded shadow-lg transition-all"
                      >
                        Materialize Container
                      </button>
                    </div>
                  ) : (
                    <p>Select grid cells to define a new Container boundary.</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 模式 B: 五枢管理 */}
          {mode === 'PIVOT' && activeContainer && (
            <div className="space-y-3 animate-in fade-in">
              <p className="text-xs text-zinc-500 uppercase font-bold">Install Infrastructure</p>
              <div className="grid grid-cols-2 gap-2">
                {(['POWER', 'NET', 'AIR', 'WATER', 'CORE'] as PivotType[]).map(type => {
                  const hasPivot = activeContainer.pivots.find(p => p.type === type);
                  return (
                    <button
                      key={type}
                      onClick={() => addPivot(type)}
                      disabled={!!hasPivot}
                      className={`flex items-center gap-2 p-2 rounded text-xs font-mono border transition-all ${
                        hasPivot 
                          ? 'bg-emerald-900/20 border-emerald-500/30 text-emerald-400' 
                          : 'bg-black border-zinc-800 text-zinc-500 hover:border-zinc-600'
                      }`}
                    >
                      {/* 这里是修复点 */}
                      {hasPivot ? <CheckCircle className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      {type}
                    </button>
                  );
                })}
              </div>
              
              <div className="mt-4 pt-4 border-t border-zinc-800">
                <button 
                  onClick={simulateAIConnect}
                  className="w-full py-3 bg-indigo-600/20 border border-indigo-500/50 hover:bg-indigo-600/30 text-indigo-300 text-xs font-bold rounded flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4" /> Simulate AI Protocol-less Connect
                </button>
              </div>
            </div>
          )}

          {/* 模式 C: 六要素监控 */}
          {mode === 'ELEMENT' && activeContainer && (
            <div className="space-y-4 animate-in fade-in">
              <p className="text-xs text-zinc-500 uppercase font-bold">Environmental Data (Avg)</p>
              {/* 这里简化显示第一个SSSU的数据作为示例 */}
              {(() => {
                const sampleSSSU = sssus.find(s => s.id === activeContainer.cells[0]);
                if (!sampleSSSU) return null;
                const e = sampleSSSU.elements;
                return (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2 text-amber-400"><Sun className="w-3 h-3"/> Light (L)</span>
                      <span className="font-mono">{e.L} lux</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full"><div className="h-full bg-amber-400" style={{width: `${Math.min(e.L/10, 100)}%`}}></div></div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2 text-red-400"><Thermometer className="w-3 h-3"/> Temp (T)</span>
                      <span className="font-mono">{e.T}°C</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full"><div className="h-full bg-red-400" style={{width: `${e.T*2}%`}}></div></div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2 text-blue-400"><Volume2 className="w-3 h-3"/> Sound (A)</span>
                      <span className="font-mono">{e.A} dB</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-800 rounded-full"><div className="h-full bg-blue-400" style={{width: `${e.A}%`}}></div></div>
                    
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-2 text-purple-400"><Eye className="w-3 h-3"/> Perception (P)</span>
                      <span className="font-mono">{e.P > 0 ? 'DETECTED' : 'NONE'}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

        </div>

        {/* 2. AI 终端日志 */}
        <div className="h-32 bg-black rounded-xl border border-zinc-800 p-3 font-mono text-[10px] text-zinc-400 overflow-y-auto custom-scrollbar flex flex-col-reverse">
           <div className="animate-pulse text-emerald-500">_</div>
           {terminalLog.map((log, i) => (
             <div key={i} className={`break-all ${log.includes('ERROR') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('AI_AGENT') ? 'text-indigo-400' : ''}`}>
               {log}
             </div>
           ))}
        </div>

      </div>
    </div>
  );
}