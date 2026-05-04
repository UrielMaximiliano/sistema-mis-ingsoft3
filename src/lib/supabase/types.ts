export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Enums: {
      movement_type: "income" | "expense";
      user_role: "admin" | "treasury" | "operator";
    };
    Tables: {
      categories: {
        Row: {
          description: string | null;
          id: string;
          name: string;
          type: Database["public"]["Enums"]["movement_type"];
        };
        Insert: {
          description?: string | null;
          id?: string;
          name: string;
          type: Database["public"]["Enums"]["movement_type"];
        };
        Update: {
          description?: string | null;
          id?: string;
          name?: string;
          type?: Database["public"]["Enums"]["movement_type"];
        };
        Relationships: [];
      };
      channels: {
        Row: {
          id: string;
          name: "Mayorista" | "Minorista";
        };
        Insert: {
          id?: string;
          name: "Mayorista" | "Minorista";
        };
        Update: {
          id?: string;
          name?: "Mayorista" | "Minorista";
        };
        Relationships: [];
      };
      movements: {
        Row: {
          amount: number;
          category_id: string;
          channel_id: string;
          created_at: string;
          date: string;
          id: string;
          is_projected: boolean;
          type: Database["public"]["Enums"]["movement_type"];
        };
        Insert: {
          amount: number;
          category_id: string;
          channel_id: string;
          created_at?: string;
          date: string;
          id?: string;
          is_projected?: boolean;
          type: Database["public"]["Enums"]["movement_type"];
        };
        Update: {
          amount?: number;
          category_id?: string;
          channel_id?: string;
          created_at?: string;
          date?: string;
          id?: string;
          is_projected?: boolean;
          type?: Database["public"]["Enums"]["movement_type"];
        };
        Relationships: [
          {
            foreignKeyName: "movements_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "movements_channel_id_fkey";
            columns: ["channel_id"];
            isOneToOne: false;
            referencedRelation: "channels";
            referencedColumns: ["id"];
          },
        ];
      };
      period_locks: {
        Row: {
          created_at: string;
          created_by: string | null;
          id: string;
          reason: string | null;
          week_start: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          reason?: string | null;
          week_start: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          id?: string;
          reason?: string | null;
          week_start?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          full_name: string | null;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          full_name?: string | null;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          full_name?: string | null;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_user_role: {
        Args: Record<PropertyKey, never>;
        Returns: Database["public"]["Enums"]["user_role"];
      };
      is_period_locked: {
        Args: { movement_date: string };
        Returns: boolean;
      };
    };
  };
};

export type UserRole = Database["public"]["Enums"]["user_role"];
