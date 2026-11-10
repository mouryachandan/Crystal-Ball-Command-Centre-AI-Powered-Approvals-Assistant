import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OomniEye Approvals & Review — Command Centre',
  description:
    'Digital Twin Solutions — Approvals assistant and operator workflow console.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-hidden flex flex-col">{children}</body>
    </html>
  );
}
