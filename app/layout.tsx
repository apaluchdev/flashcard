import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], weight: "800" });

import Header from "@/components/header/header";
import Providers from "@/components/providers/providers";

export const metadata = {
  title: "Flashcards",
  description: "Use and share Flashcard decks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} fancy-scroll flex h-screen flex-col`}
      >
        <Providers>
          <Header />
          <div className="flex-1">{children}</div>
        </Providers>
        {/* <Footer /> */}
        <Toaster />
      </body>
    </html>
  );
}
