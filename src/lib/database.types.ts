// src/lib/database.types.ts
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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          role: string
          brand_id: string | null
          franchise_id: string | null
          phone: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          full_name?: string | null
          role?: string
          brand_id?: string | null
          franchise_id?: string | null
          phone?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          role?: string
          brand_id?: string | null
          franchise_id?: string | null
          phone?: string | null
          created_at?: string | null
        }
      }
      orders: {
        Row: { /* your schema */ }
        Insert: { /* your schema */ }
        Update: { /* your schema */ }
      }
      products: {
        Row: { /* your schema */ }
        Insert: { /* your schema */ }
        Update: { /* your schema */ }
      }
    }
  }
}
