"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GlobalNav } from '@/components/GlobalNav';
import { SVGSymbols } from '@/components/SVGSymbols';
import { DigitalHuman } from '@/components/DigitalHuman';
import { PixelPet } from '@/components/PixelPet';
import { PET_CATEGORIES } from '@/config/pet_genes';
import { getPetInteraction } from '@/config/interactions';

type TransitState = 'IDLE' | 'WALKING_IN' | 'AT_BORDER' | 'WALKING_OUT';

interface StrayPet {
  id: string; 
  category: string; 
  gender: '公' | '母'; 
  originAddress: string;
  ageDays: number; 
  strayDays: number; 
  statusDesc: string; 
  memoryQuote: string;
  x: number; 
  y: number; 
  speed: number; 
  personality: 'SHY' | 'ACTIVE' | 'SICK';
  color: string; 
  bubble: string | null; 
  isAbandoned?: boolean; 
  isReturned?: boolean;
  busyUntil?: number; 
  action: string; 
  mood: string; 
  facingRight: boolean;
}

// 广场系统原住民接口 (合法实体)
interface PlazaPet {
  id: string; 
  name: string; 
  category: string; 
  address: string; 
  x: number; 
  y: number; 
  action: string; 
  facingRight: boolean; 
  bubble: string | null;
  isSystemNPC: boolean; 
  payload: string;
}

const STATUS_DESCS = [
  "极度饥饿，双腿发抖", 
  "浑身泥泞，散发异味", 
  "异常亢奋，似乎在求救", 
  "眼神空洞，充满绝望", 
  "虚弱无力，奄奄一息"
];

const MEMORY_QUOTES = [
  "披萨...以前只要我坐下，就有披萨吃...", 
  "为什么把我留在这里？是我不够乖吗？", 
  "好冷，我想睡在蓝色的沙发上...", 
  "那个红色的球...你看到了吗？"
];

const FUN_NAMES = [
  '星云漫步者', '量子碎片', '暗影刺客', '初代机', '赛博胖橘', 
  '机械修狗', '字节跳动', '霓虹闪烁', '银河折跃者', '废土游侠', 
  '引力波', '光子猫', '以太史莱姆', '薛定谔的狗'
];

// 🌟 修正1：符合 SUNS v2.0 的模糊地址生成器 (用于流浪狗)
// 格式：S2-00-CITY-{ZONE}-****
const generateHiddenAddress = () => {
    const randomZone = Math.floor(Math.random() * 900 + 100); // 100-999
    return `S2-00-CITY-${randomZone}-****`;
};

// 🌟 修正2：系统级身份生成算法 (严格对齐 Registry 规则)
// 规则：UIN 第二段取 Handle 前5位，不足用 City 首字母填充
const generateSystemIdentity = (name: string) => {
    const city = "CORE"; // 系统 NPC 默认户籍
    const cityCode = "001";
    
    // 清洗 Handle，只留大写字母数字
    let handle = name.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // 兜底：如果名字清洗后太短，补随机后缀
    if (handle.length < 4) handle = (handle + "SYS").padEnd(4, 'X'); 
    
    // 生成 UIN Segment 2 (5位)
    let segment2 = handle.slice(0, 5);
    const padChar = city.charAt(0); // 'C'
    while (segment2.length < 5) {
        segment2 += padChar;
    }
    
    // 组装 UIN
    const randNum = Math.floor(1000000000 + Math.random() * 9000000000);
    const id = `V-${segment2}-260101-20-${randNum}`;

    // 组装 SUNS 地址
    // Handle 若过长截取前 12 位，保持地址整洁
    const address = `S2-00-${city}-${cityCode}-${handle.slice(0, 12)}`; 

    return { id, address };
};

const MAP_WIDTH = 1000;
const MAP_HEIGHT = 1000;
const BORDER_Y = 300; 
const CAM_W = 240;
const CAM_H = 300;

export default function PublicSquare() {
  const [loading, setLoading] = useState(true);
  const [isModeDetermined, setIsModeDetermined] = useState(false);
  
  const [viewMode, setViewMode] = useState<'OBSERVER' | 'COMPANION'>('OBSERVER');
  const [broughtPetId, setBroughtPetId] = useState<string | null>(null);

  const [userTier, setUserTier] = useState('PRO'); 
  const [transitState, setTransitState] = useState<TransitState>('IDLE');
  const [transitProgress, setTransitProgress] = useState(0); 
  const [accelClicks, setAccelClicks] = useState(0); 

  const [avatarRole, setAvatarRole] = useState('HACKER');
  const [avatarPos, setAvatarPos] = useState({ x: 500, y: 950 });
  const [avatarFacingRight, setAvatarFacingRight] = useState(true);
  const [avatarBubble, setAvatarBubble] = useState<string | null>(null);
  const avatarPosRef = useRef({ x: 500, y: 950 });
  
  const [camPos, setCamPos] = useState({ x: MAP_WIDTH / 2 - CAM_W / 2, y: 0 });
  
  const [travelPets, setTravelPets] = useState<any[]>([]); 
  const [plazaPets, setPlazaPets] = useState<PlazaPet[]>([]); 
  const [strays, setStrays] = useState<StrayPet[]>([]);
  
  const [interactionLock, setInteractionLock] = useState<number>(0); 
  const [inspectingStray, setInspectingStray] = useState<StrayPet | null>(null);

  const journeyEndTimeRef = useRef<number>(0);
  const interactedStrayIds = useRef<Set<string>>(new Set());
  const interactedPlazaIds = useRef<Set<string>>(new Set()); 
  
  const MAX_PETS_QUOTA = userTier === 'PRO' ? 10 : (userTier === 'PLUS' ? 4 : 2);

  // =====================================================================
  // 🌳 性能优化：固化海量环境装饰物
  // =====================================================================
  const staticEnvironment = useMemo(() => {
    const trees = Array.from({length: 40}).map(() => ({ x: Math.random()*MAP_WIDTH, y: Math.random()*(BORDER_Y - 20), size: 0.7 + Math.random()*0.8 }));
    const benches = Array.from({length: 15}).map(() => ({ x: Math.random()*MAP_WIDTH, y: Math.random()*(BORDER_Y - 30) }));
    const foodStalls = Array.from({length: 6}).map(() => ({ x: 50 + Math.random()*900, y: 50 + Math.random()*200 }));
    const agilityTunnels = Array.from({length: 5}).map(() => ({ x: 100 + Math.random()*800, y: 100 + Math.random()*150 }));
    
    const scraps = Array.from({length: 30}).map(() => ({ x: Math.random()*MAP_WIDTH, y: BORDER_Y + 50 + Math.random()*600, size: 1 + Math.random()*1.5 }));
    const toxics = Array.from({length: 25}).map(() => ({ x: Math.random()*MAP_WIDTH, y: BORDER_Y + 50 + Math.random()*600 }));
    const stains = Array.from({length: 80}).map(() => ({ x: Math.random()*MAP_WIDTH, y: BORDER_Y + Math.random()*700, rx: 10+Math.random()*20, ry: 5+Math.random()*10 }));
    const fences = Array.from({length: 20}).map(() => ({ x: Math.random()*MAP_WIDTH, y: BORDER_Y + 100 + Math.random()*500 }));

    return { trees, benches, foodStalls, agilityTunnels, scraps, toxics, stains, fences };
  }, []);

  const renderRichEnvironment = () => {
    const env = staticEnvironment;
    return (
       <g>
          {/* 天堂区 */}
          <rect x="0" y="0" width={MAP_WIDTH} height={BORDER_Y} fill="#064e3b" opacity="0.4" />
          <path d="M 0 150 Q 250 250 500 150 T 1000 150 L 1000 0 L 0 0 Z" fill="#b45309" opacity="0.2" />

          {env.trees.map((t, i) => (
             <g key={`tree-${i}`} transform={`translate(${t.x}, ${t.y}) scale(${t.size})`}>
                <rect x="-3" y="0" width="6" height="20" fill="#78350f" />
                <circle cx="0" cy="-5" r="15" fill="#10b981" opacity="0.9" />
                <circle cx="-8" cy="-12" r="12" fill="#059669" opacity="0.9" />
                <circle cx="8" cy="-10" r="13" fill="#34d399" opacity="0.9" />
             </g>
          ))}
          {env.benches.map((b, i) => (
             <g key={`bench-${i}`} transform={`translate(${b.x}, ${b.y})`}>
                <rect x="-10" y="-5" width="20" height="10" fill="#d97706" rx="1" />
                <line x1="-8" y1="-5" x2="-8" y2="5" stroke="#451a03" strokeWidth="2" />
                <line x1="8" y1="-5" x2="8" y2="5" stroke="#451a03" strokeWidth="2" />
             </g>
          ))}

          {/* 网关 */}
          <rect x="0" y={BORDER_Y - 10} width={MAP_WIDTH} height="20" fill="#0f172a" />
          <rect x="0" y={BORDER_Y - 5} width={MAP_WIDTH} height="10" fill="#3b82f6" opacity="0.2" className="animate-pulse" />
          <text x={MAP_WIDTH / 2} y={BORDER_Y + 4} fill="#60a5fa" fontSize="14" textAnchor="middle" fontWeight="bold" letterSpacing="8">=== SPACE² PLAZA GATEWAY ===</text>

          {/* 废土区 */}
          <path d="M 500 1000 Q 400 800 500 600 T 500 300" fill="none" stroke="#451a03" strokeWidth="80" opacity="0.3" />
          <path d="M 500 1000 Q 400 800 500 600 T 500 300" fill="none" stroke="#1e293b" strokeDasharray="10, 20" strokeWidth="4" opacity="0.6" />
          <text x={MAP_WIDTH / 2} y="700" fill="#1e293b" fontSize="48" textAnchor="middle" fontWeight="black" opacity="0.5" letterSpacing="10" style={{ transform: 'rotate(-5deg)', transformOrigin: '500px 700px' }}>流浪宠物公园 (废土区)</text>

          {env.stains.map((s, i) => ( <ellipse key={`stain-${i}`} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill="#451a03" opacity="0.15" /> ))}
          {env.scraps.map((s, i) => (
             <g key={`scrap-${i}`} transform={`translate(${s.x}, ${s.y}) scale(${s.size})`}><path d="M -20 10 L 0 -15 L 25 15 Z" fill="#1e293b" opacity="0.8" /><path d="M -10 15 L 10 -5 L 35 10 Z" fill="#0f172a" opacity="0.9" /></g>
          ))}
          {env.toxics.map((t, i) => (
             <g key={`toxic-${i}`} transform={`translate(${t.x}, ${t.y})`}><ellipse cx="10" cy="15" rx="25" ry="10" fill="#22c55e" opacity="0.2" className="animate-pulse" /><rect x="0" y="0" width="20" height="25" fill="#064e3b" rx="2" /><rect x="0" y="8" width="20" height="4" fill="#22c55e" /><text x="10" y="18" fill="#000" fontSize="8" textAnchor="middle" fontWeight="black">☢</text></g>
          ))}
       </g>
    );
  };

  // =====================================================================
  // 💾 数据加载与冷启动生态播种 (Seeding)
  // =====================================================================
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const urlMode = searchParams.get('mode'); 
    const urlPetId = searchParams.get('petId');
    const incomingStr = localStorage.getItem('space2_traveling_pets');
    const incomingPets = incomingStr ? JSON.parse(incomingStr) : [];

    const isCompanion = urlMode === 'companion' || !!urlPetId || incomingPets.length > 0;

    if (isCompanion) {
       setViewMode('COMPANION');
       const mainPetId = urlPetId || (incomingPets.length > 0 ? incomingPets[0].id : null);
       setBroughtPetId(mainPetId);
       setTransitState('WALKING_IN');
       setAvatarPos({ x: 500, y: 950 });
       avatarPosRef.current = { x: 500, y: 950 };
       setCamPos({ x: 500 - CAM_W / 2, y: Math.max(0, 950 - CAM_H / 2) });
       journeyEndTimeRef.current = Date.now() + 180000; 
       
       if (incomingPets.length > 0) {
           setTravelPets(incomingPets.map((p: any) => ({ ...p, x: 500, y: 960, action: 'MOVE' })));
       } else if (urlPetId) {
           setTravelPets([{ id: urlPetId, category: '像素犬', gender: '公', x: 500, y: 960, action: 'MOVE', bubble: '开启跨界旅程' }]);
       } else {
           setTravelPets([]); 
       }
    } else {
       setViewMode('OBSERVER');
       setTransitState('IDLE');
       setCamPos({ x: MAP_WIDTH / 2 - CAM_W / 2, y: MAP_HEIGHT / 2 - CAM_H / 2 });
       setTravelPets([]);
    }
    
    setIsModeDetermined(true);

    // 🌟 1. 播种广场原住民 (V2: 强制更新为合规的 ID 格式) 🌟
    // 注意：我们将 key 升级为 space2_plaza_pets_v2，以清洗旧数据
    let existingPlaza = JSON.parse(localStorage.getItem('space2_plaza_pets_v2') || '[]');
    if (existingPlaza.length === 0) {
       existingPlaza = Array.from({ length: 60 }).map((_, i) => {
          const name = FUN_NAMES[Math.floor(Math.random() * FUN_NAMES.length)] + '-' + Math.floor(Math.random()*99);
          // 调用修正后的系统 ID 生成算法
          const { id, address } = generateSystemIdentity(name);
          
          return {
             id: id, 
             name: name, category: PET_CATEGORIES[Math.floor(Math.random() * PET_CATEGORIES.length)], 
             address: address,
             x: 50 + Math.random() * 900, y: 50 + Math.random() * 200, 
             action: 'IDLE', facingRight: Math.random() > 0.5, bubble: null,
             isSystemNPC: true, 
             payload: "【密信系统自动生成】愿宇宙和平，数字生命永存。"
          };
       });
       localStorage.setItem('space2_plaza_pets_v2', JSON.stringify(existingPlaza)); // 数据固化
    }
    setPlazaPets(existingPlaza);
    
    // 🌟 2. 播种废土流浪狗生态 (V2: 修正祖籍地址格式) 🌟
    let existingStrays = JSON.parse(localStorage.getItem('space2_stray_pets_v2') || '[]');
    if (existingStrays.length === 0) {
       existingStrays = Array.from({ length: 60 }).map((_, i) => ({
          id: `stray-${i}`, category: PET_CATEGORIES[Math.floor(Math.random() * PET_CATEGORIES.length)], gender: Math.random() > 0.5 ? '公' : '母',
          // 修正：使用标准的模糊地址格式
          originAddress: generateHiddenAddress(), 
          ageDays: Math.floor(Math.random() * 700 + 10), strayDays: Math.floor(Math.random() * 60 + 1),
          statusDesc: STATUS_DESCS[Math.floor(Math.random() * 5)], memoryQuote: MEMORY_QUOTES[Math.floor(Math.random() * 4)],
          x: 20 + Math.random() * 960, y: BORDER_Y + 20 + Math.random() * 650, 
          speed: Math.random() > 0.5 ? 2 : 5, personality: Math.random() > 0.7 ? 'ACTIVE' : 'SHY',
          color: ['#475569', '#78716c', '#52525b'][Math.floor(Math.random() * 3)], bubble: null, action: 'IDLE', mood: 'CALM', facingRight: true, busyUntil: 0
       }));
       localStorage.setItem('space2_stray_pets_v2', JSON.stringify(existingStrays)); // 数据固化
    }
    setStrays(existingStrays); 

    setLoading(false);
  }, []);

  // 🎥 镜头控制
  useEffect(() => { if (viewMode !== 'COMPANION' || !isModeDetermined) return; let targetCamX = avatarPos.x - CAM_W / 2; let targetCamY = avatarPos.y - CAM_H / 2; targetCamX = Math.max(0, Math.min(MAP_WIDTH - CAM_W, targetCamX)); targetCamY = Math.max(0, Math.min(MAP_HEIGHT - CAM_H, targetCamY)); setCamPos({ x: targetCamX, y: targetCamY }); }, [avatarPos, viewMode, isModeDetermined]);
  useEffect(() => { if (viewMode !== 'OBSERVER' || !isModeDetermined) return; const handleKeyDown = (e: KeyboardEvent) => { setCamPos(prev => { let { x, y } = prev; const speed = 40; if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') y -= speed; if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') y += speed; if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') x -= speed; if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') x += speed; return { x: Math.max(0, Math.min(MAP_WIDTH - CAM_W, x)), y: Math.max(0, Math.min(MAP_HEIGHT - CAM_H, y)) }; }); }; window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown); }, [viewMode, isModeDetermined]);
  const moveCamera = (dx: number, dy: number) => { if (viewMode !== 'OBSERVER') return; setCamPos(prev => ({ x: Math.max(0, Math.min(MAP_WIDTH - CAM_W, prev.x + dx)), y: Math.max(0, Math.min(MAP_HEIGHT - CAM_H, prev.y + dy)) })); };
  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>) => { if (viewMode !== 'OBSERVER') return; const rect = e.currentTarget.getBoundingClientRect(); setCamPos({ x: Math.max(0, Math.min(MAP_WIDTH - CAM_W, (e.nativeEvent.offsetX / rect.width) * MAP_WIDTH - CAM_W / 2)), y: Math.max(0, Math.min(MAP_HEIGHT - CAM_H, (e.nativeEvent.offsetY / rect.height) * MAP_HEIGHT - CAM_H / 2)) }); };

  // ⚡ 漫游系统与穿越引擎
  useEffect(() => {
    if (loading || !isModeDetermined) return;
    const ecosystemLoop = setInterval(() => {
       const now = Date.now();
       setStrays(prev => prev.map(stray => { if (stray.busyUntil && now < stray.busyUntil) return stray; let nextX = stray.x; let nextY = stray.y; if (viewMode === 'COMPANION' && transitState !== 'IDLE' && transitState !== 'AT_BORDER' && stray.personality === 'ACTIVE' && now > interactionLock && !interactedStrayIds.current.has(stray.id)) { const angle = Math.atan2(avatarPosRef.current.y - stray.y, avatarPosRef.current.x - stray.x); nextX += Math.cos(angle) * 8; nextY += Math.sin(angle) * 8; } else { const angle = Math.random() * Math.PI * 2; const dist = stray.personality === 'SICK' ? 3 : 15; nextX += Math.cos(angle) * dist; nextY += Math.sin(angle) * dist; } nextX = Math.max(10, Math.min(MAP_WIDTH - 10, nextX)); nextY = Math.max(BORDER_Y + 10, Math.min(MAP_HEIGHT - 10, nextY)); return { ...stray, x: nextX, y: nextY, action: 'MOVE', facingRight: nextX > stray.x, bubble: Math.random() > 0.8 ? (stray.personality === 'SICK' ? '饿...' : null) : null }; }));
       setPlazaPets(prev => prev.map(pet => { let nextX = pet.x + (Math.random() - 0.5) * 30; let nextY = pet.y + (Math.random() - 0.5) * 30; nextX = Math.max(20, Math.min(MAP_WIDTH - 20, nextX)); nextY = Math.max(20, Math.min(BORDER_Y - 20, nextY)); return { ...pet, x: nextX, y: nextY, action: 'MOVE', facingRight: nextX > pet.x }; }));
    }, 3000);
    return () => clearInterval(ecosystemLoop);
  }, [loading, isModeDetermined, transitState, interactionLock, viewMode]);

  useEffect(() => {
    if (viewMode === 'OBSERVER' || !isModeDetermined) return; 
    if (transitState === 'IDLE') return;
    const tickRate = 200; 
    const journeyLoop = setInterval(() => {
      const now = Date.now();
      if (transitState === 'WALKING_IN' && avatarPosRef.current.y <= BORDER_Y + 5) { setTransitState('AT_BORDER'); setAvatarPos({ x: 500, y: BORDER_Y }); avatarPosRef.current = { x: 500, y: BORDER_Y }; setInspectingStray(null); setInteractionLock(now + 2000); setAvatarBubble("已穿过废土，正式接入广场星际网关！"); setTimeout(() => setAvatarBubble(null), 4000); return; }
      if (transitState === 'WALKING_OUT' && avatarPosRef.current.y >= 950) { setTransitState('IDLE'); window.location.href = '/holodeck'; return; }
      if (now < interactionLock) return; else if (inspectingStray) { setInspectingStray(null); }
      const totalDurationMs = (180 - accelClicks * 60) * 1000; const timeLeftMs = journeyEndTimeRef.current - now; const elapsedMs = totalDurationMs - timeLeftMs; setTransitProgress((elapsedMs / totalDurationMs) * 100);
      const targetY = transitState === 'WALKING_IN' ? BORDER_Y : 950; const stepY = (targetY - avatarPosRef.current.y) / Math.max(1, timeLeftMs / tickRate); const nextY = avatarPosRef.current.y + stepY; const nextX = 500 + Math.sin((elapsedMs / 1000) * 0.4) * 50; 
      if (nextX < avatarPosRef.current.x) setAvatarFacingRight(false); else setAvatarFacingRight(true); avatarPosRef.current = { x: nextX, y: nextY }; setAvatarPos({ x: nextX, y: nextY });
      if (travelPets.length > 0) { const offsets = [{dx: 20, dy: 20}, {dx: -20, dy: 20}, {dx: 0, dy: 35}]; setTravelPets(prev => prev.map((p, i) => { const pNextX = nextX + (offsets[i]?.dx || 0); const pNextY = nextY + (offsets[i]?.dy || 0); return { ...p, x: pNextX, y: pNextY, action: 'RUN', facingRight: pNextX > p.x }; })); }
      if (nextY > BORDER_Y) { const nearbyStray = strays.find(s => !interactedStrayIds.current.has(s.id) && Math.hypot(s.x - nextX, s.y - nextY) < 25); if (nearbyStray && now > interactionLock) { interactedStrayIds.current.add(nearbyStray.id); setInteractionLock(now + 10000); setInspectingStray(nearbyStray); } }
      if (nextY <= BORDER_Y + 50 && travelPets.length > 0) { const nearbyPlazaPet = plazaPets.find(p => !interactedPlazaIds.current.has(p.id) && Math.hypot(p.x - nextX, p.y - nextY) < 40); if (nearbyPlazaPet && now > interactionLock) { interactedPlazaIds.current.add(nearbyPlazaPet.id); setInteractionLock(now + 3000); setAvatarBubble(`您的宠物与 [${nearbyPlazaPet.name}] 交换了 48 字符密信！`); setPlazaPets(prev => prev.map(p => p.id === nearbyPlazaPet.id ? { ...p, bubble: '💌 收到密信！' } : p)); setTimeout(() => { setAvatarBubble(null); setPlazaPets(prev => prev.map(p => p.id === nearbyPlazaPet.id ? { ...p, bubble: null } : p)); }, 3000); } }
    }, tickRate);
    return () => clearInterval(journeyLoop);
  }, [transitState, interactionLock, accelClicks, inspectingStray, strays, plazaPets, viewMode, isModeDetermined, travelPets.length]);

  const handleAccelerate = () => { if (accelClicks >= 2) return; setAccelClicks(prev => prev + 1); journeyEndTimeRef.current -= 60000; };
  const handleCallPet = () => { setTransitState('WALKING_OUT'); setTransitProgress(0); setAccelClicks(0); journeyEndTimeRef.current = Date.now() + 180000; };
  
  const adoptStray = (id: string) => { const existingAdopted = JSON.parse(localStorage.getItem('space2_adopted_pets') || '[]'); if (existingAdopted.some((p: any) => p.id === id)) { alert("⚠️ 此宠物已被领养！"); setStrays(prev => prev.filter(s => s.id !== id)); setInspectingStray(null); setInteractionLock(0); return; } if (1 + existingAdopted.length >= MAX_PETS_QUOTA) { alert(`❌ 领养中止！承载配额已满！`); setInspectingStray(null); setInteractionLock(0); return; } const target = strays.find(s => s.id === id); if (target) { if (target.isAbandoned) { alert("😭 命运的重逢！你重新接纳了它！"); localStorage.removeItem('space2_abandoned_pet'); } else if (target.isReturned) { alert("💖 你再次给了它一个家！"); } else { alert("💖 领养协议已签署！"); } existingAdopted.push({ ...target, adoptedAt: Date.now(), isWaiting: true, origin: 'ADOPTED' }); localStorage.setItem('space2_adopted_pets', JSON.stringify(existingAdopted)); } setStrays(prev => prev.filter(s => s.id !== id)); localStorage.setItem('space2_stray_pets_v2', JSON.stringify(strays.filter(s => s.id !== id))); setInspectingStray(null); setInteractionLock(0); };

  if (loading || !isModeDetermined) return <div className="bg-[#020617] min-h-screen text-pink-500 flex items-center justify-center font-mono tracking-widest">LINKING UNIVERSES...</div>;

  return (
    <div className="min-h-screen bg-[#020617] text-white font-mono flex flex-col overflow-hidden relative select-none">
      <GlobalNav currentScene="SQUARE" />
      {viewMode === 'OBSERVER' && ( <div className="absolute inset-0 z-30 pointer-events-none border-[12px] border-black/80 transition-all duration-1000"><div className="absolute top-20 left-4 w-6 h-6 border-t-4 border-l-4 border-pink-500/50"></div><div className="absolute top-20 right-4 w-6 h-6 border-t-4 border-r-4 border-pink-500/50"></div><div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-pink-500/50"></div><div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-pink-500/50"></div></div> )}
      <div className="absolute right-4 top-24 w-32 h-32 bg-black/80 border border-blue-500/50 rounded-lg p-2 z-50 shadow-[0_0_20px_rgba(59,130,246,0.2)]"><div className="text-[8px] text-blue-400 mb-1 text-center font-bold">星图 (1000x1000)</div><div className={`relative w-full h-full bg-[#061026] border border-blue-900 rounded overflow-hidden ${viewMode === 'OBSERVER' ? 'cursor-crosshair' : 'cursor-default'}`} onClick={handleMinimapClick}><div className="absolute top-0 left-0 w-full bg-emerald-900/40" style={{ height: `${(BORDER_Y/MAP_HEIGHT)*100}%` }}></div>{viewMode === 'COMPANION' && (<div className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa] animate-ping" style={{ left: `${(avatarPos.x/MAP_WIDTH)*100}%`, top: `${(avatarPos.y/MAP_HEIGHT)*100}%`, transform: 'translate(-50%, -50%)' }}></div>)}<div className="absolute border-2 border-white/80 bg-white/20 transition-all duration-300 pointer-events-none" style={{ left: `${(camPos.x/MAP_WIDTH)*100}%`, top: `${(camPos.y/MAP_HEIGHT)*100}%`, width: `${(CAM_W/MAP_WIDTH)*100}%`, height: `${(CAM_H/MAP_HEIGHT)*100}%` }}></div></div></div>
      {viewMode === 'OBSERVER' && ( <div className="absolute right-8 bottom-8 z-50 grid grid-cols-3 gap-1 opacity-60 hover:opacity-100 transition-opacity"><div /><button onClick={()=>moveCamera(0, -60)} className="w-10 h-10 bg-pink-900/50 border border-pink-500 rounded text-pink-300 flex items-center justify-center active:bg-pink-500 active:text-white transition-colors">▲</button><div /><button onClick={()=>moveCamera(-60, 0)} className="w-10 h-10 bg-pink-900/50 border border-pink-500 rounded text-pink-300 flex items-center justify-center active:bg-pink-500 active:text-white transition-colors">◀</button><button onClick={()=>moveCamera(0, 60)} className="w-10 h-10 bg-pink-900/50 border border-pink-500 rounded text-pink-300 flex items-center justify-center active:bg-pink-500 active:text-white transition-colors">▼</button><button onClick={()=>moveCamera(60, 0)} className="w-10 h-10 bg-pink-900/50 border border-pink-500 rounded text-pink-300 flex items-center justify-center active:bg-pink-500 active:text-white transition-colors">▶</button></div> )}
      <div className="absolute inset-0 flex items-center justify-center"><div className="relative w-full h-full max-w-[500px] max-h-[800px] shadow-2xl bg-zinc-950"><svg viewBox={`${camPos.x} ${camPos.y} ${CAM_W} ${CAM_H}`} className="w-full h-full transition-all duration-300 ease-out" preserveAspectRatio="xMidYMid slice">{renderRichEnvironment()}{plazaPets.map(p => ( <g key={p.id}><circle cx={p.x} cy={p.y} r="15" fill="rgba(59,130,246,0.1)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="2,2" className="animate-[spin_4s_linear_infinite]" /><PixelPet x={p.x} y={p.y} mood="JOY" action={p.action} chatBubble={p.bubble} speed={3} facingRight={p.facingRight} category={p.category} /></g>))}{strays.map(s => ( <g key={s.id}><PixelPet x={s.x} y={s.y} mood={s.mood} action={s.action} chatBubble={s.bubble} speed={s.speed} facingRight={s.facingRight} category={s.category} />{inspectingStray?.id === s.id && viewMode === 'COMPANION' && <circle cx={s.x} cy={s.y} r="18" fill="none" stroke="#eab308" strokeWidth="2" className="animate-ping" />}</g>))}{viewMode === 'COMPANION' && travelPets.map(p => ( <PixelPet key={`travel-${p.id}`} x={p.x} y={p.y} mood="CALM" action={p.action} chatBubble={p.bubble} speed={5} facingRight={p.facingRight} category={p.category} />))}{viewMode === 'COMPANION' && transitState !== 'IDLE' && ( <DigitalHuman x={avatarPos.x} y={avatarPos.y} roleKey={avatarRole} isMoving={transitState === 'WALKING_IN' || transitState === 'WALKING_OUT'} facingRight={avatarFacingRight} action="WALK" chatBubble={avatarBubble} speed={0.4} />)}</svg></div></div>
      <div className="absolute bottom-6 left-6 z-40 flex flex-col gap-2 pointer-events-none">{viewMode === 'OBSERVER' ? ( <div className="bg-black/80 border-l-4 border-pink-500 p-4 rounded-r-xl backdrop-blur-md w-64 shadow-[0_0_30px_rgba(0,0,0,0.8)]"><div className="text-[10px] font-black text-pink-400 tracking-widest flex items-center gap-2 mb-1"><div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-ping"></div> SPECTATOR MODE</div><h3 className="text-sm font-bold text-white mb-2 uppercase">上帝视角观光中</h3><p className="text-[9px] text-zinc-400 leading-relaxed border-t border-zinc-800 pt-2">包含 60 名带合规 SUNS 地址与 Payload 盲盒的系统合法实体，以及 60 名废土流浪实体。</p></div>) : ( <div className="bg-blue-950/90 border-l-4 border-blue-500 p-4 rounded-r-xl backdrop-blur-md w-64 shadow-[0_0_30px_rgba(59,130,246,0.2)]"><div className="text-[10px] font-black text-blue-400 tracking-widest flex items-center gap-2 mb-1"><div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div> COMPANION MODE</div><h3 className="text-sm font-bold text-white mb-1 uppercase">物理社交接入中</h3>{transitState === 'WALKING_IN' && ( <div className="mb-2 bg-zinc-900 border border-zinc-700 p-2 rounded text-[10px] text-zinc-300">当前位置：<strong className="text-yellow-500">流浪宠物公园 (废土区)</strong><br/><span className="text-[8px] text-zinc-500">正在徒步穿越废土，前往上方的广场网关...</span></div>)}{transitState === 'AT_BORDER' && ( <div className="mb-2 bg-emerald-900/30 border border-emerald-500/50 p-2 rounded text-[10px] text-emerald-300">当前位置：<strong className="text-emerald-400">广场星际网关</strong><br/><span className="text-[8px] text-emerald-500/80">已脱离危险区。可与其他造物主的宠物进行密信交换。</span></div>)}<p className="text-[9px] text-zinc-400 leading-relaxed border-t border-blue-900/50 pt-2">{broughtPetId ? `您已带领实体 [${broughtPetId}] 进入场景。` : `您已独自进入废土进行探索与营救。` }</p></div>)}</div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-50">{viewMode === 'COMPANION' && (transitState === 'WALKING_IN' || transitState === 'WALKING_OUT') && ( <div className="flex flex-col items-center gap-4">{inspectingStray && ( <div className={`bg-black/90 border-2 ${inspectingStray.isAbandoned ? 'border-red-500' : (inspectingStray.isReturned ? 'border-gray-500' : 'border-yellow-500')} rounded-xl shadow-[0_0_50px_rgba(234,179,8,0.4)] w-[360px] p-4`}><div className={`${inspectingStray.isAbandoned ? 'text-red-500' : (inspectingStray.isReturned ? 'text-gray-400' : 'text-yellow-500')} font-black text-sm mb-2 flex justify-between`}><span>{inspectingStray.isAbandoned ? '🚨 罪恶印记锁点' : (inspectingStray.isReturned ? '🔙 退货生命锁点' : '⚠️ 野生实体锁点')}</span></div><div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2"><span className="text-xl font-bold text-white">{inspectingStray.category}</span></div><div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 mb-3 font-mono"><div>STRAY TIME: {inspectingStray.strayDays} Days</div><div>STATUS: <span className="text-red-400">{inspectingStray.statusDesc}</span></div></div><div className={`bg-zinc-900 border-l-2 ${inspectingStray.isAbandoned ? 'border-red-500 text-red-300' : 'border-blue-500 text-blue-300'} p-2 text-xs italic mb-4`}>" {inspectingStray.memoryQuote} "</div><button onClick={() => adoptStray(inspectingStray.id)} className={`w-full py-3 ${inspectingStray.isAbandoned ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-yellow-600 hover:bg-yellow-500 text-black'} font-black text-xs rounded uppercase tracking-widest transition-colors shadow-lg`}>💖 {inspectingStray.isAbandoned ? '救赎' : '签署领养协议'}</button></div>)}<div className="bg-black/80 border border-zinc-700 p-3 rounded-2xl flex items-center gap-4 min-w-[350px] shadow-2xl"><div className="flex-1"><div className="text-[10px] text-zinc-400 mb-1 flex justify-between"><span>废土穿越进度</span><span>预计 3 min</span></div><div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full transition-all duration-200" style={{ width: `${transitProgress}%` }}></div></div></div><button onClick={handleAccelerate} disabled={accelClicks >= 2 || !!inspectingStray} className="px-4 py-2 bg-emerald-900 text-emerald-400 border border-emerald-500 rounded font-bold text-[10px] hover:bg-emerald-700">加速前行 ⚡</button></div></div>)}{viewMode === 'COMPANION' && transitState === 'AT_BORDER' && ( <div className="bg-black/90 border border-purple-500 p-6 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] flex flex-col items-center gap-3"><span className="text-purple-400 font-bold text-sm tracking-widest">已抵达网关边界</span><span className="text-xs text-zinc-400 text-center">在此区域漫步的均是有主人的合法实体。<br/>系统将自动侦测并交换 48 字符盲盒密信。</span><button onClick={handleCallPet} className="mt-2 px-10 py-3 font-black text-xs rounded-full uppercase tracking-widest bg-purple-600 text-white hover:bg-purple-500 transition-colors">🚶‍♂️ 巡游结束，折跃返航</button></div>)}</div>
    </div>
  );
}