import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Drive Clone",
  description: "A simple Google Drive clone built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: { colorPrimary: "#2563eb" },
        elements: {
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 text-white",
          socialButtonsBlockButton:
            "border-gray-200 hover:bg-gray-50 text-gray-700",
          card: "shadow-none",
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-50">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}