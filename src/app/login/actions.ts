// src/app/login/actions.ts
import { supabaseServerClient } from '@/lib/supabaseServer';

export async function loginAction(formData: FormData) {
  'use server';
  const email = formData.get('email')?.toString();
  if (!email) throw new Error('Email is required');

  const supabase = await supabaseServerClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
  });

  if (error) throw new Error(error.message);
  return { ok: true };
}
