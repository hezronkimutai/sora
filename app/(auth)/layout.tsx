export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        {children}
      </div>
    </div>
  );
}

export const metadata = {
  title: "Authentication - Drive Clone",
  description: "Sign in or sign up to use Drive Clone",
};