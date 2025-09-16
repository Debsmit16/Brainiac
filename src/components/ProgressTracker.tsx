import { useEffect, useState } from 'react';
import { Student, Course, VideoProgress } from '@/types';
import {
  getCoursesByClass,
  getCourseProgress
} from '@/lib/supabase-data';
import {
  BarChart3,
  Clock,
  Trophy,
  Calendar,
  CheckCircle,
  Play,
  BookOpen
} from 'lucide-react';

interface ProgressTrackerProps {
  student: Student;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ student }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<number[]>([]);
  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgressData = async () => {
      try {
        // Load courses for student's class
        const classCourses = await getCoursesByClass(student.class);
        setCourses(classCourses);

        // Load progress for each course
        const courseProgressPromises = classCourses.map(course => 
          getCourseProgress(student.id, course.id)
        );
        const courseProgressResults = await Promise.all(courseProgressPromises);
        setCourseProgress(courseProgressResults.filter(Boolean) as number[]);

        // Skip video progress for now since we don't have that function
        setVideoProgress([]);

      } catch (error) {
        console.error('Error loading progress data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProgressData();
  }, [student]);

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

  const totalVideosWatched = videoProgress.filter(vp => vp.completionPercentage > 0).length;
  const completedVideos = videoProgress.filter(vp => vp.isCompleted).length;
  const totalWatchTime = videoProgress.reduce((sum, vp) => sum + vp.watchedDuration, 0);
  const averageCompletion = courseProgress.length > 0 
    ? Math.round(courseProgress.reduce((sum, cp) => sum + cp, 0) / courseProgress.length)
    : 0;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressBgColor = (percentage: number) => {
    if (percentage >= 80) return 'from-green-500 to-green-600';
    if (percentage >= 50) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Learning Progress
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track your learning journey and achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Videos Started
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalVideosWatched}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
              <Play className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Videos Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completedVideos}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Watch Time
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(totalWatchTime)}
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
                Average Progress
              </p>
              <p className={`text-2xl font-bold ${getProgressColor(averageCompletion)}`}>
                {averageCompletion}%
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <BarChart3 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Course Progress
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Your progress in each course
          </p>
        </div>

        <div className="p-6">
          {courses.length > 0 ? (
            <div className="space-y-6">
              {courses.map((course, index) => {
                const progressPercentage = courseProgress[index] || 0;

                return (
                  <div key={course.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {course.subject} • Class {course.class}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Play className="h-3 w-3 mr-1" />
                              {course.total_videos} videos
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {Math.floor(course.total_duration / 60)}h {course.total_duration % 60}m
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getProgressColor(progressPercentage)}`}>
                          {progressPercentage}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Progress: {progressPercentage}%
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${getProgressBgColor(progressPercentage)} transition-all duration-300`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>

                    {progressPercentage > 0 && (
                      <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                        Course in progress
                      </div>
                    )}
                  </div>
                );
              })}
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

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Recent Activity
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Your latest learning activities
          </p>
        </div>

        <div className="p-6">
          {videoProgress.length > 0 ? (
            <div className="space-y-4">
              {videoProgress
                .sort((a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime())
                .slice(0, 10)
                .map(progress => {
                  const course = courses.find(c => c.id === progress.courseId);
                  
                  return (
                    <div key={progress.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          progress.isCompleted ? 'bg-green-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            Video Progress Updated
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {course?.title} • {progress.completionPercentage}% complete
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {progress.lastWatchedAt.toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No recent activity
              </p>
              <p className="text-sm text-gray-400">
                Start watching videos to see your activity here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Achievements
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Milestones you&apos;ve reached
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* First Video Watched */}
            <div className={`p-4 rounded-lg border-2 ${
              totalVideosWatched > 0 
                ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  totalVideosWatched > 0 
                    ? 'bg-green-100 dark:bg-green-900/40' 
                    : 'bg-gray-100 dark:bg-gray-600'
                }`}>
                  <Play className={`h-5 w-5 ${
                    totalVideosWatched > 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    First Steps
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Watch your first video
                  </p>
                </div>
              </div>
            </div>

            {/* Video Completed */}
            <div className={`p-4 rounded-lg border-2 ${
              completedVideos > 0 
                ? 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  completedVideos > 0 
                    ? 'bg-blue-100 dark:bg-blue-900/40' 
                    : 'bg-gray-100 dark:bg-gray-600'
                }`}>
                  <CheckCircle className={`h-5 w-5 ${
                    completedVideos > 0 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Completionist
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Complete your first video
                  </p>
                </div>
              </div>
            </div>

            {/* Study Time */}
            <div className={`p-4 rounded-lg border-2 ${
              totalWatchTime >= 3600 
                ? 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20' 
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  totalWatchTime >= 3600 
                    ? 'bg-purple-100 dark:bg-purple-900/40' 
                    : 'bg-gray-100 dark:bg-gray-600'
                }`}>
                  <Trophy className={`h-5 w-5 ${
                    totalWatchTime >= 3600 
                      ? 'text-purple-600 dark:text-purple-400' 
                      : 'text-gray-400'
                  }`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">
                    Dedicated Learner
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Watch for 1 hour
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;