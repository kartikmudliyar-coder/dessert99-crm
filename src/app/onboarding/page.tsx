// src/app/onboarding/page.tsx
import { createSupabaseServerClient } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import OnboardingForm from './OnboardingForm';

export default async function OnboardingPage() {
  const supabase = createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'owner') redirect('/dashboard');

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-semibold mb-4">Owner Onboarding</h1>
        <OnboardingForm />
      </div>
    </div>
  );
}


