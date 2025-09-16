export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          email: string
          name: string
          class: number
          created_at: string
          trial_end_date: string
          is_premium: boolean
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          class: number
          created_at?: string
          trial_end_date: string
          is_premium?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          class?: number
          created_at?: string
          trial_end_date?: string
          is_premium?: boolean
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          title: string
          description: string
          class: number
          subject: string
          thumbnail: string
          total_videos: number
          total_duration: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          class: number
          subject: string
          thumbnail: string
          total_videos: number
          total_duration: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          class?: number
          subject?: string
          thumbnail?: string
          total_videos?: number
          total_duration?: number
          created_at?: string
          updated_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          course_id: string
          title: string
          description: string
          video_url: string
          thumbnail: string
          duration: number
          order: number
          chapter: string
          class: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          description: string
          video_url: string
          thumbnail: string
          duration: number
          order: number
          chapter: string
          class: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          description?: string
          video_url?: string
          thumbnail?: string
          duration?: number
          order?: number
          chapter?: string
          class?: number
          created_at?: string
        }
      }
      progress: {
        Row: {
          id: string
          student_id: string
          video_id: string
          course_id: string
          progress_percentage: number
          completed: boolean
          last_watched_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          video_id: string
          course_id: string
          progress_percentage?: number
          completed?: boolean
          last_watched_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          video_id?: string
          course_id?: string
          progress_percentage?: number
          completed?: boolean
          last_watched_at?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}