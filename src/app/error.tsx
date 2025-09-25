// app/error.tsx
'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Log error to service if needed
    console.error(error);
  }, [error]);

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors"
      aria-label="Error page"
      tabIndex={-1}
    >
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full p-8 text-center transition-colors">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">Something Went Wrong</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          An unexpected error occurred. Please try again, or return to the homepage.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={reset}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-blue-300"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-blue-300"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
