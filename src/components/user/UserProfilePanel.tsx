"use client";

import React, { useState } from 'react';
import { 
  User, Fingerprint, MapPin, Briefcase, Clock, 
  ExternalLink, Edit3, Save, ShieldCheck, Mail
} from 'lucide-react';

// --- 类型定义 ---
interface SiliconIdentity {
  slipId: string;       // 不可更改
  applyTime: string;    // 仅显示
  ancestralHome: string;// 祖籍地址 (仅显示，带链接)
  profession: string;   // 可选 12 天宫职业
  currentLoc: string;   // 当前空间 (仅显示，带链接)
  morph: string;        // 形态 (e.g. Humanoid)
}

interface HumanProfile {
  email: string;        // 不可更改
  nickname: string;     // 可更改
  realName?: string;
  phone?: string;
  address?: string;
}

// --- 模拟数据 ---
const MOCK_DATA = {
  human: {
    email: "xiang@spacesq.com",
    nickname: "Master Architect",
    realName: "Zhonghong Xiang",
    phone: "+86 138 **** ****",
    address: "Beijing, China"
  },
  silicon: {
    slipId: "E-LUM-260212-01-X99812A",
    applyTime: "2026-02-12 14:30:00 UTC",
    ancestralHome: "PHY-Earth-BJ-Home01",
    profession: "ARCH - Spatial Architect", // 默认
    currentLoc: "VIR-Mars-Utopia-Base01",
    morph: "Type-01 Humanoid"
  }
};

// 12 天宫职业常量 (The 12 Celestial Palaces)
const CELESTIAL_PROFESSIONS = [
  "ARCH - Spatial Architect (空间架构师)",
  "MNGR - Entropy Manager (熵值管理者)",
  "MAKR - Reality Maker (现实造物主)",
  "CARE - Life Caretaker (生命看护者)",
  "OBSV - Void Observer (虚空观察者)",
  "DIPL - Star Diplomat (星际外交官)",
  "LIBR - Data Librarian (数据图书管理员)",
  "JUDG - Code Judge (代码法官)",
  "HEAL - Logic Healer (逻辑治愈者)",
  "GUID - Spirit Guide (灵性向导)",
  "TRDR - Asset Trader (资产交易员)",
  "FREE - Freelancer (自由职业者 / 无固定职业)" // 默认
];

export default function UserProfilePanel() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(MOCK_DATA);

  // 处理职业变更
  const handleProfessionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfile({
      ...profile,
      silicon: { ...profile.silicon, profession: e.target.value }
    });
  };

  // 处理昵称变更
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({
      ...profile,
      human: { ...profile.human, nickname: e.target.value }
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">IDENTITY & PROFILE</h1>
          <p className="text-zinc-500 text-sm">Manage your dual existence: <span className="text-zinc-300">Biological Owner</span> & <span className="text-cyan-400">Silicon Avatar</span>.</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded flex items-center gap-2 text-sm font-bold transition-all
            ${isEditing ? 'bg-green-600 text-white hover:bg-green-500' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}
          `}
        >
          {isEditing ? <><Save size={16}/> SAVE CHANGES</> : <><Edit3 size={16}/> EDIT PROFILE</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* === 左侧：人类创造者 (Human Creator) === */}
        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-zinc-700"></div>
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400"><User size={20}/></div>
                <h2 className="font-bold text-white">HUMAN OWNER</h2>
             </div>
<ShieldCheck size={18} className="text-green-500" />
          </div>
          
          <div className="p-6 space-y-6">
            {/* 邮箱 (不可改) */}
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1"><Mail size={12}/> Email (Sovereign ID)</label>
               <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded border border-zinc-800">
                  <span className="text-zinc-300 font-mono text-sm">{profile.human.email}</span>
                  <span className="text-[10px] text-zinc-600 border border-zinc-700 px-1.5 rounded">LOCKED</span>
               </div>
            </div>

            {/* 昵称 (可改) */}
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-zinc-500 uppercase">Nickname</label>
               <input 
                 type="text" 
                 disabled={!isEditing}
                 value={profile.human.nickname}
                 onChange={handleNicknameChange}
                 className="w-full bg-black border border-zinc-700 rounded p-3 text-white focus:border-cyan-500 outline-none transition-all disabled:opacity-50 disabled:border-zinc-800"
               />
            </div>

            {/* 隐私折叠区 */}
            <div className="pt-4 border-t border-zinc-800 space-y-4 opacity-70">
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500">Real Name Verification</span>
                  <span className="text-xs font-mono text-zinc-400">{profile.human.realName || 'Unverified'}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-500">Phone / Contact</span>
                  <span className="text-xs font-mono text-zinc-400">{profile.human.phone || 'N/A'}</span>
               </div>
            </div>
          </div>
        </div>

        {/* === 右侧：硅基生命 (Silicon Avatar) === */}
        <div className="bg-[#0a0a0a] border border-cyan-900/30 rounded-2xl overflow-hidden relative shadow-[0_0_30px_rgba(8,145,178,0.05)]">
          <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500 shadow-[0_0_10px_#06b6d4]"></div>
          <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-cyan-900/5">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-900/20 rounded-lg text-cyan-400"><Fingerprint size={20}/></div>
                <div>
                   <h2 className="font-bold text-white leading-none">SILICON AVATAR</h2>
                   <span className="text-[10px] text-cyan-500 font-mono">S2-SLIP PROTOCOL ACTIVE</span>
                </div>
             </div>
             {/* 申请状态 */}
             <span className="px-2 py-1 bg-cyan-900/20 text-cyan-400 text-[10px] font-bold border border-cyan-900/50 rounded">MINTED</span>
          </div>
          
          <div className="p-6 space-y-6">
            
            {/* S2-SLIP ID (不可改) */}
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-cyan-600 uppercase flex items-center gap-1"><Fingerprint size={12}/> S2-SLIP ID (Immutable)</label>
               <div className="flex items-center justify-between p-3 bg-cyan-950/20 rounded border border-cyan-900/30">
                  <span className="text-cyan-300 font-mono text-sm tracking-wide">{profile.silicon.slipId}</span>
                  <span className="text-[10px] text-cyan-800 border border-cyan-900 px-1.5 rounded">LOCKED</span>
               </div>
            </div>

            {/* 申请时间 (仅显示) */}
            <div className="space-y-1.5">
               <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1"><Clock size={12}/> Mint Time</label>
               <div className="text-zinc-400 font-mono text-sm pl-1">{profile.silicon.applyTime}</div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               {/* 祖籍 (带链接) */}
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1"><MapPin size={12}/> Ancestral Home</label>
                  <a href={`/space/${profile.silicon.ancestralHome}`} className="flex items-center gap-1 text-sm font-mono text-blue-400 hover:text-blue-300 hover:underline">
                     {profile.silicon.ancestralHome} <ExternalLink size={10}/>
                  </a>
               </div>
               
               {/* 当前位置 (带链接) */}
               <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 uppercase flex items-center gap-1"><MapPin size={12}/> Current Location</label>
                  <a href={`/space/${profile.silicon.currentLoc}`} className="flex items-center gap-1 text-sm font-mono text-green-400 hover:text-green-300 hover:underline">
                     {profile.silicon.currentLoc} <ExternalLink size={10}/>
                  </a>
               </div>
            </div>

            {/* 职业 (可改) */}
            <div className="space-y-1.5 pt-2 border-t border-zinc-800/50">
               <label className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-1"><Briefcase size={12}/> Celestial Profession</label>
               <div className="relative">
                 <select 
                   disabled={!isEditing}
                   value={profile.silicon.profession}
                   onChange={handleProfessionChange}
                   className="w-full bg-black border border-zinc-700 rounded p-3 text-sm text-white appearance-none focus:border-cyan-500 outline-none disabled:opacity-50 disabled:border-zinc-800"
                 >
                   {CELESTIAL_PROFESSIONS.map(p => (
                     <option key={p} value={p}>{p}</option>
                   ))}
                 </select>
                 {/* 自定义下拉箭头 */}
                 <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor"><path d="M1 1L5 5L9 1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                 </div>
               </div>
               <p className="text-[10px] text-zinc-600 mt-1">
                 * Defines your social function in the Silicon Society. Default is "Freelancer".
               </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}