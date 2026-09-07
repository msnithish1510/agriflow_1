import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'AGRIFlow 🌾 | Pre-Harvest Agricultural Coordination & Price Transparency',
  description: 'Connect agricultural demand before harvest. Reduce waste, guarantee fair farmer payouts, and audit urban price transparency with AGRIFlow.',
  keywords: 'agriculture, farmers, harvest, pre-market, price transparency, Tamil Nadu, Smart India Hackathon, FPO, bulk buyer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
