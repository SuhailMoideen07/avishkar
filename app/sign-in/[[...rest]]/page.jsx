"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SignInContent() {
  const params = useSearchParams();
  const redirectUrl = params.get("redirect_url") || "/";

  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignIn
        fallbackRedirectUrl={redirectUrl}
        signUpUrl="/sign-up"
      />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}