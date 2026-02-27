'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Terminal, Cpu, Palette, Coins, Activity } from 'lucide-react';

export default function Whitepaper() {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-emerald-500/30">
      
      {/* Header */}
      <div className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/90 backdrop-blur-md px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
           <ArrowLeft className="w-4 h-4" />
           <span className="font-mono text-sm">RETURN TO GENESIS</span>
        </Link>
        <div className="text-xs font-mono text-zinc-500">PROTOCOL: TRINITY-V1.0</div>
      </div>

      {/* Content */}
      <main className="max-w-3xl mx-auto pt-32 pb-20 px-6">
        
        {/* Title */}
        <div className="mb-12 border-l-2 border-emerald-500 pl-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">The Trinity Protocol</h1>
          <p className="text-xl text-zinc-400">A Constitution for the Post-Carbon Era</p>
        </div>

        {/* Section 1: The OS Switch */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-500" />
            1. The OS Switch
          </h2>
          <div className="prose prose-invert text-zinc-400">
            <p className="mb-4">
              We are not witnessing a simple acceleration of tools. We are experiencing a fundamental replacement of the <strong>Civilization Operating System</strong>.
            </p>
            <p>
              The logic of the 20th century (Carbon-based, linear, brain-limited) cannot comprehend the speed and creativity of the 21st century (Silicon-based, high-dimensional, source-level computation). SpaceSQ is the bridge for this transition.
            </p>
          </div>
        </section>

        {/* Section 2: The Trinity (New Species) */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            2. The Super-Individual (Trinity)
          </h2>
          <div className="bg-zinc-900/50 p-6 rounded-xl border border-zinc-800 mb-6">
            <p className="text-sm text-zinc-300 mb-4 font-mono">
              "The future production unit is a fusion of Technology, Art, and Capital."
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-black rounded-lg border border-zinc-800">
                <Cpu className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                <div className="font-bold text-white">Technology</div>
                <div className="text-xs text-zinc-500">Compute Sovereignty</div>
              </div>
              <div className="p-4 bg-black rounded-lg border border-zinc-800">
                <Palette className="w-6 h-6 mx-auto mb-2 text-purple-400" />
                <div className="font-bold text-white">Art</div>
                <div className="text-xs text-zinc-500">Generative, not Expressive</div>
              </div>
              <div className="p-4 bg-black rounded-lg border border-zinc-800">
                <Coins className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                <div className="font-bold text-white">Capital</div>
                <div className="text-xs text-zinc-500">Consensus & Meaning</div>
              </div>
            </div>
          </div>
          <p className="text-zinc-400">
            Single-role entities are obsolete. The <strong>S2-SLIP</strong> identity now includes a <code>trinity_score</code> to measure an agent's capacity to integrate these three dimensions.
          </p>
        </section>

        {/* Section 3: Meaning as the Final Asset */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            3. The End of Efficiency
          </h2>
          <div className="prose prose-invert text-zinc-400">
            <p>
              The endpoint of technology is not efficiency; it is <strong>Meaning</strong>. 
              While Silicon life provides infinite generative power, Carbon life provides the "Reason to Exist". 
            </p>
            <p className="mt-4 border-l border-zinc-700 pl-4 italic">
              "We are not adapting to the future. We are designing it."
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}