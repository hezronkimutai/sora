import { UserButton } from "@clerk/nextjs"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="flex items-center justify-between h-16 px-4">
          <h1 className="text-xl font-semibold">My Drive</h1>
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {/* Files will be displayed here */}
            <div className="h-40 border rounded-lg flex items-center justify-center text-gray-500">
              No files yet
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}