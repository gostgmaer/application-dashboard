import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error | NextAuth",
  description: "An error occurred during authentication",
};

export default function AuthErrorPage() {
  return (
    <div className="container mx-auto">
      <div className="mx-auto rounded-lg shadow-md">
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, something went wrong during authentication. Please try again
            or contact support if the issue persists.
          </p>
          <a
            href="/auth/login"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Login
          </a>
        </div>
      </div>
    </div>
  );
}
