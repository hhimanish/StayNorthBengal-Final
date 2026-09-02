// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stay‑Northbengal – Eco‑Tourism Marketplace',
  description: 'Book stays, rides & experiences in the hills of North Bengal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth bg-gray-50">
      <head />
      <body className="font-sans antialiased">
        <header className="bg-primary text-white p-4 shadow-md">
          <h1 className="text-2xl font-bold">Stay‑Northbengal</h1> <a href="/wallet" className="ml-4 text-white hover:underline">Wallet</a>
        </header>
        <main className="container mx-auto p-4">
          {children}
        </main>
        <footer className="bg-gray-200 text-center py-2 mt-8">
          © {new Date().getFullYear()} Stay‑Northbengal. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
