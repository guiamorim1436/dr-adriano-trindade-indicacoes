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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      cliques_link: {
        Row: {
          created_at: string
          id: string
          indicador_id: string
          user_agent: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          indicador_id: string
          user_agent?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          indicador_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cliques_link_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_kommo: {
        Row: {
          bearer_token: string | null
          id: number
          logo_url: string | null
          nome_plataforma: string | null
          pipeline_id: number | null
          stage_id: number | null
          subdomain: string | null
          updated_at: string
          whatsapp_clinica: string | null
          whatsapp_mensagem: string | null
        }
        Insert: {
          bearer_token?: string | null
          id?: number
          logo_url?: string | null
          nome_plataforma?: string | null
          pipeline_id?: number | null
          stage_id?: number | null
          subdomain?: string | null
          updated_at?: string
          whatsapp_clinica?: string | null
          whatsapp_mensagem?: string | null
        }
        Update: {
          bearer_token?: string | null
          id?: number
          logo_url?: string | null
          nome_plataforma?: string | null
          pipeline_id?: number | null
          stage_id?: number | null
          subdomain?: string | null
          updated_at?: string
          whatsapp_clinica?: string | null
          whatsapp_mensagem?: string | null
        }
        Relationships: []
      }
      indicacoes: {
        Row: {
          created_at: string
          id: string
          indicador_id: string
          kommo_contact_id: number | null
          kommo_lead_id: number | null
          kommo_status: string | null
          kommo_updated_at: string | null
          nome_indicado: string
          observacao: string | null
          status: Database["public"]["Enums"]["indicacao_status"]
          telefone_indicado: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          indicador_id: string
          kommo_contact_id?: number | null
          kommo_lead_id?: number | null
          kommo_status?: string | null
          kommo_updated_at?: string | null
          nome_indicado: string
          observacao?: string | null
          status?: Database["public"]["Enums"]["indicacao_status"]
          telefone_indicado: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          indicador_id?: string
          kommo_contact_id?: number | null
          kommo_lead_id?: number | null
          kommo_status?: string | null
          kommo_updated_at?: string | null
          nome_indicado?: string
          observacao?: string | null
          status?: Database["public"]["Enums"]["indicacao_status"]
          telefone_indicado?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "indicacoes_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      indicadores: {
        Row: {
          codigo_indicacao: string
          created_at: string
          id: string
          magic_token: string
          nome: string
          telefone: string
        }
        Insert: {
          codigo_indicacao: string
          created_at?: string
          id?: string
          magic_token: string
          nome: string
          telefone: string
        }
        Update: {
          codigo_indicacao?: string
          created_at?: string
          id?: string
          magic_token?: string
          nome?: string
          telefone?: string
        }
        Relationships: []
      }
      premios: {
        Row: {
          comentario: string | null
          created_at: string | null
          id: string
          indicador_id: string
          pontos_consumidos: number
        }
        Insert: {
          comentario?: string | null
          created_at?: string | null
          id?: string
          indicador_id: string
          pontos_consumidos: number
        }
        Update: {
          comentario?: string | null
          created_at?: string | null
          id?: string
          indicador_id?: string
          pontos_consumidos?: number
        }
        Relationships: [
          {
            foreignKeyName: "premios_indicador_id_fkey"
            columns: ["indicador_id"]
            isOneToOne: false
            referencedRelation: "indicadores"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
      indicacao_status:
        | "recebido"
        | "em_contato"
        | "compareceu"
        | "convertido"
        | "encerrado"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin"],
      indicacao_status: [
        "recebido",
        "em_contato",
        "compareceu",
        "convertido",
        "encerrado",
      ],
    },
  },
} as const
