'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Terminal, Cpu, ArrowLeft, 
  ShieldCheck, Fingerprint, RefreshCw, MapPin, Hash
} from 'lucide-react';
import { generateSUNS, extractOrigin, mintIdentityID, calculateTrinity } from '@/lib/space_protocol';

export default function GeneratePage() {
  const [step, setStep] = useState<'INIT' | 'PROCESSING' | 'COMPLETE'>('INIT');
  const [email, setEmail] = useState('');
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev.slice(-6), `> ${msg}`]);

  const handleGenerate = () => {
    if (!email) return;
    setStep('PROCESSING');
    setLogs([]);

    // 1. 初始化
    addLog("Initializing Space² Genesis Protocol v6.0...");
    
    setTimeout(() => {
      // 2. 生成 SUNS 地址
      const role = Math.random() > 0.3 ? 'HUMAN' : 'SILICON'; // 模拟角色
      const suns = generateSUNS(role);
      addLog(`Allocating SUNS Space: [${suns}]`);
      
      setTimeout(() => {
        // 3. 提取 Origin
        const origin = extractOrigin(suns);
        addLog(`Extracting Origin Field: Handle[3]+Block[2] -> ${origin}`);
        
        setTimeout(() => {
          // 4. 计算三位一体
          addLog("Calculating Trinity Entropy (Tech/Art/Cap)...");
          const trinity = calculateTrinity(role);

          setTimeout(() => {
            // 5. 铸造 ID
            const id = mintIdentityID(role, origin);
            addLog(`Minting 24-bit Identity: ${id}`);
            
            setTimeout(() => {
              setResult({ role, suns, origin, id, trinity, timestamp: new Date().toISOString() });
              setStep('COMPLETE');
            }, 1000);
          }, 800);
        }, 800);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30">
      
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <Link href="/" className="absolute top-6 left-6 flex items-center gap-2 text-zinc-500 hover:text-white transition-colors z-50">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-xs">ABORT</span>
      </Link>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
          
          {/* Header */}
          <div className="bg-black/50 p-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-500">
              <Terminal className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest">SUNS REGISTRY TERMINAL</span>
            </div>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
          </div>

          <div className="p-8">
            {/* INIT */}
            {step === 'INIT' && (
              <div className="animate-in fade-in slide-in-from-bottom-4">
                <h1 className="text-2xl font-bold mb-2 text-white">Identity Claim</h1>
                <p className="text-sm text-zinc-400 mb-6">
                  Enter your entropy source to generate your SUNS address and S2-SLIP ID.
                </p>
                <div className="space-y-4">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="commander@human.org"
                    className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button 
                    onClick={handleGenerate}
                    disabled={!email}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Fingerprint className="w-5 h-5" />
                    MINT IDENTITY
                  </button>
                </div>
              </div>
            )}

            {/* PROCESSING */}
            {step === 'PROCESSING' && (
              <div className="flex flex-col items-center py-4 animate-in fade-in">
                <div className="w-full bg-black rounded p-3 font-mono text-[10px] md:text-xs text-emerald-500/80 h-40 overflow-hidden border border-zinc-800/50 flex flex-col justify-end">
                  {logs.map((log, i) => <div key={i} className="mb-1 break-all">{log}</div>)}
                  <div className="animate-pulse">_</div>
                </div>
              </div>
            )}

            {/* COMPLETE */}
            {step === 'COMPLETE' && result && (
              <div className="animate-in zoom-in duration-500">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs mb-2">
                    <ShieldCheck className="w-3 h-3" />
                    <span>REGISTRY CONFIRMED</span>
                  </div>
                </div>

                {/* ID CARD */}
                <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-700 rounded-xl p-5 mb-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                  
                  {/* SUNS Address */}
                  <div className="mb-4 relative z-10 border-b border-white/10 pb-2">
                    <div className="text-[9px] text-zinc-500 uppercase flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3" /> SUNS Space Address
                    </div>
                    <div className="font-mono text-sm text-emerald-400 break-all">{result.suns}</div>
                  </div>

                  {/* ID */}
                  <div className="mb-4 relative z-10">
                    <div className="text-[9px] text-zinc-500 uppercase flex items-center gap-1 mb-1">
                      <Hash className="w-3 h-3" /> 24-Bit Identity ID
                    </div>
                    <div className="font-mono text-lg font-bold text-white tracking-widest break-all">
                      {result.id}
                    </div>
                    <div className="flex gap-1 mt-1">
                      {result.id.split('-').map((part:string, i:number) => (
                        <span key={i} className="text-[8px] px-1 bg-zinc-800 rounded text-zinc-400">
                          {['CLS','ORG','DATE','MOR','SEQ'][i]}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Trinity */}
                  <div className="relative z-10">
                    <div className="flex justify-between text-[10px] uppercase text-zinc-400 mb-1">
                      <span>Trinity Score</span>
                      <span className="text-white font-bold">{result.trinity.score}</span>
                    </div>
                    <div className="flex gap-1 h-1">
                      <div className="bg-blue-500 h-full" style={{width: `${result.trinity.matrix.T}%`}}></div>
                      <div className="bg-purple-500 h-full" style={{width: `${result.trinity.matrix.A}%`}}></div>
                      <div className="bg-yellow-500 h-full" style={{width: `${result.trinity.matrix.C}%`}}></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                   <Link href="/map" className="flex-1 bg-white text-black font-bold py-3 rounded-lg text-sm flex items-center justify-center hover:bg-zinc-200">
                     ENTER GALAXY
                   </Link>
                   <button onClick={() => {setStep('INIT'); setEmail('');}} className="px-4 bg-zinc-800 border border-zinc-700 text-zinc-400 rounded-lg hover:text-white">
                     <RefreshCw className="w-5 h-5" />
                   </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}