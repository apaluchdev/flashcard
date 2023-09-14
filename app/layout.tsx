import "./globals.css";
import { Inter, Open_Sans, Quicksand, Roboto } from "next/font/google";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";

const openSans = Open_Sans({ subsets: ["latin"], weight: "300" });
const inter = Inter({ subsets: ["latin"], weight: "800" });
const roboto = Roboto({ subsets: ["latin"], weight: "300" });

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
      {/* <body className={`${quicksand.className} text-red-500`}> */}
      <body className={`${inter.className}`}>
        {/* <Header /> */}
        {children}
        {/* <Footer /> */}
      </body>
    </html>
  );
}
