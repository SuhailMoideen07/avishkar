import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Run on all routes except static files
    "/((?!_next|.*\\..*).*)",
  ],
};