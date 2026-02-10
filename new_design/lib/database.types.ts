export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  app: {
    Tables: {
      ai_requests: {
        Row: {
          created_at: string | null
          error_message: string | null
          feature: string
          id: string
          input_tokens: number | null
          latency_ms: number | null
          model: string | null
          output_tokens: number | null
          provider: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          feature: string
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          model?: string | null
          output_tokens?: number | null
          provider: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          feature?: string
          id?: string
          input_tokens?: number | null
          latency_ms?: number | null
          model?: string | null
          output_tokens?: number | null
          provider?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ai_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_category: string | null
          event_data: Json | null
          event_name: string
          id: string
          ip_address: unknown
          page_url: string | null
          referrer: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_category?: string | null
          event_data?: Json | null
          event_name: string
          id?: string
          ip_address?: unknown
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_category?: string | null
          event_data?: Json | null
          event_name?: string
          id?: string
          ip_address?: unknown
          page_url?: string | null
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          action_category: string | null
          changes: Json | null
          created_at: string | null
          details: Json | null
          entity_id: string | null
          entity_type: string | null
          error_message: string | null
          id: number
          ip_address: unknown
          request_id: string | null
          status: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
          user_role: string | null
        }
        Insert: {
          action: string
          action_category?: string | null
          changes?: Json | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: number
          ip_address?: unknown
          request_id?: string | null
          status?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Update: {
          action?: string
          action_category?: string | null
          changes?: Json | null
          created_at?: string | null
          details?: Json | null
          entity_id?: string | null
          entity_type?: string | null
          error_message?: string | null
          id?: number
          ip_address?: unknown
          request_id?: string | null
          status?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
          user_role?: string | null
        }
        Relationships: []
      }
      banners: {
        Row: {
          action_text_en: string | null
          action_text_es: string | null
          action_text_fr: string | null
          action_text_ua: string | null
          action_url: string | null
          bg_color: string | null
          code: string
          created_at: string | null
          ends_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_dismissible: boolean | null
          message_en: string | null
          message_es: string | null
          message_fr: string | null
          message_ua: string | null
          position: string
          priority: number | null
          starts_at: string | null
          target_audience: string | null
          text_color: string | null
          title_en: string
          title_es: string | null
          title_fr: string | null
          title_ua: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          action_text_en?: string | null
          action_text_es?: string | null
          action_text_fr?: string | null
          action_text_ua?: string | null
          action_url?: string | null
          bg_color?: string | null
          code: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_dismissible?: boolean | null
          message_en?: string | null
          message_es?: string | null
          message_fr?: string | null
          message_ua?: string | null
          position?: string
          priority?: number | null
          starts_at?: string | null
          target_audience?: string | null
          text_color?: string | null
          title_en: string
          title_es?: string | null
          title_fr?: string | null
          title_ua?: string | null
          type?: string
          updated_at?: string | null
        }
        Update: {
          action_text_en?: string | null
          action_text_es?: string | null
          action_text_fr?: string | null
          action_text_ua?: string | null
          action_url?: string | null
          bg_color?: string | null
          code?: string
          created_at?: string | null
          ends_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_dismissible?: boolean | null
          message_en?: string | null
          message_es?: string | null
          message_fr?: string | null
          message_ua?: string | null
          position?: string
          priority?: number | null
          starts_at?: string | null
          target_audience?: string | null
          text_color?: string | null
          title_en?: string
          title_es?: string | null
          title_fr?: string | null
          title_ua?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      billing_events: {
        Row: {
          amount_cents: number | null
          created_at: string | null
          currency: string | null
          event_data: Json
          id: string
          payment_method_type: string | null
          processed_at: string | null
          processing_error: string | null
          processing_result: Json | null
          provider: string | null
          retry_count: number | null
          status: string | null
          stripe_api_version: string | null
          stripe_event_id: string
          stripe_event_type: string
          subscription_id: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents?: number | null
          created_at?: string | null
          currency?: string | null
          event_data: Json
          id?: string
          payment_method_type?: string | null
          processed_at?: string | null
          processing_error?: string | null
          processing_result?: Json | null
          provider?: string | null
          retry_count?: number | null
          status?: string | null
          stripe_api_version?: string | null
          stripe_event_id: string
          stripe_event_type: string
          subscription_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number | null
          created_at?: string | null
          currency?: string | null
          event_data?: Json
          id?: string
          payment_method_type?: string | null
          processed_at?: string | null
          processing_error?: string | null
          processing_result?: Json | null
          provider?: string | null
          retry_count?: number | null
          status?: string | null
          stripe_api_version?: string | null
          stripe_event_id?: string
          stripe_event_type?: string
          subscription_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "billing_events_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "billing_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "billing_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      community_pet_foods: {
        Row: {
          brand: string | null
          calories_per_100g: number | null
          created_at: string | null
          food_type: string
          id: string
          ingredients: string | null
          moderated_at: string | null
          moderated_by_user_id: string | null
          moderation_status: string | null
          name: string
          nutrients: Json
          rejection_reason: string | null
          serving_size_g: number | null
          submitted_by_user_id: string | null
          target_species: string
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          calories_per_100g?: number | null
          created_at?: string | null
          food_type: string
          id?: string
          ingredients?: string | null
          moderated_at?: string | null
          moderated_by_user_id?: string | null
          moderation_status?: string | null
          name: string
          nutrients?: Json
          rejection_reason?: string | null
          serving_size_g?: number | null
          submitted_by_user_id?: string | null
          target_species: string
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          calories_per_100g?: number | null
          created_at?: string | null
          food_type?: string
          id?: string
          ingredients?: string | null
          moderated_at?: string | null
          moderated_by_user_id?: string | null
          moderation_status?: string | null
          name?: string
          nutrients?: Json
          rejection_reason?: string | null
          serving_size_g?: number | null
          submitted_by_user_id?: string | null
          target_species?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_pet_foods_moderated_by_user_id_fkey"
            columns: ["moderated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_pet_foods_moderated_by_user_id_fkey"
            columns: ["moderated_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_pet_foods_moderated_by_user_id_fkey"
            columns: ["moderated_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_pet_foods_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "community_pet_foods_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "community_pet_foods_submitted_by_user_id_fkey"
            columns: ["submitted_by_user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      country_access: {
        Row: {
          country_code: string
          country_name: string
          currency: string | null
          is_allowed: boolean | null
          sort_order: number | null
          updated_at: string | null
          vat_rate: number | null
        }
        Insert: {
          country_code: string
          country_name: string
          currency?: string | null
          is_allowed?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
          vat_rate?: number | null
        }
        Update: {
          country_code?: string
          country_name?: string
          currency?: string | null
          is_allowed?: boolean | null
          sort_order?: number | null
          updated_at?: string | null
          vat_rate?: number | null
        }
        Relationships: []
      }
      delete_requests: {
        Row: {
          completed_at: string | null
          created_at: string | null
          expires_at: string
          household_id: string
          id: string
          status: string | null
          transfer_to_user_id: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          expires_at: string
          household_id: string
          id?: string
          status?: string | null
          transfer_to_user_id?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          expires_at?: string
          household_id?: string
          id?: string
          status?: string | null
          transfer_to_user_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delete_requests_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delete_requests_transfer_to_user_id_fkey"
            columns: ["transfer_to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delete_requests_transfer_to_user_id_fkey"
            columns: ["transfer_to_user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "delete_requests_transfer_to_user_id_fkey"
            columns: ["transfer_to_user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "delete_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delete_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "delete_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      device_tokens: {
        Row: {
          app_version: string | null
          created_at: string | null
          device_model: string | null
          device_name: string | null
          failed_count: number | null
          id: string
          is_active: boolean | null
          last_used_at: string | null
          os_version: string | null
          platform: string
          token: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          app_version?: string | null
          created_at?: string | null
          device_model?: string | null
          device_name?: string | null
          failed_count?: number | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          os_version?: string | null
          platform: string
          token: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          app_version?: string | null
          created_at?: string | null
          device_model?: string | null
          device_name?: string | null
          failed_count?: number | null
          id?: string
          is_active?: boolean | null
          last_used_at?: string | null
          os_version?: string | null
          platform?: string
          token?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "device_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "device_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "device_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      email_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "email_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      error_messages: {
        Row: {
          created_at: string | null
          error_code: string
          id: number
          lang: string
          message: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          error_code: string
          id?: number
          lang: string
          message: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          error_code?: string
          id?: number
          lang?: string
          message?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feature_access: {
        Row: {
          access_type: string | null
          created_at: string | null
          feature_code: string
          granted_by: string | null
          granted_reason: string | null
          id: string
          is_active: boolean | null
          subscription_id: string | null
          updated_at: string | null
          usage_count: number | null
          usage_limit: number | null
          user_id: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          access_type?: string | null
          created_at?: string | null
          feature_code: string
          granted_by?: string | null
          granted_reason?: string | null
          id?: string
          is_active?: boolean | null
          subscription_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          user_id: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          access_type?: string | null
          created_at?: string | null
          feature_code?: string
          granted_by?: string | null
          granted_reason?: string | null
          id?: string
          is_active?: boolean | null
          subscription_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          usage_limit?: number | null
          user_id?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feature_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feature_access_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_access_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feature_access_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "feature_access_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fn_bcs_records: {
        Row: {
          bcs_score: number
          created_at: string | null
          deleted_at: string | null
          id: string
          notes: string | null
          photo_url: string | null
          recorded_at: string | null
          subject_id: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          bcs_score: number
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          recorded_at?: string | null
          subject_id: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          bcs_score?: number
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          notes?: string | null
          photo_url?: string | null
          recorded_at?: string | null
          subject_id?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fn_bcs_records_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_bcs_records_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_active_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_bcs_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_bcs_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fn_bcs_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fn_diet_analyses: {
        Row: {
          created_at: string | null
          deficiencies: Json | null
          excesses: Json | null
          id: string
          input_data: Json
          recipe_id: string | null
          recommendations: Json | null
          score: number | null
          subject_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deficiencies?: Json | null
          excesses?: Json | null
          id?: string
          input_data: Json
          recipe_id?: string | null
          recommendations?: Json | null
          score?: number | null
          subject_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deficiencies?: Json | null
          excesses?: Json | null
          id?: string
          input_data?: Json
          recipe_id?: string | null
          recommendations?: Json | null
          score?: number | null
          subject_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fn_diet_analyses_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_diet_analyses_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "v_active_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_diet_analyses_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_diet_analyses_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_active_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_diet_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_diet_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fn_diet_analyses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fn_food_checks: {
        Row: {
          created_at: string | null
          findings: Json | null
          food_id: string | null
          food_query: string | null
          id: string
          is_safe: boolean | null
          target_code: string
          toxicity_level: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          findings?: Json | null
          food_id?: string | null
          food_query?: string | null
          id?: string
          is_safe?: boolean | null
          target_code: string
          toxicity_level?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          findings?: Json | null
          food_id?: string | null
          food_query?: string | null
          id?: string
          is_safe?: boolean | null
          target_code?: string
          toxicity_level?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fn_food_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_food_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fn_food_checks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fn_generated_recipes: {
        Row: {
          ai_request_id: string | null
          constraints: Json
          created_at: string | null
          id: string
          result: Json
          saved_as_recipe_id: string | null
          subject_id: string | null
          user_id: string
        }
        Insert: {
          ai_request_id?: string | null
          constraints: Json
          created_at?: string | null
          id?: string
          result: Json
          saved_as_recipe_id?: string | null
          subject_id?: string | null
          user_id: string
        }
        Update: {
          ai_request_id?: string | null
          constraints?: Json
          created_at?: string | null
          id?: string
          result?: Json
          saved_as_recipe_id?: string | null
          subject_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fn_generated_recipes_saved_as_recipe_id_fkey"
            columns: ["saved_as_recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_generated_recipes_saved_as_recipe_id_fkey"
            columns: ["saved_as_recipe_id"]
            isOneToOne: false
            referencedRelation: "v_active_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_generated_recipes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_generated_recipes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_active_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_generated_recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_generated_recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fn_generated_recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fn_portions: {
        Row: {
          created_at: string | null
          daily_calories: number | null
          daily_fat_g: number | null
          daily_protein_g: number | null
          id: string
          input_params: Json
          recommendations: Json | null
          subject_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          daily_calories?: number | null
          daily_fat_g?: number | null
          daily_protein_g?: number | null
          id?: string
          input_params: Json
          recommendations?: Json | null
          subject_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          daily_calories?: number | null
          daily_fat_g?: number | null
          daily_protein_g?: number | null
          id?: string
          input_params?: Json
          recommendations?: Json | null
          subject_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fn_portions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_portions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_active_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_portions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fn_portions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fn_portions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      function_usage_logs: {
        Row: {
          cache_expires_at: string | null
          created_at: string | null
          function_code: string
          id: string
          ingredients_count: number | null
          input_hash: string | null
          recipe_id: string | null
          result_cache: Json | null
          user_id: string
        }
        Insert: {
          cache_expires_at?: string | null
          created_at?: string | null
          function_code: string
          id?: string
          ingredients_count?: number | null
          input_hash?: string | null
          recipe_id?: string | null
          result_cache?: Json | null
          user_id: string
        }
        Update: {
          cache_expires_at?: string | null
          created_at?: string | null
          function_code?: string
          id?: string
          ingredients_count?: number | null
          input_hash?: string | null
          recipe_id?: string | null
          result_cache?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "function_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "function_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "function_usage_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      guest_sessions: {
        Row: {
          converted_at: string | null
          converted_to_user_id: string | null
          created_at: string | null
          device_fingerprint: string | null
          expires_at: string | null
          id: string
          ip_address: unknown
          session_id: string
          user_agent: string | null
        }
        Insert: {
          converted_at?: string | null
          converted_to_user_id?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          session_id: string
          user_agent?: string | null
        }
        Update: {
          converted_at?: string | null
          converted_to_user_id?: string | null
          created_at?: string | null
          device_fingerprint?: string | null
          expires_at?: string | null
          id?: string
          ip_address?: unknown
          session_id?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "guest_sessions_converted_to_user_id_fkey"
            columns: ["converted_to_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "guest_sessions_converted_to_user_id_fkey"
            columns: ["converted_to_user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "guest_sessions_converted_to_user_id_fkey"
            columns: ["converted_to_user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      households: {
        Row: {
          country_code: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          max_members_override: number | null
          max_pets_override: number | null
          name: string
          owner_id: string
          stripe_customer_id: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_members_override?: number | null
          max_pets_override?: number | null
          name?: string
          owner_id: string
          stripe_customer_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_members_override?: number | null
          max_pets_override?: number | null
          name?: string
          owner_id?: string
          stripe_customer_id?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "households_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "households_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "households_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invitations: {
        Row: {
          accepted_at: string | null
          created_at: string | null
          email: string
          expires_at: string
          household_id: string
          id: string
          invited_by: string
          role: string
          token: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string | null
          email: string
          expires_at?: string
          household_id: string
          id?: string
          invited_by: string
          role?: string
          token: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          household_id?: string
          id?: string
          invited_by?: string
          role?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "invitations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          external_id: string | null
          id: string
          pdf_url: string | null
          period_end: string | null
          period_start: string | null
          status: string
          subscription_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          external_id?: string | null
          id?: string
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          status: string
          subscription_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          external_id?: string | null
          id?: string
          pdf_url?: string | null
          period_end?: string | null
          period_start?: string | null
          status?: string
          subscription_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      landing_f2_entitlements: {
        Row: {
          auth_user_id: string | null
          created_at: string
          email: string | null
          id: number
          is_unlimited: boolean
          scope: string
          source: string
          stripe_checkout_session_id: string | null
          stripe_payment_intent_id: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_unlimited?: boolean
          scope?: string
          source: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          email?: string | null
          id?: number
          is_unlimited?: boolean
          scope?: string
          source?: string
          stripe_checkout_session_id?: string | null
          stripe_payment_intent_id?: string | null
        }
        Relationships: []
      }
      landing_f2_usage_events: {
        Row: {
          anon_id: string
          auth_user_id: string | null
          country: string | null
          created_at: string
          food_id: string
          id: number
          source: string
          target: string
          toxicity_level: string | null
        }
        Insert: {
          anon_id: string
          auth_user_id?: string | null
          country?: string | null
          created_at?: string
          food_id: string
          id?: number
          source?: string
          target: string
          toxicity_level?: string | null
        }
        Update: {
          anon_id?: string
          auth_user_id?: string | null
          country?: string | null
          created_at?: string
          food_id?: string
          id?: number
          source?: string
          target?: string
          toxicity_level?: string | null
        }
        Relationships: []
      }
      landing_waitlist_leads: {
        Row: {
          auth_user_id: string | null
          country: string | null
          created_at: string
          email: string | null
          id: number
          notes: string | null
          phone: string | null
          provider: string
          ref_code: string | null
          utm_campaign: string | null
          utm_source: string | null
        }
        Insert: {
          auth_user_id?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: number
          notes?: string | null
          phone?: string | null
          provider: string
          ref_code?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Update: {
          auth_user_id?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: number
          notes?: string | null
          phone?: string | null
          provider?: string
          ref_code?: string | null
          utm_campaign?: string | null
          utm_source?: string | null
        }
        Relationships: []
      }
      memberships: {
        Row: {
          household_id: string
          id: string
          invited_by: string | null
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          household_id: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string
          user_id: string
        }
        Update: {
          household_id?: string
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "memberships_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "memberships_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          created_at: string | null
          default_category: string | null
          id: number
          lang: string
          message_template: string | null
          title_template: string
          type: string
        }
        Insert: {
          created_at?: string | null
          default_category?: string | null
          id?: number
          lang: string
          message_template?: string | null
          title_template: string
          type: string
        }
        Update: {
          created_at?: string | null
          default_category?: string | null
          id?: number
          lang?: string
          message_template?: string | null
          title_template?: string
          type?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string | null
          created_at: string | null
          email_sent_at: string | null
          id: string
          is_email_sent: boolean | null
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          email_sent_at?: string | null
          id?: string
          is_email_sent?: boolean | null
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          category?: string | null
          created_at?: string | null
          email_sent_at?: string | null
          id?: string
          is_email_sent?: boolean | null
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      nutrient_queries: {
        Row: {
          ai_request_id: string | null
          created_at: string | null
          id: string
          query_params: Json
          recommendations: Json | null
          subject_id: string | null
          target_code: string
          user_id: string
        }
        Insert: {
          ai_request_id?: string | null
          created_at?: string | null
          id?: string
          query_params: Json
          recommendations?: Json | null
          subject_id?: string | null
          target_code: string
          user_id: string
        }
        Update: {
          ai_request_id?: string | null
          created_at?: string | null
          id?: string
          query_params?: Json
          recommendations?: Json | null
          subject_id?: string | null
          target_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nutrient_queries_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrient_queries_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_active_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrient_queries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nutrient_queries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "nutrient_queries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      password_reset_tokens: {
        Row: {
          created_at: string | null
          expires_at: string
          id: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          id?: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          id?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "password_reset_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pet_recipe_history: {
        Row: {
          confirmed_at: string | null
          confirmed_by: string
          id: string
          notes: string | null
          recipe_id: string
          subject_id: string
        }
        Insert: {
          confirmed_at?: string | null
          confirmed_by: string
          id?: string
          notes?: string | null
          recipe_id: string
          subject_id: string
        }
        Update: {
          confirmed_at?: string | null
          confirmed_by?: string
          id?: string
          notes?: string | null
          recipe_id?: string
          subject_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_recipe_history_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_recipe_history_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pet_recipe_history_confirmed_by_fkey"
            columns: ["confirmed_by"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pet_recipe_history_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_recipe_history_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_active_subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          activity_level: string | null
          allergies: Json | null
          birth_date: string | null
          breed: string | null
          created_at: string | null
          deleted_at: string | null
          dietary_restrictions: Json | null
          health_conditions: Json | null
          id: string
          is_active: boolean | null
          is_default: boolean | null
          is_neutered: boolean | null
          metadata: Json | null
          name: string
          photo_url: string | null
          sex: string | null
          species_code: string
          updated_at: string | null
          user_id: string
          weight_kg: number | null
          weight_updated_at: string | null
        }
        Insert: {
          activity_level?: string | null
          allergies?: Json | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string | null
          deleted_at?: string | null
          dietary_restrictions?: Json | null
          health_conditions?: Json | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_neutered?: boolean | null
          metadata?: Json | null
          name: string
          photo_url?: string | null
          sex?: string | null
          species_code: string
          updated_at?: string | null
          user_id: string
          weight_kg?: number | null
          weight_updated_at?: string | null
        }
        Update: {
          activity_level?: string | null
          allergies?: Json | null
          birth_date?: string | null
          breed?: string | null
          created_at?: string | null
          deleted_at?: string | null
          dietary_restrictions?: Json | null
          health_conditions?: Json | null
          id?: string
          is_active?: boolean | null
          is_default?: boolean | null
          is_neutered?: boolean | null
          metadata?: Json | null
          name?: string
          photo_url?: string | null
          sex?: string | null
          species_code?: string
          updated_at?: string | null
          user_id?: string
          weight_kg?: number | null
          weight_updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      portal_sessions: {
        Row: {
          created_at: string | null
          id: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portal_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portal_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "portal_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          duration_months: number
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          tier: string
          used_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          duration_months: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          tier: string
          used_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          duration_months?: number
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          tier?: string
          used_count?: number | null
        }
        Relationships: []
      }
      promo_redemptions: {
        Row: {
          id: string
          promo_code_id: string
          redeemed_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          promo_code_id: string
          redeemed_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          promo_code_id?: string
          redeemed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_redemptions_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "promo_redemptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      push_log: {
        Row: {
          body: string | null
          created_at: string | null
          data: Json | null
          device_token_id: string | null
          error_message: string | null
          id: string
          sent_at: string | null
          status: string | null
          title: string | null
          user_id: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          device_token_id?: string | null
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string | null
          data?: Json | null
          device_token_id?: string | null
          error_message?: string | null
          id?: string
          sent_at?: string | null
          status?: string | null
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_log_device_token_id_fkey"
            columns: ["device_token_id"]
            isOneToOne: false
            referencedRelation: "device_tokens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "push_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          amount_g: number
          created_at: string | null
          food_id: string
          id: string
          notes: string | null
          recipe_id: string
          sort_order: number | null
        }
        Insert: {
          amount_g: number
          created_at?: string | null
          food_id: string
          id?: string
          notes?: string | null
          recipe_id: string
          sort_order?: number | null
        }
        Update: {
          amount_g?: number
          created_at?: string | null
          food_id?: string
          id?: string
          notes?: string | null
          recipe_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "v_active_recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string
          is_guest: boolean | null
          is_public: boolean | null
          name: string
          nutrients_calculated: Json | null
          servings: number | null
          session_id: string | null
          subject_id: string | null
          tags: Json | null
          target_code: string
          total_calories: number | null
          total_weight_g: number | null
          updated_at: string | null
          user_id: string
          validation_score: number | null
          validation_status: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_guest?: boolean | null
          is_public?: boolean | null
          name: string
          nutrients_calculated?: Json | null
          servings?: number | null
          session_id?: string | null
          subject_id?: string | null
          tags?: Json | null
          target_code: string
          total_calories?: number | null
          total_weight_g?: number | null
          updated_at?: string | null
          user_id: string
          validation_score?: number | null
          validation_status?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          is_guest?: boolean | null
          is_public?: boolean | null
          name?: string
          nutrients_calculated?: Json | null
          servings?: number | null
          session_id?: string | null
          subject_id?: string | null
          tags?: Json | null
          target_code?: string
          total_calories?: number | null
          total_weight_g?: number | null
          updated_at?: string | null
          user_id?: string
          validation_score?: number | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_active_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      refresh_tokens: {
        Row: {
          created_at: string | null
          device_info: string | null
          expires_at: string
          id: string
          revoked_at: string | null
          token_hash: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_info?: string | null
          expires_at: string
          id?: string
          revoked_at?: string | null
          token_hash: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_info?: string | null
          expires_at?: string
          id?: string
          revoked_at?: string | null
          token_hash?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "refresh_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "refresh_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "refresh_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subjects: {
        Row: {
          activity_level: string | null
          age_months_estimate: number | null
          age_source: string | null
          allergies: Json | null
          avatar_url: string | null
          birth_date: string | null
          blacklist: string[] | null
          breed: string | null
          created_at: string | null
          deleted_at: string | null
          dislikes: string[] | null
          favorites: string[] | null
          health_conditions: Json | null
          household_id: string | null
          id: string
          is_guest: boolean | null
          life_stage: string | null
          name: string
          notes: string | null
          session_id: string | null
          target_code: string
          updated_at: string | null
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          age_months_estimate?: number | null
          age_source?: string | null
          allergies?: Json | null
          avatar_url?: string | null
          birth_date?: string | null
          blacklist?: string[] | null
          breed?: string | null
          created_at?: string | null
          deleted_at?: string | null
          dislikes?: string[] | null
          favorites?: string[] | null
          health_conditions?: Json | null
          household_id?: string | null
          id?: string
          is_guest?: boolean | null
          life_stage?: string | null
          name: string
          notes?: string | null
          session_id?: string | null
          target_code: string
          updated_at?: string | null
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          age_months_estimate?: number | null
          age_source?: string | null
          allergies?: Json | null
          avatar_url?: string | null
          birth_date?: string | null
          blacklist?: string[] | null
          breed?: string | null
          created_at?: string | null
          deleted_at?: string | null
          dislikes?: string[] | null
          favorites?: string[] | null
          health_conditions?: Json | null
          household_id?: string | null
          id?: string
          is_guest?: boolean | null
          life_stage?: string | null
          name?: string
          notes?: string | null
          session_id?: string | null
          target_code?: string
          updated_at?: string | null
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "subjects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          external_id: string | null
          features_snapshot: Json | null
          grace_period_end: string | null
          household_id: string | null
          id: string
          is_lifetime: boolean | null
          plan_id: string
          status: string
          tier: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          external_id?: string | null
          features_snapshot?: Json | null
          grace_period_end?: string | null
          household_id?: string | null
          id?: string
          is_lifetime?: boolean | null
          plan_id: string
          status: string
          tier: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          external_id?: string | null
          features_snapshot?: Json | null
          grace_period_end?: string | null
          household_id?: string | null
          id?: string
          is_lifetime?: boolean | null
          plan_id?: string
          status?: string
          tier?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: number
          is_editable: boolean | null
          is_public: boolean | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
          value_type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_editable?: boolean | null
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
          value_type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          is_editable?: boolean | null
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
          value_type?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          external_transaction_id: string | null
          id: string
          idempotency_key: string | null
          metadata: Json | null
          status: string
          subscription_id: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          external_transaction_id?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          status: string
          subscription_id?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          external_transaction_id?: string | null
          id?: string
          idempotency_key?: string | null
          metadata?: Json | null
          status?: string
          subscription_id?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ui_translations: {
        Row: {
          created_at: string | null
          id: number
          key: string
          lang: string
          namespace: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          key: string
          lang: string
          namespace?: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          id?: number
          key?: string
          lang?: string
          namespace?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      user_dismissed_banners: {
        Row: {
          banner_id: string
          dismissed_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          banner_id: string
          dismissed_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          banner_id?: string
          dismissed_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_dismissed_banners_banner_id_fkey"
            columns: ["banner_id"]
            isOneToOne: false
            referencedRelation: "banners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_dismissed_banners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_dismissed_banners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_dismissed_banners_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_pet_foods: {
        Row: {
          brand: string | null
          calories_per_100g: number | null
          created_at: string | null
          food_type: string
          household_id: string
          id: string
          ingredients: string | null
          is_shared: boolean | null
          name: string
          notes: string | null
          nutrients: Json
          serving_size_g: number | null
          target_species: string
          updated_at: string | null
        }
        Insert: {
          brand?: string | null
          calories_per_100g?: number | null
          created_at?: string | null
          food_type: string
          household_id: string
          id?: string
          ingredients?: string | null
          is_shared?: boolean | null
          name: string
          notes?: string | null
          nutrients?: Json
          serving_size_g?: number | null
          target_species: string
          updated_at?: string | null
        }
        Update: {
          brand?: string | null
          calories_per_100g?: number | null
          created_at?: string | null
          food_type?: string
          household_id?: string
          id?: string
          ingredients?: string | null
          is_shared?: boolean | null
          name?: string
          notes?: string | null
          nutrients?: Json
          serving_size_g?: number | null
          target_species?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_pet_foods_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          created_at: string | null
          default_target_code: string | null
          id: string
          measurement_system: string | null
          notifications: Json | null
          ui_settings: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_target_code?: string | null
          id?: string
          measurement_system?: string | null
          notifications?: Json | null
          ui_settings?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_target_code?: string | null
          id?: string
          measurement_system?: string | null
          notifications?: Json | null
          ui_settings?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_products: {
        Row: {
          created_at: string | null
          expires_at: string | null
          household_id: string
          id: string
          product_code: string
          purchased_at: string | null
          stripe_payment_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          household_id: string
          id?: string
          product_code: string
          purchased_at?: string | null
          stripe_payment_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          household_id?: string
          id?: string
          product_code?: string
          purchased_at?: string | null
          stripe_payment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_products_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_products_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          marketing_emails: boolean | null
          preferences: Json | null
          profile_public: boolean | null
          push_notifications: boolean | null
          share_recipes: boolean | null
          theme: string | null
          units_system: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          preferences?: Json | null
          profile_public?: boolean | null
          push_notifications?: boolean | null
          share_recipes?: boolean | null
          theme?: string | null
          units_system?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          marketing_emails?: boolean | null
          preferences?: Json | null
          profile_public?: boolean | null
          push_notifications?: boolean | null
          share_recipes?: boolean | null
          theme?: string | null
          units_system?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_settings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          anonymized_at: string | null
          created_at: string | null
          deleted_at: string | null
          display_name: string | null
          email: string
          email_verified: boolean | null
          external_id: string | null
          id: string
          last_login_at: string | null
          metadata: Json | null
          password_hash: string | null
          preferred_lang: string | null
          role: string | null
          status: string | null
          stripe_customer_id: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          anonymized_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email: string
          email_verified?: boolean | null
          external_id?: string | null
          id?: string
          last_login_at?: string | null
          metadata?: Json | null
          password_hash?: string | null
          preferred_lang?: string | null
          role?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          anonymized_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          display_name?: string | null
          email?: string
          email_verified?: boolean | null
          external_id?: string | null
          id?: string
          last_login_at?: string | null
          metadata?: Json | null
          password_hash?: string | null
          preferred_lang?: string | null
          role?: string | null
          status?: string | null
          stripe_customer_id?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      validation_events: {
        Row: {
          client_type: string | null
          client_version: string | null
          created_at: string | null
          findings: Json
          findings_count: number | null
          id: string
          ip_address: unknown
          lang: string | null
          pet_id: string | null
          processing_time_ms: number | null
          recipe_id: string | null
          recipe_snapshot: Json | null
          rules_checked: number | null
          rules_triggered: number | null
          status: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          client_type?: string | null
          client_version?: string | null
          created_at?: string | null
          findings?: Json
          findings_count?: number | null
          id?: string
          ip_address?: unknown
          lang?: string | null
          pet_id?: string | null
          processing_time_ms?: number | null
          recipe_id?: string | null
          recipe_snapshot?: Json | null
          rules_checked?: number | null
          rules_triggered?: number | null
          status: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          client_type?: string | null
          client_version?: string | null
          created_at?: string | null
          findings?: Json
          findings_count?: number | null
          id?: string
          ip_address?: unknown
          lang?: string | null
          pet_id?: string | null
          processing_time_ms?: number | null
          recipe_id?: string | null
          recipe_snapshot?: Json | null
          rules_checked?: number | null
          rules_triggered?: number | null
          status?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_events_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_events_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_events_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "v_active_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "validation_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      validation_history: {
        Row: {
          created_at: string | null
          findings: Json | null
          id: string
          recipe_id: string | null
          score: number | null
          target_code: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          findings?: Json | null
          id?: string
          recipe_id?: string | null
          score?: number | null
          target_code: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          findings?: Json | null
          id?: string
          recipe_id?: string | null
          score?: number | null
          target_code?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "validation_history_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_history_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "v_active_recipes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "validation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "validation_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      validation_rules: {
        Row: {
          condition: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          message_en: string | null
          message_es: string | null
          message_fr: string | null
          message_ua: string | null
          nutrient_code: string | null
          rule_code: string
          rule_type: string
          severity: string | null
          target_code: string
        }
        Insert: {
          condition: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_en?: string | null
          message_es?: string | null
          message_fr?: string | null
          message_ua?: string | null
          nutrient_code?: string | null
          rule_code: string
          rule_type: string
          severity?: string | null
          target_code: string
        }
        Update: {
          condition?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          message_en?: string | null
          message_es?: string | null
          message_fr?: string | null
          message_ua?: string | null
          nutrient_code?: string | null
          rule_code?: string
          rule_type?: string
          severity?: string | null
          target_code?: string
        }
        Relationships: []
      }
      webhookqueue: {
        Row: {
          attempts: number | null
          billing_event_id: string
          completed_at: string | null
          created_at: string | null
          error_message: string | null
          id: string
          max_attempts: number | null
          next_attempt_at: string | null
          processed_at: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          attempts?: number | null
          billing_event_id: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          next_attempt_at?: string | null
          processed_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          attempts?: number | null
          billing_event_id?: string
          completed_at?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          max_attempts?: number | null
          next_attempt_at?: string | null
          processed_at?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhookqueue_billing_event_id_fkey"
            columns: ["billing_event_id"]
            isOneToOne: false
            referencedRelation: "billing_events"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      v_active_recipes: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          id: string | null
          is_guest: boolean | null
          is_public: boolean | null
          name: string | null
          nutrients_calculated: Json | null
          servings: number | null
          session_id: string | null
          subject_id: string | null
          tags: Json | null
          target_code: string | null
          total_calories: number | null
          total_weight_g: number | null
          updated_at: string | null
          user_id: string | null
          validation_score: number | null
          validation_status: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string | null
          is_guest?: boolean | null
          is_public?: boolean | null
          name?: string | null
          nutrients_calculated?: Json | null
          servings?: number | null
          session_id?: string | null
          subject_id?: string | null
          tags?: Json | null
          target_code?: string | null
          total_calories?: number | null
          total_weight_g?: number | null
          updated_at?: string | null
          user_id?: string | null
          validation_score?: number | null
          validation_status?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string | null
          is_guest?: boolean | null
          is_public?: boolean | null
          name?: string | null
          nutrients_calculated?: Json | null
          servings?: number | null
          session_id?: string | null
          subject_id?: string | null
          tags?: Json | null
          target_code?: string | null
          total_calories?: number | null
          total_weight_g?: number | null
          updated_at?: string | null
          user_id?: string | null
          validation_score?: number | null
          validation_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "v_active_subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "recipes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      v_active_subjects: {
        Row: {
          activity_level: string | null
          age_months_estimate: number | null
          age_source: string | null
          allergies: Json | null
          avatar_url: string | null
          birth_date: string | null
          blacklist: string[] | null
          breed: string | null
          created_at: string | null
          deleted_at: string | null
          dislikes: string[] | null
          favorites: string[] | null
          health_conditions: Json | null
          id: string | null
          is_guest: boolean | null
          life_stage: string | null
          name: string | null
          notes: string | null
          session_id: string | null
          target_code: string | null
          updated_at: string | null
          user_id: string | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          age_months_estimate?: number | null
          age_source?: string | null
          allergies?: Json | null
          avatar_url?: string | null
          birth_date?: string | null
          blacklist?: string[] | null
          breed?: string | null
          created_at?: string | null
          deleted_at?: string | null
          dislikes?: string[] | null
          favorites?: string[] | null
          health_conditions?: Json | null
          id?: string | null
          is_guest?: boolean | null
          life_stage?: string | null
          name?: string | null
          notes?: string | null
          session_id?: string | null
          target_code?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          age_months_estimate?: number | null
          age_source?: string | null
          allergies?: Json | null
          avatar_url?: string | null
          birth_date?: string | null
          blacklist?: string[] | null
          breed?: string | null
          created_at?: string | null
          deleted_at?: string | null
          dislikes?: string[] | null
          favorites?: string[] | null
          health_conditions?: Json | null
          id?: string | null
          is_guest?: boolean | null
          life_stage?: string | null
          name?: string | null
          notes?: string | null
          session_id?: string | null
          target_code?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight_kg?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "subjects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subjects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_cabinet_summary"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "subjects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "v_user_feature_access"
            referencedColumns: ["user_id"]
          },
        ]
      }
      v_admin_dropoff_analysis: {
        Row: {
          dropoff_count: number | null
          dropoff_percentage: number | null
          last_step: string | null
        }
        Relationships: []
      }
      v_admin_funnel_stats: {
        Row: {
          event_category: string | null
          event_count: number | null
          event_date: string | null
          event_name: string | null
          unique_sessions: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      v_admin_stats: {
        Row: {
          active_rules: number | null
          active_subscriptions: number | null
          active_users_24h: number | null
          danger_validations: number | null
          generated_at: string | null
          new_users_7d: number | null
          public_recipes: number | null
          revenue_30d_cents: number | null
          total_ingredients: number | null
          total_pets: number | null
          total_recipes: number | null
          total_toxic_ingredients: number | null
          total_toxicity_records: number | null
          total_users: number | null
          total_validations: number | null
          trial_subscriptions: number | null
          validations_24h: number | null
        }
        Relationships: []
      }
      v_cabinet_summary: {
        Row: {
          current_plan: string | null
          display_name: string | null
          email: string | null
          last_login_at: string | null
          last_validation_at: string | null
          member_since: string | null
          pets_count: number | null
          preferred_lang: string | null
          recipes_count: number | null
          role: string | null
          subscription_expires: string | null
          subscription_status: string | null
          user_id: string | null
          validations_count: number | null
        }
        Relationships: []
      }
      v_ingredients: {
        Row: {
          category: string | null
          id: string | null
          is_toxic: boolean | null
          name_en: string | null
          name_es: string | null
          name_uk: string | null
          source: string | null
          toxicity_level: string | null
          toxicity_reason_en: string | null
          toxicity_reason_es: string | null
          toxicity_reason_uk: string | null
        }
        Insert: {
          category?: string | null
          id?: string | null
          is_toxic?: boolean | null
          name_en?: string | null
          name_es?: string | null
          name_uk?: string | null
          source?: string | null
          toxicity_level?: string | null
          toxicity_reason_en?: string | null
          toxicity_reason_es?: string | null
          toxicity_reason_uk?: string | null
        }
        Update: {
          category?: string | null
          id?: string | null
          is_toxic?: boolean | null
          name_en?: string | null
          name_es?: string | null
          name_uk?: string | null
          source?: string | null
          toxicity_level?: string | null
          toxicity_reason_en?: string | null
          toxicity_reason_es?: string | null
          toxicity_reason_uk?: string | null
        }
        Relationships: []
      }
      v_toxic_foods: {
        Row: {
          food_id: string | null
          food_name_en: string | null
          food_name_es: string | null
          food_name_uk: string | null
          notes: string | null
          recommendation: string | null
          species_code: string | null
          species_name_en: string | null
          species_name_es: string | null
          species_name_uk: string | null
          symptoms_en: string | null
          symptoms_es: string | null
          symptoms_uk: string | null
          toxic_component: string | null
          toxicity_level: string | null
          toxin_name_en: string | null
          toxin_name_es: string | null
          toxin_name_uk: string | null
        }
        Relationships: []
      }
      v_user_feature_access: {
        Row: {
          current_period_end: string | null
          email: string | null
          features: Json | null
          grace_period_end: string | null
          is_lifetime: boolean | null
          limits: Json | null
          subscription_status: string | null
          subscription_tier: string | null
          tier: string | null
          user_id: string | null
          valid_until: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_recipe_nutrients: {
        Args: { p_recipe_id: string }
        Returns: Json
      }
      check_daily_limit: {
        Args: { p_feature: string; p_user_id: string }
        Returns: {
          allowed: boolean
          current_count: number
          limit_value: number
        }[]
      }
      cleanup_expired_tokens: { Args: never; Returns: number }
      current_user_id: { Args: never; Returns: string }
      is_admin: { Args: never; Returns: boolean }
      validate_promo_code: {
        Args: { p_code: string }
        Returns: {
          duration_months: number
          error_message: string
          is_valid: boolean
          promo_id: string
          tier: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  app: {
    Enums: {},
  },
} as const

