"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SettingsHub() {
  const [email, setEmail] = useState('');
  
  // 密码修改状态
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secLoading, setSecLoading] = useState(false);
  const [secMessage, setSecMessage] = useState({ text: '', type: '' }); // type: 'error' | 'success'

  // 档案更新状态 (预留结构)
  const [profile, setProfile] = useState({ callsign: '', commsLink: '', manifesto: '' });
  const [profLoading, setProfLoading] = useState(false);
  const [profMessage, setProfMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      window.location.href = '/login';
    } else {
      setEmail(storedEmail);
    }
  }, []);

  // ==========================================
  // 处理密码修改 (Supabase Auth)
  // ==========================================
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecMessage({ text: '', type: '' });

    if (newPassword.length < 6) {
      return setSecMessage({ text: '安全协议拦截：密码需至少 6 位', type: 'error' });
    }
    if (newPassword !== confirmPassword) {
      return setSecMessage({ text: '安全协议拦截：两次输入的密钥不匹配', type: 'error' });
    }

    setSecLoading(true);
    try {
      // 调用 Supabase 原生修改密码接口 (需要用户处于登录 Session 状态)
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setSecMessage({ text: '安全密钥更新成功 [KEY_UPDATED]', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setSecMessage({ text: `更新失败: ${error.message || '无效的会话，请重新登录'}`, type: 'error' });
    } finally {
      setSecLoading(false);
    }
  };

  // ==========================================
  // 处理档案更新 (模拟/预留入库)
  // ==========================================
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfLoading(true);
    setProfMessage({ text: '', type: '' });

    // 模拟网络延迟与入库
    setTimeout(() => {
      setProfMessage({ text: '指挥官档案同步完毕 [SYNC_OK]', type: 'success' });
      setProfLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono flex flex-col relative overflow-hidden">
      {/* 背景网格 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      {/* Header */}
      <header className="flex justify-between items-end px-8 py-6 border-b border-zinc-800 bg-zinc-950/50 relative z-10">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white">
            SYS <span className="text-zinc-500">/</span> SETTINGS
          </h1>
          <p className="text-[10px] text-zinc-500 tracking-widest mt-1 uppercase">Configuration Hub & Security</p>
        </div>
        <button onClick={() => window.location.href='/dashboard'} className="text-[10px] border border-zinc-800 bg-black px-6 py-2 hover:bg-emerald-900/20 hover:text-emerald-500 hover:border-emerald-500 transition-all tracking-widest uppercase">
          ← Return to Cockpit
        </button>
      </header>

      <div className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* 模块 1: 安全中枢 (Security Clearance) */}
        <div className="border border-red-900/30 bg-black p-8 relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-black text-red-500 pointer-events-none transition-opacity group-hover:opacity-20">SEC</div>
          <h2 className="text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-red-500 rounded-sm animate-pulse"></span> Security Clearance
          </h2>

          <div className="mb-8">
            <p className="text-[10px] text-zinc-500 uppercase mb-1">Current Neural Link (Account)</p>
            <p className="text-white text-sm font-bold bg-zinc-900 border border-zinc-800 p-3">{email || 'UNKNOWN_USER'}</p>
          </div>

          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase mb-1">New Security Key (密码)</label>
              <input 
                type="password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 focus:border-red-500 p-3 text-sm text-white outline-none transition-colors" 
                placeholder="********"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase mb-1">Confirm Key (确认密码)</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 focus:border-red-500 p-3 text-sm text-white outline-none transition-colors" 
                placeholder="********"
              />
            </div>

            {secMessage.text && (
              <div className={`text-[10px] p-3 border font-bold uppercase tracking-widest ${secMessage.type === 'error' ? 'text-red-400 border-red-900 bg-red-950/30' : 'text-emerald-400 border-emerald-900 bg-emerald-950/30'}`}>
                {secMessage.text}
              </div>
            )}

            <button type="submit" disabled={secLoading} className="w-full py-3 mt-4 border border-red-900/50 hover:bg-red-900/20 text-red-500 font-bold text-xs uppercase tracking-widest transition-all">
              {secLoading ? 'ENCRYPTING...' : 'UPDATE SECURITY KEY'}
            </button>
          </form>
        </div>

        {/* 模块 2: 指挥官档案 (Commander Profile) */}
        <div className="border border-blue-900/30 bg-black p-8 relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl font-black text-blue-500 pointer-events-none transition-opacity group-hover:opacity-20">PRF</div>
          <h2 className="text-blue-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-sm"></span> Commander Profile
          </h2>

          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase mb-1">Public Callsign (社交代号)</label>
              <input 
                type="text" 
                value={profile.callsign}
                onChange={e => setProfile({...profile, callsign: e.target.value})}
                className="w-full bg-black border border-zinc-700 focus:border-blue-500 p-3 text-sm text-white outline-none transition-colors uppercase placeholder-zinc-800" 
                placeholder="E.g. NEO / TRINITY"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase mb-1">Comms Link (社交链接/X/Discord)</label>
              <input 
                type="text" 
                value={profile.commsLink}
                onChange={e => setProfile({...profile, commsLink: e.target.value})}
                className="w-full bg-black border border-zinc-700 focus:border-blue-500 p-3 text-sm text-blue-400 outline-none transition-colors placeholder-zinc-800" 
                placeholder="https://x.com/your_handle"
              />
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 uppercase mb-1">Genesis Manifesto (个人宣言)</label>
              <textarea 
                value={profile.manifesto}
                onChange={e => setProfile({...profile, manifesto: e.target.value})}
                className="w-full bg-black border border-zinc-700 focus:border-blue-500 p-3 text-sm text-zinc-300 outline-none transition-colors resize-none h-24 placeholder-zinc-800" 
                placeholder="Transmit your thoughts to the Space² matrix..."
              ></textarea>
            </div>

            {profMessage.text && (
              <div className={`text-[10px] p-3 border font-bold uppercase tracking-widest ${profMessage.type === 'error' ? 'text-red-400 border-red-900 bg-red-950/30' : 'text-blue-400 border-blue-900 bg-blue-950/30'}`}>
                {profMessage.text}
              </div>
            )}

            <button type="submit" disabled={profLoading} className="w-full py-3 mt-4 border border-blue-900/50 hover:bg-blue-900/20 text-blue-500 font-bold text-xs uppercase tracking-widest transition-all">
              {profLoading ? 'SYNCING DATA...' : 'TRANSMIT PROFILE DATA'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}