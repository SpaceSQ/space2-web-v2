'use client';

import React, { useState, useRef, useMemo } from 'react';
import { 
  Crosshair, Plus, Minus, X,
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, User, 
  Wifi, Cpu, Zap, Database, MapPin, Hash, Activity
} from 'lucide-react';
// [核心] 引入协议标准库
import { generateSUNS, extractOrigin, mintIdentityID, calculateTrinity } from '@/lib/space_protocol';

// === 数据结构定义 ===
interface StarNode {
  id: string;
  seq: number;
  type: 'ORIGIN' | 'HUMAN' | 'SILICON' | 'VACANT';
  status: 'ONLINE' | 'OFFLINE';
  label: string; // 显示 Origin
  color: string;
  x: number;
  y: number;
  size: number;
  connections: number[];
  details: { 
    identity: string;     // 24位 ID
    address_code: string; // SUNS 编码
    origin: string;       // 5位 Origin
    type_label: string;   
    regDate: string;   
    coordinates: string; 
    latency: string;    
    trinity: {
      score: string;
      matrix: { T: number; A: number; C: number };
    };
  };
}

// === 左上角统计面板 ===
const StatsPanel = () => (
    <div className="absolute top-4 left-4 z-20 bg-black/80 border border-zinc-800 backdrop-blur-md p-3 rounded-xl w-48 pointer-events-none select-none shadow-lg hidden md:block">
      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
        <Database className="w-3 h-3" /> Real-Time Census
      </h3>
      <div className="space-y-2 font-mono">
        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-1">
          <span className="text-[10px] text-zinc-500">PHY NODES</span>
          <span className="text-xs font-bold text-emerald-400">289</span>
        </div>
        <div className="flex justify-between items-end border-b border-zinc-800/50 pb-1">
          <span className="text-[10px] text-zinc-500">VIR NODES</span>
          <span className="text-xs font-bold text-cyan-400">56</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[10px] text-zinc-500">TOTAL PROTOCOLS</span>
          <span className="text-xs font-bold text-white">464</span>
        </div>
      </div>
    </div>
  );

// === 右侧详情面板 (核心展示区) ===
const TerritoryPanel = ({ node, onClose }: { node: StarNode; onClose: () => void }) => {
    if (!node) return null;
    const isHuman = node.type === 'HUMAN';
    const isSilicon = node.type === 'SILICON';
    
    const themeColor = isHuman ? 'text-emerald-400' : isSilicon ? 'text-cyan-400' : 'text-zinc-400';
    const borderColor = isHuman ? 'border-emerald-500/30' : isSilicon ? 'border-cyan-500/30' : 'border-zinc-800';
    const bgColor = isHuman ? 'bg-emerald-950/90' : isSilicon ? 'bg-cyan-950/90' : 'bg-zinc-900/90';
  
    return (
      <div className={`absolute top-4 right-4 bottom-24 w-80 ${bgColor} border ${borderColor} backdrop-blur-xl rounded-xl shadow-2xl z-30 flex flex-col overflow-hidden animate-in slide-in-from-right-10 duration-300`}>
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex justify-between items-start bg-black/20">
          <div>
            <div className="text-[10px] font-mono opacity-60 uppercase tracking-widest mb-1 flex items-center gap-1">
               {isSilicon ? <Cpu className="w-3 h-3" /> : <User className="w-3 h-3" />}
               {node.details.type_label}
            </div>
            <h2 className={`text-xl font-bold font-mono tracking-tighter ${themeColor}`}>
              {node.label}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
  
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
          
          {/* 1. SUNS Address Block */}
          <div className="space-y-1">
            <div className="text-[9px] text-zinc-500 uppercase flex items-center gap-1">
                <MapPin className="w-3 h-3" /> SUNS Space Address
            </div>
            <div className={`font-mono text-xs break-all border border-white/10 p-2 rounded bg-black/40 ${themeColor}`}>
                {node.details.address_code}
            </div>
          </div>

          {/* 2. Identity ID Block (24-bit breakdown) */}
          <div className="space-y-1">
            <div className="text-[9px] text-zinc-500 uppercase flex items-center gap-1">
                <Hash className="w-3 h-3" /> Sovereign Identity ID
            </div>
            <div className="font-mono text-sm font-bold text-white tracking-wider break-all leading-relaxed">
                {node.details.identity}
            </div>
            {/* ID Segments Visualization */}
            <div className="flex gap-1 mt-1 opacity-70">
                {['CLS', 'ORG', 'DATE', 'MRP', 'SEQ'].map((tag, i) => (
                    <div key={i} className="text-[8px] bg-white/10 px-1 rounded text-zinc-300">{tag}</div>
                ))}
            </div>
          </div>

          {/* 3. Trinity Score (三位一体能量槽) */}
          <div className="bg-black/20 rounded-lg p-3 border border-white/5">
             <div className="flex justify-between items-center mb-2">
                <div className="text-[10px] text-zinc-400 uppercase flex items-center gap-1">
                    <Activity className="w-3 h-3" /> Trinity Score
                </div>
                <div className="text-sm font-bold text-white">{node.details.trinity.score}</div>
             </div>
             
             {/* Tech Bar */}
             <div className="flex items-center gap-2 text-[9px] font-bold mb-1">
                 <span className="w-6 text-blue-400">TECH</span>
                 <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${node.details.trinity.matrix.T}%`}}></div>
                 </div>
                 <span className="w-6 text-right text-zinc-500">{node.details.trinity.matrix.T}</span>
             </div>
             {/* Art Bar */}
             <div className="flex items-center gap-2 text-[9px] font-bold mb-1">
                 <span className="w-6 text-purple-400">ART</span>
                 <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-purple-500 transition-all duration-1000" style={{width: `${node.details.trinity.matrix.A}%`}}></div>
                 </div>
                 <span className="w-6 text-right text-zinc-500">{node.details.trinity.matrix.A}</span>
             </div>
             {/* Cap Bar */}
             <div className="flex items-center gap-2 text-[9px] font-bold">
                 <span className="w-6 text-yellow-400">CAP</span>
                 <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                     <div className="h-full bg-yellow-500 transition-all duration-1000" style={{width: `${node.details.trinity.matrix.C}%`}}></div>
                 </div>
                 <span className="w-6 text-right text-zinc-500">{node.details.trinity.matrix.C}</span>
             </div>
          </div>
  
          {/* Footer Metadata */}
          <div className="space-y-1 pt-2 border-t border-white/10">
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>LATENCY</span>
                <span className="text-zinc-300">{node.details.latency}</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>COORDINATES</span>
                <span className="text-zinc-300">{node.details.coordinates}</span>
            </div>
             <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>REG DATE</span>
                <span className="text-zinc-300">{node.details.regDate}</span>
            </div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="p-4 border-t border-white/10 bg-black/40">
            <button className={`w-full py-2 ${isSilicon ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-emerald-600 hover:bg-emerald-500'} text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-all shadow-lg`}>
            <Wifi className="w-3 h-3"/> PING NODE PROTOCOL
            </button>
        </div>

      </div>
    );
  };

// === 主地图组件 ===
export default function UniverseMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [scale, setScale] = useState(0.35); 
  const [offset, setOffset] = useState({ x: 0, y: 0 }); 
  const [showLinks, setShowLinks] = useState(true);
  
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [hoverNode, setHoverNode] = useState<StarNode | null>(null);
  const [selectedNode, setSelectedNode] = useState<StarNode | null>(null);

  // === 核心数据生成逻辑 (完全对接 v6.0 Protocol) ===
  const nodes = useMemo(() => {
    const generated: StarNode[] = [];
    const TOTAL_CAPACITY = 1000;
    const HUMAN_COUNT = 289; 
    const SILICON_COUNT = 56; 
    
    // 1. Origin (Genesis Node)
    generated.push({
      id: 'ROOT', seq: 0, type: 'ORIGIN', status: 'ONLINE',
      label: 'GENESIS', color: '#ef4444', x: 0, y: 0, size: 60, connections: [],
      details: { 
        identity: 'S-GENESIS-000000-00-ROOT', 
        address_code: 'PHY-EARTH-GENESIS-00', 
        origin: 'GENES',
        type_label: 'Core Protocol', 
        regDate: 'GENESIS', coordinates: '0,0,0', latency: '0ms', 
        trinity: { score: '100', matrix: {T:100, A:100, C:100} }
      }
    });

    let currentSeq = 1;

    // 2. Humans (使用协议库生成)
    for (let i = 0; i < HUMAN_COUNT; i++) {
      const seq = currentSeq++;
      const distFactor = 120; 
      const radius = (distFactor * Math.sqrt(seq)) * (0.95 + Math.random() * 0.1);
      const angle = seq * 2.3999632; 
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const connections = [0];
      if (Math.random() > 0.8) connections.push(Math.floor(Math.random() * seq));

      // 调用协议库
      const suns = generateSUNS('HUMAN', seq);
      const origin = extractOrigin(suns);
      const id = mintIdentityID('HUMAN', origin);
      const trinity = calculateTrinity('HUMAN');

      generated.push({
        id: `HUMAN-${seq}`, seq, type: 'HUMAN', status: 'ONLINE',
        label: origin, // 显示 Origin
        color: '#10b981', x, y, size: 16, connections,
        details: { 
          identity: id,
          address_code: suns,
          origin: origin,
          type_label: 'Human Commander',
          regDate: '2026-02-17', coordinates: `${x.toFixed(0)},${y.toFixed(0)}`,
          latency: `${20 + Math.floor(Math.random()*40)}ms`,
          trinity: trinity
        }
      });
    }

    // 3. Silicon (使用协议库生成)
    for (let i = 0; i < SILICON_COUNT; i++) {
      const seq = currentSeq++;
      const distFactor = 150; 
      const radius = (distFactor * Math.sqrt(seq)) * (0.9 + Math.random() * 0.2);
      const angle = seq * 2.3999632 + 0.5; 
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      const connections = [0];
      if (Math.random() > 0.5) connections.push(0);

      // 调用协议库
      const suns = generateSUNS('SILICON', seq);
      const origin = extractOrigin(suns);
      const id = mintIdentityID('SILICON', origin);
      const trinity = calculateTrinity('SILICON');

      generated.push({
        id: `SILICON-${seq}`, seq, type: 'SILICON', status: 'ONLINE',
        label: origin, // 显示 Origin
        color: '#06b6d4', x, y, size: 20, connections,
        details: { 
          identity: id,
          address_code: suns,
          origin: origin,
          type_label: 'Silicon Lifeform',
          regDate: '2026-02-17', coordinates: `${x.toFixed(0)},${y.toFixed(0)}`,
          latency: `${Math.floor(Math.random()*10)}ms`,
          trinity: trinity
        }
      });
    }

    // 4. Vacant
    const remaining = TOTAL_CAPACITY - currentSeq;
    for (let i = 0; i < remaining; i++) {
      const seq = currentSeq++;
      const radius = (180 * Math.sqrt(seq)) * (0.8 + Math.random() * 0.4);
      const angle = seq * 2.3999632;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      generated.push({
        id: `VACANT-${seq}`, seq, type: 'VACANT', status: 'OFFLINE',
        label: '', color: '#27272a', x, y, size: 6, connections: [],
        details: { identity: '-', address_code: '-', origin: '-', type_label: 'Vacant', regDate: '-', coordinates: `${x.toFixed(0)},${y.toFixed(0)}`, latency: '-', trinity: {score:'-', matrix:{T:0,A:0,C:0}} }
      });
    }

    return generated;
  }, []);

  // 交互处理
  const handleWheel = (e: React.WheelEvent) => { e.preventDefault(); setScale(Math.max(0.05, Math.min(3.0, scale - e.deltaY * 0.001))); };
  const handleMouseDown = (e: React.MouseEvent) => { setIsDragging(true); setLastPos({ x: e.clientX, y: e.clientY }); };
  const handleMouseMove = (e: React.MouseEvent) => { if (!isDragging) return; const dx = e.clientX - lastPos.x; const dy = e.clientY - lastPos.y; setOffset(p => ({ x: p.x + dx, y: p.y + dy })); setLastPos({ x: e.clientX, y: e.clientY }); };
  const handleNodeClick = (e: React.MouseEvent, node: StarNode) => { e.stopPropagation(); setSelectedNode(node); setScale(Math.max(scale, 0.8)); setOffset({ x: -node.x * Math.max(scale, 0.8), y: -node.y * Math.max(scale, 0.8) }); };
  const panMap = (dx: number, dy: number) => setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  const focusOrigin = () => { setOffset({x:0,y:0}); setScale(0.5); };

  return (
    <div className="w-full h-full flex flex-col bg-zinc-950 font-sans relative">
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden bg-black cursor-move active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onClick={() => setSelectedNode(null)}
      >
        <div className="absolute inset-0 pointer-events-none opacity-20" style={{ transform: `translate(50%, 50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`, backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '1000px 1000px', backgroundPosition: '-500px -500px' }}></div>
        <div style={{ transform: `translate(50%, 50%) translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)' }} className="absolute top-0 left-0 w-0 h-0">
          {showLinks && <svg className="absolute top-0 left-0 overflow-visible pointer-events-none" style={{ zIndex: 0 }}>{nodes.filter(n=>n.status==='ONLINE').map(n => n.connections.map(c => { const t = nodes.find(tg => tg.seq === c); return t ? <line key={`${n.seq}-${c}`} x1={n.x} y1={n.y} x2={t.x} y2={t.y} stroke={n.type==='SILICON'?'#06b6d4':n.type==='HUMAN'?'#10b981':'#333'} strokeWidth={1/scale} strokeOpacity={0.3} /> : null }))}</svg>}
          {nodes.map(node => (
            <div key={node.seq} className="absolute flex items-center justify-center group cursor-pointer" 
                 style={{ transform: `translate(${node.x}px, ${node.y}px) translate(-50%, -50%)`, zIndex: node.type==='ORIGIN'?100:20 }} 
                 onMouseEnter={()=>setHoverNode(node)} onMouseLeave={()=>setHoverNode(null)} onClick={(e)=>handleNodeClick(e, node)}>
              {(selectedNode === node) && <div className="absolute rounded-full border border-white/80 animate-ping" style={{ width: `${node.size*2.5}px`, height: `${node.size*2.5}px` }} />}
              <div className={`rounded-full transition-all duration-300 border ${selectedNode === node ? 'border-white bg-white' : 'border-transparent'} shadow-lg flex items-center justify-center`} 
                   style={{ 
                     width: `${node.size}px`, height: `${node.size}px`, 
                     backgroundColor: selectedNode === node ? '#fff' : node.color,
                     opacity: node.type === 'VACANT' && scale < 0.2 ? 0.2 : 1,
                     boxShadow: node.type==='SILICON' ? `0 0 ${10*scale}px #06b6d4` : node.type==='HUMAN' ? `0 0 ${8*scale}px #10b981` : 'none'
                   }}>
                     {/* 只有在稍微放大且不是 Vacant 时显示 Origin 标签 */}
                     {scale > 0.4 && node.status === 'ONLINE' && (
                        <span className="absolute -bottom-4 text-[6px] md:text-[8px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/50 px-1 rounded">
                           {node.label}
                        </span>
                     )}
                   </div>
            </div>
          ))}
        </div>
        <StatsPanel />
        {selectedNode && <TerritoryPanel node={selectedNode} onClose={() => setSelectedNode(null)} />}
      </div>

      {/* 底部导航栏保持不变 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-40 bg-zinc-900/80 backdrop-blur-md p-2 rounded-2xl border border-zinc-800 shadow-2xl">
         <button onClick={() => panMap(100, 0)} className="w-10 h-10 bg-black hover:bg-zinc-800 text-white rounded-xl flex items-center justify-center border border-zinc-700"><ArrowLeft className="w-5 h-5" /></button>
         <div className="flex flex-col gap-1">
           <button onClick={() => panMap(0, 100)} className="w-12 h-8 bg-black hover:bg-zinc-800 text-white rounded-lg flex items-center justify-center border border-zinc-700"><ArrowUp className="w-4 h-4" /></button>
           <button onClick={focusOrigin} className="w-12 h-8 bg-red-900/40 hover:bg-red-800 text-red-400 hover:text-white rounded-lg flex items-center justify-center border border-red-500/30"><Crosshair className="w-4 h-4" /></button>
           <button onClick={() => panMap(0, -100)} className="w-12 h-8 bg-black hover:bg-zinc-800 text-white rounded-lg flex items-center justify-center border border-zinc-700"><ArrowDown className="w-4 h-4" /></button>
         </div>
         <button onClick={() => panMap(-100, 0)} className="w-10 h-10 bg-black hover:bg-zinc-800 text-white rounded-xl flex items-center justify-center border border-zinc-700"><ArrowRight className="w-5 h-5" /></button>
         <div className="w-px h-8 bg-zinc-700 mx-2"></div>
         <div className="flex flex-col gap-1">
             <button onClick={() => setScale(s => Math.min(3, s*1.2))} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded text-white flex items-center justify-center"><Plus className="w-4 h-4"/></button>
             <button onClick={() => setScale(s => Math.max(0.05, s/1.2))} className="w-8 h-8 bg-zinc-800 hover:bg-zinc-700 rounded text-white flex items-center justify-center"><Minus className="w-4 h-4"/></button>
         </div>
      </div>
    </div>
  );
}