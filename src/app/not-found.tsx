import Link from 'next/link';
import { Brain, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        
        <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          404
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. 
          It might have been moved or doesn&apos;t exist.
        </p>
        
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          <Home className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
