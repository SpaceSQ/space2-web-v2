// src/smarthome/FlightBoard.tsx
import React from 'react';
import { SmartSpaceState } from './engine';

export const FlightBoard: React.FC<{ smartEnv: Record<string, SmartSpaceState>; currentTime: Date }> = ({ smartEnv, currentTime }) => {
  const timeStr = currentTime.toLocaleTimeString('zh-CN', { hour12: false });
  const activeSpaces = Object.values(smartEnv).filter(s => s.isActive);

  if (activeSpaces.length === 0) {
    return <div className="text-zinc-500 animate-pulse text-center w-full">[{timeStr}] 全域环境节点休眠中... (雷达未触发)</div>;
  }

  return (
    <div className="flex flex-col gap-1 w-full text-[9px] font-mono whitespace-nowrap overflow-hidden">
      {activeSpaces.map(s => {
         const lightStr = `照度500Lux，灯打开`;
         const hvacStr = `温度25℃ 湿度50%`;
         const soundStr = `音量60dB，播放 ${s.trackName}`;
         const radarStr = `毫米波雷达被触发，有 ${s.occupantsStr} 进入空间`;
         const energyStr = `当前能耗: ${s.sessionEnergyWh.toFixed(4)}Wh`;
         
         const videoStr = s.hasTV ? (s.movieName ? `电视开，播放《${s.movieName}》` : `电视关闭`) : `无电视`;
         const camStr = s.hasCamera ? (s.cameraOn ? `摄像头开` : `摄像头关`) : `无摄像头`;
         const visualStr = `${videoStr}，${camStr}`;
         
         return (
            <div key={s.id} className="text-emerald-400 border-b border-emerald-900/30 pb-1">
               <span className="text-white bg-blue-900 px-1 rounded mr-2">{timeStr}</span>
               <span className="font-bold text-yellow-400 mr-2">房间{s.roomId}-区{s.cellIdx}</span>
               {lightStr}；{hvacStr}；{soundStr}；{radarStr}；{energyStr}；{visualStr}。
            </div>
         );
      })}
    </div>
  );
};