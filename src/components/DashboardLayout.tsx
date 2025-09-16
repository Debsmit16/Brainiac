import { ReactNode } from 'react';
import { Student } from '@/types';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  User, 
  Settings, 
  LogOut,
  Home,
  PlayCircle,
  BarChart3,
  Bell
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  student: Student;
  onLogout: () => void;
  activeTab?: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  student,
  onLogout,
  activeTab = 'dashboard',
  onTabChange,
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'videos', label: 'Videos', icon: PlayCircle },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Helper functions for trial status
  const getTrialEndDate = () => new Date(student.trial_end_date);
  const getTrialDaysLeft = () => {
    const trialEnd = getTrialEndDate();
    return Math.max(0, Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  };
  const isTrialActive = () => getTrialDaysLeft() > 0;
  
  const trialDaysLeft = getTrialDaysLeft();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Brainac
              </h1>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                Class {student.class}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Trial Status */}
              {isTrialActive() && !student.is_premium && (
                <div className="bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-medium">
                  {trialDaysLeft > 0 ? `${trialDaysLeft} days left` : 'Trial expired'}
                </div>
              )}

              {/* Premium Badge */}
              {student.is_premium && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Premium
                </div>
              )}

              {/* Notifications */}
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
                <Bell className="h-5 w-5" />
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {student.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
                  {student.name}
                </span>
              </div>

              {/* Settings */}
              <button 
                onClick={() => onTabChange('settings')}
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Logout */}
              <button 
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm min-h-screen border-r border-gray-200 dark:border-gray-700">
          <nav className="mt-8">
            <div className="px-4 space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Quick Stats */}
          <div className="mt-8 px-4">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Class:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {student.class}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Status:</span>
                  <span className={`font-medium ${
                    student.is_premium 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : isTrialActive() 
                        ? 'text-orange-600 dark:text-orange-400' 
                        : 'text-red-600 dark:text-red-400'
                  }`}>
                    {student.is_premium ? 'Premium' : isTrialActive() ? 'Trial' : 'Expired'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900">
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;