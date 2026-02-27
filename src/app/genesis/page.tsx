export default function SpaceGenesis() {
  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center justify-center">
      <div className="text-center max-w-xl">
        <div className="inline-block px-3 py-1 border border-amber-500/50 text-amber-500 text-[10px] mb-6 animate-pulse">
          RESTRICTED AREA / 受限区域
        </div>
        <h2 className="text-4xl font-black mb-6 tracking-tighter uppercase italic">Space Genesis</h2>
        <p className="text-zinc-400 text-sm leading-relaxed mb-10">
          基于你的身份编码（SUNS），系统将计算并开辟专属的物理/虚拟重叠空间。此过程需要消耗大量的计算资源，请确保你的身份已完成 Genesis 激活。
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="p-6 border border-zinc-800 bg-zinc-900/30">
            <div className="text-2xl mb-2">🏙️</div>
            <div className="text-xs font-bold mb-1">Physical Node</div>
            <div className="text-[10px] text-zinc-500">物理节点映射</div>
          </div>
          <div className="p-6 border border-zinc-800 bg-zinc-900/30">
            <div className="text-2xl mb-2">🌐</div>
            <div className="text-xs font-bold mb-1">Virtual Realm</div>
            <div className="text-[10px] text-zinc-500">虚拟领地生成</div>
          </div>
        </div>

        <button className="px-12 py-4 bg-white text-black font-black hover:bg-amber-500 transition-colors uppercase tracking-widest text-xs">
          Initialize Creation / 初始化创造
        </button>
      </div>
    </div>
  );
}