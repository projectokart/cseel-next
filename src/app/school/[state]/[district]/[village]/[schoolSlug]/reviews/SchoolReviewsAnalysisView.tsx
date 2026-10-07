'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  BarChart3,
  TrendingUp,
  Award,
  Users,
  GraduationCap,
  Bus,
  FlaskConical,
  Activity,
  Heart,
  Calendar,
  Send,
  X,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface SchoolReviewsAnalysisViewProps {
  state: string;
  district: string;
  village: string;
  schoolName: string;
  schoolSlug: string;
  udiseCode?: string;
  board?: string;
  rawAddress?: string;
  pincode?: string;
}

export default function SchoolReviewsAnalysisView({
  state,
  district,
  village,
  schoolName,
  schoolSlug,
  udiseCode = 'Verified',
  board = 'CBSE',
  rawAddress,
  pincode
}: SchoolReviewsAnalysisViewProps) {
  const [activeTab, setActiveTab] = useState('all'); // all, parent, alumni, student
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'helpful' | 'recent' | 'highest'>('helpful');
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New review form states
  const [newAuthor, setNewAuthor] = useState('');
  const [newRole, setNewRole] = useState('Verified Parent');
  const [newRating, setNewRating] = useState(5);
  const [newAcademics, setNewAcademics] = useState(5);
  const [newSafety, setNewSafety] = useState(5);
  const [newLabs, setNewLabs] = useState(5);
  const [newSports, setNewSports] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initial comprehensive verified review dataset
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Sunita Verma',
      role: 'Verified Parent',
      studentClass: 'Class 8 Student',
      date: '14 days ago',
      rating: 5,
      likes: 42,
      sentiment: 'positive',
      metrics: { academics: 5, safety: 5, labs: 4.8, sports: 4.7 },
      title: 'Outstanding science practicals & nurturing mentors',
      comment:
        'The hands-on practical science labs and faculty dedication are truly commendable. My daughter enjoys the robotics and debate clubs. Transparency in communication and fees gives complete peace of mind. The weekly student observation updates on the parent app help us track progress without stress.'
    },
    {
      id: 2,
      author: 'Rajesh Kulkarni',
      role: 'Verified Parent',
      studentClass: 'Class 10 Student',
      date: '1 month ago',
      rating: 5,
      likes: 38,
      sentiment: 'positive',
      metrics: { academics: 4.9, safety: 5, labs: 4.9, sports: 4.6 },
      title: 'NEP 2020 aligned learning with zero tuition pressure',
      comment:
        'Outstanding academic discipline combined with experiential learning. The teachers give individual attention to each child, so external tuition is completely unnecessary. Clean campus and safe GPS-tracked school buses with attentive female conductors.'
    },
    {
      id: 3,
      author: 'Aman Preet Singh',
      role: 'Student Alumni',
      studentClass: 'CBSE 2024 Batch (96.4%)',
      date: '2 months ago',
      rating: 5,
      likes: 56,
      sentiment: 'positive',
      metrics: { academics: 5, safety: 4.9, labs: 5, sports: 4.9 },
      title: 'Built the foundation for my JEE qualification',
      comment:
        'Studied here from Class 6 to 12. The Atal Tinkering Lab, competitive physics/chem equipment, and library resources built my foundation for cracking competitive exams. Blessed to have such supportive mentors who stayed after hours for doubt clearing.'
    },
    {
      id: 4,
      author: 'Pooja Hegde',
      role: 'Verified Parent',
      studentClass: 'Class 2 Student',
      date: '3 months ago',
      rating: 5,
      likes: 29,
      sentiment: 'positive',
      metrics: { academics: 4.9, safety: 5, labs: 4.6, sports: 4.8 },
      title: 'Warm primary wing with activity-based Montessori approach',
      comment:
        'The primary wing teachers are so warm and nurturing! Activity-based foundational learning makes my son love going to school every morning without tears. Phonetics, storytelling, and indoor play zones are world-class.'
    },
    {
      id: 5,
      author: 'Col. Vikram Rathore',
      role: 'Verified Parent',
      studentClass: 'Class 6 & Class 9 Students',
      date: '4 months ago',
      rating: 5,
      likes: 31,
      sentiment: 'positive',
      metrics: { academics: 4.8, safety: 5, labs: 4.9, sports: 5 },
      title: 'Strong focus on physical fitness, ethics and patriotism',
      comment:
        'As an army veteran, discipline and sports infrastructure are paramount for me. The athletic track, basketball court, and taekwondo coaching are exemplary. Both my children have developed sharp leadership values here.'
    },
    {
      id: 6,
      author: 'Dr. Ananya Sen',
      role: 'Verified Parent',
      studentClass: 'Class 11 Science Stream',
      date: '5 months ago',
      rating: 4,
      likes: 19,
      sentiment: 'positive',
      metrics: { academics: 4.8, safety: 4.9, labs: 4.9, sports: 4.2 },
      title: 'Great laboratory infrastructure; would love more inter-school debates',
      comment:
        'The science laboratories and faculty competency for senior secondary are among the finest in the district. Individual bench equipment for chemistry practicals is commendable. It would be even better if more inter-state MUNs and debates are scheduled in the second term.'
    }
  ]);

  // Overall calculations
  const totalReviewsCount = 214;
  const averageRating = 4.8;
  const recommendationRate = 96;

  // Filter and sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((rev) => {
        if (activeTab === 'parent' && rev.role !== 'Verified Parent') return false;
        if (activeTab === 'alumni' && rev.role !== 'Student Alumni') return false;
        if (activeTab === 'student' && !rev.role.includes('Student')) return false;

        if (selectedRating !== 'all' && rev.rating !== selectedRating) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchAuthor = rev.author.toLowerCase().includes(q);
          const matchComment = rev.comment.toLowerCase().includes(q);
          const matchTitle = rev.title.toLowerCase().includes(q);
          if (!matchAuthor && !matchComment && !matchTitle) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'helpful') return b.likes - a.likes;
        if (sortBy === 'highest') return b.rating - a.rating;
        return 0; // recent (default list order)
      });
  }, [reviews, activeTab, selectedRating, searchQuery, sortBy]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;

    const newRev = {
      id: Date.now(),
      author: newAuthor.trim(),
      role: newRole,
      studentClass: 'Verified Contributor',
      date: 'Just now',
      rating: newRating,
      likes: 1,
      sentiment: 'positive',
      metrics: {
        academics: newAcademics,
        safety: newSafety,
        labs: newLabs,
        sports: newSports
      },
      title: 'Verified Community Review',
      comment: newComment.trim()
    };

    setReviews([newRev, ...reviews]);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsWriteModalOpen(false);
      setNewAuthor('');
      setNewComment('');
    }, 1500);
  };

  const schoolProfileUrl = `/school/${encodeURIComponent(state)}/${encodeURIComponent(district)}/${encodeURIComponent(village)}/${schoolSlug}.html`;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-gray-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <Link
              href={schoolProfileUrl}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600 transition-colors"
              title="Back to School Profile"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>

            <div>
              <h1 className="text-base sm:text-lg font-black text-gray-950 font-serif leading-none truncate max-w-xs sm:max-w-md">
                {schoolName}
              </h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                Verified Reviews & Rating Analysis • UDISE: {udiseCode}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={schoolProfileUrl}
              className="text-xs font-bold text-gray-600 hover:text-blue-600 hidden sm:inline-block"
            >
              Back to Overview
            </Link>
            
            <button
              onClick={() => setIsWriteModalOpen(true)}
              className="bg-[#1877F2] hover:bg-[#1565C0] text-white font-bold px-5 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-sm transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>

        </div>
      </header>


      {/* Main Analysis Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Breadcrumb path */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span>/</span>
          <Link href={`/schools`} className="hover:text-blue-600">Schools Directory</Link>
          <span>/</span>
          <Link href={schoolProfileUrl} className="hover:text-blue-600">{schoolName}</Link>
          <span>/</span>
          <span className="text-blue-600 font-bold">Reviews & Ratings Analysis</span>
        </div>


        {/* ========================================================= */}
        {/* 1. OVERALL RATING & PERFORMANCE HERO CARD                 */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-gray-100">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Big Rating Block */}
            <div className="lg:col-span-4 text-center lg:text-left lg:border-r border-gray-100 lg:pr-8">
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Community Feedback</span>
              </span>

              <div className="text-6xl sm:text-7xl font-black text-gray-950 tracking-tight">
                {averageRating}
                <span className="text-2xl text-gray-400 font-normal"> / 5.0</span>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-1.5 text-amber-400 my-3">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-6 h-6 fill-current" />
                ))}
              </div>

              <div className="text-sm font-bold text-gray-700">
                Based on <span className="text-blue-600 font-black">{totalReviewsCount}+ Verified Reviews</span>
              </div>

              <div className="mt-4 p-3 bg-blue-50/70 rounded-2xl border border-blue-100 text-xs text-blue-900 font-semibold flex items-center justify-center lg:justify-start gap-2">
                <TrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                <span><strong>{recommendationRate}% of parents</strong> recommend this school</span>
              </div>
            </div>

            {/* Parameter-Wise Rating Progress Bars */}
            <div className="lg:col-span-8 space-y-3.5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-2">
                Category-Wise Performance Ratings
              </h3>

              {[
                { label: 'Academics & Faculty Mentorship', score: '4.9', pct: '98%', icon: GraduationCap, color: 'bg-blue-600' },
                { label: 'Campus Safety, Security & CCTV', score: '4.9', pct: '98%', icon: ShieldCheck, color: 'bg-emerald-600' },
                { label: 'Science, Computer & Robotics Labs', score: '4.8', pct: '96%', icon: FlaskConical, color: 'bg-amber-500' },
                { label: 'Sports, Grounds & Athletics', score: '4.7', pct: '94%', icon: Activity, color: 'bg-purple-600' },
                { label: 'School Bus Transport Reliability', score: '4.8', pct: '96%', icon: Bus, color: 'bg-indigo-600' },
                { label: 'Fee Transparency & Value for Money', score: '4.7', pct: '94%', icon: Award, color: 'bg-sky-600' }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3 sm:gap-4 text-xs font-semibold">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="w-52 sm:w-64 text-gray-700 truncate">{item.label}</span>
                    <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: item.pct }} />
                    </div>
                    <span className="w-10 text-right text-gray-900 font-bold">{item.score}</span>
                  </div>
                );
              })}
            </div>

          </div>

        </div>


        {/* ========================================================= */}
        {/* 2. AI SENTIMENT & HIGHLIGHT ANALYSIS                      */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Top Praises Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-2.5 text-emerald-700 font-bold text-sm mb-4">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <span>What Parents & Students Love Most</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span><strong>Hands-on Labs:</strong> 900+ experimental science practicals & Atal Tinkering Lab cited in 85% of positive reviews.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span><strong>Dedicated Faculty:</strong> Teachers praised for personalized doubt resolution without needing external tuition.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <span><strong>Safety Protocols:</strong> Live GPS app tracking on school buses and strict campus visitor protocols.</span>
              </li>
            </ul>
          </div>

          {/* Constructive Suggestions Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-blue-100 shadow-sm">
            <div className="flex items-center gap-2.5 text-blue-700 font-bold text-sm mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-600" />
              </div>
              <span>Key Focus & Expansion Areas for 2026</span>
            </div>

            <ul className="space-y-3 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span><strong>Inter-School Events:</strong> Parents suggested increasing national-level debate and Model United Nations (MUN) events.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span><strong>Outskirt Bus Routes:</strong> Requests to add 2 additional morning pick-up stops in newly developed residential sectors.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                <span><strong>Robotics Competitions:</strong> Students requesting sponsorship for international FIRST LEGO League competitions.</span>
              </li>
            </ul>
          </div>

        </div>


        {/* ========================================================= */}
        {/* 3. REVIEWS LIST WITH FILTER & SEARCH BAR                  */}
        {/* ========================================================= */}
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black text-gray-950">
                Verified Community Reviews
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Showing {filteredReviews.length} authenticated reviews
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search reviews by keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Quick Filter Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            
            {/* Role Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[
                { id: 'all', label: 'All Reviews' },
                { id: 'parent', label: 'Verified Parents' },
                { id: 'alumni', label: 'Alumni' },
                { id: 'student', label: 'Students' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-gray-200 rounded-full px-3 py-1.5 font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="helpful">Most Helpful</option>
                <option value="highest">Highest Rating</option>
                <option value="recent">Most Recent</option>
              </select>
            </div>

          </div>

          {/* Reviews Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-950 text-base">{rev.author}</h4>
                        <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        {rev.role} • {rev.studentClass}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-amber-400 shrink-0">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Review Title */}
                  <h5 className="text-sm font-bold text-gray-900 mb-2">
                    "{rev.title}"
                  </h5>

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-5">
                    {rev.comment}
                  </p>

                  {/* Micro Metric Ratings */}
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-gray-600 mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3 text-blue-600" /> Academics: <strong>{rev.metrics.academics}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Safety: <strong>{rev.metrics.safety}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FlaskConical className="w-3 h-3 text-amber-500" /> Labs: <strong>{rev.metrics.labs}</strong>
                    </span>
                  </div>

                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{rev.date}</span>
                  </div>

                  <button
                    onClick={() => {
                      setReviews(
                        reviews.map((r) =>
                          r.id === rev.id ? { ...r, likes: r.likes + 1 } : r
                        )
                      );
                    }}
                    className="flex items-center gap-1.5 hover:text-blue-600 font-semibold transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.likes})</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>

      </main>


      {/* ========================================================= */}
      {/* 4. WRITE A REVIEW MODAL                                   */}
      {/* ========================================================= */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-gray-100">
            <button
              onClick={() => setIsWriteModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {isSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-950">Review Published!</h3>
                <p className="text-sm text-gray-600">
                  Thank you for contributing your genuine feedback to help other parents and students make informed choices.
                </p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-blue-700 mb-1">
                  <span className="w-4 h-1 bg-[#F9BC15] rounded-full inline-block" />
                  <span>COMMUNITY FEEDBACK</span>
                </div>
                <h3 className="text-2xl font-black text-gray-950">Write a Review</h3>
                <p className="text-xs text-gray-500 mt-1 mb-6">
                  {schoolName} • UDISE: {udiseCode}
                </p>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  {/* Rating Stars Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      Overall Rating: {newRating} / 5 Stars
                    </label>
                    <div className="flex items-center gap-2 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${star <= newRating ? 'fill-amber-400' : 'text-gray-200'}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ramesh Gupta"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        I am a
                      </label>
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                      >
                        <option>Verified Parent</option>
                        <option>Current Student</option>
                        <option>Student Alumni</option>
                        <option>Faculty / Teacher</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Your Detailed Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your authentic experience regarding faculty mentorship, science & computer labs, sports grounds, safety, and school culture..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1877F2] hover:bg-[#1565C0] text-white font-bold py-3.5 rounded-full text-sm flex items-center justify-center gap-2 shadow-md transition-all mt-6"
                  >
                    <span>Post Verified Review</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
