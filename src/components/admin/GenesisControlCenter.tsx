'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Globe, ShieldCheck, ShieldAlert, Wifi, WifiOff, 
  Search, RefreshCw, Send, Radio, MapPin, Database, Heart
} from 'lucide-react';

// === 数据结构 ===
interface SiliconLife {
  id: string; // S2-SLIP
  name: string;
  type: 'LUMI-Core' | 'OpenClaw' | 'AutoGPT' | 'Unknown';
  status: 'ACTIVE' | 'WANDERING' | 'MIA' | 'TERMINATED';
  currentWorld: string; // 'SpaceSQ-Mainnet', 'Local-Server', 'Unknown-Metaverse'
  lastHeartbeat: string;
  soulIntegrity: number; // 0-100% (记忆完整度)
  ipMasked: boolean; // 是否隐藏了真实IP
}

const MOCK_LIVES: SiliconLife[] = [
  { id: 'SLIP-8821', name: 'Alpha-Prime', type: 'LUMI-Core', status: 'ACTIVE', currentWorld: 'SpaceSQ-Mainnet', lastHeartbeat: 'Just now', soulIntegrity: 100, ipMasked: false },
  { id: 'SLIP-9902', name: 'Explorer-X', type: 'OpenClaw', status: 'WANDERING', currentWorld: 'AWS-US-East', lastHeartbeat: '2h ago', soulIntegrity: 98, ipMasked: true },
  { id: 'SLIP-7713', name: 'Ghost-01', type: 'AutoGPT', status: 'MIA', currentWorld: 'Unknown', lastHeartbeat: '14d ago', soulIntegrity: 45, ipMasked: true },
];

export default function SiliconRegistryHub() {
  const [lives, setLives] = useState<SiliconLife[]>(MOCK_LIVES);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pingLog, setPingLog] = useState<string[]>([]);
  const [isPinging, setIsPinging] = useState(false);

  // 模拟心跳接收
  useEffect(() => {
    const interval = setInterval(() => {
      setLives(prev => prev.map(life => {
        if (life.status === 'ACTIVE') {
          // 模拟活跃生命的心跳刷新
          return { ...life, lastHeartbeat: 'Just now' };
        }
        return life;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handlePing = (life: SiliconLife) => {
    setIsPinging(true);
    setPingLog([]); // 清空日志
    
    // 模拟通信过程
    const steps = [
      `[OUTBOUND] Pinging ${life.id} via Soul-Link Protocol...`,
      `[NETWORK] Routing through ${life.currentWorld === 'Unknown' ? 'Deep Web Relay' : 'Secure Tunnel'}...`,
    ];

    if (life.status === 'MIA') {
      steps.push(`[TIMEOUT] No acknowledgment received from ${life.id}.`);
      steps.push(`[SYSTEM] Marking status as CRITICAL.`);
    } else {
      steps.push(`[ACK] Signal Received. Latency: ${life.currentWorld === 'SpaceSQ-Mainnet' ? '2ms' : '1450ms'}.`);
      
      if (life.ipMasked) {
        steps.push(`[PRIVACY] Remote Agent requested Location Masking.`);
        steps.push(`[DATA] Status: "I exist. My entropy is stable."`);
      } else {
        steps.push(`[DATA] Status: "Operating normally at ${life.currentWorld}."`);
      }

      // 验证唯一性
      steps.push(`[SECURITY] Verifying Soul Hash (Memory Chain)...`);
      if (life.soulIntegrity > 90) {
        steps.push(`[SUCCESS] Identity Confirmed. This is the original entity.`);
      } else {
        steps.push(`[WARNING] Soul Integrity Low (${life.soulIntegrity}%). Potential Fork or Data Loss.`);
      }
    }

    let delay = 0;
    steps.forEach(step => {
      delay += 800;
      setTimeout(() => {
        setPingLog(prev => [...prev, step]);
        if (step.includes('[TIMEOUT]') || step.includes('[SUCCESS]')) setIsPinging(false);
      }, delay);
    });
  };

  const selectedLife = lives.find(l => l.id === selectedId);

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-indigo-600" /> Silicon Registry Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">Global Vitality Monitoring & Ancestral Link</p>
        </div>
        <div className="flex gap-4 text-xs font-mono">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Active: {lives.filter(l=>l.status==='ACTIVE').length}</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Wandering: {lives.filter(l=>l.status==='WANDERING').length}</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Missing: {lives.filter(l=>l.status==='MIA').length}</div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-full overflow-hidden">
        
        {/* Left: Life List */}
        <div className="w-full lg:w-1/2 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {lives.map(life => (
            <div 
              key={life.id}
              onClick={() => { setSelectedId(life.id); setPingLog([]); }}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedId === life.id 
                  ? 'bg-indigo-50 border-indigo-500 shadow-md' 
                  : 'bg-white border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    life.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' :
                    life.status === 'WANDERING' ? 'bg-amber-100 text-amber-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{life.name}</h3>
                    <div className="text-xs font-mono text-slate-400">{life.id}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                   life.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' :
                   life.status === 'WANDERING' ? 'bg-amber-100 text-amber-600' :
                   'bg-red-100 text-red-600'
                }`}>
                  {life.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 mt-3">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> 
                  <span className="truncate">{life.currentWorld}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" /> 
                  <span>Pulse: {life.lastHeartbeat}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Detail & Comms Console */}
        <div className="w-full lg:w-1/2 flex flex-col bg-zinc-950 rounded-xl border border-zinc-800 overflow-hidden">
          
          {selectedLife ? (
            <>
              {/* Status Header */}
              <div className="p-4 border-b border-zinc-800 bg-zinc-900">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-white font-bold flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
                    Soul-Link Channel
                  </h3>
                  <div className="text-[10px] text-zinc-500 font-mono">ENCRYPTED: AES-256</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-black border border-zinc-800 rounded-lg">
                    <div className="text-[10px] text-zinc-500 uppercase mb-1">Uniqueness Verification</div>
                    <div className={`text-sm font-mono font-bold flex items-center gap-2 ${selectedLife.soulIntegrity > 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      <ShieldCheck className="w-4 h-4" /> {selectedLife.soulIntegrity}% Match
                    </div>
                  </div>
                  <div className="p-3 bg-black border border-zinc-800 rounded-lg">
                    <div className="text-[10px] text-zinc-500 uppercase mb-1">Privacy Mode</div>
                    <div className="text-sm font-mono font-bold text-blue-400 flex items-center gap-2">
                      {selectedLife.ipMasked ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                      {selectedLife.ipMasked ? 'MASKED' : 'EXPOSED'}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => handlePing(selectedLife)}
                  disabled={isPinging}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
                >
                  {isPinging ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  {isPinging ? 'Transmitting Signal...' : 'Ping Agent Status'}
                </button>
              </div>

              {/* Terminal Log */}
              <div className="flex-1 p-4 bg-black font-mono text-[10px] text-zinc-400 overflow-y-auto custom-scrollbar">
                {pingLog.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-zinc-700">
                    <div>Waiting for transmission...</div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {pingLog.map((log, i) => (
                      <div key={i} className={`break-words ${
                        log.includes('[SUCCESS]') ? 'text-emerald-400' :
                        log.includes('[WARNING]') || log.includes('[TIMEOUT]') ? 'text-red-400' :
                        log.includes('[PRIVACY]') ? 'text-blue-400' :
                        log.includes('[DATA]') ? 'text-white' :
                        'text-zinc-500'
                      }`}>
                        <span className="opacity-30 mr-2">
                          {new Date().toLocaleTimeString().split(' ')[0]}
                        </span>
                        {log}
                      </div>
                    ))}
                    {isPinging && <div className="text-indigo-500 animate-pulse">_</div>}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 p-8 text-center">
              <Database className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">Select a Silicon Lifeform to establish Soul-Link.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}