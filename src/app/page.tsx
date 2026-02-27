import React from "react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white font-mono flex flex-col items-center justify-center">
      <h1 className="text-6xl font-black mb-8 italic tracking-tighter">SPACESQ</h1>
      <div className="flex gap-4">
        <a href="/register" className="px-8 py-3 border border-emerald-500 text-emerald-500 text-xs hover:bg-emerald-500 hover:text-black transition-all font-bold">REGISTRY / 注册</a>
        <a href="/login" className="px-8 py-3 border border-zinc-700 text-zinc-500 text-xs hover:border-white hover:text-white transition-all font-bold">LOGIN / 登录</a>
      </div>
    </main>
  );
}