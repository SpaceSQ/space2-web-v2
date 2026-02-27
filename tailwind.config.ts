import type { Config } from "tailwindcss";
// 1. 引入默认主题 (为了获取系统默认字体列表)
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 2. [核心修复] Inter在前，默认字体在后
        // 这样 Safari 如果读不到变量，至少会显示 Helvetica/San Francisco，而不是宋体
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        mono: ["var(--font-mono)", ...defaultTheme.fontFamily.mono],
      },
      // ... 其他配置保持不变
    },
  },
  plugins: [],
};
export default config;