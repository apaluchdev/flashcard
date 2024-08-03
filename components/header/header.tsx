"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "../ui/button";

export function Header() {
  const { data: session } = useSession();
  var image = session?.user?.image;
  const currentRoute = usePathname();

  return (
    <nav className="flex h-14 bg-gray-900 text-white transition-colors">
      <NavigationMenu className="w-full">
        <NavigationMenuList>
          <NavigationMenuItem className="flex w-screen items-center justify-between p-4">
            <div className="flex gap-2">
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} ${
                    currentRoute == "/"
                      ? "bg-slate-200 text-black"
                      : "bg-inherit"
                  }`}
                >
                  <p className="text-lg">Home</p>
                </NavigationMenuLink>
              </Link>
              <Link href="/topics" legacyBehavior passHref>
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} ${
                    currentRoute == "/topics"
                      ? "bg-slate-200 text-black"
                      : "bg-inherit"
                  }`}
                >
                  <p className="text-lg">Topics</p>
                </NavigationMenuLink>
              </Link>
            </div>

            <div className=" text-lg ">
              {!session && (
                <Button
                  onClick={() => signIn()}
                  className="mr-4 bg-transparent p-0 text-lg hover:bg-transparent hover:text-slate-300"
                >
                  Sign In
                </Button>
              )}

              {session && (
                <div className="flex items-center justify-center gap-4">
                  {/* <h2 className="text-sm">{session.user.id}</h2> */}
                  <h2 className=" text-white">{session.user?.name}</h2>
                  {image && (
                    <Image
                      src={image}
                      alt="user image"
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                  )}
                  <Button
                    onClick={() => signOut()}
                    className="mr-4 bg-transparent p-0 text-lg hover:bg-transparent hover:text-slate-300"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default Header;
