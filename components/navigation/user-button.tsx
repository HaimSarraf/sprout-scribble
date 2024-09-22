"use client";

import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { Button } from "../ui/button";
import { LogOut, Moon, Settings, Sun, TruckIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Switch } from "../ui/switch";
import { useRouter } from "next/navigation";

export default function UserButton({ user }: Session) {
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);

  // function setSwitchState() {
  //   switch (theme) {
  //     case "dark":
  //       return setChecked(true);
  //     case "light":
  //       return setChecked(false);
  //     case "system":
  //       return setChecked(false);
  //   }
  // }

  const router = useRouter();

  if (user)
    return (
      <div>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>
            <Avatar className="w-7 h-7 mt-2">
              {user?.image && user.name && (
                <Image
                  src={user.image}
                  alt={user.name!}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              )}
              {!user.image && (
                <AvatarFallback className="bg-primary/25">
                  <div className="font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </AvatarFallback>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-6" align="end">
            <div className="mb-4 p-4 flex flex-col gap-1 items-center rounded-lg bg-primary/15">
              {user.image && user.name && (
                <Image
                  src={user.image}
                  alt={user.name!}
                  width={36}
                  height={36}
                  className="rounded-full w-10 h-10"
                />
              )}
              <p className="font-bold text-sm">{user.name}</p>
              <span className="text-xs font-medium text-secondary-foreground/25">
                {user.email}
              </span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="group flex flex-row font-medium justify-center gap-10 py-4 cursor-pointer"
              onClick={() => router.push("/dashboard/orders")}
            >
              <TruckIcon
                size={24}
                className="mr-0 group-hover:translate-x-1 transition-all duration-300 ease-in-out"
              />{" "}
              My Orders
            </DropdownMenuItem>
            <DropdownMenuItem
              className="group flex flex-row font-medium justify-center gap-10 py-4 cursor-pointer "
              onClick={() => router.push("/dashboard/settings")}
            >
              <Settings
                size={24}
                className="mr-2 group-hover:rotate-180 transition-all duration-300 ease-in-out"
              />{" "}
              Settings
            </DropdownMenuItem>
            {theme && (
              <DropdownMenuItem className="flex flex-row font-medium justify-center gap-10 py-4 cursor-pointer transition-all duration-500 ease-in-out">
                <div
                  className="flex items-center group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative flex mr-3">
                    <Sun
                      size={24}
                      className="group-hover:text-yellow-600 absolute group-hover:rotate-180 dark:scale-0 dark:-rotate-90 transition-all duration-500 ease-in-out"
                    />
                    <Moon
                      size={24}
                      className="group-hover:text-blue-400 dark:scale-100 scale-0 group-hover:rotate-180 dark:-rotate-180 transition-all duration-500 ease-in-out"
                    />
                  </div>
                  <p className="dark:text-blue-400 text-secondary-foreground/75 text-yellow-600">
                    {theme[0].toUpperCase() + theme.slice(1)} Mode
                  </p>
                  <Switch
                    className="sclae-75 ml-2"
                    checked={checked}
                    onCheckedChange={(e) => {
                      setChecked((prev) => !prev);
                      if (e) setTheme("dark");
                      if (!e) setTheme("light");
                    }}
                  />
                </div>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => signOut()}
              className="group focus:bg-destructive/25"
            >
              <Button className="w-full py-4 font-mono text-muted-foreground hover:text-black hover:text-xl cursor-pointer transition-all duration-500">
                <LogOut
                  size={24}
                  className="mr-3 group-hover:rotate-180 transition-all duration-300 ease-in-out"
                />{" "}
                Sign Out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
}
