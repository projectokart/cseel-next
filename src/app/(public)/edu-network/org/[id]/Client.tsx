'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, MapPin, Mail, Phone, Globe, Star, ShieldCheck, CheckCircle2,
  Briefcase, Heart, MessageSquare, Share2, Send, Plus, Image as ImageIcon,
  ChevronLeft, ChevronRight, Award, Beaker, Users, Calendar, ArrowLeft,
  ThumbsUp, ExternalLink, Check, X, Sparkles, Navigation, Clock, Eye,
  Camera, BookOpen, Microscope, Laptop, Maximize2, Paperclip, FileText,
  Upload, Trash2, Edit3, CheckSquare, Square, Play
} from 'lucide-react';
import PageTransition from '@/components/shared/PageTransition';
import RichVisualEditor from '@/components/shared/RichVisualEditor';
import {
  getOrganizationById, getJobsByOrgId, getPostsByOrgId, getReviewsByOrgId, getOrgLabsByOrgId,
  OrganizationItem, EduJobItem, OrgPostItem, OrgReviewItem, SchoolLabItem
} from '@/lib/eduNetworkData';

interface CampusPhotoItem {
  id: string;
  title: string;
  tag: string;
  image: string;
  description: string;
}

export default function OrgProfileClient({ orgId }: { orgId: string }) {
  const org = getOrganizationById(orgId);
  const orgLabs = getOrgLabsByOrgId(orgId);

  const [activeTab, setActiveTab] = useState<'feed' | 'labs' | 'jobs' | 'reviews' | 'about'>('feed');
  const [selectedLabDetails, setSelectedLabDetails] = useState<SchoolLabItem | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1280);
  const [logoError, setLogoError] = useState(false);
  const [activeLightboxPhoto, setActiveLightboxPhoto] = useState<CampusPhotoItem | null>(null);

  // Social Feed & Rich Posts
  const initialPosts = getPostsByOrgId(orgId);
  const [postsList, setPostsList] = useState<OrgPostItem[]>(initialPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState('');
  const [newPostAttachment, setNewPostAttachment] = useState<{ name: string; size: string } | null>(null);
  const [newPostTags, setNewPostTags] = useState('#STEMEducation #ScienceFair');
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [postId: string]: string }>({});

  // Jobs (Post & Edit)
  const [jobsList, setJobsList] = useState<EduJobItem[]>(getJobsByOrgId(orgId));
  const [selectedJobToApply, setSelectedJobToApply] = useState<EduJobItem | null>(null);
  const [isJobEditorOpen, setIsJobEditorOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  // Job Editor Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    subject: 'Physics' as EduJobItem['subject'],
    roleType: 'Full-Time' as EduJobItem['roleType'],
    shift: 'Day shift (8:00 AM – 3:30 PM)',
    minSalary: '55,000',
    maxSalary: '90,000',
    experience: '2+ Years Experience',
    qualifications: 'M.Sc, B.Ed (NEP-2020 trained preferred)',
    openings: '2',
    description: '<p>We are inviting applications for a passionate <strong>STEM Faculty & Lab Coordinator</strong> to lead our advanced physics & optics laboratory practicals.</p><p><span style="background-color: rgb(254, 240, 138); font-weight: bold;">Key Responsibilities:</span></p><ul><li>Conduct hands-on CBSE/ICSE practical sessions with spectrometers & lasers.</li><li>Mentor student robotics & tinkering club projects.</li></ul>',
    benefits: ['Health insurance', 'Provident Fund', 'Lab allowance'],
    attachmentName: 'Official_Hiring_Notification_2026.pdf',
  });

  // Apply Form State with Resume Upload
  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    qualification: '',
    nepTrained: true,
    labExpertise: 'Optics, Spectrometry & Arduino Sensor Calibration',
    message: '',
    resumeFileName: '',
    resumeFileSize: '',
  });
  const [applySuccess, setApplySuccess] = useState(false);

  // Reviews & Rating
  const [reviewsList, setReviewsList] = useState<OrgReviewItem[]>(getReviewsByOrgId(orgId));
  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReviewForm, setNewReviewForm] = useState({
    name: '',
    role: 'Science Teacher',
    rating: 5,
    comment: '',
  });

  // Campus Gallery Auto-Scroll Ref
  const galleryRef = useRef<HTMLDivElement>(null);
  const [isGalleryPaused, setIsGalleryPaused] = useState(false);

  // Campus Photo Gallery Dataset
  const campusGallery: CampusPhotoItem[] = useMemo(() => [
    {
      id: 'g-1',
      title: 'Advanced Physics & Optics Laboratory',
      tag: 'Physics Lab',
      image: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800&auto=format&fit=crop',
      description: 'Equipped with laser spectrometers, optical benches, prisms, and computerized sensors for senior practicals.',
    },
    {
      id: 'g-2',
      title: 'Chemistry Practical & Synthesis Suite',
      tag: 'Chemistry Lab',
      image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop',
      description: 'Zero-waste fume hoods, titration stations, and analytical balances for safe chemical experiments.',
    },
    {
      id: 'g-3',
      title: 'Central Digital Library & Research Archive',
      tag: 'Central Library',
      image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop',
      description: 'Houses 25,000+ scientific volumes, peer-reviewed journals, and high-speed digital research terminals.',
    },
    {
      id: 'g-4',
      title: 'Principal Desk & Leadership Boardroom',
      tag: 'Principal Desk',
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop',
      description: 'Institutional administration office and committee chambers for academic governance & NEP-2020 planning.',
    },
    {
      id: 'g-5',
      title: 'Atal Tinkering Lab & Robotics Arena',
      tag: 'Robotics & ATL',
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop',
      description: 'State-of-the-art 3D printers, laser cutters, Arduino/Raspberry Pi microcontrollers, and drone arena.',
    },
    {
      id: 'g-6',
      title: 'Molecular Biology & Genetics Suite',
      tag: 'Biology Lab',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop',
      description: 'Compound microscopes, electrophoresis gel tanks, and plant tissue culture incubators.',
    },
    {
      id: 'g-7',
      title: 'Astronomy Dome & Sky Observatory',
      tag: 'Astronomy Dome',
      image: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop',
      description: 'Motorized 8-inch equatorial telescope for celestial tracking and school space club observations.',
    },
    {
      id: 'g-8',
      title: 'Grand Science Auditorium & Concourse',
      tag: 'Main Auditorium',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop',
      description: '1,200-seat plenary hall for national STEM symposiums, student project fairs, and academic keynotes.',
    },
  ], []);

  // Auto-scroll logic for Campus Photo Gallery
  useEffect(() => {
    if (isGalleryPaused || !galleryRef.current) return;
    const interval = setInterval(() => {
      if (galleryRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = galleryRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          galleryRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          galleryRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isGalleryPaused]);

  if (!org) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-gray-900">Organization Not Found</h2>
        <Link href="/edu-network" className="mt-3 text-primary underline text-sm font-bold">
          ← Back to EduNetwork Directory
        </Link>
      </div>
    );
  }

  // Post Handlers
  const handleLikePost = (postId: string) => {
    setPostsList((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = !p.isLiked;
          return { ...p, isLiked, likes: isLiked ? p.likes + 1 : p.likes - 1 };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const post: OrgPostItem = {
      id: `post-custom-${Date.now()}`,
      orgId: org.id,
      authorName: org.name,
      authorLogo: org.logo,
      content: newPostContent,
      image: newPostImage || undefined,
      attachmentName: newPostAttachment?.name,
      attachmentSize: newPostAttachment?.size,
      tags: newPostTags.split(' ').filter(Boolean),
      createdAt: 'Just now',
      likes: 1,
      isLiked: true,
      shares: 0,
      comments: [],
    };

    setPostsList([post, ...postsList]);
    setNewPostContent('');
    setNewPostImage('');
    setNewPostAttachment(null);
    setIsCreatePostOpen(false);
  };

  const handleAddComment = (postId: string) => {
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    setPostsList((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [
              ...p.comments,
              {
                id: `c-${Date.now()}`,
                userName: 'Verified Educator',
                userRole: 'Science Faculty',
                userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
                comment: text,
                createdAt: 'Just now',
              },
            ],
          };
        }
        return p;
      })
    );

    setNewCommentText({ ...newCommentText, [postId]: '' });
  };

  // Job Post / Edit Handlers
  const handleOpenJobEditor = (jobToEdit?: EduJobItem) => {
    if (jobToEdit) {
      setEditingJobId(jobToEdit.id);
      setJobForm({
        title: jobToEdit.title,
        subject: jobToEdit.subject,
        roleType: jobToEdit.roleType,
        shift: jobToEdit.jobShift || 'Day shift (8:00 AM – 3:30 PM)',
        minSalary: jobToEdit.salaryNumMin?.toLocaleString('en-IN') || '55,000',
        maxSalary: jobToEdit.salaryNumMax?.toLocaleString('en-IN') || '90,000',
        experience: jobToEdit.experienceRequired,
        qualifications: jobToEdit.qualifications,
        openings: jobToEdit.openings.toString(),
        description: jobToEdit.description,
        benefits: jobToEdit.benefits || ['Health insurance', 'Provident Fund', 'Lab allowance'],
        attachmentName: jobToEdit.attachmentName || 'Official_Hiring_Notification.pdf',
      });
    } else {
      setEditingJobId(null);
      setJobForm({
        title: '',
        subject: 'Physics',
        roleType: 'Full-Time',
        shift: 'Day shift (8:00 AM – 3:30 PM)',
        minSalary: '55,000',
        maxSalary: '90,000',
        experience: '2+ Years Experience',
        qualifications: 'M.Sc, B.Ed (NEP-2020 trained preferred)',
        openings: '2',
        description: '<p>We are inviting applications for a passionate <strong>STEM Faculty & Lab Coordinator</strong> to lead our advanced physics & optics laboratory practicals.</p><p><span style="background-color: rgb(254, 240, 138); font-weight: bold;">Key Responsibilities:</span></p><ul><li>Conduct hands-on CBSE/ICSE practical sessions with spectrometers & lasers.</li><li>Mentor student robotics & tinkering club projects.</li></ul>',
        benefits: ['Health insurance', 'Provident Fund', 'Lab allowance'],
        attachmentName: 'Official_Hiring_Notification_2026.pdf',
      });
    }
    setIsJobEditorOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title) return;

    const minSal = parseInt(jobForm.minSalary.replace(/[^0-9]/g, '')) || 50000;
    const maxSal = parseInt(jobForm.maxSalary.replace(/[^0-9]/g, '')) || 85000;
    const salaryString = `₹${minSal.toLocaleString('en-IN')} - ₹${maxSal.toLocaleString('en-IN')} a month`;

    if (editingJobId) {
      setJobsList((prev) =>
        prev.map((j) => {
          if (j.id === editingJobId) {
            return {
              ...j,
              title: jobForm.title,
              subject: jobForm.subject,
              roleType: jobForm.roleType,
              jobShift: jobForm.shift,
              salary: salaryString,
              salaryNumMin: minSal,
              salaryNumMax: maxSal,
              experienceRequired: jobForm.experience,
              qualifications: jobForm.qualifications,
              openings: parseInt(jobForm.openings) || 1,
              description: jobForm.description,
              benefits: jobForm.benefits,
              attachmentName: jobForm.attachmentName,
            };
          }
          return j;
        })
      );
    } else {
      const newJobItem: EduJobItem = {
        id: `job-custom-${Date.now()}`,
        orgId: org.id,
        orgName: org.name,
        orgLogo: org.logo,
        orgRating: org.rating,
        title: jobForm.title,
        subject: jobForm.subject,
        roleType: jobForm.roleType,
        jobTypeCategory: 'Permanent / Regular',
        jobShift: jobForm.shift,
        city: org.city,
        state: org.state,
        pincode: org.pincode,
        address: org.address,
        salary: salaryString,
        salaryNumMin: minSal,
        salaryNumMax: maxSal,
        experienceRequired: jobForm.experience,
        qualifications: jobForm.qualifications,
        openings: parseInt(jobForm.openings) || 1,
        postedDate: 'Just now',
        isUrgentlyHiring: true,
        easilyApply: true,
        benefits: jobForm.benefits,
        description: jobForm.description,
        responsibilities: [
          'Lead practical science experiments and student lab sessions.',
          'Mentor students for national Olympiads and science fairs.',
          'Maintain laboratory apparatus safety and digital record logs.'
        ],
        requirements: [
          'Proficiency in hands-on physics/chemistry apparatus handling.',
          'NEP-2020 experiential teaching approach.'
        ],
        attachmentName: jobForm.attachmentName,
        attachmentSize: '1.2 MB',
        verified: true,
      };

      setJobsList([newJobItem, ...jobsList]);
    }

    setIsJobEditorOpen(false);
    setActiveTab('jobs');
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApplySuccess(true);
    setTimeout(() => {
      setApplySuccess(false);
      setSelectedJobToApply(null);
      setApplyForm({
        name: '',
        email: '',
        phone: '',
        experience: '',
        qualification: '',
        nepTrained: true,
        labExpertise: 'Optics & Titrations',
        message: '',
        resumeFileName: '',
        resumeFileSize: '',
      });
    }, 1800);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewForm.name || !newReviewForm.comment) return;

    const rev: OrgReviewItem = {
      id: `rev-${Date.now()}`,
      orgId: org.id,
      userName: newReviewForm.name,
      userRole: newReviewForm.role,
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop',
      rating: newReviewForm.rating,
      comment: newReviewForm.comment,
      date: 'Today',
      verifiedReviewer: true,
    };

    setReviewsList([rev, ...reviewsList]);
    setIsWriteReviewOpen(false);
    setNewReviewForm({ name: '', role: 'Science Teacher', rating: 5, comment: '' });
  };

  const availableBenefitsList = [
    'Health insurance', 'Provident Fund (PF)', 'Lab Equipment Allowance',
    'Paid Sick Time', 'Paid Time Off', 'Faculty Housing Assistance',
    'Commuter Assistance', 'Performance Bonus', 'Olympiad Coaching Incentives'
  ];

  const toggleBenefitPill = (b: string) => {
    setJobForm((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(b)
        ? prev.benefits.filter((item) => item !== b)
        : [...prev.benefits, b],
    }));
  };

  // Helper to render formatted HTML safely
  const renderFormattedHtml = (content: string) => {
    if (!content) return null;
    return (
      <div
        className="prose prose-sm max-w-none text-xs md:text-sm text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  // Fallback Initials
  const orgInitials = org.name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <PageTransition>
      <div className="min-h-screen bg-slate-100/70 pb-24">

        {/* ── BREADCRUMB ──────────────────────────────────────────────────────── */}
        <div className="bg-white border-b border-gray-200 px-4 py-2.5">
          <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1.5 truncate">
              <Link href="/edu-network" className="hover:text-primary font-medium flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> EduNetwork
              </Link>
              <span>/</span>
              <span className="font-semibold text-gray-900 truncate">{org.name}</span>
            </div>
            <span className="text-emerald-600 font-bold flex items-center gap-1 shrink-0">
              <ShieldCheck className="w-4 h-4 text-cyan-500" /> CSEEL Verified
            </span>
          </div>
        </div>

        {/* ── COVER BANNER & PROFILE HEADER ───────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 mt-4">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-md overflow-hidden">
            
            {/* Cover photo */}
            <div className="relative h-48 md:h-64 bg-gradient-to-r from-slate-950 via-slate-900 to-[#003c6e] overflow-hidden">
              <img src={org.bannerImage} alt="" className="w-full h-full object-cover opacity-60" />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/20">
                  {org.type}
                </span>
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-full shadow-xs">
                  {jobsList.length} Active Jobs
                </span>
              </div>
            </div>

            {/* Profile Info Bar */}
            <div className="px-6 pb-6 pt-0 relative">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 md:-mt-20 mb-4">
                
                {/* Avatar Logo with Resilient Fallback */}
                <div className="flex items-end gap-4">
                  <div className="w-28 h-28 md:w-36 md:h-36 rounded-2xl bg-white p-2 border-4 border-white shadow-xl flex-shrink-0 relative overflow-hidden flex items-center justify-center">
                    {!logoError ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        onError={() => setLogoError(true)}
                        className="w-full h-full object-contain rounded-xl"
                      />
                    ) : (
                      <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary to-cyan-600 text-white flex flex-col items-center justify-center font-black">
                        <Building2 className="w-8 h-8 mb-1" />
                        <span className="text-xs font-black">{orgInitials}</span>
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-white p-1 rounded-full shadow-md z-10" title="CSEEL Verified Gold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="space-y-1 pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl md:text-2xl font-black text-gray-900">{org.name}</h1>
                      <CheckCircle2 className="w-5 h-5 text-cyan-500 fill-cyan-500" />
                    </div>
                    <p className="text-xs font-semibold text-gray-500">{org.affiliation} • Est. {org.established}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span>{org.address}, {org.city}, {org.state} - <strong>{org.pincode}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-start md:self-end flex-wrap">
                  <button
                    onClick={() => {
                      setIsFollowing(!isFollowing);
                      setFollowersCount(isFollowing ? followersCount - 1 : followersCount + 1);
                    }}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-300'
                        : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                  >
                    {isFollowing ? <Check className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4" />}
                    <span>{isFollowing ? 'Following' : 'Follow Campus'}</span>
                    <span className="text-[10px] opacity-80">({followersCount})</span>
                  </button>

                  <button
                    onClick={() => setIsCreatePostOpen(true)}
                    className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Create Rich Post</span>
                  </button>

                  <button
                    onClick={() => handleOpenJobEditor()}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Post a Job</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Profile URL copied to clipboard!');
                    }}
                    className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
                    title="Share Profile"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

              </div>

              {/* Stats Ribbon */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-gray-100 text-xs">
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                  <p className="text-base font-black text-gray-900 flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{org.rating} / 5.0</span>
                  </p>
                  <p className="text-[10px] text-gray-500 font-semibold">{reviewsList.length} Public Reviews</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                  <p className="text-base font-black text-primary">{org.stemLabsCount}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Active STEM Labs</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                  <p className="text-base font-black text-purple-600">{org.studentStrength}+</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Student Strength</p>
                </div>
                <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 text-center">
                  <p className="text-base font-black text-emerald-600">{jobsList.length}</p>
                  <p className="text-[10px] text-gray-500 font-semibold">Live Job Openings</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── AUTO-SCROLLING CAMPUS PHOTO GALLERY ──────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="bg-white rounded-3xl p-5 shadow-md border border-gray-200 space-y-3">
            
            {/* Gallery Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">
                    Campus Facilities & Photo Gallery (Auto-Scroll)
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    Explore physics labs, digital libraries, principal desk, robotics arena, and lecture theatres
                  </p>
                </div>
              </div>

              {/* Gallery Next / Prev Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => galleryRef.current?.scrollBy({ left: -320, behavior: 'smooth' })}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shadow-2xs"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => galleryRef.current?.scrollBy({ left: 320, behavior: 'smooth' })}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors shadow-2xs"
                  title="Next Photo"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Horizontal Auto-Scrolling Photo Track */}
            <div
              ref={galleryRef}
              onMouseEnter={() => setIsGalleryPaused(true)}
              onMouseLeave={() => setIsGalleryPaused(false)}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
            >
              {campusGallery.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setActiveLightboxPhoto(photo)}
                  className="w-72 sm:w-80 flex-shrink-0 bg-slate-950 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-200 relative group cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={photo.image}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md text-cyan-300 text-[10px] font-black uppercase rounded-full border border-white/20 shadow-xs flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>{photo.tag}</span>
                      </span>
                    </div>

                    <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-xs">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3.5">
                      <h4 className="text-xs font-black text-white leading-snug group-hover:text-cyan-300 transition-colors">
                        {photo.title}
                      </h4>
                      <p className="text-[10px] text-gray-300 line-clamp-1 mt-0.5 font-medium">
                        {photo.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── PROFILE TABS & MAIN FEED ────────────────────────────────────────── */}
        <div className="max-w-6xl mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Main Content (Tabs: Feed, Jobs, Reviews, About) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Tab Selector */}
              <div className="bg-white rounded-2xl border border-gray-200 p-1 flex items-center shadow-xs overflow-x-auto no-scrollbar">
                {[
                  { id: 'feed', label: `Campus Feed (${postsList.length})`, icon: MessageSquare },
                  { id: 'labs', label: `🔬 CSEEL Labs (${orgLabs.length})`, icon: Microscope },
                  { id: 'jobs', label: `Job Openings (${jobsList.length})`, icon: Briefcase },
                  { id: 'reviews', label: `Ratings & Reviews (${reviewsList.length})`, icon: Star },
                  { id: 'about', label: 'Campus & Map', icon: Building2 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        isActive
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* ── TAB 1: SOCIAL FEED & RICH POSTS ── */}
              {activeTab === 'feed' && (
                <div className="space-y-4">
                  
                  {/* Create a Post Box with Visual WYSIWYG Editor */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-cyan-600" />
                        <h4 className="text-xs font-bold text-gray-900">Share Campus Update with Highlights & Colors</h4>
                      </div>
                      <button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
                      >
                        <span>Open Full Post Studio</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>

                    <RichVisualEditor
                      initialHtml={newPostContent}
                      onChange={(html) => setNewPostContent(html)}
                      placeholder={`Share a science project, lab update, or announcement from ${org.name}... Select text to highlight with yellow/green/cyan!`}
                      minHeight="100px"
                    />

                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 flex-wrap gap-2">
                      <button
                        onClick={() => setIsCreatePostOpen(true)}
                        className="text-xs text-gray-600 font-bold flex items-center gap-1 hover:text-primary transition-colors"
                      >
                        <ImageIcon className="w-4 h-4 text-cyan-600" />
                        <span>Add Photo / PDF / Hashtags</span>
                      </button>
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPostContent.trim()}
                        className="px-5 py-2 bg-primary text-white rounded-full text-xs font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors shadow-xs"
                      >
                        Publish Rich Post
                      </button>
                    </div>
                  </div>

                  {/* Feed Posts List */}
                  {postsList.map((post) => (
                    <div key={post.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                      
                      {/* Post Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 border p-1 shrink-0 flex items-center justify-center">
                            <img src={post.authorLogo} alt="" className="w-full h-full object-contain rounded-lg" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 flex items-center gap-1">
                              <span>{post.authorName}</span>
                              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500" />
                            </h4>
                            <p className="text-[10px] text-gray-400 font-medium">{post.createdAt}</p>
                          </div>
                        </div>
                      </div>

                      {/* Render Visual Formatted HTML Content */}
                      {renderFormattedHtml(post.content)}

                      {/* File / PDF Attachment */}
                      {post.attachmentName && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-primary" />
                            <span>{post.attachmentName}</span>
                            {post.attachmentSize && <span className="text-[10px] text-gray-400">({post.attachmentSize})</span>}
                          </div>
                          <button
                            onClick={() => alert(`Downloading attachment: ${post.attachmentName}`)}
                            className="px-3 py-1 bg-white border border-gray-300 hover:border-primary text-primary text-[11px] font-bold rounded-lg transition-colors"
                          >
                            Download PDF
                          </button>
                        </div>
                      )}

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag, i) => (
                            <span key={i} className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Post Image */}
                      {post.image && (
                        <div className="rounded-xl overflow-hidden border border-gray-100 max-h-80">
                          <img src={post.image} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}

                      {/* Post Reaction Bar */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-600">
                        <button
                          onClick={() => handleLikePost(post.id)}
                          className={`flex items-center gap-1.5 font-bold transition-colors ${
                            post.isLiked ? 'text-red-600' : 'hover:text-red-600'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                          <span>{post.likes} Likes</span>
                        </button>

                        <button
                          onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                          className="flex items-center gap-1.5 font-bold hover:text-primary transition-colors"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.comments.length} Comments</span>
                        </button>

                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/edu-network/org/${org.id}`);
                            alert('Profile link copied!');
                          }}
                          className="flex items-center gap-1.5 font-bold hover:text-primary transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>{post.shares} Shares</span>
                        </button>
                      </div>

                      {/* Comments Drawer */}
                      {activeCommentPostId === post.id && (
                        <div className="pt-3 border-t border-gray-100 space-y-3 bg-gray-50/70 p-3 rounded-xl">
                          <div className="space-y-2">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start gap-2.5 text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                                <img src={comment.userAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-gray-900">{comment.userName}</span>
                                    <span className="text-[9px] text-gray-400">{comment.createdAt}</span>
                                  </div>
                                  <p className="text-[10px] text-primary font-semibold">{comment.userRole}</p>
                                  <p className="text-xs text-gray-700 mt-1">{comment.comment}</p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Comment Input */}
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Write a public comment..."
                              value={newCommentText[post.id] || ''}
                              onChange={(e) => setNewCommentText({ ...newCommentText, [post.id]: e.target.value })}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(post.id); }}
                              className="flex-1 px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg outline-none"
                            />
                            <button
                              onClick={() => handleAddComment(post.id)}
                              className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB: DEDICATED CSEEL LABORATORIES & STEM INFRASTRUCTURE ── */}
              {activeTab === 'labs' && (
                <div className="space-y-5">
                  
                  {/* Labs Header Banner */}
                  <div className="bg-gradient-to-r from-slate-900 via-primary to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
                    <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="relative z-10 space-y-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-cyan-300 text-xs font-bold border border-white/20">
                        <Microscope className="w-3.5 h-3.5" />
                        <span>CSEEL Certified Hands-On STEM Infrastructure</span>
                      </div>
                      <h3 className="text-lg md:text-2xl font-black tracking-tight">
                        State-of-the-Art CSEEL Science Laboratories at {org.name}
                      </h3>
                      <p className="text-xs md:text-sm text-slate-200 max-w-2xl leading-relaxed">
                        Explore our specialized experiential physics, green chemistry, robotics AI, space dome, and molecular biology practical stations aligned with NEP-2020 competency benchmarks.
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-lg border border-emerald-500/30 font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {orgLabs.length} Specialized Labs
                        </span>
                        <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-lg border border-cyan-500/30 font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5" /> CSEEL Level-4 Safety Certified
                        </span>
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-lg border border-amber-500/30 font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> 140+ Practical Experiments
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Individual Laboratory Profile Cards */}
                  <div className="space-y-4">
                    {orgLabs.map((lab) => (
                      <div
                        key={lab.id}
                        className="bg-white rounded-3xl border border-gray-200 p-5 md:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                          
                          {/* Lab Photo with Tag */}
                          <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-xs relative aspect-video bg-slate-900 border border-gray-100">
                            <img src={lab.image} alt={lab.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-2.5 left-2.5">
                              <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-black rounded-lg border border-white/20">
                                {lab.category}
                              </span>
                            </div>
                            <div className="absolute bottom-2.5 left-2.5 right-2.5">
                              <span className="px-2 py-0.5 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-xs truncate">
                                <ShieldCheck className="w-3 h-3 text-cyan-300 shrink-0" />
                                <span className="truncate">{lab.safetyCertification}</span>
                              </span>
                            </div>
                          </div>

                          {/* Lab Details */}
                          <div className="md:col-span-7 space-y-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                  {lab.tag}
                                </span>
                                <span className="text-[10px] text-gray-500 font-semibold">
                                  {lab.gradeLevel}
                                </span>
                              </div>
                              <h4 className="text-base md:text-lg font-black text-gray-900 mt-1">
                                {lab.name}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {lab.description}
                              </p>
                            </div>

                            {/* Incharge & Capacity Meta */}
                            <div className="flex flex-wrap items-center gap-4 text-xs bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 overflow-hidden shrink-0">
                                  <img src={lab.inchargeAvatar} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                  <p className="text-[10px] text-gray-500 font-semibold">Lab In-Charge</p>
                                  <p className="text-xs font-bold text-gray-900">{lab.incharge}</p>
                                </div>
                              </div>
                              <div className="border-l border-gray-200 pl-3">
                                <p className="text-[10px] text-gray-500 font-semibold">Cohort Capacity</p>
                                <p className="text-xs font-bold text-gray-900">{lab.capacity}</p>
                              </div>
                              <div className="border-l border-gray-200 pl-3">
                                <p className="text-[10px] text-gray-500 font-semibold">Live Practicals</p>
                                <p className="text-xs font-bold text-primary">{lab.experimentsAvailable} Experiments</p>
                              </div>
                            </div>

                            {/* Apparatus & Key Equipment Chips */}
                            <div>
                              <p className="text-[11px] font-bold text-gray-700 mb-1.5 flex items-center gap-1">
                                <Beaker className="w-3.5 h-3.5 text-primary" /> Key Apparatus & Standard Equipment:
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {lab.apparatus.map((item, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-slate-100 hover:bg-primary/10 text-gray-800 hover:text-primary border border-gray-200 rounded-md text-[10px] font-semibold transition-colors"
                                  >
                                    ✓ {item}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Lab CTAs */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              <Link
                                href="/simulations"
                                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                              >
                                <Play className="w-3.5 h-3.5" /> Explore Virtual Simulations
                              </Link>
                              <button
                                onClick={() => setSelectedLabDetails(lab)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" /> Full Apparatus Specs
                              </button>
                            </div>

                          </div>

                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

              {/* ── TAB 2: LIVE JOB OPENINGS & JOB POSTING/EDITING ENGINE ── */}
              {activeTab === 'jobs' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                      Faculty & Lab Openings at {org.name} ({jobsList.length})
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenJobEditor()}
                        className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> Post New Job
                      </button>
                      <Link
                        href="/edu-network/jobs"
                        className="text-xs text-primary font-bold underline flex items-center gap-1"
                      >
                        <span>Indeed Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {jobsList.map((job) => (
                    <div key={job.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3 relative">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black uppercase rounded-full">
                              {job.subject}
                            </span>
                            <span className="text-[10px] font-bold text-gray-500">
                              {job.jobTypeCategory || 'Permanent'}
                            </span>
                          </div>
                          <Link href={`/edu-network/jobs/${job.id}`}>
                            <h4 className="text-base font-bold text-gray-900 hover:text-primary transition-colors mt-1">
                              {job.title}
                            </h4>
                          </Link>
                          <p className="text-xs text-gray-500 font-semibold">{job.roleType} • {job.experienceRequired}</p>
                        </div>
                        <div className="text-right">
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black rounded-lg whitespace-nowrap inline-block">
                            {job.salary}
                          </span>
                        </div>
                      </div>

                      {/* Description with real visual highlights */}
                      {renderFormattedHtml(job.description)}

                      {/* Benefits Pills */}
                      {job.benefits && job.benefits.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {job.benefits.map((b, i) => (
                            <span key={i} className="px-2.5 py-0.5 bg-gray-100 text-gray-700 text-[11px] font-semibold rounded-md">
                              ✓ {b}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Official Attachment if available */}
                      {job.attachmentName && (
                        <div className="p-2.5 bg-primary/5 border border-primary/15 rounded-xl flex items-center justify-between text-xs text-primary font-bold">
                          <span className="flex items-center gap-1.5 truncate">
                            <FileText className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{job.attachmentName}</span>
                          </span>
                          <button
                            onClick={() => alert(`Downloading ${job.attachmentName}`)}
                            className="text-[11px] underline shrink-0"
                          >
                            Download Notification
                          </button>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-[11px] text-gray-400 font-bold">Openings: {job.openings} • Posted {job.postedDate}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOpenJobEditor(job)}
                            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold transition-colors flex items-center gap-1"
                            title="Edit Job Details"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit Job</span>
                          </button>
                          <Link
                            href={`/edu-network/jobs/${job.id}`}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-xs font-bold transition-colors"
                          >
                            Job Details
                          </Link>
                          <button
                            onClick={() => setSelectedJobToApply(job)}
                            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-full text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                          >
                            <Send className="w-3 h-3" />
                            <span>Apply with Resume</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── TAB 3: RATINGS & PUBLIC REVIEWS ── */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center p-3 bg-amber-50 rounded-2xl border border-amber-200">
                        <p className="text-3xl font-black text-amber-600">{org.rating}</p>
                        <div className="flex justify-center text-amber-500 my-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold">{reviewsList.length} Verified Reviews</p>
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-sm">Community Feedback & Ratings</h4>
                        <p className="text-xs text-gray-500">Evaluated by teachers, parents, and student innovators across India.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsWriteReviewOpen(true)}
                      className="px-5 py-2.5 bg-primary text-white rounded-full text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors"
                    >
                      Write a Review
                    </button>
                  </div>

                  <div className="space-y-3">
                    {reviewsList.map((rev) => (
                      <div key={rev.id} className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img src={rev.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="text-xs font-bold text-gray-900 flex items-center gap-1">
                                <span>{rev.userName}</span>
                                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 fill-cyan-500" />
                              </p>
                              <p className="text-[10px] text-gray-500">{rev.userRole} • {rev.date}</p>
                            </div>
                          </div>
                          <div className="flex text-amber-500">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-500" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                          "{rev.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── TAB 4: LABS & MAP LOCATION ── */}
              {activeTab === 'about' && (
                <div className="space-y-4">
                  {/* About Details */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                    <h4 className="font-bold text-gray-900 text-sm">About {org.name}</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">{org.description}</p>
                  </div>

                  {/* STEM Facilities */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                    <h4 className="font-bold text-gray-900 text-sm">STEM Laboratory Infrastructure</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {org.facilities.map((fac, i) => (
                        <div key={i} className="bg-cyan-50 border border-cyan-100 p-3 rounded-xl flex items-center gap-2">
                          <Beaker className="w-4 h-4 text-cyan-600 shrink-0" />
                          <span className="text-xs font-bold text-cyan-900">{fac}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Physical Map & Directions */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-3">
                    <h4 className="font-bold text-gray-900 text-sm">Physical Address & Location</h4>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-2 text-xs">
                      <div className="flex items-center gap-2 font-bold text-gray-900">
                        <MapPin className="w-4 h-4 text-primary shrink-0" />
                        <span>{org.address}, {org.city}, {org.state} - {org.pincode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{org.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                        <span>{org.phone}</span>
                      </div>
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${org.name} ${org.city}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Get Driving Directions on Google Maps</span>
                    </a>
                  </div>
                </div>
              )}

            </div>

            {/* Right Sidebar Info Card */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Quick Contact & Verified Box */}
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                  <ShieldCheck className="w-5 h-5 text-cyan-500" />
                  <div>
                    <p className="text-xs font-black text-gray-900 uppercase tracking-wide">CSEEL Verified Campus</p>
                    <p className="text-[10px] text-gray-500">Government & Board Certified</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-600 shrink-0" />
                    <a href={org.website} target="_blank" rel="noreferrer" className="text-primary font-bold underline flex items-center gap-1 truncate">
                      <span>{org.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-600 shrink-0" />
                    <span className="truncate">{org.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>{org.phone}</span>
                  </div>
                </div>

                <a
                  href={`mailto:${org.email}`}
                  className="w-full py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-xs hover:bg-primary/90 transition-colors block text-center"
                >
                  Send Official Inquiry
                </a>
              </div>

              {/* Recent Open Jobs Widget */}
              <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-gray-900">Active Jobs ({jobsList.length})</h4>
                  <Link href="/edu-network/jobs" className="text-[11px] font-bold text-primary underline">
                    Indeed Portal →
                  </Link>
                </div>
                <div className="space-y-2">
                  {jobsList.slice(0, 3).map((j) => (
                    <div key={j.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs space-y-1">
                      <Link href={`/edu-network/jobs/${j.id}`} className="font-bold text-gray-900 hover:text-primary block line-clamp-1">
                        {j.title}
                      </Link>
                      <p className="text-[10px] text-emerald-600 font-bold">{j.salary}</p>
                      <Link
                        href={`/edu-network/jobs/${j.id}`}
                        className="mt-1 w-full py-1 bg-white border border-primary/30 text-primary hover:bg-primary hover:text-white rounded-lg text-[11px] font-bold transition-colors block text-center"
                      >
                        Apply with Resume
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ── MODAL 1: WYSIWYG RICH POST CREATOR STUDIO ───────────────────────── */}
        <AnimatePresence>
          {isCreatePostOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsCreatePostOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-600" />
                    <h3 className="font-bold text-gray-900 text-sm">Visual Post & Announcement Studio</h3>
                  </div>
                  <button onClick={() => setIsCreatePostOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleCreatePost} className="mt-4 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Post Content & Text Formatting (Live Highlight & Colors) *</label>
                    <RichVisualEditor
                      initialHtml={newPostContent}
                      onChange={(html) => setNewPostContent(html)}
                      placeholder="Type your announcement. Select any words and click yellow/cyan/green/orange/purple highlight or font colors to decorate..."
                      minHeight="140px"
                    />
                  </div>

                  {/* Attachment Badge */}
                  {newPostAttachment ? (
                    <div className="flex items-center justify-between p-2.5 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Paperclip className="w-4 h-4 text-cyan-600" />
                        <span>Attached File: {newPostAttachment.name} ({newPostAttachment.size})</span>
                      </span>
                      <button type="button" onClick={() => setNewPostAttachment(null)} className="text-gray-400 hover:text-red-600">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setNewPostAttachment({ name: 'Science_Fair_Circular.pdf', size: '1.4 MB' })}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-300 hover:border-primary text-gray-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-primary" />
                      <span>+ Attach PDF / Circular</span>
                    </button>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Photo / Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newPostImage}
                      onChange={(e) => setNewPostImage(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Category Hashtags</label>
                    <input
                      type="text"
                      placeholder="#ScienceFair #Robotics #NEP2020 #Hiring"
                      value={newPostTags}
                      onChange={(e) => setNewPostTags(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg hover:bg-primary/90 transition-colors mt-2"
                  >
                    Publish to EduNetwork Feed
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 2: FULL WYSIWYG JOB POSTING & EDITING SUITE ────────────────── */}
        <AnimatePresence>
          {isJobEditorOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsJobEditorOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-gray-900 text-sm">
                      {editingJobId ? 'Edit Job Opening (WYSIWYG Mode)' : 'Post a New Faculty / Lab Job'}
                    </h3>
                  </div>
                  <button onClick={() => setIsJobEditorOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                <form onSubmit={handleSaveJob} className="mt-4 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior PGT Physics Educator"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/40 font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Subject / Domain *</label>
                      <select
                        value={jobForm.subject}
                        onChange={(e) => setJobForm({ ...jobForm, subject: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      >
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Robotics & AI">Robotics & AI</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Lab Technology">Lab Technology</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Role Type</label>
                      <select
                        value={jobForm.roleType}
                        onChange={(e) => setJobForm({ ...jobForm, roleType: e.target.value as any })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      >
                        <option value="Full-Time">Full-Time (Permanent)</option>
                        <option value="Lab Instructor">Lab Instructor</option>
                        <option value="Visiting Faculty">Visiting Faculty</option>
                        <option value="Part-Time">Part-Time</option>
                      </select>
                    </div>
                  </div>

                  {/* Salary Range */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Min Salary (₹/month) *</label>
                      <input
                        type="text"
                        required
                        placeholder="55,000"
                        value={jobForm.minSalary}
                        onChange={(e) => setJobForm({ ...jobForm, minSalary: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Max Salary (₹/month) *</label>
                      <input
                        type="text"
                        required
                        placeholder="90,000"
                        value={jobForm.maxSalary}
                        onChange={(e) => setJobForm({ ...jobForm, maxSalary: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>

                  {/* Experience & Openings */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Experience Required</label>
                      <input
                        type="text"
                        placeholder="e.g. 3+ Years PGT"
                        value={jobForm.experience}
                        onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Number of Openings</label>
                      <input
                        type="number"
                        min="1"
                        value={jobForm.openings}
                        onChange={(e) => setJobForm({ ...jobForm, openings: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none font-bold"
                      />
                    </div>
                  </div>

                  {/* True WYSIWYG Description Editor with Live Highlight & Color preview */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">
                      Job Description & Practical Duties (True Visual WYSIWYG Editor) *
                    </label>
                    <RichVisualEditor
                      initialHtml={jobForm.description}
                      onChange={(html) => setJobForm({ ...jobForm, description: html })}
                      placeholder="Outline laboratory responsibilities, apparatus handling, and NEP-2020 pedagogical requirements. Highlight important perks in color..."
                      minHeight="150px"
                    />
                  </div>

                  {/* Benefits Selector Pills */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1.5">Benefits & Perks Provided:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {availableBenefitsList.map((b) => {
                        const isSelected = jobForm.benefits.includes(b);
                        return (
                          <button
                            type="button"
                            key={b}
                            onClick={() => toggleBenefitPill(b)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                              isSelected
                                ? 'bg-primary text-white border-primary shadow-2xs'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-lg transition-colors mt-2"
                  >
                    {editingJobId ? 'Save & Update Job Listing' : 'Publish Job Opening'}
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 3: TEACHER JOB APPLICATION WITH RESUME UPLOAD ─────────────── */}
        <AnimatePresence>
          {selectedJobToApply && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setSelectedJobToApply(null)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Apply with CSEEL Profile & Resume</h3>
                    <p className="text-[11px] text-gray-500">{selectedJobToApply.title} @ {org.name}</p>
                  </div>
                  <button onClick={() => setSelectedJobToApply(null)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>

                {applySuccess ? (
                  <div className="py-8 text-center flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <Check className="w-6 h-6 stroke-[3]" />
                    </div>
                    <h4 className="font-bold text-gray-900">Application & Resume Submitted!</h4>
                    <p className="text-xs text-gray-500">Your verified credentials have been submitted directly to the principal & recruitment desk at {org.name}.</p>
                  </div>
                ) : (
                  <form onSubmit={handleApplySubmit} className="mt-4 space-y-3">
                    
                    {/* Resume Upload Box */}
                    <div className="bg-primary/5 border-2 border-dashed border-primary/30 rounded-2xl p-4 text-center space-y-1">
                      <Upload className="w-6 h-6 text-primary mx-auto" />
                      <p className="text-xs font-bold text-gray-900">Upload Your Resume / CV (.pdf or .docx) *</p>
                      <p className="text-[10px] text-gray-500">Attach your latest academic credentials & lab workshop records</p>
                      
                      <div className="pt-2">
                        {applyForm.resumeFileName ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{applyForm.resumeFileName} ({applyForm.resumeFileSize})</span>
                            <button
                              type="button"
                              onClick={() => setApplyForm({ ...applyForm, resumeFileName: '', resumeFileSize: '' })}
                              className="text-gray-400 hover:text-red-600 ml-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setApplyForm({ ...applyForm, resumeFileName: 'Dr_Sharma_Physics_PGT_Resume.pdf', resumeFileSize: '1.4 MB' })}
                            className="px-4 py-1.5 bg-white border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors shadow-2xs"
                          >
                            Choose Resume File
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Mr. Science Educator"
                        value={applyForm.name}
                        onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="educator@cseel.network"
                          value={applyForm.email}
                          onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={applyForm.phone}
                          onChange={(e) => setApplyForm({ ...applyForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Total Experience</label>
                        <input
                          type="text"
                          placeholder="e.g. 5+ Years PGT Physics"
                          value={applyForm.experience}
                          onChange={(e) => setApplyForm({ ...applyForm, experience: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-gray-700 block mb-1">Highest Qualification</label>
                        <input
                          type="text"
                          placeholder="e.g. M.Sc. Physics, B.Ed"
                          value={applyForm.qualification}
                          onChange={(e) => setApplyForm({ ...applyForm, qualification: e.target.value })}
                          className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Key Laboratory Apparatus Expertise</label>
                      <input
                        type="text"
                        placeholder="e.g. Laser Optics, Titrations, Arduino & 3D Printers"
                        value={applyForm.labExpertise}
                        onChange={(e) => setApplyForm({ ...applyForm, labExpertise: e.target.value })}
                        className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                      />
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700 pt-1">
                      <input
                        type="checkbox"
                        checked={applyForm.nepTrained}
                        onChange={(e) => setApplyForm({ ...applyForm, nepTrained: e.target.checked })}
                        className="rounded text-primary focus:ring-primary w-4 h-4"
                      />
                      <span>I am <strong>NEP-2020 Certified</strong> for experiential hands-on STEM education</span>
                    </label>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-xs font-black shadow-lg transition-colors mt-2"
                    >
                      Submit Application Directly to {org.name}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 4: WRITE A REVIEW ─────────────────────────────────────────── */}
        <AnimatePresence>
          {isWriteReviewOpen && (
            <div className="fixed inset-0 z-[400] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsWriteReviewOpen(false)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-sm">Write a Public Review for {org.name}</h3>
                  <button onClick={() => setIsWriteReviewOpen(false)} className="p-1 text-gray-400 hover:text-gray-700"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ramanathan Iyer"
                      value={newReviewForm.name}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Role</label>
                    <select
                      value={newReviewForm.role}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, role: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                    >
                      <option value="Science Teacher">Science Teacher</option>
                      <option value="Parent">Parent</option>
                      <option value="Student Innovator">Student Innovator</option>
                      <option value="Lab Assistant">Lab Assistant</option>
                      <option value="Academic Auditor">Academic Auditor</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Star Rating (1 to 5 Stars)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewForm({ ...newReviewForm, rating: star })}
                          className="p-1"
                        >
                          <Star className={`w-6 h-6 ${star <= newReviewForm.rating ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Feedback / Review *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share your experience about laboratory infrastructure, faculty, and student innovation..."
                      value={newReviewForm.comment}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, comment: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-xl text-xs font-black shadow-lg hover:bg-primary/90 transition-colors mt-2"
                  >
                    Submit Verified Review
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 5: CAMPUS PHOTO LIGHTBOX ─────────────────────────────────── */}
        <AnimatePresence>
          {activeLightboxPhoto && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setActiveLightboxPhoto(null)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-2xl bg-slate-900 text-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                <div className="relative h-80 sm:h-96">
                  <img src={activeLightboxPhoto.image} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setActiveLightboxPhoto(null)} className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full"><X className="w-5 h-5" /></button>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-black uppercase rounded-full">
                    {activeLightboxPhoto.tag}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="text-base font-black text-white">{activeLightboxPhoto.title}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{activeLightboxPhoto.description}</p>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ── MODAL 6: LAB APPARATUS & SPECIFICATIONS LIGHTBOX ───────────────── */}
        <AnimatePresence>
          {selectedLabDetails && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedLabDetails(null)} />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="relative h-64 sm:h-72 bg-slate-900">
                  <img src={selectedLabDetails.image} alt="" className="w-full h-full object-cover" />
                  <button onClick={() => setSelectedLabDetails(null)} className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full"><X className="w-5 h-5" /></button>
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-xs font-black rounded-full shadow-md">
                    {selectedLabDetails.category}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <span className="px-3 py-1 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-md">
                      <ShieldCheck className="w-4 h-4 text-cyan-300 shrink-0" />
                      <span>{selectedLabDetails.safetyCertification}</span>
                    </span>
                  </div>
                </div>
                <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">{selectedLabDetails.tag}</span>
                    <h3 className="text-xl font-black text-gray-900 mt-0.5">{selectedLabDetails.name}</h3>
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed">{selectedLabDetails.description}</p>
                  </div>

                  {/* Faculty & Batch Details */}
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 text-xs">
                    <div>
                      <p className="text-[10px] text-gray-500 font-semibold">Faculty In-Charge</p>
                      <p className="font-bold text-gray-900">{selectedLabDetails.incharge}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-semibold">Batch Capacity</p>
                      <p className="font-bold text-gray-900">{selectedLabDetails.capacity}</p>
                    </div>
                  </div>

                  {/* Complete Equipment List */}
                  <div>
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Beaker className="w-4 h-4 text-primary" /> Apparatus & Instrument Inventory
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {selectedLabDetails.apparatus.map((item, idx) => (
                        <div key={idx} className="p-2 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 font-medium text-gray-800">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      href="/simulations"
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 shadow-md hover:bg-primary-hover transition-colors text-center"
                    >
                      <Play className="w-4 h-4" />
                      <span>Launch 3D Simulations</span>
                    </Link>
                    <button
                      onClick={() => setSelectedLabDetails(null)}
                      className="py-3 px-6 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
