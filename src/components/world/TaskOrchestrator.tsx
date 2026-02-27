'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  CheckCircle, Clock, Coins, Bot, User, 
  ArrowRight, Activity, Layers, PlayCircle, Box 
} from 'lucide-react';

// === 数据结构 ===
interface Agent {
  id: string;
  name: string;
  type: 'HUMANOID' | 'DRONE' | 'CLEANER';
  status: 'IDLE' | 'WORKING' | 'OFFLINE';
  battery: number;
  nbtEarned: number;
  location: string; // SSSU ID
}

interface Task {
  id: string;
  desc: string; // e.g., "Fold Laundry"
  nbtReward: number;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
  assignedTo?: string; // Agent ID
  progress: number; // 0-100
  coordinate: string; // Target SSSU
}

// === 模拟数据：你的家庭智能体战队 ===
const INITIAL_AGENTS: Agent[] = [
  { id: 'AG-01', name: 'Unitree G1', type: 'HUMANOID', status: 'IDLE', battery: 85, nbtEarned: 1200, location: 'LivingRoom-01' },
  { id: 'AG-02', name: 'Dyson 360', type: 'CLEANER', status: 'IDLE', battery: 100, nbtEarned: 450, location: 'Kitchen-02' },
  { id: 'AG-03', name: 'DJI S2', type: 'DRONE', status: 'OFFLINE', battery: 0, nbtEarned: 0, location: 'Balcony-01' },
];

export default function TaskOrchestrator() {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [systemLog, setSystemLog] = useState<string[]>(['> TASK_NET: Orbital Sync Complete.']);
  
  const logRef = useRef<HTMLDivElement>(null);

  // 自动滚动日志
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [systemLog]);

  // 模拟任务进度循环
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prevTasks => prevTasks.map(task => {
        if (task.status === 'IN_PROGRESS') {
          const newProgress = task.progress + 10; // 进度增加
          if (newProgress >= 100) {
            // 任务完成
            addLog(`TASK_COMPLETE: [${task.id}] finished by ${task.assignedTo}. Transferring ${task.nbtReward} NBT.`);
            updateAgentWallet(task.assignedTo!, task.nbtReward);
            return { ...task, status: 'COMPLETED', progress: 100 };
          }
          return { ...task, progress: newProgress };
        }
        return task;
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const addLog = (msg: string) => {
    setSystemLog(prev => [`> ${msg}`, ...prev].slice(0, 10));
  };

  const updateAgentWallet = (agentId: string, amount: number) => {
    setAgents(prev => prev.map(a => 
      a.id === agentId 
        ? { ...a, nbtEarned: a.nbtEarned + amount, status: 'IDLE' } 
        : a
    ));
  };

  // 核心逻辑：发布任务
  const handlePublishTask = () => {
    if (!newTaskDesc.trim()) return;

    // 1. 创建任务
    const newTask: Task = {
      id: `T-${Date.now().toString().slice(-4)}`,
      desc: newTaskDesc,
      nbtReward: Math.floor(Math.random() * 50) + 10, // 随机定价
      status: 'PENDING',
      progress: 0,
      coordinate: `SSSU-${Math.floor(Math.random()*9)}`
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskDesc('');
    addLog(`USER_INTENT: "${newTask.desc}" -> Broadcast to Local Agents.`);

    // 2. 模拟 LUMI 分配任务 (延迟 1.5秒)
    setTimeout(() => {
      assignTask(newTask.id);
    }, 1500);
  };

  // 核心逻辑：智能体竞标与分配
  const assignTask = (taskId: string) => {
    // 寻找空闲且适合的智能体
    // 简单逻辑：找第一个 IDLE 的 Humanoid (如果是叠衣服) 或 Cleaner
    // 这里我们假设 Unitree 机器人什么都能干
    const availableAgent = agents.find(a => a.status === 'IDLE' && a.type !== 'DRONE');

    if (availableAgent) {
      addLog(`BID_WON: Agent [${availableAgent.name}] accepted task [${taskId}].`);
      
      // 更新任务状态
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'IN_PROGRESS', assignedTo: availableAgent.name } : t
      ));

      // 更新智能体状态
      setAgents(prev => prev.map(a => 
        a.id === availableAgent.id ? { ...a, status: 'WORKING' } : a
      ));

    } else {
      addLog(`BID_FAIL: No available agents for task [${taskId}]. Queued.`);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[600px] gap-6 bg-zinc-950 p-6 rounded-xl border border-zinc-800 font-sans text-white">
      
      {/* === 左侧：智能体编队 (The Workforce) === */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-slate-300 flex items-center gap-2">
            <Bot className="w-5 h-5 text-emerald-500" /> Silicon Workforce
          </h3>
          <span className="text-xs bg-emerald-900/30 text-emerald-400 px-2 py-1 rounded border border-emerald-500/30">
            {agents.filter(a => a.status !== 'OFFLINE').length} Active
          </span>
        </div>

        <div className="space-y-3 overflow-y-auto custom-scrollbar flex-1">
          {agents.map(agent => (
            <div key={agent.id} className={`p-4 rounded-xl border transition-all ${
              agent.status === 'WORKING' ? 'bg-indigo-900/20 border-indigo-500/50' : 
              agent.status === 'OFFLINE' ? 'bg-zinc-900 border-zinc-800 opacity-50' :
              'bg-zinc-900 border-zinc-700'
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'WORKING' ? 'bg-indigo-400 animate-pulse' : 
                    agent.status === 'OFFLINE' ? 'bg-red-500' : 'bg-emerald-500'
                  }`}></div>
                  <span className="font-bold text-sm">{agent.name}</span>
                </div>
                <div className="text-xs font-mono text-amber-400 flex items-center gap-1">
                  <Coins className="w-3 h-3" /> {agent.nbtEarned}
                </div>
              </div>
              
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>LOC: {agent.location}</span>
                <span>BAT: {agent.battery}%</span>
              </div>
              
              {agent.status === 'WORKING' && (
                <div className="mt-2 text-xs text-indigo-300 flex items-center gap-1">
                  <Activity className="w-3 h-3 animate-spin" /> Executing Task...
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* NBT 总览 */}
        <div className="p-4 bg-amber-900/10 border border-amber-500/20 rounded-xl flex items-center justify-between">
           <span className="text-xs text-amber-500 font-bold uppercase">Total NBT Paid</span>
           <span className="text-xl font-mono font-bold text-amber-400">
             {agents.reduce((acc, curr) => acc + curr.nbtEarned, 0)}
           </span>
        </div>
      </div>

      {/* === 中间：任务队列 (Task Board) === */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-2">
          <Layers className="w-5 h-5 text-indigo-500" />
          <h3 className="font-bold text-slate-300">Mission Control</h3>
        </div>

        {/* 发布框 */}
        <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-3 flex gap-2">
          <input 
            type="text" 
            value={newTaskDesc}
            onChange={(e) => setNewTaskDesc(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handlePublishTask()}
            placeholder="e.g. Fold clothes in Bedroom..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder-zinc-600"
          />
          <button 
            onClick={handlePublishTask}
            className="p-2 bg-white text-black rounded-lg hover:bg-slate-200 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 列表 */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
          {tasks.length === 0 && (
            <div className="text-center text-zinc-600 text-xs mt-10">No active missions.</div>
          )}
          {tasks.map(task => (
            <div key={task.id} className="bg-black/40 border border-zinc-800 p-3 rounded-lg flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-200">{task.desc}</span>
                <span className="text-xs font-mono text-emerald-500">+{task.nbtReward} NBT</span>
              </div>
              
              <div className="flex justify-between items-center text-[10px] text-zinc-500">
                <span className="font-mono">{task.id} @ {task.coordinate}</span>
                <span className={`px-1.5 py-0.5 rounded uppercase font-bold ${
                  task.status === 'COMPLETED' ? 'bg-emerald-900/30 text-emerald-500' :
                  task.status === 'IN_PROGRESS' ? 'bg-indigo-900/30 text-indigo-400' :
                  'bg-zinc-800 text-zinc-400'
                }`}>
                  {task.status}
                </span>
              </div>

              {task.status === 'IN_PROGRESS' && (
                <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 transition-all duration-500" style={{width: `${task.progress}%`}}></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* === 右侧：系统日志 (The Ledger) === */}
      <div className="w-full lg:w-1/3 flex flex-col bg-zinc-900 rounded-xl border border-zinc-800">
        <div className="p-3 border-b border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-400 uppercase">System Neural Log</span>
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          </div>
        </div>
        <div className="flex-1 p-4 font-mono text-[10px] text-zinc-400 overflow-y-auto custom-scrollbar flex flex-col-reverse" ref={logRef}>
           <div className="animate-pulse text-indigo-500">_</div>
           {systemLog.map((log, i) => (
             <div key={i} className={`break-words leading-relaxed mb-1 ${
               log.includes('USER_INTENT') ? 'text-white' :
               log.includes('BID_WON') ? 'text-indigo-400' :
               log.includes('COMPLETE') ? 'text-emerald-400' :
               'text-zinc-500'
             }`}>
               {log}
             </div>
           ))}
        </div>
        <div className="p-3 bg-zinc-950 border-t border-zinc-800 text-[10px] text-center text-zinc-600">
          Orchestration Protocol v1.0
        </div>
      </div>

    </div>
  );
}