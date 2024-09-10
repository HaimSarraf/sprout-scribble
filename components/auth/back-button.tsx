"use client";

import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  href: string;
  label: string;
};

function BackButton({ href, label }: Props) {
  return (
    <div className="items-center text-balance w-full flex justify-center">
      <Button variant={"link"} className="font-mono w-1/2 font-bold" asChild>
        <Link href={href} aria-label={label}>
          {label}
        </Link>
      </Button>
    </div>
  );
}
export default BackButton;
