import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LocAI — Create Local SEO Content. Publish Directly to WordPress.',
  description:
    'LocAI is the multi-tenant AI SaaS platform that helps local businesses and SEO agencies generate high-ranking local content, service pages, and publish directly to WordPress with 1-click.',
  keywords: [
    'Local SEO',
    'AI Content Generator',
    'WordPress Publishing',
    'Local Business Marketing',
    'Service Pages',
    'SEO SaaS',
  ],
  authors: [{ name: 'LocAI' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100">
        {children}
      </body>
    </html>
  );
}
