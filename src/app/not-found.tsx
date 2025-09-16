import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found | NextApp',
  description: 'The page you are looking for does not exist'
};

export default function NotFound() {
  return (
    <div className="container mx-auto">
      <div className="mx-auto rounded-lg shadow-md max-w-md">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
          <p className="text-gray-500 mb-6">
            The page you are looking for doesn’t exist or has been moved. Try returning to the homepage.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}