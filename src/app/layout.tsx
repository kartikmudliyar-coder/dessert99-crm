// src/app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';
import Toaster from '@/components/Toaster';

export const metadata = {
  title: 'Dessert99 CRM',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
