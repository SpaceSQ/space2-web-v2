"use client";
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// 定义模态框的几种状态
type AuthView = 'LOGIN' | 'REGISTER' | 'VERIFY_EMAIL' | 'FORGOT_PASSWORD' | 'UPDATE_PASSWORD';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const supabase = createClientComponentClient();
  const [view, setView] = useState<AuthView>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState(''); // 六位验证码
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // 清理状态
  useEffect(() => {
    if (isOpen) {
      setMessage(null);
      setView('LOGIN');
      setLoading(false);
    }
  }, [isOpen]);

  // 1. 登录逻辑
  const handleLogin = async () => {
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    } else {
      onLoginSuccess();
      onClose();
    }
  };

  // 2. 注册逻辑 (发送验证码)
  const handleRegister = async () => {
    setLoading(true); setMessage(null);
    // 注意：这里使用 signUp，Supabase 设置需开启 "Confirm Email"
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` } // 即使是发码，也需配置
    });
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: '验证码已发送至您的邮箱，请查收！' });
      setView('VERIFY_EMAIL'); // 跳转到输入验证码界面
      setLoading(false);
    }
  };

  // 3. 验证邮箱注册的六位验证码
  const handleVerifyEmail = async () => {
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup'
    });

    if (error) {
      setMessage({ type: 'error', text: '验证码错误或已过期' });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: '注册成功！正在登录...' });
      // 验证成功后自动登录，或跳转
      onLoginSuccess();
      onClose();
    }
  };

  // 4. 忘记密码 - 发送重置验证码
  const handleForgotPassword = async () => {
    setLoading(true); setMessage(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      setMessage({ type: 'error', text: error.message });
      setLoading(false);
    } else {
      setMessage({ type: 'success', text: '重置代码已发送至邮箱。' });
      setView('UPDATE_PASSWORD'); // 跳转到重置输入
      setLoading(false);
    }
  };

  // 5. 提交重置密码 (验证码 + 新密码)
  const handleUpdatePassword = async () => {
    setLoading(true); setMessage(null);
    // 先验证 OTP (Recovery 类型)
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'recovery'
    });

    if (verifyError) {
      setMessage({ type: 'error', text: '验证码无效。' });
      setLoading(false);
      return;
    }

    // 验证通过后更新密码
    const { error: updateError } = await supabase.auth.updateUser({ password: password });
    
    if (updateError) {
      setMessage({ type: 'error', text: updateError.message });
    } else {
      setMessage({ type: 'success', text: '密码修改成功！请重新登录。' });
      setTimeout(() => setView('LOGIN'), 1500);
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#09090b] border border-zinc-800 w-full max-w-md p-8 rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">✕</button>

        <h2 className="text-xl font-black text-white mb-6 tracking-wider text-center">
          {view === 'LOGIN' && 'ACCESS TERMINAL (登录)'}
          {view === 'REGISTER' && 'NEW IDENTITY (注册)'}
          {view === 'VERIFY_EMAIL' && 'SECURITY CHECK (验证)'}
          {view === 'FORGOT_PASSWORD' && 'RECOVERY (找回)'}
          {view === 'UPDATE_PASSWORD' && 'OVERRIDE (重置)'}
        </h2>

        {message && (
          <div className={`mb-4 p-3 rounded text-xs font-bold ${message.type === 'error' ? 'bg-red-900/30 text-red-400 border border-red-800' : 'bg-emerald-900/30 text-emerald-400 border border-emerald-800'}`}>
            {message.text}
          </div>
        )}

        <div className="flex flex-col gap-4">
          
          {/* 通用：邮箱输入 */}
          {view !== 'UPDATE_PASSWORD' && (
             <div className="flex flex-col gap-1">
               <label className="text-[10px] text-zinc-500 font-bold uppercase">Email</label>
               <input 
                 type="email" 
                 value={email} 
                 onChange={(e) => setEmail(e.target.value)}
                 disabled={view === 'VERIFY_EMAIL'} // 验证时锁定邮箱
                 className="bg-black border border-zinc-700 p-3 rounded text-white text-xs focus:border-blue-500 outline-none"
                 placeholder="name@example.com"
               />
             </div>
          )}

          {/* 验证码输入框 (仅在验证阶段显示) */}
          {(view === 'VERIFY_EMAIL' || view === 'UPDATE_PASSWORD') && (
             <div className="flex flex-col gap-1">
               <label className="text-[10px] text-yellow-500 font-bold uppercase">6-Digit Code (验证码)</label>
               <input 
                 type="text" 
                 value={code} 
                 onChange={(e) => setCode(e.target.value)}
                 className="bg-black border border-yellow-700/50 p-3 rounded text-yellow-400 text-center text-lg tracking-[0.5em] font-mono focus:border-yellow-500 outline-none"
                 placeholder="------"
                 maxLength={6}
               />
             </div>
          )}

          {/* 密码输入 (注册、登录、重置时显示) */}
          {(view === 'LOGIN' || view === 'REGISTER' || view === 'UPDATE_PASSWORD') && (
             <div className="flex flex-col gap-1">
               <label className="text-[10px] text-zinc-500 font-bold uppercase">
                 {view === 'UPDATE_PASSWORD' ? 'New Password' : 'Password'}
               </label>
               <input 
                 type="password" 
                 value={password} 
                 onChange={(e) => setPassword(e.target.value)}
                 className="bg-black border border-zinc-700 p-3 rounded text-white text-xs focus:border-blue-500 outline-none"
               />
             </div>
          )}

          {/* 核心操作按钮 */}
          <button 
            onClick={() => {
              if (view === 'LOGIN') handleLogin();
              if (view === 'REGISTER') handleRegister();
              if (view === 'VERIFY_EMAIL') handleVerifyEmail();
              if (view === 'FORGOT_PASSWORD') handleForgotPassword();
              if (view === 'UPDATE_PASSWORD') handleUpdatePassword();
            }}
            disabled={loading}
            className="mt-2 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded font-bold text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSING...' : 'EXECUTE'}
          </button>

          {/* 底部切换链接 */}
          <div className="flex justify-between mt-2 text-[10px] text-zinc-500 font-mono">
            {view === 'LOGIN' && (
              <>
                <button onClick={() => setView('FORGOT_PASSWORD')} className="hover:text-white">忘记密码?</button>
                <button onClick={() => setView('REGISTER')} className="hover:text-blue-400">注册新账户 →</button>
              </>
            )}
            {view === 'REGISTER' && (
              <button onClick={() => setView('LOGIN')} className="w-full text-center hover:text-white">已有账号? 返回登录</button>
            )}
            {(view === 'VERIFY_EMAIL' || view === 'FORGOT_PASSWORD' || view === 'UPDATE_PASSWORD') && (
              <button onClick={() => setView('LOGIN')} className="w-full text-center hover:text-white">← 返回登录</button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};