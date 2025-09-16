import { useEffect, useState, useRef } from 'react';
import { Student, Video, VideoProgress, Course } from '@/types';
import { 
  getCoursesByClass, 
  getVideosByCourse, 
  updateVideoProgress 
} from '@/lib/supabase-data';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Maximize,
  Lock,
  ChevronRight,
  CheckCircle,
  Clock
} from 'lucide-react';

interface VideoPlayerProps {
  student: Student;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ student }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [videoProgress, setVideoProgress] = useState<VideoProgress | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Helper function for access control
  const hasAccessToContent = (student: Student): boolean => {
    if (student.is_premium) return true;
    const trialEnd = new Date(student.trial_end_date);
    return trialEnd > new Date();
  };

  const hasAccess = hasAccessToContent(student);

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
    const loadVideos = async () => {
      if (!selectedCourse) return;

      try {
        const courseVideos = await getVideosByCourse(selectedCourse.id);
        setVideos(courseVideos);
        
        if (courseVideos.length > 0) {
          setCurrentVideo(courseVideos[0]);
        }
      } catch (error) {
        console.error('Error loading videos:', error);
      }
    };

    loadVideos();
  }, [selectedCourse]);

  useEffect(() => {
    const loadVideoProgress = async () => {
      if (!currentVideo || !hasAccess) return;

      try {
    // For now, we'll skip individual video progress loading since it's not in our data structure
    // const progress = await getVideoProgress(student.id, currentVideo.id);
    // setVideoProgress(progress);
        
        // For now, skip setting video position from progress
        // if (progress && videoRef.current) {
        //   videoRef.current.currentTime = progress.watchedDuration;
        // }
      } catch (error) {
        console.error('Error loading video progress:', error);
      }
    };

    loadVideoProgress();
  }, [currentVideo, student.id, hasAccess]);

  const handlePlayPause = () => {
    if (!videoRef.current || !hasAccess) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;

    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    
    setCurrentTime(current);
    setDuration(total);

    // Update progress every 10 seconds
    if (current % 10 < 1 && hasAccess && currentVideo) {
      const progressPercentage = total > 0 ? (current / total) * 100 : 0;
      updateVideoProgress(student.id, currentVideo.id, selectedCourse!.id, progressPercentage);
    }
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !progressBarRef.current || !hasAccess) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    if (!videoRef.current) return;

    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds: number) => {
    if (!videoRef.current || !hasAccess) return;

    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const selectVideo = (video: Video) => {
    if (!hasAccess) return;
    
    setCurrentVideo(video);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const nextVideo = () => {
    if (!currentVideo || !hasAccess) return;

    const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
    if (currentIndex < videos.length - 1) {
      setCurrentVideo(videos[currentIndex + 1]);
    }
  };

  const prevVideo = () => {
    if (!currentVideo || !hasAccess) return;

    const currentIndex = videos.findIndex(v => v.id === currentVideo.id);
    if (currentIndex > 0) {
      setCurrentVideo(videos[currentIndex - 1]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 dark:bg-gray-700 aspect-video rounded-xl mb-6"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!selectedCourse) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Video Library
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Select a course to start watching videos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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
                <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {course.total_videos} videos
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {course.subject} • Class {course.class}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setSelectedCourse(null)}
        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ChevronRight className="h-4 w-4 rotate-180 mr-1" />
        Back to Courses
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {currentVideo ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  src={hasAccess ? currentVideo.video_url : undefined}
                  poster={currentVideo.thumbnail}
                  className="w-full aspect-video"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />

                {!hasAccess && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Lock className="h-12 w-12 mx-auto mb-4" />
                      <p className="text-lg font-medium">Premium Content</p>
                      <p className="text-sm opacity-80">Upgrade to access this video</p>
                    </div>
                  </div>
                )}

                {/* Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  {/* Progress Bar */}
                  <div
                    ref={progressBarRef}
                    onClick={handleSeek}
                    className="w-full h-2 bg-white/30 rounded-full cursor-pointer mb-4"
                  >
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-200"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handlePlayPause}
                        disabled={!hasAccess}
                        className="text-white hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isPlaying ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </button>

                      <button
                        onClick={prevVideo}
                        disabled={!hasAccess}
                        className="text-white hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SkipBack className="h-5 w-5" />
                      </button>

                      <button
                        onClick={nextVideo}
                        disabled={!hasAccess}
                        className="text-white hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <SkipForward className="h-5 w-5" />
                      </button>

                      <div className="flex items-center space-x-2">
                        <button onClick={toggleMute} className="text-white hover:text-blue-400">
                          {isMuted ? (
                            <VolumeX className="h-5 w-5" />
                          ) : (
                            <Volume2 className="h-5 w-5" />
                          )}
                        </button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                          className="w-20"
                        />
                      </div>

                      <span className="text-white text-sm">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="text-white hover:text-blue-400">
                        <Settings className="h-5 w-5" />
                      </button>
                      <button className="text-white hover:text-blue-400">
                        <Maximize className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                <div className="text-center">
                  <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a video to start watching
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          {currentVideo && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {currentVideo.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {currentVideo.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {formatTime(currentVideo.duration)}
                </div>
                <div>Chapter: {currentVideo.chapter}</div>
                {videoProgress && (
                  <div>
                    Progress: {videoProgress.completionPercentage}%
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Video Playlist */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {selectedCourse.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {videos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => selectVideo(video)}
                className={`p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 transition-colors ${
                  hasAccess 
                    ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' 
                    : 'opacity-60 cursor-not-allowed'
                } ${
                  currentVideo?.id === video.id 
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-l-blue-500' 
                    : ''
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentVideo?.id === video.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {video.title}
                    </h4>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(video.duration)}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    {hasAccess ? (
                      <CheckCircle className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Lock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;