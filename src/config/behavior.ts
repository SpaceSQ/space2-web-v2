// src/config/behavior.ts

export const HUMAN_BEHAVIOR_MATRIX: Record<string, any> = {
  // 测试期缩短时长：沙发 2分钟，茶几 1分钟，电视 1分钟
  SOFA: { action: 'LAY', duration: 120000, text: ['躺平才是真理...', '好累，葛优瘫一会儿。'] }, 
  TEA_TABLE: { action: 'SIT', duration: 60000, text: ['发会儿呆...', '整理一下思绪。'] }, 
  TV_SYSTEM: { action: 'SIT', duration: 60000, text: ['星际播报开始了。', '这节目有点无聊。'] }, 
  
  AQUARIUM: { action: 'IDLE', duration: 30000, text: ['水质参数正常。', '鱼儿游得真欢。'] }, // 30秒站立观察
  BED: { action: 'SLEEP_CHECK' }, // 特殊时钟检验 (晚22点~早7点睡觉)
  SMART_HUB: { action: 'IDLE', duration: 10000, text: ['正在校准全息沙盒参数...', '网络延迟 2ms。'] },
  
  // 协同看护逻辑 (依然保持与宠物同步的 3 分钟)
  SUPPLY: { action: 'CARE_EAT', duration: 180000, text: ['宝贝，过来吃饭了！', '开饭啦，多吃点！'] }, 
  LITTER_BOX: { action: 'CARE_POOP', duration: 180000, text: ['该过来便便啦！', '上厕所时间！'] }, 
  
  // 忽略项
  PLANT: { action: 'IGNORE' }, 
  CAT_TREE: { action: 'IGNORE' }, 
  WALL: { action: 'IGNORE' }, 
  DOOR: { action: 'IGNORE' }
};