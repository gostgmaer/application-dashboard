import { PublicLayout } from "@/components/layout/main-layout";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found | NextApp",
  description: "The page you are looking for does not exist",
};

export default function NotFound() {
  return (
    <PublicLayout>
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors"
        aria-label="404 page"
        tabIndex={-1}
      >
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full p-8 text-center transition-colors">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mb-6">
            The page you are looking for doesn’t exist or has been moved. Try
            returning to the homepage.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-blue-300"
          >
            Back to Home
          </Link>
        </section>
      </div>
    </PublicLayout>
  );
}
