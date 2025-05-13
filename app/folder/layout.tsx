import { FolderTreeContainer } from "@/components/folders/folder-tree-container";
import { SignOutButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default async function FolderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/dashboard" className="text-xl font-semibold text-gray-900">
                Drive Clone
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
              <SignOutButton>
                <button className="text-gray-600 hover:text-gray-900">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
          <FolderTreeContainer />
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}