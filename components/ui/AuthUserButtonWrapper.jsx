"use client";

import { usePathname } from "next/navigation";
import AuthUserButton from "@/components/AuthUserButton";

export default function AuthUserButtonWrapper() {
  const pathname = usePathname();

  // Hide on auth pages
  if (pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up")) {
    return null;
  }

  return <AuthUserButton />;
}
