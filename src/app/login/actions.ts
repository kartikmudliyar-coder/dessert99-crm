'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();

  if (!email || !password) {
    alert('Email and password are required');
    return;
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert(`Login failed: ${error.message}`);
  } else {
    window.location.href = '/dashboard';
  }
}
