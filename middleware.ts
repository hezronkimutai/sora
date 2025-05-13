import { authMiddleware } from "@clerk/nextjs";
 
// This example protects all routes including api/trpc routes
export default authMiddleware({
  publicRoutes: [
    "/",
    "/sign-in",
    "/sign-up",
    "/sso-callback",
    "/sign-up/sso-callback",
    "/sign-in/sso-callback"
  ],
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/_next/static",
    "/favicon.ico",
  ],
  apiRoutes: ["/api/(.*)"],
  afterAuth(auth, req) {
    // Handle auth state
    const isPublicRoute = req.url.includes('/sign-in') || 
                         req.url.includes('/sign-up') || 
                         req.url === '/';

    // If user is signed in and tries to access auth pages, redirect to dashboard
    if (auth.userId && isPublicRoute) {
      const dashboard = new URL('/dashboard', req.url);
      return Response.redirect(dashboard);
    }

    // Allow the request to continue
    return null;
  }
});
 
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};