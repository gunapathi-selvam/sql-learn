import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sakila SQL Dojo",
  description:
    "Self-study SQL practice on the MySQL Sakila sample database — 200 questions across 10 topics.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('sakila-theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            {children}
          </main>
          <footer className="no-print mx-auto w-full max-w-7xl px-4 pb-8 pt-4 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
            Built for self-study · Sakila SQL Dojo · Inspired by SQLZoo
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
