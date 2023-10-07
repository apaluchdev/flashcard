"use client";

import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import { SignInIcon, SignOutIcon } from "@primer/octicons-react";

export const SignInButton = () => {
  const { data: session } = useSession();

  // TODO uninstall MUI
  if (session && session.user) {
    //console.log(session);
    return (
      <div>
        <Button onClick={() => signOut()}>
          Sign out <SignOutIcon className="ml-2" />
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button onClick={() => signIn()}>
        Sign In
        <SignInIcon className="ml-2" />
      </Button>
    </div>
  );
};
