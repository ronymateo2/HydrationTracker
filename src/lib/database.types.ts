export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      beverage_logs: {
        Row: {
          id: string;
          user_id: string;
          beverage_type: string;
          amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          beverage_type: string;
          amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          beverage_type?: string;
          amount?: number;
          created_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          age: number | null;
          gender: string | null;
          weight: number | null;
          activity_level: string | null;
          daily_goal: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          age?: number | null;
          gender?: string | null;
          weight?: number | null;
          activity_level?: string | null;
          daily_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          age?: number | null;
          gender?: string | null;
          weight?: number | null;
          activity_level?: string | null;
          daily_goal?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
