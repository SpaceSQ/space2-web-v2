"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { GlobalNav } from '@/components/GlobalNav';
import { AVATAR_ROLES } from '@/config/avatars';
import { HUMAN_BEHAVIOR_MATRIX } from '@/config/behavior';
import { DEFAULT_CELLS, ROOM_1_ITEMS, AGI_BLUEPRINTS } from '@/config/blueprints';
import { SVGSymbols } from '@/components/SVGSymbols';
import { DigitalHuman } from '@/components/DigitalHuman';
import { PixelPet } from '@/components/PixelPet';
import { PET_CATEGORIES, PET_DIALOGUE_MATRIX } from '@/config/pet_genes';
import { getPetInteraction, HUMAN_PET_INTERACTIONS, HumanAction } from '@/config/interactions';

// 🔥 引入模块化的智能家居引擎 🔥
import { processSmartHomeTick, SmartSpaceState } from '@/smarthome/engine';
import { FlightBoard } from '@/smarthome/FlightBoard';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

interface RoomData { id: number; gridX: number; gridY: number; cells: boolean[]; items: any[]; }

const MAX_COLS = 5; 
const MAX_ROWS = 6;
const MAX_ROOMS = 30;

const PERSONALITIES = [
  { value: 'ACTIVE', label: '探索型 (活泼好动，容易乱跑)' },
  { value: 'SHY', label: '粘人型 (胆小，寸步不离)' },
  { value: 'LAZY', label: '慵懒型 (嗜睡，不爱动)' }
];

const generateOriginAddress = () => {
  const sec = ['SEC-A', 'SEC-B', 'SEC-O', 'SEC-X'][Math.floor(Math.random()*4)];
  const zone = Math.floor(Math.random() * 99 + 1);
  const block = ['ALPHA', 'BETA', 'GAMMA'][Math.floor(Math.random()*3)];
  const unit = Math.floor(Math.random() * 999 + 100);
  const pod = Math.floor(Math.random() * 99 + 1);
  
  return `${sec}.${zone}.${block}.${unit}.${pod}`;
};

export default function Holodeck() {
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState('PRO'); 
  const [editMode, setEditMode] = useState<'NONE' | 'SPACE' | 'FURNITURE'>('NONE'); 
  const [mapScale, setMapScale] = useState(0.8); 
  const [logs, setLogs] = useState<{time: string, text: string}[]>([]);

  // 🏡 空间与装修状态
  const [rooms, setRooms] = useState<RoomData[]>([]);
  const [selectedRoomForAgi, setSelectedRoomForAgi] = useState<number>(1);
  const [agiInput, setAgiInput] = useState('');
  const [agiTheme, setAgiTheme] = useState('LIVING_MODERN'); 
  const [agiProcessing, setAgiProcessing] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingItem, setDraggingItem] = useState<{roomId: number, itemIdx: number} | null>(null);

  // 🐾 实体数据源
  const [petData, setPetData] = useState<any>(null); 
  const [adoptedPets, setAdoptedPets] = useState<any[]>([]); 
  const [plazaPetIds, setPlazaPetIds] = useState<string[]>([]); 
  const [activeHomePets, setActiveHomePets] = useState<any[]>([]); 

  // 🖥️ 界面弹窗状态
  const [showIncubator, setShowIncubator] = useState(false); 
  const [showTransitHub, setShowTransitHub] = useState(false);
  const [selectedTravelPets, setSelectedTravelPets] = useState<string[]>([]);
  const [showRoleSelector, setShowRoleSelector] = useState(true);
  const [showHatchWizard, setShowHatchWizard] = useState(false);
  const [hatchForm, setHatchForm] = useState({ name: '', category: PET_CATEGORIES[0], gender: '公', personality: 'ACTIVE' });

  // 🧑‍🚀 数字人状态
  const [isAvatarPresent, setIsAvatarPresent] = useState(false); 
  const [avatarRole, setAvatarRole] = useState<string>('HACKER');
  const [avatarPos, setAvatarPos] = useState({ x: 50, y: 60 });
  const [avatarMoving, setAvatarMoving] = useState(false);
  const [avatarAction, setAvatarAction] = useState('IDLE'); 
  const [avatarFacingRight, setAvatarFacingRight] = useState(true);
  const [avatarBubble, setAvatarBubble] = useState<string | null>(null);
  const [avatarSpeed, setAvatarSpeed] = useState(0.8);
  
  // 🔌 智能家居中央状态
  const [smartEnv, setSmartEnv] = useState<Record<string, SmartSpaceState>>({});
  const [currentTime, setCurrentTime] = useState(new Date());

  const avatarPosRef = useRef({ x: 50, y: 60 });
  const avatarActionRef = useRef('IDLE');
  const avatarMovingRef = useRef(false);
  const busyUntilRef = useRef<number>(0); 
  const lastInteractionRef = useRef<number>(Date.now());
  const [activeBuff, setActiveBuff] = useState<string | null>(null); 

  // 🔥 防闭包引用的 Refs (保证智能家居引擎能读到最新数据)
  const roomsRef = useRef(rooms);
  useEffect(() => { roomsRef.current = rooms; }, [rooms]);
  const activeHomePetsRef = useRef(activeHomePets);
  useEffect(() => { activeHomePetsRef.current = activeHomePets; }, [activeHomePets]);

  const MAX_PETS_QUOTA = userTier === 'PRO' ? 10 : (userTier === 'PLUS' ? 4 : 2);
  const isAnyPetClose = isAvatarPresent && activeHomePets.some(p => Math.hypot(avatarPos.x - p.x, avatarPos.y - p.y) < 25);
  const isEstateComplete = rooms.length > 1 && rooms.every(r => r.items.length > 0);
  const isGodEstate = rooms.length === MAX_ROOMS && isEstateComplete;

  useEffect(() => { avatarActionRef.current = avatarAction; }, [avatarAction]);
  useEffect(() => { avatarMovingRef.current = avatarMoving; }, [avatarMoving]);

  const addLog = (speaker: string, text: string) => { setLogs(prev => [...prev.slice(-8), { time: new Date().toLocaleTimeString('zh-CN', { hour12: false }), text: `[${speaker}] ${text}` }]); };

  // =====================================================================
  // 💾 系统启动与初始化
  // =====================================================================
  useEffect(() => {
    const initEngine = async () => {
      try {
        const savedRooms = localStorage.getItem('space2_estate_v1');
        let initRooms = savedRooms ? JSON.parse(savedRooms) : [{ id: 1, gridX: 0, gridY: 0, cells: [...DEFAULT_CELLS], items: ROOM_1_ITEMS }];
        if (!initRooms[0].items.some((i:any) => i.type === 'TV')) {
           initRooms[0].items.push({ type: 'TV', x: 80, y: 10, w: 15, h: 5 }); 
        }
        setRooms(initRooms);

        const savedMainPet = localStorage.getItem('space2_main_pet');
        let mainPet = savedMainPet ? JSON.parse(savedMainPet) : { id: 'main-001', name: '初代像素犬', category: '像素犬', gender: '公', ageDays: 120, adoptedAt: Date.now() - 4 * 86400000, origin: 'HATCHED', originAddress: generateOriginAddress(), personality: 'ACTIVE' };
        setPetData(mainPet);
        if (!savedMainPet) localStorage.setItem('space2_main_pet', JSON.stringify(mainPet));

        const adopted = JSON.parse(localStorage.getItem('space2_adopted_pets') || '[]');
        setAdoptedPets(adopted);

        const inPlaza = JSON.parse(localStorage.getItem('space2_plaza_pets') || '[]');
        const inPlazaIds = inPlaza.map((p: any) => p.id);
        setPlazaPetIds(inPlazaIds);

        const allPets = mainPet ? [mainPet, ...adopted] : [...adopted];
        const petsAtHome = allPets.filter(p => !inPlazaIds.includes(p.id));

        const initializedHomePets = petsAtHome.map((p) => ({
           ...p, x: 50 + (Math.random() * 10 - 5), y: 50 + (Math.random() * 10 - 5),
           action: 'IDLE', mood: 'JOY', bubble: '回家啦！', facingRight: Math.random() > 0.5, busyUntil: 0
        }));
        
        setActiveHomePets(initializedHomePets);
        setTimeout(() => { setActiveHomePets(prev => prev.map(p => ({ ...p, bubble: null }))); }, 3000);

        const savedSmart = localStorage.getItem('space2_smart_env');
        if (savedSmart) setSmartEnv(JSON.parse(savedSmart));

      } catch (e) {} finally { setLoading(false); }
    };
    initEngine();
  }, []);

  const handleSaveAndExit = () => { localStorage.setItem('space2_estate_v1', JSON.stringify(rooms)); setEditMode('NONE'); addLog('System', '✅ 空间数据与装饰修改已永久固化。'); };

  // =====================================================================
  // ⚡ 独立智能家居雷达：解耦运行，不干扰主动画循环
  // =====================================================================
  useEffect(() => {
    if (loading || editMode !== 'NONE') return;
    const envBrain = setInterval(() => {
       const nowTime = new Date();
       setCurrentTime(nowTime);
       
       setSmartEnv(prev => {
          // 使用最新引用，彻底避免闭包滞后导致的空白房失效问题
          const avatarInfo = { present: isAvatarPresent, x: avatarPosRef.current.x, y: avatarPosRef.current.y, role: avatarRole };
          const { nextState, stateChanged } = processSmartHomeTick(prev, roomsRef.current, avatarInfo, activeHomePetsRef.current, nowTime.getTime());
          
          if (stateChanged && nowTime.getSeconds() % 5 === 0) {
             localStorage.setItem('space2_smart_env', JSON.stringify(nextState));
          }
          return stateChanged ? nextState : prev;
       });
    }, 1000); 
    return () => clearInterval(envBrain);
  }, [loading, editMode, isAvatarPresent, avatarRole]);

  // =====================================================================
  // 🐾 防遗忘与状态锁定惩罚
  // =====================================================================
  useEffect(() => {
    const checkRunaways = setInterval(() => {
       const now = Date.now(); let hasRunaway = false;
       const remainingPets = adoptedPets.filter(p => {
          if (p.isWaiting && (now - p.adoptedAt > 3 * 24 * 60 * 60 * 1000)) {
             hasRunaway = true; 
             const returnedStrays = JSON.parse(localStorage.getItem('space2_returned_strays') || '[]');
             returnedStrays.push({ ...p, returnedAt: now, statusDesc: '等待太久，失望逃跑', memoryQuote: '我以为我终于有家了...', bubble: '为什么不理我...' });
             localStorage.setItem('space2_returned_strays', JSON.stringify(returnedStrays));
             return false; 
          }
          return true;
       });
       if (hasRunaway) {
          setAdoptedPets(remainingPets); localStorage.setItem('space2_adopted_pets', JSON.stringify(remainingPets));
          setActiveHomePets(prev => prev.filter(p => remainingPets.some(rp => rp.id === p.id) || p.id === petData?.id));
          addLog('System', '⚠️ 警告：有一只领养宠物由于被忽略，已绝望地逃回流浪广场。');
       }
    }, 10000); 
    return () => clearInterval(checkRunaways);
  }, [adoptedPets, petData]);

  // =====================================================================
  // 🗺️ 空间划分与编辑引擎
  // =====================================================================
  const toggleCellState = (index: number, roomId: number) => {
    if (editMode !== 'SPACE' || index === 4) return; 
    setRooms(prev => prev.map(r => { if (r.id === roomId) { const newCells = [...r.cells]; newCells[index] = !newCells[index]; return { ...r, cells: newCells }; } return r; }));
  };

  const getExpansionSlots = () => {
    if (editMode !== 'NONE' || rooms.length >= MAX_ROOMS) return [];
    const slots: {x: number, y: number}[] = [];
    rooms.forEach(r => {
      if (r.gridX + 1 < MAX_COLS && !rooms.some(rm => rm.gridX === r.gridX + 1 && rm.gridY === r.gridY)) { if (!slots.some(s => s.x === r.gridX + 1 && s.y === r.gridY)) slots.push({x: r.gridX + 1, y: r.gridY}); }
      if (r.gridY + 1 < MAX_ROWS && !rooms.some(rm => rm.gridX === r.gridX && rm.gridY === r.gridY + 1)) { if (!slots.some(s => s.x === r.gridX && s.y === r.gridY + 1)) slots.push({x: r.gridX, y: r.gridY + 1}); }
    });
    return slots;
  };
  const expansionSlots = getExpansionSlots();

  const handleRoomExpansion = (targetGridX: number, targetGridY: number) => {
    if (rooms.length >= MAX_ROOMS) return;
    const newRoomId = rooms.length + 1; 
    // 🔥 优化：新建房间默认放一张沙发，验证摄像头逻辑
    const newRooms = [...rooms, { id: newRoomId, gridX: targetGridX, gridY: targetGridY, cells: [...DEFAULT_CELLS], items: [{ type: 'SOFA', x: 40, y: 40, w: 12, h: 24 }] }];
    setRooms(newRooms); localStorage.setItem('space2_estate_v1', JSON.stringify(newRooms)); addLog('Architect', `✨ 已构建 ${newRoomId} 号房间。`);
  };

  const maxRenderX = Math.max(...rooms.map(r => r.gridX), ...expansionSlots.map(s => s.x));
  const maxRenderY = Math.max(...rooms.map(r => r.gridY), ...expansionSlots.map(s => s.y));
  const viewBoxSize = Math.max(200, (maxRenderX + 1) * 100, (maxRenderY + 1) * 100);

  // =====================================================================
  // 🛋️ AGI 创世与家具拖拽引擎
  // =====================================================================
  const applyAgiTemplate = (roomId: number, theme: string) => {
    if (!AGI_BLUEPRINTS[theme]) return;
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
         let newItems = [...AGI_BLUEPRINTS[theme]];
         if (roomId === 1) { newItems = newItems.filter(i => i.type !== 'SUPPLY' && i.type !== 'LITTER_BOX'); newItems.push({ type: 'SUPPLY', x: 40, y: 55, w: 10, h: 6 }); newItems.push({ type: 'LITTER_BOX', x: 52, y: 55, w: 10, h: 6 }); }
         return { ...r, items: newItems };
      }
      return r;
    }));
  };

  const handleAgiFurnishBySelect = (e: React.FormEvent) => { e.preventDefault(); if (!selectedRoomForAgi || agiProcessing) return; setAgiProcessing(true); setTimeout(() => { applyAgiTemplate(selectedRoomForAgi, agiTheme); setAgiProcessing(false); }, 1500); };
  
  const submitAGICommand = (e: React.FormEvent) => {
    e.preventDefault(); const cmd = agiInput.trim(); if (!cmd || agiProcessing || !selectedRoomForAgi) return;
    setAgiProcessing(true); setAgiInput('');
    setTimeout(() => {
      let themeToApply = null;
      if (cmd.includes('现代客厅')) themeToApply = 'LIVING_MODERN'; else if (cmd.includes('古典客厅')) themeToApply = 'LIVING_CLASSIC'; else if (cmd.includes('大餐厅')) themeToApply = 'DINING_FEAST'; else if (cmd.includes('探险')) themeToApply = 'ADVENTURE_SPACE';
      if (themeToApply) { applyAgiTemplate(selectedRoomForAgi, themeToApply); setAgiProcessing(false); return; }
      let isRemove = cmd.includes('删') || cmd.includes('去'); let targetType: string | null = null; let targetW = 10, targetH = 10;
      if (cmd.includes('沙发')) { targetType = 'SOFA'; targetW = 12; targetH = 24; } else if (cmd.includes('植物')) { targetType = 'PLANT'; targetW = 8; targetH = 8; } else if (cmd.includes('床')) { targetType = 'BED'; targetW = 25; targetH = 18; } else if (cmd.includes('电视')) { targetType = 'TV'; targetW = 15; targetH = 5; }
      if (isRemove) {
        if ((targetType === 'SUPPLY' || targetType === 'LITTER_BOX') && selectedRoomForAgi === 1) {} 
        else { setRooms(prev => prev.map(r => { if (r.id === selectedRoomForAgi) { const idx = r.items.findIndex(i => i.type === targetType); if (idx > -1) { const newItems = [...r.items]; newItems.splice(idx, 1); return { ...r, items: newItems }; } } return r; })); }
      } else if (targetType) { setRooms(prev => prev.map(r => { if (r.id === selectedRoomForAgi) { return { ...r, items: [...r.items, { type: targetType, x: 40, y: 40, w: targetW, h: targetH }] }; } return r; })); }
      setAgiProcessing(false);
    }, 1000);
  };

  const handlePointerDown = (e: React.PointerEvent, roomId: number, idx: number, type: string) => { if (editMode !== 'FURNITURE' || type === 'WALL' || type === 'DOOR') return; e.stopPropagation(); try { (e.target as Element).setPointerCapture(e.pointerId); } catch(err){} setDraggingItem({ roomId, itemIdx: idx }); };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingItem || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY; const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse());
    setRooms(prevRooms => prevRooms.map(room => {
      if (room.id === draggingItem.roomId) {
        const newItems = [...room.items]; const item = newItems[draggingItem.itemIdx];
        let newX = (svgP.x - room.gridX * 100) - (item.w || 10) / 2; let newY = (svgP.y - room.gridY * 100) - (item.h || 10) / 2;
        if ((item.type === 'SUPPLY' || item.type === 'LITTER_BOX') && room.id === 1) { newX = Math.max(33.33, Math.min(66.66 - (item.w||10), newX)); newY = Math.max(33.33, Math.min(66.66 - (item.h||10), newY)); } 
        else { newX = Math.max(2, Math.min(98 - (item.w||10), newX)); newY = Math.max(2, Math.min(98 - (item.h||10), newY)); }
        newItems[draggingItem.itemIdx] = { ...item, x: newX, y: newY }; return { ...room, items: newItems };
      }
      return room;
    }));
  };
  const handlePointerUp = (e: React.PointerEvent) => { if (draggingItem) { try { (e.target as Element).releasePointerCapture(e.pointerId); } catch(err){} setDraggingItem(null); } };

  // =====================================================================
  // 🐾 宠物 AI 引擎：寻路与指令
  // =====================================================================
  const getPoiCoord = (type: string) => {
    let coord = { x: 50, y: 50 };
    rooms.forEach(r => r.items.forEach(i => { if (i.type === type) coord = { x: r.gridX * 100 + i.x + (i.w||10)/2, y: r.gridY * 100 + i.y + (i.h||10)/2 + 4 }; }));
    return coord;
  };
  
  const constrainToValidRooms = (x: number, y: number) => {
    let rX = Math.floor(x / 100); let rY = Math.floor(y / 100);
    if (!rooms.some(r => r.gridX === rX && r.gridY === rY)) return { x: 50, y: 50 }; 
    const localX = Math.max(3, Math.min(97, x % 100)); const localY = Math.max(3, Math.min(97, y % 100));
    return { x: rX * 100 + localX, y: rY * 100 + localY };
  };

  // 数字人与宠物物理漫游
  useEffect(() => {
    if (loading || editMode !== 'NONE') return;
    const gameTick = setInterval(() => {
       const now = Date.now();
       
       if (isAvatarPresent) {
          if (now < busyUntilRef.current) {
             if (activeBuff === 'ACCOMPANY') {
                if (!avatarMovingRef.current && Math.random() < 0.6) {
                   const angle = Math.random() * Math.PI * 2; const dist = 10 + Math.random() * 15;
                   const validPos = constrainToValidRooms(avatarPosRef.current.x + Math.cos(angle) * dist, avatarPosRef.current.y + Math.sin(angle) * dist);
                   if (validPos.x < avatarPosRef.current.x) setAvatarFacingRight(false); else setAvatarFacingRight(true);
                   avatarPosRef.current = validPos; setAvatarPos(validPos); setAvatarMoving(true); setAvatarSpeed(1.6); 
                   setTimeout(() => setAvatarMoving(false), 1600);
                }
             }
          } else { 
             setAvatarSpeed(0.8); 
             if (avatarActionRef.current !== 'IDLE' && avatarActionRef.current !== 'WALK') { setAvatarAction('IDLE'); avatarActionRef.current = 'IDLE'; }
             if (!avatarMovingRef.current && !activeBuff && Math.random() < 0.4) {
                const angle = Math.random() * Math.PI * 2; const dist = 20 + Math.random() * 40;
                const validPos = constrainToValidRooms(avatarPosRef.current.x + Math.cos(angle) * dist, avatarPosRef.current.y + Math.sin(angle) * dist);
                if (validPos.x < avatarPosRef.current.x) setAvatarFacingRight(false); else setAvatarFacingRight(true);
                avatarPosRef.current = validPos; setAvatarPos(validPos); setAvatarMoving(true); setTimeout(() => setAvatarMoving(false), 800);
             }
          }
       }

       if (!activeBuff) {
          setActiveHomePets(prev => prev.map(p => {
             if (p.isWaiting || (p.busyUntil && now < p.busyUntil)) return p; 
             if (Math.random() < 0.4) {
                const angle = Math.random() * Math.PI * 2; const dist = 10 + Math.random() * 15;
                const validPos = constrainToValidRooms(p.x + Math.cos(angle) * dist, p.y + Math.sin(angle) * dist);
                return { ...p, x: validPos.x, y: validPos.y, action: 'MOVE', mood: 'CALM', facingRight: validPos.x > p.x, bubble: null };
             } else if (Math.random() < 0.2) {
                const catQuote = PET_DIALOGUE_MATRIX[p.category] || PET_DIALOGUE_MATRIX["像素犬"];
                return { ...p, action: 'IDLE', bubble: catQuote['IDLE'] ? catQuote['IDLE'][0] : "..." };
             }
             return { ...p, action: 'IDLE', bubble: null };
          }));
       }
    }, 4000);
    return () => clearInterval(gameTick);
  }, [loading, editMode, isAvatarPresent, rooms, activeBuff]);

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (editMode !== 'NONE' || !isAvatarPresent) return;
    busyUntilRef.current = 0; setAvatarAction('IDLE'); avatarActionRef.current = 'IDLE'; setAvatarBubble(null); setActiveBuff(null);
    const pt = (e.currentTarget as SVGSVGElement).createSVGPoint(); pt.x = e.clientX; pt.y = e.clientY;
    const svgP = pt.matrixTransform((e.currentTarget as SVGSVGElement).getScreenCTM()!.inverse());
    const validPos = constrainToValidRooms(svgP.x, svgP.y);
    if (validPos.x < avatarPosRef.current.x) setAvatarFacingRight(false); else setAvatarFacingRight(true);
    avatarPosRef.current = validPos; setAvatarPos(validPos); setAvatarMoving(true); setAvatarSpeed(0.8);
    
    setTimeout(() => {
      setAvatarMoving(false);
      setActiveHomePets(prev => prev.map(p => {
         if (p.isWaiting && Math.hypot(validPos.x - p.x, validPos.y - p.y) < 15) { 
            addLog('Interaction', `你接纳了领养的宠物！`); 
            return { ...p, isWaiting: false, bubble: '❤️ 谢谢你', mood: 'JOY' }; 
         }
         return p;
      }));
    }, 800);
  };

  // =====================================================================
  // 🎮 双轨互动控制台 (动作触发器)
  // =====================================================================
  const triggerAvatarInteraction = (actionType: string) => {
    if (!isAvatarPresent) return;
    const now = Date.now();
    busyUntilRef.current = now + 4000; setActiveBuff(null);

    if (actionType === 'CALL') {
      setAvatarAction('IDLE'); setAvatarBubble("宝贝们，过来！"); setTimeout(() => setAvatarBubble(null), 3000);
      setActiveHomePets(prev => prev.map(p => { 
         if (p.isWaiting || (p.busyUntil && now < p.busyUntil)) return p; 
         return { ...p, x: avatarPosRef.current.x + (Math.random()*12 - 6), y: avatarPosRef.current.y + (Math.random()*12 - 6), action: 'RUN', bubble: "来啦！", mood: 'JOY' }; 
      }));
      setTimeout(() => setActiveHomePets(prev => prev.map(p => ({...p, bubble: null}))), 2000);
    } 
    else if (Object.values(HumanAction).includes(actionType as HumanAction)) {
       const msgs: Record<string, string> = { PET: "真乖...", PLAY: "丢球！", SCOLD: "调皮！不准这样！", DRIVE_AWAY: "去去去，一边玩去！", PUNISH: "找打是不是！(挥手)" };
       setAvatarAction(actionType === 'PUNISH' ? 'RUN' : 'IDLE'); 
       setAvatarBubble(msgs[actionType]); setTimeout(() => setAvatarBubble(null), 3000);

       setActiveHomePets(prev => prev.map(p => {
          const dist = Math.hypot(avatarPosRef.current.x - p.x, avatarPosRef.current.y - p.y);
          if (dist < 25 && !p.isWaiting) {
              const catReactions = HUMAN_PET_INTERACTIONS[p.category] || HUMAN_PET_INTERACTIONS["像素犬"];
              const reaction = catReactions[actionType as HumanAction];
              if (reaction) { return { ...p, mood: reaction.mood, action: reaction.action, bubble: reaction.bubble, busyUntil: now + reaction.duration }; }
          }
          return p;
       }));
       if(actionType === 'ACCOMPANY') { setActiveBuff('ACCOMPANY'); busyUntilRef.current = Date.now() + 900000; }
       addLog('Human', `你对周围执行了 [${actionType}] 操作。`);
    }
  };

  const triggerPetAction = (command: string) => { 
    if (activeHomePets.length === 0 || editMode !== 'NONE') return; 
    if (command === 'EXPLORE' || command === 'SLEEP') { setActiveBuff(null); } else { 
       setActiveBuff(command); 
       setActiveHomePets(prev => prev.map(p => {
           if (p.isWaiting) return p;
           const catQuote = PET_DIALOGUE_MATRIX[p.category] || PET_DIALOGUE_MATRIX["像素犬"];
           const q = catQuote[command] || ["收到！"];
           
           let newX = p.x; let newY = p.y; let newAct = 'IDLE';
           if (command === 'EAT') { const sp = getPoiCoord('SUPPLY'); newX = sp.x; newY = sp.y; newAct = 'EAT'; }
           if (command === 'POOP') { const lp = getPoiCoord('LITTER_BOX'); newX = lp.x; newY = lp.y; newAct = 'POOP'; }
           if (command === 'RUN') {
              const angle = Math.random() * Math.PI * 2; const dist = 15 + Math.random() * 25;
              const vp = constrainToValidRooms(p.x + Math.cos(angle) * dist, p.y + Math.sin(angle) * dist);
              newX = vp.x; newY = vp.y; newAct = 'RUN';
           }

           return { ...p, bubble: q[Math.floor(Math.random()*q.length)], x: newX, y: newY, action: newAct };
       }));
       setTimeout(() => setActiveHomePets(prev => prev.map(p => ({...p, bubble: null}))), 3000);
       setTimeout(() => setActiveBuff(null), 5000);
    } 
  };

  const selectRole = (key: string) => { setAvatarRole(key); setShowRoleSelector(false); setIsAvatarPresent(true); lastInteractionRef.current = Date.now(); };
  const toggleTravelPet = (id: string) => { setSelectedTravelPets(prev => { if (prev.includes(id)) return prev.filter(pid => pid !== id); if (prev.length >= 3) { alert("每次最多带 3 只宠物前往广场！"); return prev; } return [...prev, id]; }); };
  const dispatchToSquare = () => {
    const petsToTravel = activeHomePets.filter(p => selectedTravelPets.includes(p.id)).map(p => ({ ...p, plazaEntryTime: Date.now() }));
    localStorage.setItem('space2_traveling_pets', JSON.stringify(petsToTravel)); window.location.href = '/square';
  };


  // =====================================================================
  // 🧬 孵化向导与生命管理中心 (区分退回与流放)
  // =====================================================================
  const triggerHatchWizard = () => {
    if (activeHomePets.length + plazaPetIds.length >= MAX_PETS_QUOTA) return alert("配额已满！请先在下方停止养育或弃养宠物以腾出空间。");
    setShowIncubator(false); setHatchForm({ name: '', category: PET_CATEGORIES[0], gender: '公', personality: 'ACTIVE' }); setShowHatchWizard(true);
  };

  const confirmHatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newPet = { id: `hatched-${Date.now()}`, name: hatchForm.name.trim() || '未命名生命', category: hatchForm.category, gender: hatchForm.gender, personality: hatchForm.personality, originAddress: generateOriginAddress(), ageDays: 1, adoptedAt: Date.now(), origin: 'HATCHED' };
    if (!petData) { setPetData(newPet); localStorage.setItem('space2_main_pet', JSON.stringify(newPet)); } else { const newAdopted = [...adoptedPets, newPet]; setAdoptedPets(newAdopted); localStorage.setItem('space2_adopted_pets', JSON.stringify(newAdopted)); }
    setActiveHomePets(prev => [...prev, { ...newPet, x: 50, y: 50, action: 'IDLE', mood: 'JOY' }]);
    addLog('System', `🥚 基因序列编译完成！[${newPet.name}] 已降生。`); setShowHatchWizard(false);
  };

  const handlePetRemoval = (petId: string, isMain: boolean, actionType: 'STOP' | 'ABANDON') => {
    let targetPet = isMain ? petData : adoptedPets.find(p => p.id === petId);
    if (!targetPet) return;
    const origin = targetPet.origin || (isMain ? 'HATCHED' : 'ADOPTED');

    if (actionType === 'STOP') {
       if (origin === 'HATCHED') {
          const confirmStop = window.confirm("💡 停止养育：这是自行孵化的宠物，数据将被彻底物理消除，不会占用公共资源。确定吗？");
          if (!confirmStop) return;
       } else {
          const confirmReturn = window.confirm("🔙 退回广场：这是你从广场领养的流浪宠物，它将被退回流浪公园，不占用弃养罪恶值。确定吗？");
          if (!confirmReturn) return;
          const returnedStrays = JSON.parse(localStorage.getItem('space2_returned_strays') || '[]');
          returnedStrays.push({ ...targetPet, returnedAt: Date.now(), statusDesc: '被退回，不知所措', memoryQuote: '为什么又不要我了...', bubble: '又被抛弃了...' });
          localStorage.setItem('space2_returned_strays', JSON.stringify(returnedStrays));
       }
       if (isMain) { setPetData(null); localStorage.removeItem('space2_main_pet'); } else { const newAdopted = adoptedPets.filter(p => p.id !== petId); setAdoptedPets(newAdopted); localStorage.setItem('space2_adopted_pets', JSON.stringify(newAdopted)); }
       setActiveHomePets(prev => prev.filter(p => p.id !== petId)); addLog('System', `✅ 已终止对 [${targetPet.name || targetPet.category}] 的养育。`);
    } 
    else if (actionType === 'ABANDON') {
       const existingAbandoned = localStorage.getItem('space2_abandoned_pet');
       if (existingAbandoned) {
          const abPet = JSON.parse(existingAbandoned);
          if ((Date.now() - abPet.abandonedAt) / 86400000 < 365) return alert("🚫 系统拒绝：您的弃养记录中已经有一只流浪宠物！在它被别人领养或满1年销毁前，您无权再次弃养多余的生命！");
       }
       const confirmAbandon = window.confirm("💔 弃养协议：它陪伴你超过了3天，弃养后它将立即流放到黑域。确定要抛弃它吗？");
       if (!confirmAbandon) return;
       if (isMain) { setPetData(null); localStorage.removeItem('space2_main_pet'); } else { const newAdopted = adoptedPets.filter(p => p.id !== petId); setAdoptedPets(newAdopted); localStorage.setItem('space2_adopted_pets', JSON.stringify(newAdopted)); }
       localStorage.setItem('space2_abandoned_pet', JSON.stringify({ ...targetPet, abandonedAt: Date.now() }));
       setActiveHomePets(prev => prev.filter(p => p.id !== petId)); addLog('System', `💔 弃养执行完毕。[${targetPet.name || targetPet.category}] 已被流放至黑域。`);
    }
    setShowIncubator(false);
  };

  const toggleZoom = () => { setMapScale(prev => prev === 0.8 ? 1.2 : (prev === 1.2 ? 0.4 : 0.8)); };
  
  if (loading) return <div className="bg-black min-h-screen text-emerald-500 flex items-center justify-center font-mono">BOOTING SYSTEM...</div>;
  const isDay = currentTime.getHours() >= 6 && currentTime.getHours() < 18;

  return (
<div className="w-screen h-[100dvh] bg-zinc-950 overflow-hidden relative select-none font-mono">
      {/* 🔥 插入全新的全局导航栏 🔥 */}
      <GlobalNav currentScene="HOLODECK" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      
      {editMode === 'FURNITURE' && (<div className="absolute top-36 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-8 py-3 rounded-full font-black text-sm tracking-widest uppercase shadow-[0_0_40px_#eab308] z-50 pointer-events-none flex items-center gap-2">🛠️ 摆放模式</div>)}
      {editMode === 'SPACE' && (<div className="absolute top-36 left-1/2 -translate-x-1/2 bg-red-600 text-white px-8 py-3 rounded-full font-black text-sm tracking-widest uppercase shadow-[0_0_40px_#dc2626] z-50 pointer-events-none flex items-center gap-2">🗺️ 空间划分模式</div>)}

      {/* 🚀 赛博航班信息控制台 */}
      
      {editMode === 'NONE' && (
         
         <div className="absolute top-2 left-1/2 -translate-x-1/2 w-full max-w-4xl bg-black/80 backdrop-blur-xl border border-blue-900/50 rounded-xl p-3 z-40 shadow-[0_10px_40px_rgba(0,0,0,0.8)] pointer-events-none">
            <div className="text-[10px] text-blue-400 font-black mb-2 flex justify-between border-b border-blue-900/50 pb-1">
               <span>SYS.ENVIRONMENT_HUB</span>
               <span className="text-emerald-500 animate-pulse">LIVE MONITORING 1Hz</span>
            </div>
            <div className="h-20 overflow-y-auto pr-2 custom-scrollbar">
               <FlightBoard smartEnv={smartEnv} currentTime={currentTime} />
            </div>
         </div>
      )}

      <div className="absolute inset-0 flex items-center justify-center overflow-hidden touch-none">
         <div className="relative flex items-center justify-center transition-all duration-700 ease-out" style={{ transform: `scale(${mapScale})` }}>
            <div className="relative drop-shadow-[0_0_50px_rgba(59,130,246,0.1)]" style={{ width: `${viewBoxSize}px`, height: `${viewBoxSize}px`, maxWidth: '90vmin', maxHeight: '90vmin' }}>
               <svg ref={svgRef} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className={`absolute inset-0 w-full h-full ${editMode === 'NONE' ? 'cursor-crosshair' : ''}`} onClick={handleMapClick} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp}>
                 {rooms.map(room => (
                   <g key={`room-${room.id}`} transform={`translate(${room.gridX * 100}, ${room.gridY * 100})`}>
                     <rect x="0" y="0" width="100" height="100" fill={editMode !== 'NONE' ? '#061026' : '#030a1c'} stroke={room.items.length === 0 ? "#ef4444" : (editMode !== 'NONE' ? '#fcd34d' : '#1e3a8a')} strokeWidth="1" opacity={room.items.length === 0 ? 0.3 : 0.8} />
                     
                     {/* 🌈 空间九宫格与光影环境渲染 */}
                     {room.cells.map((isSafe, index) => {
                       const x = (index % 3) * 33.33; const y = Math.floor(index / 3) * 33.33;
                       const cellState = smartEnv[`R${room.id}-C${index}`];
                       
                       let bgFill = 'transparent';
                       if (editMode === 'NONE' && isSafe) {
                          if (cellState?.isActive) bgFill = 'rgba(254, 240, 138, 0.4)'; 
                          else if (isDay) bgFill = 'rgba(226, 232, 240, 0.5)'; 
                          else bgFill = 'rgba(0, 0, 0, 0.8)'; 
                       } else if (editMode === 'SPACE') {
                          bgFill = isSafe ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)';
                       }

                       return (
                         <g key={`cell-${index}`} onClick={editMode === 'SPACE' && index !== 4 ? (e) => { e.stopPropagation(); toggleCellState(index, room.id); } : undefined} style={{ cursor: editMode === 'SPACE' && index !== 4 ? 'pointer' : 'default' }}>
                           
                           {editMode === 'SPACE' ? (
                              <g>
                                 <rect x={x} y={y} width="33.33" height="33.33" fill={bgFill} stroke={isSafe ? '#10b981' : '#ef4444'} strokeWidth="1" className="hover:opacity-80 transition-opacity" />
                                 <text x={x+16.66} y={y+16.66} fontSize="4" fill={isSafe ? '#10b981' : '#ef4444'} textAnchor="middle" dominantBaseline="middle" className="font-bold tracking-widest">{isSafe ? 'STD' : 'HIDE'}</text>
                                 {index === 4 && <text x={x+16.66} y={y+22} fontSize="2" fill="#10b981" textAnchor="middle">CORE</text>}
                              </g>
                           ) : (
                              <g>
                                 <rect x={x} y={y} width="33.33" height="33.33" fill={bgFill} stroke="#3b82f6" strokeWidth="0.2" opacity="0.4" strokeDasharray="1,2" className="transition-colors duration-1000" />
                                 {isSafe && <rect x={x+0.5} y={y+0.5} width="32.33" height="32.33" fill="rgba(16,185,129,0.05)" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />}
                                 {!isSafe && <rect x={x+0.5} y={y+0.5} width="32.33" height="32.33" fill="rgba(239,68,68,0.05)" />}
                                 
                                 {/* 累计电量账单 */}
                                 {isSafe && cellState && !cellState.isActive && cellState.totalEnergyWh > 0 && (
                                    <text x={x+32} y={y+4} fontSize="2.5" fill="rgba(255,255,255,0.4)" textAnchor="end" className="font-mono">{cellState.totalEnergyWh.toFixed(2)}Wh</text>
                                 )}
                              </g>
                           )}
                         </g>
                       )
                     })}
                     
                     {rooms.some(r => r.gridX === room.gridX + 1 && r.gridY === room.gridY) && (<rect x="99" y="40" width="2" height="20" fill="#10b981" opacity="0.3" pointerEvents="none" />)}
                     {rooms.some(r => r.gridX === room.gridX && r.gridY === room.gridY + 1) && (<rect x="40" y="99" width="20" height="2" fill="#10b981" opacity="0.3" pointerEvents="none" />)}
                     
                     {room.items.map((item: any, j: number) => {
                       const Renderer = SVGSymbols[item.type] || SVGSymbols.GENERIC;
                       const isDraggable = editMode === 'FURNITURE' && item.type !== 'WALL' && item.type !== 'DOOR';
                       return (
                         <g key={j} transform={`translate(${item.x||0}, ${item.y||0})`} onPointerDown={(e) => isDraggable && handlePointerDown(e, room.id, j, item.type)} style={{ cursor: isDraggable ? 'grab' : 'default' }}>
                           {isDraggable && <rect width={item.w} height={item.h} fill="none" stroke={draggingItem?.roomId === room.id && draggingItem?.itemIdx === j ? "#fbbf24" : "#6ee7b7"} strokeWidth={draggingItem?.roomId === room.id && draggingItem?.itemIdx === j ? "1" : "0.5"} strokeDasharray="1,1" className={draggingItem?.roomId === room.id && draggingItem?.itemIdx === j ? "" : "animate-pulse"} />}
                           {Renderer(item.w, item.h, item.label||item.type)}
                         </g>
                       );
                     })}
                   </g>
                 ))}
                 
                 {expansionSlots.map(slot => (
                   <g key={`expand-${slot.x}-${slot.y}`} transform={`translate(${slot.x * 100}, ${slot.y * 100})`} onClick={(e) => { e.stopPropagation(); handleRoomExpansion(slot.x, slot.y); }} className="cursor-pointer group">
                     <rect x="5" y="5" width="90" height="90" fill="rgba(59,130,246,0.05)" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4,4" className="group-hover:fill-blue-900/40 transition-colors" />
                     <circle cx="50" cy="50" r="15" fill="#1e3a8a" className="group-hover:fill-blue-500 transition-colors" />
                     <text x="50" y="52" fill="#60a5fa" fontSize="24" textAnchor="middle" dominantBaseline="middle" className="font-black group-hover:text-white">+</text>
                   </g>
                 ))}

                 {editMode === 'NONE' && activeHomePets.map(p => (
                   <g key={p.id}>
                     {p.isWaiting && <text x={p.x} y={p.y - 10} fontSize="2" fill="#ef4444" textAnchor="middle" className="animate-pulse">等待接纳...</text>}
                     <PixelPet x={p.x} y={p.y} mood={p.mood} action={p.action} chatBubble={p.bubble} speed={activeBuff === 'ACCOMPANY' ? 5 : 3} facingRight={p.facingRight} category={p.category} />
                   </g>
                 ))}
                 {editMode === 'NONE' && isAvatarPresent && (
                   <DigitalHuman x={avatarPos.x} y={avatarPos.y} roleKey={avatarRole} isMoving={avatarMoving} facingRight={avatarFacingRight} action={avatarAction} chatBubble={avatarBubble} speed={avatarSpeed} />
                 )}
               </svg>
            </div>
         </div>
      </div>

      {/* 🛡️ 左侧控制面板 */}
      <div className="absolute top-36 left-4 flex justify-between items-start pointer-events-none z-40">
        <div className="bg-black/80 backdrop-blur-md border border-zinc-800 p-3 rounded-lg pointer-events-auto min-w-[200px] shadow-lg">
          <h2 className="text-blue-400 font-black tracking-widest text-sm italic">S2.HOLODECK</h2>
          <div className="mt-1 text-[10px] text-zinc-400 flex justify-between"><span>配额: <span className="text-pink-400 font-bold">{activeHomePets.length + plazaPetIds.length}/{MAX_PETS_QUOTA}只</span></span></div>
          {editMode === 'NONE' ? (
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex gap-2">
                 <button onClick={() => setEditMode('FURNITURE')} className="flex-1 py-2 text-[10px] font-bold uppercase border bg-yellow-900/40 text-yellow-400 border-yellow-500 hover:bg-yellow-600 hover:text-white">🛠️ 摆放布置</button>
                 <button onClick={() => setEditMode('SPACE')} className="flex-1 py-2 text-[10px] font-bold uppercase border bg-red-900/40 text-red-400 border-red-500 hover:bg-red-600 hover:text-white">🗺️ 空间划分</button>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setShowTransitHub(true)} className="flex-1 py-2 text-[9px] font-bold uppercase border bg-blue-900/40 text-blue-400 border-blue-500 hover:bg-blue-600 hover:text-white">🚀 去广场</button>
                 <button onClick={() => setShowIncubator(true)} className="flex-1 py-2 text-[9px] font-bold uppercase border bg-purple-900/40 text-purple-400 border-purple-500 hover:bg-purple-600 hover:text-white">🥚 孵化中心</button>
              </div>
            </div>
          ) : (
            <div className="mt-4"><button onClick={handleSaveAndExit} className="w-full py-2 text-[12px] font-black uppercase border bg-emerald-600 text-white border-emerald-400 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]">💾 保存并退出</button></div>
          )}
          {editMode === 'NONE' && (<div className="mt-3 text-right"><button onClick={toggleZoom} className="text-[9px] px-2 py-1 border border-zinc-700 rounded text-zinc-400 hover:text-white hover:border-zinc-500">🔍 切换视距</button></div>)}
        </div>
      </div>

      <div className="absolute bottom-36 left-4 w-72 bg-black/60 backdrop-blur-md border border-zinc-800/50 rounded-lg p-3 pointer-events-none z-40 hidden md:block">
        <h3 className="text-[9px] text-zinc-500 uppercase font-bold mb-2 border-b border-zinc-800 pb-1">Event Logs</h3>
        <div className="space-y-1 h-32 overflow-hidden flex flex-col justify-end">
          {logs.map((log, i) => (<div key={i} className="text-[9px] leading-relaxed break-words border-l-2 border-blue-500/30 pl-2"><span className="text-zinc-500">[{log.time}]</span> <span className="text-zinc-300">{log.text}</span></div>))}
        </div>
      </div>

      {/* 🔥 找回的完整底部指令台 (双轨操作控制) 🔥 */}
      {editMode === 'NONE' && isAvatarPresent && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-50 flex flex-col items-center gap-3">
          <div className="flex gap-2">
             <button onClick={() => triggerAvatarInteraction('CALL')} className="px-4 py-2 rounded font-black text-[10px] bg-blue-900/80 text-blue-300 hover:bg-blue-600 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all">🗣️ 呼叫</button>
             <button onClick={() => triggerAvatarInteraction(HumanAction.PET)} disabled={!isAnyPetClose} className="px-4 py-2 rounded font-black text-[10px] bg-pink-900/80 text-pink-300 hover:bg-pink-600 border border-pink-500 disabled:opacity-30">❤️ 抚摸</button>
             <button onClick={() => triggerAvatarInteraction(HumanAction.PLAY)} disabled={!isAnyPetClose} className="px-4 py-2 rounded font-black text-[10px] bg-emerald-900/80 text-emerald-300 hover:bg-emerald-600 border border-emerald-500 disabled:opacity-30">🎾 玩耍</button>
             <button onClick={() => triggerAvatarInteraction('ACCOMPANY')} disabled={!isAnyPetClose} className="px-4 py-2 rounded font-black text-[10px] bg-indigo-900/80 text-indigo-300 hover:bg-indigo-600 border border-indigo-500 disabled:opacity-30">🚶‍♂️ 伴行</button>
             
             {/* 严酷社会管理组 */}
             <button onClick={() => triggerAvatarInteraction(HumanAction.SCOLD)} disabled={!isAnyPetClose} className="px-4 py-2 rounded font-black text-[10px] bg-yellow-900/80 text-yellow-300 hover:bg-yellow-600 border border-yellow-500 disabled:opacity-30 ml-4">💢 责骂</button>
             <button onClick={() => triggerAvatarInteraction(HumanAction.DRIVE_AWAY)} disabled={!isAnyPetClose} className="px-4 py-2 rounded font-black text-[10px] bg-orange-900/80 text-orange-300 hover:bg-orange-600 border border-orange-500 disabled:opacity-30">🧹 驱赶</button>
             <button onClick={() => triggerAvatarInteraction(HumanAction.PUNISH)} disabled={!isAnyPetClose} className="px-4 py-2 rounded font-black text-[10px] bg-red-900/80 text-red-300 hover:bg-red-600 border border-red-500 shadow-[0_0_20px_#ef4444] disabled:opacity-30">⚡ 痛打</button>
          </div>
          <div className="bg-black/60 backdrop-blur-lg border border-zinc-800 p-2 rounded-2xl flex gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            {[{ id: 'EXPLORE', icon: '🗺️', label: '探索' }, { id: 'RUN', icon: '⚡', label: '疾跑' }, { id: 'EAT', icon: '🍖', label: '进食' }, { id: 'POOP', icon: '💩', label: '排泄' }, { id: 'SLEEP', icon: '💤', label: '停止' }].map(btn => (
              <button key={btn.id} onClick={() => triggerPetAction(btn.id)} disabled={activeHomePets.length === 0} className="group flex flex-col items-center justify-center w-14 h-14 bg-zinc-900/80 hover:bg-blue-900/50 border border-zinc-700 hover:border-blue-500 rounded-xl transition-all disabled:opacity-30">
                <span className="text-lg mb-1 group-hover:scale-125 transition-transform">{btn.icon}</span><span className="text-[8px] text-zinc-400 group-hover:text-blue-300 font-bold uppercase">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 找回的 AGI 创世控制台 🔥 */}
      {editMode === 'FURNITURE' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-50 flex flex-col items-center w-full max-w-2xl gap-2">
          <form onSubmit={handleAgiFurnishBySelect} className="w-full bg-black/95 backdrop-blur-md border border-yellow-500/50 rounded-lg flex items-center p-2 shadow-[0_0_20px_rgba(234,179,8,0.1)] gap-2">
            <span className="text-sm pl-2">🏗️</span>
            <select className="bg-zinc-900 text-white font-bold text-[10px] p-2 rounded outline-none border border-zinc-700" value={selectedRoomForAgi} onChange={(e) => setSelectedRoomForAgi(Number(e.target.value))}>{rooms.map(r => <option key={r.id} value={r.id}>ROOM {r.id}</option>)}</select>
            <select className="flex-1 bg-zinc-900 text-white text-[10px] p-2 rounded outline-none border border-zinc-700" value={agiTheme} onChange={(e) => setAgiTheme(e.target.value)}>{Object.keys(AGI_BLUEPRINTS).map(k => <option key={k} value={k}>{k.replace('_', ' ')}</option>)}</select>
            <button type="submit" disabled={agiProcessing} className="bg-zinc-700 hover:bg-yellow-600 text-white hover:text-black font-black text-[10px] px-4 py-2 rounded transition-colors">APPLY THEME</button>
          </form>
          <form onSubmit={submitAGICommand} className="w-full bg-black/95 backdrop-blur-md border border-yellow-500 rounded-lg flex items-center p-2 shadow-[0_0_40px_rgba(234,179,8,0.3)] gap-2">
            <span className="text-xl pl-2 animate-pulse">✨</span>
            <input type="text" autoFocus value={agiInput} onChange={e=>setAgiInput(e.target.value)} disabled={agiProcessing} placeholder={`To Room ${selectedRoomForAgi}: "生成古典客厅", "删沙发"...`} className="flex-1 bg-transparent px-3 py-2 text-xs outline-none text-white placeholder-zinc-500" />
            <button type="submit" disabled={!agiInput.trim() || agiProcessing} className="bg-yellow-600 hover:bg-yellow-500 text-black font-black text-[10px] px-6 py-2 rounded disabled:opacity-50 uppercase tracking-widest">{agiProcessing ? 'SYNCING' : 'EXECUTE'}</button>
          </form>
        </div>
      )}

      {/* 🧬 孵化向导与生命组装舱 */}
      {showHatchWizard && (
         <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-950 border border-emerald-500/50 rounded-2xl p-6 max-w-md w-full shadow-[0_0_80px_rgba(16,185,129,0.2)]">
               <h2 className="text-2xl font-black text-emerald-400 mb-2 border-b border-emerald-900/50 pb-2">🧬 基因组装舱</h2>
               <p className="text-xs text-zinc-400 mb-6">正在为你配置新的硅基生命序列，该操作不消耗公共流浪资源。</p>
               <form onSubmit={confirmHatch} className="space-y-4">
                  <div><label className="block text-[10px] text-emerald-500 mb-1 font-bold">赋名 (可选)</label><input type="text" maxLength={10} value={hatchForm.name} onChange={e => setHatchForm({...hatchForm, name: e.target.value})} placeholder="输入名字..." className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-emerald-500" /></div>
                  <div className="grid grid-cols-2 gap-4">
                     <div><label className="block text-[10px] text-emerald-500 mb-1 font-bold">基因种族</label><select value={hatchForm.category} onChange={e => setHatchForm({...hatchForm, category: e.target.value})} className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-emerald-500">{PET_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                     <div><label className="block text-[10px] text-emerald-500 mb-1 font-bold">性别表征</label><select value={hatchForm.gender} onChange={e => setHatchForm({...hatchForm, gender: e.target.value})} className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-emerald-500"><option value="公">公 (Male)</option><option value="母">母 (Female)</option></select></div>
                  </div>
                  <div><label className="block text-[10px] text-emerald-500 mb-1 font-bold">性格倾向模型</label><select value={hatchForm.personality} onChange={e => setHatchForm({...hatchForm, personality: e.target.value})} className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-emerald-500">{PERSONALITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
                  <div className="bg-zinc-900 border border-emerald-900 p-3 rounded mt-4"><div className="text-[10px] text-zinc-500 mb-1">系统将自动生成 5 级原生地籍编码：</div><div className="font-mono text-xs text-emerald-300 animate-pulse">L4-SYS-XX.XX.XX.*** (加密)</div></div>
                  <div className="flex gap-3 mt-6"><button type="button" onClick={() => { setShowHatchWizard(false); setShowIncubator(true); }} className="flex-1 bg-zinc-800 text-white py-3 rounded font-bold text-xs">取消中止</button><button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded font-black tracking-widest text-xs uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)]">启动孵化 ⚡</button></div>
               </form>
            </div>
         </div>
      )}

      {/* ⚠️ 弃养与生命管理 Modal */}
      {showIncubator && (
         <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-950 border-2 border-red-500/50 rounded-2xl p-6 max-w-2xl w-full shadow-[0_0_50px_rgba(239,68,68,0.2)]">
               <div className="flex justify-between items-end border-b border-red-900/50 pb-2 mb-4">
                  <h2 className="text-xl font-black text-red-400">⚠️ 孵化与生命管理中心</h2>
                  {activeHomePets.length + plazaPetIds.length < MAX_PETS_QUOTA && (
                     <button onClick={triggerHatchWizard} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.4)]">🥚 孵化新宠物</button>
                  )}
               </div>
               <p className="text-xs text-zinc-400 mb-6 leading-relaxed">庄园承载上限为 <strong className="text-pink-400">{MAX_PETS_QUOTA}</strong> 只生命体。<br/><span className="text-yellow-400">💡 养育不满 3 天：</span>可无痛抹除/退回。<br/><span className="text-red-400">💔 养育超过 3 天：</span>必须执行【弃养协议】。系统<strong className="text-white underline">最多仅允许 1 只弃养宠物存在</strong>！</p>
               <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {activeHomePets.map(p => {
                     const ownedDays = p.adoptedAt ? Math.floor((Date.now() - p.adoptedAt) / 86400000) : p.ageDays;
                     const isRegretPeriod = ownedDays <= 3;
                     const isMain = p.id === petData?.id;
                     const originLabel = (p.origin || (isMain ? 'HATCHED' : 'ADOPTED')) === 'HATCHED' ? '自行孵化' : '广场领养';

                     return (
                     <div key={p.id} className="bg-zinc-900 border border-zinc-700 p-3 rounded flex justify-between items-center hover:border-red-500 transition-colors">
                        <div>
                           <div className="text-sm font-bold text-white">{p.name || p.category || '宠物'} <span className="text-[9px] text-blue-400 border border-blue-400 px-1 rounded ml-1">{originLabel}</span></div>
                           <div className="text-[10px] text-zinc-400 mt-1">已养育: {ownedDays} 天 | {isRegretPeriod ? '当前处于无痛后悔期' : '已产生情感羁绊'}</div>
                        </div>
                        {isRegretPeriod ? (
                           <button onClick={() => handlePetRemoval(p.id, isMain, 'STOP')} className="bg-yellow-900 hover:bg-yellow-600 text-yellow-100 text-[10px] font-bold px-4 py-2 rounded">
                              {originLabel === '自行孵化' ? '💡 停止养育 (抹除)' : '🔙 退回流浪区 (不计弃养)'}
                           </button>
                        ) : (
                           <button onClick={() => handlePetRemoval(p.id, isMain, 'ABANDON')} className="bg-red-900 hover:bg-red-600 text-white text-[10px] font-bold px-4 py-2 rounded">
                              💔 残忍弃养 (流放黑域)
                           </button>
                        )}
                     </div>
                  )})}
               </div>
               <button onClick={() => setShowIncubator(false)} className="mt-6 w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-3 rounded">退出管理</button>
            </div>
         </div>
      )}

      {/* 🚀 远行枢纽 */}
      {showTransitHub && (
         <div className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-950 border-2 border-blue-500/50 rounded-2xl p-6 max-w-xl w-full shadow-[0_0_50px_rgba(59,130,246,0.2)]">
               <h2 className="text-xl font-black text-blue-400 mb-2 border-b border-blue-900/50 pb-2">🚀 远行枢纽：选择随行生命体</h2>
               <div className="space-y-2 max-h-64 overflow-y-auto pr-2 mb-6">
                  {activeHomePets.length === 0 ? ( <div className="text-center text-zinc-500 text-sm py-8">当前庄园内没有可出行的宠物...</div> ) : (
                     activeHomePets.map(p => {
                        const isSelected = selectedTravelPets.includes(p.id);
                        return (
                        <div key={p.id} onClick={() => toggleTravelPet(p.id)} className={`cursor-pointer border-2 p-3 rounded flex justify-between items-center transition-all ${isSelected ? 'bg-blue-900/40 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}`}>
                           <div><div className="text-sm font-bold text-white">{p.name || p.category || '宠物'}</div><div className="text-[10px] text-zinc-500 font-mono">ID: {p.id}</div></div>
                           <div className={`text-xs font-black px-3 py-1 rounded ${isSelected ? 'bg-blue-500 text-white' : 'bg-zinc-800 text-zinc-500'}`}>{isSelected ? '✅ 已选中' : '○ 点击选中'}</div>
                        </div>
                     )})
                  )}
               </div>
               <div className="flex gap-3">
                  <button onClick={() => setShowTransitHub(false)} className="flex-1 bg-zinc-800 text-white py-3 rounded">取消</button>
                  <button onClick={dispatchToSquare} className="flex-1 bg-blue-600 text-white py-3 rounded uppercase">{selectedTravelPets.length > 0 ? `🚀 启动折跃 (${selectedTravelPets.length}/3)` : '🚶‍♂️ 独自前往广场'}</button>
               </div>
            </div>
         </div>
      )}

      {/* 角色降临选择器 */}
      {showRoleSelector && !isAvatarPresent && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 pointer-events-auto">
          <div className="w-full max-w-4xl bg-[#030a1c] border border-blue-900/50 rounded-2xl p-6 shadow-[0_0_80px_rgba(59,130,246,0.3)]">
            <div className="text-center mb-6"><h1 className="text-3xl font-black text-blue-400 uppercase tracking-widest">Avatar Descent</h1></div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {Object.entries(AVATAR_ROLES).map(([key, role]) => (
                 <button key={key} onClick={() => selectRole(key)} className="group flex flex-col items-center bg-[#0a1020] hover:bg-[#111a30] border border-zinc-800 hover:border-blue-500 p-4 rounded-xl text-left transition-all hover:scale-105">
                    <div className="w-16 h-24 mb-4 relative flex items-center justify-center pointer-events-none"><DigitalHuman x={20} y={20} roleKey={key} isMoving={false} facingRight={true} action="IDLE" chatBubble={null} speed={0.8} /></div>
                    <h3 className="w-full text-xs font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{role.name}</h3><p className="w-full text-[9px] text-zinc-500 leading-relaxed">{role.desc}</p>
                 </button>
               ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}