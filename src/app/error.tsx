'use client';
import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('Global Error:', error);
  }, [error]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 bg-opacity-95 backdrop-blur-sm">
      <div className="p-6 rounded-lg shadow-lg bg-white dark:bg-gray-800 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Something went wrong
        </h1>
        <p className="text-gray-500 dark:text-gray-300 mb-6">{error.message}</p>
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
