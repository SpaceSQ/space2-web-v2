"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import html2canvas from 'html2canvas';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function IdentityMintPage() {
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<'DH' | 'AI' | null>(null);
  const [signed, setSigned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');
  
  // 引用最外层的黑色底座
  const cardRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    realName: '',
    idCard: '',
    address: '',
    birthDate: '',
    sequence: '' 
  });

  useEffect(() => {
    const init = async () => {
      const storedEmail = localStorage.getItem('userEmail');
      if (!storedEmail) {
        window.location.href = '/login';
        return;
      }
      setEmail(storedEmail);

      const randomSeq = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
      setFormData(prev => ({ ...prev, sequence: randomSeq }));

      const { data: existingIdentity } = await supabase
        .from('identity_registry_v1')
        .select('*')
        .eq('owner_email', storedEmail)
        .eq('identity_class', 'D')
        .maybeSingle();

      if (existingIdentity) {
        setResult(existingIdentity);
      }
    };
    init();
  }, []);

  const formatS2Slip = (raw: string) => {
    if (!raw || raw.length !== 24) return raw;
    return `${raw[0]}-${raw.slice(1,6)}-${raw.slice(6,12)}-${raw.slice(12,14)}-${raw.slice(14)}`;
  };

  const handleSequenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    setFormData(prev => ({ ...prev, sequence: val }));
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(''); 
    
    if (formData.sequence.length < 10) {
      setErrorMsg(`序列号长度不足！需 10 位。`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/mint-identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          mode: 'DH',
          customSequence: formData.sequence,
          ...formData
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        setResult(data.slip);
      } else {
        setErrorMsg(data.message || "铸造失败");
      }
    } catch (err: any) {
      setErrorMsg("网络连接超时");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 生成 JPG 图片并下载 (精确控制像素) 🔥
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    
    const btn = document.getElementById('download-btn');
    if(btn) btn.innerText = "Processing...";

    try {
      // 这里的配置：
      // 容器宽 760px * scale 2 = 1520px
      // 容器高 520px * scale 2 = 1040px
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000', // 强制底色为黑
        scale: 2, 
        useCORS: true,
        width: 760, // 强制读取这个宽度
        height: 520 // 强制读取这个高度
      });

      const image = canvas.toDataURL("image/jpeg", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `S2-Identity-${result.origin_field}.jpg`;
      link.click();
    } catch (err) {
      console.error("Image gen failed", err);
      alert("图片生成失败，请手动截图。");
    } finally {
      if(btn) btn.innerText = "DOWNLOAD CERTIFICATE (.JPG)";
    }
  };

  // ------------------------------------------------------------------
  // 1. 证书展示视图 (The Exact Layout View)
  // ------------------------------------------------------------------
  if (result) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-mono text-white">
      
      {/* 🔥 精确控制容器 (The Precise Frame) 🔥
         Style: width: 760px, height: 520px (对应 scale 2 后的 1520x1040)
         Class: 
           - flex items-center justify-center: 让内部卡片居中
           - pt-10 (40px): 顶部留出空间 (你的要求：顶部插入一行)
           - pl-10 (40px): 左侧留出空间 (你的要求：左侧两个字符空间)
           - pr-8, pb-8: 右下侧对称留白，保持平衡
           - bg-black: 黑色衬底
      */}
      <div 
        ref={cardRef} 
        className="relative bg-black flex items-center justify-center pt-10 pl-10 pr-8 pb-8 box-border"
        style={{ 
          width: '760px', 
          height: '520px',
        }}
      >
        
        {/* 内部真正的卡片 (The Card Content) - 宽度撑满剩余空间 */}
        <div className="w-full h-full bg-zinc-950 rounded-xl overflow-hidden border-2 border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col relative">
          
          {/* A. 顶部条: 品牌与Logo */}
          <div className="h-14 border-b border-emerald-500/20 bg-zinc-900/50 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {/* 小 Logo */}
              <div className="w-6 h-6 border border-emerald-500 rounded-sm flex items-center justify-center text-emerald-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              </div>
              <div>
                <h2 className="text-lg font-black italic tracking-tighter text-white leading-none">
                  SPACE² <span className="text-emerald-500">ID</span>
                </h2>
                <p className="text-[7px] text-zinc-500 uppercase tracking-widest leading-none mt-0.5">Embodied Digital Human Registry</p>
              </div>
            </div>
            {/* 顶部右侧：分类标签 */}
            <div className="px-3 py-1 bg-emerald-900/30 border border-emerald-500/30 rounded text-[9px] text-emerald-400 font-bold uppercase tracking-wide">
              Class D / Avatar
            </div>
          </div>

          {/* B. 主体内容区: 左图右文 */}
          <div className="flex-1 flex p-8 gap-8 relative items-center">
             {/* 背景水印 */}
             <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>

             {/* 左侧：智能方块 (Avatar) */}
             <div className="w-[30%] flex flex-col items-center justify-center border-r border-emerald-500/10 pr-8">
                <div className="w-32 h-32 relative flex items-center justify-center bg-black border border-emerald-500/30 rounded-lg shadow-inner overflow-hidden">
                   {/* 核心方块 */}
                   <div className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-blue-600 transform rotate-45 shadow-[0_0_30px_rgba(16,185,129,0.6)] z-10"></div>
                   {/* 动态网格背景 */}
                   <div className="absolute inset-0 border-t border-emerald-500/20 animate-[scan_4s_linear_infinite]"></div>
                   <p className="absolute bottom-2 text-[8px] text-emerald-500/50 uppercase font-bold tracking-widest">Biometric</p>
                </div>
             </div>

             {/* 右侧：详细信息 */}
             <div className="w-[70%] flex flex-col justify-center space-y-6 z-10">
                <div>
                   <label className="block text-[9px] text-zinc-500 uppercase font-bold mb-1">Registered Origin Name</label>
                   <div className="text-3xl font-black text-white uppercase tracking-wide border-b border-zinc-800 pb-2">{result.real_name}</div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div>
                      <label className="block text-[9px] text-zinc-500 uppercase font-bold mb-1">Identity Class</label>
                      <div className="text-base font-bold text-emerald-400">Digital Human</div>
                   </div>
                   <div>
                      <label className="block text-[9px] text-zinc-500 uppercase font-bold mb-1">Morphology</label>
                      <div className="text-base font-bold text-emerald-400">02 (Standard)</div>
                   </div>
                </div>

                <div>
                   <label className="block text-[9px] text-zinc-500 uppercase font-bold mb-1">Issue Date</label>
                   <div className="text-base font-mono text-zinc-300">
                      {result.created_at ? new Date(result.created_at).toLocaleDateString() : new Date().toLocaleDateString()}
                   </div>
                </div>
             </div>
          </div>

          {/* C. 底部条: 机器可读码与钢印 */}
          <div className="h-16 bg-zinc-900 border-t border-emerald-500/20 flex items-center justify-between px-8 relative overflow-hidden">
             {/* 底部绿色条纹 */}
             <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500"></div>

             {/* S2-SLIP 码 */}
             <div className="flex flex-col justify-center">
               <span className="text-[7px] text-zinc-600 uppercase tracking-widest mb-1">Universal Identifier (S2-SLIP)</span>
               <span className="font-mono text-xl text-emerald-400 font-black tracking-tighter leading-none">
                  {formatS2Slip(result.s2_slip_id)}
               </span>
             </div>

             {/* 钢印效果 */}
             <div className="w-12 h-12 rounded-full border-2 border-zinc-700 flex items-center justify-center opacity-20 transform rotate-[-15deg]">
               <span className="text-[7px] font-black text-center leading-tight text-white">SPACE<br/>SQ<br/>OFFICIAL</span>
             </div>
          </div>
          
        </div>
        
        {/* 外层衬底上的文字 (Padding区域的内容) */}
        <div className="absolute bottom-3 right-8 text-[8px] text-zinc-800 font-mono uppercase tracking-widest">
          Space² Digital Asset Verification
        </div>

      </div>

      {/* 按钮组 */}
      <div className="mt-8 flex flex-col gap-3 items-center">
         <button 
           id="download-btn"
           onClick={handleDownloadImage}
           className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2 rounded-sm"
         >
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
           Download Card (1520x1040)
         </button>
         
         <button onClick={() => window.location.href='/dashboard'} className="text-zinc-500 hover:text-white text-xs transition-colors">
           Return to Dashboard
         </button>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
      `}</style>
    </div>
  );

  // ------------------------------------------------------------------
  // 2. 初始申请页面 (Input View) - 保持不变
  // ------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-black text-white font-mono p-6 flex flex-col items-center pt-20">
      <h1 className="text-2xl font-black italic mb-2">IDENTITY MINTING</h1>
      <p className="text-xs text-zinc-500 mb-12">EMBODIED DIGITAL HUMAN REGISTRY</p>

      {!mode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
          <button onClick={() => setMode('DH')} className="group border border-emerald-500/40 bg-zinc-900/20 p-8 text-left hover:bg-emerald-500/10 transition-all">
            <div className="text-emerald-500 font-bold text-lg mb-2 group-hover:translate-x-1 transition-transform">
              I am a Human <span className="text-white text-sm block font-normal opacity-70">我是人类本尊</span>
            </div>
            <p className="text-[10px] text-zinc-500 leading-relaxed">
              申请“具身数字人”身份 (Class D)。<br/>
              需实名认证，作为您在数字空间的合法替身。
            </p>
          </button>

          <button disabled className="border border-zinc-800 bg-zinc-950 p-8 text-left opacity-40 cursor-not-allowed">
            <div className="text-zinc-500 font-bold text-lg mb-2">
              I am an AI <span className="text-zinc-600 text-sm block font-normal">我是硅基生命</span>
            </div>
            <p className="text-[10px] text-zinc-600 leading-relaxed">
              自主硅基生命通道 (Class V/E/F)。<br/>
              需通过 CREV 校验。(Coming Soon)
            </p>
          </button>
        </div>
      ) : (
        <div className="max-w-xl w-full border border-zinc-800 bg-zinc-950 p-8 animate-in fade-in slide-in-from-bottom-4">
          <button onClick={() => setMode(null)} className="text-[10px] text-zinc-500 hover:text-white mb-6">← BACK</button>
          
          <div className="mb-6">
            <h3 className="text-emerald-400 font-bold text-lg">Real-Name Anchoring</h3>
            <p className="text-[10px] text-zinc-500">根据白皮书规定，Class D 身份需绑定本尊实名信息。</p>
          </div>

          {!signed ? (
            <div className="space-y-6">
              <div className="h-64 overflow-y-auto bg-black border border-emerald-900/50 p-5 text-[10px] text-zinc-400 leading-relaxed font-sans scrollbar-thin scrollbar-thumb-emerald-900">
                <div className="mb-8 border-b border-zinc-800 pb-6">
                  <h4 className="font-bold text-emerald-500 text-xs mb-4 uppercase">Space² Embodied Digital Human (EDH) Platform Agreement</h4>
                  <p className="mb-3"><strong className="text-zinc-300">1. Identity Definition:</strong> The S2-SLIP (Class D) is a "Digital Avatar" of the Origin.</p>
                  <p className="mb-3"><strong className="text-zinc-300">2. Liability:</strong> The Origin assumes full legal responsibility.</p>
                  <p className="mb-3"><strong className="text-zinc-300">3. Privacy:</strong> Data is encrypted for compliance.</p>
                  <p><strong className="text-zinc-300">4. Immutability:</strong> The "Origin" field is permanently immutable.</p>
                </div>
                <div>
                  <h4 className="font-bold text-emerald-500 text-xs mb-4">Space² 具身数字人 (EDH) 平台协议与免责声明</h4>
                  <p className="mb-3"><strong className="text-zinc-300">1. 身份定义：</strong>S2-SLIP (Class D) 是本尊的数字替身。</p>
                  <p className="mb-3"><strong className="text-zinc-300">2. 责任归属：</strong>本尊承担全部法律责任。</p>
                  <p className="mb-3"><strong className="text-zinc-300">3. 隐私安全：</strong>实名信息将被加密。</p>
                  <p><strong className="text-zinc-300">4. 不可篡改：</strong>Origin 字段永久不可变更。</p>
                </div>
              </div>
              <div className="bg-emerald-900/10 border border-emerald-500/20 p-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center pt-1">
                    <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none border border-zinc-500 bg-black checked:border-emerald-500 checked:bg-emerald-500 transition-all" onChange={e => setSigned(e.target.checked)} />
                    <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-black opacity-0 peer-checked:opacity-100 pointer-events-none mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">I accept the Agreement / 我已阅读并同意上述协议</span>
                    <span className="text-[10px] text-zinc-500">By checking this box, I legally bind my real-world identity to this S2-SLIP.</span>
                  </div>
                </label>
              </div>
            </div>
          ) : (
            <form onSubmit={handleMint} className="space-y-4">
              <div>
                <label className="block text-[9px] text-zinc-500 uppercase mb-1">Full Real Name (Pinyin/English)</label>
                <input required type="text" placeholder="ZHANG DAMING" className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-emerald-500 outline-none uppercase" onChange={e => setFormData({...formData, realName: e.target.value})} />
              </div>
              <div>
                <label className="block text-[9px] text-zinc-500 uppercase mb-1">ID Card / Passport No.</label>
                <input required type="text" placeholder="G12345678" className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-emerald-500 outline-none" onChange={e => setFormData({...formData, idCard: e.target.value})} />
              </div>
              <div className="p-4 border border-emerald-500/20 bg-emerald-900/5 mt-4">
                <label className="block text-[9px] text-emerald-500 uppercase mb-2 flex justify-between">
                  <span>Custom Sequence (Optional)</span>
                  <span className={formData.sequence.length === 10 ? "text-emerald-400" : "text-red-500"}>{formData.sequence.length} / 10</span>
                </label>
                <input type="text" value={formData.sequence} placeholder="10-digit number" className="w-full bg-black border border-zinc-700 p-3 text-sm text-emerald-400 font-mono tracking-widest focus:border-emerald-500 outline-none" onChange={handleSequenceChange} />
                <p className="text-[9px] text-zinc-500 mt-2">* 默认随机。您可以输入您的幸运数字，必须精确为 10 位。</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[9px] text-zinc-500 uppercase mb-1">Birth Date</label>
                    <input required type="date" className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-emerald-500 outline-none" onChange={e => setFormData({...formData, birthDate: e.target.value})} />
                 </div>
                 <div>
                    <label className="block text-[9px] text-zinc-500 uppercase mb-1">Current Address</label>
                    <input required type="text" placeholder="City, Country" className="w-full bg-black border border-zinc-700 p-3 text-sm text-white focus:border-emerald-500 outline-none" onChange={e => setFormData({...formData, address: e.target.value})} />
                 </div>
              </div>
              {errorMsg && (
                <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-400 text-xs text-center font-bold animate-pulse">
                  ❌ ERROR: {errorMsg}
                </div>
              )}
              <button disabled={loading} className="w-full mt-4 py-4 bg-emerald-600 hover:bg-emerald-500 text-black font-black text-xs uppercase tracking-widest transition-all">
                {loading ? "Generating S2-SLIP..." : "Mint Identity"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}