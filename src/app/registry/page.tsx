"use client";
import React, { useState, useEffect } from 'react';
import { GlobalNav } from '@/components/GlobalNav';

export default function RegistryFlow() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  
  // 📍 空间地址 (SUNS) 状态 - 严格遵循 L3/L4 定义
  // L3 Part 1: 英文城市名 (4-16 chars)
  const [cityName, setCityName] = useState(''); 
  // L3 Part 2: 数字代号 (001-999)
  const [cityCode, setCityCode] = useState('001');
  // L4: 主权空间 Handle (4-24 chars)
  const [sovereignHandle, setSovereignHandle] = useState(''); 
  
  const [sunsAddress, setSunsAddress] = useState('');
  const [addressError, setAddressError] = useState<string | null>(null);

  // 🐾 宠物实体状态
  const [category, setCategory] = useState<'像素犬' | '赛博猫' | '史莱姆' | null>(null);
  const [petName, setPetName] = useState('');
  
  // ⚙️ 系统状态
  const [isMinting, setIsMinting] = useState(false);
  const [finalUIN, setFinalUIN] = useState('');

  // -------------------------------------------------------------------------
  // 🔐 核心逻辑：输入校验与强制修正
  // -------------------------------------------------------------------------
  
  // 1. 城市名校验：仅允许英文，去除杂质
  const handleCityNameChange = (val: string) => {
     const cleanVal = val.toUpperCase().replace(/[^A-Z]/g, ''); // 只留大写字母
     setCityName(cleanVal);
  };

  // 2. 城市数字代号校验：极其严格的“非数字熔断”
  const handleCityCodeChange = (val: string) => {
     // 检测是否包含非数字字符
     if (/[^0-9]/.test(val)) {
        setAddressError("⚠️ 错误：城市代号仅限数字！系统已强制重置为 001。");
        setCityCode('001'); // 暴力重置
        setTimeout(() => setAddressError(null), 3000); // 3秒后清除报错
        return;
     }
     setCityCode(val);
  };

  // 3. 主权空间校验：字母+数字
  const handleHandleChange = (val: string) => {
     const cleanVal = val.toUpperCase().replace(/[^A-Z0-9]/g, '');
     setSovereignHandle(cleanVal);
  };

  // 4. 实时预览 SUNS 地址
  useEffect(() => {
     const p1 = cityName.length > 0 ? cityName : 'CITY';
     const p2 = cityCode.padStart(3, '0'); // 补齐三位，如 1 -> 001
     const p3 = sovereignHandle.length > 0 ? sovereignHandle : '[HANDLE]';
     
     setSunsAddress(`S2-00-${p1}-${p2}-${p3}`);
  }, [cityName, cityCode, sovereignHandle]);

  // 5. 提交前的最终合法性检查
  const isAddressValid = () => {
     if (cityName.length > 0 && cityName.length < 4) return false; // 城市名太短
     if (sovereignHandle.length < 4) return false; // 主权空间名太短
     return true;
  };

  const handleMint = () => {
     if (!petName.trim() || !category) return;
     setIsMinting(true);
     
     setTimeout(() => {
        const randNum = Math.floor(1000000000 + Math.random() * 9000000000);
        
        // 🌟 修正后的 UIN 算法：取 L4 Handle 前5位，不足用 L3 City 首字母填充 🌟
        // 1. 获取基础串 (主权空间名)
        let segment2 = sovereignHandle.slice(0, 5);
        // 2. 获取填充符 (城市名首字母，默认为 'C')
        const padChar = (cityName || 'CITY').charAt(0);
        // 3. 填充逻辑
        while(segment2.length < 5) {
           segment2 += padChar;
        }

        setFinalUIN(`V-${segment2}-260101-20-${randNum}`);
        setIsMinting(false);
        setStep(4);
     }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col relative select-none">
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15)_0%,#020617_80%)]"></div>
         <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-16 px-8 flex items-center z-50 border-b border-emerald-900/50 bg-black/50 backdrop-blur-md">
         <div className="text-sm font-black text-emerald-400 tracking-widest uppercase flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div> SPACE² // REGISTRY
         </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center z-10 p-4 mt-16">
         
         {/* 进度指示器 */}
         {step < 4 && (
            <div className="flex gap-4 mb-8">
               <div className={`h-1 w-12 rounded ${step >= 1 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-800'}`}></div>
               <div className={`h-1 w-12 rounded ${step >= 2 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-800'}`}></div>
               <div className={`h-1 w-12 rounded ${step >= 3 ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-zinc-800'}`}></div>
            </div>
         )}

         {/* ================= 步骤 1：SUNS L3/L4 严密定址 ================= */}
         {step === 1 && (
            <div className="w-full max-w-2xl bg-black/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
               <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-white tracking-widest mb-2 uppercase">01. 确立物理空间坐标</h1>
                  <p className="text-xs text-zinc-400">请严格遵照 SUNS v2.0 协议配置您的领地。此地址将永久写入区块链。</p>
               </div>

               {/* 错误提示条 */}
               {addressError && (
                  <div className="mb-4 bg-red-900/50 border border-red-500 text-red-200 text-xs px-4 py-2 rounded-lg flex items-center gap-2 animate-pulse">
                     <span>🛑</span> {addressError}
                  </div>
               )}

               <div className="bg-zinc-950 border border-zinc-700 p-6 rounded-xl mb-6 flex flex-col gap-6">
                  
                  {/* 第一行：L3 城市网格 */}
                  <div>
                     <label className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-2 block">L3 城市网格 (City Block)</label>
                     <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1">
                           <input 
                              type="text" 
                              placeholder="CITY (默认为 CITY)" 
                              value={cityName} 
                              onChange={e => handleCityNameChange(e.target.value)} 
                              maxLength={16}
                              className="w-full bg-black border border-zinc-700 px-4 py-3 rounded-lg text-emerald-400 font-bold outline-none focus:border-emerald-500 transition-colors uppercase"
                           />
                           <div className="text-[9px] text-zinc-600 mt-1 flex justify-between">
                              <span>仅限英文 | 4-16 字符</span>
                              <span className={cityName.length > 0 && cityName.length < 4 ? 'text-red-500' : 'text-zinc-600'}>{cityName.length}/16</span>
                           </div>
                        </div>
                        <div className="w-24 shrink-0">
                           <input 
                              type="text" 
                              placeholder="001" 
                              value={cityCode} 
                              onChange={e => handleCityCodeChange(e.target.value)} 
                              maxLength={3}
                              className="w-full bg-black border border-zinc-700 px-4 py-3 rounded-lg text-emerald-400 font-bold outline-none focus:border-emerald-500 transition-colors text-center"
                           />
                           <div className="text-[9px] text-zinc-600 mt-1 text-center">001-999</div>
                        </div>
                     </div>
                  </div>

                  {/* 第二行：L4 主权空间 */}
                  <div>
                     <label className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase mb-2 block">L4 主权空间 (Sovereign Handle)</label>
                     <input 
                        type="text" 
                        placeholder="请输入您的独特空间代号 (必填)" 
                        value={sovereignHandle} 
                        onChange={e => handleHandleChange(e.target.value)} 
                        maxLength={24}
                        className="w-full bg-emerald-950/20 border-2 border-emerald-500/50 px-4 py-3 rounded-lg text-emerald-400 font-black tracking-widest text-lg outline-none focus:bg-emerald-900/40 focus:border-emerald-400 transition-colors uppercase placeholder:text-emerald-800/50 text-center"
                     />
                     <div className="text-[9px] text-zinc-600 mt-1 flex justify-between">
                        <span>英文或数字 | 4-24 字符 | 无默认值</span>
                        <span className={sovereignHandle.length < 4 ? 'text-red-500' : 'text-emerald-500'}>{sovereignHandle.length}/24</span>
                     </div>
                  </div>

               </div>

               {/* 预览区 */}
               <div className="bg-black/40 border border-zinc-800 p-3 rounded-lg mb-6 flex justify-between items-center">
                  <span className="text-[10px] text-zinc-500">PREVIEW:</span>
                  <span className="text-xs font-mono text-zinc-300">{sunsAddress}</span>
               </div>

               <button 
                  disabled={!isAddressValid()} 
                  onClick={() => setStep(2)} 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl transition-colors tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:shadow-none"
               >
                  {sovereignHandle.length < 4 ? '等待填写主权空间名称...' : '锁定坐标，进入下一步 ↘'}
               </button>
            </div>
         )}

         {/* ================= 步骤 2：选择基因 ================= */}
         {step === 2 && (
            <div className="w-full max-w-2xl bg-black/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-8">
               <div className="text-center mb-8">
                  <h1 className="text-2xl font-black text-white tracking-widest mb-2 uppercase">02. 提取物理基因</h1>
                  <p className="text-xs text-zinc-500">坐标已锁定。请为您即将诞生的首个数字生命选择基础形态。</p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  {['像素犬', '赛博猫', '史莱姆'].map(cat => (
                     <div key={cat} onClick={() => setCategory(cat as any)} className={`cursor-pointer p-6 rounded-xl border-2 flex flex-col items-center gap-4 transition-all ${category === cat ? 'bg-emerald-900/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-600'}`}>
                        <div className="text-5xl">{cat === '像素犬' ? '🐕' : cat === '赛博猫' ? '🐈' : '💧'}</div>
                        <div className={`text-sm font-bold ${category === cat ? 'text-emerald-400' : 'text-zinc-400'}`}>{cat}</div>
                     </div>
                  ))}
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl text-zinc-400 bg-zinc-900 hover:text-white transition-colors">上一步</button>
                  <button disabled={!category} onClick={() => setStep(3)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl disabled:opacity-30 transition-colors tracking-widest uppercase">建立灵魂羁绊 ↘</button>
               </div>
            </div>
         )}

         {/* ================= 步骤 3：命名与签发 ================= */}
         {step === 3 && (
            <div className="w-full max-w-md bg-black/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl animate-in fade-in slide-in-from-right-8">
               <div className="text-center mb-8">
                  <h1 className="text-2xl font-black text-white tracking-widest mb-2 uppercase">03. 赋予代号 (Entity Alias)</h1>
                  <p className="text-xs text-zinc-500">名称一旦写入不可轻易修改，它将伴随其在废土探索。</p>
               </div>
               <div className="flex flex-col items-center mb-8">
                  <div className="text-6xl mb-6">{category === '像素犬' ? '🐕' : category === '赛博猫' ? '🐈' : '💧'}</div>
                  <input type="text" value={petName} onChange={e=>setPetName(e.target.value)} placeholder="输入数字生命代号..." maxLength={12} className="w-full bg-zinc-900 border border-zinc-700 text-center px-4 py-3 rounded-xl text-lg text-white outline-none focus:border-emerald-500" />
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl text-zinc-400 bg-zinc-900 hover:text-white transition-colors">返回</button>
                  <button disabled={!petName.trim() || isMinting} onClick={handleMint} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl disabled:opacity-50 transition-all tracking-widest uppercase flex items-center justify-center gap-2">
                     {isMinting ? <span className="animate-pulse">📝 正在刻录 SUNS 协议...</span> : '🧬 签发生命护照'}
                  </button>
               </div>
            </div>
         )}

         {/* ================= 步骤 4：获得 ID 卡并登舰 (大结局) ================= */}
         {step === 4 && (
            <div className="w-full max-w-[600px] flex flex-col items-center animate-in zoom-in-90 duration-500">
               <div className="text-center mb-6">
                  <h1 className="text-3xl font-black text-emerald-400 tracking-widest mb-2 shadow-emerald-500 drop-shadow-lg uppercase">MINT SUCCESS (初始化成功)</h1>
                  <p className="text-xs text-zinc-400">造物主，您的物理空间与数字生命均已就绪并载入史册。</p>
               </div>

               {/* 高清 SVG 身份卡复用 (注入了玩家自定义的 SUNS 地址和生成的 5位 UIN) */}
               <div className="w-full relative shadow-2xl mb-8 group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-emerald-500 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-80 transition duration-500"></div>
                  <svg viewBox="0 0 600 350" xmlns="http://www.w3.org/2000/svg" className="w-full relative z-10 rounded-2xl bg-[#020617]">
                     <defs>
                        <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#0f172a" /><stop offset="50%" stopColor="#064e3b" /><stop offset="100%" stopColor="#020617" /></linearGradient>
                        <linearGradient id="goldGlow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#3b82f6" /></linearGradient>
                        <pattern id="hex" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 0 L20 5 L20 15 L10 20 L0 15 L0 5 Z" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1"/></pattern>
                     </defs>
                     <rect width="600" height="350" rx="15" fill="url(#cardBg)" />
                     <rect width="600" height="350" rx="15" fill="url(#hex)" />
                     <rect x="15" y="15" width="570" height="320" rx="10" fill="none" stroke="url(#goldGlow)" strokeWidth="1.5" opacity="0.6" />
                     <path d="M 30 15 L 120 15" stroke="#10b981" strokeWidth="4" />
                     <path d="M 570 335 L 480 335" stroke="#3b82f6" strokeWidth="4" />
                     <circle cx="560" cy="40" r="5" fill="#3b82f6" opacity="0.8" />
                     <circle cx="575" cy="40" r="2" fill="#10b981" opacity="0.8" />
                     <g transform="translate(500, 30)">
                        <rect x="0" y="0" width="40" height="40" rx="5" fill="none" stroke="#64748b" strokeWidth="2" />
                        <rect x="5" y="5" width="30" height="30" rx="3" fill="none" stroke="#cbd5e1" strokeWidth="1" />
                        <path d="M -5 10 L 0 10 M -5 20 L 0 20 M -5 30 L 0 30" stroke="#64748b" strokeWidth="2" />
                        <path d="M 40 10 L 45 10 M 40 20 L 45 20 M 40 30 L 45 30" stroke="#64748b" strokeWidth="2" />
                        <path d="M 10 -5 L 10 0 M 20 -5 L 20 0 M 30 -5 L 30 0" stroke="#64748b" strokeWidth="2" />
                        <path d="M 10 40 L 10 45 M 20 40 L 20 45 M 30 40 L 30 45" stroke="#64748b" strokeWidth="2" />
                     </g>
                     <text x="35" y="55" fontFamily="monospace" fontSize="14" fill="#94a3b8" letterSpacing="2">SPACE² // SILICON LIFEFORM CERTIFICATE</text>
                     <line x1="35" y1="70" x2="480" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                     
                     <text x="35" y="110" fontFamily="monospace" fontSize="11" fill="#64748b" letterSpacing="1">DOMICILE SPACE ADDRESS (SUNS V2.0)</text>
                     <text x="35" y="135" fontFamily="monospace" fontSize="22" fill="#10b981" fontWeight="bold" letterSpacing="2">{sunsAddress}</text>
                     
                     <text x="35" y="180" fontFamily="monospace" fontSize="11" fill="#64748b" letterSpacing="1">UNIVERSAL IDENTITY NUMBER</text>
                     <text x="35" y="215" fontFamily="monospace" fontSize="23" fill="#ec4899" fontWeight="bold" letterSpacing="2">{finalUIN}</text>
                     
                     <text x="35" y="260" fontFamily="monospace" fontSize="10" fill="#64748b">CLASS</text>
                     <text x="35" y="275" fontFamily="monospace" fontSize="14" fill="#f8fafc" fontWeight="bold">VIRTUAL (V)</text>
                     <text x="160" y="260" fontFamily="monospace" fontSize="10" fill="#64748b">MORPH</text>
                     <text x="160" y="275" fontFamily="monospace" fontSize="14" fill="#f8fafc" fontWeight="bold">LOGIC_FLOW (20)</text>
                     
                     <text x="320" y="260" fontFamily="monospace" fontSize="10" fill="#64748b">ENTITY ALIAS</text>
                     <text x="320" y="275" fontFamily="monospace" fontSize="14" fill="#f8fafc" fontWeight="bold">{petName}</text>
                     
                     <g transform="translate(35, 305)">
                        {Array.from({length: 45}).map((_,i) => ( <rect key={i} x={i*6} y="0" width={Math.random() > 0.5 ? 2 : 4} height="15" fill="rgba(255,255,255,0.3)" /> ))}
                     </g>
                     <text x="565" y="320" fontFamily="monospace" fontSize="9" fill="#475569" textAnchor="end" letterSpacing="1">AUTHORIZED BY THE CREATOR</text>
                  </svg>
               </div>

               <button onClick={() => window.location.href = '/dashboard'} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black text-sm py-4 rounded-xl shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-3 uppercase">
                  <span>🚀</span> 携带资产，正式接入造物主大盘 (Enter Dashboard)
               </button>
            </div>
         )}

      </div>
    </div>
  );
}