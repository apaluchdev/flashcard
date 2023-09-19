import Link from "next/link";
import { Roboto } from "next/font/google";
import { Button } from "../ui/button";

const roboto = Roboto({ subsets: ["latin"], weight: "300" });

export default function Header() {
  return (
    <header className={`${roboto.className} fixed z-50 min-w-full bg-gray-50`}>
      <div className="flex">
        <Button variant="ghost" className="text-lg tracking-tight">
          <Link href="/">Home</Link>
        </Button>
        <Button variant="ghost" className="text-lg tracking-tight">
          <Link href="/topics">Topics</Link>
        </Button>
      </div>
    </header>
  );
}
