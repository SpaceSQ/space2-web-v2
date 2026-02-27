// src/types/space-core.ts

// 1. 定义一个宽泛的 Container 接口 (防止类型报错)
export interface Container {
  id: string;
  name: string;
  type?: string;
  // 允许任意其它属性，防止 strict 模式报错
  [key: string]: any;
}

// 2. 定义默认元素常量
export const DEFAULT_ELEMENTS = [
  'Space', 
  'Time', 
  'Energy', 
  'Matter', 
  'Information'
];