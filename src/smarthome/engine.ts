// src/smarthome/engine.ts
import { SMART_CONSTANTS, MUSIC_LIB, MOVIE_LIB } from './constants';

export interface SmartSpaceState {
  id: string; roomId: number; cellIdx: number;
  lastSeenTime: number; 
  isActive: boolean;    
  occupantsStr: string; 
  trackName: string | null;
  movieName: string | null;
  hasTV: boolean;
  hasCamera: boolean;   
  cameraOn: boolean;    
  powerW: number;       
  sessionEnergyWh: number; 
  totalEnergyWh: number;   
}

// 判定为公共活动区的家具（加装摄像头）
const PUBLIC_FURNITURE = ['SOFA', 'MAZE', 'SWING', 'TRAINING_GROUND', 'TABLE'];

export const processSmartHomeTick = (
  prevState: Record<string, SmartSpaceState>,
  rooms: any[],
  avatarInfo: { present: boolean; x: number; y: number; role: string },
  pets: any[],
  nowMs: number
) => {
  let next = { ...prevState };
  let stateChanged = false;

  rooms.forEach(room => {
    room.cells.forEach((isSafe: boolean, idx: number) => {
      if (!isSafe) return; 
      
      const cellId = `R${room.id}-C${idx}`;
      const startX = room.gridX * 100 + (idx % 3) * 33.33;
      const startY = room.gridY * 100 + Math.floor(idx / 3) * 33.33;
      const endX = startX + 33.33;
      const endY = startY + 33.33;
      
      // 1. 扫描硬件设备 (电视与摄像头)
      const itemsInCell = room.items.filter((i: any) => {
         const cx = i.x + (i.w || 10) / 2;
         const cy = i.y + (i.h || 10) / 2;
         return cx >= (idx % 3) * 33.33 && cx < ((idx % 3) + 1) * 33.33 && cy >= Math.floor(idx / 3) * 33.33 && cy < (Math.floor(idx / 3) + 1) * 33.33;
      });

      const hasTV = itemsInCell.some((i: any) => i.type === 'TV');
      const hasCamera = itemsInCell.some((i: any) => PUBLIC_FURNITURE.includes(i.type));

      // 2. 毫米波雷达空间探测
      let humans = 0; let dogsCats = 0;
      let petCats: Record<string, number> = {};
      
      if (avatarInfo.present && avatarInfo.x >= startX && avatarInfo.x < endX && avatarInfo.y >= startY && avatarInfo.y < endY) { humans++; }
      pets.forEach(p => {
         if (p.x >= startX && p.x < endX && p.y >= startY && p.y < endY) {
            petCats[p.category] = (petCats[p.category] || 0) + 1;
            if (p.category === '像素犬' || p.category === '赛博猫') dogsCats++;
         }
      });

      const totalPets = Object.values(petCats).reduce((a,b)=>a+b, 0);
      const totalLifeforms = humans + totalPets;

      // 深度拷贝旧状态，保证 React 的 Immutability (不丢失更新)
      let cellState = next[cellId] ? { ...next[cellId] } : { id: cellId, roomId: room.id, cellIdx: idx, lastSeenTime: 0, isActive: false, occupantsStr: '', trackName: null, movieName: null, hasTV: false, hasCamera: false, cameraOn: false, powerW: 0, sessionEnergyWh: 0, totalEnergyWh: 0 };
      
      let needsUpdate = false;
      
      // 同步硬件基础状态
      if (cellState.hasTV !== hasTV || cellState.hasCamera !== hasCamera) {
          cellState.hasTV = hasTV; cellState.hasCamera = hasCamera; needsUpdate = true;
      }

      // 3. 状态跃迁：生命体触发激活
      if (totalLifeforms > 0) {
         cellState.lastSeenTime = nowMs;
         if (!cellState.isActive) {
            cellState.isActive = true;
            cellState.cameraOn = hasCamera; 
            
            let occStr = [];
            if (humans > 0) occStr.push(`1名数字人`);
            Object.entries(petCats).forEach(([cat, num]) => occStr.push(`${num}只${cat}`));
            cellState.occupantsStr = occStr.join('，');

            // 音乐路由
            if (humans === 1 && totalPets === 0) cellState.trackName = MUSIC_LIB.OSCAR[Math.floor(Math.random()*10)];
            else if (humans === 0 && totalPets === 1) cellState.trackName = MUSIC_LIB.KIDS[Math.floor(Math.random()*10)];
            else if (humans === 1 && totalPets === 1) cellState.trackName = MUSIC_LIB.COUNTRY[Math.floor(Math.random()*10)];
            else if (humans === 0 && totalPets === 2 && Object.keys(petCats).length === 1) cellState.trackName = MUSIC_LIB.LYRICAL[Math.floor(Math.random()*10)];
            else if (totalLifeforms >= 3) cellState.trackName = MUSIC_LIB.SYMPHONY[Math.floor(Math.random()*10)];
            else cellState.trackName = MUSIC_LIB.KIDS[0]; 

            // 视频路由
            if (hasTV && (humans > 0 || dogsCats > 0)) {
               const mLib = MOVIE_LIB[avatarInfo.role] || MOVIE_LIB.DEFAULT;
               cellState.movieName = mLib[Math.floor(Math.random()*mLib.length)];
            } else { cellState.movieName = null; }

            cellState.powerW = SMART_CONSTANTS.POWER.LIGHT + SMART_CONSTANTS.POWER.HVAC + SMART_CONSTANTS.POWER.SOUND + (cellState.movieName ? SMART_CONSTANTS.POWER.TV : 0) + (cellState.cameraOn ? SMART_CONSTANTS.POWER.CAMERA : 0);
         }
         needsUpdate = true;
      }

      // 4. 延时熄灭与能耗积分累加
      if (cellState.isActive) {
         if (nowMs - cellState.lastSeenTime > SMART_CONSTANTS.DELAY_MS) {
            cellState.isActive = false;
            cellState.cameraOn = false;
            cellState.totalEnergyWh += cellState.sessionEnergyWh;
            cellState.sessionEnergyWh = 0;
            cellState.powerW = 0;
            cellState.trackName = null;
            cellState.movieName = null;
            cellState.occupantsStr = '无生命体';
            needsUpdate = true;
         } else {
            cellState.sessionEnergyWh += cellState.powerW * (1 / 3600);
            needsUpdate = true;
         }
      }

      if (needsUpdate) { next[cellId] = cellState; stateChanged = true; }
    });
  });

  return { nextState: next, stateChanged };
};