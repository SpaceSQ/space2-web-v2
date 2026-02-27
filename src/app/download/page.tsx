import React from 'react';

const SEED_FILES = [
  { name: "Genesis_Protocol_v1.0.seed", size: "1.2MB", type: "Core" },
  { name: "Suns_Registry_Map.data", size: "450KB", type: "Index" },
  { name: "Civilization_OS_Beta.zip", size: "12GB", type: "System" },
];

export default function SeedWarehouse() {
  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full border border-purple-500/30 p-8 bg-zinc-900/50">
        <h2 className="text-2xl font-bold mb-2 text-purple-400 uppercase">Seed Warehouse</h2>
        <p className="text-xs text-zinc-500 mb-8 tracking-widest">文明种子与底层协议初始化包</p>

        <div className="space-y-4">
          {SEED_FILES.map(file => (
            <div key={file.name} className="flex items-center justify-between p-4 border border-zinc-800 hover:bg-white/5 transition-colors group">
              <div>
                <div className="text-sm font-bold group-hover:text-purple-300">{file.name}</div>
                <div className="text-[10px] text-zinc-600">{file.type} | {file.size}</div>
              </div>
              <button className="text-[10px] border border-zinc-700 px-4 py-2 hover:border-purple-500 hover:text-purple-400">
                DOWNLOAD
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}