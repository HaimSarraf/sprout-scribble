"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";

function Socials() {
  return (
    <div className="flex flex-row gap-10 items-center justify-between">
      <Button
        onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}
      >
        Sign In With Google
      </Button>
      <Button
        onClick={() => signIn("github", { redirect: false, callbackUrl: "/" })}
      >
        Sign In With Github
      </Button>
    </div>
  );
}
export default Socials;
