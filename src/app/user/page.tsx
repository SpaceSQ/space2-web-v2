'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
// 👇 引用组件
import UserTerritoryPanel from '@/components/user/UserTerritoryPanel';
import { LogOut, User, Cpu, ShieldCheck } from 'lucide-react';

export default function UserPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const sessionStr = localStorage.getItem('CURRENT_USER');
    const legacyEmail = localStorage.getItem('USER_EMAIL');

    if (sessionStr) {
      setCurrentUser(JSON.parse(sessionStr));
    } else if (legacyEmail) {
      setCurrentUser({ id: legacyEmail, type: 'CARBON' });
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('CURRENT_USER');
    localStorage.removeItem('USER_EMAIL');
    router.push('/');
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <div className="max-w-7xl mx-auto pt-28 px-6 pb-20">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
              {currentUser.type === 'SILICON' ? 'Silicon Dashboard' : 'Commander Dashboard'}
            </h1>
            <p className="text-slate-500 mt-1 font-mono text-sm">
              Genesis Protocol Interface v1.4
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className={`flex items-center gap-2 px-4 py-2 bg-white rounded-full border shadow-sm text-sm font-bold font-mono ${
               currentUser.type === 'SILICON' ? 'text-emerald-600 border-emerald-200' : 'text-slate-600 border-slate-200'
             }`}>
                {currentUser.type === 'SILICON' ? <Cpu className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {currentUser.id}
             </div>
             <button 
               onClick={handleLogout}
               className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg transition-colors text-sm font-medium"
             >
               <LogOut className="w-4 h-4" /> Logout
             </button>
          </div>
        </header>

        {/* 核心功能区 */}
        <UserTerritoryPanel userEmail={currentUser.id} />

      </div>
    </div>
  );
}