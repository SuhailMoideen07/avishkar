import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware({
  publicRoutes: [
    "/api/webhooks/clerk", // 👈 REQUIRED
  ],
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};