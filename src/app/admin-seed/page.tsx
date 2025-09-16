'use client';

import { useState } from 'react';
import { getCoursesByClass, addVideosToCourse } from '@/lib/supabase-data';

// Sample video templates
type VideoTemplate = {
  title: string;
  description: string;
  chapter: string;
  duration: number;
};

export default function AdminSeedPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const createSampleVideos = (classNum: number, subject: string): VideoTemplate[] => {
    const mathVideos: VideoTemplate[] = [
      { title: 'Introduction to Numbers', description: 'Understanding natural numbers, whole numbers, and integers', chapter: 'Number System', duration: 1800 },
      { title: 'Basic Arithmetic Operations', description: 'Addition, subtraction, multiplication and division', chapter: 'Number System', duration: 2100 },
      { title: 'Fractions and Decimals', description: 'Working with fractions and decimal numbers', chapter: 'Number System', duration: 1950 },
      { title: 'Introduction to Algebra', description: 'Variables, constants, and simple equations', chapter: 'Algebra', duration: 2200 },
      { title: 'Linear Equations', description: 'Solving linear equations in one variable', chapter: 'Algebra', duration: 2400 },
    ];

    const scienceVideos: VideoTemplate[] = [
      { title: 'What is Science?', description: 'Introduction to scientific method and observation', chapter: 'Introduction', duration: 1600 },
      { title: 'Matter and Its Properties', description: 'States of matter and physical properties', chapter: 'Matter', duration: 1800 },
      { title: 'Living and Non-living Things', description: 'Characteristics of living organisms', chapter: 'Life Science', duration: 1700 },
      { title: 'Plant Life', description: 'Structure and functions of plants', chapter: 'Life Science', duration: 2000 },
      { title: 'Animal Kingdom', description: 'Classification and characteristics of animals', chapter: 'Life Science', duration: 1900 },
    ];

    const englishVideos: VideoTemplate[] = [
      { title: 'Parts of Speech', description: 'Nouns, verbs, adjectives, and adverbs', chapter: 'Grammar', duration: 1500 },
      { title: 'Sentence Formation', description: 'Building correct and meaningful sentences', chapter: 'Grammar', duration: 1650 },
      { title: 'Reading Comprehension', description: 'Understanding and analyzing text passages', chapter: 'Reading', duration: 1800 },
      { title: 'Creative Writing', description: 'Story writing and descriptive essays', chapter: 'Writing', duration: 2000 },
      { title: 'Poetry Appreciation', description: 'Understanding rhythm, rhyme, and meaning in poetry', chapter: 'Literature', duration: 1750 },
    ];

    const advancedMathVideos: VideoTemplate[] = [
      { title: 'Quadratic Equations', description: 'Solving and graphing quadratic equations', chapter: 'Algebra', duration: 2700 },
      { title: 'Trigonometric Ratios', description: 'Sine, cosine, and tangent functions', chapter: 'Trigonometry', duration: 2500 },
      { title: 'Coordinate Geometry', description: 'Points, lines, and shapes in coordinate plane', chapter: 'Geometry', duration: 2400 },
      { title: 'Statistics and Probability', description: 'Data analysis and probability calculations', chapter: 'Statistics', duration: 2200 },
      { title: 'Surface Area and Volume', description: 'Calculations for 3D shapes and solids', chapter: 'Mensuration', duration: 2300 },
    ];

    const physicsVideos: VideoTemplate[] = [
      { title: 'Motion in Straight Line', description: 'Distance, displacement, velocity, and acceleration', chapter: 'Motion', duration: 2400 },
      { title: 'Laws of Motion', description: 'Newton&apos;s three laws of motion and applications', chapter: 'Force and Motion', duration: 2600 },
      { title: 'Light and Reflection', description: 'Properties of light and reflection phenomena', chapter: 'Optics', duration: 2200 },
      { title: 'Electricity Basics', description: 'Current, voltage, and resistance in circuits', chapter: 'Electricity', duration: 2500 },
      { title: 'Magnetic Effects', description: 'Magnetism and electromagnetic induction', chapter: 'Magnetism', duration: 2300 },
    ];

    const chemistryVideos: VideoTemplate[] = [
      { title: 'Atomic Structure', description: 'Atoms, electrons, protons, and neutrons', chapter: 'Atoms and Molecules', duration: 2100 },
      { title: 'Periodic Table', description: 'Organization and trends in periodic table', chapter: 'Classification', duration: 2300 },
      { title: 'Chemical Bonding', description: 'Ionic and covalent bonds formation', chapter: 'Chemical Bonding', duration: 2200 },
      { title: 'Acids and Bases', description: 'Properties and reactions of acids and bases', chapter: 'Acids, Bases, Salts', duration: 2000 },
      { title: 'Carbon Compounds', description: 'Organic chemistry basics and carbon chains', chapter: 'Carbon and Compounds', duration: 2400 },
    ];

    let videoTemplates: VideoTemplate[] = [];

    if (subject === 'Mathematics' && classNum === 6) {
      videoTemplates = mathVideos;
    } else if (subject === 'Science' && classNum === 6) {
      videoTemplates = scienceVideos;
    } else if (subject === 'English' && classNum === 6) {
      videoTemplates = englishVideos;
    } else if (subject === 'Mathematics' && classNum === 10) {
      videoTemplates = advancedMathVideos;
    } else if (subject === 'Physics' && classNum === 10) {
      videoTemplates = physicsVideos;
    } else if (subject === 'Chemistry' && classNum === 10) {
      videoTemplates = chemistryVideos;
    }

    return videoTemplates;
  };

  const seedSampleVideos = async (): Promise<{ success: boolean; message: string }> => {
    try {
      console.log('Starting to seed sample videos...');

      // Get all courses
      const class6Courses = await getCoursesByClass(6);
      const class10Courses = await getCoursesByClass(10);
      const allCourses = [...class6Courses, ...class10Courses];

      if (allCourses.length === 0) {
        return { success: false, message: 'No courses found. Please run the SQL setup first.' };
      }

      let totalVideosAdded = 0;

      for (const course of allCourses) {
        const videos = createSampleVideos(course.class, course.subject);
        
        const videosForDB = videos.map((video, index) => ({
          title: video.title,
          description: video.description,
          video_url: `https://sample-videos.com/${course.subject.toLowerCase()}/${course.class}/${index + 1}.mp4`,
          thumbnail: `https://images.unsplash.com/photo-${1580000000000 + index}?w=400&h=300&fit=crop`,
          duration: video.duration,
          order: index + 1,
          chapter: video.chapter,
          class: course.class,
        }));

        const success = await addVideosToCourse(course.id, videosForDB);
        
        if (success) {
          totalVideosAdded += videos.length;
          console.log(`Added ${videos.length} videos to ${course.title}`);
        } else {
          console.error(`Failed to add videos to ${course.title}`);
        }
      }

      return { 
        success: true, 
        message: `Successfully added ${totalVideosAdded} videos across ${allCourses.length} courses!` 
      };

    } catch (error) {
      console.error('Error seeding videos:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  };

  const handleSeed = async () => {
    setLoading(true);
    setResult(null);
    
    const seedResult = await seedSampleVideos();
    setResult(seedResult);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            🌱 Database Video Seeding Admin
          </h1>
          
          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              This will populate your Supabase database with sample videos for each course:
            </p>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li><strong>Class 6:</strong> Mathematics, Science, English (5 videos each)</li>
              <li><strong>Class 10:</strong> Mathematics, Physics, Chemistry (5 videos each)</li>
              <li>Each video includes proper metadata and progress tracking</li>
              <li>Videos organized by chapters and learning objectives</li>
            </ul>
          </div>

          <button
            onClick={handleSeed}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Seeding Videos...
              </span>
            ) : (
              '🌱 Seed Sample Videos'
            )}
          </button>

          {result && (
            <div className={`mt-6 p-4 rounded-lg ${
              result.success 
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' 
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}>
              <div className="flex items-center">
                <span className="text-xl mr-2">
                  {result.success ? '✅' : '❌'}
                </span>
                <span className="font-semibold">
                  {result.success ? 'Success!' : 'Error!'}
                </span>
              </div>
              <p className="mt-2">{result.message}</p>
              
              {result.success && (
                <div className="mt-4">
                  <p className="font-semibold mb-2">Next Steps:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to <a href="/signup" className="text-blue-600 hover:underline">/signup</a> to create a test account</li>
                    <li>Select Class 6 or Class 10 during registration</li>
                    <li>Access your dashboard to see courses with videos</li>
                    <li>Test video playback and progress tracking</li>
                    <li>Ready for GitHub push and Vercel deployment!</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <div className="flex items-center">
              <span className="text-blue-600 dark:text-blue-400 text-xl mr-2">ℹ️</span>
              <span className="font-semibold text-blue-800 dark:text-blue-200">Supabase Setup</span>
            </div>
            <p className="text-blue-700 dark:text-blue-300 mt-2">
              Make sure you&apos;ve run the SQL setup script in your Supabase dashboard before seeding videos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}