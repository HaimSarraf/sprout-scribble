import { auth } from "@/server/auth";
import Logo from "./logo";
import UserButton from "./user-button";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import CartDrawer from "../cart/cart-drawer";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="py-8 px-4">
      <nav>
        <ul className="flex justify-between gap-4 items-center md:gap-8 ">
          <li className="flex flex-1">
            <Link href="/" aria-label="Sprout & Scribble Logo">
              <Logo />
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link className="flex gap-2" href="/auth/login">
                  <LogIn size={16} />
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
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
