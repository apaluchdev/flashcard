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

export function Header() {
  const currentRoute = usePathname();

  return (
    <nav className="flex h-12 items-center bg-gray-900 p-4 text-white transition-colors">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="flex gap-2">
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${
                  currentRoute == "/" ? "bg-slate-200 text-black" : "bg-inherit"
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
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}

export default Header;
