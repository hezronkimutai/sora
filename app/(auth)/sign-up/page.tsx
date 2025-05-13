"use client";

import { SignUp } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/dashboard";

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-gray-600 mt-2">
          Get started with your free account
        </p>
      </div>
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-blue-600 hover:bg-blue-700 text-white",
            socialButtonsBlockButton:
              "border-gray-200 hover:bg-gray-50 text-gray-700",
            card: "shadow-none",
          },
        }}
        redirectUrl={redirectUrl}
        signInUrl="/sign-in"
      />
    </div>
  );
}