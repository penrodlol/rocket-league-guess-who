export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      guess_who_game_guesses: {
        Row: {
          correct: boolean | null
          created_at: string
          game_id: string
          game_player_id: string
          guessed_game_role_id: string
          id: string
          target_game_player_id: string
        }
        Insert: {
          correct?: boolean | null
          created_at?: string
          game_id: string
          game_player_id: string
          guessed_game_role_id: string
          id?: string
          target_game_player_id: string
        }
        Update: {
          correct?: boolean | null
          created_at?: string
          game_id?: string
          game_player_id?: string
          guessed_game_role_id?: string
          id?: string
          target_game_player_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guess_who_game_guesses_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "guess_who_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guess_who_game_guesses_game_player_id_fkey"
            columns: ["game_player_id"]
            isOneToOne: false
            referencedRelation: "guess_who_game_players"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guess_who_game_guesses_guessed_game_role_id_fkey"
            columns: ["guessed_game_role_id"]
            isOneToOne: false
            referencedRelation: "guess_who_game_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guess_who_game_guesses_target_game_player_id_fkey"
            columns: ["target_game_player_id"]
            isOneToOne: false
            referencedRelation: "guess_who_game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      guess_who_game_players: {
        Row: {
          avatar_url: string
          car_image: string | null
          completed: boolean | null
          created_at: string
          game_id: string
          game_role_id: string | null
          hosting: boolean | null
          id: string
          score: number
          user_id: string
          user_name: string
        }
        Insert: {
          avatar_url: string
          car_image?: string | null
          completed?: boolean | null
          created_at?: string
          game_id: string
          game_role_id?: string | null
          hosting?: boolean | null
          id?: string
          score?: number
          user_id: string
          user_name: string
        }
        Update: {
          avatar_url?: string
          car_image?: string | null
          completed?: boolean | null
          created_at?: string
          game_id?: string
          game_role_id?: string | null
          hosting?: boolean | null
          id?: string
          score?: number
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "guess_who_game_players_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "guess_who_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guess_who_game_players_game_role_id_fkey"
            columns: ["game_role_id"]
            isOneToOne: false
            referencedRelation: "guess_who_game_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      guess_who_game_roles: {
        Row: {
          created_at: string
          game_id: string
          id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          game_id: string
          id?: string
          role_id: string
        }
        Update: {
          created_at?: string
          game_id?: string
          id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "guess_who_game_roles_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "guess_who_games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guess_who_game_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "guess_who_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      guess_who_games: {
        Row: {
          completed: boolean
          created_at: string
          discord_instance_id: string
          id: string
          score_to_win: number
        }
        Insert: {
          completed?: boolean
          created_at?: string
          discord_instance_id: string
          id?: string
          score_to_win?: number
        }
        Update: {
          completed?: boolean
          created_at?: string
          discord_instance_id?: string
          id?: string
          score_to_win?: number
        }
        Relationships: []
      }
      guess_who_roles: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          special: boolean
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          name: string
          special?: boolean
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          special?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      guess_who_choose_random_unused_car_debug: {
        Args: { target_game_id: string }
        Returns: string
      }
      guess_who_game_choose_player_cars_fn_internal: {
        Args: { p_count: number; p_target_game_id: string }
        Returns: string[]
      }
      guess_who_game_create_fn: {
        Args: {
          p_discord_instance_id: string
          p_hosting: boolean
          p_players: Database["public"]["CompositeTypes"]["guess_who_game_create_fn_player_prop"][]
          p_roles: string[]
        }
        Returns: undefined
      }
      guess_who_game_player_special_role_handler_fn: {
        Args: { p_game_id: string; p_role_id: string }
        Returns: undefined
      }
      guess_who_game_player_submit_guesses_fn: {
        Args: {
          p_completed: boolean
          p_game_id: string
          p_guesses: Database["public"]["CompositeTypes"]["guess_who_game_player_submit_guesses_fn_player_prop"][]
          p_player_id: string
        }
        Returns: undefined
      }
      guess_who_game_player_submit_role_fn: {
        Args: { p_game_role_id: string; p_id: string }
        Returns: undefined
      }
      guess_who_game_submit_next_round_fn: {
        Args: { p_game_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      guess_who_game_create_fn_player_prop: {
        user_id: string | null
        user_name: string | null
        avatar_url: string | null
      }
      guess_who_game_player_submit_guesses_fn_player_prop: {
        player_id: string | null
        role_id: string | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
