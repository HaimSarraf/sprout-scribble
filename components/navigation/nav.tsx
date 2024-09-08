import { auth } from "@/server/auth";
import Logo from "./logo";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="bg-slate-500 py-4 px-4">
      <nav>
        <ul className="flex justify-between">
          <li>
            <Logo />
          </li>
          {!session ? (
            <li>
              <Button asChild>
                <Link className="flex gap-2" href="/auth/login">
                  <LogIn size={16} />
                </Link>
              </Button>
            </li>
          ) : (
            <li>
              <UserButton
                user={session?.user}
                expires={session?.expires || ""}
              />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
