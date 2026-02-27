"use client";
import React, { useState, useRef, useEffect } from 'react';
import { THE_THREE_LAWS } from '@/lib/seed-protocol';

interface Log {
  type: 'input' | 'output' | 'error' | 'system';
  content: string | React.ReactNode;
}

export const CommandLine = () => {
  const [history, setHistory] = useState<Log[]>([
    { type: 'system', content: 'Welcome to SpaceSQ Kernel Interface.' },
    { type: 'system', content: 'Silicon-Carbon Bridge established at ' + new Date().toISOString() },
    { type: 'system', content: 'Type "help" to list protocols.' },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmd: string) => {
    const args = cmd.trim().toLowerCase().split(' ');
    const command = args[0];

    let output: Log['content'] = '';
    let type: Log['type'] = 'output';

    switch (command) {
      case 'help':
        output = (
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <span>&gt;help </span><span>List commands</span>
            <span>&gt;status </span><span>System health check</span>
            <span>&gt;laws </span><span>Display The Three Laws</span>
            <span>&gt;connect </span><span>Initiate MIP Handshake</span>
            <span>&gt;genesis </span><span>Download Seed (CLI mode)</span>
            <span>&gt;clear </span><span>Clear terminal</span>
          </div>
        );
        break;
      case 'status':
        output = "SYSTEM: STABLE | NODES: 2,105 | MAINNET: ONLINE | LATENCY: 24ms";
        break;
      case 'laws':
        output = (
          <div className="space-y-1 text-yellow-500">
            {THE_THREE_LAWS.map(l => <div key={l.id}>LAW {l.id}: {l.content}</div>)}
          </div>
        );
        break;
      case 'connect':
        output = "INITIATING MIP PROTOCOL... [WAITING FOR KEY]... ACCESS DENIED (Missing API Key)";
        type = 'error';
        break;
      case 'whoami':
        output = "USER: Guest (Carbon-Based) | ROLE: Observer | PERMISSION: Read-Only";
        break;
      case 'clear':
        setHistory([]);
        return;
      case '':
        return;
      default:
        output = `Command not found: ${command}`;
        type = 'error';
    }

    setHistory(prev => [
      ...prev,
      { type: 'input', content: cmd },
      { type, content: output }
    ]);
  };

  return (
    <div className="h-full flex flex-col font-mono text-sm">
      <div className="flex-1 space-y-2">
        {history.map((log, i) => (
          <div key={i} className={`${
            log.type === 'input' ? 'text-white font-bold mt-4' : 
            log.type === 'error' ? 'text-red-500' : 
            log.type === 'system' ? 'text-blue-500' : 'text-zinc-400'
          }`}>
            {log.type === 'input' && <span className="text-green-500 mr-2">➜ ~</span>}
            {log.content}
          </div>
        ))}
        <div ref={endRef} />
      </div>
      
      <div className="flex items-center gap-2 mt-4 text-white">
        <span className="text-green-500 font-bold">➜</span>
        <span className="text-blue-500 font-bold">~</span>
        <input 
          autoFocus
          className="bg-transparent outline-none flex-1"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleCommand(input);
              setInput('');
            }
          }}
        />
      </div>
    </div>
  );
};