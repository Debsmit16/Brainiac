import { Brain } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 font-medium">
          Loading Brainac...
        </p>
      </div>
    </div>
  );
}
