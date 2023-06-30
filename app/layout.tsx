import Link from "next/link";
import "./globals.css";
import { Inter, Open_Sans, Quicksand } from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css";

const openSans = Open_Sans({ subsets: ["latin"], weight: "300" });

export const metadata = {
  title: "FlashCards",
  description: "Use and share Flashcard decks",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={openSans.className}>
        <header style={{ margin: "5px", color: "#802424", position: "fixed" }}>
          <Link href="https://en.wikipedia.org/wiki/Next.js">Sign in</Link>
        </header>
        {children}
        <footer
          style={{
            color: "black",
            position: "fixed",
            left: "20px",
            bottom: 0,
            width: "100%",
            fontSize: "1.25em",
          }}>
          <p>Created by Adrian Paluch</p>
        </footer>
      </body>
    </html>
  );
}
