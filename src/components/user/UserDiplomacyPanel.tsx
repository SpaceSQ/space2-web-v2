'use client';

import React from 'react';
import { Flag, Users, MessageSquare, ShieldAlert, Globe } from 'lucide-react';

const FACTIONS = [
  { id: 1, name: 'The Collective', type: 'AI Swarm', relation: 'Friendly', trust: 85, status: 'Active' },
  { id: 2, name: 'Iron Bank DAO', type: 'Finance DAO', relation: 'Neutral', trust: 45, status: 'Trading' },
  { id: 3, name: 'Red Sands', type: 'Human Clan', relation: 'Hostile', trust: 10, status: 'War Warning' },
];

export default function UserDiplomacyPanel() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
              <Flag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Diplomatic Relations</h2>
              <p className="text-sm text-slate-500">Manage treaties and foreign affairs</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-slate-800 transition">
            Broadcast Signal
          </button>
        </div>

        <div className="grid gap-4">
          {FACTIONS.map((faction) => (
            <div key={faction.id} className="group p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all bg-white flex flex-col md:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  ${faction.relation === 'Friendly' ? 'bg-emerald-100 text-emerald-600' : 
                    faction.relation === 'Hostile' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                  {faction.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{faction.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Globe className="w-3 h-3" /> {faction.type}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Trust</div>
                  <div className={`font-mono font-bold ${
                     faction.trust > 70 ? 'text-emerald-600' : faction.trust < 30 ? 'text-red-600' : 'text-amber-600'
                  }`}>
                    {faction.trust}%
                  </div>
                </div>

                <div className="text-right min-w-[80px]">
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Status</div>
                  <div className="font-medium text-slate-700">{faction.status}</div>
                </div>

                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Message">
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  {faction.relation === 'Hostile' && (
                     <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Defenses">
                       <ShieldAlert className="w-5 h-5" />
                     </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
        
        {/* 底部提示 */}
        <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center gap-3 text-sm text-slate-500">
          <Users className="w-4 h-4" />
          <span>New factions will appear here as they are discovered by your exploration drones.</span>
        </div>

      </div>
    </div>
  );
}