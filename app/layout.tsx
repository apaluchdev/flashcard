import "./globals.css";
import { Inter, Open_Sans, Quicksand } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";

const openSans = Open_Sans({ subsets: ["latin"], weight: "300" });

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
      <body className={openSans.className}>{children}</body>
    </html>
  );
}
