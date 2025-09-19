import type { Database } from '@/lib/database.types'

export type { Database }  // 👈 re-export Database here

// Export row types for each table
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Order   = Database['public']['Tables']['orders']['Row']
export type Product = Database['public']['Tables']['products']['Row']
