'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, MapPin, CheckCircle2, GraduationCap, School, ShieldCheck } from 'lucide-react';

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const UserProfileModal: React.FC = () => {
  const { user, userProfile, isProfileModalOpen, setIsProfileModalOpen, saveUserProfile } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<AppRole>('teacher');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      const initialName =
        userProfile?.displayName ||
        user.displayName ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        (user.email && !user.email.includes('anonymous') ? user.email.split('@')[0] : '');

      setFullName(initialName || '');
      setRole((userProfile?.role || user.user_metadata?.role || 'teacher') as AppRole);
      setState(userProfile?.state || user.user_metadata?.state || '');
      setDistrict(userProfile?.district || user.user_metadata?.district || '');
      setPincode(userProfile?.pincode || user.user_metadata?.pincode || '');
      setPhone(userProfile?.phone || user.user_metadata?.phone || '');
    }
  }, [user, userProfile, isProfileModalOpen]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = fullName.trim();
    if (!cleanName) {
      toast({ title: 'Full Name is required', variant: 'destructive' });
      return;
    }
    if (!state) {
      toast({ title: 'Please select your state', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const res = await saveUserProfile({
      displayName: cleanName,
      role,
      state: state.trim(),
      district: district.trim(),
      pincode: pincode.trim(),
      phone: phone.trim(),
    });
    setSaving(false);

    if (res.success) {
      toast({
        title: 'Profile Saved Successfully',
        description: `Welcome, ${cleanName}! Your profile details are now active.`,
      });
      setIsProfileModalOpen(false);
    } else {
      toast({
        title: 'Failed to Save Profile',
        description: res.error || 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
      <DialogContent className="max-w-md w-full p-0 overflow-hidden rounded-2xl bg-white border border-[#dadce0] shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-2 text-left">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#e8f0fe] text-[#0b57d0]">
              <User className="w-4 h-4" />
            </span>
            <DialogTitle className="text-xl font-bold text-[#1f1f1f]">
              {userProfile?.displayName ? 'Edit Profile & Details' : 'Complete Your Profile'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-[#5f6368]">
            This name and address will permanently represent your account across all sign-in methods.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2 space-y-4">
          {/* Email badge */}
          <div className="flex items-center justify-between p-2.5 bg-[#f8f9fa] rounded-xl border border-[#e8eaed] text-xs">
            <div className="truncate">
              <span className="text-[#5f6368] block text-[10px] uppercase font-bold tracking-wider">Account Email</span>
              <span className="font-semibold text-[#202124] truncate block">{user.email}</span>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#137333] bg-[#e6f4ea] px-2 py-0.5 rounded-full shrink-0">
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified</span>
            </span>
          </div>

          {/* Full Name */}
          <div className="space-y-1">
            <Label htmlFor="profile-fullname" className="text-xs font-semibold text-[#202124]">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="profile-fullname"
              type="text"
              placeholder="e.g. Dr. Ramesh Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="h-10 text-sm border-[#dadce0] focus-visible:ring-1 focus-visible:ring-[#0b57d0]"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#202124]">
              I am a <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'teacher'
                    ? 'border-[#0b57d0] bg-[#e8f0fe] text-[#0b57d0] shadow-sm'
                    : 'border-[#dadce0] bg-white text-[#5f6368] hover:bg-gray-50'
                }`}
              >
                <User className="w-4 h-4 mb-1" />
                <span>Educator</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'student'
                    ? 'border-[#0b57d0] bg-[#e8f0fe] text-[#0b57d0] shadow-sm'
                    : 'border-[#dadce0] bg-white text-[#5f6368] hover:bg-gray-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 mb-1" />
                <span>Student</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('organisation')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                  role === 'organisation'
                    ? 'border-[#0b57d0] bg-[#e8f0fe] text-[#0b57d0] shadow-sm'
                    : 'border-[#dadce0] bg-white text-[#5f6368] hover:bg-gray-50'
                }`}
              >
                <School className="w-4 h-4 mb-1" />
                <span>School / Org</span>
              </button>
            </div>
          </div>

          {/* State & District Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="profile-state" className="text-xs font-semibold text-[#202124]">
                State <span className="text-red-500">*</span>
              </Label>
              <select
                id="profile-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
                className="w-full h-10 px-2.5 text-xs rounded-md border border-[#dadce0] bg-white text-[#202124] focus:outline-none focus:ring-1 focus:ring-[#0b57d0]"
              >
                <option value="">Select State</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="profile-district" className="text-xs font-semibold text-[#202124]">
                District
              </Label>
              <Input
                id="profile-district"
                type="text"
                placeholder="e.g. Gurugram"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="h-10 text-xs border-[#dadce0] focus-visible:ring-1 focus-visible:ring-[#0b57d0]"
              />
            </div>
          </div>

          {/* Pincode & Phone Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="profile-pincode" className="text-xs font-semibold text-[#202124]">
                Pincode
              </Label>
              <Input
                id="profile-pincode"
                type="text"
                maxLength={6}
                placeholder="e.g. 122001"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="h-10 text-xs border-[#dadce0] focus-visible:ring-1 focus-visible:ring-[#0b57d0]"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="profile-phone" className="text-xs font-semibold text-[#202124]">
                Phone (Optional)
              </Label>
              <Input
                id="profile-phone"
                type="tel"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 text-xs border-[#dadce0] focus-visible:ring-1 focus-visible:ring-[#0b57d0]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            {userProfile?.displayName && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsProfileModalOpen(false)}
                disabled={saving}
                className="text-xs text-[#5f6368] hover:text-[#202124] h-9"
              >
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#003c6e] hover:bg-[#002b50] text-white font-bold text-xs h-9 px-5 rounded-lg shadow-sm"
            >
              {saving ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...
                </span>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
