'use client';

import React from 'react';
import { Box, Layers, Zap } from 'lucide-react';

// 定义物体类型
export type BlueprintType = 'EMPTY' | 'FLOOR' | 'WALL' | 'SOFA' | 'SERVER' | 'PLANT';

interface SSSU {
  id: string;
  x: number; // grid coordinate X
  y: number; // grid coordinate Y
  content: BlueprintType;
  status: 'active' | 'printing' | 'locked';
  height: number; // 模拟物体高度 (0-100)
}

interface Props {
  gridData: SSSU[];
  onCellClick: (x: number, y: number) => void;
  isPrinting?: boolean;
}

export default function IsometricGrid({ gridData, onCellClick, isPrinting }: Props) {
  // 网格尺寸配置
  const TILE_WIDTH = 60;
  const TILE_HEIGHT = 30; // 扁平化以形成透视
  const ORIGIN_X = 300; // 画布中心 X
  const ORIGIN_Y = 100;  // 画布中心 Y

  // 坐标转换：Grid (x,y) -> Screen (px, py)
  // 等轴测投影公式
  const getIsoCoords = (x: number, y: number) => {
    return {
      left: ORIGIN_X + (x - y) * TILE_WIDTH,
      top: ORIGIN_Y + (x + y) * TILE_HEIGHT
    };
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-zinc-900 rounded-xl border border-zinc-800 shadow-inner group">
      
      {/* 背景网格装饰 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(79,70,229,0.1),transparent_70%)] pointer-events-none"></div>

      {/* 渲染每一个 SSSU 单元 */}
      {gridData.map((cell) => {
        const { left, top } = getIsoCoords(cell.x, cell.y);
        const zIndex = cell.x + cell.y; // 简单的遮挡剔除逻辑：越靠下层级越高
        
        // 样式配置
        let tileColor = 'bg-zinc-800';
        let borderColor = 'border-zinc-700';
        let contentEl = null;

        // 根据内容渲染不同的“积木”
        if (cell.content === 'FLOOR') {
          tileColor = 'bg-zinc-700 hover:bg-indigo-900';
        } else if (cell.content === 'SERVER') {
          tileColor = 'bg-indigo-900';
          contentEl = (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-8 h-12 bg-indigo-600 border border-indigo-400 shadow-lg shadow-indigo-500/50 flex flex-col items-center justify-end pb-1 animate-in slide-in-from-top-4 duration-500">
               <div className="w-6 h-0.5 bg-indigo-300 mb-1 animate-pulse"></div>
               <div className="w-6 h-0.5 bg-indigo-300 mb-1 animate-pulse delay-75"></div>
               <div className="w-6 h-0.5 bg-indigo-300 mb-1 animate-pulse delay-150"></div>
            </div>
          );
        } else if (cell.content === 'SOFA') {
           tileColor = 'bg-emerald-900';
           contentEl = (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-6 bg-emerald-600 rounded-sm shadow-lg"></div>
           );
        } else if (cell.status === 'printing') {
           // 打印特效：光柱
           contentEl = (
             <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-t from-indigo-500/50 to-transparent animate-pulse pointer-events-none">
                <div className="absolute bottom-0 w-full h-1 bg-indigo-400 blur-sm"></div>
             </div>
           );
        }

        return (
          <div
            key={cell.id}
            onClick={() => onCellClick(cell.x, cell.y)}
            className={`absolute cursor-pointer transition-all duration-300 hover:-translate-y-2`}
            style={{
              left: `${left}px`,
              top: `${top}px`,
              width: `${TILE_WIDTH * 2}px`,
              height: `${TILE_HEIGHT * 2}px`,
              zIndex: zIndex,
            }}
          >
            {/* 2.5D Tile Shape (Diamond) */}
            <div className="relative w-full h-full">
              {/* 地板面 */}
              <div 
                className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full rotate-45 scale-y-50 border ${borderColor} ${tileColor} shadow-xl transition-colors`}
              ></div>
              
              {/* 打印激光/物体内容 */}
              {contentEl}
              
              {/* 坐标标注 (仅 Debug 或 hover 显示) */}
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] text-white/20 font-mono opacity-0 group-hover:opacity-100 pointer-events-none">
                {cell.x},{cell.y}
              </span>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-4 left-4 text-xs font-mono text-zinc-500">
        VIEW: ISOMETRIC [2.5D] <br/>
        RENDER: CSS_TRANSFORM
      </div>
    </div>
  );
}