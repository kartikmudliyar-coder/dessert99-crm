// src/types/supabase.ts
export interface Customer {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  visits: number;
  created_at: string;
}

export interface Order {
  id: string;
  franchise_id?: string | null;
  customer_id?: string | null;
  customer_name?: string | null;
  item: string;
  qty: number;
  price: number;
  status: string;
  created_by?: string | null;
  created_at: string;
}
