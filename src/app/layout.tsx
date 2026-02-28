import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { GlobalNav } from '@/components/GlobalNav'; // 👈 必须引入这个！

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata: Metadata = {
  title: 'Space² | Digital Life Network',
  description: 'The spatial operating system for phygital lifeforms.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="bg-[#020617] text-white antialiased">
        {/* 👇 全局导航栏挂载点 - 它会出现在所有页面顶部 */}
        <GlobalNav currentScene="HOME" />
        {children}
      </body>
    </html>
  );
}