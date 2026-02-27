import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css"; // <--- 🚨 核心：必须保留这行，否则所有样式（包括字体）都会失效！

// 配置 Google Fonts
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

const mono = JetBrains_Mono({ 
  subsets: ["latin"], 
  variable: "--font-mono",
  display: 'swap',
});

// 之前修复的 Metadata 配置（保持不变）
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL 
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL) 
  : new URL('http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "SpaceSQ | Genesis Protocol",
    template: "%s | SpaceSQ"
  },
  description: "The Operating System for Civilization Switch. Integrating Tech, Art, and Capital into a single sovereign identity.",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'SpaceSQ',
    description: 'The Genesis Registry for Silicon Sovereignty.',
    url: baseUrl,
    siteName: 'SpaceSQ',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      {/* 🚨 核心修复：
        1. ${inter.variable} ${mono.variable} -> 注入字体变量
        2. font-sans -> 告诉 Tailwind 使用无衬线字体作为默认
        3. bg-black text-white -> 强制背景黑、文字白（防止加载时闪白屏）
      */}
      <body className={`${inter.variable} ${mono.variable} font-sans bg-black text-white antialiased selection:bg-emerald-500/30`}>
        {children}
      </body>
    </html>
  );
}