'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, googleProvider } from "@/lib/firebase/client";
import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  sendEmailVerification,
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
  phone?: string;
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
  signInWithOtp: (email: string, otp: string) => Promise<{ error: any; redirect?: string }>;
  sendEmailOtp: (email: string, redirect?: string) => Promise<{ success: boolean; error?: string }>;
  sendFirebaseSignInLink: (email: string, redirectTo?: string) => Promise<{ success: boolean; error?: string }>;
  completeSignInWithEmailLink: (email?: string, url?: string) => Promise<{ success: boolean; error?: string; user?: UnifiedUser }>;
  sendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, role: AppRole, opts?: SignUpOptions) => Promise<{ error: any; isExistingUser?: boolean }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  verifyUser: (identifier: string) => void;
  unverifyUser: (identifier: string) => void;
  userProfile: any | null;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  saveUserProfile: (data: { displayName: string; role: AppRole; state?: string; district?: string; pincode?: string; phone?: string }) => Promise<{ success: boolean; error?: string }>;
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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UnifiedUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(true);

  // Verified users management stored locally and synced
  const [verifiedList, setVerifiedList] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('cseel_admin_verified_users') || '[]');
      } catch {
        return [];
      }
    }
    return [];
  });

  const verifyUser = (identifier: string) => {
    setVerifiedList((prev) => {
      const next = Array.from(new Set([...prev, identifier]));
      if (typeof window !== 'undefined') {
        localStorage.setItem('cseel_admin_verified_users', JSON.stringify(next));
      }
      return next;
    });
  };

  const unverifyUser = (identifier: string) => {
    setVerifiedList((prev) => {
      const next = prev.filter((id) => id !== identifier);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cseel_admin_verified_users', JSON.stringify(next));
      }
      return next;
    });
  };

  const fetchRoles = (userId: string, assignedRole?: AppRole) => {
    try {
      let activeRoles: AppRole[] = [];
      const stored = typeof window !== 'undefined' ? localStorage.getItem(`cseel_user_roles_${userId}`) : null;
      if (stored) {
        activeRoles = JSON.parse(stored);
      } else if (assignedRole) {
        activeRoles = [assignedRole];
        if (typeof window !== 'undefined') {
          localStorage.setItem(`cseel_user_roles_${userId}`, JSON.stringify(activeRoles));
        }
      } else {
        // Default based on metadata or fallback to teacher
        activeRoles = ['teacher'];
      }
      setRoles(activeRoles);
    } catch {
      setRoles(['teacher']);
    } finally {
      setRolesLoading(false);
    }
  };

  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const syncUserProfile = async (cleanEmail: string) => {
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(cleanEmail)}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setUserProfile(data.profile);
        setUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            displayName: data.profile.displayName || prev.displayName,
            user_metadata: {
              ...prev.user_metadata,
              name: data.profile.displayName,
              full_name: data.profile.displayName,
              role: data.profile.role,
              state: data.profile.state,
              district: data.profile.district,
              pincode: data.profile.pincode,
              phone: data.profile.phone,
            },
          };
        });
        if (data.profile.role) {
          setRoles([data.profile.role]);
        }
      } else if (!data.hasCompletedProfile) {
        // If user has not filled details, open modal
        setIsProfileModalOpen(true);
      }
    } catch (err) {
      console.warn('[AuthContext] syncUserProfile notice:', err);
    }
  };

  const saveUserProfile = async (data: { displayName: string; role: AppRole; state?: string; district?: string; pincode?: string; phone?: string }) => {
    if (!user || !user.email) {
      return { success: false, error: 'User must be signed in to update profile.' };
    }
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, ...data }),
      });
      const resData = await res.json();
      if (!res.ok || !resData.success) {
        return { success: false, error: resData.error || 'Failed to save profile.' };
      }

      setUserProfile(resData.profile);
      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          displayName: data.displayName,
          user_metadata: {
            ...prev.user_metadata,
            name: data.displayName,
            full_name: data.displayName,
            role: data.role,
            state: data.state,
            district: data.district,
            pincode: data.pincode,
            phone: data.phone,
          },
        };
      });
      setRoles([data.role]);

      if (auth && auth.currentUser) {
        updateProfile(auth.currentUser, { displayName: data.displayName }).catch(() => {});
      }

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(`cseel_user_roles_${user.uid}`, JSON.stringify([data.role]));
          localStorage.setItem(`cseel_user_metadata_${user.uid}`, JSON.stringify({
            ...user.user_metadata,
            name: data.displayName,
            full_name: data.displayName,
            role: data.role,
            state: data.state,
            district: data.district,
            pincode: data.pincode,
          }));
        } catch {}
      }

      setIsProfileModalOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Error updating profile.' };
    }
  };

  useEffect(() => {
    let unsubscribeFirebase: (() => void) | null = null;

    // Safety resolution timer (max 600ms)
    const timer = setTimeout(() => {
      setLoading(false);
      setRolesLoading(false);
    }, 600);

    if (auth) {
      // 1. Check if returning from a Google redirect
      getRedirectResult(auth)
        .then((res) => {
          if (res?.user) {
            const mapped = mapFirebaseUserToUnified(res.user);
            setUser(mapped);
            setSession({ user: mapped, provider: 'firebase' });
            fetchRoles(res.user.uid);

            const next = typeof window !== 'undefined' ? localStorage.getItem('auth_redirect_next') : null;
            if (next && typeof window !== 'undefined') {
              try { localStorage.removeItem('auth_redirect_next'); } catch {}
              window.location.href = next;
            }
          }
        })
        .catch((err) => {
          console.warn('[Firebase Auth] Redirect result notice:', err?.message);
        });

      // 1b. Check if returning from a Firebase Passwordless Email Link
      if (typeof window !== 'undefined' && isSignInWithEmailLink(auth, window.location.href)) {
        let emailForLink = window.localStorage.getItem('emailForSignIn');
        if (!emailForLink) {
          emailForLink = new URLSearchParams(window.location.search).get('email');
        }
        if (emailForLink) {
          signInWithEmailLink(auth, emailForLink, window.location.href)
            .then((res) => {
              try { window.localStorage.removeItem('emailForSignIn'); } catch {}
              const mapped = mapFirebaseUserToUnified(res.user);
              setUser(mapped);
              setSession({ user: mapped, provider: 'firebase-email-link' });
              fetchRoles(res.user.uid);
              const next = new URLSearchParams(window.location.search).get('redirect') || localStorage.getItem('auth_redirect_next');
              if (next) {
                try { localStorage.removeItem('auth_redirect_next'); } catch {}
                window.location.href = next;
              }
            })
            .catch((linkErr) => {
              console.warn('[Firebase Auth] signInWithEmailLink auto error:', linkErr);
            });
        }
      }

      // 1c. Check if returning from a direct Google OAuth redirect (#id_token=... or ?id_token=...)
      if (typeof window !== 'undefined') {
        const hash = window.location.hash.substring(1);
        const urlParams = new URLSearchParams(hash || window.location.search);
        const idToken = urlParams.get('id_token');
        if (idToken && auth) {
          try {
            const credential = GoogleAuthProvider.credential(idToken);
            signInWithCredential(auth, credential)
              .then((res) => {
                try {
                  window.history.replaceState(null, '', window.location.pathname);
                } catch {}
                const mapped = mapFirebaseUserToUnified(res.user);
                setUser(mapped);
                setSession({ user: mapped, provider: 'firebase-google' });
                fetchRoles(res.user.uid);
                const next = localStorage.getItem('auth_redirect_next') || '/schools';
                try { localStorage.removeItem('auth_redirect_next'); } catch {}
                window.location.href = next;
              })
              .catch((credErr) => {
                console.warn('[Firebase Google OAuth Credential Error]:', credErr);
              });
          } catch (e) {
            console.warn('[Direct Google OAuth] Credential build error:', e);
          }
        }
      }

      // 2. Listen to active Firebase auth state changes
      unsubscribeFirebase = onAuthStateChanged(auth, async (fbUser) => {
        clearTimeout(timer);
        if (fbUser) {
          const mapped = mapFirebaseUserToUnified(fbUser);
          setUser(mapped);
          setSession({ user: mapped, provider: 'firebase' });
          fetchRoles(fbUser.uid);
          if (fbUser.email) syncUserProfile(fbUser.email);
        } else {
          // Check if session was saved via OTP login
          try {
            const storedOtpUser = typeof window !== 'undefined' ? localStorage.getItem('cseel_otp_session_user') : null;
            if (storedOtpUser) {
              const parsed = JSON.parse(storedOtpUser);
              setUser(parsed);
              setSession({ user: parsed, provider: 'firebase-otp' });
              fetchRoles(parsed.uid);
              if (parsed.email) syncUserProfile(parsed.email);
            } else {
              setUser(null);
              setSession(null);
              setRoles([]);
            }
          } catch {
            setUser(null);
            setSession(null);
          }
        }
        setLoading(false);
        setRolesLoading(false);
      });
    } else {
      clearTimeout(timer);
      setLoading(false);
      setRolesLoading(false);
    }

    return () => {
      clearTimeout(timer);
      if (unsubscribeFirebase) unsubscribeFirebase();
    };
  }, []);

  // ─── 1. SIGN IN WITH EMAIL & PASSWORD (FIREBASE WITH FALLBACK) ───
  const signIn = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Try Firebase native email/password sign-in
    if (auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, cleanEmail, cleanPass);
        const mapped = mapFirebaseUserToUnified(res.user);
        setUser(mapped);
        setSession({ user: mapped, provider: 'firebase' });
        fetchRoles(res.user.uid);
        return { error: null };
      } catch (err: any) {
        // If not a credential failure (e.g. operation-not-allowed or user-not-found in Firebase), check registered users store
        if (err.code !== 'auth/wrong-password' && err.code !== 'auth/invalid-credential') {
          if (typeof window !== 'undefined') {
            try {
              const registered = JSON.parse(localStorage.getItem('cseel_registered_users') || '{}');
              const account = registered[cleanEmail];
              if (account && account.password === cleanPass) {
                const mapped: UnifiedUser = {
                  id: account.uid,
                  uid: account.uid,
                  email: account.email,
                  displayName: account.displayName,
                  user_metadata: {
                    full_name: account.displayName,
                    name: account.displayName,
                    role: account.role || 'teacher',
                  },
                  app_metadata: {},
                };
                setUser(mapped);
                setSession({ user: mapped, provider: 'cseel-verified' });
                fetchRoles(account.uid, account.role || 'teacher');
                localStorage.setItem('cseel_otp_session_user', JSON.stringify(mapped));
                return { error: null };
              }
            } catch {}
          }
        }
        return { error: err };
      }
    }
    return { error: new Error('Authentication service not ready.') };
  };

  // ─── 2. SIGN IN WITH GOOGLE (POPUP WITH DIRECT OAUTH FALLBACK) ───
  const signInWithGoogle = async (redirectTo?: string) => {
    if (!auth) {
      return { data: null, error: new Error('Firebase Auth is not initialized.') };
    }

    if (typeof window !== 'undefined' && redirectTo) {
      try {
        localStorage.setItem('auth_redirect_next', redirectTo);
      } catch {}
    }

    // Direct synchronous popup attempt (preserves user gesture)
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
      if (fbErr.code === 'auth/popup-closed-by-user' || fbErr.code === 'auth/cancelled-popup-request') {
        return { data: null, error: null };
      }

      console.warn('[Firebase Google Auth] Notice (' + fbErr?.code + '), activating Firebase redirect flow...');
      try {
        await signInWithRedirect(auth, googleProvider);
        return { data: null, error: null };
      } catch (redirErr: any) {
        return { data: null, error: redirErr || fbErr };
      }
    }
  };

  // ─── 3. SEND EMAIL OTP / MAGIC LINK ───
  const sendEmailOtp = async (email: string, redirect?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email, redirect }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Failed to send OTP email.' };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error sending OTP.' };
    }
  };

  // ─── 4. SIGN IN WITH EMAIL OTP / MAGIC LINK (PASSWORDLESS) ───
  const signInWithOtp = async (email: string, otp: string) => {
    try {
      const res = await fetch('/api/auth/email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email, otp }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        return { error: new Error(data.error || 'Invalid or expired OTP.') };
      }

      // Create unified user session
      const mapped: UnifiedUser = {
        id: data.uid,
        uid: data.uid,
        email: data.email,
        displayName: data.email.split('@')[0],
        user_metadata: {
          full_name: data.email.split('@')[0],
          name: data.email.split('@')[0],
          role: 'teacher',
        },
        app_metadata: {},
      };

      setUser(mapped);
      setSession({ user: mapped, provider: 'firebase-otp' });
      fetchRoles(mapped.uid, 'teacher');

      if (typeof window !== 'undefined') {
        localStorage.setItem('cseel_otp_session_user', JSON.stringify(mapped));
      }

      return { error: null, redirect: data.redirect || '/schools' };
    } catch (err: any) {
      return { error: err };
    }
  };

  // ─── 4b. SEND PASSWORDLESS SIGN-IN LINK (DIRECT FROM GOOGLE FIREBASE) ───
  const sendFirebaseSignInLink = async (email: string, redirectTo?: string): Promise<{ success: boolean; error?: string }> => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not initialized.' };
    }
    const cleanEmail = email.trim().toLowerCase();
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.cseel.org';
    const targetRedirect = redirectTo || '/schools';
    const actionCodeSettings = {
      url: `${origin}/login?email=${encodeURIComponent(cleanEmail)}&redirect=${encodeURIComponent(targetRedirect)}`,
      handleCodeInApp: true,
    };
    try {
      await sendSignInLinkToEmail(auth, cleanEmail, actionCodeSettings);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('emailForSignIn', cleanEmail);
        if (redirectTo) {
          localStorage.setItem('auth_redirect_next', redirectTo);
        }
      }
      return { success: true };
    } catch (err: any) {
      console.warn('[Firebase sendSignInLinkToEmail] Error:', err);
      return { success: false, error: err?.message || 'Failed to send Firebase sign-in link.' };
    }
  };

  // ─── 4c. COMPLETE FIREBASE SIGN-IN WITH EMAIL LINK ───
  const completeSignInWithEmailLink = async (emailArg?: string, urlArg?: string): Promise<{ success: boolean; error?: string; user?: UnifiedUser }> => {
    if (!auth) {
      return { success: false, error: 'Firebase Auth is not initialized.' };
    }
    const targetUrl = urlArg || (typeof window !== 'undefined' ? window.location.href : '');
    if (!isSignInWithEmailLink(auth, targetUrl)) {
      return { success: false, error: 'Current URL does not contain a valid Firebase sign-in link.' };
    }
    let targetEmail = emailArg;
    if (!targetEmail && typeof window !== 'undefined') {
      targetEmail = window.localStorage.getItem('emailForSignIn') || new URLSearchParams(window.location.search).get('email') || '';
    }
    if (!targetEmail) {
      return { success: false, error: 'Email address missing for email link verification.' };
    }
    try {
      const res = await signInWithEmailLink(auth, targetEmail, targetUrl);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('emailForSignIn');
      }
      const mapped = mapFirebaseUserToUnified(res.user);
      setUser(mapped);
      setSession({ user: mapped, provider: 'firebase-email-link' });
      fetchRoles(res.user.uid);
      return { success: true, user: mapped };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to verify Firebase sign-in link.' };
    }
  };

  // ─── 4d. SEND VERIFICATION EMAIL (DIRECT FROM GOOGLE FIREBASE) ───
  const sendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    if (!auth || !auth.currentUser) {
      return { success: false, error: 'No active user found to send verification email.' };
    }
    try {
      await sendEmailVerification(auth.currentUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send verification email.' };
    }
  };

  // ─── 5. SIGN UP WITH EMAIL & PASSWORD (FIREBASE WITH FAILSAFE) ───
  const signUp = async (
    email: string,
    password: string,
    role: AppRole,
    opts?: SignUpOptions
  ) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();
    const displayName = opts?.displayName || opts?.organisation?.org_name || cleanEmail.split('@')[0];

    // 1. Attempt native Firebase account creation
    if (auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, cleanEmail, cleanPass);
        await updateProfile(res.user, { displayName });

        const mapped = mapFirebaseUserToUnified(res.user);
        mapped.displayName = displayName;
        if (mapped.user_metadata) {
          mapped.user_metadata.name = displayName;
          mapped.user_metadata.full_name = displayName;
          mapped.user_metadata.role = role;
          if (opts?.phone) mapped.user_metadata.phone = opts.phone;
          if (opts?.organisation) mapped.user_metadata.organisation = opts.organisation;
        }

        setUser(mapped);
        setSession({ user: mapped, provider: 'firebase' });
        fetchRoles(res.user.uid, role);

        if (typeof window !== 'undefined') {
          localStorage.setItem(`cseel_user_roles_${res.user.uid}`, JSON.stringify([role]));
          localStorage.setItem(`cseel_user_metadata_${res.user.uid}`, JSON.stringify(mapped.user_metadata));
        }

        return { error: null };
      } catch (err: any) {
        // Check for duplicate account / email already registered
        if (
          err.code === 'auth/email-already-in-use' ||
          err.message?.includes('EMAIL_EXISTS') ||
          err.message?.includes('email-already-in-use') ||
          err.message?.includes('already in use')
        ) {
          const friendlyErr = new Error('An account with this email already exists. Please sign in instead.');
          (friendlyErr as any).code = 'auth/email-already-in-use';
          return { error: friendlyErr, isExistingUser: true };
        }

        // If Firebase Console has Email/Password disabled, provide 100% seamless fallback
        if (
          err.code === 'auth/operation-not-allowed' ||
          err.code === 'auth/admin-restricted-operation' ||
          err.message?.includes('PASSWORD_LOGIN_DISABLED')
        ) {
          console.warn('[Firebase Auth] Notice: Email/Password provider disabled in Firebase Console. Registering user via unified store...');

          if (typeof window !== 'undefined') {
            try {
              const registered = JSON.parse(localStorage.getItem('cseel_registered_users') || '{}');
              if (registered[cleanEmail]) {
                const friendlyErr = new Error('An account with this email already exists. Please sign in instead.');
                (friendlyErr as any).code = 'auth/email-already-in-use';
                return { error: friendlyErr, isExistingUser: true };
              }
            } catch {}
          }

          const uid = 'cseel_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
          const mapped: UnifiedUser = {
            id: uid,
            uid: uid,
            email: cleanEmail,
            displayName: displayName,
            user_metadata: {
              full_name: displayName,
              name: displayName,
              role: role,
              phone: opts?.phone,
              organisation: opts?.organisation,
            },
            app_metadata: {},
          };

          if (typeof window !== 'undefined') {
            try {
              const registered = JSON.parse(localStorage.getItem('cseel_registered_users') || '{}');
              registered[cleanEmail] = {
                uid,
                email: cleanEmail,
                password: cleanPass,
                displayName,
                role,
                opts,
                createdAt: new Date().toISOString(),
              };
              localStorage.setItem('cseel_registered_users', JSON.stringify(registered));
              localStorage.setItem('cseel_otp_session_user', JSON.stringify(mapped));
              localStorage.setItem(`cseel_user_roles_${uid}`, JSON.stringify([role]));
              localStorage.setItem(`cseel_user_metadata_${uid}`, JSON.stringify(mapped.user_metadata));
            } catch {}
          }

          setUser(mapped);
          setSession({ user: mapped, provider: 'cseel-verified' });
          fetchRoles(uid, role);

          // Dispatch confirmation code in background
          sendEmailOtp(cleanEmail).catch(() => {});

          return { error: null };
        }
        return { error: err };
      }
    }

    return { error: new Error('Authentication service not ready.') };
  };

  // ─── 6. SIGN OUT ───
  const signOut = async () => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch {}

    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cseel_otp_session_user');
        localStorage.removeItem('auth_redirect_next');
      } catch {}
    }

    setUser(null);
    setSession(null);
    setRoles([]);
  };

  // ─── 7. RESET PASSWORD ───
  const resetPassword = async (email: string) => {
    if (!auth) {
      return { error: new Error('Firebase Auth is not initialized.') };
    }
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  const isTeacher = roles.includes("teacher");
  const isStudent = roles.includes("student");
  const isOrganisation = roles.includes("organisation");
  const isVerified = Boolean(
    (user?.id && verifiedList.includes(user.id)) ||
    (user?.email && verifiedList.includes(user.email)) ||
    user?.user_metadata?.is_verified ||
    user?.app_metadata?.is_verified
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        roles,
        loading,
        rolesLoading,
        isTeacher,
        isStudent,
        isOrganisation,
        isVerified,
        signIn,
        signInWithGoogle,
        signInWithOtp,
        sendEmailOtp,
        sendFirebaseSignInLink,
        completeSignInWithEmailLink,
        sendVerificationEmail,
        signUp,
        signOut,
        resetPassword,
        verifyUser,
        unverifyUser,
        userProfile,
        isProfileModalOpen,
        setIsProfileModalOpen,
        saveUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
