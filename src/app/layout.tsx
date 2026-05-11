import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'AI Spend Audit — Are You Overpaying for AI Tools?',
  description: 'Get a free instant audit of your AI subscriptions. See exactly where you are wasting money and how much you could save.',
  openGraph: {
    title: 'AI Spend Audit — Are You Overpaying for AI Tools?',
    description: 'Get a free instant audit of your AI subscriptions. See exactly where you are wasting money and how much you could save.',
    url: 'https://ai-spend-audit-six-kappa.vercel.app',
    siteName: 'AI Spend Audit',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit — Are You Overpaying for AI Tools?',
    description: 'Get a free instant audit of your AI subscriptions. See exactly where you are wasting money and how much you could save.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}