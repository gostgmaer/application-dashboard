// app/error.tsx
"use client";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("🚨 React Rendering Error:", error);
  }, [error]);

  return (
    <html>
      <body className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
        <div className="text-center p-6 border rounded-xl shadow-md bg-white dark:bg-gray-800">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
            Something went wrong 😞
          </h2>
          <pre className="mt-2 text-sm whitespace-pre-wrap break-all">
            {error.message}
          </pre>
          <button
            onClick={() => reset()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
