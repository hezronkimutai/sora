"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function SignOutPage() {
  console.log('[SignOut] Page mounted');

  const handleSignOut = () => {
    console.log('[SignOut] Dedicated page sign-out clicked');
    window.location.replace('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign Out
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Are you sure you want to sign out?
          </p>
        </div>
        <div className="flex justify-center">
          <SignOutButton>
            <button 
              onClick={handleSignOut}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}