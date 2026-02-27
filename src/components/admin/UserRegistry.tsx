"use client";
import React, { useState } from 'react';
import { MOCK_USERS, RegisteredUser } from '@/types/admin';
import { Search, Mail, Ban, Check, X } from 'lucide-react';

export const UserRegistry = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [msgTarget, setMsgTarget] = useState<RegisteredUser | null>(null);
  const [msgContent, setMsgContent] = useState("");

  const handleSendMessage = () => {
    alert(`[SIMULATION] Message sent to ${msgTarget?.email}:\n"${msgContent}"`);
    setMsgTarget(null);
    setMsgContent("");
  };

  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' } : u));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Citizen Registry</h2>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-zinc-500 w-4 h-4" />
          <input 
            type="text" placeholder="Search ID, Email or Address..." 
            className="bg-zinc-900 border border-zinc-800 text-white pl-10 pr-4 py-2 rounded-lg text-sm w-64 focus:border-blue-500 outline-none"
          />
        </div>
      </div>

      {/* 用户列表 */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-900 text-zinc-500 font-mono text-xs uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Address ID</th>
              <th className="p-4">Seed</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-zinc-900/80 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white">{user.email}</div>
                  <div className="text-xs text-zinc-500 font-mono">{user.id}</div>
                </td>
                <td className="p-4"><span className="bg-black border border-zinc-700 px-2 py-1 rounded text-xs">{user.role}</span></td>
                <td className="p-4 font-mono text-blue-400">{user.addressID}</td>
                <td className="p-4">
                    {user.seedDownloaded ? <span className="text-green-500 flex items-center gap-1"><Check size={12}/> Done</span> : <span className="text-zinc-600">Pending</span>}
                </td>
                <td className="p-4">
                    <span className={`text-xs px-2 py-1 rounded font-bold ${user.status === 'ACTIVE' ? 'text-green-500 bg-green-900/20' : 'text-red-500 bg-red-900/20'}`}>
                        {user.status}
                    </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button 
                    onClick={() => setMsgTarget(user)}
                    className="p-2 hover:bg-blue-600/20 hover:text-blue-500 rounded text-zinc-400 transition" 
                    title="Send Message"
                  >
                    <Mail size={16} />
                  </button>
                  <button 
                    onClick={() => toggleStatus(user.id)}
                    className="p-2 hover:bg-red-600/20 hover:text-red-500 rounded text-zinc-400 transition" 
                    title={user.status === 'ACTIVE' ? "Ban User" : "Unban"}
                  >
                    <Ban size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 发送消息弹窗 */}
      {msgTarget && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Mail className="text-blue-500" /> Message to Citizen
              </h3>
              <button onClick={() => setMsgTarget(null)}><X className="text-zinc-500 hover:text-white"/></button>
            </div>
            
            <div className="space-y-4">
              <div className="text-sm text-zinc-400">
                To: <span className="text-white font-bold">{msgTarget.email}</span> ({msgTarget.addressID})
              </div>
              <textarea 
                className="w-full h-32 bg-black border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none resize-none"
                placeholder="Type your official directive here..."
                value={msgContent}
                onChange={(e) => setMsgContent(e.target.value)}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button onClick={() => setMsgTarget(null)} className="px-4 py-2 text-zinc-400 text-sm hover:text-white">Cancel</button>
                <button onClick={handleSendMessage} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm">Send Transmission</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};