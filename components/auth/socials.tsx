"use client";

import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

function Socials() {
  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <Button
        className="flex gap-4 w-1/2 bg-chart-3 text-primary hover:text-chart-3 hover:bg-primary"
        variant={"outline"}
        onClick={() => signIn("google", { redirect: false, callbackUrl: "/" })}
      >
        <FcGoogle />
        Sign In With Google
      </Button>
      <Button
        className="flex gap-4 w-1/2 bg-chart-3 text-primary hover:text-chart-3 hover:bg-primary"
        variant={"outline"}
        onClick={() => signIn("github", { redirect: false, callbackUrl: "/" })}
      >
        <FaGithub />
        Sign In With Github
      </Button>
    </div>
  );
}
export default Socials;
