import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Loading | NextApp',
  description: 'Loading content, please wait'
};

export default function LoadingPage() {
  return (
    <div className="container mx-auto">
      <div className="mx-auto rounded-lg shadow-md max-w-md">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Loading...</h1>
          <p className="text-gray-500 mb-6">Please wait while we load your content.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-solid"></div>
          </div>
        </div>
      </div>
    </div>
  );
}