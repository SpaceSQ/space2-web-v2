"use client";
import React, { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DbScanner() {
  const supabase = createClientComponentClient();
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 日志辅助函数
  const log = (msg: string, type: 'info' | 'success' | 'error' | 'warn' = 'info') => {
    const icon = { info: '🔹', success: '✅', error: '❌', warn: '⚠️' };
    setLogs(prev => [...prev, `${icon[type]} [${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  useEffect(() => {
    const scan = async () => {
      log("正在初始化 Space² 数据库结构扫描...", 'info');
      
      // 1. 检查连接与权限
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        log("未检测到登录用户，请先登录！RLS 策略可能会阻止读取。", 'error');
        setLoading(false);
        return;
      }
      log(`用户已认证: ${session.user.email} (ID: ${session.user.id.slice(0,6)}...)`, 'success');

      // ---------------------------------------------------------
      // 2. 扫描：宠物/实体表 (核心)
      // ---------------------------------------------------------
      // 我们尝试几种常见的命名，看看哪个能中
      const potentialPetTables = ['pets', 'pet_assets', 'entities', 'silicon_life', 'avatars'];
      let foundPetTable = false;

      for (const table of potentialPetTables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        
        if (!error) {
          foundPetTable = true;
          log(`发现核心表: [${table}]`, 'success');
          if (data && data.length > 0) {
            log(`  👉 字段列表: ${Object.keys(data[0]).join(', ')}`, 'info');
            log(`  👉 数据样本: ${JSON.stringify(data[0])}`, 'info');
          } else {
            log(`  ⚠️ 表 [${table}] 存在，但是是空的 (No rows).`, 'warn');
            // 尝试插入一条假数据看看字段结构? (可选，暂时不做以免污染)
          }
        }
      }
      if (!foundPetTable) log("❌ 未找到任何疑似'宠物/实体'的表，请检查表名！", 'error');

      // ---------------------------------------------------------
      // 3. 扫描：空间/房间表 (平面图数据)
      // ---------------------------------------------------------
      const potentialSpaceTables = ['rooms', 'spaces', 'zones', 'map_nodes'];
      for (const table of potentialSpaceTables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (!error) {
          log(`发现空间表: [${table}]`, 'success');
          if (data && data.length > 0) {
            log(`  👉 字段列表: ${Object.keys(data[0]).join(', ')}`, 'info');
          } else {
            log(`  ⚠️ 表 [${table}] 存在但为空。`, 'warn');
          }
        }
      }

      // ---------------------------------------------------------
      // 4. 扫描：资产/家具表 (装修功能)
      // ---------------------------------------------------------
      const potentialItemTables = ['items', 'assets', 'furniture', 'inventory'];
      for (const table of potentialItemTables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (!error) {
          log(`发现物品表: [${table}]`, 'success');
        }
      }

      setLoading(false);
      log("扫描完成。等待指令上传。", 'success');
    };

    scan();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 overflow-y-auto selection:bg-green-900">
      <div className="max-w-4xl mx-auto border border-green-800 rounded-lg bg-black shadow-[0_0_20px_rgba(0,255,0,0.1)]">
        <div className="bg-green-900/20 border-b border-green-800 p-4 flex justify-between items-center">
          <h1 className="font-bold text-lg">SYSTEM DIAGNOSTIC TERMINAL</h1>
          {loading && <div className="animate-pulse">SCANNING...</div>}
        </div>
        <div className="p-6 space-y-3 text-xs md:text-sm">
          {logs.map((log, i) => (
            <div key={i} className="break-all border-b border-green-900/30 pb-1">{log}</div>
          ))}
          {!loading && (
            <div className="mt-8 pt-4 border-t border-green-800 text-white">
              <p className="mb-2">👉 <strong>请执行以下操作：</strong></p>
              <p>1. 截图或复制上方所有绿色文字。</p>
              <p>2. 发送给 AI 助手。</p>
              <p>3. 我将根据扫描到的真实字段，把 Word 文档里的旧功能重新接驳上去。</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
