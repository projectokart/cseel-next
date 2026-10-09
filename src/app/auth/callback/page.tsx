'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, ShieldCheck } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [status, setStatus] = useState('Verifying your credentials...');

  useEffect(() => {
    let isMounted = true;

    const completeAuth = async () => {
      try {
        // PKCE flow: Supabase returns ?code= in URL — must exchange for session
        const code = searchParams.get('code');
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle error from OAuth provider
        if (errorParam) {
          if (isMounted) setErrorMsg(errorDescription || errorParam);
          return;
        }

        const routeAfterAuth = async (userId: string, targetNext: string) => {
          try {
            const { data: profile } = await (supabase as any)
              .from('profiles')
              .select('is_onboarded')
              .eq('user_id', userId)
              .maybeSingle();

            if (!profile || profile.is_onboarded === false) {
              router.replace(`/onboarding?next=${encodeURIComponent(targetNext)}`);
            } else {
              router.replace(targetNext);
            }
          } catch (e) {
            router.replace(targetNext);
          }
        };

        if (code) {
          if (isMounted) setStatus('Completing sign-in...');
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            if (isMounted) setErrorMsg(error.message);
            return;
          }
          if (data.session && isMounted) {
            const next = searchParams.get('next') || searchParams.get('redirectTo') || '/schools';
            await routeAfterAuth(data.session.user.id, next);
            return;
          }
        }

        // Fallback: check if session already exists (implicit flow / email magic link)
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          if (isMounted) setErrorMsg(sessionError.message);
          return;
        }

        if (session) {
          const next = searchParams.get('next') || searchParams.get('redirectTo') || '/schools';
          if (isMounted) await routeAfterAuth(session.user.id, next);
          return;
        }

        // Listen for auth state change (hash-based implicit flow)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && newSession && isMounted) {
            subscription.unsubscribe();
            const next = searchParams.get('next') || searchParams.get('redirectTo') || '/schools';
            await routeAfterAuth(newSession.user.id, next);
          }
        });

        // Timeout fallback — if nothing resolves in 8s, go to login
        const timer = setTimeout(() => {
          if (isMounted) {
            setErrorMsg('Authentication timed out. Please try again.');
          }
        }, 8000);

        return () => {
          clearTimeout(timer);
          subscription.unsubscribe();
        };
      } catch (err: any) {
        if (isMounted) setErrorMsg(err?.message || 'Authentication failed. Please try again.');
      }
    };

    completeAuth();

    return () => {
      isMounted = false;
    };
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/40 p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-xl border border-slate-100 text-center space-y-4">
        {errorMsg ? (
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Authentication Error</h2>
            <p className="text-xs text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">{errorMsg}</p>
            <button
              onClick={() => router.replace('/login')}
              className="px-5 py-2.5 rounded-xl bg-[#005689] text-white font-bold text-xs hover:bg-[#003c6e] transition-colors"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4 py-6">
            {/* CSEEL Logo */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#005689] flex items-center justify-center">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="text-lg font-black text-[#005689] tracking-tight">CSEEL</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#005689] flex items-center justify-center mx-auto border border-blue-100">
              <Loader2 className="w-8 h-8 animate-spin text-[#005689]" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">{status}</h2>
            <p className="text-xs text-slate-500">
              Securely signing you in with Google. You'll be redirected shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
