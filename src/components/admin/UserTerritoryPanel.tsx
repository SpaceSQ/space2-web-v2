'use client';
import React from 'react';
import { Map } from 'lucide-react';

export default function UserTerritoryPanel() {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Map className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-bold text-slate-900">Territory</h2>
      </div>
      <div className="p-10 bg-slate-50 rounded border-2 border-dashed border-slate-200 text-center text-slate-500">
        No territories claimed via Genesis Protocol yet.
      </div>
    </div>
  );
}