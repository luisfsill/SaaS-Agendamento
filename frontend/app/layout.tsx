import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Ritmo - Agendamento Inteligente via WhatsApp',
  description: 'Automatize agendamentos do seu negócio com IA conversacional no WhatsApp. Reduza no-shows, gerencie sua equipe e aumente receita.',
  keywords: ['agendamento online', 'sistema de agendamento', 'agendamento whatsapp', 'agendamento salão de beleza', 'software para clínicas'],
  authors: [{ name: 'Ritmo' }],
  openGraph: {
    title: 'Ritmo - Agendamento Inteligente via WhatsApp',
    description: 'Automatize agendamentos do seu negócio com IA conversacional no WhatsApp.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
