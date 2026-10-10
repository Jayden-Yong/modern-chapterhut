import type { Metadata } from "next";
import '@/ui/globals.css';
import { lusitana, poppins } from '@/ui/fonts';
import Navbar from '@/ui/components/Navbar';
import ThemeProvider from '@/ui/components/ThemeProvider';

export const metadata: Metadata = {
  title: "Chapterhut",
  description: "A cozy corner for readers and writers — novels, and a small storefront.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${lusitana.variable}`}>
      <body className="antialiased">
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className='grow container mx-auto px-4 md:px-20 py-6'>
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
