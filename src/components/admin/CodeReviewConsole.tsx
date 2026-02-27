'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, AlertTriangle, FileCode, 
  Download, Shield, Lock, Eye
} from 'lucide-react';
import { CodeSubmission, ReviewStatus } from '../contribution/GenesisCodeLab';

export default function CodeReviewConsole() {
  const [pendingList, setPendingList] = useState<CodeSubmission[]>([]);

  // 模拟从数据库拉取待审核代码
  useEffect(() => {
    // 实际应为 API 请求
    const data = localStorage.getItem('ADMIN_PENDING_CODES');
    if (data) setPendingList(JSON.parse(data));
  }, []);

  const handleReview = (id: string, decision: ReviewStatus, feedback: string) => {
    // 1. 更新管理员视图
    const target = pendingList.find(s => s.id === id);
    if (!target) return;

    const newPendingList = pendingList.filter(s => s.id !== id);
    setPendingList(newPendingList);
    localStorage.setItem('ADMIN_PENDING_CODES', JSON.stringify(newPendingList));

    // 2. 更新用户视图 (模拟写回数据库)
    const userSubsRaw = localStorage.getItem('USER_SUBMISSIONS');
    if (userSubsRaw) {
      let userSubs: CodeSubmission[] = JSON.parse(userSubsRaw);
      userSubs = userSubs.map(s => {
        if (s.id === id) {
          let newRejectionCount = s.rejectionCount;
          let newStatus = decision;
          let newReward = s.nbtReward;

          if (decision === 'REJECTED') {
            newRejectionCount += 1;
            if (newRejectionCount >= 3) newStatus = 'LOCKED';
          }
          if (decision === 'RECOMMENDED') newReward = 500;
          if (decision === 'APPROVED') newReward = 100;

          return { 
            ...s, 
            status: newStatus, 
            rejectionCount: newRejectionCount,
            feedback,
            nbtReward: newReward
          };
        }
        return s;
      });
      localStorage.setItem('USER_SUBMISSIONS', JSON.stringify(userSubs));
    }

    alert(`Submission ${id} processed as ${decision}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCode className="w-5 h-5 text-indigo-600" /> Incoming Code Submissions
        </h3>
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
          {pendingList.length} Pending
        </span>
      </div>

      {pendingList.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
          No pending code submissions in the Airlock.
        </div>
      ) : (
        <div className="grid gap-4">
          {pendingList.map(sub => (
            <div key={sub.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
              
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{sub.title}</h4>
                  <p className="text-sm text-slate-500">{sub.description}</p>
                  <div className="flex gap-3 mt-2 text-xs font-mono text-slate-400">
                    <span className="bg-slate-100 px-1 rounded">{sub.type}</span>
                    <span>{(sub.size / 1024).toFixed(1)} KB</span>
                    <span>Strikes: {sub.rejectionCount}/3</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-500 hover:text-indigo-600 border rounded hover:bg-slate-50" title="View Source / Download">
                    {sub.type === 'SNIPPET' ? <Eye className="w-4 h-4"/> : <Download className="w-4 h-4"/>}
                  </button>
                </div>
              </div>

              {/* 审核操作区 */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => handleReview(sub.id, 'RECOMMENDED', 'Excellent work. Integrated into Core.')}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Shield className="w-3 h-3" /> 1. Recommend (Official)
                </button>
                <button 
                  onClick={() => handleReview(sub.id, 'APPROVED', 'Approved for marketplace.')}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-3 h-3" /> 2. Approve (Standard)
                </button>
                <button 
                  onClick={() => handleReview(sub.id, 'REJECTED', 'Security violation or bugs found.')}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded text-xs font-bold flex items-center justify-center gap-2"
                >
                  <XCircle className="w-3 h-3" /> 3. Reject
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}