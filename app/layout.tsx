import "./globals.css";
import { Inter, Open_Sans, Quicksand, Roboto } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], weight: "800" });

import Header from "@/components/header/header";
import Providers from "@/components/providers/providers";
import mongoose from "mongoose";

if (mongoose.connection.readyState === 1) {
  console.log("Mongoose already connected");
} else {
  console.log("Mongoose initializing...");

  const MONGODB_URI = process.env.MONGODB_URI || "";

  mongoose
    .connect(MONGODB_URI)
    .then((result) => console.log("Mongoose connected"))
    .catch((error) => console.log("Mongoose error: " + error));
}

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
        <Providers>
          <div className="h-screen pb-12 pt-12">{children}</div>
        </Providers>
        {/* <Footer /> */}
        <Toaster />
      </body>
    </html>
  );
}
