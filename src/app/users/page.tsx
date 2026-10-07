'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ResumeBuilderCanvas from '@/components/resume-builder/ResumeBuilderCanvas';
import {
  buildFormattedAddress,
  calculateHaversineDistanceKm,
  parseGoogleMapsLocation,
  resolveLocationViaApi
} from '@/lib/location-utils';
import {
  LocateFixed,
  Shield,
  ShieldCheck,
  Lock,
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  FileText,
  Video,
  Image as ImageIcon,
  User,
  LogOut,
  Sparkles,
  ChevronRight,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Award,
  BookOpen,
  Share2,
  Eye,
  MessageSquare,
  Phone,
  MapPin,
  Navigation,
  Compass,
  KeyRound,
  Palette,
  Layers,
  Files,
  Settings,
  Edit3,
  Check,
  Key,
  Globe,
  Sliders,
  FolderOpen
} from 'lucide-react';

export default function UsersFacultyDashboard() {
  const router = useRouter();
  const { user, signIn, signUp, signOut, resetPassword, loading: authLoading } = useAuth();

  // Navigation Menu Tabs
  const [activeMenuTab, setActiveMenuTab] = useState<'resumes' | 'profile' | 'security'>('resumes');

  // Auth form state (for unauthenticated users)
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authDisplayName, setAuthDisplayName] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Profile Edit State
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editPhotoUrl, setEditPhotoUrl] = useState('');
  const [editLocalAddress, setEditLocalAddress] = useState('');
  const [editDistrict, setEditDistrict] = useState('');
  const [editState, setEditState] = useState('');
  const [editPincode, setEditPincode] = useState('');
  const [editGoogleMapLocation, setEditGoogleMapLocation] = useState('');
  const [editLatitude, setEditLatitude] = useState('');
  const [editLongitude, setEditLongitude] = useState('');
  const [isSearchingAddressLocation, setIsSearchingAddressLocation] = useState(false);
  const [editIsLocationVerified, setEditIsLocationVerified] = useState(false);
  const [editDistanceKm, setEditDistanceKm] = useState<number | null>(null);
  const [isGpsDetecting, setIsGpsDetecting] = useState(false);
  const [gpsProfileMsg, setGpsProfileMsg] = useState<{ text: string; type: 'success' | 'warning' | 'error' } | null>(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaveSuccess, setProfileSaveSuccess] = useState<string | null>(null);

  // Password Change State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Multi-Resume Management State (Max 5 resumes)
  const [userProfiles, setUserProfiles] = useState<any[]>([]);
  const [selectedProfileIndex, setSelectedProfileIndex] = useState<number>(0);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [showInlineBuilder, setShowInlineBuilder] = useState(false);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Fetch all profiles for this user from API & Supabase
  const refreshUserProfiles = async () => {
    if (!user) return;
    setLoadingProfile(true);
    try {
      const res = await fetch('/api/faculty-resumes');
      const data = await res.json();
      if (data.success && Array.isArray(data.faculty)) {
        const matches = data.faculty.filter(
          (f: any) =>
            (f.userId && f.userId === user.id) ||
            (f.email && f.email.toLowerCase() === user.email?.toLowerCase())
        );
        setUserProfiles(matches);
      }
    } catch (e) {
      console.error('Error fetching user profiles:', e);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (user) {
      setEditDisplayName(user.user_metadata?.display_name || user.email?.split('@')[0] || '');
      refreshUserProfiles();
    }
  }, [user]);

  // Active Selected Profile
  const existingProfile = userProfiles[selectedProfileIndex] || userProfiles[0] || null;

  useEffect(() => {
    if (existingProfile) {
      setEditDisplayName(existingProfile.name || user?.user_metadata?.display_name || '');
      setEditPhone(existingProfile.phone || '');
      setEditPhotoUrl(existingProfile.photoUrl || '');
      const addr = existingProfile.addressDetails || {};
      setEditLocalAddress(addr.localAddress || '');
      setEditDistrict(addr.district || '');
      setEditState(addr.state || '');
      setEditPincode(addr.pincode || '');
      setEditGoogleMapLocation(addr.googleMapLocation || existingProfile.googleMapLocation || '');
      setEditLatitude(addr.latitude !== undefined && addr.latitude !== null ? String(addr.latitude) : '');
      setEditLongitude(addr.longitude !== undefined && addr.longitude !== null ? String(addr.longitude) : '');
      setEditIsLocationVerified(existingProfile.isLocationVerified || addr.isLocationVerified || false);
      setEditDistanceKm(addr.distanceKm !== undefined ? addr.distanceKm : null);
    }
  }, [existingProfile]);

  // Auth Handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);
    try {
      if (authMode === 'signin') {
        const { error } = await signIn(authEmail, authPassword);
        if (error) setAuthError(error.message || 'Login failed. Please check your credentials.');
      } else if (authMode === 'signup') {
        const { error } = await signUp(authEmail, authPassword, 'teacher', {
          displayName: authDisplayName || authEmail.split('@')[0]
        });
        if (error) setAuthError(error.message || 'Registration failed.');
        else {
          setMessage({ text: 'Account created! Please check your email or proceed to login.', type: 'success' });
          setAuthMode('signin');
        }
      } else if (authMode === 'forgot') {
        const { error } = await resetPassword(authEmail);
        if (error) {
          setAuthError(error.message || 'Failed to send password reset email.');
        } else {
          setMessage({
            text: `Password reset link sent to ${authEmail}. Please check your inbox or spam folder.`,
            type: 'success'
          });
          setAuthMode('signin');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || 'An unexpected error occurred');
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleSearchLocationFromAddress = async () => {
    if (!editLocalAddress && !editDistrict && !editState && !editPincode) {
      setGpsProfileMsg({
        type: 'warning',
        text: 'Please enter Village/Local address, District, State, or Pincode to search location.'
      });
      return;
    }
    setIsSearchingAddressLocation(true);
    setGpsProfileMsg(null);
    try {
      const res = await resolveLocationViaApi({
        localAddress: editLocalAddress,
        district: editDistrict,
        state: editState,
        pincode: editPincode
      });
      if (res.success && res.latitude !== undefined && res.longitude !== undefined) {
        const latStr = res.latitude.toFixed(6);
        const lonStr = res.longitude.toFixed(6);
        setEditLatitude(latStr);
        setEditLongitude(lonStr);
        if (res.googleMapUrl) setEditGoogleMapLocation(res.googleMapUrl);
        setGpsProfileMsg({
          type: 'success',
          text: `✓ Location Calculated: ${res.resolvedAddress || `${editDistrict}, ${editState}`} (Lat: ${latStr}, Lon: ${lonStr})`
        });
      } else {
        setGpsProfileMsg({
          type: 'warning',
          text: res.error || 'Could not find exact coordinates for this address. You can paste a Google Maps link or enter Lat/Lng directly.'
        });
      }
    } catch (err: any) {
      setGpsProfileMsg({
        type: 'error',
        text: err.message || 'Geocoding failed. Please check network connection.'
      });
    } finally {
      setIsSearchingAddressLocation(false);
    }
  };

  const handleDetect2kmRange = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setIsGpsDetecting(true);
    setGpsProfileMsg(null);

    try {
      let targetLat: number | null = null;
      let targetLon: number | null = null;

      // 1. Check if user provided direct Lat & Long
      if (editLatitude && editLongitude && !isNaN(Number(editLatitude)) && !isNaN(Number(editLongitude))) {
        targetLat = Number(editLatitude);
        targetLon = Number(editLongitude);
      } else if (editGoogleMapLocation) {
        // Resolve URL (supports shortened https://maps.app.goo.gl/... links)
        const res = await resolveLocationViaApi({ url: editGoogleMapLocation });
        if (res.success && res.latitude !== undefined && res.longitude !== undefined) {
          targetLat = res.latitude;
          targetLon = res.longitude;
          setEditLatitude(res.latitude.toFixed(6));
          setEditLongitude(res.longitude.toFixed(6));
          if (res.googleMapUrl) setEditGoogleMapLocation(res.googleMapUrl);
        }
      } else if (editLocalAddress || editDistrict || editState || editPincode) {
        // Geocode address
        const res = await resolveLocationViaApi({
          localAddress: editLocalAddress,
          district: editDistrict,
          state: editState,
          pincode: editPincode
        });
        if (res.success && res.latitude !== undefined && res.longitude !== undefined) {
          targetLat = res.latitude;
          targetLon = res.longitude;
          setEditLatitude(res.latitude.toFixed(6));
          setEditLongitude(res.longitude.toFixed(6));
          if (res.googleMapUrl) setEditGoogleMapLocation(res.googleMapUrl);
        }
      }

      // 2. Fetch Device GPS and Calculate Distance
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const liveLat = pos.coords.latitude;
          const liveLon = pos.coords.longitude;

          if (targetLat !== null && targetLon !== null) {
            const dist = calculateHaversineDistanceKm(liveLat, liveLon, targetLat, targetLon);
            const isVerified = dist <= 2.0;
            setEditDistanceKm(dist);
            setEditIsLocationVerified(isVerified);

            if (isVerified) {
              setGpsProfileMsg({
                type: 'success',
                text: `✓ GPS 2km Verified! Device GPS is ${dist} km from declared location (Within 2.0 km range).`
              });
            } else {
              setGpsProfileMsg({
                type: 'warning',
                text: `⚠️ Device is ${dist} km away from declared location. Must be within 2.0 km for auto-verification.`
              });
            }
          } else {
            // Auto-detect and set current position as verified
            const autoMap = `https://maps.google.com/?q=${liveLat.toFixed(6)},${liveLon.toFixed(6)}`;
            setEditGoogleMapLocation(autoMap);
            setEditLatitude(liveLat.toFixed(6));
            setEditLongitude(liveLon.toFixed(6));
            setEditDistanceKm(0.0);
            setEditIsLocationVerified(true);
            setGpsProfileMsg({
              type: 'success',
              text: `✓ Current GPS coordinates detected (${liveLat.toFixed(4)}, ${liveLon.toFixed(4)}) and verified within 2.0 km!`
            });
          }
          setIsGpsDetecting(false);
        },
        (err) => {
          console.error(err);
          setIsGpsDetecting(false);
          setGpsProfileMsg({
            type: 'error',
            text: `GPS Access Error: ${err.message || 'Unable to retrieve location. Please grant browser permissions.'}`
          });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } catch (err: any) {
      setIsGpsDetecting(false);
      setGpsProfileMsg({
        type: 'error',
        text: `Error verifying location: ${err.message || 'Unknown error'}`
      });
    }
  };

  // Update Profile Name & Metadata
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSaveSuccess(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          display_name: editDisplayName,
          phone: editPhone,
          photo_url: editPhotoUrl
        }
      });

      if (error) throw error;

      // Also update active resume profile in API with addressDetails
      if (existingProfile) {
        const combined = buildFormattedAddress(editLocalAddress, editDistrict, editState, editPincode);
        const finalLat = editLatitude ? parseFloat(editLatitude) : undefined;
        const finalLon = editLongitude ? parseFloat(editLongitude) : undefined;
        await fetch('/api/faculty-resumes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...existingProfile,
            name: editDisplayName,
            phone: editPhone,
            photoUrl: editPhotoUrl,
            location: combined,
            address: combined,
            isLocationVerified: editIsLocationVerified,
            addressDetails: {
              ...(existingProfile.addressDetails || {}),
              localAddress: editLocalAddress,
              district: editDistrict,
              state: editState,
              pincode: editPincode,
              googleMapLocation: editGoogleMapLocation,
              latitude: finalLat,
              longitude: finalLon,
              distanceKm: editDistanceKm,
              isLocationVerified: editIsLocationVerified,
              verificationStatus: editIsLocationVerified ? 'verified_within_2km' : 'outside_2km'
            }
          })
        });
        refreshUserProfiles();
      }

      setProfileSaveSuccess('Profile and address details updated successfully!');
      setTimeout(() => setProfileSaveSuccess(null), 4000);
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update profile info', type: 'error' });
    } finally {
      setProfileSaving(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ text: 'Password must be at least 6 characters long.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setPasswordSaving(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setPasswordMessage({ text: 'Password successfully updated!', type: 'success' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(null), 4000);
    } catch (err: any) {
      setPasswordMessage({ text: err.message || 'Failed to change password.', type: 'error' });
    } finally {
      setPasswordSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopyNotification(`Copied ${label} to clipboard!`);
      setTimeout(() => setCopyNotification(null), 3000);
    }
  };

  // Create New Resume (Max 5) -> Navigates to dedicated /user/editor
  const handleCreateNewResume = () => {
    if (userProfiles.length >= 5) {
      alert('You have reached the maximum limit of 5 resumes. Please delete an older resume before creating a new one.');
      return;
    }
    router.push('/user/editor?new=true');
  };

  // Delete Resume
  const handleDeleteResume = async (profileToDelete: any) => {
    if (!profileToDelete || !profileToDelete.slug) return;
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete the resume "${profileToDelete.name}" (${profileToDelete.subject || 'Faculty'})?\nThis will remove it from Supabase database and delete the public links.`
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/faculty-resumes?slug=${encodeURIComponent(profileToDelete.slug)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Resume "${profileToDelete.name}" successfully deleted.`, type: 'success' });
        setSelectedProfileIndex(0);
        refreshUserProfiles();
      } else {
        setMessage({ text: data.message || 'Failed to delete resume', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Error occurred while deleting resume', type: 'error' });
    }
  };

  // Unauthenticated Login / Register / Forgot Password View
  if (!user && !authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Plus_Jakarta_Sans',sans-serif]">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 mb-4">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            CSEEL Educator Portal
          </h2>
          <p className="mt-1.5 text-xs text-slate-500">
            Verified Faculty Multi-Resume Workspace &amp; Profile Manager
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl rounded-2xl sm:px-10 border border-slate-200/80">
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 text-center transition-colors ${
                  authMode === 'signin'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => { setAuthMode('signin'); setAuthError(null); }}
              >
                Login
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 text-center transition-colors ${
                  authMode === 'signup'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => { setAuthMode('signup'); setAuthError(null); }}
              >
                Register
              </button>
              <button
                type="button"
                className={`flex-1 py-3 text-xs sm:text-sm font-semibold border-b-2 text-center transition-colors ${
                  authMode === 'forgot'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => { setAuthMode('forgot'); setAuthError(null); }}
              >
                Forgot Password
              </button>
            </div>

            {authError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            {message && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{message.text}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={authDisplayName}
                    onChange={e => setAuthDisplayName(e.target.value)}
                    placeholder="e.g. Dr. Dev Sharma"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Email Address
                </label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="faculty@cseel.org"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                />
              </div>

              {authMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setAuthMode('forgot'); setAuthError(null); }}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={e => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2"
              >
                {authSubmitting ? (
                  <span>Processing...</span>
                ) : authMode === 'signin' ? (
                  <><span>Sign In to Dashboard</span> <ChevronRight className="w-4 h-4" /></>
                ) : authMode === 'signup' ? (
                  <><span>Register as Faculty</span> <Sparkles className="w-4 h-4" /></>
                ) : (
                  <><span>Send Password Reset Link</span> <KeyRound className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Active Profile Link URL Calculations
  const accessKey = existingProfile?.accessKey || 'Pending Generation';
  const cleanSubject = (existingProfile?.subject || 'physics').toLowerCase();
  const slug = existingProfile?.slug || 'faculty';

  const resumeKeyedUrl = `https://resumes.cseel.org/best-Teacherfaculty/${cleanSubject}/${accessKey}/${slug}.html`;
  const videosKeyedUrl = `https://resumes.cseel.org/best-Teacherfaculty/${cleanSubject}/${accessKey}/${slug}-videos.html`;
  const galleryKeyedUrl = `https://resumes.cseel.org/best-Teacherfaculty/${cleanSubject}/${accessKey}/${slug}-gallery.html`;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast notification */}
      {copyNotification && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{copyNotification}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 1. TOP HEADER & NAVIGATION BAR */}
      {/* ------------------------------------------------------------- */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-slate-900 leading-tight">CSEEL Educator Workspace</h1>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Verified Faculty Profile &amp; Multi-Resume Management</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/user/editor?new=true"
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Build New Resume</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                {user?.user_metadata?.display_name ? user.user_metadata.display_name[0].toUpperCase() : 'U'}
              </div>
              <span className="font-semibold text-slate-800">{user?.user_metadata?.display_name || user?.email}</span>
            </div>

            <button
              onClick={() => signOut()}
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition border border-slate-200"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* DASHBOARD TAB MENU BAR */}
        {/* ------------------------------------------------------------- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 border-t border-slate-100 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveMenuTab('resumes')}
            className={`py-2.5 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeMenuTab === 'resumes'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Files className="w-4 h-4" />
            <span>My Resumes ({userProfiles.length}/5)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMenuTab('profile')}
            className={`py-2.5 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeMenuTab === 'profile'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile &amp; Password Settings</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveMenuTab('security')}
            className={`py-2.5 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 whitespace-nowrap ${
              activeMenuTab === 'security'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Security Tokens &amp; Public Mirrors</span>
          </button>

          <Link
            href={existingProfile ? `/user/editor?slug=${encodeURIComponent(existingProfile.slug)}` : '/user/editor?new=true'}
            className="ml-auto py-1 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap shadow-xs"
          >
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            <span>Launch Gutenberg Studio (/user/editor) &rarr;</span>
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN BODY */}
      {/* ------------------------------------------------------------- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Feedback Alert */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-2xl border flex items-start gap-3 text-sm shadow-xs ${
              message.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{message.type === 'success' ? 'Success' : 'Notice'}</p>
              <p className="text-xs mt-0.5 opacity-90">{message.text}</p>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: MY RESUMES (COMPACT & ORGANISED) */}
        {/* ------------------------------------------------------------- */}
        {activeMenuTab === 'resumes' && (
          <div className="space-y-6">
            {/* Quick Stat Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Created Resumes</span>
                  <span className="text-2xl font-extrabold text-slate-900">{userProfiles.length} / 5</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Files className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Verification Status</span>
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {userProfiles.filter(p => p.isVerified).length} Verified
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Editor Studio</span>
                  <span className="text-sm font-bold text-blue-600">Gutenberg Engine</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Palette className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Database Sync</span>
                  <span className="text-sm font-bold text-slate-800">Supabase Cloud</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                  <Globe className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Resume Cards Grid */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Active Faculty Resumes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Manage your public URLs, update profile content, and edit in the dedicated editor studio.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={userProfiles.length >= 5}
                  onClick={handleCreateNewResume}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs ${
                    userProfiles.length >= 5
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>{userProfiles.length >= 5 ? 'Max 5 Resumes Reached' : '+ Create New Resume'}</span>
                </button>
              </div>

              {userProfiles.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                    <FolderOpen className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">No Resumes Created Yet</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                    Create your first verified faculty profile with videos, laboratory apparatus showcases, and academic records.
                  </p>
                  <Link
                    href="/user/editor?new=true"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Open Editor &amp; Build Resume</span>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProfiles.map((prof, idx) => {
                    const isSelected = selectedProfileIndex === idx;
                    const pSlug = prof.slug || 'faculty';
                    const pKey = prof.accessKey || 'Pending';
                    const pSubj = (prof.subject || 'physics').toLowerCase();
                    const directUrl = `https://resumes.cseel.org/best-Teacherfaculty/${pSubj}/${pKey}/${pSlug}.html`;

                    return (
                      <div
                        key={prof.id || prof.slug || idx}
                        onClick={() => setSelectedProfileIndex(idx)}
                        className={`rounded-2xl border p-5 transition flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-gradient-to-b from-blue-50/60 to-white border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                            : 'bg-white hover:bg-slate-50/80 border-slate-200 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={prof.photoUrl || '/images/dev-sharma.jpg'}
                                alt={prof.name}
                                className="w-11 h-11 rounded-xl object-cover border-2 border-slate-100 shadow-xs bg-slate-100"
                              />
                              <div>
                                <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                                  {prof.name || 'Faculty Member'}
                                </h4>
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block mt-0.5">
                                  {prof.subject || 'Faculty'}
                                </span>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteResume(prof);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Delete this resume"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                            {prof.title || 'Senior Secondary & Experiential Science Specialist'}
                          </p>

                          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 space-y-1 text-[11px] font-mono text-slate-600">
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">ID:</span>
                              <span className="font-bold text-slate-800">{prof.facultyCode || `FAC-00${idx + 1}`}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-slate-400">Slug:</span>
                              <span className="text-blue-600 font-bold truncate max-w-[120px]">{prof.slug}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Strip */}
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(directUrl, 'Public Resume URL');
                            }}
                            className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                            title="Copy Live Resume URL"
                          >
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span>Copy Link</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <Link
                              href={`/user/editor?slug=${encodeURIComponent(prof.slug)}`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Studio</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* In-Page Quick Preview Section */}
            {existingProfile && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900">
                      Quick Visual Studio Preview: <span className="text-blue-600">{existingProfile.name}</span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/user/editor?slug=${encodeURIComponent(existingProfile.slug)}`}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <span>Open Fullscreen Studio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => setShowInlineBuilder(!showInlineBuilder)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                    >
                      {showInlineBuilder ? 'Hide Preview' : 'Show In-Page Preview'}
                    </button>
                  </div>
                </div>

                {showInlineBuilder && (
                  <div className="rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl">
                    <ResumeBuilderCanvas
                      initialData={existingProfile}
                      userId={user?.id}
                      onSave={async (savedData) => {
                        const res = await fetch('/api/faculty-resumes', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify(savedData)
                        });
                        const result = await res.json();
                        if (result.success) {
                          setMessage({
                            type: 'success',
                            text: 'Resume successfully saved and published!'
                          });
                          refreshUserProfiles();
                        }
                      }}
                      onClose={() => setShowInlineBuilder(false)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: PROFILE & PASSWORD SETTINGS (EDIT NAME, PHOTO, PASSWORD) */}
        {/* ------------------------------------------------------------- */}
        {activeMenuTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Edit Profile Info Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">User Profile Details</h3>
                  <p className="text-xs text-slate-500">Edit your display name, contact phone, and avatar.</p>
                </div>
              </div>

              {profileSaveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profileSaveSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                    placeholder="e.g. Dr. Dev Sharma"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Registered Email (Read-Only)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 8683979659"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Profile Avatar URL
                  </label>
                  <input
                    type="text"
                    value={editPhotoUrl}
                    onChange={(e) => setEditPhotoUrl(e.target.value)}
                    placeholder="/images/dev-sharma.jpg"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>

                {/* 4-Field Address Builder & Geocoding & GPS 2km Range */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>Address Builder &amp; 2km GPS Verification</span>
                    </span>
                    {editIsLocationVerified ? (
                      <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>GPS 2km Verified ({editDistanceKm ?? 0} km)</span>
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </div>

                  {/* 4 Address Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Village / Local Address / Colony</label>
                      <input
                        type="text"
                        value={editLocalAddress}
                        onChange={(e) => setEditLocalAddress(e.target.value)}
                        placeholder="e.g. Prakash Vihar Colony"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">District</label>
                      <input
                        type="text"
                        value={editDistrict}
                        onChange={(e) => setEditDistrict(e.target.value)}
                        placeholder="e.g. Palwal"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">State</label>
                      <input
                        type="text"
                        value={editState}
                        onChange={(e) => setEditState(e.target.value)}
                        placeholder="e.g. Haryana"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Pincode (6 digits)</label>
                      <input
                        type="text"
                        value={editPincode}
                        onChange={(e) => setEditPincode(e.target.value)}
                        placeholder="e.g. 121102"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                      />
                    </div>
                  </div>

                  {/* Combined Live Address & Search Location from Address Button */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 bg-slate-100 rounded-xl p-2.5 border border-slate-200 text-xs">
                    <div className="flex-1 truncate">
                      <span className="font-bold text-slate-600">Combined: </span>
                      <span className="font-semibold text-slate-900">
                        {buildFormattedAddress(editLocalAddress, editDistrict, editState, editPincode) || 'Fill address fields above'}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isSearchingAddressLocation}
                      onClick={handleSearchLocationFromAddress}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold rounded-lg text-[11px] transition flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
                    >
                      <Compass className={`w-3.5 h-3.5 ${isSearchingAddressLocation ? 'animate-spin' : ''}`} />
                      <span>{isSearchingAddressLocation ? 'Searching Location...' : '🔍 Search Location from Address'}</span>
                    </button>
                  </div>

                  {/* Google Maps URL / Share Link (supports shortened maps.app.goo.gl) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-[10px] font-bold text-slate-600">
                        Google Maps Share Link or Map URL (e.g. https://maps.app.goo.gl/...)
                      </label>
                      {editGoogleMapLocation && (
                        <a
                          href={editGoogleMapLocation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-blue-600 hover:underline font-bold flex items-center gap-0.5"
                        >
                          <span>Open Map</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <input
                      type="text"
                      value={editGoogleMapLocation}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditGoogleMapLocation(val);
                        const coords = parseGoogleMapsLocation(val);
                        if (coords) {
                          setEditLatitude(coords.latitude.toFixed(6));
                          setEditLongitude(coords.longitude.toFixed(6));
                        }
                      }}
                      placeholder="e.g. https://maps.app.goo.gl/ay3PNWXtb1qq1515A or https://maps.google.com/?q=28.2298,77.3142"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-mono"
                    />
                  </div>

                  {/* Direct Latitude & Longitude Coordinates Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Latitude (e.g. 28.229811)</label>
                      <input
                        type="text"
                        value={editLatitude}
                        onChange={(e) => {
                          const lat = e.target.value;
                          setEditLatitude(lat);
                          if (lat && editLongitude) {
                            setEditGoogleMapLocation(`https://maps.google.com/?q=${lat},${editLongitude}`);
                          }
                        }}
                        placeholder="28.229811"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-600 mb-1">Longitude (e.g. 77.314282)</label>
                      <input
                        type="text"
                        value={editLongitude}
                        onChange={(e) => {
                          const lon = e.target.value;
                          setEditLongitude(lon);
                          if (editLatitude && lon) {
                            setEditGoogleMapLocation(`https://maps.google.com/?q=${editLatitude},${lon}`);
                          }
                        }}
                        placeholder="77.314282"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none font-mono"
                      />
                    </div>
                  </div>

                  {/* Detect 2km Range Verification Button */}
                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={isGpsDetecting}
                      onClick={handleDetect2kmRange}
                      className="w-full py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 active:scale-98 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Navigation className={`w-4 h-4 ${isGpsDetecting ? 'animate-spin' : ''}`} />
                      <span>{isGpsDetecting ? 'Detecting Device GPS & Calculating Distance...' : '📡 Detect Device GPS & Verify 2km Range'}</span>
                    </button>
                  </div>

                  {/* GPS Verification Status Alert */}
                  {gpsProfileMsg && (
                    <div
                      className={`p-3 rounded-xl text-xs flex items-center gap-2.5 ${
                        gpsProfileMsg.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {gpsProfileMsg.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                      )}
                      <span className="font-semibold">{gpsProfileMsg.text}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow-md shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>{profileSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Change Account Password</h3>
                  <p className="text-xs text-slate-500">Update your secure login password on Supabase authentication.</p>
                </div>
              </div>

              {passwordMessage && (
                <div
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    passwordMessage.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}
                >
                  {passwordMessage.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center justify-center gap-2"
                  >
                    <KeyRound className="w-4 h-4" />
                    <span>{passwordSaving ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: SECURITY TOKENS & PUBLIC MIRRORS */}
        {/* ------------------------------------------------------------- */}
        {activeMenuTab === 'security' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Anti-Scraping Security &amp; Keyed Public Links</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Every faculty profile is protected by a 20-character anti-scraping key to prevent unauthorized bots and scrapers.
              </p>
            </div>

            {existingProfile ? (
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    20-Character Security Key
                  </span>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-mono font-bold text-indigo-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
                      {accessKey}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(accessKey, 'Security Token')}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Public Live Endpoints</h4>
                  
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">📄 Master Resume</span>
                      <span className="text-[11px] text-blue-600 font-mono break-all">{resumeKeyedUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(resumeKeyedUrl, 'Master Resume Link')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">🎥 Video Lectures Page</span>
                      <span className="text-[11px] text-blue-600 font-mono break-all">{videosKeyedUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(videosKeyedUrl, 'Videos Link')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">🖼️ Photo Demonstration Gallery</span>
                      <span className="text-[11px] text-blue-600 font-mono break-all">{galleryKeyedUrl}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(galleryKeyedUrl, 'Gallery Link')}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No faculty profile selected.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
