"use client";
import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Scale, CheckCircle, XCircle, ArrowLeft, FileText } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 pb-20 font-sans selection:bg-red-900 selection:text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-12 border-b border-zinc-800 pb-8">
          <Link href="/" className="text-zinc-500 hover:text-white flex items-center gap-2 mb-6 text-sm font-mono transition-colors">
            <ArrowLeft size={14}/> RETURN TO GENESIS
          </Link>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
            LEGAL & <span className="text-zinc-600">LICENSING</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
            SpaceSQ is not just code; it is a sovereign digital territory. 
            Access and usage are governed by the <strong className="text-white">SpaceSQ Community License (SCL-1.0)</strong>.
          </p>
        </div>

        {/* 1. 人类可读摘要 (Human-Readable Summary) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* 允许做的事 */}
          <div className="bg-zinc-900/30 border border-green-900/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><CheckCircle size={64} className="text-green-500"/></div>
            <h3 className="text-green-500 font-bold text-xl mb-4 flex items-center gap-2">
              <CheckCircle size={20}/> YOU MAY
            </h3>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex gap-3">
                <span className="text-green-500 font-mono">01.</span>
                <span><strong>Personal & Home Use:</strong> Deploy SpaceSQ in your private residence for non-profit purposes.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-mono">02.</span>
                <span><strong>Academic Research:</strong> Use for teaching, experimentation, or academic publication (attribution required).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-mono">03.</span>
                <span><strong>Internal Testing:</strong> Enterprises may deploy in isolated sandbox environments for R&D evaluation.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-500 font-mono">04.</span>
                <span><strong>Modify & Fork:</strong> Inspect and modify source code for personal optimization.</span>
              </li>
            </ul>
          </div>

          {/* 禁止做的事 */}
          <div className="bg-zinc-900/30 border border-red-900/30 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><XCircle size={64} className="text-red-500"/></div>
            <h3 className="text-red-500 font-bold text-xl mb-4 flex items-center gap-2">
              <XCircle size={20}/> YOU MAY NOT
            </h3>
            <ul className="space-y-4 text-sm text-zinc-300">
              <li className="flex gap-3">
                <span className="text-red-500 font-mono">01.</span>
                <span><strong>Commercial Deployment:</strong> Install in public spaces, hotels, offices, or commercial real estate at scale.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-mono">02.</span>
                <span><strong>SaaS / Subscription:</strong> Wrap SpaceSQ as a paid cloud service, API, or membership product.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-mono">03.</span>
                <span><strong>Hardware Bundling:</strong> Pre-install SpaceSQ on hardware devices sold for profit without a Commercial License.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-red-500 font-mono">04.</span>
                <span><strong>Remove Attribution:</strong> Delete copyright headers or "Powered by SpaceSQ" markers.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 2. 法律文本全文 (The Legal Text) */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 md:p-12 font-mono text-xs md:text-sm text-zinc-400 leading-relaxed relative">
          
          <div className="absolute top-4 right-4 border border-zinc-700 text-zinc-500 px-2 py-1 rounded text-[10px]">
            HASH: 0x9f8a...2b1c
          </div>

          <h3 className="text-xl font-bold text-white mb-6 font-sans flex items-center gap-2">
            <Scale size={20} /> SpaceSQ Community License (SCL-1.0)
          </h3>

          <div className="space-y-6 h-[500px] overflow-y-auto pr-4 custom-scrollbar">
            <p><strong>VERSION 1.0 - GENESIS EDITION</strong><br/>Effective Date: February 2026</p>

            <p><strong>PREAMBLE</strong><br/>
            The SpaceSQ software and associated documentation (the "Software") are the intellectual property of the SpaceSQ Foundation (the "Licensor"). This license allows for broad adoption in private and research sectors while protecting the commercial viability of the project.</p>

            <p><strong>1. GRANT OF LICENSE</strong><br/>
            Subject to the terms and conditions of this License, Licensor hereby grants to you a worldwide, non-exclusive, royalty-free copyright license to reproduce, prepare derivative works of, publicly display, publicly perform, sublicense, and distribute the Software, providing that such use is strictly <strong>NON-COMMERCIAL</strong>.</p>

            <p><strong>2. DEFINITION OF NON-COMMERCIAL USE</strong><br/>
            "Non-Commercial Use" means use of the Software solely for personal, educational, or internal research purposes. Any use that generates revenue, directly or indirectly, including but not limited to subscription fees, service fees, advertising revenue, or hardware sales premiums, constitutes "Commercial Use."</p>

            <p><strong>3. COMMERCIAL USE RESTRICTION (THE "RED LINE")</strong><br/>
            You may NOT use the Software, or any Derivative Works, to provide a service to third parties (a "Managed Service") where the Software operates as the primary value proposition. You may NOT deploy the Software in public-facing commercial environments (e.g., airports, malls, paid co-working spaces) without a separate Commercial License.</p>

            <p><strong>4. INTELLECTUAL PROPERTY & ATTRIBUTION</strong><br/>
            You must retain all copyright, patent, trademark, and attribution notices contained in the Source Code. The "SpaceSQ" brand and the "Three Laws of Silicon Life" text are trademarks of the Licensor.</p>

            <p><strong>5. NO WARRANTY</strong><br/>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.</p>

            <p><strong>6. TERMINATION</strong><br/>
            This License will terminate automatically if you fail to comply with any of its terms. Upon termination, you must destroy all copies of the Software.</p>
            
            <div className="pt-8 border-t border-zinc-800">
              <p className="text-zinc-500">For Commercial Licensing inquiries, please contact: <span className="text-blue-400 underline cursor-pointer">business@spacesq.org</span></p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-600">
            By downloading the Genesis Seed, you acknowledge that you have read and agreed to this agreement.
          </p>
        </div>

      </div>
    </div>
  );
}