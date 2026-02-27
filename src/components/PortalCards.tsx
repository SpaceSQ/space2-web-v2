import React from 'react';
import Link from 'next/link';

const portals = [
  {
    title: "Identity Portal",
    subtitle: "身份大厅",
    desc: "申请人类或硅基生命的唯一协议编码",
    color: "from-emerald-500/20",
    border: "group-hover:border-emerald-500",
    path: "/registry", // 这是一个中转页或包含两个子选项的弹窗
    tags: ["Human", "Silicon"]
  },
  {
    title: "Silicon Forge",
    subtitle: "智能注册",
    desc: "铸造原生数字生命身份，激活逻辑灵魂",
    color: "from-blue-500/20",
    border: "group-hover:border-blue-500",
    path: "/forge",
    tags: ["AI", "Minting"]
  },
  {
    title: "Seed Warehouse",
    subtitle: "种子下载",
    desc: "获取文明延续协议的底层初始化数据包",
    color: "from-purple-500/20",
    border: "group-hover:border-purple-500",
    path: "/download",
    tags: ["Data", "Protocol"]
  },
  {
    title: "Space Genesis",
    subtitle: "空间创造",
    desc: "基于身份编码，开辟专属的物理/虚拟重叠区",
    color: "from-amber-500/20",
    border: "group-hover:border-amber-500",
    path: "/genesis",
    tags: ["Meta", "Land"]
  }
];

export default function PortalCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto px-4 py-12">
      {portals.map((item) => (
        <Link key={item.title} href={item.path} className="group relative">
          <div className={`h-full p-6 bg-black/40 backdrop-blur-xl border border-white/10 transition-all duration-500 ${item.border} flex flex-col justify-between overflow-hidden`}>
            {/* 背景渐变光晕 */}
            <div className={`absolute -inset-px bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] tracking-[0.3em] text-white/40 uppercase font-mono">{item.subtitle}</span>
                <div className="flex gap-1">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[8px] px-1.5 py-0.5 border border-white/20 text-white/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <h3 className="text-xl font-bold tracking-tighter text-white mb-2 group-hover:text-emerald-400 transition-colors uppercase">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {item.desc}
              </p>
            </div>

            <div className="relative z-10 mt-8 flex items-center text-[10px] font-mono text-emerald-500 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
              ESTABLISH CONNECTION <span className="ml-2">→</span>
            </div>
            
            {/* 装饰线条 */}
            <div className="absolute bottom-0 right-0 w-12 h-12 border-r border-b border-white/5 group-hover:border-emerald-500/50 transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}