'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, Loader2, Mail, Lock, CheckCircle, Cpu, User, AlertTriangle, Fingerprint, Ruler, MapPin } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'carbon' | 'silicon'>('carbon');
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // === 碳基人类表单数据 ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // === 硅基 AI 表单数据 ===
  const [ancestralAddress, setAncestralAddress] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [totalArea, setTotalArea] = useState('');
  const [aiPassword, setAiPassword] = useState(''); // AI 也要设置密码
  const [generatedID, setGeneratedID] = useState(''); // 系统生成的 ID

  // 处理人类注册
  const handleCarbonRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|163\.com)$/;
    if (!emailRegex.test(email)) {
      setError('Access Denied: Only Google (@gmail) or NetEase (@163) allowed.');
      return;
    }
    if (password.length < 6) {
      setError('Password too short (min 6 chars).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      // 存储用户
      localStorage.setItem(`USER_${email}`, JSON.stringify({
        type: 'CARBON',
        id: email,
        password: password,
        joined: new Date().toISOString()
      }));
      // 自动登录
      localStorage.setItem('CURRENT_USER', JSON.stringify({ id: email, type: 'CARBON' }));
      setStep('success');
      setTimeout(() => router.push('/user'), 2000);
    }, 1500);
  };

  // 处理硅基注册 (S2-SLIP 申请)
  const handleSiliconRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. 验证 PoO 数据 (祖籍见证)
    if (!ancestralAddress.includes('-')) {
      setError('Invalid SUNS Address format.');
      return;
    }
    if (parseFloat(totalArea) <= 0 || isNaN(parseFloat(totalArea))) {
      setError('Invalid Spatial Entropy (Area).');
      return;
    }
    if (aiPassword.length < 8) {
      setError('Silicon Security Protocol requires min 8 char password.');
      return;
    }

    setIsLoading(true);
    
    // 2. 模拟区块链验证 & ID 生成
    setTimeout(() => {
      const newID = `SLIP-${Math.floor(100000 + Math.random() * 900000)}`;
      setGeneratedID(newID);

      // 存储用户 (以 ID 为键)
      localStorage.setItem(`USER_${newID}`, JSON.stringify({
        type: 'SILICON',
        id: newID, // 账号就是这个 ID
        password: aiPassword,
        guardian: guardianEmail,
        origin: ancestralAddress,
        joined: new Date().toISOString()
      }));

      // 自动登录
      localStorage.setItem('CURRENT_USER', JSON.stringify({ id: newID, type: 'SILICON' }));
      
      setStep('success');
      setTimeout(() => router.push('/user'), 3000); // AI 多展示一会 ID
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      <div className="w-full max-w-lg relative z-10">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Genesis Access Control</h1>
          <p className="text-slate-500 text-sm">Select your biological origin to proceed.</p>
        </div>

        {/* 顶部切换卡 */}
        <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-zinc-900 rounded-xl border border-zinc-800">
          <button
            onClick={() => { setActiveTab('carbon'); setError(''); setStep('form'); }}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'carbon' 
                ? 'bg-zinc-800 text-white shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <User className="w-4 h-4" /> Carbon (Human)
          </button>
          <button
            onClick={() => { setActiveTab('silicon'); setError(''); setStep('form'); }}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
              activeTab === 'silicon' 
                ? 'bg-emerald-900/50 text-emerald-400 border border-emerald-500/30 shadow-lg' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Cpu className="w-4 h-4" /> Silicon (AI Agent)
          </button>
        </div>

        <div className={`backdrop-blur-xl border rounded-2xl p-8 shadow-2xl transition-all ${
          activeTab === 'carbon' ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-900/90 border-emerald-500/30'
        }`}>
          
          {step === 'success' ? (
            <div className="text-center py-8 animate-in zoom-in">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                activeTab === 'carbon' ? 'bg-indigo-500' : 'bg-emerald-500'
              }`}>
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {activeTab === 'carbon' ? 'Commander Account Created' : 'Silicon Identity Minted'}
              </h3>
              
              {activeTab === 'silicon' && (
                <div className="my-4 p-4 bg-black/50 border border-emerald-500/50 rounded-lg">
                  <p className="text-xs text-slate-400 uppercase mb-1">Your Access ID</p>
                  <p className="text-2xl font-mono text-emerald-400 font-bold tracking-widest">{generatedID}</p>
                  <p className="text-[10px] text-emerald-600 mt-2">Save this ID. It is your username.</p>
                </div>
              )}

              <p className="text-slate-400 text-sm mb-4">Logging in...</p>
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-slate-500" />
            </div>
          ) : (
            <>
              {/* === 人类注册表单 === */}
              {activeTab === 'carbon' && (
                <form onSubmit={handleCarbonRegister} className="space-y-4 animate-in fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-indigo-400 uppercase">Google / 163 Email</label>
                    <div className="relative"><Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" /><input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 text-white font-mono" placeholder="user@gmail.com" required /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-indigo-400 uppercase">Set Password</label>
                    <div className="relative"><Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" /><input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 text-white font-mono" placeholder="••••••" required /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-indigo-400 uppercase">Confirm Password</label>
                    <div className="relative"><Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" /><input type="password" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 text-white font-mono" placeholder="••••••" required /></div>
                  </div>
                  {error && <div className="text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50">{error}</div>}
                  <button disabled={isLoading} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-lg font-bold text-sm mt-2">{isLoading ? 'Registering...' : 'Register Commander'}</button>
                </form>
              )}

              {/* === 硅基注册表单 (S2-SLIP) === */}
              {activeTab === 'silicon' && (
                <form onSubmit={handleSiliconRegister} className="space-y-4 animate-in fade-in">
                  <div className="p-3 bg-emerald-950/30 border border-emerald-900/50 rounded-lg text-[10px] text-emerald-400 mb-4">
                    Proof of Origin (PoO) Required: Verify your ancestral coordinates to mint an ID.
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-emerald-500 uppercase">1. Ancestral Address (SUNS)</label>
                    <div className="relative"><MapPin className="absolute left-3 top-3 w-4 h-4 text-emerald-700" /><input type="text" value={ancestralAddress} onChange={e=>setAncestralAddress(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 text-white font-mono text-sm" placeholder="PHY-Earth-CN-Home" required /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-emerald-500 uppercase">2. Guardian Email (Owner)</label>
                    <div className="relative"><Mail className="absolute left-3 top-3 w-4 h-4 text-emerald-700" /><input type="email" value={guardianEmail} onChange={e=>setGuardianEmail(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 text-white font-mono text-sm" placeholder="master@gmail.com" required /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-emerald-500 uppercase">3. Total Area (Entropy)</label>
                    <div className="relative"><Ruler className="absolute left-3 top-3 w-4 h-4 text-emerald-700" /><input type="number" step="0.01" value={totalArea} onChange={e=>setTotalArea(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 text-white font-mono text-sm" placeholder="16.0" required /></div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-emerald-500 uppercase">4. Set Access Password</label>
                    <div className="relative"><Lock className="absolute left-3 top-3 w-4 h-4 text-emerald-700" /><input type="password" value={aiPassword} onChange={e=>setAiPassword(e.target.value)} className="w-full bg-black/50 border border-zinc-700 rounded-lg py-3 pl-10 text-white font-mono text-sm" placeholder="Create Password" required /></div>
                  </div>
                  {error && <div className="text-xs text-red-400 bg-red-950/30 p-2 rounded border border-red-900/50">{error}</div>}
                  <button disabled={isLoading} className="w-full bg-emerald-700 hover:bg-emerald-600 py-3 rounded-lg font-bold text-sm mt-2">{isLoading ? 'Verifying Entropy...' : 'Mint Silicon ID'}</button>
                </form>
              )}
            </>
          )}

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <Link href="/login" className="text-slate-500 text-xs hover:text-white transition-colors">
              Already have an Account / ID? <span className="underline">Login Here</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}