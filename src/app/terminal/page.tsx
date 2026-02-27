'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TerminalPage() {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([
    "SPACE_SQ KERNEL [Version 1.0.4]",
    "(c) 2024 Genesis Corporation. All rights reserved.",
    "",
    "Initialize system...",
    "Loading neural interfaces... OK",
    "Mounting holographic storage... OK",
    "Connecting to interplanetary link... CONNECTED",
    "",
    "Welcome, Commander. Type 'help' for available commands.",
    ""
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // 保持焦点
  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `> ${input}`]; // 注意：这里显示用户输入

    // 命令解析逻辑
    switch (cmd) {
      case 'help':
        newHistory.push(
          "AVAILABLE COMMANDS:",
          "  help     - Show this list",
          "  status   - System diagnostic",
          "  whoami   - Current session info",
          "  clear    - Clear terminal screen",
          "  exit     - Return to GUI"
        );
        break;
      case 'status':
        newHistory.push(
          "SYSTEM STATUS: NOMINAL",
          "CPU Load: 3%",
          "Memory: 14TB / 128TB",
          "Network: ENCRYPTED [AES-256]"
        );
        break;
      case 'whoami':
        newHistory.push("USER: guest@genesis-node-01", "ACCESS: LEVEL 1 (OBSERVER)");
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'exit':
        window.location.href = '/';
        return;
      default:
        newHistory.push(`Command not found: '${cmd}'. Try 'help'.`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div 
      className="min-h-screen bg-black text-green-500 font-mono text-sm p-4 md:p-8 overflow-hidden flex flex-col"
      onClick={focusInput}
    >
      {/* 退出按钮 */}
      <div className="fixed top-4 right-4 z-50">
         <Link href="/" className="text-green-800 hover:text-green-400 transition-colors border border-green-900 px-3 py-1 rounded">
            EXIT KERNEL
         </Link>
      </div>

      <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap break-words min-h-[1.2em]">
            {/* 安全地渲染可能包含 > 的文本 */}
            {line}
          </div>
        ))}
        
        {/* 输入行 */}
        <form onSubmit={handleCommand} className="flex items-center mt-2">
          <span className="mr-2">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-green-500 caret-green-500"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}