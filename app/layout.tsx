import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Toast from "@/components/ui/Toast";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { AuthProvider } from "@/lib/supabase/auth";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shindhu Cinemas - Book Movie Tickets & Snacks Online",
  description: "Book movie tickets, choose seats, and order snacks in advance. Experience the best cinema with Shindhu Cinemas.",
  keywords: ["movie tickets", "cinema booking", "online booking", "snacks", "movies", "theater"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <AuthProvider>
            <ScrollToTop />
            <Header />
            <main className="min-h-screen" style={{ paddingTop: 'calc(4rem + 3rem + 1rem)' }}>
              {children}
            </main>
            <Footer />
            <Toast />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
