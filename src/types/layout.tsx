import React from 'react';
import './globals.css'; // 确保引用了全局样式，如果没有这个文件，请暂时注释掉这行
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SpaceSQ Genesis',
  description: 'Sovereign Digital Territory Infrastructure',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-black text-white antialiased">
      <body className={`${inter.className} h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}