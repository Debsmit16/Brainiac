import { useEffect, useState } from 'react';
import { Student, Course, Video, CourseProgress } from '@/types';
import { getCoursesByClass, getVideosByCourse, getCourseProgress } from '@/lib/supabase-data';
import {
  BookOpen,
  Play,
  Clock,
  CheckCircle,
  Lock,
  ChevronRight,
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

interface CourseManagerProps {
  student: Student;
}

const CourseManager: React.FC<CourseManagerProps> = ({ student }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courseVideos, setCourseVideos] = useState<Video[]>([]);
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const classCourses = await getCoursesByClass(student.class);
        setCourses(classCourses);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [student.class]);

  useEffect(() => {
    const loadCourseDetails = async () => {
      if (!selectedCourse) return;

      try {
        const videos = await getVideosByCourse(selectedCourse.id);
        setCourseVideos(videos);

        const progress = await getCourseProgress(student.id, selectedCourse.id);
        setCourseProgress(progress);
      } catch (error) {
        console.error('Error loading course details:', error);
      }
    };

    loadCourseDetails();
  }, [selectedCourse, student.id]);

  // Helper function for access control
  const hasAccessToContent = (student: Student): boolean => {
    if (student.is_premium) return true;
    const trialEnd = new Date(student.trial_end_date);
    return trialEnd > new Date();
  };

  const hasAccess = hasAccessToContent(student);
  const subjects = [...new Set(courses.map(course => course.subject))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || course.subject === filterSubject;
    
    return matchesSearch && matchesSubject;
  });

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedCourse) {
    return (
      <div className="space-y-6">
        {/* Course Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-600">
            <img
              src={selectedCourse.thumbnail}
              alt={selectedCourse.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <button
                onClick={() => setSelectedCourse(null)}
                className="flex items-center text-white/80 hover:text-white mb-4"
              >
                <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
                Back to Courses
              </button>
              <h1 className="text-2xl font-bold mb-2">{selectedCourse.title}</h1>
              <p className="text-white/90 mb-4">{selectedCourse.description}</p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Play className="h-4 w-4 mr-1" />
                  {selectedCourse.total_videos} videos
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(selectedCourse.total_duration / 60)}h {selectedCourse.total_duration % 60}m
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {selectedCourse.subject}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          {courseProgress > 0 && (
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Course progress
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${courseProgress}%` }}
                ></div>
              </div>
              <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {courseProgress}% complete
              </div>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Course Content
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {courseVideos.map((video, index) => (
              <div
                key={video.id}
                className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                  !hasAccess ? 'opacity-60' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">
                        {video.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {video.description}
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {!hasAccess ? (
                      <Lock className="h-5 w-5 text-gray-400" />
                    ) : (
                      <>
                        <CheckCircle className="h-5 w-5 text-gray-400" />
                        <Play className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {courseVideos.length === 0 && (
            <div className="p-12 text-center">
              <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No videos available for this course yet.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            My Courses
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Class {student.class} • {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => hasAccess && setSelectedCourse(course)}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 ${
                hasAccess ? 'cursor-pointer hover:shadow-lg hover:scale-105' : 'opacity-60'
              }`}
            >
              <div className="relative">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-40 object-cover"
                />
                {!hasAccess && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {course.total_videos} videos
                </div>
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                  {course.subject}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.floor(course.total_duration / 60)}h {course.total_duration % 60}m
                  </div>
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    0% complete
                  </div>
                </div>

                {hasAccess && (
                  <button className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center">
                    <Play className="h-4 w-4 mr-2" />
                    Start Learning
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No courses found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {searchTerm || filterSubject !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : `No courses are available for Class ${student.class} yet.`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default CourseManager;