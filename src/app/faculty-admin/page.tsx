'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  ExternalLink,
  Video,
  Image as ImageIcon,
  FileText,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Clock,
  Search,
  RefreshCw,
  FolderTree,
  Briefcase,
  MapPin,
  Edit3,
  Film,
  Save,
  MessageSquare,
  Compass,
  AlertCircle,
  X
} from 'lucide-react';

interface VideoItem {
  id?: string;
  title: string;
  url: string;
  driveUrl?: string;
  category?: string;
  duration?: string;
  description?: string;
  filename?: string;
}

interface ImageItem {
  title: string;
  subtitle?: string;
  url: string;
  category?: string;
}

interface Faculty {
  id: string;
  facultyCode?: string;
  name: string;
  slug: string;
  subject: string;
  category: string;
  title: string;
  experience?: string;
  phone: string;
  email: string;
  address?: string;
  location?: string;
  addressDetails?: any;
  isLocationVerified?: boolean;
  isVerified: boolean;
  status?: 'pending_verification' | 'verified' | 'rejected' | string;
  accessKey?: string;
  photoUrl: string;
  videoLink: string;
  videos?: VideoItem[];
  galleryImages?: ImageItem[];
  updatedAt?: string;
}

export default function FacultyAdminPage() {
  const [facultyList, setFacultyList] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Active Faculty for Media Management Modal
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);
  const [mediaModalTab, setMediaModalTab] = useState<'videos' | 'gallery'>('videos');
  const [editVideos, setEditVideos] = useState<VideoItem[]>([]);
  const [editGallery, setEditGallery] = useState<ImageItem[]>([]);
  const [savingMedia, setSavingMedia] = useState(false);

  // New Faculty Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    subject: 'Physics',
    experience: '5+ Years Senior Secondary Experience',
    title: 'Senior Physics Faculty & Experiential Specialist',
    phone: '',
    email: '',
    address: 'Prakash Vihar Colony, Palwal, Haryana - 121102',
    videoLink: 'https://drive.google.com/drive/folders/1Z01tcUwrAxCDd_qG2ln4cIcykhX4mWra?usp=drive_link',
    imageLink: '/images/dev-sharma.jpg',
    videos: [
      {
        title: 'Wave Optics & Light Ray Reflection/Refraction Demonstration',
        url: 'https://drive.google.com/file/d/1XTERWis8nfHiAX3K3D1nqDdHqIb-rLpW/preview',
        category: 'Optics',
        duration: '14:20'
      }
    ] as VideoItem[],
    galleryImages: [
      {
        title: 'Devender (Dev Sharma) — Senior Physics Faculty & Master Trainer',
        subtitle: 'Verified Profile • M.Sc. Physics',
        url: '/images/dev-sharma.jpg',
        category: 'All Photos'
      }
    ] as ImageItem[],
    htmlResume: '',
    isVerified: true,
  });

  const loadFaculty = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/faculty-resumes');
      const data = await res.json();
      if (data.success) {
        setFacultyList(data.faculty || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFaculty();
  }, []);

  // Modal error state for inside-modal display
  const [modalError, setModalError] = useState<string | null>(null);

  // Open Media Management Modal with multi-source fallback (videos, gallery, sections)
  const openMediaModal = (faculty: any) => {
    setSelectedFaculty(faculty);
    setModalError(null);

    // Extract videos from faculty.videos or sections ('sec-videos' or type 'demo_videos')
    let vids: VideoItem[] = [];
    if (Array.isArray(faculty.videos) && faculty.videos.length > 0) {
      vids = faculty.videos;
    } else if (Array.isArray(faculty.sections)) {
      const vidSec = faculty.sections.find((s: any) => s.id === 'sec-videos' || s.type === 'demo_videos');
      if (vidSec?.data?.items && Array.isArray(vidSec.data.items)) {
        vids = vidSec.data.items;
      }
    }

    // Extract gallery photos from faculty.galleryImages or sections ('sec-gallery' or type 'photo_gallery')
    let gallery: ImageItem[] = [];
    if (Array.isArray(faculty.galleryImages) && faculty.galleryImages.length > 0) {
      gallery = faculty.galleryImages;
    } else if (Array.isArray(faculty.sections)) {
      const galSec = faculty.sections.find((s: any) => s.id === 'sec-gallery' || s.type === 'photo_gallery');
      if (galSec?.data?.items && Array.isArray(galSec.data.items)) {
        gallery = galSec.data.items;
      }
    }

    setEditVideos([...vids]);
    setEditGallery([...gallery]);
    setMediaModalTab('videos');
  };

  // Video Handlers in Media Modal
  const handleAddVideoInModal = () => {
    setEditVideos((prev) => [
      ...prev,
      {
        title: `Topic ${prev.length + 1}: Physics Experiment Demonstration`,
        url: 'https://drive.google.com/drive/folders/1Z01tcUwrAxCDd_qG2ln4cIcykhX4mWra?usp=drive_link',
        category: 'Lab Demonstrations',
        duration: '10:00',
      },
    ]);
  };

  const handleRemoveVideoInModal = (index: number) => {
    setEditVideos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleVideoFieldChange = (index: number, field: keyof VideoItem, value: string) => {
    setEditVideos((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleMoveVideo = (index: number, direction: 'up' | 'down') => {
    setEditVideos((prev) => {
      const updated = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= updated.length) return prev;
      const temp = updated[index];
      updated[index] = updated[targetIndex];
      updated[targetIndex] = temp;
      return updated;
    });
  };

  // Image Handlers in Media Modal
  const handleAddImageInModal = () => {
    setEditGallery((prev) => [
      ...prev,
      {
        title: `Photo ${prev.length + 1}: Workshop Demonstration`,
        subtitle: 'Hands-on Activity',
        url: '/images/dev-sharma.jpg',
        category: 'Workshops',
      },
    ]);
  };

  const handleRemoveImageInModal = (index: number) => {
    setEditGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleImageFieldChange = (index: number, field: keyof ImageItem, value: string) => {
    setEditGallery((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Save All Media Changes to API with Immediate UI Feedback
  const handleSaveMediaChanges = async () => {
    if (!selectedFaculty) return;
    setSavingMedia(true);
    setModalError(null);
    try {
      const res = await fetch('/api/faculty-resumes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: selectedFaculty.slug,
          videos: editVideos,
          galleryImages: editGallery,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update local list state immediately
        setFacultyList((prev) =>
          prev.map((f) =>
            f.slug === selectedFaculty.slug
              ? { ...f, videos: editVideos, galleryImages: editGallery }
              : f
          )
        );
        setMessage({
          text: `Success! Videos (${editVideos.length}) and Photos (${editGallery.length}) saved and synced for ${selectedFaculty.name}`,
          type: 'success',
        });
        setSelectedFaculty(null);
        setTimeout(() => loadFaculty(), 800);
      } else {
        setModalError(data.message || 'Error updating media. Please retry.');
      }
    } catch (e: any) {
      setModalError(e.message || 'Network error occurred while saving.');
    } finally {
      setSavingMedia(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleToggleVerified = async (slug: string, currentStatus: boolean) => {
    try {
      const res = await fetch('/api/faculty-resumes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, isVerified: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFacultyList((prev) =>
          prev.map((f) => (f.slug === slug ? { ...f, isVerified: !currentStatus } : f))
        );
        setMessage({ text: `Status updated to ${!currentStatus ? 'VERIFIED' : 'UNVERIFIED'}`, type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`Are you sure you want to delete profile "${slug}"?`)) return;
    try {
      const res = await fetch(`/api/faculty-resumes?slug=${slug}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFacultyList((prev) => prev.filter((f) => f.slug !== slug));
        setMessage({ text: 'Faculty profile deleted successfully', type: 'success' });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const autoSlug = name.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, '');
    setFormData((prev) => ({
      ...prev,
      name,
      slug: prev.slug || autoSlug,
      title: prev.title || `Senior ${prev.subject} Faculty`,
    }));
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/faculty-resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `Success! Profile generated at ${data.url}`, type: 'success' });
        setShowAddModal(false);
        loadFaculty();
      } else {
        setMessage({ text: data.message || 'Error creating faculty', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Error occurred', type: 'error' });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified'>('all');

  const pendingCount = facultyList.filter(f => !f.isVerified || f.status === 'pending_verification').length;
  const verifiedCount = facultyList.filter(f => f.isVerified && f.status !== 'pending_verification').length;

  const filteredFaculty = facultyList.filter((f) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      f.slug.toLowerCase().includes(q) ||
      f.subject.toLowerCase().includes(q) ||
      (f.facultyCode && f.facultyCode.toLowerCase().includes(q)) ||
      (f.accessKey && f.accessKey.toLowerCase().includes(q));

    if (!matchesSearch) return false;

    if (statusFilter === 'pending') {
      return !f.isVerified || f.status === 'pending_verification';
    }
    if (statusFilter === 'verified') {
      return f.isVerified && f.status !== 'pending_verification';
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight leading-tight">Faculty Admin Dashboard</h1>
              <p className="text-[11px] text-blue-300">resumes.cseel.org &bull; Full Video &amp; Gallery Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://resumes.cseel.org/best-Teacherfaculty/physics/DevSharma.html"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700"
            >
              <ExternalLink className="w-3 h-3 text-blue-400" />
              Live Site
            </a>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Add Faculty
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        {/* Notification Toast */}
        {message && (
          <div
            className={`mb-4 p-3.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs mb-5 flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400 ml-1 flex-shrink-0" />
          <input
            type="text"
            placeholder="Quick Search by Faculty Code (e.g. AA001, AB9050), name, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none"
          />
          <button
            onClick={loadFaculty}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Faculty ({facultyList.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              statusFilter === 'pending'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-amber-700 hover:bg-amber-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Pending Verification ({pendingCount})
          </button>
          <button
            onClick={() => setStatusFilter('verified')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              statusFilter === 'verified'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Faculty ({verifiedCount})
          </button>
        </div>

        {/* Faculty Cards Grid */}
        <div className="space-y-4">
          {filteredFaculty.map((faculty) => {
            const facultyCode = faculty.facultyCode || 'AA001';
            const publicUrl = `https://resumes.cseel.org/best-Teacherfaculty/${(faculty.subject || 'physics').toLowerCase()}/${faculty.accessKey || 'DevSharmaPhysics2026'}/${faculty.slug}-videos.html`;
            const cleanPhone = (faculty.phone || '').replace(/[^0-9]/g, '');

            const notifyMsg = `Dear ${faculty.name} Sir/Ma'am,\n\n🎉 Congratulations! Your CSEEL Verified Faculty Profile (Faculty ID: ${facultyCode}) has been verified and approved by the admin team.\n\nYour profile is now 100% active and public! You can directly share your verified profile with schools, institutes, and recruiters:\n\n🔗 Live Profile URL:\n${publicUrl}\n\nBest regards,\nCSEEL Verified Faculty Network\nhttps://resumes.cseel.org`;

            return (
            <div
              key={faculty.id}
              className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition ${
                !faculty.isVerified
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <img
                  src={faculty.photoUrl || '/images/dev-sharma.jpg'}
                  alt={faculty.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  onError={(e: any) => {
                    e.target.src = '/images/dev-sharma.jpg';
                  }}
                />

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 truncate">
                        {faculty.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-blue-100 text-blue-800 border border-blue-200">
                        ID: {facultyCode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!faculty.isVerified && (
                        <button
                          onClick={() => handleToggleVerified(faculty.slug, false)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                          title="Approve and Publish Faculty Profile"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve &amp; Verify</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleToggleVerified(faculty.slug, faculty.isVerified)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold flex-shrink-0 ${
                          faculty.isVerified
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                        title="Toggle Verified / Unverified"
                      >
                        {faculty.isVerified ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Review</span>
                          </>
                        )}
                      </button>

                      {/* 1-Click WhatsApp Notification to User */}
                      {cleanPhone && (
                        <a
                          href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(notifyMsg)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition"
                          title="Send Verification Activation Message to User via WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp User</span>
                        </a>
                      )}

                      {/* 1-Click Email Notification to User */}
                      {faculty.email && (
                        <a
                          href={`mailto:${faculty.email}?subject=${encodeURIComponent(
                            `Your CSEEL Faculty Profile is Verified (ID: ${facultyCode})`
                          )}&body=${encodeURIComponent(notifyMsg)}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
                          title="Send Verification Email to User"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Email User</span>
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    <span className="font-bold text-blue-700">{faculty.subject}</span>
                    {faculty.experience ? ` &bull; ${faculty.experience}` : ''}
                  </div>

                  {/* Anti-Scraping 20-char Token Box */}
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs bg-indigo-50/70 border border-indigo-100 p-2 rounded-lg">
                    <span className="flex items-center gap-1 font-bold text-indigo-900 text-[11px]">
                      <Shield className="w-3.5 h-3.5 text-indigo-600" />
                      Anti-Scraping Key:
                    </span>
                    <span className="font-mono font-bold text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
                      {faculty.accessKey || 'DevSharmaPhysics2026'}
                    </span>
                    {faculty.accessKey && (
                      <a
                        href={`/best-Teacherfaculty/${(faculty.subject || 'physics').toLowerCase()}/${faculty.accessKey}/${faculty.slug}-videos.html`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 ml-auto"
                      >
                        <ExternalLink className="w-3 h-3" /> Keyed Protected Link
                      </a>
                    )}
                  </div>

                  {/* Profile Details Pills */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600 mt-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {faculty.phone && (
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        {faculty.phone}
                        {faculty.isVerified && <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">✓</span>}
                      </span>
                    )}
                    {faculty.email && (
                      <span className="flex items-center gap-1 font-semibold text-slate-800">
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        {faculty.email}
                      </span>
                    )}
                  </div>

                  {/* Detailed Address & 2km Radius Geolocation Verification Card */}
                  {faculty.addressDetails ? (
                    <div className="mt-2.5 p-3 bg-slate-50/90 rounded-lg border border-slate-200 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                        <div className="flex items-start gap-1.5 font-bold text-slate-800">
                          <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 mr-1">Residential Address:</span>
                            <span className="font-normal text-slate-700">
                              {faculty.addressDetails.localAddress}
                              {faculty.addressDetails.blockOrCluster ? `, ${faculty.addressDetails.blockOrCluster}` : ''}
                              , {faculty.addressDetails.district}, {faculty.addressDetails.state} - {faculty.addressDetails.pincode}
                            </span>
                          </div>
                        </div>

                        {/* Location Verification Status */}
                        {faculty.isLocationVerified || faculty.addressDetails.isLocationVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Location Verified {faculty.addressDetails.distanceKm !== undefined ? `(Within ${faculty.addressDetails.distanceKm} km)` : ''}
                          </span>
                        ) : faculty.addressDetails.distanceKm !== undefined && faculty.addressDetails.distanceKm > 2.0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertCircle className="w-3 h-3 text-amber-600" />
                            Outside 2km Radius ({faculty.addressDetails.distanceKm} km from device GPS)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                            <Compass className="w-3 h-3 text-blue-600" />
                            Coordinates Available (Pending GPS Check)
                          </span>
                        )}
                      </div>

                      {faculty.addressDetails.googleMapLocation && (
                        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-200/80 text-[11px]">
                          <span className="font-semibold text-slate-600">Google Maps:</span>
                          <a
                            href={faculty.addressDetails.googleMapLocation.startsWith('http') ? faculty.addressDetails.googleMapLocation : `https://maps.google.com/?q=${encodeURIComponent(faculty.addressDetails.googleMapLocation)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-mono underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" /> Open in Google Maps
                          </a>
                          {faculty.addressDetails.latitude && faculty.addressDetails.longitude && (
                            <span className="text-slate-500 font-mono ml-auto">
                              GPS: {faculty.addressDetails.latitude.toFixed(4)}, {faculty.addressDetails.longitude.toFixed(4)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    (faculty.address || faculty.location) && (
                      <div className="mt-2.5 p-2 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-center gap-1.5 text-slate-600">
                        <MapPin className="w-3.5 h-3.5 text-rose-500" />
                        <span>Address: {faculty.address || faculty.location}</span>
                      </div>
                    )
                  )}

                  {/* MAIN ACTION ROW: MEDIA EDITING & LIVE LINKS */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 mt-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* DEDICATED FULL MEDIA CONTROL BUTTON */}
                      <button
                        onClick={() => openMediaModal(faculty)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
                        title="Edit, Add, Delete all videos and gallery photos"
                      >
                        <Film className="w-3.5 h-3.5" />
                        Manage Videos ({faculty.videos?.length || 0}) &amp; Gallery ({faculty.galleryImages?.length || 0})
                      </button>

                      <a
                        href={`/${faculty.category || `best-Teacherfaculty/${faculty.subject.toLowerCase()}`}/${faculty.slug}.html`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800"
                      >
                        📄 Resume
                      </a>
                      <a
                        href={`/${faculty.category || `best-Teacherfaculty/${faculty.subject.toLowerCase()}`}/${faculty.slug}-videos.html`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-700 font-bold"
                      >
                        🎥 Google Videos ({faculty.videos?.length || 0})
                      </a>
                      <a
                        href={`/${faculty.category || `best-Teacherfaculty/${faculty.subject.toLowerCase()}`}/${faculty.slug}-gallery.html`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold"
                      >
                        🖼️ Photos ({faculty.galleryImages?.length || 0})
                      </a>
                    </div>

                    <button
                      onClick={() => handleDelete(faculty.slug)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                      title="Delete Faculty Profile"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                </div>
              </div>
            </div>
            </div>
            );
          })}
        </div>
      </main>

      {/* ========================================================= */}
      {/* MODAL: FULL CONTROL OVER VIDEOS & GALLERY IMAGES */}
      {/* ========================================================= */}
      {selectedFaculty && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Film className="w-5 h-5 text-blue-400" />
                <div>
                  <h2 className="text-base font-bold">Manage Videos &amp; Photo Gallery</h2>
                  <p className="text-[11px] text-slate-400">Faculty: {selectedFaculty.name} ({selectedFaculty.subject})</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFaculty(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Subtabs (Videos vs Gallery) */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setMediaModalTab('videos')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
                  mediaModalTab === 'videos'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Video className="w-4 h-4" />
                Demo Videos ({editVideos.length})
              </button>
              <button
                type="button"
                onClick={() => setMediaModalTab('gallery')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition ${
                  mediaModalTab === 'gallery'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                Photo Gallery ({editGallery.length})
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              {/* TAB 1: VIDEOS LIST & EDITING */}
              {mediaModalTab === 'videos' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-700">All Video Links &amp; Topics</h4>
                      <p className="text-[11px] text-slate-500">Google Drive embed/view link ya YouTube link paste karein.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddVideoInModal}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 hover:bg-orange-500 text-white shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Video
                    </button>
                  </div>

                  {editVideos.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-xs text-slate-500">Koi video nahi hai. "+ Add Video" button click karke new video add karein.</p>
                    </div>
                  ) : (
                    editVideos.map((vid, idx) => {
                      const isMp4 = vid.url && (vid.url.toLowerCase().includes('.mp4') || vid.url.includes('/storage/v1/object/public/'));
                      return (
                        <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 inline-flex items-center justify-center text-[10px]">
                                {idx + 1}
                              </span>
                              Video #{idx + 1} {vid.category ? `• ${vid.category}` : ''}
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => handleMoveVideo(idx, 'up')}
                                className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-40 cursor-pointer"
                                title="Move video up"
                              >
                                ↑ Up
                              </button>
                              <button
                                type="button"
                                disabled={idx === editVideos.length - 1}
                                onClick={() => handleMoveVideo(idx, 'down')}
                                className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-slate-200 hover:bg-slate-300 text-slate-700 disabled:opacity-40 cursor-pointer"
                                title="Move video down"
                              >
                                ↓ Down
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveVideoInModal(idx)}
                                className="text-red-500 hover:text-red-700 p-1 ml-1"
                                title="Delete this video"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Video Preview Frame */}
                          {vid.url && (
                            <div className="bg-slate-900 rounded-lg overflow-hidden flex items-center justify-center max-h-36">
                              {isMp4 ? (
                                <video
                                  src={`${vid.url}#t=0.5`}
                                  controls
                                  preload="metadata"
                                  className="w-full max-h-36 object-contain"
                                />
                              ) : (
                                <div className="p-3 text-center text-slate-400 text-xs">
                                  <span>External video link: </span>
                                  <a href={vid.url} target="_blank" rel="noreferrer" className="text-blue-400 underline font-mono text-[11px]">
                                    Open preview
                                  </a>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Topic / Video Title *</label>
                              <input
                                type="text"
                                value={vid.title}
                                onChange={(e) => handleVideoFieldChange(idx, 'title', e.target.value)}
                                placeholder="e.g. Color Addition & Primary Light Spectrum Synthesis"
                                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:ring-1 focus:ring-orange-500 bg-white"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-1.5">
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Category</label>
                                <input
                                  type="text"
                                  value={vid.category || ''}
                                  onChange={(e) => handleVideoFieldChange(idx, 'category', e.target.value)}
                                  placeholder="Optics & Light"
                                  className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-orange-500 bg-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Duration</label>
                                <input
                                  type="text"
                                  value={vid.duration || ''}
                                  onChange={(e) => handleVideoFieldChange(idx, 'duration', e.target.value)}
                                  placeholder="03:45"
                                  className="w-full px-2 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-orange-500 bg-white"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Video Description &amp; Pedagogy Note</label>
                            <textarea
                              rows={2}
                              value={vid.description || ''}
                              onChange={(e) => handleVideoFieldChange(idx, 'description', e.target.value)}
                              placeholder="Describe the scientific concept, hands-on apparatus, or classroom demonstration..."
                              className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-orange-500 bg-white"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-0.5">Supabase Storage MP4 / YouTube Video Link *</label>
                            <input
                              type="text"
                              value={vid.url}
                              onChange={(e) => handleVideoFieldChange(idx, 'url', e.target.value)}
                              placeholder="https://ukazkxthavxphibdbspd.supabase.co/storage/v1/object/public/faculty-videos/..."
                              className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 focus:ring-1 focus:ring-orange-500 bg-white"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* TAB 2: GALLERY LIST & EDITING */}
              {mediaModalTab === 'gallery' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-700">All Photo Gallery Images</h4>
                      <p className="text-[11px] text-slate-500">Image title, subtitle aur image URL / path ko edit karein.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddImageInModal}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Photo
                    </button>
                  </div>

                  {editGallery.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <p className="text-xs text-slate-500">Koi photo nahi hai. "+ Add Photo" button click karke new photo add karein.</p>
                    </div>
                  ) : (
                    editGallery.map((img, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 inline-flex items-center justify-center text-[10px]">
                              {idx + 1}
                            </span>
                            Photo #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveImageInModal(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete this photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-start gap-3">
                          <img
                            src={img.url}
                            alt={img.title}
                            className="w-16 h-16 rounded-lg object-cover border border-slate-200 flex-shrink-0"
                            onError={(e: any) => {
                              e.target.src = '/images/dev-sharma.jpg';
                            }}
                          />
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={img.title}
                              onChange={(e) => handleImageFieldChange(idx, 'title', e.target.value)}
                              placeholder="Image Title"
                              className="w-full px-2.5 py-1.5 text-xs font-semibold rounded border border-slate-300 focus:ring-1 focus:ring-blue-500"
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={img.subtitle || ''}
                                onChange={(e) => handleImageFieldChange(idx, 'subtitle', e.target.value)}
                                placeholder="Subtitle (e.g. Lab Setup)"
                                className="w-full px-2.5 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                value={img.url}
                                onChange={(e) => handleImageFieldChange(idx, 'url', e.target.value)}
                                placeholder="Image URL / Path"
                                className="w-full px-2.5 py-1.5 text-xs font-mono rounded border border-slate-300 focus:ring-1 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Inside-Modal Error Alert */}
            {modalError && (
              <div className="bg-red-50 border-t border-red-200 px-5 py-2.5 flex items-center justify-between text-xs text-red-700 font-semibold flex-shrink-0">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                  <span>{modalError}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setModalError(null)}
                  className="text-red-500 hover:text-red-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Modal Footer */}
            <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
              <span className="text-[11px] text-slate-500">
                Changes live websites (<code className="text-blue-600 font-mono">-videos.html</code> &amp; <code className="text-blue-600 font-mono">-gallery.html</code>) par automatically sync ho jayengi.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFaculty(null)}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveMediaChanges}
                  disabled={savingMedia}
                  className="px-4 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {savingMedia ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      Save Media Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD NEW FACULTY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
            <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" />
                <h2 className="text-base sm:text-lg font-bold">Add Faculty to Subject Folder</h2>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-2xl leading-none p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Faculty Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Devender Sharma"
                    value={formData.name}
                    onChange={handleNameChange}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Subject / Folder Category *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm font-semibold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Physics">Physics (/best-Teacherfaculty/physics/)</option>
                    <option value="Chemistry">Chemistry (/best-Teacherfaculty/chemistry/)</option>
                    <option value="Mathematics">Mathematics (/best-Teacherfaculty/mathematics/)</option>
                    <option value="Biology">Biology (/best-Teacherfaculty/biology/)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Profile Slug (File Name) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="DevSharma"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">
                    Experience Details
                  </label>
                  <input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md flex items-center gap-1.5"
                >
                  {submitting ? 'Publishing...' : 'Publish to Subject Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
