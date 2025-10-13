import { Lock } from "lucide-react";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white shadow-lg rounded-2xl max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
            <Lock></Lock>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page. Please contact your
          administrator or try logging in with a different account.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
          >
            Login Again
          </Link>
        </div>
      </div>
    </div>
  );
}
