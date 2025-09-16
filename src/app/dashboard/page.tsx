'use client';

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardOverview from '@/components/DashboardOverview';
import CourseManager from '@/components/CourseManager';
import ProgressTracker from '@/components/ProgressTracker';
import StudentProfile from '@/components/StudentProfile';
import { getCurrentUser, signOut, getStudentProfile } from '@/lib/supabase-auth';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { Loader2 } from 'lucide-react';

type StudentRow = Database['public']['Tables']['students']['Row'];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const studentProfile = await getStudentProfile(currentUser.id);
          setStudent(studentProfile);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        const studentProfile = await getStudentProfile(session.user.id);
        setStudent(studentProfile);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setStudent(null);
        router.push('/login');
      }
    });

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !student) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'courses':
        return <CourseManager student={student} />;
      case 'progress':
        return <ProgressTracker student={student} />;
      case 'profile':
        return <StudentProfile student={student} onUpdate={(updatedStudent) => {
          // In a real app, you would update the student profile in Supabase
          console.log('Profile updated:', updatedStudent);
        }} />;
      default:
        return <DashboardOverview student={student} />;
    }
  };

  return (
    <DashboardLayout 
      student={student} 
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    >
      {renderActiveComponent()}
    </DashboardLayout>
  );
}