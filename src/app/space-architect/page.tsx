"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =====================================================================
// 📦 S2.ASSET_LIB: 核心 SVG 蓝图家具符号库
// 未单独绘制的设备，将自动降级使用 GENERIC 占位符
// =====================================================================
const SVGSymbols: Record<string, (w: number, h: number, label?: string) => React.ReactNode> = {
  SOFA: (w, h) => (
    <g><rect width={w} height={h} fill="#1e3a8a" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="1" rx="2" /><text x={w/2} y={h/2+1} fontSize="3" fill="#93c5fd" textAnchor="middle" dominantBaseline="middle" className="font-mono">SOFA</text></g>
  ),
  PLANT: (w, h) => (
    <g><circle cx={w/2} cy={h/2} r={w/2-1} fill="#064e3b" fillOpacity="0.3" stroke="#10b981" strokeWidth="1" /><text x={w/2} y={h/2+4} fontSize="2.5" fill="#6ee7b7" textAnchor="middle" className="font-mono">PLANT</text></g>
  ),
  AQUARIUM: (w, h) => (
    <g><rect width={w} height={h} fill="#083344" fillOpacity="0.4" stroke="#06b6d4" strokeWidth="1" /><text x={w/2} y={h/2+1} fontSize="3" fill="#67e8f9" textAnchor="middle" dominantBaseline="middle" className="font-mono">AQUA</text></g>
  ),
  CAT_TREE: (w, h) => (
    <g><rect width={w} height={h} fill="#451a03" fillOpacity="0.3" stroke="#d97706" strokeWidth="1" /><text x={w/2} y={h/2+1} fontSize="2.5" fill="#fcd34d" textAnchor="middle" dominantBaseline="middle" className="font-mono">TOWER</text></g>
  ),
  TV_SYSTEM: (w, h) => (
    <g><rect width={w} height={h} fill="#18181b" fillOpacity="0.6" stroke="#a1a1aa" strokeWidth="1" /><rect x="2" y={h/2 - 1} width={w-4} height="2" fill="#3f3f46" /><text x={w/2} y={h/2+3} fontSize="2.5" fill="#d4d4d8" textAnchor="middle" className="font-mono">THEATER</text></g>
  ),
  TEA_TABLE: (w, h) => (
    <g><circle cx={w/2} cy={h/2} r={w/2 - 2} fill="#78350f" fillOpacity="0.4" stroke="#d97706" strokeWidth="1" /><text x={w/2} y={h/2+4} fontSize="2" fill="#fcd34d" textAnchor="middle" className="font-mono">TEA_AREA</text></g>
  ),
  BED: (w, h) => (
    <g><rect width={w} height={h} fill="#312e81" fillOpacity="0.3" stroke="#6366f1" strokeWidth="1" rx="1" /><rect x="2" y="2" width={w-4} height={h/4} fill="#4338ca" opacity="0.5" rx="1"/><text x={w/2} y={h/2+2} fontSize="3" fill="#a5b4fc" textAnchor="middle" className="font-mono">BED</text></g>
  ),
  SMART_HUB: (w, h) => (
    <g><circle cx={w/2} cy={h/2} r={w/2-1} fill="#4c1d95" fillOpacity="0.4" stroke="#8b5cf6" strokeWidth="1" className="animate-pulse" /><text x={w/2} y={h/2+4} fontSize="2" fill="#a78bfa" textAnchor="middle" className="font-mono">HUB</text></g>
  ),
  SUPPLY: (w, h) => (
    <g><rect width={w} height={h} fill="#3f3f46" fillOpacity="0.5" stroke="#a1a1aa" strokeWidth="1" rx="1" /><text x={w/2} y={h/2+4} fontSize="2" fill="#d4d4d8" textAnchor="middle" className="font-mono">SUPPLY</text></g>
  ),
  // 🔥 终极降级方案：只要数据库里有的词，画不出具体图案就用通用方块占位！ 🔥
  GENERIC: (w, h, label) => (
    <g><rect width={w} height={h} fill="#27272a" fillOpacity="0.6" stroke="#52525b" strokeWidth="0.5" strokeDasharray="2,2"/><text x={w/2} y={h/2+1} fontSize="2.5" fill="#a1a1aa" textAnchor="middle" dominantBaseline="middle" className="font-mono">{label?.substring(0,8)}</text></g>
  )
};

// =====================================================================
// 🚀 空间建筑师主界面
// =====================================================================
export default function SpaceArchitect() {
  const [email, setEmail] = useState('');
  const [sunsList, setSunsList] = useState<any[]>([]);
  const [activeSuns, setActiveSuns] = useState<any>(null);

  // 状态：用于存储从数据库加载的真实字典
  const [semanticDict, setSemanticDict] = useState<any[]>([]);

  const [spaceName, setSpaceName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [lastPrompt, setLastPrompt] = useState(''); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [blueprints, setBlueprints] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [smartConfig, setSmartConfig] = useState('');
  const [accessRules, setAccessRules] = useState('DEFAULT_OPEN');

  useEffect(() => {
    const initData = async () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (!storedEmail) return window.location.href = '/login';
      setEmail(storedEmail);
      
      // 1. 获取空间数据
      const { data: sunsData } = await supabase.from('suns_registry_v1').select('*').eq('owner_email', storedEmail);
      if (sunsData && sunsData.length > 0) {
        setSunsList(sunsData);
        setActiveSuns(sunsData[0]);
        if (sunsData[0].space_name) setSpaceName(sunsData[0].space_name);
        if (sunsData[0].space_description) setPrompt(sunsData[0].space_description);
      }

      // 2. ⚡ 核心挂载：从数据库拉取全宇宙家具语义字典 ⚡
      const { data: dictData } = await supabase.from('s2_semantic_dictionary').select('*');
      if (dictData) {
        setSemanticDict(dictData);
      }
    };
    initData();
  }, []);

  // --- S2.NLP_PARSER: 基于数据库的动态语义解析引擎 ---
  const parseNaturalLanguage = (text: string) => {
    const p = text.toLowerCase();
    const extractedAssets: { type: string, w: number, h: number, count: number, label: string }[] = [];
    const cnNum: Record<string, number> = { '一':1,'两':2,'二':2,'三':3,'四':4,'五':5,'六':6,'七':7,'八':8,'九':9,'十':10 };

    // 遍历数据库加载的字典
    semanticDict.forEach(item => {
      let found = false;
      let count = 1; 
      
      const keywordsArray = item.keywords || [];
      for (const key of keywordsArray) {
        if (p.includes(key)) {
          found = true;
          // 向前追溯 6 个字符，正则提取数量词
          const index = p.indexOf(key);
          const prefix = p.substring(Math.max(0, index - 6), index);
          const match = prefix.match(/([一两二三四五六七八九十0-9]+)\s*(个|张|台|盆|套|把|扇|扇门)?/);
          if (match && match[1]) {
            const numStr = match[1];
            count = cnNum[numStr] !== undefined ? cnNum[numStr] : parseInt(numStr);
          }
          break; 
        }
      }

      if (found) {
        extractedAssets.push({ 
          type: item.en_key, 
          w: item.default_w, 
          h: item.default_h, 
          count: isNaN(count) ? 1 : count, 
          label: item.en_key 
        });
      }
    });

    // 强制压入维持生命的基础设施 (中枢与补给)
    extractedAssets.push({ type: 'SUPPLY', w: 12, h: 8, count: 1, label: 'SUPPLY' });
    extractedAssets.push({ type: 'SMART_HUB', w: 10, h: 10, count: 1, label: 'HUB' });

    return extractedAssets;
  };

  // --- S2.GRID_ENGINE: 碰撞检测网格排布算法 ---
  const generateSmartBlueprints = (text: string) => {
    const layouts = [];
    const assetQueue = parseNaturalLanguage(text);

    for (let layoutIdx = 0; layoutIdx < 3; layoutIdx++) {
      const placedItems: any[] = [];
      const gridSize = 100; 
      const padding = 5; 
      
      // ⚠️ 划定标准空间的绝对坐标 (中央 4m² 区域 = 20x20 单位) ⚠️
      const standardZone = { x: 40, y: 40, w: 20, h: 20 };

      const checkCollision = (x: number, y: number, w: number, h: number) => {
        // 家具不可互相重叠
        for (const item of placedItems) {
          if (x < item.x + item.w + 2 && x + w + 2 > item.x &&
              y < item.y + item.h + 2 && y + h + 2 > item.y) {
            return true; 
          }
        }
        // 为了美观，大型家具尽量不压在中央的“标准空间核心区”上
        if (w > 10 && h > 10) {
           if (x < standardZone.x + standardZone.w && x + w > standardZone.x &&
               y < standardZone.y + standardZone.h && y + h > standardZone.y) {
             return true; 
           }
        }
        return false;
      };

      assetQueue.forEach(asset => {
        for (let i = 0; i < asset.count; i++) {
          let placed = false;
          let attempts = 0;
          while (!placed && attempts < 150) { 
            const rx = padding + Math.floor(Math.random() * (gridSize - padding * 2 - asset.w));
            const ry = padding + Math.floor(Math.random() * (gridSize - padding * 2 - asset.h));
            
            if (!checkCollision(rx, ry, asset.w, asset.h)) {
              placedItems.push({ id: `${asset.type}_${i}_${Math.random().toString(36).substr(2,4)}`, type: asset.type, x: rx, y: ry, w: asset.w, h: asset.h, label: asset.label });
              placed = true;
            }
            attempts++;
          }
        }
      });

      placedItems.push({ type: 'WALL', isStatic: true });
      placedItems.push({ type: 'DOOR', x: 40, y: 2, w: 20, h: 3, isStatic: true }); 
      layouts.push(placedItems);
    }
    return layouts;
  };

  const handleGenerate = () => {
    if (!prompt.trim()) return alert("请输入空间描述");
    if (prompt === lastPrompt && blueprints.length > 0) {
      return alert("⚠️ 限制算力消耗：必须修改描述内容才能重新生成新平面图。");
    }
    if (semanticDict.length === 0) {
      return alert("正在同步全宇宙语义字典，请稍候再试...");
    }
    
    setIsGenerating(true);
    setSelectedIndex(null);
    setBlueprints([]);
    
    setTimeout(() => {
      const results = generateSmartBlueprints(prompt);
      setBlueprints(results);
      setLastPrompt(prompt);
      setIsGenerating(false);
    }, 1200); 
  };

  const handleDeploy = async () => {
    if (selectedIndex === null) return alert("请先选择一张满意的平面布局图");
    const floorplanData = blueprints[selectedIndex];
    
    await supabase.from('suns_registry_v1').update({
      space_name: spaceName,
      space_description: prompt,
      floorplan_data: floorplanData,
      smart_home_config: { description: smartConfig, access_rules: accessRules }
    }).eq('id', activeSuns.id);

    alert("✅ 空间蓝图与六要素物理坐标已成功烙印至 L4 锚点！");
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col">
      <header className="h-14 border-b border-blue-900 bg-blue-950/20 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-4">
           <span className="text-blue-500 font-bold italic tracking-tighter text-lg">S2.ARCHITECT // 空间拓扑生成器</span>
           <span className="text-[9px] bg-blue-900/40 text-blue-400 px-2 py-0.5 border border-blue-800 rounded-sm ml-2">Dict Nodes: {semanticDict.length}</span>
        </div>
        <button onClick={() => window.location.href='/dashboard'} className="text-[10px] text-zinc-400 hover:text-white uppercase tracking-widest font-bold border border-zinc-800 px-4 py-1.5">&lt; Commander</button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row p-6 gap-6">
        
        {/* 左侧：NLP 提示词输入台 */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <div className="border border-zinc-800 bg-zinc-950 p-5 shadow-[0_0_20px_rgba(59,130,246,0.05)]">
             <h3 className="text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-blue-500 animate-pulse"></span> 1. Semantic Topology Engine
             </h3>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-[9px] text-zinc-500 uppercase mb-1">Target Anchor</label>
                 <select className="w-full bg-black border border-zinc-800 p-2 text-xs text-blue-400 outline-none">
                   {sunsList.map(s => <option key={s.id} value={s.id}>{s.full_suns_code} ({s.total_area} m²)</option>)}
                 </select>
               </div>
               
               <div>
                 <label className="block text-[9px] text-zinc-500 uppercase mb-1">Space Name (容器命名)</label>
                 <input type="text" value={spaceName} onChange={e=>setSpaceName(e.target.value)} placeholder="例如：中式禅意客厅" className="w-full bg-black border border-zinc-800 focus:border-blue-500 p-2 text-xs outline-none" />
               </div>

               <div>
                 <label className="block text-[9px] text-zinc-500 uppercase mb-1">Description (基于数据库语义字典)</label>
                 <textarea 
                   value={prompt} onChange={e=>setPrompt(e.target.value)} rows={6}
                   placeholder="请使用字典词汇，例如：一个中式客厅，有一台电视机，一个洗碗机，一个智能猫砂盆，两张床，多盆植物..." 
                   className="w-full bg-black border border-zinc-800 focus:border-blue-500 p-2 text-xs outline-none custom-scrollbar"
                 />
                 <p className="text-[8px] text-zinc-600 mt-1 italic">* NLP 引擎将动态连接数据库拉取全量物理资产数据。</p>
               </div>

               <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-blue-900/30 hover:bg-blue-600 border border-blue-900 text-blue-400 hover:text-white py-3 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50">
                 {isGenerating ? 'Synthesizing Coordinates...' : 'Generate Vector Blueprints'}
               </button>
             </div>
          </div>

          <div className={`border border-zinc-800 bg-zinc-950 p-5 transition-all ${selectedIndex !== null ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
             <h3 className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
               <span className="w-2 h-2 bg-emerald-500"></span> 2. Smart Elements & Access
             </h3>
             <div className="space-y-4">
               <div>
                 <label className="block text-[9px] text-zinc-500 uppercase mb-1">Six Elements (智慧六要素部署)</label>
                 <textarea 
                   value={smartConfig} onChange={e=>setSmartConfig(e.target.value)} rows={3}
                   placeholder="全屋智能部署，模拟森林大自然的智慧场景..." 
                   className="w-full bg-black border border-zinc-800 focus:border-emerald-500 p-2 text-xs outline-none"
                 />
               </div>
               <div>
                 <label className="block text-[9px] text-zinc-500 uppercase mb-1">Access Protocol (门禁权限)</label>
                 <select value={accessRules} onChange={e=>setAccessRules(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-xs text-white outline-none">
                   <option value="DEFAULT_OPEN">Default Open (双向自由通行)</option>
                   <option value="SENSOR_AUTO">Sensor Auto (感应宠物经过自动打开)</option>
                   <option value="RESTRICTED_LIST">Restricted List (仅指定宠物白名单通行)</option>
                   <option value="TIME_LOCKED">Time Locked (定时开启/夜间锁定)</option>
                 </select>
               </div>
               <button onClick={handleDeploy} className="w-full bg-emerald-600 hover:bg-emerald-500 text-black py-3 text-[11px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                 Confirm & Deploy Space
               </button>
             </div>
          </div>
        </div>

        {/* 右侧：矢量渲染图纸展示区 */}
        <div className="md:w-2/3 border border-zinc-800 bg-[#050505] relative overflow-hidden flex flex-col">
           <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
           
           <div className="p-4 border-b border-zinc-900 z-10 bg-black/50 backdrop-blur-sm flex justify-between items-center">
             <span className="text-[10px] text-zinc-400 uppercase tracking-widest">Vector Coordinates Array ({blueprints.length}/3)</span>
             {isGenerating && <span className="text-blue-500 text-xs animate-pulse font-bold">COMPUTING COLLISIONS...</span>}
           </div>

           <div className="flex-1 p-6 flex items-center justify-center">
             {blueprints.length === 0 && !isGenerating ? (
               <div className="text-zinc-600 text-sm tracking-widest uppercase text-center">
                 Awaiting DB Semantic Assembly...<br/>
                 <span className="text-[10px] opacity-50 mt-2 block">Powered by S2.NLP & Grid_Engine</span>
               </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full z-10">
                 {blueprints.map((bp, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setSelectedIndex(idx)}
                     className={`cursor-pointer transition-all duration-300 relative group aspect-square border-2 ${selectedIndex === idx ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-105' : 'border-zinc-800 hover:border-zinc-500'}`}
                   >
                     {/* 引擎将解析出的数据阵列渲染成 SVG */}
                     <svg viewBox="0 0 100 100" className="w-full h-full bg-[#020817] p-2">
                       <pattern id={`grid_${idx}`} width="10" height="10" patternUnits="userSpaceOnUse">
                         <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e3a8a" strokeWidth="0.2" opacity="0.5"/>
                       </pattern>
                       <rect width="100" height="100" fill={`url(#grid_${idx})`} />

                       {/* 🔥 核心视觉法则：渲染标准空间的光环视界 (Halo Grid) 🔥 */}
                       <rect x="40" y="40" width="20" height="20" fill="rgba(16,185,129,0.05)" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />
                       <text x="50" y="50" fontSize="2" fill="#10b981" opacity="0.5" textAnchor="middle" className="font-mono tracking-widest">STANDARD_ZONE</text>

                       {bp.map((item: any, j: number) => {
                         if (item.type === 'WALL') return <path key={j} d="M2,2 L98,2 L98,98 L2,98 Z" fill="none" stroke="#3b82f6" strokeWidth="1" />;
                         if (item.type === 'DOOR') return <rect key={j} x={item.x} y={item.y} width={item.w} height={item.h} fill="#60a5fa" className="animate-pulse" />;
                         
                         // 智能挂载：如果有对应的画笔就画，没有就强制降级使用 GENERIC 占位！
                         const Renderer = SVGSymbols[item.type] || SVGSymbols.GENERIC;
                         
                         return (
                           <g key={j} transform={`translate(${item.x}, ${item.y})`}>
                             {Renderer(item.w, item.h, item.label)}
                           </g>
                         );
                       })}
                     </svg>
                     <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 text-[8px] text-blue-400 font-bold border border-blue-900/50">TOPOLOGY 0{idx + 1}</div>
                     {selectedIndex === idx && <div className="absolute bottom-2 right-2 bg-blue-500 text-black px-2 py-1 text-[8px] font-black uppercase">SELECTED</div>}
                   </div>
                 ))}
               </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}