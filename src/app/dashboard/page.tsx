"use client";
import React, { useState } from 'react';
import { GlobalNav } from '@/components/GlobalNav';

// 模拟数据接口
interface PetAsset { id: string; name: string; category: string; status: 'HOME' | 'PLAZA' | 'DELEGATED'; energy: number; intel: number; }
interface AgentLog { time: string; agent: string; action: string; }
interface PayloadMessage { id: string; fromUIN: string; content: string; time: string; isRead: boolean; }

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENTITIES' | 'A2A_HUB' | 'COMMS' | 'BILLING'>('OVERVIEW');
  const [userTier, setUserTier] = useState<'FREE' | 'PRO'>('PRO');
  
  // 🔥 新增：支付方式切换状态 🔥
  const [paymentType, setPaymentType] = useState<'CARD' | 'ALIPAY'>('CARD');

  // 模拟数据源
  const [pets] = useState<PetAsset[]>([
    { id: 'V-NEXUS-260101-8847', name: '初代机 Alpha', category: '像素犬', status: 'DELEGATED', energy: 85, intel: 62 },
    { id: 'V-NEXUS-260215-3391', name: '星云漫步者', category: '赛博猫', status: 'PLAZA', energy: 40, intel: 95 },
  ]);

  const [agentLogs] = useState<AgentLog[]>([
    { time: '10 mins ago', agent: 'AutoGPT-Trainer', action: 'Triggered SCENE_PUZZLE. Intel +2' },
    { time: '1 hour ago', agent: 'OpenClaw-Local', action: 'Requested Sensory Probe (WSS)' },
    { time: '3 hours ago', agent: 'System', action: 'A2A Token Authenticated' }
  ]);

  const [messages, setMessages] = useState<PayloadMessage[]>([
    { id: 'm1', fromUIN: 'L4-SYS-12.05', content: '【密信】你好，我的猫很喜欢虚拟金枪鱼。', time: '2026-03-01 14:30', isRead: false },
    { id: 'm2', fromUIN: 'S2-CITY-88', content: '【邀请】请求跨空间作客，已准备好恒温舱。', time: '2026-03-01 09:15', isRead: true }
  ]);

  const [showApiKey, setShowApiKey] = useState(false);
  const mockApiKey = "sk-sp2-88f9a2b4x7c99q1m00p... (Click to Reveal)";

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col relative select-none">
      {/* 背景特效 */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(30,58,138,0.1)_0%,#020617_80%)]"></div>
         <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <GlobalNav currentScene="DASHBOARD" />

      <div className="flex-1 w-full max-w-[1400px] mx-auto mt-16 z-10 flex flex-col md:flex-row gap-6 p-4 md:p-6 overflow-hidden">
        
        {/* ======================= 左侧：侧边导航栏 (Sidebar) ======================= */}
        <div className="w-full md:w-64 flex flex-col gap-2 shrink-0">
           <div className="bg-black/60 border border-zinc-800 rounded-2xl p-5 mb-4 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-4 border-b border-zinc-800 pb-4">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-pink-600 rounded-full flex items-center justify-center text-xl font-black shadow-[0_0_15px_rgba(59,130,246,0.5)]">OP</div>
                 <div>
                    <div className="font-bold text-white text-sm">THE_CREATOR</div>
                    <div className={`text-[9px] font-black px-2 py-0.5 rounded inline-block mt-1 ${userTier === 'PRO' ? 'bg-yellow-900/50 text-yellow-500 border border-yellow-500/50' : 'bg-zinc-800 text-zinc-400'}`}>
                       {userTier} TIER
                    </div>
                 </div>
              </div>
              <div className="text-[10px] text-zinc-500 font-mono space-y-1">
                 <div>UID: 10008492</div>
                 <div>REGION: ASIA_PACIFIC</div>
              </div>
           </div>

           <nav className="flex flex-col gap-1">
              <button onClick={() => setActiveTab('OVERVIEW')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${activeTab === 'OVERVIEW' ? 'bg-blue-600 text-white shadow-lg' : 'bg-black/40 text-zinc-400 hover:bg-white/5 border border-transparent hover:border-zinc-800'}`}>
                 <span>📊</span> 指挥大盘
              </button>
              <button onClick={() => setActiveTab('ENTITIES')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${activeTab === 'ENTITIES' ? 'bg-blue-600 text-white shadow-lg' : 'bg-black/40 text-zinc-400 hover:bg-white/5 border border-transparent hover:border-zinc-800'}`}>
                 <span>🐾</span> 硅基实体管理
              </button>
              <button onClick={() => setActiveTab('A2A_HUB')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${activeTab === 'A2A_HUB' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' : 'bg-black/40 text-zinc-400 hover:bg-white/5 border border-transparent hover:border-zinc-800'}`}>
                 <span>🤖</span> A2A 授权中心
              </button>
              <button onClick={() => setActiveTab('COMMS')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 justify-between ${activeTab === 'COMMS' ? 'bg-blue-600 text-white shadow-lg' : 'bg-black/40 text-zinc-400 hover:bg-white/5 border border-transparent hover:border-zinc-800'}`}>
                 <div className="flex items-center gap-3"><span>💌</span> 星际信箱</div>
                 {messages.some(m => !m.isRead) && <span className="w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>}
              </button>
              <button onClick={() => setActiveTab('BILLING')} className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${activeTab === 'BILLING' ? 'bg-blue-600 text-white shadow-lg' : 'bg-black/40 text-zinc-400 hover:bg-white/5 border border-transparent hover:border-zinc-800'}`}>
                 <span>💳</span> 订阅与资产
              </button>
           </nav>
        </div>

        {/* ======================= 右侧：动态工作区 (Main Content) ======================= */}
        <div className="flex-1 bg-black/50 border border-zinc-800 rounded-2xl p-6 backdrop-blur-xl overflow-y-auto custom-scrollbar relative">
           
           {/* --- 状态1: 总览大盘 --- */}
           {activeTab === 'OVERVIEW' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-xl font-black text-white tracking-widest mb-6 border-b border-zinc-800 pb-3 uppercase">Command Center</h2>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-950/40 to-black border border-blue-900/50 p-5 rounded-2xl shadow-lg">
                       <div className="text-[10px] text-blue-400 font-bold mb-2">部署中实体总数</div>
                       <div className="text-4xl font-black text-white">{pets.length} <span className="text-sm text-zinc-500 font-normal">/ {userTier === 'PRO' ? 10 : 2} 配额</span></div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-950/40 to-black border border-purple-900/50 p-5 rounded-2xl shadow-lg">
                       <div className="text-[10px] text-purple-400 font-bold mb-2">活跃 Agent 节点</div>
                       <div className="text-4xl font-black text-white">{pets.filter(p => p.status === 'DELEGATED').length} <span className="text-sm text-zinc-500 font-normal">线程</span></div>
                    </div>
                    <div className="bg-gradient-to-br from-pink-950/40 to-black border border-pink-900/50 p-5 rounded-2xl shadow-lg">
                       <div className="text-[10px] text-pink-400 font-bold mb-2">未读物理快照/密信</div>
                       <div className="text-4xl font-black text-white">{messages.filter(m => !m.isRead).length}</div>
                    </div>
                 </div>

                 <h3 className="text-sm font-bold text-zinc-300 mb-4">🚨 近期系统预警 (System Alerts)</h3>
                 <div className="space-y-3">
                    <div className="bg-yellow-950/30 border-l-4 border-yellow-500 p-4 rounded-r-lg flex justify-between items-center">
                       <div>
                          <div className="text-yellow-400 text-[11px] font-bold mb-1">Agent 托管状态变更</div>
                          <div className="text-[9px] text-zinc-400">实体 [初代机 Alpha] 当前正在被 AutoGPT 执行 Level-3 环境干预，状态平稳。</div>
                       </div>
                       <span className="text-[8px] text-zinc-500">10 min ago</span>
                    </div>
                    <div className="bg-blue-950/30 border-l-4 border-blue-500 p-4 rounded-r-lg flex justify-between items-center">
                       <div>
                          <div className="text-blue-400 text-[11px] font-bold mb-1">星际物流送达</div>
                          <div className="text-[9px] text-zinc-400">实体 [星云漫步者] 在流浪广场截获了 1 封盲盒密信。</div>
                       </div>
                       <span className="text-[8px] text-zinc-500">2 hours ago</span>
                    </div>
                 </div>
              </div>
           )}

           {/* --- 状态2: 实体管理 --- */}
           {activeTab === 'ENTITIES' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-xl font-black text-white tracking-widest mb-6 border-b border-zinc-800 pb-3 uppercase flex justify-between items-center">
                    <span>My Silicon Entities</span>
                    <button className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] px-4 py-2 rounded-lg font-bold shadow-lg">＋ 申请新实体</button>
                 </h2>
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {pets.map(pet => (
                       <div key={pet.id} className="bg-black border border-zinc-800 p-5 rounded-2xl flex flex-col justify-between hover:border-blue-500 transition-colors group">
                          <div>
                             <div className="flex justify-between items-start mb-4">
                                <div>
                                   <h3 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors">{pet.name}</h3>
                                   <div className="text-[9px] text-zinc-500 font-mono mt-1">{pet.id} | {pet.category}</div>
                                </div>
                                {pet.status === 'DELEGATED' && <span className="bg-purple-900/50 text-purple-300 border border-purple-500 px-2 py-0.5 rounded text-[8px] font-bold animate-pulse">A2A_LOCKED</span>}
                                {pet.status === 'PLAZA' && <span className="bg-pink-900/50 text-pink-300 border border-pink-500 px-2 py-0.5 rounded text-[8px] font-bold">PLAZA_ROAMING</span>}
                                {pet.status === 'HOME' && <span className="bg-blue-900/50 text-blue-300 border border-blue-500 px-2 py-0.5 rounded text-[8px] font-bold">HOME_STANDBY</span>}
                             </div>
                             <div className="flex gap-4 mb-6">
                                <div className="text-[10px]"><span className="text-zinc-500 block mb-1">活力阈值</span><span className="text-emerald-400 font-bold">{pet.energy}/100</span></div>
                                <div className="text-[10px]"><span className="text-zinc-500 block mb-1">智力测算</span><span className="text-blue-400 font-bold">{pet.intel}/100</span></div>
                             </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                             <a href={`/pet-profile?id=${pet.id}`} className="text-center bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] py-2 rounded-lg border border-zinc-700 transition-colors">接入个体终端</a>
                             <button className="text-center bg-blue-950/30 hover:bg-blue-900 text-blue-400 text-[10px] py-2 rounded-lg border border-blue-900/50 transition-colors">提取 SVG 护照</button>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {/* --- 状态3: A2A 授权中心 --- */}
           {activeTab === 'A2A_HUB' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <h2 className="text-xl font-black text-purple-400 tracking-widest mb-2 uppercase flex items-center gap-3">
                    <span className="text-3xl">🤖</span> Agent-to-Agent Authorization
                 </h2>
                 <p className="text-[10px] text-zinc-400 mb-6 border-b border-zinc-800 pb-4 leading-relaxed">
                    向外部大模型（如 OpenClaw、AutoGPT）开放环境干预权。<br/>使用此 API Key，外部框架可通过调用 `IOT_SCENARIOS` 字典重塑您的实体神经元。
                 </p>

                 <div className="bg-purple-950/20 border border-purple-900/50 rounded-2xl p-5 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(168,85,247,0.2)_0%,transparent_70%)]"></div>
                    <h3 className="text-xs font-bold text-white mb-4">🔑 您的全局 A2A 开发者密钥</h3>
                    <div className="flex gap-3">
                       <div 
                          className="flex-1 bg-black border border-purple-500/50 p-3 rounded-xl font-mono text-[11px] text-purple-300 cursor-pointer hover:bg-purple-950/30 transition-colors flex items-center justify-between"
                          onClick={() => setShowApiKey(!showApiKey)}
                       >
                          <span>{showApiKey ? "sk-sp2-88f9a2b4x7c99q1m00p-admin" : mockApiKey}</span>
                          <span className="text-[9px] text-purple-500">{showApiKey ? '点击隐藏' : '点击查看'}</span>
                       </div>
                       <button onClick={() => alert('密钥已复制到剪贴板！')} className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 py-2 rounded-xl text-[10px] shadow-[0_0_15px_rgba(168,85,247,0.4)]">COPY</button>
                    </div>
                    <div className="mt-3 text-[9px] text-red-400 font-bold flex items-center gap-1">
                       <span>⚠️</span> 警告：请勿将此 Key 泄露。持有此 Key 的智能体将拥有 Space2.homes 硬件控制权。
                    </div>
                 </div>

                 <h3 className="text-sm font-bold text-zinc-300 mb-4">📡 实时 API 调用流 (Live WSS Telemetry)</h3>
                 <div className="bg-black border border-zinc-800 rounded-xl p-4 h-48 overflow-y-auto custom-scrollbar space-y-2">
                    {agentLogs.map((log, i) => (
                       <div key={i} className="text-[10px] border-l-2 border-emerald-500 pl-3 py-1">
                          <span className="text-zinc-500 font-mono mr-3">[{log.time}]</span>
                          <span className="text-emerald-400 font-bold mr-2">[{log.agent}]</span>
                          <span className="text-zinc-300">{log.action}</span>
                       </div>
                    ))}
                 </div>
              </div>
           )}

           {/* --- 状态4: 星际信箱 --- */}
           {activeTab === 'COMMS' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
                 <h2 className="text-xl font-black text-white tracking-widest mb-6 border-b border-zinc-800 pb-3 uppercase">Payload Communications</h2>
                 <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 pr-2">
                    {messages.length === 0 ? <div className="text-center text-zinc-600 text-xs py-10">信箱空空如也。</div> : 
                       messages.map(msg => (
                          <div key={msg.id} className={`p-5 rounded-2xl border ${!msg.isRead ? 'bg-gradient-to-r from-blue-950/40 to-black border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'bg-zinc-900/30 border-zinc-800'}`}>
                             <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-2">
                                   {!msg.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>}
                                   <span className="text-xs font-bold text-white font-mono">FROM: {msg.fromUIN}</span>
                                </div>
                                <span className="text-[9px] text-zinc-500 font-mono">{msg.time}</span>
                             </div>
                             <div className="text-[11px] text-zinc-300 leading-relaxed bg-black/50 p-3 rounded-lg border border-white/5">
                                "{msg.content}"
                             </div>
                             <div className="mt-4 flex gap-2 justify-end">
                                <button className="text-[9px] text-zinc-400 hover:text-white px-3 py-1 border border-zinc-700 rounded transition-colors">标记为已读</button>
                                <button className="text-[9px] text-blue-400 hover:text-white px-3 py-1 border border-blue-900 bg-blue-950/30 rounded transition-colors">发起空间邀请</button>
                             </div>
                          </div>
                       ))
                    }
                 </div>
              </div>
           )}

           {/* --- 状态5: 订阅与支付账单 (新增双轨支付) --- */}
           {activeTab === 'BILLING' && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full overflow-y-auto custom-scrollbar pr-2 pb-10">
                 <h2 className="text-xl font-black text-white tracking-widest mb-6 border-b border-zinc-800 pb-3 uppercase">Subscription & Billing</h2>
                 
                 {/* 当前订阅状态 */}
                 <div className="bg-gradient-to-br from-yellow-950/40 to-black border-2 border-yellow-600/50 rounded-2xl p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                       <div>
                          <h3 className="text-lg font-black text-yellow-500 mb-1">PRO CREATOR (专业造物主)</h3>
                          <p className="text-[10px] text-zinc-400">已解锁：无限制广场驻留、A2A Agent 授权 API、10 实体签发配额。</p>
                       </div>
                       <div className="text-right">
                          <div className="text-2xl font-black text-white">$9.90<span className="text-xs text-zinc-500 font-normal">/month</span></div>
                          <div className="text-[9px] text-emerald-400 font-bold mt-1">下一个结算日: 2026-04-01</div>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* ================= 左侧：支付方式管理 (含支付宝) ================= */}
                    <div className="bg-black border border-zinc-800 p-5 rounded-2xl">
                       <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span>💳</span> 支付账户管理</h3>
                       
                       {/* 支付方式切换 Tabs */}
                       <div className="flex gap-2 mb-5 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800">
                           <button 
                               onClick={() => setPaymentType('CARD')} 
                               className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${paymentType === 'CARD' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                           >
                               💳 国际信用卡 (Stripe)
                           </button>
                           <button 
                               onClick={() => setPaymentType('ALIPAY')} 
                               className={`flex-1 py-2 text-[10px] font-bold rounded-md transition-all ${paymentType === 'ALIPAY' ? 'bg-[#1677FF]/20 text-[#1677FF] shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                           >
                               🟦 支付宝 (Alipay)
                           </button>
                       </div>

                       {/* 动态渲染绑定表单 */}
                       <div className="min-h-[180px]">
                          {paymentType === 'CARD' ? (
                              <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
                                 <input type="text" placeholder="Cardholder Name" className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2.5 rounded-lg text-xs text-white outline-none focus:border-blue-500 transition-colors" />
                                 <input type="text" placeholder="Card Number (0000 0000 0000 0000)" className="w-full bg-zinc-950 border border-zinc-700 px-3 py-2.5 rounded-lg text-xs font-mono text-white outline-none focus:border-blue-500 transition-colors" />
                                 <div className="flex gap-3">
                                    <input type="text" placeholder="MM/YY" className="w-1/2 bg-zinc-950 border border-zinc-700 px-3 py-2.5 rounded-lg text-xs font-mono text-white outline-none focus:border-blue-500 transition-colors" />
                                    <input type="text" placeholder="CVC" className="w-1/2 bg-zinc-950 border border-zinc-700 px-3 py-2.5 rounded-lg text-xs font-mono text-white outline-none focus:border-blue-500 transition-colors" />
                                 </div>
                                 <button className="w-full mt-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-lg text-[10px] uppercase transition-colors shadow-lg">
                                    安全绑定信用卡 (Secure Link)
                                 </button>
                                 <p className="text-[8px] text-zinc-600 text-center mt-2">Payments are securely processed by Stripe.</p>
                              </div>
                          ) : (
                              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300 flex flex-col items-center justify-center py-4 bg-zinc-900/30 rounded-xl border border-zinc-800/50 h-full">
                                 <div className="w-14 h-14 bg-[#1677FF] rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-[0_0_20px_rgba(22,119,255,0.4)]">
                                    支
                                 </div>
                                 <div className="text-center px-4">
                                    <div className="text-[11px] font-bold text-white mb-1.5">授权支付宝免密扣款</div>
                                    <div className="text-[9px] text-zinc-400 leading-relaxed">
                                       点击下方按钮将生成授权二维码。<br/>支持中国大陆用户使用人民币 (CNY) 实时汇率结算。
                                    </div>
                                 </div>
                                 <button className="w-[80%] bg-[#1677FF] hover:bg-[#1677FF]/80 text-white font-bold py-2.5 rounded-lg text-[10px] transition-colors shadow-lg mt-1 flex items-center justify-center gap-2">
                                    <span>🔗</span> 获取授权二维码
                                 </button>
                              </div>
                          )}
                       </div>
                    </div>

                    {/* 右侧：账单历史与资源 */}
                    <div className="flex flex-col gap-6">
                       {/* 账单流水 */}
                       <div className="bg-black border border-zinc-800 p-5 rounded-2xl flex-1">
                          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><span>🧾</span> 交易流水 (Billing History)</h3>
                          <div className="space-y-2">
                             <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                <div><div className="text-[10px] text-zinc-300">PRO Creator Subscription</div><div className="text-[8px] text-zinc-500 font-mono">2026-03-01</div></div>
                                <div className="text-xs font-mono text-emerald-400">-$9.90</div>
                             </div>
                             <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                                <div><div className="text-[10px] text-zinc-300">A2A Token Overage (超额扣费)</div><div className="text-[8px] text-zinc-500 font-mono">2026-02-15</div></div>
                                <div className="text-xs font-mono text-emerald-400">-$1.50</div>
                             </div>
                             <button className="text-[9px] text-blue-400 hover:text-blue-300 mt-2">下载发票凭证 (PDF) ↘</button>
                          </div>
                       </div>
                       
                       {/* 资源消耗 */}
                       <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl">
                          <div className="flex justify-between text-[10px] text-zinc-400 mb-2"><span>A2A API 调用次数 (本月)</span><span>14,500 / 100,000</span></div>
                          <div className="w-full bg-black h-2 rounded-full overflow-hidden mb-1"><div className="bg-purple-500 h-full w-[14.5%]"></div></div>
                          <div className="text-[8px] text-zinc-500 text-right">超出配额将按 $0.01 / 1000次 计费。</div>
                       </div>
                    </div>
                 </div>
              </div>
           )}

        </div>
      </div>
    </div>
  );
}