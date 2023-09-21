"use client";

import "./styles.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center`}>
      <Title />
      <div className="mt-12 flex flex-col gap-5 fade-in">
        <Button>Sign in</Button>
        <Button>
          {" "}
          <Link href="/topics">Continue as Guest</Link>
        </Button>
      </div>

      <h2 className="mt-32 scroll-m-20 border-b pb-2 text-2xl tracking-tight text-gray-800 transition-colors fade-in first:mt-0">
        Created by Adrian Paluch
      </h2>
      <Image
        className="mt-6 rounded-full fade-in"
        src="/adrian.png"
        width={160}
        height={160}
        alt="Picture of the author"
      />
    </main>
  );
}

export const Title = () => {
  return (
    <div className="mb-12">
      <h1 className="text-center text-8xl tracking-tighter text-gray-700 fade-in">
        Flashcards
      </h1>
      <h1 className=" text-7xl tracking-tighter text-gray-500">
        <span className="text-theme-3 fade-in">Study</span>
        <span className="text-6xl fade-in">. </span>
        <span className="fade-in-delay-1 text-theme-2">Flip</span>
        <span className="fade-in-delay-1 text-6xl">. </span>
        <span className="fade-in-delay-2 text-theme-1">Learn</span>
        <span className="fade-in-delay-2 text-6xl">. </span>
      </h1>
    </div>
  );
};
