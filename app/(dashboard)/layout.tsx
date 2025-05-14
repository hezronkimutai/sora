import { SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-semibold text-foreground">
                Drive Clone
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/" />
              <SignOutButton>
                <button className="text-foreground/80 hover:text-foreground">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <main className="h-[calc(100vh-4rem)] overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}