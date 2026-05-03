import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'XMLoom',
  description: 'XMLoom',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body>{children}</body>
    </html>
  );
}
