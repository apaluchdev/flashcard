import Link from "next/link";
import styles from "./Header.module.css";
import { Roboto } from "next/font/google";
import { Button } from "../ui/button";

const roboto = Roboto({ subsets: ["latin"], weight: "300" });

export default function Header() {
  return (
    <header
      className={`${roboto.className} fixed z-50 mb-20 ml-2 mr-2 min-w-full bg-white`}
    >
      <div className="flex">
        <Button variant="ghost" className="text-lg">
          <Link href="/">Home</Link>
        </Button>
        <Button variant="ghost" className="text-lg">
          <Link href="/about">About</Link>
        </Button>
        <Button variant="ghost" className="text-lg">
          <Link href="/topics">Topics</Link>
        </Button>
      </div>
    </header>
  );
}
