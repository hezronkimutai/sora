"use client";

import { SignOutButton, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 cursor-pointer" onClick={() => router.push("/dashboard")}>
                Drive Clone
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
              <SignOutButton signOutCallback={() => router.push("/")}>
                <button className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}