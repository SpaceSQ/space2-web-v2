"use client";
import React, { useState } from 'react';
import { PortraitPet } from '@/components/PortraitPet';
import { PortraitHuman } from '@/components/PortraitHuman';

const ALL_ROLES = ['UNCLE', 'YOUTH', 'MOM', 'WANDERER', 'HACKER', 'MECHANIC', 'MAGICAL_GIRL', 'ASSASSIN', 'PILOT', 'GAMER', 'SCAVENGER', 'PROPHET'];
const ALL_PETS = ['像素犬', '赛博猫', '机械兔', '量子狐', '硅基水獭', '旅行蛙', '愤怒鸟', '史莱姆'];

export default function TestPortrait() {
  const [mood, setMood] = useState<'CALM'|'JOY'|'SAD'|'ANGRY'>('CALM');
  const [isSpeaking, setIsSpeaking] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 p-8 text-white font-mono flex flex-col items-center overflow-y-auto">
      <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500 mb-6 tracking-widest uppercase">
         Space² Hi-Fi Portrait Showcase
      </h1>
      
      {/* 动作控制器 */}
      <div className="flex gap-4 mb-8 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-700 shadow-xl backdrop-blur-md sticky top-4 z-50">
         {['CALM', 'JOY', 'SAD', 'ANGRY'].map(m => (
            <button key={m} onClick={() => setMood(m as any)} className={`px-6 py-2 rounded font-bold transition-all ${mood === m ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]' : 'bg-zinc-800 hover:bg-zinc-700'}`}>{m}</button>
         ))}
         <div className="w-px bg-zinc-700 mx-2"></div>
         <button onClick={() => setIsSpeaking(!isSpeaking)} className={`px-6 py-2 rounded font-black tracking-widest transition-all ${isSpeaking ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]' : 'bg-zinc-800'}`}>SPEAKING: {isSpeaking ? 'ON' : 'OFF'}</button>
      </div>

      <div className="w-full max-w-7xl">
         {/* 🧑‍🚀 人类基因陈列区 */}
         <h2 className="text-xl font-bold text-blue-400 border-b border-blue-900/50 pb-2 mb-6 uppercase">The 12 Avatars</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 mb-16">
            {ALL_ROLES.map(role => (
               <div key={role} className="bg-black border border-zinc-800 rounded-2xl p-4 flex flex-col items-center hover:border-blue-500 transition-colors group">
                  <div className="w-32 h-32 bg-zinc-900 rounded-full overflow-hidden border-4 border-blue-900/30 group-hover:border-blue-500/50 transition-colors">
                     <PortraitHuman roleKey={role} mood={mood} isSpeaking={isSpeaking} />
                  </div>
                  <span className="mt-4 text-[10px] text-zinc-400 font-bold tracking-widest">{role}</span>
               </div>
            ))}
         </div>

         {/* 🐾 硅基生命陈列区 */}
         <h2 className="text-xl font-bold text-pink-400 border-b border-pink-900/50 pb-2 mb-6 uppercase">The 8 Genomes</h2>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-20">
            {ALL_PETS.map(pet => (
               <div key={pet} className="bg-black border border-zinc-800 rounded-2xl p-4 flex flex-col items-center hover:border-pink-500 transition-colors group">
                  <div className="w-40 h-40 bg-zinc-900 rounded-full overflow-hidden border-4 border-pink-900/30 group-hover:border-pink-500/50 transition-colors">
                     <PortraitPet category={pet} mood={mood} isSpeaking={isSpeaking} />
                  </div>
                  <span className="mt-4 text-[12px] text-zinc-400 font-bold tracking-widest">{pet}</span>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}