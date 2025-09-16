import { useEffect, useState } from 'react';
import { Student, Course, DashboardStats } from '@/types';
import { getCoursesByClass } from '@/lib/supabase-data';
import {
  BookOpen,
  Play,
  Clock,
  Trophy,
  Calendar,
  Lock,
  CreditCard
} from 'lucide-react';

interface DashboardOverviewProps {
  student: Student;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ student }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper functions
  const hasAccessToContent = (student: Student): boolean => {
    if (student.is_premium) return true;
    const trialEnd = new Date(student.trial_end_date);
    return trialEnd > new Date();
  };

  const getRemainingTrialDays = (student: Student): number => {
    if (student.is_premium) return 0;
    const trialEnd = new Date(student.trial_end_date);
    return Math.max(0, Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load courses for student's class
        const classCourses = await getCoursesByClass(student.class);
        setCourses(classCourses);

        // Calculate stats
        const totalVideosWatched = 0; // We'll implement this later
        const totalWatchTime = 0; // We'll implement this later
        
        const dashboardStats: DashboardStats = {
          totalCourses: classCourses.length,
          completedCourses: 0,
          totalVideosWatched,
          totalWatchTime,
          currentStreak: 0,
          lastLoginDate: new Date(),
        };

        setStats(dashboardStats);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [student]);

  const hasAccess = hasAccessToContent(student);
  const trialDaysLeft = getRemainingTrialDays(student);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {student.name}! 👋
            </h1>
            <p className="text-blue-100">
              Ready to continue your learning journey?
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">Class {student.class}</div>
          </div>
        </div>
      </div>

      {/* Trial/Access Status */}
      {!hasAccess && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Lock className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Access Expired
                </h3>
                <p className="text-red-700 dark:text-red-300">
                  Your free trial has ended. Upgrade to continue learning.
                </p>
              </div>
            </div>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      {!student.is_premium && trialDaysLeft > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400 mr-3" />
              <div>
                <h3 className="font-semibold text-orange-900 dark:text-orange-100">
                  Free Trial Active
                </h3>
                <p className="text-orange-700 dark:text-orange-300">
                  {trialDaysLeft} day{trialDaysLeft !== 1 ? 's' : ''} remaining in your free trial
                </p>
              </div>
            </div>
            <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Subscribe
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Courses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Videos Watched
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.totalVideosWatched}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Play className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Watch Time
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {Math.floor(stats.totalWatchTime / 60)}h
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Clock className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Streak
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.currentStreak}
                </p>
              </div>
              <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
                <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Courses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Available Courses
            </h2>
            <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              View All
            </button>
          </div>
        </div>

        <div className="p-6">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 6).map((course) => (
                <div key={course.id} className="group cursor-pointer">
                  <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mb-3">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    {!hasAccess && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {course.total_videos} videos
                    </div>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {course.subject} • Class {course.class}
                  </p>
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    {Math.floor(course.total_duration / 60)}h {course.total_duration % 60}m
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No courses available for Class {student.class}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;