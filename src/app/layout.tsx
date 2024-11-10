import React from 'react';
import type { Metadata, Viewport } from 'next';
import './globals.css';
import ReactQueryProvider from '@/queries/ReactQueryProvider';

export const metadata: Metadata = {
  title: 'Gift App',
};

export const viewport: Viewport = {
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="flex flex-col transition-[height]"
        style={{ height: 'var(--tg-viewport-stable-height, 100vh)' }}
      >
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
