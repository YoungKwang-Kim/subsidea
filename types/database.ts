export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  public: {
    Tables: {
      consent_history: {
        Row: {
          agreed_at: string;
          consent_type: string;
          id: number;
          policy_version: string;
          user_id: string;
        };
        Insert: {
          agreed_at?: string;
          consent_type: string;
          id?: never;
          policy_version: string;
          user_id: string;
        };
        Update: {
          agreed_at?: string;
          consent_type?: string;
          id?: never;
          policy_version?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      eligibility_profiles: {
        Row: {
          age_group: string | null;
          consented_at: string | null;
          created_at: string;
          housing: string | null;
          income: string | null;
          interests: string[];
          profile_version: number;
          residence_sido: string | null;
          situations: string[];
          updated_at: string;
          user_id: string;
        };
        Insert: {
          age_group?: string | null;
          consented_at?: string | null;
          created_at?: string;
          housing?: string | null;
          income?: string | null;
          interests?: string[];
          profile_version?: number;
          residence_sido?: string | null;
          situations?: string[];
          updated_at?: string;
          user_id: string;
        };
        Update: {
          age_group?: string | null;
          consented_at?: string | null;
          created_at?: string;
          housing?: string | null;
          income?: string | null;
          interests?: string[];
          profile_version?: number;
          residence_sido?: string | null;
          situations?: string[];
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          display_name: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          display_name?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          avatar_url?: string | null;
          display_name?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      saved_grants: {
        Row: {
          created_at: string;
          grant_slug: string;
          status: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          grant_slug: string;
          status?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          grant_slug?: string;
          status?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
