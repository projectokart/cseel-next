'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Globe, 
  Sparkles, 
  Image as ImageIcon, 
  CheckCircle2, 
  Eye, 
  Layout, 
  Edit3, 
  Trash2, 
  Search, 
  ExternalLink, 
  Save, 
  X, 
  Clock, 
  User, 
  Tag, 
  UploadCloud,
  Check,
  Bot,
  Wand2,
  BookOpen,
  Code,
  Layers
} from 'lucide-react';
import { ALL_BLOGS, BlogPostItem } from '@/lib/blogsData';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export const ContentAdminModule: React.FC = () => {
  const { addAuditLog } = useAdminAuth();
  const [blogs, setBlogs] = useState<BlogPostItem[]>(ALL_BLOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPostItem | null>(null);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'NEP 2020 & Pedagogy',
    summary: '',
    readTime: '6 min read',
    authorName: 'CSEEL Academic Council',
    coverImage: 'https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif',
    content: ''
  });

  const categories = ['All', 'NEP 2020 & Pedagogy', 'Physics', 'Chemistry', 'Biology', 'Robotics, IoT & ATL'];

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingBlog(null);
    setActiveTab('edit');
    setFormData({
      title: '',
      slug: '',
      category: 'NEP 2020 & Pedagogy',
      summary: '',
      readTime: '6 min read',
      authorName: 'CSEEL Academic Council',
      coverImage: 'https://cdn.prod.website-files.com/63105b5082760e06eb992f00/66bf944f3df098f183b92727_Lab-Scientists-Beakers-edit.avif',
      content: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (blog: BlogPostItem) => {
    setEditingBlog(blog);
    setActiveTab('edit');
    setFormData({
      title: blog.title,
      slug: blog.slug,
      category: blog.category,
      summary: blog.summary,
      readTime: blog.readTime,
      authorName: blog.author.name,
      coverImage: blog.coverImage,
      content: typeof blog.content === 'string' ? blog.content : Array.isArray(blog.content) ? (blog.content as string[]).join('\n\n') : ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete blog: "${title}"?`)) {
      setBlogs(prev => prev.filter(b => b.id !== id));
      addAuditLog('DELETED_BLOG_POST', 'content_homepage', `Deleted blog post: ${title}`);
      showToast(`Article "${title}" removed successfully!`);
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editingBlog ? prev.slug : generatedSlug
    }));
  };

  // AI 1-Click Custom Blog Post Generator
  const handleAiAutoGenerate = () => {
    const topic = formData.title.trim() || prompt('Enter blog topic / keyword for AI generation:', 'Building an ESP32 Smart Solar Plant for Schools');
    if (!topic) return;

    setIsGeneratingAi(true);

    setTimeout(() => {
      const generatedSlug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      
      const aiTemplates: Record<string, { cat: string; img: string; time: string; summary: string; content: string }> = {
        default: {
          cat: 'Robotics, IoT & ATL',
          img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop',
          time: '7 min read',
          summary: `Comprehensive guide to implementing ${topic} in school science and innovation labs under NEP 2020 experiential learning mandates.`,
          content: `## Introduction to ${topic}

In modern STEM and Atal Tinkering Labs, bridging theoretical science with tactile, hands-on application is essential. ${topic} provides students with a real-world problem-solving framework that enhances critical thinking and technological confidence.

### 1. Conceptual Framework & Pedagogy
Under the National Education Policy (NEP 2020), experiential learning prioritizes active experimentation over passive memorization. By building this project, learners explore the interplay between electronic sensors, algorithmic logic, and mechanical design.

### 2. Required Hardware & Laboratory Components
- Microcontroller Unit (Arduino UNO / ESP32)
- Sensor Interface Shield & Active Transducers
- Regulated 5V/12V DC Power Supply Module
- Breadboard & Jumper Wire Interconnects
- Mechanical Prototyping Chassis / 3D-Printed Enclosure

### 3. Step-by-Step Implementation Procedure
1. **Circuit Schematic Setup**: Connect sensor breakout pins to analog/digital GPIOs following the ESD safety protocol.
2. **Firmware Programming**: Flash the microcontroller with structured C++/Python firmware to read real-time telemetry.
3. **Calibration & Threshold Tuning**: Test under controlled laboratory environmental conditions to calibrate baseline noise.
4. **Data Telemetry & Logging**: Stream real-time metrics to an IoT dashboard or local serial monitor for graph analysis.

### 4. Learning Outcomes & CBSE Skill Mapping
Students gain foundational competence in circuit analysis, closed-loop feedback algorithms, and sustainable engineering design. This project directly maps to CBSE Skill Subjects and national science exhibition evaluation rubrics.`
        }
      };

      const template = aiTemplates.default;

      setFormData({
        title: topic.startsWith('How') || topic.startsWith('Building') ? topic : `How to Implement ${topic}: A Complete Hands-On Lab Guide`,
        slug: generatedSlug,
        category: formData.category || template.cat,
        summary: template.summary,
        readTime: template.time,
        authorName: 'CSEEL AI & Innovation Team',
        coverImage: template.img,
        content: template.content
      });

      setIsGeneratingAi(false);
      showToast('AI Blog Draft Generated! You can customize and publish now.');
    }, 800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBlog) {
      // Update
      setBlogs(prev => prev.map(b => b.id === editingBlog.id ? {
        ...b,
        title: formData.title,
        slug: formData.slug || b.slug,
        category: formData.category,
        summary: formData.summary,
        readTime: formData.readTime,
        coverImage: formData.coverImage,
        author: { ...b.author, name: formData.authorName },
        content: formData.content || b.content
      } : b));
      addAuditLog('EDITED_BLOG_POST', 'content_homepage', `Updated blog post: ${formData.title}`);
      showToast(`Article "${formData.title}" updated successfully!`);
    } else {
      // Create
      const newPost: BlogPostItem = {
        id: `blog-custom-${Date.now()}`,
        title: formData.title,
        slug: formData.slug || `post-${Date.now()}`,
        category: formData.category,
        summary: formData.summary,
        readTime: formData.readTime,
        publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        coverImage: formData.coverImage,
        author: {
          name: formData.authorName,
          role: 'Contributing Science Educator',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
        },
        content: formData.content || formData.summary,
        tags: [formData.category, 'Science Education', 'CSEEL India']
      };
      setBlogs([newPost, ...blogs]);
      addAuditLog('CREATED_BLOG_POST', 'content_homepage', `Published new custom blog: ${formData.title}`);
      showToast(`Custom article "${formData.title}" published successfully!`);
    }

    setIsModalOpen(false);
  };

  const filteredBlogs = blogs.filter(b => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── HEADER & ACTIONS ── */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 border border-sky-200 rounded-full text-xs font-black text-sky-700">
            <Globe className="w-3.5 h-3.5" />
            <span>CUSTOM BLOG STUDIO & CMS DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            Custom Blog Creator & Manager
          </h2>
          <p className="text-xs text-gray-500 max-w-2xl">
            Aap yahan custom blog posts bana sakte hain, AI se 1-click me draft generate kar sakte hain, edit kar sakte hain, aur publish kar sakte hain.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <a
            href="https://www.sanity.io/manage/project/zd78utwr"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            <span>Sanity Cloud Studio</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Custom Blog</span>
          </button>
        </div>
      </div>

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search blogs by title, keywords, or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="text-xs text-gray-500 font-semibold">
            Showing <span className="font-bold text-gray-900">{filteredBlogs.length}</span> of {blogs.length} articles
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── BLOG POSTS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBlogs.map((b) => (
          <div 
            key={b.id} 
            className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Cover Image Thumbnail */}
            <div className="h-40 w-full overflow-hidden relative bg-slate-100">
              <img
                src={b.coverImage}
                alt={b.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-2.5 left-2.5 text-[10px] font-black uppercase text-sky-800 bg-white/95 backdrop-blur-xs px-2.5 py-0.5 rounded-full shadow-xs border border-sky-200">
                {b.category}
              </span>
            </div>

            <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 mb-1.5">
                  {b.title}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {b.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] text-gray-400">
                  <span className="flex items-center gap-1 font-medium text-gray-700">
                    <User className="w-3 h-3 text-sky-600" /> {b.author.name}
                  </span>
                  <span>{b.readTime}</span>
                </div>

                {/* Actions: View, Edit, Delete */}
                <div className="flex items-center justify-between pt-1">
                  <a
                    href={`/blog/${b.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <span>Read</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(b)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                      title="Edit Article"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── CREATE / EDIT CUSTOM BLOG MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">
                    {editingBlog ? 'Edit Custom Blog Post' : 'Create Custom Blog Post'}
                  </h3>
                  <p className="text-xs text-gray-500">
                    Full custom markdown editor with AI auto-draft generator & live preview
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* AI Generate Button */}
                <button
                  type="button"
                  onClick={handleAiAutoGenerate}
                  disabled={isGeneratingAi}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:from-purple-500 hover:to-indigo-500 transition-all flex items-center gap-1.5 shadow-sm"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>{isGeneratingAi ? 'Generating Draft...' : 'AI Auto-Draft'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Tab Switcher */}
            <div className="flex border-b border-gray-200 px-6 bg-slate-50/50">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'edit'
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editor & Settings</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                  activeTab === 'preview'
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Reader Preview</span>
              </button>
            </div>

            {/* Modal Form Body */}
            {activeTab === 'edit' ? (
              <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Building an Autonomous Line Follower Robot for CBSE Science Exhibition"
                    value={formData.title}
                    onChange={handleTitleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none font-semibold text-gray-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. building-line-follower-robot"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category / Discipline *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none bg-white"
                    >
                      <option>NEP 2020 & Pedagogy</option>
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Biology</option>
                      <option>Robotics, IoT & ATL</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Author Name</label>
                    <input
                      type="text"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Estimated Read Time</label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Article Summary / Excerpt *</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief 2-line summary of the blog post for SEO cards..."
                    value={formData.summary}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-bold text-gray-700 uppercase">
                      Full Article Body (Markdown supported)
                    </label>
                    <span className="text-[11px] text-gray-400">Headings, lists & code blocks supported</span>
                  </div>
                  <textarea
                    rows={8}
                    placeholder="Write or paste your custom blog markdown content here..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs font-mono focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md flex items-center gap-2"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{editingBlog ? 'Save Changes' : 'Publish Custom Blog'}</span>
                  </button>
                </div>
              </form>
            ) : (
              /* Live Preview Tab */
              <div className="overflow-y-auto p-6 space-y-6 flex-1 bg-slate-50/60">
                <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-xs space-y-4">
                  <div className="h-52 rounded-xl overflow-hidden bg-slate-100 relative">
                    <img src={formData.coverImage} alt="" className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-sky-800 border border-sky-200">
                      {formData.category}
                    </span>
                  </div>

                  <h1 className="text-2xl font-black text-gray-900 leading-tight">
                    {formData.title || 'Untitled Blog Post'}
                  </h1>

                  <div className="flex items-center gap-4 text-xs text-gray-500 border-b border-gray-100 pb-4">
                    <span className="font-semibold text-gray-800">{formData.authorName}</span>
                    <span>•</span>
                    <span>{formData.readTime}</span>
                    <span>•</span>
                    <span className="text-emerald-600 font-bold">Live Preview</span>
                  </div>

                  <p className="text-sm font-medium text-gray-600 italic bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                    "{formData.summary || 'Summary preview will appear here...'}"
                  </p>

                  <div className="prose prose-sm max-w-none text-xs text-gray-700 whitespace-pre-wrap leading-relaxed space-y-3">
                    {formData.content || 'Write in the editor tab to see full formatted preview here.'}
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('edit')}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 bg-white"
                  >
                    Back to Edit
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="px-6 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md"
                  >
                    Confirm & Publish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentAdminModule;
