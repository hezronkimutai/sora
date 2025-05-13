"use client";

import { useEffect } from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

export default function SignInCallback() {
  const router = useRouter();

  useEffect(() => {
    // Handle redirect after SSO authentication
    const redirectUrl = new URLSearchParams(window.location.search).get("redirect_url");
    if (redirectUrl) {
      router.push(redirectUrl);
    } else {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AuthenticateWithRedirectCallback />
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">You will be redirected shortly.</p>
      </div>
    </div>
  );
}