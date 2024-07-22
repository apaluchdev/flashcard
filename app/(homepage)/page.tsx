"use client";

import "./styles.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@/components/sign-in-button/sign-in-button";
export default function Page() {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-center`}>
      <Title />
      <div className="mt-12 flex flex-col items-center justify-center gap-5 fade-in">
        <SignInButton />
        <Button>
          {" "}
          <Link href="/topics">Continue as Guest</Link>
        </Button>
      </div>

      <h2 className="mt-32 scroll-m-20 border-b pb-2 text-2xl tracking-tight text-gray-800 transition-colors fade-in first:mt-0">
        Created by Adrian Paluch
      </h2>
      <Link href="https://www.linkedin.com/in/adrian-paluch-675b32178/">
        <Image
          className="mt-6 rounded-full fade-in"
          src="/adrian.png"
          width={160}
          height={160}
          alt="Picture of the author"
        />
      </Link>
    </main>
  );
}

const Title = () => {
  return (
    <div className="mb-12">
      <h1 className="mt-6 text-center text-6xl tracking-tighter text-gray-700 fade-in md:text-8xl">
        Flashcards
      </h1>
      <h1 className="text-center text-4xl tracking-tighter text-gray-500 md:text-7xl">
        <span className="text-theme-3 fade-in">Study</span>
        <span className="text-3xl fade-in md:text-6xl">. </span>
        <span className="fade-in-delay-1 text-theme-2">Flip</span>
        <span className="fade-in-delay-1 text-3xl md:text-6xl">. </span>
        <span className="fade-in-delay-2 text-theme-1">Learn</span>
        <span className="fade-in-delay-2 text-3xl md:text-6xl">. </span>
      </h1>
    </div>
  );
};
