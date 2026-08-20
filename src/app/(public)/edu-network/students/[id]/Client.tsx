'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, MapPin, Building2, ShieldCheck, Award, Mail, Share2,
  ChevronLeft, Eye, EyeOff, Lock, Globe, Users, Download, FileText,
  Code, Cpu, CheckCircle2, Star, Plus, Upload, X, Check, Filter,
  Settings, UserCheck, BookOpen, Layers, Terminal, Database, HelpCircle
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import { StudentItem, StudentProjectItem, ProjectFileItem, ALL_STUDENTS, getStudentById } from '@/lib/eduNetworkData';

interface StudentProfileClientProps {
  studentId: string;
}

export default function StudentProfileClient({ studentId }: StudentProfileClientProps) {
  const initialStudent = getStudentById(studentId) || ALL_STUDENTS[0];

  // Local mutable state so user can interactively toggle privacy and file visibilities
  const [student, setStudent] = useState<StudentItem>(initialStudent);
  const [isCopied, setIsCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Modal State for uploading a new project / file
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedProjectForUpload, setSelectedProjectForUpload] = useState<string>(
    initialStudent.projects?.[0]?.id || ''
  );
  const [newFileForm, setNewFileForm] = useState({
    name: '',
    type: 'pdf' as ProjectFileItem['type'],
    visibility: 'public' as ProjectFileItem['visibility'],
  });

  // Modal State for Mentoring / Contact
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [contactSuccess, setContactSuccess] = useState(false);

  const showToast = (message: string) => {
    setActiveToast(message);
    setTimeout(() => {
      setActiveToast(null);
    }, 3000);
  };

  // Toggle Profile-level Visibility
  const handleProfileVisibilityChange = (newVisibility: 'public' | 'private' | 'followers') => {
    setStudent((prev) => ({
      ...prev,
      profileVisibility: newVisibility,
    }));
    showToast(`Profile visibility updated to "${newVisibility.toUpperCase()}"!`);
  };

  // Toggle Contact Details Privacy
  const handleToggleContactPrivacy = () => {
    setStudent((prev) => {
      const updated = !prev.showContactInfo;
      showToast(
        updated
          ? 'Contact details are now visible to verified institutions!'
          : 'Contact details hidden from public view.'
      );
      return {
        ...prev,
        showContactInfo: updated,
      };
    });
  };

  // Granular File-level Visibility Change
  const handleFileVisibilityChange = (
    projectId: string,
    fileId: string,
    newVisibility: 'public' | 'private' | 'followers'
  ) => {
    setStudent((prev) => {
      const updatedProjects = prev.projects?.map((proj) => {
        if (proj.id !== projectId) return proj;
        const updatedFiles = proj.files?.map((f) => {
          if (f.id !== fileId) return f;
          return { ...f, visibility: newVisibility };
        });
        return { ...proj, files: updatedFiles };
      });
      return { ...prev, projects: updatedProjects };
    });
    showToast(`File permissions updated to: ${newVisibility.toUpperCase()}`);
  };

  // Add a new file to project
  const handleAddFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileForm.name) return;

    const newFile: ProjectFileItem = {
      id: `f-${Date.now()}`,
      name: newFileForm.name,
      type: newFileForm.type,
      size: '2.1 MB',
      visibility: newFileForm.visibility,
      lastUpdated: 'Just now',
      url: '#',
    };

    setStudent((prev) => {
      const updatedProjects = prev.projects?.map((proj) => {
        if (proj.id !== selectedProjectForUpload) return proj;
        return {
          ...proj,
          files: [newFile, ...(proj.files || [])],
        };
      });
      return { ...prev, projects: updatedProjects };
    });

    setIsUploadModalOpen(false);
    setNewFileForm({ name: '', type: 'pdf', visibility: 'public' });
    showToast('New project file added with custom visibility rules!');
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: `${student.name} - STEM Projects Portfolio`,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setTimeout(() => {
      setContactSuccess(false);
      setIsContactModalOpen(false);
      setContactForm({ name: '', email: '', message: '' });
    }, 1800);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#F8FAFC] pb-24 text-gray-800">
        
        {/* ── TOAST NOTIFICATION ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{activeToast}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BREADCRUMB ──────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-200/90 py-3 px-4 sticky top-0 z-20 shadow-2xs">
          <div className="container mx-auto max-w-6xl flex items-center justify-between text-xs">
            <Link
              href="/edu-network?tab=students"
              className="inline-flex items-center gap-1.5 text-gray-600 hover:text-amber-700 font-bold transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Student Innovators Directory</span>
            </Link>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-gray-700 font-bold rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Link Copied!' : 'Share Portfolio'}</span>
            </button>
          </div>
        </div>

        {/* ── STUDENT HERO & PRIVACY MANAGEMENT CARD ──────────────────────────── */}
        <section className="container mx-auto px-4 max-w-6xl mt-6">
          <div className="bg-white rounded-3xl border border-gray-200/90 shadow-sm p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/50 via-orange-50/40 to-transparent pointer-events-none rounded-bl-full" />

            <div className="flex flex-col md:flex-row items-start gap-6 relative z-10">
              
              {/* Avatar & Badges */}
              <div className="relative shrink-0 mx-auto md:mx-0">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://images.unsplash.com/photo-1539571696357?w=300&auto=format&fit=crop";
                  }}
                />
                {student.verified && (
                  <div
                    className="absolute -bottom-2 -right-2 bg-amber-500 text-white p-1.5 rounded-full border-2 border-white shadow-xs"
                    title="Verified Student Innovator"
                  >
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                )}
              </div>

              {/* Details & Live Privacy Controls */}
              <div className="flex-1 space-y-3 text-center md:text-left">
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 text-xs font-black uppercase rounded-full">
                    {student.classGrade}
                  </span>
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-800 border border-purple-200 text-[11px] font-bold rounded-full flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>{student.topProject}</span>
                  </span>
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                    {student.name}
                  </h1>
                  <p className="text-xs sm:text-sm font-bold text-gray-600 mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="text-amber-900 flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-amber-700" />
                      {student.schoolCollege}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {student.city}, {student.state} ({student.pincode})
                    </span>
                  </p>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                  {student.bio}
                </p>

                {/* ── PRIVACY SETTINGS BANNER (USER CUSTOMIZABLE) ──────────────── */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4 text-xs space-y-2 mt-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-black text-gray-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                      <Settings className="w-3.5 h-3.5 text-purple-700" />
                      <span>Privacy & Visibility Control</span>
                    </span>

                    {/* Profile Visibility Switcher */}
                    <div className="inline-flex items-center bg-white border border-gray-200 rounded-xl p-0.5 shadow-2xs">
                      <button
                        onClick={() => handleProfileVisibilityChange('public')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                          student.profileVisibility === 'public'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Globe className="w-3 h-3" />
                        <span>Public</span>
                      </button>
                      <button
                        onClick={() => handleProfileVisibilityChange('followers')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                          student.profileVisibility === 'followers'
                            ? 'bg-purple-600 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Users className="w-3 h-3" />
                        <span>Followers Only</span>
                      </button>
                      <button
                        onClick={() => handleProfileVisibilityChange('private')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                          student.profileVisibility === 'private'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        <span>Private</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60 text-[11px] text-gray-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={student.showContactInfo}
                        onChange={handleToggleContactPrivacy}
                        className="w-3.5 h-3.5 text-amber-600 rounded"
                      />
                      <span>Allow verified schools & mentors to contact me directly</span>
                    </label>

                    <span className="text-[10px] text-gray-400 font-medium">
                      Status: {student.profileVisibility.toUpperCase()} • Contact: {student.showContactInfo ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>

                {/* Profile Actions */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsFollowing(!isFollowing);
                      showToast(isFollowing ? 'Unfollowed innovator' : 'Following innovator! You can now view followers-only project files.');
                    }}
                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-slate-200 text-gray-800'
                        : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{isFollowing ? 'Following (Connected)' : '+ Follow Innovator'}</span>
                  </button>

                  <button
                    onClick={() => setIsContactModalOpen(true)}
                    className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-gray-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-600" />
                    <span>Mentor / Message</span>
                  </button>

                  <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Project File</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ── MAIN CONTENT GRID ────────────────────────────────────────────────── */}
        <section className="container mx-auto px-4 max-w-6xl mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Content Area: STEM Projects & File Vault (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Header Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>STEM Inventions & Project Vault ({student.projects?.length || 0})</span>
                  </h2>
                  <p className="text-xs text-gray-500">
                    Each prototype includes verifiable hardware schematics, research PDFs, and code repositories with granular access settings.
                  </p>
                </div>

                <button
                  onClick={() => setIsUploadModalOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-500 shadow-2xs flex items-center gap-1 shrink-0"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload File</span>
                </button>
              </div>

              {/* Projects List */}
              {student.projects?.map((proj) => (
                <div
                  key={proj.id}
                  className="bg-white rounded-3xl p-6 border border-gray-200/90 shadow-sm space-y-5 relative overflow-hidden"
                >
                  
                  {/* Top Project Header */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 text-[10px] font-black uppercase rounded-full">
                          {proj.category}
                        </span>
                        <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-300 text-[10px] font-bold rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{proj.status}</span>
                        </span>
                      </div>
                      <h3 className="text-lg font-black text-gray-900 leading-snug">
                        {proj.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-xl text-xs font-black">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{proj.starsCount} Stars</span>
                      </span>
                    </div>
                  </div>

                  {/* Award Notice */}
                  {proj.award && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl text-xs text-amber-950 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-600 shrink-0" />
                      <span className="font-bold">{proj.award}</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-gray-700 leading-relaxed">
                    {proj.description}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 text-gray-700 text-[11px] font-bold rounded-lg border border-gray-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* ── PROJECT FILE VAULT WITH GRANULAR PRIVACY CONTROLS ──────── */}
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black uppercase text-gray-700 tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-purple-700" />
                        <span>Attached Project Files & Research Vault</span>
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {proj.files.length} Files Attached
                      </span>
                    </div>

                    <div className="space-y-2">
                      {proj.files.map((file) => {
                        const canView =
                          file.visibility === 'public' ||
                          (file.visibility === 'followers' && isFollowing) ||
                          file.visibility === 'private';

                        return (
                          <div
                            key={file.id}
                            className="p-3 rounded-2xl bg-slate-50 border border-gray-200/80 hover:bg-slate-100/80 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                          >
                            
                            {/* File Info */}
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-xs shrink-0">
                                {file.type === 'pdf' ? (
                                  <FileText className="w-4 h-4" />
                                ) : file.type === 'code' ? (
                                  <Code className="w-4 h-4" />
                                ) : file.type === 'cad' ? (
                                  <Cpu className="w-4 h-4" />
                                ) : file.type === 'dataset' ? (
                                  <Database className="w-4 h-4" />
                                ) : (
                                  <Terminal className="w-4 h-4" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="font-bold text-gray-900 truncate">
                                  {file.name}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                  {file.size} • Updated {file.lastUpdated}
                                </p>
                              </div>
                            </div>

                            {/* Visibility Tag & Interactive Privacy Dropdown */}
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                              
                              {/* Privacy Status Pill */}
                              <div className="relative">
                                <select
                                  value={file.visibility}
                                  onChange={(e) =>
                                    handleFileVisibilityChange(
                                      proj.id,
                                      file.id,
                                      e.target.value as any
                                    )
                                  }
                                  aria-label={`Visibility for ${file.name}`}
                                  className={`px-2.5 py-1 rounded-xl text-[11px] font-black outline-none border cursor-pointer ${
                                    file.visibility === 'public'
                                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                      : file.visibility === 'followers'
                                      ? 'bg-purple-50 text-purple-800 border-purple-300'
                                      : 'bg-rose-50 text-rose-800 border-rose-300'
                                  }`}
                                >
                                  <option value="public">🌐 Public Access</option>
                                  <option value="followers">👥 Followers Only</option>
                                  <option value="private">🔒 Private (Draft)</option>
                                </select>
                              </div>

                              {/* Download Button */}
                              {file.visibility === 'followers' && !isFollowing ? (
                                <button
                                  onClick={() => {
                                    setIsFollowing(true);
                                    showToast('Followed innovator! Download unlocked.');
                                  }}
                                  className="px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1"
                                >
                                  <Lock className="w-3 h-3" />
                                  <span>Follow to Unlock</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => showToast(`Downloaded "${file.name}"`)}
                                  className="px-2.5 py-1 bg-white hover:bg-slate-200 text-gray-800 border border-gray-200 rounded-xl text-[11px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                                >
                                  <Download className="w-3 h-3 text-gray-600" />
                                  <span>Download</span>
                                </button>
                              )}

                            </div>

                          </div>
                        );
                      })}
                    </div>

                  </div>

                </div>
              ))}

            </div>

            {/* Right Sidebar: Innovator Stats & Badges (4 Cols) */}
            <aside className="lg:col-span-4 space-y-5 lg:sticky lg:top-20">
              
              {/* Quick Stats Card */}
              <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-rose-700 text-white rounded-3xl p-6 shadow-md space-y-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-200">
                  <Award className="w-4 h-4" />
                  <span>Innovator Lab Metrics</span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
                    <p className="text-2xl font-black">{student.projectsCount}</p>
                    <p className="text-[11px] text-amber-100 font-bold">Hardware Projects</p>
                  </div>
                  <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-xs">
                    <p className="text-2xl font-black">{student.experimentsCompleted}</p>
                    <p className="text-[11px] text-amber-100 font-bold">Virtual Simulations</p>
                  </div>
                </div>

                <div className="pt-2 text-xs text-amber-100 space-y-1">
                  <p className="font-bold text-white">Top Field of Interest:</p>
                  <p className="text-[11px]">{student.interests.join(' • ')}</p>
                </div>
              </div>

              {/* Verified Badges */}
              <div className="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-2xs space-y-3 text-xs">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-gray-900">National Science Fair Badges</h4>
                </div>
                <div className="space-y-2">
                  {student.badges.map((badge, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2 text-[11px] font-bold text-gray-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>

            </aside>

          </div>
        </section>

        {/* ── MODAL: UPLOAD NEW PROJECT FILE ──────────────────────────────────── */}
        <AnimatePresence>
          {isUploadModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs"
              >
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                    Project Asset Vault
                  </span>
                  <h3 className="text-base font-black text-gray-900">
                    Attach New File to Prototype
                  </h3>
                </div>

                <form onSubmit={handleAddFileSubmit} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">Target Project</label>
                    <select
                      value={selectedProjectForUpload}
                      onChange={(e) => setSelectedProjectForUpload(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none"
                    >
                      {student.projects?.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">File Name & Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. PCB_Schematic_KiCAD_v3.pdf"
                      value={newFileForm.name}
                      onChange={(e) => setNewFileForm({ ...newFileForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">File Category</label>
                      <select
                        value={newFileForm.type}
                        onChange={(e) => setNewFileForm({ ...newFileForm, type: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none"
                      >
                        <option value="pdf">Research PDF</option>
                        <option value="code">Source Code</option>
                        <option value="cad">3D CAD Model</option>
                        <option value="circuit">Circuit Diagram</option>
                        <option value="dataset">Excel Dataset</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Privacy Level</label>
                      <select
                        value={newFileForm.visibility}
                        onChange={(e) => setNewFileForm({ ...newFileForm, visibility: e.target.value as any })}
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none font-bold text-purple-900"
                      >
                        <option value="public">🌐 Public (All)</option>
                        <option value="followers">👥 Followers Only</option>
                        <option value="private">🔒 Private (Draft)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl text-xs shadow-md transition-all mt-2"
                  >
                    Attach File to Portfolio
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL: MENTOR / CONNECT WITH STUDENT ─────────────────────────────── */}
        <AnimatePresence>
          {isContactModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative text-xs"
              >
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider">
                    Student Mentorship Connect
                  </span>
                  <h3 className="text-base font-black text-gray-900">
                    Send Message to {student.name}
                  </h3>
                </div>

                {contactSuccess ? (
                  <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="text-sm font-black text-emerald-900">Message Delivered!</h4>
                    <p className="text-xs text-emerald-700">
                      Your mentorship message has been forwarded to {student.name}'s verified school coordinator.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Name / Organization *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. Verma (Lab Mentor)"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Your Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="mentor@institution.edu.in"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-700 mb-1">Mentorship Note / Project Feedback</label>
                      <textarea
                        rows={3}
                        required
                        placeholder="Provide feedback on the prototype or offer collaborative guidance..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-xl outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl text-xs shadow-md transition-all mt-2"
                    >
                      Send Mentorship Note
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
