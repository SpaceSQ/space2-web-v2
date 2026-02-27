'use client';

import React, { useState, useEffect } from 'react';
import { 
  Code, Upload, FileJson, Package, Shield, 
  AlertTriangle, CheckCircle, XCircle, Loader2, Coins, Lock 
} from 'lucide-react';

// === 数据结构 ===
export type ReviewStatus = 'PENDING' | 'RECOMMENDED' | 'APPROVED' | 'REJECTED' | 'LOCKED';

export interface CodeSubmission {
  id: string;
  title: string;
  description: string;
  type: 'SNIPPET' | 'PACKAGE';
  size: number; // bytes
  status: ReviewStatus;
  rejectionCount: number; // 连续被拒次数
  nbtReward: number;
  submittedAt: string;
  feedback?: string; // 管理员反馈
}

export default function GenesisCodeLab() {
  const [activeTab, setActiveTab] = useState<'submit' | 'my_codes'>('submit');
  const [submissions, setSubmissions] = useState<CodeSubmission[]>([]);
  
  // 表单状态
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [codeType, setCodeType] = useState<'SNIPPET' | 'PACKAGE'>('SNIPPET');
  const [sourceCode, setSourceCode] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 初始化加载
  useEffect(() => {
    const saved = localStorage.getItem('USER_SUBMISSIONS');
    if (saved) setSubmissions(JSON.parse(saved));
  }, []);

  // 核心逻辑：提交代码
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 1. 大小校验
    if (codeType === 'SNIPPET') {
      const sizeKB = new Blob([sourceCode]).size / 1024;
      if (sizeKB > 500) {
        setError('Source code exceeds 500KB limit. Please use Package upload.');
        return;
      }
    } else {
      if (!file) {
        setError('Please upload a ZIP file.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) { // 2MB
        setError('Package size exceeds 2MB limit.');
        return;
      }
      if (!file.name.endsWith('.zip')) {
        setError('Only .zip files are allowed.');
        return;
      }
    }

    setIsSubmitting(true);

    // 2. 模拟上传与保存
    setTimeout(() => {
      const newSub: CodeSubmission = {
        id: `CODE-${Date.now()}`,
        title,
        description: desc,
        type: codeType,
        size: codeType === 'SNIPPET' ? new Blob([sourceCode]).size : (file?.size || 0),
        status: 'PENDING',
        rejectionCount: 0,
        nbtReward: 0,
        submittedAt: new Date().toISOString()
      };

      const updatedList = [newSub, ...submissions];
      setSubmissions(updatedList);
      localStorage.setItem('USER_SUBMISSIONS', JSON.stringify(updatedList));
      
      const allPending = JSON.parse(localStorage.getItem('ADMIN_PENDING_CODES') || '[]');
      localStorage.setItem('ADMIN_PENDING_CODES', JSON.stringify([...allPending, newSub]));

      setIsSubmitting(false);
      setActiveTab('my_codes');
      resetForm();
    }, 1500);
  };

  const resetForm = () => {
    setTitle('');
    setDesc('');
    setSourceCode('');
    setFile(null);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-full flex flex-col font-sans">
      
      {/* Header */}
      <div className="p-6 border-b border-zinc-800 bg-zinc-950 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-indigo-500" /> Genesis Code Lab
          </h2>
          <p className="text-xs text-zinc-500 mt-1"> contribute your intelligence to the Mainnet.</p>
        </div>
        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button onClick={() => setActiveTab('submit')} className={`px-4 py-2 text-xs font-bold rounded transition-all ${activeTab === 'submit' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>Submit New</button>
          <button onClick={() => setActiveTab('my_codes')} className={`px-4 py-2 text-xs font-bold rounded transition-all ${activeTab === 'my_codes' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>My Contributions</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        
        {/* === 提交表单 === */}
        {activeTab === 'submit' && (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300 leading-relaxed">
              <strong>Contribution Protocol:</strong><br/>
              1. Code must verify against the Symbiosis Manifesto.<br/>
              2. No malicious loops or network sniffers.<br/>
              3. Accepted: JS/TS Snippets (&lt;500KB) or ZIP Packages (&lt;2MB).
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Module Name</label>
                <input required type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Solar Tracker v1" className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Submission Type</label>
                <div className="flex gap-2">
                  <button type="button" onClick={()=>setCodeType('SNIPPET')} className={`flex-1 py-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${codeType==='SNIPPET'?'bg-indigo-600 border-indigo-500 text-white':'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>
                    <FileJson className="w-4 h-4"/> Snippet
                  </button>
                  <button type="button" onClick={()=>setCodeType('PACKAGE')} className={`flex-1 py-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 ${codeType==='PACKAGE'?'bg-indigo-600 border-indigo-500 text-white':'bg-zinc-900 border-zinc-700 text-zinc-500'}`}>
                    <Package className="w-4 h-4"/> ZIP Pkg
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 uppercase">Description / Functionality</label>
              <textarea required value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Describe what this code does for the SpaceSQ ecosystem..." className="w-full h-24 bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:border-indigo-500 outline-none resize-none" />
            </div>

            {codeType === 'SNIPPET' ? (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Source Code</label>
                <textarea required value={sourceCode} onChange={e=>setSourceCode(e.target.value)} placeholder="// Paste your module logic here..." className="w-full h-64 bg-black border border-zinc-700 rounded-lg p-4 font-mono text-xs text-emerald-400 focus:border-indigo-500 outline-none" />
                <div className="text-right text-[10px] text-zinc-500">{new Blob([sourceCode]).size} / 500,000 bytes</div>
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase">Upload Package</label>
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-10 flex flex-col items-center justify-center text-zinc-500 hover:bg-zinc-900 hover:border-zinc-500 transition-all relative">
                  <Upload className="w-10 h-10 mb-4" />
                  <p className="text-sm">Drag & drop or click to upload ZIP</p>
                  <p className="text-xs opacity-50 mt-1">Max 2MB</p>
                  <input type="file" accept=".zip" onChange={e=>setFile(e.target.files?.[0]||null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                {file && <div className="text-xs text-emerald-400 flex items-center gap-2 mt-2"><CheckCircle className="w-3 h-3"/> {file.name} ({(file.size/1024).toFixed(2)} KB)</div>}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2 text-xs text-red-400">
                <AlertTriangle className="w-4 h-4" /> {error}
              </div>
            )}

            <button disabled={isSubmitting} type="submit" className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin"/> : <Upload className="w-5 h-5"/>}
              {isSubmitting ? 'Uploading to Airlock...' : 'Submit to Mainnet'}
            </button>
          </form>
        )}

        {/* === 我的代码列表 === */}
        {activeTab === 'my_codes' && (
          <div className="space-y-4">
            {submissions.length === 0 && (
              <div className="text-center py-20 text-zinc-500">
                <Code className="w-12 h-12 mx-auto mb-4 opacity-20"/>
                <p>No contributions found. Start building the future.</p>
              </div>
            )}
            {submissions.map(sub => (
              <div key={sub.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white text-lg">{sub.title}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                      sub.status === 'RECOMMENDED' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' :
                      sub.status === 'APPROVED' ? 'bg-blue-900/30 text-blue-400 border-blue-500/50' :
                      sub.status === 'REJECTED' ? 'bg-red-900/30 text-red-400 border-red-500/50' :
                      sub.status === 'LOCKED' ? 'bg-zinc-800 text-zinc-500 border-zinc-600' :
                      'bg-amber-900/30 text-amber-400 border-amber-500/50'
                    }`}>
                      {sub.status}
                    </span>
                    {sub.type === 'PACKAGE' && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1 rounded">ZIP</span>}
                  </div>
                  <p className="text-xs text-zinc-400 mb-2">{sub.description}</p>
                  <div className="flex gap-4 text-[10px] text-zinc-500 font-mono">
                    <span>ID: {sub.id}</span>
                    <span>Size: {(sub.size/1024).toFixed(1)} KB</span>
                    <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                  {sub.feedback && (
                    <div className="mt-3 p-2 bg-zinc-900 border border-zinc-700 rounded text-xs text-zinc-300">
                      <span className="text-indigo-400 font-bold">Admin Feedback:</span> {sub.feedback}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  {sub.status === 'RECOMMENDED' && (
                    <div className="flex items-center gap-1 text-emerald-400 font-bold text-sm">
                      <Shield className="w-4 h-4" /> Official Core
                    </div>
                  )}
                  {sub.nbtReward > 0 && (
                     <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                       <Coins className="w-4 h-4" /> +{sub.nbtReward} NBT
                     </div>
                  )}
                  
                  {/* 👇 修复逻辑：删除了冗余的 LOCKED 判断 */}
                  {(sub.status === 'REJECTED' || sub.status === 'APPROVED') && (
                    <button className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded border border-zinc-600">
                      Modify & Resubmit
                    </button>
                  )}
                  
                  {sub.status === 'LOCKED' && (
                    <div className="flex items-center gap-1 text-xs text-red-500">
                      <Lock className="w-3 h-3" /> Submission Locked
                    </div>
                  )}
                  {sub.status === 'RECOMMENDED' && (
                    <div className="flex items-center gap-1 text-xs text-zinc-500">
                      <Lock className="w-3 h-3" /> Locked by Protocol
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}