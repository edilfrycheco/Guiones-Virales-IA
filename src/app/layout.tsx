import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ViralScript AI — Generador de Guiones Virales',
  description: 'Crea guiones virales para Instagram, TikTok y YouTube con escritura indistinguible de humanos. Basado en metodologías de creadores top.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-[var(--bg-primary)]">
        {children}
      </body>
    </html>
  );
}
