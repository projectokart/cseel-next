'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { auth, googleProvider } from "@/lib/firebase/client";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";

export type AppRole = "teacher" | "student" | "organisation" | "moderator";

interface OrganisationData {
  org_name: string;
  phone?: string;
  address?: string;
  pincode?: string;
  district?: string;
  state?: string;
  country?: string;
}

interface SignUpOptions {
  displayName?: string;
  institutionName?: string;
  organisation?: OrganisationData;
}

export interface UnifiedUser {
  id: string;
  uid: string;
  email: string | null;
  phone?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
    display_name?: string;
    avatar_url?: string;
    picture?: string;
    role?: string;
    is_verified?: boolean;
    phone?: string;
    [key: string]: any;
  };
  app_metadata?: {
    is_verified?: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

interface AuthContextType {
  user: UnifiedUser | null;
  session: any | null;
  roles: AppRole[];
  loading: boolean;
  rolesLoading: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isOrganisation: boolean;
  isVerified: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signInWithGoogle: (redirectTo?: string) => Promise<{ data?: any; error: any }>;
  signUp: (email: string, password: string, role: AppRole, opts?: SignUpOptions) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  verifyUser: (identifier: string) => void;
  unverifyUser: (identifier: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUserToUnified(fbUser: FirebaseUser): UnifiedUser {
  const name = fbUser.displayName || fbUser.email?.split('@')[0] || '';
  return {
    id: fbUser.uid,
    uid: fbUser.uid,
    email: fbUser.email,
    phone: fbUser.phoneNumber || null,
    phoneNumber: fbUser.phoneNumber || null,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
    user_metadata: {
      full_name: name,
      name: name,
      display_name: name,
      avatar_url: fbUser.photoURL || undefined,
      picture: fbUser.photoURL || undefined,
      phone: fbUser.phoneNumber || undefined,
    },
    app_metadata: {},
  };
}

function mapSupabaseUserToUnified(sbUser: any): UnifiedUser {
  return {
    id: sbUser.id,
    uid: sbUser.id,
    email: sbUser.email || null,
    displayName: sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || null,
    photoURL: sbUser.user_metadata?.avatar_url || null,
    user_metadata: sbUser.user_metadata || {},
    app_metadata: sbUser.app_metadata || {},
  };
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]                 = useState<UnifiedUser | null>(null);
  const [session, setSession]           = useState<any | null>(null);
  const [roles, setRoles]               = useState<AppRole[]>([]);
  const [loading, setLoading]           = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  const fetchRoles = async (userId: string) => {
    setRolesLoading(true);
    try {
      // 1. Check local role cache first
      if (typeof window !== 'undefined') {
        try {
          const cachedRole = localStorage.getItem(`cseel_user_role_${userId}`);
          if (cachedRole) {
            setRoles([cachedRole as AppRole]);
            setRolesLoading(false);
          }
        } catch {}
      }

      // 2. Query Supabase roles if available
      const { data, error } = await (supabase as any).from("user_roles")
        .select("role")
        .eq("user_id", userId);
      if (data && !error && data.length > 0) {
        setRoles(data.map((r: any) => r.role as AppRole));
      } else if (roles.length === 0) {
        setRoles(["teacher"]); // Default educator role
      }
    } catch {
      if (roles.length === 0) setRoles(["teacher"]);
    } finally {
      setRolesLoading(false);
    }
  };

  useEffect(() => {
    let unsubscribeFirebase: (() => void) | null = null;

    // Fast resolution: never leave user hanging on loading spinner
    const timer = setTimeout(() => {
      setLoading(false);
      setRolesLoading(false);
    }, 600);

    // 1. Prioritize Firebase Auth if initialized
    if (auth) {
      unsubscribeFirebase = onAuthStateChanged(auth, async (fbUser) => {
        clearTimeout(timer);
        if (fbUser) {
          const mapped = mapFirebaseUserToUnified(fbUser);
          setUser(mapped);
          setSession({ user: mapped, provider: 'firebase' });
          fetchRoles(fbUser.uid);
        } else {
          // If no Firebase user, check existing Supabase session as fallback
          try {
            const { data: { session: sbSession } } = await supabase.auth.getSession();
            if (sbSession?.user) {
              const mappedSb = mapSupabaseUserToUnified(sbSession.user);
              setSession(sbSession);
              setUser(mappedSb);
              fetchRoles(sbSession.user.id);
            } else {
              setUser(null);
              setSession(null);
              setRoles([]);
              setRolesLoading(false);
            }
          } catch {
            setUser(null);
            setSession(null);
          }
        }
        setLoading(false);
      });
    } else {
      // Firebase not configured yet, use Supabase
      supabase.auth.getSession().then(({ data: { session: sbSession } }) => {
        clearTimeout(timer);
        if (sbSession?.user) {
          const mappedSb = mapSupabaseUserToUnified(sbSession.user);
          setSession(sbSession);
          setUser(mappedSb);
          fetchRoles(sbSession.user.id);
        } else {
          setRolesLoading(false);
        }
        setLoading(false);
      }).catch(() => {
        clearTimeout(timer);
        setLoading(false);
        setRolesLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (_event, sbSession) => {
          if (sbSession?.user) {
            const mappedSb = mapSupabaseUserToUnified(sbSession.user);
            setSession(sbSession);
            setUser(mappedSb);
            fetchRoles(sbSession.user.id);
          } else {
            setUser(null);
            setSession(null);
            setRoles([]);
            setRolesLoading(false);
          }
          setLoading(false);
        }
      );

      return () => {
        clearTimeout(timer);
        subscription.unsubscribe();
      };
    }

    return () => {
      clearTimeout(timer);
      if (unsubscribeFirebase) unsubscribeFirebase();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // 1. Try Firebase Auth
    if (auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const mapped = mapFirebaseUserToUnified(res.user);
        setUser(mapped);
        setSession({ user: mapped, provider: 'firebase' });
        fetchRoles(res.user.uid);
        return { error: null };
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] signIn failed, trying Supabase fallback:', fbErr.message);
      }
    }

    // 2. Fallback to Supabase
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (
    email: string,
    password: string,
    role: AppRole,
    opts: SignUpOptions = {}
  ) => {
    const displayName = opts.displayName || (role === "organisation" ? opts.organisation?.org_name : "") || email.split('@')[0];

    // 1. Try Firebase Auth
    if (auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(res.user, { displayName });
        const mapped = mapFirebaseUserToUnified(res.user);
        setUser(mapped);
        setSession({ user: mapped, provider: 'firebase' });
        setRoles([role]);

        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(`cseel_user_role_${res.user.uid}`, role);
          } catch {}
        }
        return { error: null };
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] signUp error:', fbErr);
        return { error: fbErr };
      }
    }

    // 2. Fallback to Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName, role } },
    });

    if (!error && data.user) {
      const userId = data.user.id;
      await new Promise(r => setTimeout(r, 800));
      await (supabase as any).from("user_roles").insert({ user_id: userId, role }).catch(() => {});
    }

    return { error };
  };

  const signInWithGoogle = async (redirectTo?: string) => {
    // 1. Try Firebase Google Popup (Instant, 100% reliable, no callback redirects)
    if (auth) {
      try {
        const res = await signInWithPopup(auth, googleProvider);
        const mapped = mapFirebaseUserToUnified(res.user);
        setUser(mapped);
        setSession({ user: mapped, provider: 'firebase' });
        fetchRoles(res.user.uid);

        if (typeof window !== 'undefined' && redirectTo) {
          window.location.href = redirectTo;
        }
        return { data: res.user, error: null };
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] Google popup cancelled or failed:', fbErr.message);
        if (fbErr.code !== 'auth/popup-closed-by-user') {
          return { data: null, error: fbErr };
        }
      }
    }

    // 2. Fallback to Supabase OAuth
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
      const targetNext = redirectTo ? redirectTo : '/schools';
      if (typeof window !== 'undefined' && targetNext) {
        try {
          localStorage.setItem('auth_redirect_next', targetNext);
        } catch {}
      }

      const callbackUrl = `${origin}/auth/callback`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err };
    }
  };

  const signOut = async () => {
    if (auth) {
      try {
        await firebaseSignOut(auth);
      } catch {}
    }
    await supabase.auth.signOut().catch(() => {});
    setUser(null);
    setSession(null);
    setRoles([]);
    setRolesLoading(false);
  };

  const resetPassword = async (email: string) => {
    if (auth) {
      try {
        await sendPasswordResetEmail(auth, email);
        return { error: null };
      } catch (fbErr: any) {
        console.warn('[Firebase Auth] resetPassword error:', fbErr);
        return { error: fbErr };
      }
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || '')}/reset-password`,
    });
    return { error };
  };

  // ── Verification tracking ────────────────────────────────────────────────
  const [verifiedList, setVerifiedList] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem('cseel_admin_verified_users');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const verifyUser = (identifier: string) => {
    if (!identifier) return;
    const clean = identifier.trim().toLowerCase();
    const updated = Array.from(new Set([...verifiedList, clean]));
    setVerifiedList(updated);
    try {
      localStorage.setItem('cseel_admin_verified_users', JSON.stringify(updated));
    } catch {}
  };

  const unverifyUser = (identifier: string) => {
    if (!identifier) return;
    const clean = identifier.trim().toLowerCase();
    const updated = verifiedList.filter(id => id !== clean);
    setVerifiedList(updated);
    try {
      localStorage.setItem('cseel_admin_verified_users', JSON.stringify(updated));
    } catch {}
  };

  const isVerified = Boolean(
    user && (
      roles.includes('moderator') ||
      user.app_metadata?.is_verified === true ||
      user.user_metadata?.is_verified === true
    )
  );

  return (
    <AuthContext.Provider value={{
      user, session, roles, loading, rolesLoading,
      isTeacher:      roles.includes("teacher"),
      isStudent:      roles.includes("student"),
      isOrganisation: roles.includes("organisation"),
      isVerified,
      signIn, signInWithGoogle, signUp, signOut, resetPassword,
      verifyUser, unverifyUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
