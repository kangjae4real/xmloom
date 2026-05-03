import type { Metadata } from 'next';
import { Geist as GeistFont } from 'next/font/google';
import { cn } from '@/lib/utils';
import './globals.css';

const geistFont = GeistFont({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'XMLoom',
  description: 'XMLoom',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const geistFontClassName = cn('font-sans', geistFont.variable);

  return (
    <html lang="en" className={cn('antialiased', geistFontClassName)}>
      <body>{children}</body>
    </html>
  );
}
