import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageContext';

export const metadata: Metadata = {
  title: 'Prasad Tech Pulse | AI-Powered Tech News Digest',
  description:
    'Bilingual daily tech news digests and deep-dive articles curated from India’s leading Telugu tech creator, Prasad Tech In Telugu.',
  keywords: [
    'Prasad Tech In Telugu',
    'Tech News',
    'Telugu Tech',
    'Smartphone launches',
    'Processor leaks',
    'AI tech news',
  ],
  openGraph: {
    title: 'Prasad Tech Pulse — Daily Tech News from Prasad Tech In Telugu',
    description:
      'Structured bilingual tech news summaries and in-depth gadget reviews powered by Gen AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Header />
          <main className="main-content">{children}</main>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
