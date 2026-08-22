'use client';

import React, { useState } from 'react';
import {
  X, User, Lock, Palette, Camera, Check,
  Shield, Eye, EyeOff, Sparkles, Moon, Sun,
  Smartphone, Mail, Save, KeyRound, Image as ImageIcon
} from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import { AdminRole } from '../types';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
];

const THEME_OPTIONS = [
  { id: 'slate', name: 'Dark Slate (Default)', bg: 'bg-slate-900 border-slate-700', badge: 'bg-purple-600' },
  { id: 'indigo', name: 'Cyberpunk Indigo', bg: 'bg-indigo-950 border-indigo-700', badge: 'bg-indigo-500' },
  { id: 'emerald', name: 'Emerald Laboratory', bg: 'bg-emerald-950 border-emerald-700', badge: 'bg-emerald-500' },
  { id: 'light', name: 'Clean Crisp Light', bg: 'bg-white border-slate-300 text-slate-900', badge: 'bg-blue-600' },
];

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ isOpen, onClose }) => {
  const { currentAdmin, currentRole, addAuditLog } = useAdminAuth();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'theme'>('profile');
  
  // Profile State
  const [name, setName] = useState(currentAdmin?.name || 'Administrator');
  const [email, setEmail] = useState(currentAdmin?.email || 'super@123');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [bio, setBio] = useState('CSEEL Senior Governance Administrator supervising departmental operations across India.');
  const [avatar, setAvatar] = useState(currentAdmin?.avatar || PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  // Password State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);

  // Theme State
  const [selectedTheme, setSelectedTheme] = useState('slate');
  const [themeSaved, setThemeSaved] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('cseel_admin_custom_name', name);
      localStorage.setItem('cseel_admin_custom_avatar', avatar);
    } catch {}
    setProfileSaved(true);
    addAuditLog('UPDATED_PROFILE', 'overview', `Admin ${name} updated personal profile details & avatar.`);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess(false);

    if (currentPass !== 'Dev@12345' && currentPass !== currentAdmin.password) {
      setPassError('Current password verification failed. Please enter your valid current password.');
      return;
    }
    if (newPass.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassError('New passwords do not match.');
      return;
    }

    try {
      localStorage.setItem('cseel_admin_custom_password', newPass);
    } catch {}

    setPassSuccess(true);
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    addAuditLog('CHANGED_PASSWORD', 'overview', `Admin ${name} successfully changed master account credentials.`);
    setTimeout(() => setPassSuccess(false), 3000);
  };

  const handleSaveTheme = (themeId: string) => {
    setSelectedTheme(themeId);
    try {
      localStorage.setItem('cseel_admin_theme', themeId);
    } catch {}
    setThemeSaved(true);
    addAuditLog('THEME_CHANGED', 'overview', `Admin theme switched to ${themeId}.`);
    setTimeout(() => setThemeSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[600] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in-50 duration-150">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                Admin Profile & Governance Settings
              </h3>
              <p className="text-[11px] text-slate-500">
                Manage your administrator profile, security keys, photo & dashboard aesthetics.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 pt-3 gap-3 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Photo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('theme')}
            className={`pb-3 px-2 flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'theme'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Theme & Style</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          
          {/* TAB 1: PROFILE & PHOTO */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Profile Photo Uploader / Presets */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <label className="font-black text-slate-800 dark:text-slate-200 block text-xs">
                  Admin Profile Picture & Avatar
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shadow-md"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <p className="text-[11px] text-slate-500">
                      Select a predefined executive avatar or paste any custom image URL:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_AVATARS.map((p, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(p)}
                          className={`w-7 h-7 rounded-lg overflow-hidden border-2 transition-all ${
                            avatar === p ? 'border-purple-600 scale-110 shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={p} alt="Preset" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Custom Photo URL Input */}
                <div className="pt-2">
                  <input
                    type="url"
                    value={customAvatarUrl}
                    onChange={(e) => {
                      setCustomAvatarUrl(e.target.value);
                      if (e.target.value) setAvatar(e.target.value);
                    }}
                    placeholder="Or paste custom image URL (https://...)"
                    className="w-full px-3 py-2 text-xs border rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
                  />
                </div>
              </div>

              {/* Personal Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Email / Username</label>
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl font-bold bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Administrative Role</label>
                  <input
                    type="text"
                    readOnly
                    value={currentRole.toUpperCase()}
                    className="w-full px-3 py-2 border rounded-xl font-mono font-bold bg-slate-100 dark:bg-slate-800 text-purple-600 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Executive Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                {profileSaved ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1 text-xs animate-bounce">
                    <Check className="w-4 h-4" /> Profile Updated Successfully!
                  </span>
                ) : <span />}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleSavePassword} className="space-y-4 max-w-md mx-auto">
              
              {passError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
                  {passError}
                </div>
              )}

              {passSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Master Administrator Password Updated!</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Current Password *</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password (Dev@12345)"
                    className="w-full pl-3 pr-10 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">New Password *</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter minimum 6 characters"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">Confirm New Password *</label>
                <input
                  type={showPass ? 'text' : 'password'}
                  required
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-2 border rounded-xl bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 font-bold"
                />
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </button>
              </div>

            </form>
          )}

          {/* TAB 3: THEME & STYLER */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 dark:text-white">
                  Dashboard Aesthetic & Color Theme
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Select the visual tone for the administrative governance center and department workspaces:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEME_OPTIONS.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleSaveTheme(t.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${t.bg} ${
                      selectedTheme === t.id ? 'border-purple-500 shadow-md ring-2 ring-purple-500/20' : 'border-slate-200 dark:border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full ${t.badge}`} />
                      <span className="font-bold text-xs">{t.name}</span>
                    </div>
                    {selectedTheme === t.id && (
                      <Check className="w-4 h-4 text-purple-400" />
                    )}
                  </div>
                ))}
              </div>

              {themeSaved && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Theme preference applied and saved!</span>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default AdminSettingsModal;
