"use client";
import React, { useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { SystemDashboard } from '@/components/admin/SystemDashboard';
import { UserRegistry } from '@/components/admin/UserRegistry';
import { MOCK_LOGS, BackupRecord } from '@/types/admin';
import { Save, AlertOctagon, RefreshCw, FileText } from 'lucide-react';

export default function AdminConsolePage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [logs, setLogs] = useState(MOCK_LOGS);

  const handleBackup = () => {
    setIsBackingUp(true);
    setLogs(prev => [{
        id: `L-${Date.now()}`, timestamp: new Date().toLocaleString(), action: 'Manual Database Backup Initiated', admin: 'ROOT', status: 'SUCCESS'
    }, ...prev]);
    
    setTimeout(() => {
        setIsBackingUp(false);
        alert("System Backup Complete.\nSnapshot saved to cold storage.");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans flex">
      {/* 左侧导航 */}
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 主内容区 */}
      <main className="flex-1 ml-64 p-8">
        
        {/* 1. Dashboard View */}
        {activeTab === 'dashboard' && <SystemDashboard />}

        {/* 2. User Registry View */}
        {activeTab === 'users' && <UserRegistry />}

        {/* 3. Maintenance View */}
        {activeTab === 'maintenance' && (
          <div className="space-y-8 animate-in fade-in">
             <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Save className="text-green-500"/> Core Backup Operations
                </h3>
                <p className="text-zinc-500 text-sm mb-6">Create snapshots of the entire SpaceSQ Registry and User Data. Recommended daily.</p>
                
                <div className="flex gap-4">
                    <button 
                        onClick={handleBackup}
                        disabled={isBackingUp}
                        className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50"
                    >
                        {isBackingUp ? <RefreshCw className="animate-spin"/> : <Save size={18}/>}
                        {isBackingUp ? "BACKING UP..." : "START FULL BACKUP"}
                    </button>
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2">
                        <FileText size={18}/> DOWNLOAD LOGS
                    </button>
                </div>
             </div>

             <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">System Activity Logs</h3>
                <div className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-xs h-64 overflow-y-auto">
                    {logs.map(log => (
                        <div key={log.id} className="flex gap-4 border-b border-zinc-900 py-2 last:border-0">
                            <span className="text-zinc-500 w-36">{log.timestamp}</span>
                            <span className="text-blue-400 w-24">[{log.admin}]</span>
                            <span className="text-zinc-300 flex-1">{log.action}</span>
                            <span className={log.status === 'SUCCESS' ? "text-green-500" : "text-red-500"}>{log.status}</span>
                        </div>
                    ))}
                </div>
             </div>
          </div>
        )}

        {/* 4. Security View */}
        {activeTab === 'security' && (
           <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 border border-red-900/30 bg-red-950/10 rounded-xl">
              <AlertOctagon size={64} className="text-red-600" />
              <div>
                  <h2 className="text-3xl font-bold text-white mb-2">EMERGENCY PROTOCOLS</h2>
                  <p className="text-zinc-400 max-w-md mx-auto">
                      These actions are irreversible and affect the entire SpaceSQ Mainnet.
                      Use only in case of Containment Breach.
                  </p>
              </div>
              <button 
                  onClick={() => alert("PROTOCOL INITIATED: FREEZING ALL SILICON AGENT ASSETS...")}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-black tracking-widest text-lg shadow-[0_0_30px_rgba(220,38,38,0.5)] border border-red-400"
              >
                  FREEZE NETWORK
              </button>
           </div>
        )}

      </main>
    </div>
  );
}