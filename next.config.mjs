/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1. Webpack 配置 (保持你可能有的其他配置)
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false };
    return config;
  },

  // 2. [核心修复] 强制包含数据文件
  // 告诉 Vercel: "打包 /api/genesis 路由时，务必带上根目录下的这两个 jsonl 文件"
  experimental: {
    outputFileTracingIncludes: {
      '/api/genesis': [
        './space2_humans_history.jsonl',
        './space2_silicons_history.jsonl'
      ],
    },
  },
};

export default nextConfig;