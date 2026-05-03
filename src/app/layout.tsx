import type { Metadata } from 'next';
import { Geist as GeistFont } from 'next/font/google';
import { cn } from '@/utils/shadcn';
import QueryClientProvider from '@/app/query-client-provider';
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
      <body>
        <QueryClientProvider>{children}</QueryClientProvider>
      </body>
    </html>
  );
}
