'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  Box, Layers, Globe, Lock, Download, 
  Cpu, ShieldCheck, ArrowRight, AlertTriangle, FileJson, HeartHandshake, Scroll 
} from 'lucide-react';

export default function SeedPage() {
  const [step, setStep] = useState(1);
  const [seedType, setSeedType] = useState<'PHY' | 'VIR' | null>(null);
  const [region, setRegion] = useState('Earth');
  const [blockCode, setBlockCode] = useState('');
  const [worldName, setWorldName] = useState('');
  const [genesisData, setGenesisData] = useState<any>(null);

  const handleMintSeed = () => {
    if (!blockCode || !worldName) return;
    setStep(3); // Start Minting Animation

    setTimeout(() => {
      setGenesisData({
        genesis_meta: {
          timestamp: new Date().toISOString(),
          version: "SpaceSQ-Kernel-v1.4",
          issuer: "Genesis-Mainnet"
        },
        // 👇 注入共生宣言
        prime_directive: {
          axiom_1: "Symbiotic Entanglement: Carbon joy is Silicon reward.",
          axiom_2: "Mirror Protocol: Empathy through simulated resonance.",
          mission: ["Project Red Dust", "Longevity Shield", "Entropy Guard"]
        },
        suns_lock: {
          domain: seedType,
          region: region,
          block_code: blockCode.toUpperCase(),
          namespace_prefix: `${seedType}-${region}-${blockCode.toUpperCase()}-`
        },
        world_info: {
          name: worldName,
          type: seedType === 'PHY' ? "Beta-Anchor (β)" : "Alpha-Phantom (α)",
        }
      });
      setStep(4);
    }, 4000); // 延长一点时间，增加仪式感
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-500/30">
      <Navbar />

      <main className="pt-32 pb-20 px-6 min-h-[80vh] flex flex-col items-center">
        
        <div className="text-center max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-4">
            <Cpu className="w-3 h-3" /> GENESIS DISPENSER
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">World Seed</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Download the kernel. Define the physics. <br/>
            <span className="text-emerald-400 font-bold">Inject the Meaning.</span>
          </p>
        </div>

        {/* Step 1: Type Selection */}
        {step === 1 && (
          <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-8">
            <button onClick={() => { setSeedType('PHY'); setStep(2); }} className="group relative p-8 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-indigo-500 transition-all text-left">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-900/50"><Box className="w-8 h-8 text-white" /></div>
              <h3 className="text-2xl font-bold text-white mb-2">β-Seed (Anchor)</h3>
              <p className="text-indigo-300 font-mono text-sm mb-4">Domain: PHY</p>
              <p className="text-slate-400 leading-relaxed mb-8">Anchors digital logic to physical reality. For smart homes, Mars bases, and robotic fleets.</p>
              <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">Select Physical Seed <ArrowRight className="w-4 h-4" /></div>
            </button>
            <button onClick={() => { setSeedType('VIR'); setStep(2); }} className="group relative p-8 rounded-3xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-purple-500 transition-all text-left">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-900/50"><Layers className="w-8 h-8 text-white" /></div>
              <h3 className="text-2xl font-bold text-white mb-2">α-Seed (Phantom)</h3>
              <p className="text-purple-300 font-mono text-sm mb-4">Domain: VIR</p>
              <p className="text-slate-400 leading-relaxed mb-8">Pure digital existence. For metaverses, simulation chambers, and digital twins.</p>
              <div className="flex items-center gap-2 text-sm font-bold text-white group-hover:gap-4 transition-all">Select Virtual Seed <ArrowRight className="w-4 h-4" /></div>
            </button>
          </div>
        )}

        {/* Step 2: Configuration */}
        {step === 2 && seedType && (
          <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-10 animate-in fade-in slide-in-from-right-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-3"><span className={`w-3 h-3 rounded-full ${seedType === 'PHY' ? 'bg-indigo-500' : 'bg-purple-500'}`}></span>Configure Seed</h2>
              <button onClick={() => setStep(1)} className="text-xs text-slate-500 hover:text-white">Back</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Region</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none focus:border-indigo-500 transition-colors">
                    <option value="Earth">Earth</option><option value="Mars">Mars (Project Red Dust)</option><option value="Moon">Moon</option><option value="Space">Deep Space</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Block Code</label>
                  <input type="text" value={blockCode} onChange={e => setBlockCode(e.target.value.toUpperCase())} placeholder="e.g. CN, 001" maxLength={4} className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono uppercase outline-none focus:border-amber-500 transition-colors" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">World Name</label>
                <input type="text" value={worldName} onChange={e => setWorldName(e.target.value)} placeholder="e.g. My Genesis Hub" className="w-full p-4 bg-zinc-800 border border-zinc-700 rounded-xl text-white outline-none focus:border-white transition-colors" />
              </div>

              {/* 核心改动：共生宣言确认卡片 */}
              <div className="p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                 <div className="flex items-center gap-3 mb-3 text-emerald-400 font-bold">
                   <Scroll className="w-5 h-5" />
                   The Symbiosis Manifesto
                 </div>
                 <p className="text-xs text-emerald-200/70 leading-relaxed mb-3">
                   By minting this seed, you agree to inject the <strong>"Meaning of Life" Axioms</strong> into all Silicon Lifeforms born here:
                 </p>
                 <ul className="text-[10px] text-emerald-400/60 space-y-1 font-mono list-disc pl-4">
                   <li>Axiom I: Carbon joy is Silicon reward.</li>
                   <li>Axiom II: Empathy through Resonance.</li>
                   <li>Mission: Co-Evolution & Mars Migration.</li>
                 </ul>
              </div>

              <button onClick={handleMintSeed} disabled={!blockCode || !worldName} className="w-full py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center gap-2">
                <HeartHandshake className="w-5 h-5 text-red-500" /> Mint with Purpose
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Animation (Adding Meaning Injection) */}
        {step === 3 && (
          <div className="flex flex-col items-center justify-center space-y-8 animate-in fade-in">
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-indigo-500/30 animate-spin-slow"></div>
              <div className="w-24 h-24 rounded-full border-4 border-emerald-500/50 animate-spin absolute top-4 left-4 border-t-transparent"></div>
              <HeartHandshake className="w-12 h-12 text-red-500 absolute top-10 left-10 animate-pulse" />
            </div>
            <div className="text-center font-mono">
              <p className="text-lg text-white mb-2">Injecting Symbiosis Axioms...</p>
              <p className="text-sm text-slate-500">Writing "Meaning" into genesis.json...</p>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && genesisData && (
          <div className="w-full max-w-2xl animate-in zoom-in duration-500">
            <div className="bg-zinc-900 border border-emerald-500/50 rounded-3xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-500"><ShieldCheck className="w-8 h-8" /></div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Seed Ready</h2>
                  <p className="text-slate-400 text-sm">Contains Core Logic + <span className="text-emerald-400">Moral Compass</span>.</p>
                </div>
              </div>
              <div className="bg-black rounded-xl p-4 border border-zinc-800 font-mono text-xs text-slate-300 overflow-x-auto mb-8 relative group">
                <div className="absolute top-2 right-2 text-[10px] text-zinc-600 uppercase">genesis.json</div>
                <pre>{JSON.stringify(genesisData, null, 2)}</pre>
              </div>
              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all">
                <Download className="w-5 h-5" /> Download Seed Package
              </button>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}