-- Brainac Database Schema for Supabase
-- Run this script in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    class INTEGER NOT NULL CHECK (class IN (6, 10)),
    trial_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id UUID DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    class INTEGER NOT NULL CHECK (class IN (6, 10)),
    subject VARCHAR(100) NOT NULL,
    thumbnail TEXT NOT NULL,
    total_videos INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id UUID DEFAULT uuid_generate_v4(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    video_url TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    order_index INTEGER NOT NULL,
    chapter VARCHAR(255) NOT NULL,
    class INTEGER NOT NULL CHECK (class IN (6, 10)),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create progress table
CREATE TABLE IF NOT EXISTS progress (
    id UUID DEFAULT uuid_generate_v4(),
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE(student_id, video_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_class ON courses(class);
CREATE INDEX IF NOT EXISTS idx_videos_course_id ON videos(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_class ON videos(class);
CREATE INDEX IF NOT EXISTS idx_progress_student_id ON progress(student_id);
CREATE INDEX IF NOT EXISTS idx_progress_course_id ON progress(course_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_students_updated_at ON students;
DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
DROP TRIGGER IF EXISTS update_progress_updated_at ON progress;

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Students can view own profile" ON students;
DROP POLICY IF EXISTS "Students can insert own profile" ON students;
DROP POLICY IF EXISTS "Students can update own profile" ON students;
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
DROP POLICY IF EXISTS "Anyone can view videos" ON videos;
DROP POLICY IF EXISTS "Students can view own progress" ON progress;
DROP POLICY IF EXISTS "Students can insert own progress" ON progress;
DROP POLICY IF EXISTS "Students can update own progress" ON progress;

-- Students can only access their own profile
CREATE POLICY "Students can view own profile" ON students FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Students can insert own profile" ON students FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Students can update own profile" ON students FOR UPDATE USING (auth.uid() = id);

-- Anyone can read courses and videos (for browsing)
CREATE POLICY "Anyone can view courses" ON courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Anyone can view videos" ON videos FOR SELECT TO authenticated USING (true);

-- Students can only access their own progress
CREATE POLICY "Students can view own progress" ON progress FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Students can insert own progress" ON progress FOR INSERT WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Students can update own progress" ON progress FOR UPDATE USING (auth.uid() = student_id);

-- Insert sample courses data
INSERT INTO courses (title, description, class, subject, thumbnail, total_videos, total_duration) VALUES
('Mathematics - Class 6', 'Complete mathematics course covering algebra, geometry, and arithmetic for Class 6 students', 6, 'Mathematics', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop', 5, 10500),
('Science - Class 6', 'Explore physics, chemistry, and biology concepts designed for Class 6 curriculum', 6, 'Science', 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=300&fit=crop', 5, 9000),
('English - Class 6', 'Improve reading, writing, and grammar skills with comprehensive English lessons', 6, 'English', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop', 5, 8250),
('Mathematics - Class 10', 'Advanced mathematics including trigonometry, calculus basics, and complex problem solving', 10, 'Mathematics', 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&h=300&fit=crop', 5, 12000),
('Physics - Class 10', 'Advanced physics concepts including mechanics, optics, and electricity', 10, 'Physics', 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400&h=300&fit=crop', 5, 12500),
('Chemistry - Class 10', 'Explore chemical reactions, periodic table, and laboratory techniques', 10, 'Chemistry', 'https://images.unsplash.com/photo-1554475901-4538ddfbccc2?w=400&h=300&fit=crop', 5, 11000)
ON CONFLICT (id) DO NOTHING;

-- Insert sample videos (this will be populated by the seed function)
-- The application will handle video seeding through the admin interface

-- Create function to get course progress for a student
CREATE OR REPLACE FUNCTION get_course_progress(student_uuid UUID, course_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    total_videos INTEGER;
    completed_videos INTEGER;
    progress_percentage INTEGER;
BEGIN
    -- Get total videos in course
    SELECT COUNT(*) INTO total_videos
    FROM videos
    WHERE course_id = course_uuid;
    
    -- Get completed videos by student
    SELECT COUNT(*) INTO completed_videos
    FROM progress
    WHERE student_id = student_uuid 
    AND course_id = course_uuid 
    AND completed = true;
    
    -- Calculate percentage
    IF total_videos > 0 THEN
        progress_percentage := (completed_videos * 100) / total_videos;
    ELSE
        progress_percentage := 0;
    END IF;
    
    RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Brainac database schema created successfully!';
    RAISE NOTICE 'Tables created: students, courses, videos, progress';
    RAISE NOTICE 'Sample courses have been inserted';
    RAISE NOTICE 'Row Level Security policies are active';
END $$;