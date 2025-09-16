import { supabase } from './supabase';
import type { Database } from '@/types/supabase';

type StudentInsert = Database['public']['Tables']['students']['Insert'];
type StudentRow = Database['public']['Tables']['students']['Row'];

export interface AuthResult {
  success: boolean;
  message: string;
  user?: StudentRow | null;
}

// Sign up new user
export async function signUp(email: string, password: string, name: string, selectedClass: number): Promise<AuthResult> {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return { success: false, message: authError.message };
    }

    if (!authData.user) {
      return { success: false, message: 'Failed to create user account' };
    }

    // Create student profile
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 3); // 3-day trial

    const studentData: StudentInsert = {
      id: authData.user.id,
      email,
      name,
      class: selectedClass,
      trial_end_date: trialEndDate.toISOString(),
      is_premium: false,
    };

    const { error: profileError } = await supabase
      .from('students')
      .insert(studentData as any);

    if (profileError) {
      console.error('Error creating student profile:', profileError);
      return { success: false, message: 'Failed to create student profile' };
    }

    return { 
      success: true, 
      message: 'Account created successfully! Please check your email to verify your account.',
      user: null 
    };

  } catch (error) {
    console.error('Signup error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Sign in existing user
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      message: 'Login successful!',
      user: null 
    };

  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Sign out user
export async function signOut(): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: 'Logged out successfully!' };

  } catch (error) {
    console.error('Logout error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Get current user
export async function getCurrentUser() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
}

// Get student profile
export async function getStudentProfile(userId: string): Promise<StudentRow | null> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching student profile:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return null;
  }
}

// Reset password
export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    
    if (error) {
      return { success: false, message: error.message };
    }

    return { 
      success: true, 
      message: 'Password reset email sent! Check your inbox.' 
    };

  } catch (error) {
    console.error('Password reset error:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

// Check if user's trial has expired
export function isTrialExpired(trialEndDate: string): boolean {
  return new Date() > new Date(trialEndDate);
}