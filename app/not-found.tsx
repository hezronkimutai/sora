export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Page not found</p>
        <a
          href="/dashboard"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          Go back to dashboard
        </a>
      </div>
    </div>
  );
}