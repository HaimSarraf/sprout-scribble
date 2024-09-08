"use client";

import { signOut } from "next-auth/react";
import { Session } from "next-auth";

export default function UserButton({ user }: Session) {
  return (
    <div>
      <h1>{user?.name}</h1>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
