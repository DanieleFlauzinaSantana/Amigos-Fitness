import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Changed from Geist to Inter
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext'; // Importar AuthProvider

const inter = Inter({ // Initialize Inter
  variable: '--font-inter', // Use a more generic variable name
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Amigos Fitness',
  description: 'Gerenciamento Inteligente para sua Comunidade Fitness',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} antialiased`}> {/* Use the new font variable */}
        <AuthProvider> {/* Envolver com AuthProvider */}
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}