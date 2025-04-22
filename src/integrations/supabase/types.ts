export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      grid_assets: {
        Row: {
          annual_production_kwh: number | null
          asset_type: Database["public"]["Enums"]["asset_type_enum"]
          id: string
          install_year: number
          installation_date: string | null
          latitude: number
          longitude: number
          metadata: Json | null
          palmetto_id: string | null
          parent_asset_id: string | null
          system_size_kw: number | null
          system_type: string | null
        }
        Insert: {
          annual_production_kwh?: number | null
          asset_type: Database["public"]["Enums"]["asset_type_enum"]
          id?: string
          install_year: number
          installation_date?: string | null
          latitude: number
          longitude: number
          metadata?: Json | null
          palmetto_id?: string | null
          parent_asset_id?: string | null
          system_size_kw?: number | null
          system_type?: string | null
        }
        Update: {
          annual_production_kwh?: number | null
          asset_type?: Database["public"]["Enums"]["asset_type_enum"]
          id?: string
          install_year?: number
          installation_date?: string | null
          latitude?: number
          longitude?: number
          metadata?: Json | null
          palmetto_id?: string | null
          parent_asset_id?: string | null
          system_size_kw?: number | null
          system_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "grid_assets_parent_asset_id_fkey"
            columns: ["parent_asset_id"]
            isOneToOne: false
            referencedRelation: "grid_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      house_connections: {
        Row: {
          distance_miles: number
          house_id: string
          id: string
          substation_id: string
        }
        Insert: {
          distance_miles: number
          house_id: string
          id?: string
          substation_id: string
        }
        Update: {
          distance_miles?: number
          house_id?: string
          id?: string
          substation_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "house_connections_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: true
            referencedRelation: "palmetto_houses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "house_connections_substation_id_fkey"
            columns: ["substation_id"]
            isOneToOne: false
            referencedRelation: "substations"
            referencedColumns: ["id"]
          },
        ]
      }
      palmetto_houses: {
        Row: {
          annual_production_kwh: number | null
          city: string | null
          id: string
          install_date: string | null
          latitude: number
          longitude: number
          palmetto_system_id: string
          state: string | null
          system_size_kw: number | null
          system_type: string | null
        }
        Insert: {
          annual_production_kwh?: number | null
          city?: string | null
          id?: string
          install_date?: string | null
          latitude: number
          longitude: number
          palmetto_system_id: string
          state?: string | null
          system_size_kw?: number | null
          system_type?: string | null
        }
        Update: {
          annual_production_kwh?: number | null
          city?: string | null
          id?: string
          install_date?: string | null
          latitude?: number
          longitude?: number
          palmetto_system_id?: string
          state?: string | null
          system_size_kw?: number | null
          system_type?: string | null
        }
        Relationships: []
      }
      pg_e_substations: {
        Row: {
          division: string | null
          existing_distributed_generation_kw: number | null
          last_update_on_map: string | null
          minimum_voltage_kv: number | null
          number_of_banks: number | null
          objectid: number
          publish: number | null
          queued_distributed_generation_kw: number | null
          redacted_data: string | null
          substation_id: number | null
          substation_name: string | null
          total_distributed_generation_kw: number | null
          ungrounded_banks: string | null
          x: number | null
          y: number | null
        }
        Insert: {
          division?: string | null
          existing_distributed_generation_kw?: number | null
          last_update_on_map?: string | null
          minimum_voltage_kv?: number | null
          number_of_banks?: number | null
          objectid: number
          publish?: number | null
          queued_distributed_generation_kw?: number | null
          redacted_data?: string | null
          substation_id?: number | null
          substation_name?: string | null
          total_distributed_generation_kw?: number | null
          ungrounded_banks?: string | null
          x?: number | null
          y?: number | null
        }
        Update: {
          division?: string | null
          existing_distributed_generation_kw?: number | null
          last_update_on_map?: string | null
          minimum_voltage_kv?: number | null
          number_of_banks?: number | null
          objectid?: number
          publish?: number | null
          queued_distributed_generation_kw?: number | null
          redacted_data?: string | null
          substation_id?: number | null
          substation_name?: string | null
          total_distributed_generation_kw?: number | null
          ungrounded_banks?: string | null
          x?: number | null
          y?: number | null
        }
        Relationships: []
      }
      "pg&e_distribution": {
        Row: {
          "Agricultural Customer Count": number | null
          "Commercial Customer Count": number | null
          Division: string | null
          "Existing Distributed Generation (kW)": number | null
          "Feeder ID": number | null
          "Feeder Name": string | null
          "Industrial Customer Count": number | null
          "Last Update on Map": string | null
          "Nominal Voltage (kV)": string | null
          OBJECTID: number
          "Other Customers": number | null
          Publish: number | null
          "Queued Distributed Generation (kW)": number | null
          "Redacted Data": string | null
          "Residential Customer Count": number | null
          Shape__Length: number | null
          "Substation Name": string | null
          "Total Distributed Generation (kW)": number | null
          Voltage: number | null
        }
        Insert: {
          "Agricultural Customer Count"?: number | null
          "Commercial Customer Count"?: number | null
          Division?: string | null
          "Existing Distributed Generation (kW)"?: number | null
          "Feeder ID"?: number | null
          "Feeder Name"?: string | null
          "Industrial Customer Count"?: number | null
          "Last Update on Map"?: string | null
          "Nominal Voltage (kV)"?: string | null
          OBJECTID: number
          "Other Customers"?: number | null
          Publish?: number | null
          "Queued Distributed Generation (kW)"?: number | null
          "Redacted Data"?: string | null
          "Residential Customer Count"?: number | null
          Shape__Length?: number | null
          "Substation Name"?: string | null
          "Total Distributed Generation (kW)"?: number | null
          Voltage?: number | null
        }
        Update: {
          "Agricultural Customer Count"?: number | null
          "Commercial Customer Count"?: number | null
          Division?: string | null
          "Existing Distributed Generation (kW)"?: number | null
          "Feeder ID"?: number | null
          "Feeder Name"?: string | null
          "Industrial Customer Count"?: number | null
          "Last Update on Map"?: string | null
          "Nominal Voltage (kV)"?: string | null
          OBJECTID?: number
          "Other Customers"?: number | null
          Publish?: number | null
          "Queued Distributed Generation (kW)"?: number | null
          "Redacted Data"?: string | null
          "Residential Customer Count"?: number | null
          Shape__Length?: number | null
          "Substation Name"?: string | null
          "Total Distributed Generation (kW)"?: number | null
          Voltage?: number | null
        }
        Relationships: []
      }
      substations: {
        Row: {
          capacity_kw: number
          current_load_kw: number | null
          id: string
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          capacity_kw: number
          current_load_kw?: number | null
          id?: string
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          capacity_kw?: number
          current_load_kw?: number | null
          id?: string
          latitude?: number
          longitude?: number
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_palmetto_houses_sf: {
        Args: Record<PropertyKey, never>
        Returns: {
          annual_production_kwh: number | null
          city: string | null
          id: string
          install_date: string | null
          latitude: number
          longitude: number
          palmetto_system_id: string
          state: string | null
          system_size_kw: number | null
          system_type: string | null
        }[]
      }
    }
    Enums: {
      asset_type_enum: "substation" | "house"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      asset_type_enum: ["substation", "house"],
    },
  },
} as const
