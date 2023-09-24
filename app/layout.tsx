import "./globals.css";
import { Inter, Open_Sans, Quicksand, Roboto } from "next/font/google";
import Footer from "@/components/footer/Footer";
import { Toaster } from "@/components/ui/toaster";
import InitializeMongoose from "@/lib/mongodb";
import Header from "@/components/header/header";

const inter = Inter({ subsets: ["latin"], weight: "800" });

export const metadata = {
  title: "Flashcards",
  description: "Use and share Flashcard decks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  InitializeMongoose();

  return (
    <html lang="en">
      {/* <body className={`${quicksand.className} text-red-500`}> */}
      <body className={`${inter.className} fancy-scroll`}>
        <Header />
        <div className="h-screen pb-12 pt-12">{children}</div>
        {/* <Footer /> */}
        <Toaster />
      </body>
    </html>
  );
}
