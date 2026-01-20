"use client";

import Link from "next/link";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

export default function AuthUserButton() {
  return (
    <div className="pointer-events-auto">
      <SignedOut>
        <Link
          href="/sign-in"
          className="px-4 py-2 text-sm font-medium"
        >
          Sign In
        </Link>
      </SignedOut>

      <SignedIn>
        <UserButton afterSignOutUrl="/sign-in" />
      </SignedIn>
    </div>
  );
}
