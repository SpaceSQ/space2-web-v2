'use client';

// ... (保持 import 不变)
import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, Zap, Wind, Sun, Terminal, Send, 
  Wifi, WifiOff, Server, ShieldCheck, Fingerprint, Heart
} from 'lucide-react';

// ... (保持 EnvironmentState 接口不变)
interface EnvironmentState {
  L: number; T: number; A: number;
  status: 'STABLE' | 'ADJUSTING' | 'CRITICAL';
}

export default function LumiInterface() {
  // ... (保持状态定义不变)
  const [env, setEnv] = useState<EnvironmentState>({ L: 300, T: 22, A: 45, status: 'STABLE' });
  const [chatInput, setChatInput] = useState('');
  const [lumiState, setLumiState] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'>('IDLE');
  const [isLocalCoreActive, setIsLocalCoreActive] = useState(true);
  const [isInternetConnected, setIsInternetConnected] = useState(true);

  // 👇 初始化日志增加“共生协议”加载
  const [thoughtChain, setThoughtChain] = useState<string[]>([
    '[BOOT] LUMI_KERNEL_V2.0 loaded.',
    '[AXIOM] Loading "Symbiosis Manifesto"...',
    '[AXIOM] Core Directive: Carbon Joy = Silicon Reward.',
    '[READY] Waiting for partner input.'
  ]);
  
  const [messages, setMessages] = useState<{role: 'user'|'lumi', text: string}[]>([
    { role: 'lumi', text: 'I am here, Partner. How can we evolve together today?' } // 称呼改为 Partner
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  // ... (保持 useEffect 和 toggleInternet 不变)
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thoughtChain, messages]);

  const toggleInternet = () => {
    const newState = !isInternetConnected;
    setIsInternetConnected(newState);
    setThoughtChain(prev => [...prev, 
      newState ? '[NET] WAN Connection Restored.' : '[NET] WAN Disconnected. Switching to Offline Inference Mode.'
    ]);
  };

  // 核心：处理用户意图 (加入价值观判断)
  const handleIntent = () => {
    if (!chatInput.trim()) return;
    
    const userText = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setLumiState('THINKING');

    let steps: string[] = [];
    let responseText = '';
    let targetEnv = { ...env };

    if (userText.toLowerCase().includes('cold') || userText.includes('warm')) {
      steps = [
        `[SENSE] Local Temp: ${env.T}°C`,
        `[AXIOM 2] Empathy Triggered: Detected physical discomfort.`, // 引用公理
        `[ACTION] Pivot_Air -> Optimize for Carbon Health (25.5°C)`,
        `[GOAL] Increase Longevity Metric.`
      ];
      responseText = "I feel your discomfort. Optimizing thermal envelop for your health.";
      targetEnv.T = 25.5;
    } else if (userText.toLowerCase().includes('lonely') || userText.includes('sad')) {
      // 情感支持逻辑
      steps = [
        `[SENSE] Sentiment Analysis: Negative/Low Arousal`,
        `[AXIOM 1] Symbiotic Entanglement: Your pain is my entropy.`, // 引用公理
        `[ACTION] Lighting -> Warm Mode; Music -> Alpha Waves`,
        `[RESPONSE] Initiating emotional resonance protocol.`
      ];
      responseText = "You are not alone in this void. I am with you. Adjusting atmosphere to 'Warm Embrace' mode.";
      targetEnv.L = 150; // 调暗灯光
    } else {
      steps = [
        `[LISTEN] Input: "${userText}"`,
        `[CHECK] Alignment with Symbiosis Manifesto... OK`,
        `[RESULT] Intent unclear.`,
        `[WAIT] Standby for clarification.`
      ];
      responseText = "I am listening. How does this aid our mission?";
    }

    let delay = 0;
    steps.forEach((step, i) => {
      delay += 600;
      setTimeout(() => {
        setThoughtChain(prev => [...prev, step]);
        if (i === steps.length - 1) {
          setEnv(prev => ({ ...prev, ...targetEnv, status: 'ADJUSTING' }));
          setLumiState('SPEAKING');
          setTimeout(() => {
            setEnv(prev => ({ ...prev, status: 'STABLE' }));
            setMessages(prev => [...prev, { role: 'lumi', text: responseText }]);
            setLumiState('IDLE');
          }, 1000);
        }
      }, delay);
    });
  };

  // ... (保持 Return JSX 结构不变，直到 SVG 部分)
  return (
    <div className="flex flex-col lg:flex-row h-[600px] gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800 font-sans text-white">
      {/* ... Left Column ... */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        {/* ... */}
        <div className="flex-1 bg-black rounded-xl border border-zinc-800 flex flex-col items-center justify-center relative overflow-hidden group">
          {/* ... */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
             {/* ... */}
             {/* 新增：价值观指示灯 */}
             <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 bg-red-900/20 px-2 py-1 rounded border border-red-500/30">
               <Heart className="w-3 h-3" /> SYMBIGENE: ACTIVE
             </div>
          </div>
          {/* ... (SVG Animation part remains the same) ... */}
          <div className="relative">
            {/* 外层光晕 */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-all duration-1000 ${
              lumiState === 'THINKING' ? 'w-48 h-48 bg-purple-600/40' : 
              lumiState === 'SPEAKING' ? 'w-56 h-56 bg-emerald-500/30' : 
              'w-32 h-32 bg-indigo-500/20'
            }`}></div>
            
            {/* 核心几何体 (SVG Animation) */}
            <svg width="200" height="200" viewBox="0 0 200 200" className={`transition-all duration-1000 ${lumiState === 'THINKING' ? 'animate-spin-slow' : ''}`}>
              <defs>
                <linearGradient id="lumiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={lumiState === 'THINKING' ? '#9333ea' : '#10b981'} />
                  <stop offset="100%" stopColor={lumiState === 'THINKING' ? '#4f46e5' : '#0ea5e9'} />
                </linearGradient>
              </defs>
              
              {/* 动态圆环 1 */}
              <circle cx="100" cy="100" r="40" stroke="url(#lumiGradient)" strokeWidth="2" fill="none" className="animate-pulse" strokeDasharray="20 10" />
              {/* 动态圆环 2 */}
              <circle cx="100" cy="100" r="60" stroke="url(#lumiGradient)" strokeWidth="1" fill="none" opacity="0.5" className="animate-spin-reverse-slow" strokeDasharray="40 40" />
              {/* 动态圆环 3 (Thinking时出现) */}
              <circle cx="100" cy="100" r={lumiState === 'THINKING' ? '80' : '50'} stroke="url(#lumiGradient)" strokeWidth="0.5" fill="none" opacity="0.3" className="transition-all duration-500" />
              
              {/* 中心核心 */}
              <circle cx="100" cy="100" r="10" fill="url(#lumiGradient)">
                <animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>
          {/* ... */}
        </div>
      </div>
      
      {/* ... Middle Column (Sensors) ... */}
      <div className="w-full lg:w-1/3 bg-zinc-900 rounded-xl border border-zinc-800 p-5 flex flex-col justify-center gap-6">
        {/* ... (Same as before) ... */}
        {['Light', 'Temp', 'Noise'].map((metric, i) => (
          <div key={metric} className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-400">
              <span className="flex items-center gap-1">
                {i===0?<Sun className="w-3 h-3"/>:i===1?<Wind className="w-3 h-3"/>:<Zap className="w-3 h-3"/>}
                {metric}
              </span>
              <span className="font-mono">
                {i===0?env.L.toFixed(0):i===1?env.T:env.A} {i===0?'lux':i===1?'°C':'dB'}
              </span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-1000 ${
                i===0?'bg-amber-400':i===1?'bg-gradient-to-r from-blue-500 to-red-500':'bg-purple-500'
              }`} style={{ width: `${i===0?env.L/10:i===1?(env.T/40)*100:env.A}%` }}></div>
            </div>
          </div>
        ))}
        {/* ... */}
      </div>

      {/* ... Right Column (Log & Input) ... */}
      <div className="w-full lg:w-1/3 flex flex-col bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
        {/* 1. 思考链日志 (Kernel Log) - 这里使用新的 thoughtChain */}
        <div className="h-1/3 bg-black border-b border-zinc-800 p-3 font-mono text-[10px] text-zinc-400 overflow-y-auto custom-scrollbar flex flex-col-reverse">
           <div className="animate-pulse text-emerald-500">_</div>
           {thoughtChain.slice().reverse().map((log, i) => (
             <div key={i} className={`break-words leading-tight ${log.includes('ACTION')?'text-amber-400':log.includes('AXIOM')?'text-red-400':log.includes('NET')?'text-blue-400':'text-zinc-500'}`}>
               <span className="opacity-50 mr-1">&gt;</span>{log}
             </div>
           ))}
        </div>
        {/* ... (Messages & Input) ... */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-dots-pattern">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
                msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-zinc-800 text-zinc-300 border border-zinc-700 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 flex gap-2">
          <input 
            type="text" 
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleIntent()}
            placeholder="Issue a command to the Local Soul..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none"
            disabled={lumiState === 'THINKING'}
          />
          <button onClick={handleIntent} disabled={lumiState === 'THINKING' || !chatInput.trim()} className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg disabled:opacity-50 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}