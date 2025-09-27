import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loading | NextApp',
  description: 'Loading content, please wait'
};

export default function LoadingPage() {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 bg-opacity-95 dark:bg-gray-900 dark:bg-opacity-95 backdrop-blur-sm"
      role="status"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center justify-center p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          Loading...
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6 text-center">
          Please wait while we load your content.
        </p>
        <div
          className="animate-spin rounded-full h-14 w-14 border-4 border-t-blue-600 border-blue-300 dark:border-t-blue-400 dark:border-blue-600"
          aria-hidden="true"
        ></div>
      </div>
    </div>
  );
}
