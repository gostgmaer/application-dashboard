// app/access-denied.tsx
import Link from 'next/link';

export const metadata = {
  title: 'Access Denied | NextApp',
  description: 'You do not have permission to access this page',
};

export default function AccessDenied() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors"
      aria-label="Access denied page"
      tabIndex={-1}
    >
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md w-full p-8 text-center transition-colors">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-400 mb-4">Access Denied</h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">
          You do not have permission to view this page. Please contact your administrator or return to the homepage.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 bg-blue-600 dark:bg-blue-500 text-white font-medium rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors focus:outline-none focus-visible:ring focus-visible:ring-blue-300"
        >
          Back to Home
        </Link>
      </section>
    </main>
  );
}
