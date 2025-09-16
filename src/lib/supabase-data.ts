import { supabase } from './supabase';
import type { Database } from '@/types/supabase';

// Type aliases for cleaner code
type CourseRow = Database['public']['Tables']['courses']['Row'];
type VideoRow = Database['public']['Tables']['videos']['Row'];
type ProgressRow = Database['public']['Tables']['progress']['Row'];
type VideoInsert = Database['public']['Tables']['videos']['Insert'];
type ProgressInsert = Database['public']['Tables']['progress']['Insert'];

// Helper types for complex queries
type StudentWithClass = { class: number };
type ProgressWithVideos = ProgressRow & { videos?: { duration: number } };

// Get courses by class
export async function getCoursesByClass(classNum: number): Promise<CourseRow[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('class', classNum)
      .order('subject');

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

// Get videos by course
export async function getVideosByCourse(courseId: string): Promise<VideoRow[]> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (error) {
      console.error('Error fetching videos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

// Get student progress for a video
export async function getStudentVideoProgress(studentId: string, videoId: string): Promise<ProgressRow | null> {
  try {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('video_id', videoId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error fetching video progress:', error);
    }

    return data || null;
  } catch (error) {
    console.error('Error fetching video progress:', error);
    return null;
  }
}

// Update video progress
export async function updateVideoProgress(
  studentId: string,
  videoId: string,
  courseId: string,
  progressPercentage: number,
  completed: boolean = false
): Promise<boolean> {
  try {
    const progressData: ProgressInsert = {
      student_id: studentId,
      video_id: videoId,
      course_id: courseId,
      progress_percentage: Math.min(100, Math.max(0, progressPercentage)),
      completed: completed || progressPercentage >= 90,
      last_watched_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('progress')
      .upsert(progressData as any, {
        onConflict: 'student_id,video_id'
      });

    if (error) {
      console.error('Error updating video progress:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating video progress:', error);
    return false;
  }
}

// Get course progress for a student
export async function getCourseProgress(studentId: string, courseId: string): Promise<number> {
  try {
    // Get total videos in course
    const { data: videos, error: videosError } = await supabase
      .from('videos')
      .select('id')
      .eq('course_id', courseId);

    if (videosError) {
      console.error('Error fetching course videos:', videosError);
      return 0;
    }

    if (!videos || videos.length === 0) return 0;

    // Get completed videos by student
    const { data: progress, error: progressError } = await supabase
      .from('progress')
      .select('id')
      .eq('student_id', studentId)
      .eq('course_id', courseId)
      .eq('completed', true);

    if (progressError) {
      console.error('Error fetching course progress:', progressError);
      return 0;
    }

    const completedCount = progress?.length || 0;
    return Math.round((completedCount / videos.length) * 100);
  } catch (error) {
    console.error('Error calculating course progress:', error);
    return 0;
  }
}

// Get all progress for a student
export async function getStudentProgress(studentId: string): Promise<ProgressRow[]> {
  try {
    const { data, error } = await supabase
      .from('progress')
      .select(`
        *,
        videos (title, course_id),
        courses (title, subject)
      `)
      .eq('student_id', studentId)
      .order('last_watched_at', { ascending: false });

    if (error) {
      console.error('Error fetching student progress:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching student progress:', error);
    return [];
  }
}

// Get student statistics
export async function getStudentStats(studentId: string): Promise<{
  totalCourses: number;
  completedCourses: number;
  totalVideos: number;
  completedVideos: number;
  totalWatchTime: number;
}> {
  try {
    const { data: student } = await supabase
      .from('students')
      .select('class')
      .eq('id', studentId)
      .single();

    if (!student) {
      return { totalCourses: 0, completedCourses: 0, totalVideos: 0, completedVideos: 0, totalWatchTime: 0 };
    }

    // Get courses for student's class
    const { data: courses } = await supabase
      .from('courses')
      .select('id')
      .eq('class', (student as StudentWithClass)?.class || 6);

    // Get student's progress
    const { data: progress } = await supabase
      .from('progress')
      .select(`
        *,
        videos (duration)
      `)
      .eq('student_id', studentId);

    const totalCourses = courses?.length || 0;
    const completedVideos = progress?.filter((p: ProgressWithVideos) => p.completed).length || 0;
    const totalVideos = progress?.length || 0;
    
    // Calculate watch time (completed videos duration)
    const totalWatchTime = progress
      ?.filter((p: ProgressWithVideos) => p.completed)
      .reduce((acc: number, p: ProgressWithVideos) => acc + (p.videos?.duration || 0), 0) || 0;

    // Calculate completed courses (courses with 100% completion)
    let completedCourses = 0;
    if (courses) {
      for (const course of courses) {
        const courseProgress = await getCourseProgress(studentId, (course as any).id);
        if (courseProgress === 100) {
          completedCourses++;
        }
      }
    }

    return {
      totalCourses,
      completedCourses,
      totalVideos,
      completedVideos,
      totalWatchTime
    };
  } catch (error) {
    console.error('Error fetching student stats:', error);
    return { totalCourses: 0, completedCourses: 0, totalVideos: 0, completedVideos: 0, totalWatchTime: 0 };
  }
}

// Add videos to course (for seeding)
export async function addVideosToCourse(courseId: string, videos: Omit<VideoInsert, 'course_id'>[]): Promise<boolean> {
  try {
    const videosWithCourseId = videos.map(video => ({
      ...video,
      course_id: courseId
    }));

    const { error } = await supabase
      .from('videos')
      .insert(videosWithCourseId as any);

    if (error) {
      console.error('Error adding videos to course:', error);
      return false;
    }

    // Update course total_videos count
    const { error: updateError } = await supabase
      .from('courses')
      // @ts-ignore - Complex Supabase type inference issue with update operations
      .update({
        total_videos: videos.length,
        total_duration: videos.reduce((sum, v) => sum + v.duration, 0)
      })
      .eq('id', courseId);

    if (updateError) {
      console.error('Error updating course stats:', updateError);
    }

    return true;
  } catch (error) {
    console.error('Error adding videos to course:', error);
    return false;
  }
}

// Search courses
export async function searchCourses(query: string, classNum?: number): Promise<CourseRow[]> {
  try {
    let queryBuilder = supabase
      .from('courses')
      .select('*')
      .ilike('title', `%${query}%`);

    if (classNum) {
      queryBuilder = queryBuilder.eq('class', classNum);
    }

    const { data, error } = await queryBuilder.order('title');

    if (error) {
      console.error('Error searching courses:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error searching courses:', error);
    return [];
  }
}