import "./globals.css";
import { Inter, Open_Sans, Quicksand, Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import InitializeMongoose from "@/lib/mongodb";

InitializeMongoose();

const inter = Inter({ subsets: ["latin"], weight: "800" });

import Header from "@/components/header/header";

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
      <body className={`${inter.className} fancy-scroll`}>
        <Header />
        <div className="h-screen pb-12 pt-12">{children}</div>
        {/* <Footer /> */}
        <Toaster />
      </body>
    </html>
  );
}
