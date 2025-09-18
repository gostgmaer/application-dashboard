import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Error | NextApp',
  description: 'An error occurred in the application'
};

export default function ErrorPage({ statusCode }: { statusCode?: number }) {

  const message = statusCode === 404 
    ? 'The page you are looking for could not be found.'
    : 'An unexpected error occurred on our server.';

  return (
    <div className="container mx-auto">
      <div className="mx-auto rounded-lg shadow-md max-w-md">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {statusCode ? `${statusCode} - Error` : 'Application Error'}
          </h1>
          <p className="text-gray-500 mb-6">
            {message} Please try again later or contact support for assistance.
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};