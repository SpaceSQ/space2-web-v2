"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { QRCodeCanvas } from 'qrcode.react'; // 🔥 引入二维码引擎

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PublicSunsPage() {
  const params = useParams();
  const rawSunsCode = Array.isArray(params.sunsCode) ? params.sunsCode[0] : params.sunsCode;
  const decodedSunsCode = decodeURIComponent(rawSunsCode || '');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sunsData, setSunsData] = useState<any>(null);
  const [identityData, setIdentityData] = useState<any>(null);
  const [currentUrl, setCurrentUrl] = useState(''); // 用于存储当前页面的完整 URL

  useEffect(() => {
    // 获取当前浏览器的完整 URL，喂给二维码引擎
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }

    if (!decodedSunsCode) return;

    const fetchHologramData = async () => {
      try {
        setLoading(true);
        const { data: sunsRes, error: sunsErr } = await supabase
          .from('suns_registry_v1')
          .select('*')
          .ilike('full_suns_code', decodedSunsCode) 
          .maybeSingle(); 

        if (sunsErr || !sunsRes) {
          setError(true);
        } else {
          setSunsData(sunsRes);
          setError(false);

          const { data: idRes } = await supabase
            .from('identity_registry_v1')
            .select('s2_slip_id, real_name, created_at')
            .eq('owner_email', sunsRes.owner_email)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          if (idRes) {
            setIdentityData(idRes);
          }
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHologramData();
  }, [decodedSunsCode]);

  // 隐藏姓名
  const maskName = (name: string) => {
    if (!name) return 'CLASSIFIED';
    if (name.length <= 2) return name[0] + '*';
    return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  };

  // 🔥 隐藏身份编号后六位 (零知识证明护盾)
  const maskIdentity = (id: string) => {
    if (!id) return 'UNKNOWN_CORE';
    if (id.length <= 6) return '******';
    return id.slice(0, -6) + '******';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-emerald-500">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-[10px] tracking-widest animate-pulse font-bold uppercase">Acquiring Data...</div>
      </div>
    );
  }

  if (error || !sunsData) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-red-500 p-6 text-center">
        <h1 className="text-5xl mb-2 font-black tracking-tighter">404</h1>
        <div className="text-xs font-bold tracking-widest uppercase mb-4">Void Sector</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-mono flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 极简背景 */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0"></div>

      {/* 终极名片大小调整 */}
      <div className="w-full max-w-2xl border border-emerald-900/40 bg-zinc-950/80 relative z-10 shadow-[0_0_40px_rgba(16,185,129,0.05)] backdrop-blur-md flex flex-col">
        
        {/* 卡片顶栏 */}
        <div className="h-6 bg-emerald-950/30 border-b border-emerald-900/40 flex items-center justify-between px-3">
          <div className="flex gap-2 items-center">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-[7px] text-emerald-500 tracking-[0.2em] uppercase font-bold">Space² Public Record</span>
          </div>
          <span className="text-[7px] text-zinc-600 tracking-widest">L4 ID CARD</span>
        </div>

        {/* 卡片主体 */}
        <div className="p-6 md:p-8 flex flex-col gap-6 relative">
          
          {/* 🔥 右上角：跃迁二维码 (QR Code) 🔥 */}
          <div className="absolute top-6 right-6 md:top-8 md:right-8 p-1 bg-white border-2 border-emerald-500/50 hover:border-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            {currentUrl && (
              <QRCodeCanvas 
                value={currentUrl} 
                size={64} // 大小适中，刚好能被手机扫出
                bgColor={"#ffffff"} 
                fgColor={"#000000"} 
                level={"L"} 
              />
            )}
          </div>

          {/* 上半部：地址核心 */}
          <div className="flex flex-col items-start border-b border-zinc-900/50 pb-6 pr-20 relative">
            <p className="text-[8px] text-zinc-500 uppercase tracking-[0.2em] mb-2 font-bold flex items-center gap-2">
              {/* 保留你喜欢的 60px 霸气图标 */}
              <svg style={{ width: '60px', height: '60px', flexShrink: 0 }} className="text-emerald-500 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              Sovereign Anchor
            </p>
            
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-white mb-3" style={{ textShadow: '0 0 15px rgba(16,185,129,0.2)' }}>
              {sunsData.full_suns_code}
            </h1>
            
            <div className="flex gap-4">
              <div>
                <div className="text-[7px] text-zinc-500 uppercase tracking-widest mb-0.5">Volume</div>
                <div className="text-[10px] text-emerald-400 font-bold">{sunsData.total_area} m³</div>
              </div>
              <div className="w-[1px] h-4 bg-zinc-800 self-center"></div>
              <div>
                <div className="text-[7px] text-zinc-500 uppercase tracking-widest mb-0.5">Status</div>
                <div className="text-[10px] text-emerald-400 font-bold">ACTIVE</div>
              </div>
            </div>
          </div>

          {/* 下半部：身份信息 (带有隐私护盾) */}
          <div className="flex flex-col">
            <h3 className="text-[8px] text-blue-400/80 uppercase tracking-[0.2em] mb-3 font-bold flex items-center gap-1.5">
              <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
              Owner Identity
            </h3>

            {identityData ? (
              <div className="flex justify-between items-center bg-zinc-900/30 border border-zinc-800/50 p-3">
                <div>
                  <div className="text-[7px] text-zinc-500 uppercase mb-0.5 tracking-wider">S2-SLIP Core</div>
                  {/* 🔥 调用隐私打码函数 🔥 */}
                  <div className="text-xs font-bold text-blue-400 tracking-wider">
                    {maskIdentity(identityData.s2_slip_id)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[7px] text-zinc-500 uppercase mb-0.5 tracking-wider">Entity</div>
                  <div className="text-[9px] text-zinc-300 font-bold">{maskName(identityData.real_name)} <span className="text-zinc-600">| Class D</span></div>
                </div>
              </div>
            ) : (
              <div className="border border-zinc-800/50 bg-zinc-900/30 p-3 flex items-center gap-3">
                <div className="text-yellow-600 font-black text-sm">⚠</div>
                <div>
                  <div className="text-[8px] text-yellow-500 uppercase tracking-widest font-bold">Unclaimed Identity</div>
                  <div className="text-[7px] text-zinc-500 mt-0.5">Awaiting S2-SLIP generation for this anchor.</div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}