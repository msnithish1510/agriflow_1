import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AGRIFlow 🌾⚡ | AI-Driven Pre-Market Agricultural Coordination',
  description: 'Smart India Hackathon 2026 Problem SIH26033 solution connecting farmers, FPOs, bulk buyers, and consumers for demand-driven agricultural transactions and transparent price breakdowns.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
