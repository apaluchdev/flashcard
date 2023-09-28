"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
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
    <NavigationMenu className={`fixed z-50`}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} ${
                currentRoute == "/" ? "bg-accent" : "bg-inherit"
              }`}
            >
              <p className="text-lg">Home</p>
            </NavigationMenuLink>
          </Link>
          <Link href="/topics" legacyBehavior passHref>
            <NavigationMenuLink
              className={`${navigationMenuTriggerStyle()} ${
                currentRoute == "/topics" ? "bg-accent" : "bg-inherit"
              }`}
            >
              <p className="text-lg">Topics</p>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Header;
