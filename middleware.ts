import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: ["/", "/sign-in", "/sign-up"],
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};