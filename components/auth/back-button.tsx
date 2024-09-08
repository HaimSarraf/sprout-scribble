"use client";

import Link from "next/link";
import { Button } from "../ui/button";

type Props = {
  href: string;
  label: string;
};

function BackButton({ href, label }: Props) {
  return (
    <Button variant={"ghost"} className="font-medium w-full">
      <Link href={href} aria-label={label}>
        {label}
      </Link>
    </Button>
  );
}
export default BackButton;
