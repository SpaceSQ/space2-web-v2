// src/smarthome/constants.ts

export const SMART_CONSTANTS = {
  // 功率参数 (单位：W)
  POWER: { 
    LIGHT: 13, 
    HVAC: 184,   // 1匹空调的1/4约184W
    SOUND: 50, 
    TV: 150, 
    CAMERA: 5    // 摄像头功耗
  },
  
  // 环境参数预设
  ENV: {
    DAY: { temp: 30, hum: 80, lux: 100 },     // 白天无人：炎热潮湿
    NIGHT: { temp: 16, hum: 30, lux: 10 },    // 黑夜无人：寒冷干燥
    ACTIVE: { temp: 25, hum: 50, lux: 500 }   // 触发激活：绝对舒适
  },
  
  DELAY_MS: 60000 // 1分钟无人后熄灭
};

export const MUSIC_LIB = {
  OSCAR: ["My Heart Will Go On", "Shallow", "Let It Go", "Skyfall", "City of Stars", "Moon River", "Audition", "Remember Me", "A Whole New World", "Can You Feel The Love Tonight"],
  KIDS: ["Baby Shark", "Twinkle Twinkle Little Star", "Old MacDonald", "Wheels on the Bus", "Baa Baa Black Sheep", "London Bridge", "Mary Had a Little Lamb", "Row Row Row Your Boat", "Itsy Bitsy Spider", "Bingo"],
  COUNTRY: ["Take Me Home, Country Roads", "Jolene", "Ring of Fire", "Annie's Song", "The Gambler", "I Walk the Line", "Stand By Your Man", "Crazy", "Always on My Mind", "He Stopped Loving Her Today"],
  LYRICAL: ["Yesterday Once More", "Unchained Melody", "Careless Whisper", "Right Here Waiting", "My Way", "I Will Always Love You", "Hello", "Endless Love", "Tears in Heaven", "Without You"],
  SYMPHONY: ["Beethoven Symphony No.5", "Mozart Symphony No.9", "Tchaikovsky Symphony No.6", "Dvorak Symphony No.9", "Mahler Symphony No.9", "Brahms Symphony No.9", "Schubert Symphony No.4", "Haydn Symphony No.8", "Mendelssohn Symphony No.8", "Sibelius Symphony No.4"]
};

// 根据数字人角色智能匹配
export const MOVIE_LIB: Record<string, string[]> = {
  HACKER: ["《黑客帝国》", "《斯诺登》", "《头号玩家》", "《银翼杀手》", "《代码危机》"],
  DEFAULT: ["《极地探险》", "《星际穿越》", "《楚门的世界》", "《阿凡达》", "《盗梦空间》"]
};